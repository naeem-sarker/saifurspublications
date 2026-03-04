"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/heros");

const ensureDir = async () => {
    try {
        await fs.access(UPLOAD_DIR);
    } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }
};

export async function upsertHero(formData: FormData) {
    try {
        await ensureDir();

        const id = formData.get("id") as string | null;
        const title = formData.get("title") as string;
        const url = formData.get("url") as string;
        const isActive = formData.get("isActive") === "true";
        const file = formData.get("image") as File | null;

        let imagePath = formData.get("oldImagePath") as string || "";

        if (file && file.size > 0) {
            if (imagePath) {
                const oldFullSizePath = path.join(process.cwd(), "public", imagePath);
                await fs.unlink(oldFullSizePath).catch(() => { });
            }

            const fileName = `${Date.now()}-${file.name}`;
            const buffer = Buffer.from(await file.arrayBuffer());
            await fs.writeFile(path.join(UPLOAD_DIR, fileName), buffer);
            imagePath = `/uploads/heros/${fileName}`;
        }

        if (id) {
            await prisma.hero.update({
                where: { id },
                data: { image: imagePath, url, isActive },
            });
        } else {
            await prisma.hero.create({
                data: { title, image: imagePath, url, isActive },
            });
        }

        revalidatePath("/admin/heros");
        return { success: true };
    } catch (error) {
        console.log(error)
    }
}

export async function deleteHero(id: string, imagePath: string) {
    const fullPath = path.join(process.cwd(), "public", imagePath);
    await fs.unlink(fullPath).catch(() => { });

    await prisma.hero.delete({ where: { id } });

    revalidatePath("/admin/heros");
    return { success: true };
}

export const getHeros = async () => {
    try {
        const heros = await prisma.hero.findMany();

        return {
            success: false,
            data: heros
        }
    } catch (error) {

    }
}

export const getHerosFromPublic = async () => {
    try {
        const heros = await prisma.hero.findMany({
            where: {
                isActive: true
            }, orderBy: {
                "createdAt": 'desc'
            },
            select: {
                id: true,
                image: true,
                url: true
            }
        })

        return {
            success: true,
            data: heros
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal Server Error"
        }
    }
}