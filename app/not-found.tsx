import Link from 'next/link';
import { MoveUpRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '404 - Page Not Found',
    description: 'The page you are looking for does not exist.',
}

const NotFoundPage = () => {
    return (
        <div className="min-h-[80vh] w-full flex items-center justify-center bg-white font-nunito px-4">
            <div className="max-w-[1224px] w-full flex flex-col items-center text-center">
                <div className="space-y-4 max-w-lg">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                        Oops! Page Not Found
                    </h2>

                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
                    <Link href="/" className="flex h-12  rounded-sm bg-red-600 hover:bg-red-500 items-center justify-center py-[7px] px-5 gap-1 text-white font-semibold transition-transform active:scale-95">
                        <div>Back Home</div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;