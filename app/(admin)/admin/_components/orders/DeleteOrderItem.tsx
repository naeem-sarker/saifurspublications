"use client";

import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { deleteOrderItem } from "@/actions/orderActions";
import { toast } from "sonner";

export default function DeleteOrderItem({ itemId, orderId }: { itemId: string, orderId: string }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to remove this item?")) return;

        setLoading(true);
        const res = await deleteOrderItem(itemId, orderId);
        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
        setLoading(false);
    };

    return (
        <Button
            className="bg-red-400 hover:bg-red-500 cursor-pointer"
            onClick={handleDelete}
            disabled={loading}
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 size={16} />}
        </Button>
    );
}