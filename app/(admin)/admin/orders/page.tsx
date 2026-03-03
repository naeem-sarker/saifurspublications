import { Button } from "@/components/ui/button"
import Link from 'next/link'

import { getAuthors } from "@/actions/authorActions"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getOrders } from "@/actions/orderActions"

const Orders = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const resolvedSearchParams = await searchParams;
  const currentPage = Math.max(1, Number(resolvedSearchParams.page || 1));

  const limit = Math.max(50, Number(resolvedSearchParams.limit || 20));;

  const res = await getOrders(currentPage, limit);

  const data = res.data || [];

  return (
    <div>
      <div className='flex justify-between mb-4'>
        <h1 className='text-2xl'>Orders</h1>

        <Button asChild>
          <Link href="/admin/orders/add">Make Order</Link>
        </Button>
      </div>

      <DataTable columns={columns} data={data} pageCount={res.meta?.totalPages || 1}
        currentPage={currentPage} />
    </div>
  )
}

export default Orders

