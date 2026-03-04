import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AuthorForm } from '../../../_components/authors/AuthorForm'
import { getAuthroBySlug } from '@/actions/authorActions'

const UpdateAuthor = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params;

  const res = await getAuthroBySlug(slug);

  if (!res.success) {
    return (
      <div>
        <h1 className='text-2xl text-center'>Author not found</h1>
        <div className='text-center mt-4'>
          <Button asChild>
            <Link href="/admin/authors">Back</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className='flex justify-between mb-4'>
        <h1 className='text-2xl'>Edit Author</h1>

        <Button asChild>
          <Link href="/admin/authors">Back</Link>
        </Button>
      </div>

      <AuthorForm initialData={res?.data} />
    </div>
  )
}

export default UpdateAuthor
