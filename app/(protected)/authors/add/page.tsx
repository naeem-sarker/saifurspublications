import { Button } from '@/components/ui/button'
import { Link } from 'lucide-react'
import { AuthorForm } from './AuthorForm'

const AddAuthor = () => {
    return (
        <div>
            <div className='flex justify-between mb-4'>
                <h1 className='text-2xl'>Add Author</h1>

                <Button asChild>
                    <Link href="/authors">Back</Link>
                </Button>
            </div>

            <AuthorForm />
        </div>
    )
}

export default AddAuthor
