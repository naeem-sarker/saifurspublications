import { getProductByPublic } from "@/actions/productActions";
import ProductDetails from "@/components/common/ProductDeatils";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    return {
        title: post?.data?.name,
        description: post?.data?.description,
        openGraph: {
            title: post?.data?.name,
            description: post?.data?.description || "",
            images: [
                {
                    url: `${baseUrl}/api/${post?.data?.coverImg}` || "",
                    width: 800,
                    height: 600,
                    alt: post?.data?.name,
                },
            ],
        },
    }
}

const BookDetailsPage = async ({
    params,
}: {
    params: Promise<{ slug: string }>
}) => {

    const { slug } = await params;

    const res = await getProductByPublic(slug);

    if (!res || !res.data) {
        notFound();
    }

    return <ProductDetails data={res.data} />
};

export default BookDetailsPage;