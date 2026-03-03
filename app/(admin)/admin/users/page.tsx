import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getUsers } from "@/actions/userActions"

const Users = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const resolvedSearchParams = await searchParams;
  const currentPage = Math.max(1, Number(resolvedSearchParams.page || 1));

  const limit = Math.min(Math.max(1, Number(resolvedSearchParams.limit || 20)), 50);

  const res = await getUsers(currentPage, limit);

  const data = res.data || [];

  return (
    <div>
      <div className='flex justify-between mb-4'>
        <h1 className='text-2xl'>Users</h1>
      </div>

      <DataTable columns={columns} data={data} limit={limit} pageCount={res.meta?.totalPages || 1}
        currentPage={currentPage} />
    </div>
  )
}

export default Users
