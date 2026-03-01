"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/AuthContext';
import { LogOut, Settings, ShoppingBag, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import LoginModal from './LoginModal';

const Navbar = () => {
    const { user, logOut, role } = useAuth();

    return (
        <nav className='sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm'>
            <div className='max-w-7xl mx-auto px-4 md:px-0 py-2'>
                <div className='flex items-center justify-between gap-4'>

                    {/* Logo */}
                    <Link href="/" className='flex shrink-0 select-none cursor-pointer'>
                        <Image src="/saifurs.svg" width={50} height={50} alt='Saifurs Publications' priority />
                    </Link>

                    {/* Navigation Links */}
                    <div className='hidden md:flex flex-1 justify-center'>
                        <div className='flex gap-8 text-sm font-medium text-gray-600'>
                            <Link href="/products?filter=academic" className="hover:text-red-600 transition-colors">একাডেমিক</Link>
                            <Link href="/products?filter=stationary" className="hover:text-red-600 transition-colors">স্টেশনারি</Link>
                        </div>
                    </div>

                    {/* Actions Section */}
                    <div className='flex items-center gap-3'>

                        {/* Cart Icon */}
                        <Link href="/cart" className='relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-all'>
                            <ShoppingBag size={22} />
                            <span className='absolute top-1 right-1 h-4 w-4 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white'>
                                2
                            </span>
                        </Link>

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-none focus:ring-2 focus:ring-red-100 rounded-full transition-all cursor-pointer">
                                    <Avatar className="h-9 w-9 border border-gray-200">
                                        <AvatarImage
                                            src={user?.photoURL || ""}
                                            alt={user?.displayName || "User"}
                                            referrerPolicy="no-referrer"
                                        />
                                        <AvatarFallback className="bg-red-50 text-red-600 font-bold">
                                            {user?.displayName?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-64 p-1 mt-2">
                                    <DropdownMenuLabel className="p-3">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {user?.displayName}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate font-normal">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem asChild className="cursor-pointer py-2 px-3">
                                        {role === "ADMIN" ? <Link href="/admin" className="flex items-center gap-2">
                                            <User size={16} /> Dashboard
                                        </Link> : <Link href="/profile" className="flex items-center gap-2">
                                            <User size={16} /> Profile
                                        </Link>}
                                    </DropdownMenuItem>

                                    {/* <DropdownMenuItem className="cursor-pointer py-2 px-3">
                                        <div className="flex items-center gap-2">
                                            <Settings size={16} /> Settings
                                        </div>
                                    </DropdownMenuItem> */}

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={logOut}
                                        className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer py-2 px-3 font-medium"
                                    >
                                        <div className="flex items-center gap-2">
                                            <LogOut size={16} /> Log out
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <LoginModal />
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar