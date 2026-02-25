"use server"

import prisma from "@/lib/prisma";

export const createAuthor = async (data) => {
    try {
        const { name, slug, description } = data;

        if (!name || !slug) {
            return {
                success: false,
                message: "Name and slug are required"
            }
        }

        const existingAuthor = await prisma.author.findUnique({
            where: {
                slug: slug
            }
        })

        if (existingAuthor) {
            return {
                success: false,
                message: "Author with this slug already exists"
            }
        }

        const author = await prisma.author.create({
            data: {
                name,
                slug,
                description
            }
        })

        if (!author) {
            return {
                success: false,
                message: "Failed to create author"
            }
        }

        return {
            success: true,
            message: "Author created successfully",
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "An error occurred while creating the author"
        }
    }
}

export const getAuthors = async () => {
    try {
        const authors = await prisma.author.findMany()

        return {
            success: true,
            data: authors
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Failed to fetch authors"
        }
    }
}