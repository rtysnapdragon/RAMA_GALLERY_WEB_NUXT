<template>
<section class="page-wrap">
  <h1 class="page-title">Artists</h1>

  <div class="grid md:grid-cols-4 gap-6 mt-8">
    <NuxtLink
      v-for="i in 8"
      :key="i"
      :to="`/artists/artist-${i}`"
      class="card"
    >
      Artist {{ i }}
    </NuxtLink>
  </div>
</section>
</template>