'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createOrderAction(formData: any, data) {
    try {
        const { name, phone, address } = formData;

        let user = await prisma.user.findUnique({
            where: { phone: phone }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: name,
                    phone: phone,
                    address: address,
                    role: 'USER',
                }
            });
        }

        const d = data?.deliveryCharge || 60;
        const p = data.regularPrice + d;
        const items = [
            data
        ]

        console.log(items)

        const newOrder = await prisma.order.create({
            data: {
                userId: user.id,
                totalAmount: p,
                deliveryCharge: d,
                shippingAddress: address,
                status: 'PENDING',

                orderItems: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: 1,
                        price: item.regularPrice
                    }))
                }
            }
        });

        revalidatePath('/profile/orders');

        return {
            success: true,
            message: "অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!",
            orderId: newOrder.id
        };

    } catch (error: any) {
        console.error("Order Error:", error);
        return {
            success: false,
            message: "দুঃখিত, অর্ডারটি সম্পন্ন করা সম্ভব হয়নি।"
        };
    }
}

export const getOrders = async (page: number = 1, limit: number = 10) => {
    try {
        const SAFE_LIMIT = Math.min(Math.max(1, limit), 50);

        const totalCount = await prisma.author.count();
        const totalPages = Math.ceil(totalCount / SAFE_LIMIT) || 1;

        let currentPage = Math.max(1, page);
        if (currentPage > totalPages) currentPage = totalPages;

        const skip = (currentPage - 1) * SAFE_LIMIT;

        const authors = await prisma.order.findMany({
            skip: skip,
            take: SAFE_LIMIT,
            include: {
                user: {
                    select: {
                        name: true,
                        phone: true,
                    }
                },
                orderItems: true
            },
            orderBy: { createdAt: 'desc' },
        });

        return {
            success: true,
            data: authors,
            meta: {
                totalCount,
                totalPages,
                currentPage
            }
        };
    } catch (error) {
        console.error("Critical Error:", error);
        return { success: false, message: "Internal Server Error" };
    }
}

export const getOrderBySlug = async (id: string) => {
    try {
        // ১. আগে অর্ডার এবং আইটেমগুলো নিয়ে আসা
        const order = await prisma.order.findUnique({
            where: { id: id },
            include: {
                user: true,
                orderItems: true // এখানে শুধু productId আসবে, product details আসবে না
            }
        });

        if (!order) return { success: false, message: 'Order not found' };

        // ২. সব আইটেমের productId গুলোর একটি লিস্ট করা
        const productIds = order.orderItems.map(item => item.productId);

        // ৩. Product টেবিল থেকে ঐ আইডিগুলোর নাম এবং ইমেজ একবারে নিয়ে আসা
        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds }
            },
            select: {
                id: true,
                name: true,
                coverImg: true
            }
        });

        // ৪. অর্ডার আইটেমগুলোর সাথে প্রোডাক্টের তথ্য মিলিয়ে দেওয়া (Map করা)
        const orderWithProducts = {
            ...order,
            orderItems: order.orderItems.map(item => ({
                ...item,
                product: products.find(p => p.id === item.productId) // ম্যানুয়ালি কানেক্ট করা
            }))
        };

        return {
            success: true,
            data: orderWithProducts
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Internal Server Error' };
    }
}

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus as any }
        });
        revalidatePath(`/admin/orders/view/${orderId}`);
        return { success: true };
    } catch (error) {
        return { success: false, message: "Update failed" };
    }
}

export const addItemToOrder = async (orderId: string, productId: string, quantity: number = 1) => {
    try {
        // ১. প্রোডাক্টের দাম বের করা
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { salePrice: true, regularPrice: true }
        });

        if (!product) throw new Error("Product not found");

        const price = product.salePrice > 0 ? product.salePrice : product.regularPrice;
        const lineTotal = price * quantity;

        // ২. ট্রানজেকশন ব্যবহার করে আইটেম যোগ এবং টোটাল আপডেট একবারে করা
        await prisma.$transaction(async (tx) => {
            // আইটেম যোগ করা
            await tx.orderItem.create({
                data: {
                    orderId,
                    productId,
                    quantity,
                    price,
                }
            });

            // অর্ডারের totalAmount আপডেট করা
            await tx.order.update({
                where: { id: orderId },
                data: {
                    totalAmount: {
                        increment: lineTotal
                    }
                }
            });
        });

        revalidatePath(`/admin/orders/view/${orderId}`);
        return { success: true, message: "আইটেম যোগ করা হয়েছে" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export const updateOrderPricing = async (orderId: string, deliveryCharge: number, items: {id: string, price: number, quantity: number}[]) => {
    try {
        await prisma.$transaction(async (tx) => {
            // ১. প্রতিটি আইটেম আপডেট করা
            for (const item of items) {
                await tx.orderItem.update({
                    where: { id: item.id },
                    data: { price: item.price, quantity: item.quantity }
                });
            }

            // ২. নতুন টোটাল ক্যালকুলেট করা
            const subTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const newTotal = subTotal + deliveryCharge;

            // ৩. অর্ডার আপডেট করা
            await tx.order.update({
                where: { id: orderId },
                data: { 
                    deliveryCharge: deliveryCharge,
                    totalAmount: newTotal 
                }
            });
        });

        revalidatePath(`/admin/orders/view/${orderId}`);
        return { success: true };
    } catch (error) {
        return { success: false, message: "Update failed" };
    }
}