export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getHerosFromPublic } from "@/actions/herosActions";
import { getProductsFromPublic } from "@/actions/productActions";
import { CarouselDemo } from "@/components/common/CarouselDemo";
import HeroSectionImageOnly from "@/components/common/HeroSection";
import { OnlyCarousel } from "@/components/common/OnlyCarousel";
import Link from "next/link";

const Home = async () => {
  const [popularRes, englishRes, academicRes, heroRes] = await Promise.all([
    getProductsFromPublic("isPopular", ""),
    getProductsFromPublic("", "english"),
    getProductsFromPublic("", "academic"),
    getHerosFromPublic()
  ]);

  const hData = (heroRes?.data || []).map(hero => ({
    ...hero,
    url: hero.url ?? ""
  }));

  return (
    <div className='max-w-7xl mx-auto'>
      <HeroSectionImageOnly data={hData} />

      {
        popularRes.data && popularRes.data.length > 0 && (
          <section className="py-10 px-4 md:px-0">
            <SectionHeader title="জনপ্রিয় বইসমূহ" link="/products?sort=popular" />
            <CarouselDemo data={popularRes.data || []} />
          </section>
        )
      }

      {
        englishRes.data && englishRes.data.length > 0 && (
          <section className="py-10 px-4 md:px-0">
            <SectionHeader title="ইংরেজি বইসমূহ" link="/products?sort=english" />
            <OnlyCarousel data={englishRes.data || []} />
          </section>
        )
      }

      {
        academicRes.data && academicRes.data.length > 0 && (<section className="py-10 px-4 md:px-0">
          <SectionHeader title="একাডেমিক বইসমূহ" link="/products?sort=academic" />
          <OnlyCarousel data={academicRes.data || []} />
        </section>)
      }
    </div>
  )
}

const SectionHeader = ({ title, link }: { title: string, link: string }) => (
  <div className="flex justify-between items-end mb-6">
    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    <Link href={link} className="bg-red-500 text-white py-2 px-4 font-semibold text-xs rounded-sm hover:bg-red-600 transition-colors">
      সবগুলো বই দেখুন
    </Link>
  </div>
)

export default Home