"use server"

import prisma from "@/lib/prisma";

export const syncUserWithDB = async (firebaseUser) => {
    try {
        const { uid, email, displayName, photoUrl } = firebaseUser;

        const user = await prisma.user.upsert({
            where: { uid: uid },
            update: {
                name: displayName,
                image: photoUrl
            },
            create: {
                uid: uid,
                email: email,
                name: displayName,
                image: photoUrl,
                role: "USER"
            }
        })

        return user;
    } catch (error) {
        console.log(error)
    }
}