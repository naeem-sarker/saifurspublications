"use client"

import { Search, ShoppingBag, Menu, User } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react'

const Navbar = () => {
    // এনিমেশনের জন্য স্টেট এবং ভেরিয়েবল
    const [placeholderText, setPlaceholderText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    // সার্চ বারে কি কি লেখা আসবে তার লিস্ট
    const searchKeywords = [
        "Search for IELTS Books...",
        "Search for Spoken English...",
        "Search for Stationery...",
        "Search for Grammar Books...",
        "Search for S@ifur's Math..."
    ];

    useEffect(() => {
        const handleTyping = () => {
            const i = loopNum % searchKeywords.length;
            const fullText = searchKeywords[i];

            setPlaceholderText(
                isDeleting
                    ? fullText.substring(0, placeholderText.length - 1)
                    : fullText.substring(0, placeholderText.length + 1)
            );

            // টাইপিং স্পিড কন্ট্রোল
            setTypingSpeed(isDeleting ? 50 : 100);

            // পুরো শব্দ লেখা শেষ হলে একটু থামবে, তারপর মুছতে শুরু করবে
            if (!isDeleting && placeholderText === fullText) {
                setTimeout(() => setIsDeleting(true), 2000); // ২ সেকেন্ড অপেক্ষা
            }
            // পুরো শব্দ মুছে গেলে পরের শব্দে যাবে
            else if (isDeleting && placeholderText === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [placeholderText, isDeleting, loopNum, searchKeywords, typingSpeed]);

    return (
        <nav className='sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm'>
            <div className='max-w-[1224px] mx-auto px-4 md:px-0 py-2'>
                <div className='flex items-center justify-between gap-4'>

                    <Link href="/" className='flex flex-col select-none cursor-pointer'>
                        <Image src={"/saifurs.svg"} width={64} height={64} alt='Saifurs Publications' />
                    </Link>

                    {/* Search Section - Hidden on small mobile, visible on larger screens */}
                    <div className='hidden md:flex flex-1 max-w-md mx-auto'>
                        <div className='relative w-full group'>
                            <input
                                type="text"
                                placeholder={placeholderText}
                                className='w-full bg-gray-100 text-gray-700 text-sm rounded-full py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white border border-transparent focus:border-red-200 transition-all duration-300 placeholder:text-gray-400'
                            />
                            <button className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-full text-gray-400 shadow-sm hover:text-red-500 transition-colors'>
                                <Search size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Actions Section (Cart, Account, Mobile Menu) */}
                    <div className='flex items-center gap-4'>
                        {/* Search Icon for Mobile only */}
                        <button className='md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full'>
                            <Search size={20} />
                        </button>

                        {/* Cart Icon with Badge */}
                        <div className='relative cursor-pointer group'>
                            <div className='p-2 text-gray-700 group-hover:bg-red-50 group-hover:text-red-600 rounded-full transition-all duration-300'>
                                <ShoppingBag size={22} />
                            </div>
                            {/* Notification Badge */}
                            <span className='absolute top-0 right-0 h-4 w-4 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm'>
                                2
                            </span>
                        </div>

                        {/* User Profile */}
                        <button className='hidden sm:flex p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors'>
                            <User size={22} />
                        </button>

                        {/* Mobile Menu Button */}
                        <button className='sm:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full'>
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar