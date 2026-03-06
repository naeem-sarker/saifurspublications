import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://saifurspublications.com'
    const now = new Date()

    return [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/authors`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ]
}
