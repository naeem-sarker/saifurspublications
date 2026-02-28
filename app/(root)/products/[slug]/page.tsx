import { getProductByPublic } from "@/actions/productActions";
import ProductDetails from "@/components/common/ProductDeatils";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = (await params).slug

    const post = await getProductByPublic(slug)

    return {
        title: post?.data?.name,
        description: post?.data?.description,
    }
}

const BookDetailsPage = async ({
    params,
}: {
    params: Promise<{ slug: string }>
}) => {

    const { slug } = await params;

    const res = await getProductByPublic(slug);

    return <ProductDetails data={res.data} />
};

export default BookDetailsPage;