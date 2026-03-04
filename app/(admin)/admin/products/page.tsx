import { Button } from "@/components/ui/button"
import Link from 'next/link'

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getProducts } from "@/actions/productActions";

const Products = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const resolvedSearchParams = await searchParams;
  const currentPage = Math.max(1, Number(resolvedSearchParams.page || 1));

  const limit = Math.min(Math.max(1, Number(resolvedSearchParams.limit || 20)), 50);;

  const res = await getProducts(currentPage, limit);

  const data = res.data || [];

  console.log(res)

  return (
    <div>
      <div className='flex justify-between mb-4'>
        <h1 className='text-2xl'>Products</h1>

        <Button asChild>
          <Link href="/admin/products/add">Add Product</Link>
        </Button>
      </div>

      <DataTable columns={columns} limit={limit} data={data} pageCount={res.meta?.totalPages || 1}
        currentPage={currentPage} />
    </div>
  )
}

export default Products

