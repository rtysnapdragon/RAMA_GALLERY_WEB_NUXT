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
const { t,locale } = useI18n()
console.log("locale",locale)

useSchemaOrg([
  defineWebSite({
    name: locale === 'km' ? 'ទំព័រដើម' : 'Home',
    url: 'https://ramagallery.angkordragon.space'
  }),

  defineOrganization({
    name: locale === 'km' ? 'ទំព័រដើម' : 'Home',
    url: 'https://ramagallery.angkordragon.space',
    logo: 'https://ramagallery.angkordragon.space/logo.png'
  })
])

useSeoMeta({
  title: locale === 'km' ? 'ទំព័រដើម' : 'Home',
  description: locale === 'km' ? 'ស្វែងយល់អំពីវិចិត្រសិល្បៈខ្មែរឌីជីថលវិចិត្រសាលាศิลปករនិងឧបករណ៍ច្នៃប្រឌិតអេអាយអាយអាយ។' : 'Explore Cambodia modern art, digital galleries, artists and AI creative tools.',
  ogTitle: locale === 'km' ? 'ទំព័រដើម' : 'Home',
  ogDescription: locale === 'km' ? 'ស្វែងយល់អំពីវិចិត្រសិល្បៈខ្មែរឌីជីថលវិចិត្រសាលាศิลปករនិងឧបករណ៍ច្នៃប្រឌិតអេអាយអាយអាយ។' : 'Explore Cambodia modern art, digital galleries, artists and AI creative tools.',
  ogImage: 'https://ramagallery.angkordragon.space/og-cover.jpg',
  ogUrl: 'https://ramagallery.angkordragon.space',
  twitterCard: 'summary_large_image'
})
</script>
