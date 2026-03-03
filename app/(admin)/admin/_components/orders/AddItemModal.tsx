"use client";

import { useState } from "react";
import { addItemToOrder } from "@/actions/orderActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AddItemModal({ orderId }: { orderId: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    // নোট: এখানে আপনি সরাসরি আপনার প্রোডাক্ট লিস্ট বা সার্চ এপিআই কল করতে পারেন
    
    const handleAdd = async (productId: string) => {
        setLoading(true);
        const res = await addItemToOrder(orderId, productId, 1);
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
                <Button variant="outline" size="sm" className="gap-2 border-dashed">
                    <Plus size={16} /> আইটেম যোগ করুন
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>অর্ডারে নতুন বই যোগ করুন</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input 
                            placeholder="বইয়ের নাম লিখে সার্চ করুন..." 
                            className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 ring-red-100"
                        />
                    </div>

                    {/* স্যাম্পল লিস্ট (এখানে আপনি সার্চ রেজাল্ট দেখাবেন) */}
                    <div className="max-h-[300px] overflow-y-auto border rounded-lg">
                        <div className="p-3 flex items-center justify-between hover:bg-slate-50 border-b">
                            <span className="text-sm font-medium">Saifur's Vowels</span>
                            <Button size="sm" onClick={() => handleAdd("product-id-here")} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" size={14} /> : "যোগ করুন"}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}