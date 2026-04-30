<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>

<template>
<section>

<h1 class="text-4xl font-bold mb-8">
AI Tools
</h1>

<div class="grid md:grid-cols-3 gap-6">

  <div class="card-box">Caption Generator</div>
  <div class="card-box">Tag Generator</div>
  <div class="card-box">SEO Writer</div>
  <div class="card-box">Style Suggestions</div>
  <div class="card-box">Smart Pricing</div>
  <div class="card-box">Artwork Critique</div>

</div>

</section>
</template>