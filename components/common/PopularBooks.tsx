"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { toBengaliNumber } from "@/lib/numberConvert";


const PopularBooks: React.FC = ({ data }) => {
    const sliderRef = useRef<HTMLDivElement | null>(null);

    const slideLeft = (): void => {
        if (!sliderRef.current) return;

        sliderRef.current.scrollBy({
            left: -250,
            behavior: "smooth",
        });
    };

    const slideRight = (): void => {
        if (!sliderRef.current) return;

        sliderRef.current.scrollBy({
            left: 250,
            behavior: "smooth",
        });
    };

    return (
        <div className="max-w-[1240px] mx-auto px-4 py-10">
            <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                    জনপ্রিয় বইসমূহ
                </h3>

                <Link
                    href="/products?sort=popular"
                    className="bg-red-500 text-white py-2 px-4 font-semibold text-xs rounded-sm hover:bg-red-600 transition-colors"
                >
                    সবগুলো বই দেখুন
                </Link>
            </div>

            <div className="relative group">
                <button
                    type="button"
                    title="Left Button"
                    onClick={slideLeft}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 bg-white border border-gray-200 shadow-lg rounded-full p-2 text-gray-700 hover:bg-red-500 hover:text-white transition-all hidden md:flex opacity-0 group-hover:opacity-100"
                >
                    <ChevronLeft size={24} />
                </button>

                <div
                    ref={sliderRef}
                    className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory no-scrollbar"
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                >
                    <style jsx>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>

                    {data.map((item, index: number) => (
                        <div
                            key={index}
                            className="snap-start min-w-[140px] md:min-w-[200px] flex flex-col gap-3 p-0 hover:shadow-lg transition-shadow bg-white p-4"
                        >
                            <div className="rounded-md p-2 flex justify-center items-center h-[180px] md:h-[240px] relative overflow-hidden">
                                <Image
                                    src={item.coverImg}
                                    alt="Book Cover"
                                    width={200}
                                    height={300}
                                    className="object-contain h-full w-auto"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <h3 className="font-medium text-sm md:text-base text-gray-800 line-clamp-2">
                                    {item.name}
                                </h3>
                                <span className="text-red-500 font-bold">{toBengaliNumber(item.regularPrice)}৳</span>
                            </div>

                            <Link href={`/products/${item.slug}`}
                                className="mt-auto w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-sm cursor-pointer py-2 transition-colors text-center"
                            >
                                অর্ডার করুন
                            </Link>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={slideRight}
                    title="ডানে স্লাইড করুন"
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 bg-white border border-gray-200 shadow-lg rounded-full p-2 text-gray-700 hover:bg-red-500 hover:text-white transition-all hidden md:flex opacity-0 group-hover:opacity-100"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default PopularBooks;
