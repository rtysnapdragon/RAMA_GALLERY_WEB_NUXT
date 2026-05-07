<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>

<template>
<section>

<h1 class="text-4xl font-bold mb-8">
Overview
</h1>

<div class="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
  <StatCard title="Views" value="24.8K" icon="ri-eye-line" />
  <StatCard title="Likes" value="8.2K" icon="ri-poker-hearts-fill" /> 
  <StatCard title="Saved" value="1.9K" icon="ri-bookmark-line" />
  <StatCard title="Followers" value="3.1K" icon="ri-team-line" />
</div>

<div class="grid xl:grid-cols-2 gap-6 mt-8">

  <div class="card-box">
    Recent Performance Chart
  </div>

  <div class="card-box">
    Latest Notifications
  </div>

</div>

</section>
</template>