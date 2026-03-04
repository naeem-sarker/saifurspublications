import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getProductBySlug } from '@/actions/productActions'
import ProductForm from '../../../_components/products/ProductForm'
import { getAuthors } from '@/actions/authorActions'
import { getCategories } from '@/actions/categoryActions'

const UpdateProduct = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {
    const { id } = await params;
    const authorRes = await getAuthors();
    const catRes = await getCategories();

    const res = await getProductBySlug(id);

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

            <ProductForm initialData={res?.data} authorsList={authorRes.data || []} categoriesList={catRes.data || []} />
        </div>
    )
}

export default UpdateProduct
