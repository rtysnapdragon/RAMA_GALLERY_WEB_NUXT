<template>
  <div class="settings-page">
    <div class="container">
      <div class="settings-header animate-on-scroll">
        <p class="section-label">{{ tBy({ en: 'Preferences', km: 'ចំណូលចិត្ត' }) }}</p>
        <h1 class="settings-title">{{ tBy({ en: 'Account Settings', km: 'ការកំណត់គណនី' }) }}</h1>
      </div>

      <div class="settings-layout">
        <!-- Sidebar -->
        <aside class="settings-sidebar">
          <nav>
            <button v-for="tab in tabs" :key="tab.key" class="sidebar-tab" :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">
              <span class="tab-icon">{{ tab.icon }}</span>
              {{ tBy(tab.label) }}
            </button>
          </nav>
        </aside>

        <!-- Content -->
        <div class="settings-content card">
          <!-- Profile tab -->
          <div v-if="activeTab === 'profile'" class="tab-section">
            <h2 class="tab-title">{{ tBy({ en: 'Profile', km: 'ប្រវត្តិរូប' }) }}</h2>
            <div class="form-fields">
              <div class="form-group">
                <label class="form-label">{{ tBy({ en: 'Display Name', km: 'ឈ្មោះបង្ហាញ' }) }}</label>
                <input v-model="profileForm.displayName" type="text" class="input" />
              </div>
              <div class="form-group">
                <label class="form-label">{{ tBy({ en: 'Username', km: 'ឈ្មោះអ្នកប្រើ' }) }}</label>
                <input v-model="profileForm.username" type="text" class="input" />
              </div>
              <div class="form-group">
                <label class="form-label">Bio</label>
                <textarea v-model="profileForm.bio" class="input textarea" rows="4" />
              </div>
              <div class="form-group">
                <label class="form-label">{{ tBy({ en: 'Website', km: 'គេហទំព័រ' }) }}</label>
                <input v-model="profileForm.website" type="url" class="input" placeholder="https://" />
              </div>
              <button class="btn btn-primary" @click="saveProfile">{{ t('common.save') }}</button>
            </div>
          </div>

          <!-- Security tab -->
          <div v-if="activeTab === 'security'" class="tab-section">
            <h2 class="tab-title">{{ tBy({ en: 'Security', km: 'សុវត្ថិភាព' }) }}</h2>
            <div class="form-fields">
              <div class="form-group">
                <label class="form-label">{{ tBy({ en: 'Current Password', km: 'ពាក្យសម្ងាត់បច្ចុប្បន្ន' }) }}</label>
                <input type="password" class="input" />
              </div>
              <div class="form-group">
                <label class="form-label">{{ tBy({ en: 'New Password', km: 'ពាក្យសម្ងាត់ថ្មី' }) }}</label>
                <input type="password" class="input" />
              </div>
              <div class="form-group">
                <label class="form-label">{{ tBy({ en: 'Confirm Password', km: 'បញ្ជាក់ពាក្យសម្ងាត់' }) }}</label>
                <input type="password" class="input" />
              </div>
              <button class="btn btn-primary">{{ tBy({ en: 'Update Password', km: 'ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់' }) }}</button>
            </div>
          </div>

          <!-- Notifications tab -->
          <div v-if="activeTab === 'notifications'" class="tab-section">
            <h2 class="tab-title">{{ tBy({ en: 'Notifications', km: 'ការជូនដំណឹង' }) }}</h2>
            <div class="notif-settings">
              <div v-for="setting in notifSettings" :key="setting.key" class="notif-row">
                <div>
                  <p class="notif-name">{{ tBy(setting.label) }}</p>
                  <p class="notif-hint">{{ tBy(setting.hint) }}</p>
                </div>
                <label class="toggle">
                  <input type="checkbox" v-model="setting.enabled" />
                  <span class="toggle-track"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- Appearance tab -->
          <div v-if="activeTab === 'appearance'" class="tab-section">
            <h2 class="tab-title">{{ tBy({ en: 'Appearance', km: 'រូបរាង' }) }}</h2>
            <div class="appearance-options">
              <div class="appear-item" :class="{ selected: !ui.isDark }" @click="ui.isDark && ui.toggleTheme()">
                <div class="appear-preview appear-light"></div>
                <span>{{ t('common.light_mode') }}</span>
              </div>
              <div class="appear-item" :class="{ selected: ui.isDark }" @click="!ui.isDark && ui.toggleTheme()">
                <div class="appear-preview appear-dark"></div>
                <span>{{ t('common.dark_mode') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const auth = useAuthStore()
const ui = useUIStore()
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
.settings-page { padding: 3rem 0 6rem; }
.settings-header { margin-bottom: 2.5rem; }
.settings-title { font-size: 2rem; margin-top: 0.5rem; }

.settings-layout { display: grid; grid-template-columns: 220px 1fr; gap: 2rem; @media (max-width: 768px) { grid-template-columns: 1fr; } }

.settings-sidebar { position: sticky; top: calc(var(--header-height) + 2rem); height: fit-content; }
.sidebar-tab {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1rem;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  text-align: left;
  transition: all var(--transition);

  &:hover { background: var(--color-bg-secondary); color: var(--color-text-primary); }
  &.active { background: rgba(200, 149, 28, 0.1); color: var(--color-gold); font-weight: 500; }
}
.tab-icon { font-size: 1rem; }

.settings-content { padding: 2rem; }
.tab-title { font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1.75rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-border); }
.tab-section { display: flex; flex-direction: column; }

.form-fields { display: flex; flex-direction: column; gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-secondary); }
.textarea { resize: vertical; font-family: var(--font-sans); }

.notif-settings { display: flex; flex-direction: column; gap: 0; }
.notif-row { display: flex; align-items: center; justify-content: space-between; gap: 2rem; padding: 1.25rem 0; border-bottom: 1px solid var(--color-border); &:last-child { border-bottom: none; } }
.notif-name { font-size: 0.9rem; font-weight: 500; color: var(--color-text-primary); }
.notif-hint { font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.2rem; }

.toggle {
  position: relative;
  width: 42px;
  height: 24px;
  flex-shrink: 0;
  cursor: pointer;

  input { display: none; }

  &-track {
    position: absolute;
    inset: 0;
    background: var(--color-border-strong);
    border-radius: 12px;
    transition: background var(--transition);

    &::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 18px;
      height: 18px;
      background: white;
      border-radius: 50%;
      transition: transform var(--transition);
    }
  }

  input:checked ~ .toggle-track {
    background: var(--color-gold);
    &::after { transform: translateX(18px); }
  }
}

.appearance-options { display: flex; gap: 1.25rem; }
.appear-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  transition: border-color var(--transition);
  font-size: 0.85rem;
  color: var(--color-text-secondary);

  &.selected { border-color: var(--color-gold); }
  &:hover { border-color: var(--color-gold); }
}
.appear-preview { width: 120px; height: 72px; border-radius: 4px; border: 1px solid var(--color-border); }
.appear-light { background: #faf9f7; }
.appear-dark { background: #0f0d0a; }
</style>
