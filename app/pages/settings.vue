<template>
  <div class="settings">

    <!-- HEADER -->
    <div class="settings__header animate-on-scroll">
      <p class="eyebrow">{{ tBy({ en: 'Preferences', km: 'ចំណូលចិត្ត' }) }}</p>
      <h1 class="title">{{ tBy({ en: 'Account Settings', km: 'ការកំណត់គណនី' }) }}</h1>
    </div>

    <div class="settings__layout">

      <!-- SIDEBAR -->
      <aside class="settings__sidebar">
        <div class="nav">

          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="nav__item"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            <i :class="tab.icon"></i>
            <span>{{ tBy(tab.label) }}</span>
          </button>

        </div>
      </aside>

      <!-- CONTENT -->
      <main class="settings__content">

        <!-- PROFILE -->
        <section v-if="activeTab === 'profile'" class="card">
          <h2>Profile</h2>

          <div class="grid">
            <input v-model="profileForm.displayName" placeholder="Display Name" />
            <input v-model="profileForm.username" placeholder="Username" />
            <textarea v-model="profileForm.bio" placeholder="Bio" />
            <input v-model="profileForm.website" placeholder="Website" />
          </div>

          <button class="btn">Save Changes</button>
        </section>

        <!-- SECURITY -->
        <section v-if="activeTab === 'security'" class="card">
          <h2>Security</h2>

          <div class="grid">
            <input type="password" placeholder="Current Password" />
            <input type="password" placeholder="New Password" />
            <input type="password" placeholder="Confirm Password" />
          </div>

          <button class="btn">Update Password</button>
        </section>

        <!-- NOTIFICATIONS -->
        <section v-if="activeTab === 'notifications'" class="card">
          <h2>{{$t('notifications')}}</h2>

          <div class="list">
            <div v-for="s in notifSettings" :key="s.key" class="row">
              <div>
                <p class="row__title">{{ tBy(s.label) }}</p>
                <p class="row__desc">{{ tBy(s.hint) }}</p>
              </div>

              <label class="switch">
                <input type="checkbox" v-model="s.enabled" />
                <span></span>
              </label>
            </div>
          </div>
        </section>

        <!-- APPEARANCE -->
        <section v-if="activeTab === 'appearance'" class="card">
          <h2>Appearance</h2>

          <!-- SYSTEM / LIGHT / DARK -->
          <div class="mode">
            <button
              v-for="m in ['light','dark','system']"
              :key="m"
              class="mode__btn"
              :class="{ active: theme.set(m) }"
              @click="ui.set(m)"
            >
              <i
                :class="{
                  'ri-sun-line': m === 'light',
                  'ri-moon-line': m === 'dark',
                  'ri-computer-line': m === 'system'
                }"
              />
              <span>{{ m }}</span>
            </button>
          </div>

        </section>

      </main>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const auth = useAuthStore()
const ui = useUIStore()
const theme = useThemeStore()
useScrollAnimation()

const activeTab = ref('profile')
const tabs = [
  { key: 'profile', icon: '👤', label: { en: 'Profile', km: 'ប្រវត្តិរូប' } },
  { key: 'security', icon: '🔒', label: { en: 'Security', km: 'សុវត្ថិភាព' } },
  { key: 'notifications', icon: '🔔', label: { en: 'Notifications', km: 'ការជូនដំណឹង' } },
  { key: 'appearance', icon: '🎨', label: { en: 'Appearance', km: 'រូបរាង' } },
]

const profileForm = reactive({
  displayName: auth.user?.displayName ?? '',
  username: auth.user?.username ?? '',
  bio: auth.user?.bio ?? '',
  website: '',
})

const notifSettings = reactive([
  { key: 'likes', enabled: true, label: { en: 'Likes', km: 'ចូលចិត្ត' }, hint: { en: 'When someone likes your artwork', km: 'នៅពេលណាដែលអ្នកណាម្នាក់ចូលចិត្តស្នាដៃ' } },
  { key: 'comments', enabled: true, label: { en: 'Comments', km: 'មតិ' }, hint: { en: 'When someone comments on your work', km: 'នៅពេលមានមតិ' } },
  { key: 'follows', enabled: true, label: { en: 'New followers', km: 'អ្នកតាមដានថ្មី' }, hint: { en: 'When someone follows you', km: 'នៅពេលអ្នកណាម្នាក់តាមដានអ្នក' } },
  { key: 'featured', enabled: false, label: { en: 'Featured', km: 'ត្រូវបានជ្រើស' }, hint: { en: 'When your work is featured in the gallery', km: 'នៅពេលស្នាដៃបង្ហាញ' } },
])

function saveProfile() {
  if (auth.user) {
    auth.user.displayName = profileForm.displayName
    auth.user.username = profileForm.username
    auth.user.bio = profileForm.bio
    if (import.meta.client) localStorage.setItem('rama_user', JSON.stringify(auth.user))
  }
}

useSeoMeta({ title: 'Settings — RamaGallery' })
</script>

<style scoped lang="scss">
.settings {
  padding: 3rem 0 6rem;
}

/* HEADER */
.settings__header {
  margin-bottom: 2.5rem;

  .eyebrow {
    font-size: 12px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .title {
    font-size: 2rem;
    font-weight: 600;
    margin-top: 0.5rem;
  }
}

/* LAYOUT */
.settings__layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

/* SIDEBAR */
.settings__sidebar {
  position: sticky;
  top: 100px;

  .nav {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .nav__item {
    display: flex;
    align-items: center;
    gap: 10px;

    padding: 12px 14px;
    border-radius: 12px;

    border: 1px solid var(--border);
    background: var(--glass);

    color: var(--muted);
    cursor: pointer;

    transition: 0.25s ease;

    i {
      font-size: 18px;
    }

    &:hover {
      color: var(--text);
      transform: translateX(3px);
    }

    &.active {
      background: linear-gradient(135deg, #6366f1, #ec4899);
      color: white;
      border-color: transparent;
    }
  }
}

/* CONTENT CARD */
.settings__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  padding: 24px;
  border-radius: 18px;

  background: var(--bg-card);
  border: 1px solid var(--border);

  backdrop-filter: blur(18px);

  h2 {
    font-size: 18px;
    margin-bottom: 18px;
  }
}

/* INPUT GRID */
.grid {
  display: grid;
  gap: 12px;

  input,
  textarea {
    width: 100%;
    padding: 12px 14px;

    border-radius: 12px;
    border: 1px solid var(--border);

    background: var(--glass);
    color: var(--text);

    outline: none;
    transition: 0.2s ease;

    &:focus {
      border-color: #6366f1;
    }
  }
}

/* BUTTON */
.btn {
  margin-top: 16px;
  padding: 10px 16px;

  border-radius: 12px;
  border: none;

  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: white;

  cursor: pointer;
}

/* NOTIFICATION LIST */
.list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 14px 0;
  border-bottom: 1px solid var(--border);

  &__title {
    font-weight: 500;
  }

  &__desc {
    font-size: 12px;
    color: var(--muted);
  }
}

/* SWITCH */
.switch {
  position: relative;
  width: 44px;
  height: 24px;

  input {
    display: none;
  }

  span {
    position: absolute;
    inset: 0;
    background: var(--border);
    border-radius: 999px;
    transition: 0.2s ease;

    &::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;

      width: 18px;
      height: 18px;

      background: white;
      border-radius: 50%;
      transition: 0.2s ease;
    }
  }

  input:checked + span {
    background: #6366f1;

    &::after {
      transform: translateX(20px);
    }
  }
}

/* THEME MODE SWITCH */
.mode {
  display: flex;
  gap: 10px;
}

.mode__btn {
  flex: 1;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 12px;
  border-radius: 14px;

  border: 1px solid var(--border);
  background: var(--glass);

  color: var(--muted);

  cursor: pointer;
  transition: 0.25s ease;

  &.active {
    background: #6366f1;
    color: white;
  }
}
</style>
