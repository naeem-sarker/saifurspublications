import { getHerosFromPublic } from '@/actions/herosActions';
import { getProductsFromPublic } from '@/actions/productActions'
import { CarouselDemo } from '@/components/common/CarouselDemo';
import HeroSectionImageOnly from '@/components/common/HeroSection';
import { OnlyCarousel } from '@/components/common/OnlyCarousel';
import Link from 'next/link';

const Home = async () => {
  const resPopularProducts = await getProductsFromPublic("isPopular", "");
  const res = await getProductsFromPublic("", "english");
  const hRes = await getHerosFromPublic();

  const hData = (hRes?.data || []).map(hero => ({
    ...hero,
    url: hero.url ?? ""
  }));

  return (
    <div className='max-w-7xl mx-auto'>
      <HeroSectionImageOnly data={hData} />

      <div className="py-10 px-4 md:px-0">
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

        <CarouselDemo data={resPopularProducts.data || []} />
      </div>


      <div className="py-10 px-4 md:px-0">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            একাডেমিক বইসমূহ
          </h3>

          <Link
            href="/products?sort=popular"
            className="bg-red-500 text-white py-2 px-4 font-semibold text-xs rounded-sm hover:bg-red-600 transition-colors"
          >
            সবগুলো বই দেখুন
          </Link>
        </div>

        <OnlyCarousel data={res.data || []} />
      </div>
    </div>
  )
}

export default Home
