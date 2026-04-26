
<template>
<section class="page-wrap">
  <h1 class="page-title">Gallery</h1>
  <p class="page-sub">Discover premium artworks.</p>

  <div class="grid md:grid-cols-3 gap-6 mt-10">
    <NuxtLink
      v-for="i in 9"
      :key="i"
      :to="`/gallery/artwork-${i}`"
      class="card"
    >
      Artwork {{ i }}
    </NuxtLink>
  </div>
</section>
</template>