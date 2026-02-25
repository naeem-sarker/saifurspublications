"use server"

import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import sharp from "sharp";

export const createAuthor = async (formData: FormData) => {
    try {
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;
        const description = formData.get("description") as string;
        const isActive = formData.get("isActive") === "true";
        const file = formData.get("image") as File;

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

        let dbImagePath = "";

        if (file && file.size > 0) {
            if (!file.type.startsWith("image/")) {
                return {
                    success: false,
                    message: "Uploaded file must be an image"
                }
            }

            const maxSize = 2 * 1024 * 1024;
            if (file.size > maxSize) {
                return {
                    success: false,
                    message: "Image size must be less than 2MB"
                }
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), "public/uploads/authors");
            await mkdir(uploadDir, { recursive: true });

            const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}.webp`;
            const filePath = path.join(uploadDir, fileName);

            const compressedBuffer = await sharp(buffer)
                .resize(500, 500, { fit: "cover" })
                .webp({ quality: 80 })
                .toBuffer();

            await writeFile(filePath, compressedBuffer);

            dbImagePath = `/uploads/authors/${fileName}`;
        }

        await prisma.author.create({
            data: {
                name,
                slug,
                description,
                isActive,
                avatarUrl: dbImagePath
            }
        })

        revalidatePath("/admin/authors")

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
        const authors = await prisma.author.findMany({ orderBy: { createdAt: "desc" } })

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

export const getAuthroBySlug = async (slug: string) => {
    try {
        const author = await prisma.author.findUnique({
            where: { id: slug }
        })

        if (!author) {
            return {
                success: false,
                message: "Author not found"
            }
        }

        return {
            success: true,
            data: author
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Failed to fetch author"
        }
    }
}

export const getPublicAuthors = async () => {
    try {
        const authors = await prisma.author.findMany({
            where: {
                isActive: true
            },
            orderBy: { createdAt: "desc" }
        })

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

export const updateAuthor = async (id: string, formData: FormData) => {
    try {
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;
        const description = formData.get("description") as string;
        const isActive = formData.get("isActive") === "true";
        const file = formData.get("image") as File;

        const currentAuthor = await prisma.author.findUnique({
            where: { id }
        });

        if (!currentAuthor) return { success: false, message: "Author not found" };

        if (!name || !slug) {
            return {
                success: false,
                message: "Name and slug are required"
            }
        }

        const existingSlug = await prisma.author.findUnique({
            where: {
                slug: slug
            }
        })

        if (existingSlug && existingSlug.id !== id) {
            return {
                success: false,
                message: "Author with this slug already exists"
            }
        }

        let dbImagePath = currentAuthor.avatarUrl;

        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), "public/uploads/authors");
            await mkdir(uploadDir, { recursive: true });

            const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}.webp`;
            const filePath = path.join(uploadDir, fileName);

            await sharp(buffer)
                .resize(500, 500, { fit: "cover" })
                .webp({ quality: 80 })
                .toBuffer()
                .then(data => writeFile(filePath, data));

            dbImagePath = `/uploads/authors/${fileName}`;

            if (currentAuthor.avatarUrl) {
                const oldPath = path.join(process.cwd(), "public", currentAuthor.avatarUrl);
                await unlink(oldPath).catch(err => console.log("Old file not found, skipping delete"));
            }
        }

        await prisma.author.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                isActive,
                avatarUrl: dbImagePath
            }
        });

        revalidatePath("/admin/authors");
        return { success: true, message: "Author updated successfully" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}