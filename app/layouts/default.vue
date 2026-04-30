<template>
  <div class="layout-root min-h-screen grid place-items-center" @click.self="ui.closeAll()">
    <!-- Header -->
    <AppHeader />

    <!-- Notification slide panel -->
    <!-- <NotifPanel /> -->
    <NotifPanel1 />

    <!-- Search overlay -->
    <SearchOverlay />

    <!-- Main content -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Footer -->
    <AppFooter />

    <!-- Scroll to top button -->
    <ScrollTopBtn />

    <!-- Floating AI Assistant -->
    <AIAssistantFloat />
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/ui'
import { useAuthStore } from '~/stores/auth'

const ui = useUIStore()
const auth = useAuthStore()

onMounted(() => {
  ui.initTheme()
  auth.initFromStorage()
})
</script>

<style lang="scss" scoped>
.layout-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: var(--header-height);
}
</style>
