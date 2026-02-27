"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const customStyles = `
  .swiper-pagination-bullet {
    background-color: #9ca3af;
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    background-color: #dc2626 !important;
    width: 24px !important;
    border-radius: 4px !important;
  }

  .swiper-slide {
    height: auto !important;
  }
`;


interface Offer {
    id: number;
    bgClass: string;
    image: string;
    width: number;
    height: number;
}

const offers: Offer[] = [
    {
        id: 1,
        bgClass: "bg-blue-50",
        image: "/ssc.png",
        width: 1224,
        height: 420,
    },
    {
        id: 2,
        bgClass: "bg-red-50",
        image: "/kids.png",
        width: 1224,
        height: 420,
    },
];


export default function HeroSectionImageOnly() {
    return (
        <div>
            <style jsx>{customStyles}</style>

            <div className="max-w-[1240px] mx-auto px-4 pt-2">
                <Swiper
                    modules={[Autoplay, Pagination, EffectFade]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    speed={900}
                    slidesPerView={1}
                    loop
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    className="w-full"
                >
                    {offers.map((offer) => (
                        <SwiperSlide key={offer.id}>
                            <div
                                className={`w-full ${offer.bgClass} flex justify-center`}
                            >
                                <Image
                                    src={offer.image}
                                    alt="Offer Banner"
                                    width={offer.width}
                                    height={offer.height}
                                    className="w-full h-auto object-contain"
                                    priority
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
