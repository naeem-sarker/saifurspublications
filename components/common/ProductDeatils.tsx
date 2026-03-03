'use client';

import { useState } from 'react';
import {
    BookOpen,
    Eye,
    Minus,
    CheckCircle,
} from 'lucide-react';
import Image from 'next/image';
import { toBengaliNumber } from '@/lib/numberConvert';
import { useForm } from 'react-hook-form';
import { createOrderAction } from '@/actions/orderActions';

interface OrderFormData {
    name: string;
    phone: string;
    address: string;
}

const ProductDetails = ({ data }) => {
    const [quantity, setQuantity] = useState(1);
    const [deliveryCharge, setDeliveryCharge] = useState(60);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<OrderFormData>({
        mode: 'onChange',
        reValidateMode: 'onChange'
    });

    const subTotal = data ? data.regularPrice * quantity : 0;
    const total = subTotal + deliveryCharge;

    const onSubmit = async (formData: OrderFormData) => {
        await createOrderAction(formData,data)
    };

    return (
        <div className="min-h-screen py-10">
            <div className="max-w-6xl mx-auto px-4 px-4 md:px-0">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white rounded-2xl flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-1/3 flex flex-col gap-4">
                                <div className="relative aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden shadow-md">
                                    <Image
                                        src={data?.coverImg || ""}
                                        alt={data?.slug || ""}
                                        width={300}
                                        height={600}
                                        className="w-full h-full object-cover"
                                    />
                                    {data?.discountRate && (
                                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                            {data.discountRate} ছাড়
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setIsPreviewOpen(true)}
                                    className="w-full py-2.5 flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                                >
                                    <Eye size={18} />
                                    একটু পড়ে দেখুন
                                </button>
                            </div>

                            <div className="w-full md:w-2/3 flex flex-col jusit-center">
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{data?.name}</h1>

                                <div className="flex flex-col gap-1 py-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">লেখক: </span> {data?.authors.map((author, index) => <span key={author.slug} className='text-black font-semibold'>
                                            {author?.name}{index < data.authors.length - 1 ? ', ' : ''}</span>)}
                                    </div>
                                    <div>
                                        <span className="text-gray-600">সংস্করণ: </span><span className='text-black font-semibold'>
                                            {toBengaliNumber(data?.edition)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">পৃষ্ঠা: </span><span className='text-black font-semibold'>
                                            {toBengaliNumber(data?.totalPage)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center items-end gap-3 mb-6">
                                    <span className="text-gray-600">মূল্য:</span>
                                    {data.salePrice > 0 ? <span className="text-2xl font-bold text-red-600">৳{toBengaliNumber(data.salePrice)}</span> : <span className="text-2xl font-bold text-red-600">৳{toBengaliNumber(data.regularPrice)}</span>}
                                    {data.salePrice !== 0 && <span className="text-md text-gray-400 line-through mb-1">৳{toBengaliNumber(data.regularPrice)}</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-white  sticky top-6">

                            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4 justify-center">
                                <h2 className="text-xl font-bold text-gray-900 ">আপনার তথ্য</h2>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম</label>
                                        <input autoFocus {...register("name", {
                                            required: "আপনার নাম লিখুন",
                                            minLength: { value: 2, message: "নাম কমপক্ষে ২ অক্ষরের হতে হবে" }
                                        })}
                                            type="text" placeholder="পুরো নাম লিখুন" className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none ${errors.name ? "border-red-400" : "border-gray-300"}`} />
                                        {errors.name && <p className="text-[10px] text-red-400 mt-1">{errors.name.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নাম্বার</label>
                                        <input {...register("phone", {
                                            required: "১১ ডিজিটের নম্বর লিখুন",
                                            pattern: {
                                                value: /^01[3-9]\d{8}$/,
                                                message: "সঠিক মোবাইল নম্বর দিন (১১ ডিজিট)"
                                            }
                                        })} type="tel" inputMode='numeric' placeholder='017xxxxxxxx'
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none ${errors.phone ? "border-red-400" : "border-gray-300"}`} />
                                        {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">সম্পূর্ণ ঠিকানা</label>
                                        <textarea {...register("address", { required: "আপনার ঠিকানা লিখুন" })}
                                            rows={2} placeholder="বাসা নং, রোড, এলাকা..." className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none ${errors.address ? "border-red-400" : "border-gray-300"}`}></textarea>
                                        {errors.address && <p className="text-[10px] text-red-400 mt-1">{errors.address.message}</p>}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2">
                                    <p className="text-xs font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                                        ডেলিভারি এলাকা সিলেক্ট করুন:
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <label
                                            className={`cursor-pointer relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${deliveryCharge === 60
                                                ? 'border-red-500 bg-white shadow-md scale-[1.02]'
                                                : 'border-gray-200 bg-white hover:border-red-200 text-gray-500'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="delivery"
                                                checked={deliveryCharge === 60}
                                                onChange={() => setDeliveryCharge(60)}
                                                className="hidden"
                                            />

                                            {deliveryCharge === 60 && (
                                                <div className="absolute top-2 right-2 text-red-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                </div>
                                            )}

                                            <span className={`text-sm font-bold mb-1 ${deliveryCharge === 60 ? 'text-gray-900' : 'text-gray-600'}`}>
                                                ঢাকার ভিতরে
                                            </span>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${deliveryCharge === 60 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                                                ৬০ টাকা
                                            </span>
                                        </label>

                                        <label
                                            className={`cursor-pointer relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${deliveryCharge === 90
                                                ? 'border-red-500 bg-white shadow-md scale-[1.02]'
                                                : 'border-gray-200 bg-white hover:border-red-200 text-gray-500'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="delivery"
                                                checked={deliveryCharge === 90}
                                                onChange={() => setDeliveryCharge(90)}
                                                className="hidden"
                                            />

                                            {deliveryCharge === 90 && (
                                                <div className="absolute top-2 right-2 text-red-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                </div>
                                            )}

                                            <span className={`text-sm font-bold mb-1 ${deliveryCharge === 90 ? 'text-gray-900' : 'text-gray-600'}`}>
                                                ঢাকার বাইরে
                                            </span>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${deliveryCharge === 90 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                                                ৯০ টাকা
                                            </span>
                                        </label>

                                    </div>
                                </div>


                                <div className="border-t border-dashed border-gray-300 pt-4 space-y-2">
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>সাবটোটাল</span>
                                        <span>৳{toBengaliNumber(subTotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>ডেলিভারি চার্জ</span>
                                        <span>৳{toBengaliNumber(deliveryCharge)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-900 font-bold text-lg pt-2">
                                        <span>সর্বমোট</span>
                                        <span>৳{toBengaliNumber(total)}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                    className={`w-full py-3.5 font-bold rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 ${isValid ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                >
                                    {isSubmitting ? "অর্ডার নেওয়া হচ্ছে..." : "অর্ডার কনফার্ম করুন"}
                                    <CheckCircle size={20} />
                                </button>

                                <p className="text-xs text-center text-gray-500 mt-2">
                                    অর্ডার কনফার্ম করতে আমাদের একজন প্রতিনিধি আপনাকে ফোন দিবে।
                                </p>
                            </form>
                        </div>
                    </div>

                </div>
            </div>

            {isPreviewOpen && data?.pdfUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-5xl h-[85vh] rounded-xl relative flex flex-col shadow-2xl overflow-hidden">

                        <div className="flex justify-between items-center p-3 bg-gray-100 border-b">
                            <span className="font-semibold text-gray-700 ml-2">প্রিভিউ: {data?.name}</span>
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-full transition-all"
                            >
                                <Minus size={20} className="rotate-45" />
                            </button>
                        </div>

                        <div className="flex-1 bg-gray-200 relative">
                            {data?.pdfUrl ? (
                                <iframe
                                    src={`${data?.pdfUrl}#toolbar=0`}
                                    className="w-full h-full"
                                    title="Book Preview"
                                >
                                    <p>আপনার ব্রাউজার পিডিএফ প্রিভিউ সাপোর্ট করছে না।</p>
                                </iframe>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <BookOpen size={48} className="mb-2 opacity-50" />
                                    <p>দুঃখিত, কোনো প্রিভিউ ফাইল পাওয়া যায়নি।</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;