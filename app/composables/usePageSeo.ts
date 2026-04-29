export const usePageSeo = (
    title: string,
    description: string
) => {
    useSeoMeta({
        title,
        description,
        ogTitle: title,
        ogDescription: description
    })
}