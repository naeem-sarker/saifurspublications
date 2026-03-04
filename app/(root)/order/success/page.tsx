import Link from 'next/link'
import { CheckCircle, BookOpen, PhoneCall, Home } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Order Successfull - Saifurs Publications',
    description: 'Saifurs Publications',
}

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">

                <div className="flex justify-center mb-6">
                    <div className="bg-red-50 p-5 rounded-full">
                        <CheckCircle size={64} className="text-red-600" strokeWidth={1.5} />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    অর্ডার সফল হয়েছে!
                </h1>

                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    <span className="font-semibold text-red-600">Saifurs Publications</span>-এ আপনার অর্ডারটি আমরা পেয়েছি। আমাদের প্রতিনিধি খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
                </p>

                <div className="space-y-4">
                    <Link
                        href="/products"
                        className="block w-full bg-red-600 text-white py-4 rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-md active:scale-95 text-center"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <BookOpen size={20} />
                            আরও বই দেখুন
                        </div>
                    </Link>

                    <Link
                        href="tel:01XXXXXXXXX"
                        className="block w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors active:scale-95 text-center"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <PhoneCall size={20} />
                            সহযোগিতার জন্য কল করুন
                        </div>
                    </Link>
                </div>

                <div className="mt-10">
                    <Link
                        href="/"
                        className="text-gray-400 hover:text-red-600 text-sm inline-flex items-center gap-1 transition-colors"
                    >
                        <Home size={14} />
                        হোম পেজে ফিরে যান
                    </Link>
                </div>

            </div>
        </div>
    )
}