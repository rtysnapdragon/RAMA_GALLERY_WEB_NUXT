<script setup>
const route = useRoute()
</script>

<template>
<section class="page-wrap">
  <h1 class="page-title">{{ route.params.slug }}</h1>
  <p class="page-sub">Artwork detail page.</p>
</section>
</template>