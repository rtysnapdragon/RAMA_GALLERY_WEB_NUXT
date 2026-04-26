<template>
<section>
<h1 class="text-4xl font-bold mb-8">
Notifications
</h1>

<div class="space-y-4">
  <div v-for="i in 6" :key="i" class="card-box">
    New like on Artwork {{ i }}
  </div>
</div>
</section>
</template>