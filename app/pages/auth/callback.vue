<script setup>
const auth = useAuthStore()

onMounted(async () => {
  await auth.init()
  navigateTo('/dashboard')
})
</script>

<template>
<div class="min-h-screen grid place-items-center">
  Redirecting...
</div>
</template>