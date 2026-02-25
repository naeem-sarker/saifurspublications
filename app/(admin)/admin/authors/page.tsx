import { Button } from "@/components/ui/button"
import Link from 'next/link'

import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getAuthors } from "@/actions/authorActions"

async function getData() {
  const res = await getAuthors();

  return res.data;
}

const Authors = async () => {
  const data = await getData()
  return (
    <div>
      <div className='flex justify-between mb-4'>
        <h1 className='text-2xl'>Authors</h1>

        <Button asChild>
          <Link href="/authors/add">Add Author</Link>
        </Button>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default Authors
