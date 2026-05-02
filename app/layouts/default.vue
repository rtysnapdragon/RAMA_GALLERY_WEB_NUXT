<template>
  <div class="layout-root min-h-screen grid place-items-center" @click.self="ui.closeAll()">
    <!-- Header -->
    <AppHeader />

    <!-- Notification slide panel -->
    <!-- <NotifPanel /> -->
    <!-- <NotifPanel1 /> -->

    <!-- Search overlay -->
    <SearchOverlay />

    <!-- Toasts -->
    <div class="toast-container">
      <TransitionGroup name="toast-pop">
        <div
          v-for="(toast, idx) in ui.toasts"
          :key="toast.id"
          class="toast"
          :class="`type-${toast.type}`"
        >
          <i :class="toast.icon"></i>
          <span>{{ toast.message }}</span>
          <button @click="ui.removeToast(toast.id)" class="toast-close">&times;</button>
        </div>
      </TransitionGroup>
    </div>

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
