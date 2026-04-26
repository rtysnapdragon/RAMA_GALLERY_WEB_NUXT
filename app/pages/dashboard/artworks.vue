<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>

<template>
<section>

<h1 class="text-4xl font-bold mb-8">
My Artworks
</h1>

<div class="space-y-4">

  <div
    v-for="i in 5"
    :key="i"
    class="card-box flex items-center justify-between"
  >
    <div>
      Artwork {{ i }}
    </div>

    <div class="flex gap-3">
      <button class="dash-btn-sm">Edit</button>
      <button class="dash-btn-sm bg-red-600">Delete</button>
    </div>
  </div>

</div>

</section>
</template>