import { getProductByPublic } from "@/actions/productActions";
import ProductDetails from "@/components/common/ProductDeatils";

const BookDetailsPage = async ({
    params,
}: {
    params: Promise<{ slug: string }>
}) => {

    const { slug } = await params;

    const res = await getProductByPublic(slug);

console.log(res.data.authors)
    return <ProductDetails term={slug} data={res.data}/>
};

export default BookDetailsPage;