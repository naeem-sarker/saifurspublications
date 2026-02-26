import { getProductsFromPublic } from '@/actions/productActions'
import PopularBooks from '@/components/common/PopularBooks';
import React from 'react'

const Home = async () => {
const res = await getProductsFromPublic();
console.log(res)
  return (
    <div>
      <PopularBooks data={res.data}/>
    </div>
  )
}

export default Home
