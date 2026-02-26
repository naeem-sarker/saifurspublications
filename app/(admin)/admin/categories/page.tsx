import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getCategories } from "@/actions/categoryActions"

async function getData() {
  const res = await getCategories();

  return res.data;
}

const Categories = async () => {
  const data = await getData()

  return (
    <div>
      <div className='flex justify-between mb-4'>
        <h1 className='text-2xl'>Categories</h1>

        <Button asChild>
          <Link href="/admin/categories/add">Add Category</Link>
        </Button>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default Categories
