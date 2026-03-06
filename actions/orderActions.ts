'use server';

import prisma from '@/lib/prisma';
import { sfCreateOrder } from '@/lib/steadfast';
import { revalidatePath } from 'next/cache';

interface OrderFormData {
    name: string;
    phone: string;
    address: string;
    deliveryCharge: number;
}

interface OrderProductData {
    id: string;
    regularPrice: number;
    deliveryCharge?: number;
    [key: string]: any;
}

export async function createOrderAction(formData: OrderFormData, data: OrderProductData) {
    try {
        const { name, phone, address, deliveryCharge } = formData;

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

        const productPrice = data.salePrice > 0 ? data.salePrice : data.regularPrice;
        const totalAmount = productPrice + deliveryCharge;

        const items = [
            data
        ]

        const newOrder = await prisma.order.create({
            data: {
                userId: user.id,
                totalAmount: totalAmount,
                deliveryCharge: deliveryCharge,
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

        const totalCount = await prisma.order.count();
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
        const order = await prisma.order.findUnique({
            where: { id: id },
            include: {
                user: true,
                orderItems: true
            }
        });

        if (!order) return { success: false, message: 'Order not found' };

        const productIds = order.orderItems.map(item => item.productId);

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

        const orderWithProducts = {
            ...order,
            orderItems: order.orderItems.map(item => ({
                ...item,
                product: products.find(p => p.id === item.productId)
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
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus as any },
            include: { user: true }
        });

        if (order.status === 'CONFIRMED') {
            await sfCreateOrder(order);
        }

        revalidatePath(`/admin/orders/view/${orderId}`);
        return { success: true };
    } catch (error) {
        return { success: false, message: "Update failed" };
    }
}

export const addItemToOrder = async (orderId: string, productId: string, quantity: number = 1) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { salePrice: true, regularPrice: true }
        });

        if (!product) throw new Error("Product not found");

        const price = product.salePrice > 0 ? product.salePrice : product.regularPrice;
        const lineTotal = price * quantity;

        await prisma.$transaction(async (tx) => {
            const existingItem = await tx.orderItem.findFirst({
                where: {
                    orderId: orderId,
                    productId: productId,
                },
            });

            if (existingItem) {
                return {
                    success: false,
                    message: "This product is already in the order list."
                };
            }

            await tx.orderItem.create({
                data: {
                    orderId,
                    productId,
                    quantity,
                    price,
                }
            });

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
        return { success: true, message: "Item Added Successfully" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export const updateOrderPricing = async (orderId: string, deliveryCharge: number, items: { id: string, price: number, quantity: number }[]) => {
    try {
        await prisma.$transaction(async (tx) => {
            for (const item of items) {
                await tx.orderItem.update({
                    where: { id: item.id },
                    data: { price: item.price, quantity: item.quantity }
                });
            }

            const subTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const newTotal = subTotal + deliveryCharge;

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

export async function searchProducts(query: string) {
    if (!query || query.length < 2) return [];

    try {
        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            take: 5,
            select: {
                id: true,
                name: true,
                regularPrice: true,
            }
        });

        return products;
    } catch (error) {
        console.error("Search Error:", error);
        return [];
    }
}

export async function deleteOrderItem(itemId: string, orderId: string) {
    try {
        return await prisma.$transaction(async (tx) => {

            const itemToDelete = await tx.orderItem.findUnique({
                where: { id: itemId },
            });

            if (!itemToDelete) {
                return { success: false, message: "Item not found!" };
            }

            await tx.orderItem.delete({
                where: { id: itemId }
            });

            const remainingItems = await tx.orderItem.findMany({
                where: { orderId: orderId }
            });


            const newSubTotal = remainingItems.reduce((acc, item) => {
                return acc + (item.price * item.quantity);
            }, 0);

            const order = await tx.order.findUnique({
                where: { id: orderId },
                select: { deliveryCharge: true }
            });

            const finalTotal = newSubTotal + (order?.deliveryCharge || 0);

            await tx.order.update({
                where: { id: orderId },
                data: {
                    totalAmount: finalTotal
                }
            });

            revalidatePath(`/admin/orders/${orderId}`);

            return { success: true, message: "Item removed and total updated!" };
        });

    } catch (error) {
        console.error("Delete Error:", error);
        return { success: false, message: "Failed to delete item" };
    }
}

export async function updateOrderAddress(orderId: string, newAddress: string) {
    try {
        if (!newAddress || newAddress.trim() === "") {
            throw new Error("Address cannot be empty");
        }

        await prisma.order.update({
            where: { id: orderId },
            data: {
                shippingAddress: newAddress,
            },
        });

        revalidatePath(`/admin/orders/view/${orderId}`);
        return { success: true, message: "Delivery address updated successfully!" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to update address" };
    }
}

export async function updateCustomerDetails(userId: string, orderId: string, data: { name: string, phone: string }) {
    try {
        if (!data.name || !data.phone) {
            throw new Error("Name and Phone are required");
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                phone: data.phone,
            },
        });

        revalidatePath(`/admin/orders/view/${orderId}`);

        return { success: true, message: "Customer details updated!" };
    } catch (error: any) {
        console.error("Update Error:", error);
        return { success: false, message: error.message || "Failed to update customer" };
    }
}