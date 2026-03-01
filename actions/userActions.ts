"use server"

import prisma from "@/lib/prisma";

export const syncUserWithDB = async (firebaseUser) => {
    try {
        const { uid, email, name, picture } = firebaseUser;

        const user = await prisma.user.upsert({
            where: { uid: uid },
            update: {
                name: name,
                image: picture
            },
            create: {
                uid: uid,
                email: email,
                name: name,
                image: picture,
                role: "USER"
            }
        })

        return user;
    } catch (error) {
        console.log(error)
    }
}