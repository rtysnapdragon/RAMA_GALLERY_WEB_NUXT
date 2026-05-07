<template>
  <div class="home-page">
    <HomeHero  />
    <div class="animate-on-scroll"><HomeFeaturedArtworks :artworks="pagesData.artworks" /></div>
    <div class="animate-on-scroll"><HomeFeaturedArtists :artists="pagesData.artists" /></div>
    <div class="animate-on-scroll"><HomeServices :services="pagesData.services" /></div>
    <div class="animate-on-scroll"><HomeTestimonials :testimonials="pagesData.testimonials" /></div>
    <!-- <div class="animate-on-scroll"><TestimonialsSection :testimonials="pagesData.testimonials" /></div> -->
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import pagesData from '~/assets/json/pages.json'
const { t, locale } = useI18n()

useSchemaOrg([
  defineWebSite({
    name: computed(() => locale.value === 'km' ? 'ទំព័រដើម' : 'Home'),
    url: 'https://ramagallery.angkordragon.space'
  }),

  defineOrganization({
    name: computed(() => locale.value === 'km' ? 'ទំព័រដើម' : 'Home'),
    url: 'https://ramagallery.angkordragon.space',
    logo: 'https://ramagallery.angkordragon.space/logo.png'
  })
])

useSeoMeta({
  title: computed(() => locale.value === 'km' ? 'ទំព័រដើម | RamaGallery' : 'Home | RamaGallery'),
  description: computed(() => locale.value === 'km' ? 'ស្វែងយល់អំពីវិចិត្រសិល្បៈខ្មែរឌីជីថលនិងឧបករណ៍ច្នៃប្រឌិត AI។' : 'Explore Cambodia modern art, digital galleries, artists and AI creative tools.'),
  ogTitle: computed(() => locale.value === 'km' ? 'ទំព័រដើម' : 'Home'),
  ogDescription: computed(() => locale.value === 'km' ? 'ស្វែងយល់អំពីវិចិត្រសិល្បៈខ្មែរឌីជីថលនិងឧបករណ៍ច្នៃប្រឌិត AI។' : 'Explore Cambodia modern art, digital galleries, artists and AI creative tools.'),
  ogImage: 'https://ramagallery.angkordragon.space/og-cover.jpg',
  ogUrl: 'https://ramagallery.angkordragon.space',
  twitterCard: 'summary_large_image'
})

let observer

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  })

  setTimeout(() => {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el)
    })
  }, 100)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style lang="scss">
.home-page {
  display: flex;
  flex-direction: column;
}

.animate-on-scroll {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
