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
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner"; // বা আপনার প্রিয় নোটিফিকেশন লাইব্রেরি

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
            {/* প্রোডাক্ট অ্যাড করার বাটন */}
            {/* <Button variant="outline" className="gap-2 border-dashed border-slate-300">
                <Plus size={16} /> আইটেম যোগ করুন
            </Button> */}

            {/* স্ট্যাটাস ড্রপডাউন */}
            <Select onValueChange={handleStatusChange} defaultValue={currentStatus} disabled={loading}>
                <SelectTrigger className="w-[180px] bg-white">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="PENDING">পেন্ডিং (Pending)</SelectItem>
                    <SelectItem value="CONFIRMED">কনফার্ম (Confirmed)</SelectItem>
                    <SelectItem value="SHIPPED">শিফট (Shipped)</SelectItem>
                    <SelectItem value="DELIVERED">ডেলিভারড (Delivered)</SelectItem>
                    <SelectItem value="CANCELLED">বাতিল (Cancelled)</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}