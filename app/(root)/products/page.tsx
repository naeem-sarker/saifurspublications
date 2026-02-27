import { getProductByPublic, getProductsFromPublic } from '@/actions/productActions'
import ProductGrid from './ProductGrid';

const Products = async () => {
    const res = await getProductsFromPublic();
    console.log(res)
  return (
    <div>
      <ProductGrid data={res.data} />
    </div>
  )
}

export default Products
