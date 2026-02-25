import { Button } from '@/components/ui/button'
import { Link } from 'lucide-react'
import { CategoryForm } from './CategoryForm'

const AddCategory = () => {
    return (
        <div>
            <div className='flex justify-between mb-4'>
                <h1 className='text-2xl'>Add Category</h1>

                <Button asChild>
                    <Link href="/categories">Back</Link>
                </Button>
            </div>

            <CategoryForm />
        </div>
    )
}

export default AddCategory
