import { getProductsFromPublic } from '@/actions/productActions'
import ProductGrid from './ProductGrid';

const Products = async () => {
  const res = await getProductsFromPublic();

  return (
    <div className=''>
      <ProductGrid data={res.data} />
    </div>
  )
}

export default Products
