import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { Phone } from 'lucide-react';

const FloatingContact = () => {
    return (
        <div className="fixed bottom-15 right-6 z-50 flex flex-col gap-3">
            <Link
                href="tel:+8809647222000"
                className="bg-blue-500 hover:bg-blue-600 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg"
                target="_blank"
            >
                <Phone className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </Link>

            <Link
                href="https://wa.me/+8801713432062"
                className="bg-green-400 hover:bg-green-500 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg"
                target="_blank"
            >
                <FaWhatsapp className="h-4 w-4 md:h-5 md:w-5 fill-white" />
            </Link>
        </div>
    );
};

export default FloatingContact;