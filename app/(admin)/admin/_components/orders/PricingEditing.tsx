"use client"

import { useState } from 'react';
import { updateOrderPricing } from '@/actions/orderActions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save, Edit2, X } from 'lucide-react';

export default function PricingEdit({ order }: { order: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const [delivery, setDelivery] = useState(order.deliveryCharge);
    const [items, setItems] = useState(order.orderItems.map((item: any) => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        name: item.product?.name
    })));

    const handleSave = async () => {
        const res = await updateOrderPricing(order.id, delivery, items);
        if (res.success) {
            toast.success("Pricing updated!");
            setIsEditing(false);
        } else {
            toast.error("Failed to update");
        }
    };

    if (!isEditing) {
        return (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-blue-600">
                <Edit2 size={14} className="mr-1" /> প্রাইস এডিট করুন
            </Button>
        );
    }

    return (
        <div className="fixed bottom-10 right-10 z-50 bg-white border-2 border-blue-500 p-6 rounded-2xl shadow-2xl w-96 animate-in slide-in-from-bottom-5">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">প্রাইসিং এডিট মোড</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}><X size={18}/></Button>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {items.map((item: any, index: number) => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-lg space-y-2">
                        <p className="text-xs font-bold truncate">{item.name}</p>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] uppercase text-slate-400">দাম</label>
                                <Input 
                                    type="number" 
                                    value={item.price} 
                                    onChange={(e) => {
                                        const newItems = [...items];
                                        newItems[index].price = Number(e.target.value);
                                        setItems(newItems);
                                    }}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase text-slate-400">পরিমাণ</label>
                                <Input 
                                    type="number" 
                                    value={item.quantity} 
                                    onChange={(e) => {
                                        const newItems = [...items];
                                        newItems[index].quantity = Number(e.target.value);
                                        setItems(newItems);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="pt-2">
                    <label className="text-xs font-bold">ডেলিভারি চার্জ</label>
                    <Input type="number" value={delivery} onChange={(e) => setDelivery(Number(e.target.value))} />
                </div>
            </div>

            <Button className="w-full mt-6 bg-blue-600" onClick={handleSave}>
                <Save size={16} className="mr-2" /> পরিবর্তন সেভ করুন
            </Button>
        </div>
    );
}