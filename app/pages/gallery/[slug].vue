
<template>

<section class="page-wrap">
<h1 class="page-title">
Artwork Title
</h1>
<p class="page-sub">Artwork Subtitle</p>

</section>

<section class="page-wrap">
<h1 class="page-title">
{{ slug }}
</h1>
</section>
</template>


<script setup>
  const route = useRoute()  
  const slug = route.params.slug
console.log(" SLUG=-----> ", slug); 

const title = String(slug).replaceAll('-', ' ')
console.log(" Title=-----> ", title);

onMounted(async()=>{
  const { data, error } = await useWeb(
  `api/v1/artwork/detail/slug`,
  { 
    method: 'POST',
    data: {
      Slug: slug
    }
   }
)

console.log(" Data=-----> ", data.value);
})
  
  // usePageSeo(
  //   `${slug}`,
  //   `Artwork detail page`
  // )

  useSeoMeta({
  title,
  description: `${slug} artwork on RamaGallery.`,
  ogTitle: title,
  ogDescription: `${title} artwork on RamaGallery.`,
  ogUrl: `https://ramagallery.angkordragon.space/gallery/${slug}`,
  ogImage: '/og-image.jpg',
})
  </script>