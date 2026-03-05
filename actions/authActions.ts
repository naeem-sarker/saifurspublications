"use server"

import { cookies } from "next/headers";
import type { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth } from "@/lib/firebase/firebase-admin";
import prisma from "@/lib/prisma";
import { syncUserWithDB } from "./userActions";

export async function getSession(): Promise<DecodedIdToken | null> {
    const cookieStore = await cookies();
    const session = cookieStore.get("__session")?.value;

    if (!session) return null;

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(session, true);

        return decodedClaims;
    } catch {
        return null;
    }
}

export async function createSession(idToken: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const firebaseUid = decodedToken.uid;

        let user = await prisma.user.findUnique({
            where: { uid: firebaseUid },
        });

        const { uid, email, name, picture } = decodedToken;

        if (!user) {
            user = await syncUserWithDB({ uid, email, name, picture })
        }

        await adminAuth.setCustomUserClaims(firebaseUid, { role: user.role });

        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

        const cookieStore = await cookies();
        cookieStore.set("__session", sessionCookie, {
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
        });

        return { success: true, role: user.role };
    } catch (error) {
        console.error("Auth Error:", error);
        return { success: false, message: "Authentication failed" };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    const session = cookieStore.get("__session")?.value;

    if (session) {
        try {
            const decodedToken = await adminAuth.verifySessionCookie(session);

            await adminAuth.revokeRefreshTokens(decodedToken.uid);
        } catch (e) {

        }
    }

    cookieStore.delete("__session");
}