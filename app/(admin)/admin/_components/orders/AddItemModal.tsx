"use client";

import { useState, useEffect } from "react";
import { addItemToOrder, searchProducts } from "@/actions/orderActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface Product {
    id: string;
    name: string;
    regularPrice: number;
}

export default function AddItemModal({ orderId }: { orderId: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length > 1) {
                setSearching(true);

                const results = await searchProducts(searchTerm);
                setProducts(results);
                setSearching(false);
            } else {
                setProducts([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleAdd = async (productId: string) => {
        setLoading(true);
        const res = await addItemToOrder(orderId, productId, 1);
        if (res.success) {
            toast.success(res.message);
            setOpen(false);
            setSearchTerm("");
        } else {
            toast.error(res.message);
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-dashed">
                    <Plus size={16} /> Add Item
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Item</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                        <Input
                            placeholder="Search product name..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="max-h-[300px] overflow-y-auto border rounded-lg min-h-[100px] flex flex-col">
                        {searching ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="animate-spin text-slate-400" />
                            </div>
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <div key={product.id} className="p-3 flex items-center justify-between hover:bg-slate-50 border-b last:border-0">
                                    <div>
                                        <p className="text-sm font-medium">{product.name}</p>
                                        <p className="text-xs text-slate-500">Price:{product.regularPrice} TK</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => handleAdd(product.id)}
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={14} /> : "Add"}
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-sm text-slate-400">
                                {searchTerm.length > 1 ? "No products found." : "Search for a product..."}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}