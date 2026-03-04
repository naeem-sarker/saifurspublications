import { getProductsFromPublic } from '@/actions/productActions'
import ProductGrid from './ProductGrid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Products - Saifurs Publications',
  description: 'Saifurs Publications',
}

const Products = async () => {
  const res = await getProductsFromPublic();

  return (
    <ProductGrid data={res.data} />
  )
}

export default Products
