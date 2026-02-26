import { Button } from "@/components/ui/button"
import Link from 'next/link'

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getProducts } from "@/actions/productActions";

async function getData() {
  const res = await getProducts();

  return res.data || [];
}

const Products = async () => {
  const data = await getData()

  return (
    <div>
      <div className='flex justify-between mb-4'>
        <h1 className='text-2xl'>Products</h1>

        <Button asChild>
          <Link href="/admin/products/add">Add Product</Link>
        </Button>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default Products

