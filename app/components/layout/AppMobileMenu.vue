<script setup>
const store = useNavbarStore()
</script>

<template>
  <transition name="fade">
    <div
      v-if="store.mobileOpen"
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
      @click="store.mobileOpen = false"
    />
  </transition>

  <transition name="slide-right">
    <aside
      v-if="store.mobileOpen"
      class="fixed top-0 right-0 w-72 h-screen bg-white dark:bg-zinc-900 z-50 p-6 md:hidden"
    >
      <div class="flex justify-end mb-6">
        <button @click="store.mobileOpen = false">✕</button>
      </div>

      <nav class="flex flex-col gap-5 text-lg">
        <a href="#">Home</a>
        <a href="#">Gallery</a>
        <a href="#">Artists</a>
        <a href="#">About</a>
      </nav>
    </aside>
  </transition>
</template>