import { Button } from "@/components/ui/button"
import Link from 'next/link'

import { getAuthors } from "@/actions/authorActions"
import { columns } from "./columns"
import { DataTable } from "./data-table"

const Authors = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const resolvedSearchParams = await searchParams;
  const currentPage = Math.max(1, Number(resolvedSearchParams.page || 1));

  const limit = Math.min(Math.max(1, Number(resolvedSearchParams.limit || 20)), 50);;

  const res = await getAuthors(currentPage, limit);

  const data = res.data || [];

  return (
    <div>
      <div className='flex justify-between mb-4'>
        <h1 className='text-2xl font-bold'>Authors</h1>

        <Button asChild>
          <Link href="/admin/authors/add">Add Author</Link>
        </Button>
      </div>

      <DataTable columns={columns} limit={limit} data={data} pageCount={res.meta?.totalPages || 1}
        currentPage={currentPage} />
    </div>
  )
}

export default Authors
