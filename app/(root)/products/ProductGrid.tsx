"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { toBengaliNumber } from "@/lib/numberConvert"
import Image from "next/image"

export default function ProductGrid({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        কোনো পণ্য পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-0">
      {/* Grid Layout: Mobile 2, Tablet 3, Desktop 5 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {data.map((item, index) => {
          // ডিসকাউন্ট পার্সেন্টেজ ক্যালকুলেশন
          const regularPrice = Number(item.regularPrice);
          const salePrice = Number(item.salePrice);
          const discount = regularPrice > salePrice
            ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
            : 0;

          return (
            <div key={item.id || index} className="h-full">
              <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full bg-white group relative flex flex-col">

                {/* Circular Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-2 left-2 z-10 flex items-center justify-center rounded-full bg-red-600 text-white shadow-md
                                  w-10 h-10 md:w-12 md:h-12 scale-90 md:scale-100">
                    <div className="text-center flex flex-col items-center justify-center leading-tight p-1">
                      <span className="text-[10px] md:text-[12px] font-bold">
                        {toBengaliNumber(discount)}%
                      </span>
                      <span className="text-[8px] md:text-[10px]">
                        ছাড়
                      </span>
                    </div>
                  </div>
                )}

                <CardContent className="p-0 flex flex-col h-full">
                  {/* Image Section */}
                  <Link href={`/products/${item.slug}`} className="block">
                    <div className="bg-gray-50 flex justify-center items-center h-[180px] md:h-[240px] relative overflow-hidden group-hover:bg-gray-100 transition-colors">
                      <Image
                        src={item.coverImg}
                        alt={item.name}
                        width={250}
                        height={350}
                        className="object-contain h-[85%] w-auto transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  {/* Info Section */}
                  <div className="p-3 md:p-4 flex flex-col flex-grow gap-1 md:gap-2">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-semibold text-sm md:text-[15px] text-gray-800 line-clamp-2 h-10 hover:text-red-500 transition-colors leading-tight">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-baseline md:gap-2 mt-1">
                      {/* বর্তমান দাম (Sale Price) */}
                      <span className="text-red-600 font-bold text-base md:text-xl">
                        {toBengaliNumber(item.salePrice || item.regularPrice)}৳
                      </span>

                      {/* আগের দাম (Regular Price) */}
                      {item.salePrice && regularPrice > salePrice && (
                        <span className="text-gray-400 line-through text-[11px] md:text-sm">
                          {toBengaliNumber(item.regularPrice)}৳
                        </span>
                      )}
                    </div>

                    {/* Order Button */}
                    <Link
                      href={`/products/${item.slug}`}
                      className="mt-auto w-full bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm font-medium rounded-md py-2.5 transition-all text-center active:scale-95 shadow-sm"
                    >
                      অর্ডার করুন
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}