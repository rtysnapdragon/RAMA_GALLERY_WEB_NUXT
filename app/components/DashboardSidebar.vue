<template>
<aside class="w-72 border-r border-white/10 hidden lg:block p-6">

  <NuxtLink to="/dashboard" class="text-2xl font-bold block mb-10">
    RamaGallery
  </NuxtLink>

  <nav class="space-y-2">

    <NuxtLink to="/dashboard" class="dash-link">Overview</NuxtLink>
    <NuxtLink to="/dashboard/upload" class="dash-link">Upload</NuxtLink>
    <NuxtLink to="/dashboard/artworks" class="dash-link">Artworks</NuxtLink>
    <NuxtLink to="/dashboard/analytics" class="dash-link">Analytics</NuxtLink>
    <NuxtLink to="/dashboard/ai" class="dash-link">AI Tools</NuxtLink>
    <NuxtLink to="/dashboard/profile" class="dash-link">Profile</NuxtLink>
    <NuxtLink to="/dashboard/notifications" class="dash-link">Notifications</NuxtLink>
    <NuxtLink to="/dashboard/settings" class="dash-link">Settings</NuxtLink>

  </nav>

</aside>
</template>