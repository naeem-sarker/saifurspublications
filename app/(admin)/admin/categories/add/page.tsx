import { Button } from '@/components/ui/button'
import { CategoryForm } from './CategoryForm'
import Link from 'next/link'

const AddCategory = () => {
    return (
        <div>
            <div className='flex justify-between mb-4'>
                <h1 className='text-2xl'>Add Category</h1>

                <Button asChild>
                    <Link href="/admin/categories">Back</Link>
                </Button>
            </div>

            <CategoryForm />
        </div>
    )
}

export default AddCategory
