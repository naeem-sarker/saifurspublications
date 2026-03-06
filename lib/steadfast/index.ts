"use server"

import axios from "axios"

const apiUrl = process.env.STEADFAST_API_BASEURL;
const apiKey = process.env.STEADFAST_API_KEY;
const secretKey = process.env.STEADFAST_SECRET_KEY;

export const sfCreateOrder = async (orderData: any) => {
    const data = {
        recipient_name: orderData.user.name,
        invoice: orderData.id.slice(-6).toUpperCase(),
        recipient_address: orderData.user.address,
        cod_amount: orderData.totalAmount,
        recipient_phone: orderData.user.phone,
    }

    await axios.post(`${apiUrl}/create_order`, data, {
        headers: {
            "Content-Type": "application/json",
            'Api-Key': apiKey,
            'Secret-Key': secretKey,
        }
    })
}