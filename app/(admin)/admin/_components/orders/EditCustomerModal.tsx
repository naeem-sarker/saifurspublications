"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCog, Loader2 } from "lucide-react";
import { updateCustomerDetails } from "@/actions/orderActions";
import { toast } from "sonner";

interface Props {
    userId: string;
    orderId: string;
    currentName: string;
    currentPhone: string;
}

export default function EditCustomerModal({ userId, orderId, currentName, currentPhone }: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: currentName, phone: currentPhone });

    const handleUpdate = async () => {
        setLoading(true);
        const res = await updateCustomerDetails(userId, orderId, formData);
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
                <Button variant="ghost" size="sm" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 p-0">
                    <UserCog size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Customer Information</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Customer Name</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={loading} className="bg-red-600 hover:bg-red-700">
                            {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                            Save Changes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}