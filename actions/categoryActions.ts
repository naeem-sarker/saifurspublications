"use server"

import prisma from "@/lib/prisma";

export const createCategory = async (data) => {
    console.log(data)
    try {
        const { name, slug } = data;

        if (!name || !slug) {
            return {
                success: false,
                message: "Name and slug are required"
            }
        }

        const existingCategory = await prisma.category.findUnique({
            where: {
                slug: slug
            }
        })

        if (existingCategory) {
            return {
                success: false,
                message: "Category with this slug already exists"
            }
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug
            }
        })

        if (!category) {
            return {
                success: false,
                message: "Failed to create category"
            }
        }

        return {
            success: true,
            message: "Category created successfully",
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "An error occurred while creating the category"
        }
    }
}

export const getCategories = async () => {
    try {
        const categories = await prisma.category.findMany()

        return {
            success: true,
            data: categories
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Failed to fetch categories"
        }
    }
}