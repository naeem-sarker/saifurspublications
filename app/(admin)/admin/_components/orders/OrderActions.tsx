"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/actions/orderActions";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function OrderActions({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (value: string) => {
        setLoading(true);
        const res = await updateOrderStatus(orderId, value);
        if (res.success) toast.success("Status updated!");
        setLoading(false);
    };

    return (
        <div className="flex items-center gap-3">
            <Select onValueChange={handleStatusChange} defaultValue={currentStatus} disabled={loading}>
                <SelectTrigger className="w-[180px] bg-white">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="RETURN">Returned</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}