import { Button } from '@/components/ui/button'
import { getAuthors } from '@/actions/authorActions'
import { getCategories } from '@/actions/categoryActions'
import ProductForm from '../../_components/products/ProductForm'
import Link from 'next/link'

const AddProduct = async () => {
    const res = await getAuthors();
    const catRes = await getCategories();

    return (
        <div>
            <div className='flex justify-between mb-4'>
                <h1 className='text-2xl'>Add Product</h1>

                <Button asChild>
                    <Link href="/admin/products">Back</Link>
                </Button>
            </div>

            <ProductForm authorsList={res.data || []} categoriesList={catRes.data || []} />
        </div>
    )
}

export default AddProduct
