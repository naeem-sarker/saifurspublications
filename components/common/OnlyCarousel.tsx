"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link"
import { toBengaliNumber } from "@/lib/numberConvert"
import Image from "next/image"

interface Product {
  id: string;
  name: string;
  slug: string;
  coverImg?: string | null;
  salePrice: number;
  regularPrice: number;
}

interface OnlyCarouselProps {
  data: Product[];
}

export function OnlyCarousel({ data }: OnlyCarouselProps) {
  if (!data || data.length === 0) return null;

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true
      }}
      className="w-full max-w-7xl mx-auto px-4 md:px-0"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {data.map((item, index) => {
          const regularPrice = Number(item.regularPrice);
          const salePrice = Number(item.salePrice);
          const discount = (salePrice > 0 && regularPrice > salePrice)
            ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
            : 0;

          return (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
              <div className="h-full pb-2">
                <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full bg-white group relative flex flex-col">

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
                    <Link href={`/products/${item.slug}`} className="block">
                      <div className="flex justify-center items-center h-[180px] md:h-[240px] relative overflow-hidden transition-colors">
                        {item.coverImg && <Image
                          src={item.coverImg}
                          alt={item.name}
                          unoptimized={true}
                          width={200}
                          height={300}
                          className="object-contain h-[85%] w-auto transition-transform duration-500 group-hover:scale-105"
                        />}
                      </div>
                    </Link>

                    <div className="p-3 md:p-4 flex flex-col flex-grow gap-1 md:gap-2">
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="font-semibold text-sm md:text-[15px] text-gray-800 line-clamp-2 h-10 hover:text-red-500 transition-colors leading-tight">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="flex flex-col md:flex-row md:items-baseline md:gap-2 mt-1">
                        <span className="text-red-600 font-bold text-base md:text-xl">
                          {toBengaliNumber(item.salePrice || item.regularPrice)}৳
                        </span>

                        {salePrice > 0 && regularPrice > salePrice && (
                          <span className="text-gray-400 line-through text-[11px] md:text-sm">
                            {toBengaliNumber(regularPrice)}৳
                          </span>
                        )}
                      </div>

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
            </CarouselItem>
          )
        })}
      </CarouselContent>

      <div className="hidden md:block">
        <CarouselPrevious className="-left-4 shadow-lg hover:bg-red-500 hover:text-white" />
        <CarouselNext className="-right-4 shadow-lg hover:bg-red-500 hover:text-white" />
      </div>
    </Carousel>
  )
}