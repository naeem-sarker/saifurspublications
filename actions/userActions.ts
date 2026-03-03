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

export const getUsers = async (page: number = 1, limit: number = 10) => {
    try {
        console.log(page, limit)
        const SAFE_LIMIT = Math.min(Math.max(1, limit), 50);

        const totalCount = await prisma.user.count();
        const totalPages = Math.ceil(totalCount / SAFE_LIMIT) || 1;

        let currentPage = Math.max(1, page);
        if (currentPage > totalPages) currentPage = totalPages;

        const skip = (currentPage - 1) * SAFE_LIMIT;

        const users = await prisma.user.findMany({
            skip,
            take: SAFE_LIMIT,
            orderBy: { createdAt: "desc" }
        });

        return {
            success: true,
            data: users,
            meta: {
                totalCount,
                totalPages,
                currentPage
            }
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal Server Error"
        }
    }
}