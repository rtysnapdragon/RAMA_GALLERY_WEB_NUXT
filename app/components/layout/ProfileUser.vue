<!-- components/ProfileUser.vue -->
<template>
  <div
    ref="rootRef"
    class="profile-user"
    @click.stop="toggleMenu"
  >
    <!-- Trigger Avatar -->
    <button class="profile-trigger" aria-label="User Menu">
      <div class="avatar-wrap">
        <img
          :src="avatarUrl"
          :alt="displayName"
          class="avatar"
          @error="onImageError"
        />
        <span class="status-dot"></span>
      </div>
    </button>

    <!-- Dropdown -->
    <Transition name="profile-dropdown">
      <div v-if="open" class="dropdown-card">
        <!-- Header -->
        <div class="dropdown-head">
          <div class="avatar-large-wrap">
            <img
              :src="avatarUrl"
              :alt="displayName"
              class="avatar-large"
              @error="onImageError"
            />
            <span class="status-dot large"></span>
          </div>
          <div class="user-meta">
            <h4>{{ displayName }}</h4>
            <p>{{ userEmail }}</p>
          </div>
        </div>

        <!-- Body -->
        <div class="dropdown-links">
          <NuxtLink
            :to="localePath('/dashboard')"
            @click="closeMenu"
          >
            {{ $t('dashboard')}}
          </NuxtLink>

          <NuxtLink
            :to="localePath('/profile')"
            @click="closeMenu"
          >
            {{ $t('profile')}}
          </NuxtLink>

          <NuxtLink
            :to="localePath('/settings')"
            @click="closeMenu"
          >
            {{ $t('settings')}}
          </NuxtLink>

          <NuxtLink
            :to="localePath('/collections')"
            @click="closeMenu"
          >
            {{ $t('collections')}}
          </NuxtLink>

          <hr />

          <button @click="logoutUser">
            {{ $t('logout')}}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const auth = useAuthStore()
const router = useRouter()
const localePath = useLocalePath()

const open = ref(false)
const rootRef = ref(null)
const onImageError = (e) => {
  e.target.src = '/images/user_image_default.png'
}
const displayName = computed(() => {
  return auth.user?.Profile?.Name || 'Rama User'
})

const userEmail = computed(() => {
  return auth.user?.Email || 'No email'
})

const avatarUrl = computed(() => {
  return (
    auth.user?.ImageUrl ||
    auth.user?.Picture ||
    auth.user?.PhotoURL ||
    auth.user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName.value)}&background=111827&color=ffffff`
  )
})

const toggleMenu = () => {
  open.value = !open.value
}

const closeMenu = () => {
  open.value = false
}

const logoutUser = async () => {
  closeMenu()

  if (auth.logout) {
    await auth.logout()
  }

  router.push(localePath('/'))
}

const onClickOutside = (e) => {
  if (!rootRef.value) return
  if (!rootRef.value.contains(e.target)) {
    closeMenu()
  }
}

onMounted(() => {
  window.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', onClickOutside)
})
</script>

<style scoped lang="scss">
.profile-user {
  position: relative;
    width: 38px !important;
  height: 38px !important;
}

.profile-trigger {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.avatar-wrap {
  position: relative;
}

.avatar {
  width: 38px !important;
  height: 38px !important;
  border-radius: 999px;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,.08);
  transition: .25s ease;
}

.avatar:hover {
  transform: scale(1.04);
}

.status-dot {
  position: absolute;
  right: 1px;
  bottom: 1px;
  width: 11px;
  height: 11px;
  border-radius: 999px;
  background: #22c55e;
  border: 2px solid var(--color-bg-card);
}

.status-dot.large {
  width: 14px;
  height: 14px;
}

/* dropdown */
.dropdown-card {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 290px;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(var(--bg-rgb), .94);
  backdrop-filter: blur(18px);
  border: 1px solid var(--color-border);
  box-shadow: 0 20px 60px rgba(0,0,0,.16);
  z-index: 1000;
}

.dropdown-head {
  display: flex;
  gap: .85rem;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.avatar-large-wrap {
  position: relative;
}

.avatar-large {
  width: 56px;
  height: 56px;
  border-radius: 999px;
  object-fit: cover;
}

.user-meta {
  min-width: 0;
}

.user-meta h4 {
  font-size: .95rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.user-meta p {
  font-size: .78rem;
  opacity: .7;
  margin-top: .25rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* links */
.dropdown-links {
  padding: .35rem 0;
}

.dropdown-links a,
.dropdown-links button {
  width: 100%;
  display: block;
  text-align: left;
  padding: .9rem 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: .88rem;
  color: var(--color-text-secondary);
  transition: .2s ease;
}

.dropdown-links a:hover,
.dropdown-links button:hover {
  background: rgba(255,255,255,.04);
  color: var(--color-text-primary);
  padding-left: 1.2rem;
}

.dropdown-links hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: .25rem 0;
}

/* animation */
.profile-dropdown-enter-active,
.profile-dropdown-leave-active {
  transition: .22s ease;
}

.profile-dropdown-enter-from,
.profile-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(.96);
}
</style>