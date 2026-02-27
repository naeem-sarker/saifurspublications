"use client"

import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ShoppingBag, Menu } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link';


const Navbar = () => {
    const { user, logOut } = useAuth();
    console.log(user)

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login failed", error);
        }
    };


    return (
        <nav className='sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm'>
            <div className='max-w-[1224px] mx-auto px-4 md:px-0 py-2'>
                <div className='flex items-center justify-between gap-4'>

                    <Link href="/" className='flex flex-col select-none cursor-pointer'>
                        <Image src={"/saifurs.svg"} width={64} height={64} alt='Saifurs Publications' />
                    </Link>

                    {/* Search Section - Hidden on small mobile, visible on larger screens */}
                    <div className='hidden md:flex flex-1 max-w-md mx-auto'>
                        <div className=' flex gap-6'>
                            <Link href={"/products?filter=academic"}>একাডেমিক</Link>
                            <Link href={"/products?filter=academic"}>স্টেটিওনারি</Link>
                        </div>
                    </div>

                    {/* Actions Section (Cart, Account, Mobile Menu) */}
                    <div className='flex items-center gap-4'>

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
                        {user ? (<div className="flex gap-4 items-center">
                            <span>{user.displayName}</span>
                            <button onClick={logOut} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
                        </div>) : (<button onClick={handleGoogleLogin} title='Login' className='hidden sm:flex p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer'>
                            লগইন
                        </button>)}


                        {/* Mobile Menu Button */}
                        <button title='Menu Bar' className='sm:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full'>
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar