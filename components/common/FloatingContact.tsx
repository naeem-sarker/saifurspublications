"use client"

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { Phone } from 'lucide-react';

const FloatingContact = () => {
    return (
        <div className="fixed bottom-8 right-6 z-50 flex flex-col gap-4">
            <div className="group relative flex items-center justify-end">
                <span className="absolute right-14 scale-0 group-hover:scale-100 transition-all duration-200 bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl uppercase tracking-widest">
                    Call Support
                </span>

                <Link
                    href="tel:+8809647222000"
                    className="bg-zinc-900 hover:bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10 transition-all duration-300 hover:-translate-y-1 active:scale-90"
                >
                    <Phone className="h-5 w-5 text-white" strokeWidth={2.5} />
                </Link>
            </div>

            <div className="group relative flex items-center justify-end">
                <span className="absolute right-14 scale-0 group-hover:scale-100 transition-all duration-200 bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl uppercase tracking-widest">
                    WhatsApp Us
                </span>

                <div className="absolute inset-0 w-12 h-12 bg-green-500/20 rounded-2xl animate-ping group-hover:hidden" />

                <Link
                    href="https://wa.me/+8801806426003"
                    className="bg-[#25D366] hover:bg-[#20ba59] w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(37,211,102,0.3)] transition-all duration-300 hover:-translate-y-1 active:scale-90 relative z-10"
                    target="_blank"
                >
                    <FaWhatsapp className="h-6 w-6 fill-white" />
                </Link>
            </div>
        </div>
    );
};

export default FloatingContact;