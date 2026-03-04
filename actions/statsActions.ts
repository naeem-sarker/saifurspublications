import prisma from "@/lib/prisma"

export const getStats = async () => {
    try {
        const users = await prisma.user.count();
        const authors = await prisma.author.count();
        const products = await prisma.product.count();
        const orders = await prisma.order.count();

        return {
            success: true,
            data: {
                users, authors, products, orders
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