"use server"

import { writeFile, mkdir } from "fs/promises";
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
//     const file = formData.get("avatarUrl") as File;
//     if (!file) return { success: false, message: "No file uploaded" };

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     const uploadDir = path.join(process.cwd(), "public/uploads/authors");

//     try {
//         await mkdir(uploadDir, { recursive: true });
//     } catch (err) {
//         return { success: false, message: "Failed to create upload directory" };
//     }

//     const fileName = `${Date.now()}-${file.name}`;
//     const filePath = path.join(uploadDir, fileName);

//     await writeFile(filePath, buffer);

//     const dbPath = `/uploads/authors/${fileName}`;

//     return { success: true, url: dbPath };
// };