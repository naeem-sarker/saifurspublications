"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";

const customStyles = `
  .swiper-pagination-bullet {
    background-color: #dcdddf;
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    background-color: #ffc9c9 !important;
    width: 24px !important;
    border-radius: 4px !important;
  }

  .swiper-slide {
    height: auto !important;
  }
`;


interface Offer {
    id: string;
    image: string;
    url: string;
}

export default function HeroSectionImageOnly({ data }: { data: Offer[] }) {
    return (
        <div className="pt-2">
            <style jsx>{customStyles}</style>

            <div className="">
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
                    {data.map((item: Offer) => (
                        <SwiperSlide key={item.id}>
                            <Link href={item.url}
                            >
                                <Image
                                    src={item.image}
                                    alt="Offer Banner"
                                    unoptimized={true}
                                    width={1280}
                                    height={400}
                                    className="w-full h-auto object-contain"
                                    priority
                                />
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
