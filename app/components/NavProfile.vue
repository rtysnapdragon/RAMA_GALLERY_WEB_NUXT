<template>
  <div class="relative group">
    <!-- Avatar -->
    <button class="flex items-center gap-2 focus:outline-none">
      <img
        :src="avatarSrc"
        alt="User avatar"
        class="w-9 h-9 rounded-full object-cover border border-gold"
      />
    </button>

    <!-- Dropdown -->
    <div
      class="dropdown absolute right-0 mt-2 w-52 bg-black text-white border border-gold rounded-md shadow-lg
             opacity-0 invisible group-hover:opacity-100 group-hover:visible
             transition-all duration-200 z-50"
    >
      <!-- User info -->
      <div class="px-4 py-2 border-b border-gold/20 text-sm text-gold">
        {{ auth.displayName || 'User' }}
      </div>

      <NuxtLink to="/dashboard" class="block px-4 py-2 hover:bg-gold/10">
        Dashboard
      </NuxtLink>

      <NuxtLink to="/settings" class="block px-4 py-2 hover:bg-gold/10">
        Settings
      </NuxtLink>

      <!-- Theme toggle -->
      <button
        class="w-full text-left px-4 py-2 hover:bg-gold/10 flex items-center justify-between"
        @click="ui.toggleTheme()"
      >
        <span>Theme</span>
        <span class="text-xs text-gray-400">
          {{ ui.isDark ? 'Dark' : 'Light' }}
        </span>
      </button>

      <hr class="border-gold/20" />

      <!-- Logout -->
      <button
        class="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-400"
        @click="logout"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
const auth = useAuthStore()
const ui = useUIStore()
const router = useRouter()

// Safe avatar fallback
const avatarSrc = computed(() => {
  return auth.user?.avatar || '/default-avatar.png'
})

// Logout handler
const logout = async () => {
  try {
    await auth.logout()
    router.push('/')
  } catch (e) {
    console.error('Logout failed:', e)
  }
}
</script>