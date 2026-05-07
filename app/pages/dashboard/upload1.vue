<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>

<template>
<section>

<h1 class="text-4xl font-bold mb-8">
Upload Artwork
</h1>

<div class="card-box max-w-3xl">

  <input placeholder="Artwork Title" class="dash-input" />

  <textarea
    rows="5"
    placeholder="Description"
    class="dash-input mt-4"
  />

  <input type="file" class="mt-4" />

  <select class="dash-input mt-4">
    <option>Painting</option>
    <option>Photography</option>
    <option>Digital Art</option>
  </select>

  <button class="dash-btn mt-6">
    Upload Artwork
  </button>

</div>

</section>
</template> 