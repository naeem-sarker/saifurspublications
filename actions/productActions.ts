"use server"

import prisma from "@/lib/prisma";
import { mkdir, unlink, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import path from "path";
import sharp from "sharp";

export const createProduct = async (formData: FormData) => {
    try {
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;
        const type = formData.get("type") as "BOOK" | "STATIONARY";

        const coverFile = formData.get("coverImg") as File;
        const pdfFile = formData.get("pdfUrl") as File;

        let coverPath = "";
        let pdfPath = "";

        const coverUploadDir = path.join(process.cwd(), "public/uploads/covers");
        const pdfUploadDir = path.join(process.cwd(), "public/uploads/pdf");

        await mkdir(coverUploadDir, { recursive: true });
        await mkdir(pdfUploadDir, { recursive: true });

        if (coverFile && coverFile.size > 0) {
            const buffer = Buffer.from(await coverFile.arrayBuffer());

            const seoFriendlyName = slug ? slug : coverFile.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
            const fileName = `${seoFriendlyName}-${Math.floor(Math.random() * 1000)}.webp`;

            await sharp(buffer)
                .webp({ quality: 80 })
                .toFile(path.join(coverUploadDir, fileName));

            coverPath = `/uploads/covers/${fileName}`;
        }

        if (pdfFile && pdfFile.size > 0) {
            const buffer = Buffer.from(await pdfFile.arrayBuffer());
            const seoFriendlyPdfName = slug
                ? `${slug}-pdf`
                : pdfFile.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
            const fileName = `${seoFriendlyPdfName}-${Date.now().toString().slice(-4)}.pdf`;

            await writeFile(path.join(pdfUploadDir, fileName), buffer);
            pdfPath = `/uploads/pdf/${fileName}`;
        }

        await prisma.product.create({
            data: {
                name,
                slug,
                type,
                regularPrice: Number(formData.get("regularPrice")),
                salePrice: Number(formData.get("salePrice")),
                discountRate: Number(formData.get("discountRate")),
                coverImg: coverPath,
                pdfUrl: pdfPath,
                isActive: formData.get("isActive") === "true",
                isFeatured: formData.get("isFeatured") === "true",
                isPopular: formData.get("isPopular") === "true",
                isStock: formData.get("isStock") === "true",
                isDeliveryFree: formData.get("isDeliveryFree") === "true",
                edition: formData.get("edition") as string,
                totalPage: Number(formData.get("totalPage")) || 0,
                authors: {
                    connect: JSON.parse(formData.get("authors") as string).map((id: string) => ({ id })),
                },
                categories: {
                    connect: JSON.parse(formData.get("categories") as string).map((id: string) => ({ id })),
                },
            },
        });

        revalidatePath("/admin/products");
        return { success: true, message: "Product Created Successfully" };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Internal Server Error"
        }
    }
}

export const getProducts = async (page: number = 1, limit: number = 10) => {
    try {
        const SAFE_LIMIT = Math.min(Math.max(1, limit), 50);

        const totalCount = await prisma.author.count();
        const totalPages = Math.ceil(totalCount / SAFE_LIMIT) || 1;

        let currentPage = Math.max(1, page);
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        const skip = (currentPage - 1) * SAFE_LIMIT;

        const products = await prisma.product.findMany({
            skip: skip,
            take: SAFE_LIMIT,
            select: {
                id: true,
                name: true,
                slug: true,
                isStock: true,
                regularPrice: true,
            },
            orderBy: { createdAt: 'desc' }
        });

        return {
            success: true,
            data: products,
            meta: {
                totalCount,
                totalPages,
                currentPage
            }
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Internal Server Error"
        }
    }
}

export const getProductsFromPublic = async (filterType: string, categorySlug: string) => {
    try {
        const query: Record<string, any> = {
            isActive: true
        };

        if (filterType) {
            query[filterType] = true;
        }

        if (categorySlug) {
            query.categories = {
                some: {
                    slug: categorySlug
                }
            };
        }

        const products = await prisma.product.findMany({ where: query });
        return {
            success: true,
            data: products
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal server error"
        }
    }
}

export const getProductBySlug = async (id: string) => {
    try {
        const product = await prisma.product.findUnique({ where: { id } });

        return {
            success: true,
            data: product
        }
    } catch (error) {
        console.log(error)
        return {
            success: true,
            message: "Internal Server Error"
        }
    }
}

export const updateProduct = async (id: string, formData: FormData) => {
    try {
        const existingProduct = await prisma.product.findUnique({
            where: { id },
        });

        if (!existingProduct) {
            return { success: false, message: "Product not found" };
        }

        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;

        const coverFile = formData.get("coverImg") as File;
        const pdfFile = formData.get("pdfUrl") as File;

        let coverPath = existingProduct.coverImg;
        let pdfPath = existingProduct.pdfUrl;

        // --- কভার ইমেজ আপডেট ও পুরোনো ফাইল ডিলিট ---
        if (coverFile && coverFile.size > 0 && typeof coverFile !== "string") {
            const buffer = Buffer.from(await coverFile.arrayBuffer());
            const seoFriendlyName = slug ? slug : name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
            const fileName = `${seoFriendlyName}-${Date.now().toString().slice(-4)}.webp`;

            const coverUploadDir = path.join(process.cwd(), "public/uploads/covers");
            await mkdir(coverUploadDir, { recursive: true });

            // নতুন ফাইল সেভ করা
            await sharp(buffer)
                .webp({ quality: 80 })
                .toFile(path.join(coverUploadDir, fileName));

            // পুরোনো ফাইলটি ডিলিট করা (যদি থাকে)
            if (existingProduct.coverImg) {
                const oldPath = path.join(process.cwd(), "public", existingProduct.coverImg);
                try {
                    await unlink(oldPath);
                } catch (err) {
                    console.log("Old cover file not found, skipping unlink.");
                }
            }

            coverPath = `/uploads/covers/${fileName}`;
        }

        // --- PDF আপডেট ও পুরোনো ফাইল ডিলিট ---
        if (pdfFile && pdfFile.size > 0 && typeof pdfFile !== "string") {
            const buffer = Buffer.from(await pdfFile.arrayBuffer());
            const seoFriendlyPdfName = slug ? `${slug}-pdf` : name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
            const fileName = `${seoFriendlyPdfName}-${Date.now().toString().slice(-4)}.pdf`;

            const pdfUploadDir = path.join(process.cwd(), "public/uploads/pdf");
            await mkdir(pdfUploadDir, { recursive: true });

            // নতুন PDF সেভ করা
            await writeFile(path.join(pdfUploadDir, fileName), buffer);

            // পুরোনো PDF ডিলিট করা (যদি থাকে)
            if (existingProduct.pdfUrl) {
                const oldPdfPath = path.join(process.cwd(), "public", existingProduct.pdfUrl);
                try {
                    await unlink(oldPdfPath);
                } catch (err) {
                    console.log("Old PDF file not found, skipping unlink.");
                }
            }

            pdfPath = `/uploads/pdf/${fileName}`;
        }

        // --- ডাটাবেজ আপডেট ---
        await prisma.product.update({
            where: { id },
            data: {
                name,
                slug,
                type: formData.get("type") as "BOOK" | "STATIONARY",
                regularPrice: Number(formData.get("regularPrice")),
                salePrice: Number(formData.get("salePrice")),
                discountRate: Number(formData.get("discountRate")),
                coverImg: coverPath,
                pdfUrl: pdfPath,
                isActive: formData.get("isActive") === "true",
                isFeatured: formData.get("isFeatured") === "true",
                isPopular: formData.get("isPopular") === "true",
                isStock: formData.get("isStock") === "true",
                isDeliveryFree: formData.get("isDeliveryFree") === "true",
                edition: formData.get("edition") as string,
                totalPage: Number(formData.get("totalPage")) || 0,
                authors: {
                    set: JSON.parse(formData.get("authors") as string || "[]").map((id: string) => ({ id })),
                },
                categories: {
                    set: JSON.parse(formData.get("categories") as string || "[]").map((id: string) => ({ id })),
                },
            },
        });

        revalidatePath("/admin/products");
        return { success: true, message: "Product Updated & Old Files Cleaned" };

    } catch (error) {
        console.error(error);
        return { success: false, message: "Internal Server Error" };
    }
};

export const getProductByPublic = async (slug: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { slug, isActive: true }, select: {
                name: true,
                slug: true,
                edition: true,
                totalPage: true,
                coverImg: true,
                pdfUrl: true,
                regularPrice: true,
                salePrice: true,
                discountRate: true,
                authors: {
                    select: {
                        name: true,
                        slug: true
                    }
                }
            }
        });

        return {
            success: true,
            data: product
        }
    } catch (error) {
        console.log(error)
        return {
            success: true,
            message: "Internal Server Error"
        }
    }
}