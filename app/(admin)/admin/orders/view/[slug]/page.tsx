import {
    User,
    Phone,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { getOrderBySlug } from '@/actions/orderActions';
import OrderActions from '../../../_components/orders/OrderActions';
import AddItemModal from '../../../_components/orders/AddItemModal';
import PricingEdit from '../../../_components/orders/PricingEditing';
import InvoiceButton from '../../../_components/orders/InvoiceButton';
import DeleteOrderItem from '../../../_components/orders/DeleteOrderItem';

const OrderDetails = async ({
    params,
}: {
    params: Promise<{ slug: string }>
}) => {
    const { slug } = await params;
    const res = await getOrderBySlug(slug);

    if (!res || !res.success || !res.data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-slate-500 font-medium">Sorry, Order Not Found!</p>
                <Link href="/admin/orders">
                    <Button variant="outline">Back to orders</Button>
                </Link>
            </div>
        );
    }

    const {
        id,
        status,
        createdAt,
        totalAmount,
        deliveryCharge,
        shippingAddress,
        user,
        orderItems
    } = res.data;

    const invoiceData = {
        id: id,
        createdAt: createdAt,
        status: status,
        totalAmount: totalAmount,
        deliveryCharge: deliveryCharge,
        shippingAddress: shippingAddress,
        user: {
            name: user?.name || "N/A",
            phone: user?.phone || "N/A",
            createdAt: user?.createdAt || "N/A"
        },
        orderItems: orderItems.map((item: any) => ({
            product: {
                name: item.product?.name || "বইয়ের নাম নেই"
            },
            quantity: item.quantity,
            price: item.price
        }))
    };

    return (
        <div>
            <div className='flex justify-between mb-4'>
                <h1 className='text-2xl font-bold'>Order Details</h1>

                <Button asChild>
                    <Link href="/admin/orders">Back Orders</Link>
                </Button>
            </div>
            <div >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-black text-slate-900">Invoice ID: #{id.slice(-6).toUpperCase()}</h1>
                                <Badge
                                    className="px-3 py-1 text-xs font-bold uppercase tracking-wider"
                                    variant={status === 'PENDING' ? 'outline' : 'default'}
                                >
                                    {status}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                                {format(createdAt, "dd MMM, yyyy")}, {format(createdAt, "hh:mm a")}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <InvoiceButton order={invoiceData} />
                        <PricingEdit order={res.data} />
                        <AddItemModal orderId={id} />
                        <OrderActions orderId={id} currentStatus={status} />
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-6">
                    <div className="xl:col-span-3 space-y-6">

                        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b bg-slate-50/50">
                                <h2 className="font-bold flex items-center gap-2 text-slate-800">
                                    Order Items ({orderItems?.length || 0})
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {orderItems?.map((item: any, index: number) => (
                                        <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50/50 transition-colors gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-800 text-base md:text-lg">
                                                        {item.product?.name || "N/A"}
                                                    </span>
                                                    <span className="text-sm text-slate-500 font-medium">
                                                        Unit Price: {item.price} TK
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 pt-3 md:pt-0">
                                                <div className="text-center">
                                                    <p className="text-xs text-slate-400 uppercase font-bold">Quantity</p>
                                                    <p className="font-bold text-slate-700">{item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-400 uppercase font-bold">Total</p>
                                                    <p className="font-black text-slate-900 text-lg">{item.price * item.quantity} TK</p>
                                                </div>
                                                <div>
                                                    <DeleteOrderItem itemId={item.id} orderId={id} />
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border rounded-2xl p-6 shadow-sm">
                            <h2 className="font-bold flex items-center gap-2 mb-4 text-slate-800 text-lg">
                                Delivery Address & Notes
                            </h2>
                            <div className="text-base text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-dashed border-slate-200">
                                {shippingAddress}
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-1 space-y-6">
                        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 bg-white/10 h-24 w-24 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                            <h2 className="font-bold flex items-center gap-2 mb-6 text-slate-400 text-xs uppercase tracking-[0.2em]">
                                <User size={16} /> Customer Details
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Name</p>
                                    <p className="text-xl font-bold">{user?.name || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Phone</p>
                                    <Link href={`tel:${user?.phone}`} className="text-xl font-bold text-red-400 flex items-center gap-2 hover:underline">
                                        <Phone size={18} /> {user?.phone}
                                    </Link>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Created</p>
                                    {format(user.createdAt, "dd MMM, yyyy")}, {format(user.createdAt, "hh:mm a")}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-sm space-y-5">
                            <h2 className="font-bold flex items-center gap-2 text-slate-800 text-lg">
                                Payment Summary
                            </h2>
                            <div className="space-y-4 pt-2">
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Sub Total</span>
                                    <span>{totalAmount - deliveryCharge} TK</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Delivery Charge</span>
                                    <span>{deliveryCharge} TK</span>
                                </div>
                                <Separator className="bg-slate-100" />
                                <div className="flex justify-between items-center pt-2">
                                    <span className="font-bold text-slate-900">Total</span>
                                    <span className="text-3xl font-black text-red-600">{totalAmount} TK</span>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center gap-2">
                                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                <p className="text-xs text-green-700 font-black uppercase tracking-widest">Cash On Delivery</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default OrderDetails;