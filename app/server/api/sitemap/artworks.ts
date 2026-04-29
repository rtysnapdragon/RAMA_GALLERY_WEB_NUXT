export default defineEventHandler(async () => {
    const items = [
        { slug: 'sunset-angkor' },
        { slug: 'khmer-dreams' },
        { slug: 'royal-shadow' }
    ]

    return items.map(item => ({
        loc: `/gallery/${item.slug}`,
        lastmod: new Date().toISOString()
    }))
})