export default defineEventHandler(async () => {
    const artists = [
        { slug: 'sokchea' },
        { slug: 'dara' },
        { slug: 'visal' }
    ]

    return artists.map(a => ({
        loc: `/artists/${a.slug}`,
        lastmod: new Date().toISOString()
    }))
})