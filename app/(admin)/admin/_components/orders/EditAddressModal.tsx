"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Loader2 } from "lucide-react";
import { updateOrderAddress } from "@/actions/orderActions";
import { toast } from "sonner";

export default function EditAddressModal({ orderId, currentAddress }: { orderId: string, currentAddress: string }) {
    const [open, setOpen] = useState(false);
    const [address, setAddress] = useState(currentAddress);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        const res = await updateOrderAddress(orderId, address);
        if (res.success) {
            toast.success(res.message);
            setOpen(false);
        } else {
            toast.error(res.message);
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"outline"} size="sm" className="h-8 w-8 p-0 cursor-pointer">
                    <Edit2 size={14} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Delivery Address & Notes</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                    <Textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter full address and delivery notes..."
                        className="min-h-[120px] focus:ring-red-100"
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                            Update Address
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}