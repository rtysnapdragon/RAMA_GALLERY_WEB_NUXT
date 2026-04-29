<template>

<AppHero />

<section id="gallery" class="section-wrap">
  <SectionTitle :title="$t('gallery')" />
</section>

<section id="artists" class="section-wrap">
  <SectionTitle :title="$t('artists')" />
</section>

<section id="blogs" class="section-wrap">
  <SectionTitle :title="$t('blogs')" />
</section>
</template>

<script setup>

useSchemaOrg([
  defineWebSite({
    name: 'RamaGallery',
    url: 'https://ramagallery.angkordragon.space'
  }),

  defineOrganization({
    name: 'RamaGallery',
    url: 'https://ramagallery.angkordragon.space',
    logo: 'https://ramagallery.angkordragon.space/logo.png'
  })
])
useSeoMeta({
  title: 'Home',
  description: 'Explore Cambodia modern art, digital galleries, artists and AI creative tools.',
  ogTitle: 'RamaGallery',
  ogDescription: 'Cambodia Artist Portfolio + AI Gallery.',
  ogImage: 'https://ramagallery.angkordragon.space/og-cover.jpg',
  ogUrl: 'https://ramagallery.angkordragon.space',
  twitterCard: 'summary_large_image'
})
</script>
