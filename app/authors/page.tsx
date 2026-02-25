import { getPublicAuthors } from '@/actions/authorActions'
import Image from 'next/image';

const Authors = async () => {
    const res = await getPublicAuthors();
    const authors = res.data || [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-10 text-center">
                <h1 className="text-2xl font-bold text-gray-700 mb-2">Authors</h1>
            </div>

            {authors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {authors.map((author: any) => (
                        <div
                            key={author.id}
                            className="group relative transition-all duration-300 ease-in-out"
                        >
                            <div className="flex justify-center mb-4">
                                {author.image ? (
                                    <Image
                                        src={author.image}
                                        alt={author.name}
                                        width={96}
                                        height={96}
                                        className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-50 group-hover:ring-blue-100 transition-all"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-100  flex items-center justify-center text-gray-400 text-3xl font-bold">
                                        {author.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <div className="text-center">
                                <h2 className="text-md font-semibold text-gray-600 transition-colors">
                                    {author.name}
                                </h2>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-xl text-gray-400 font-medium">No authors found at the moment.</p>
                </div>
            )}
        </div>
    )
}

export default Authors