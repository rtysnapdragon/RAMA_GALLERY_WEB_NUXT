<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-card card">
        <div class="profile-card-header">
          <div class="logo-mark">ར</div>
          <h1>{{ t('auth.complete_profile') }}</h1>
          <p>{{ tBy({ en: 'Complete your profile to start sharing your art', km: 'បំពេញប្រវត្តិរូបរបស់អ្នកដើម្បីចាប់ផ្តើមចែករំលែក' }) }}</p>
        </div>

        <!-- Avatar upload -->
        <div class="avatar-upload">
          <div class="avatar-preview" @click="triggerUpload">
            <img v-if="previewUrl" :src="previewUrl" alt="Avatar" />
            <div v-else class="avatar-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div class="avatar-overlay">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
          <p class="upload-hint">{{ tBy({ en: 'Click to upload a photo', km: 'ចុចដើម្បីបញ្ចូលរូបថត' }) }}</p>
        </div>

        <!-- Form -->
        <div class="profile-form">
          <div class="form-group">
            <label class="form-label">{{ t('auth.display_name') }} *</label>
            <input v-model="form.displayName" type="text" class="input" :placeholder="tBy({ en: 'Your full name or artist name', km: 'ឈ្មោះពេញ ឬឈ្មោះវិចិត្រករ' })" />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('auth.username') }} *</label>
            <div class="input-prefix-wrap">
              <span class="input-prefix">@</span>
              <input v-model="form.username" type="text" class="input input-with-prefix" :placeholder="tBy({ en: 'username', km: 'ឈ្មោះអ្នកប្រើ' })" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">{{ tBy({ en: 'Role', km: 'តួនាទី' }) }} *</label>
            <div class="role-options">
              <label v-for="role in roles" :key="role.value" class="role-option" :class="{ selected: form.role === role.value }">
                <input type="radio" :value="role.value" v-model="form.role" class="hidden" />
                <span class="role-icon">{{ role.icon }}</span>
                <span class="role-label">{{ tBy(role.label) }}</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('auth.bio') }}</label>
            <textarea v-model="form.bio" class="input textarea" rows="3" :placeholder="tBy({ en: 'Tell us about yourself…', km: 'ប្រាប់យើងអំពីខ្លួនអ្នក…' })" />
          </div>

          <div class="form-group">
            <label class="form-label">{{ tBy({ en: 'Location', km: 'ទីតាំង' }) }}</label>
            <input v-model="form.location" type="text" class="input" :placeholder="tBy({ en: 'e.g. Phnom Penh, Cambodia', km: 'ឧ. ភ្នំពេញ, កម្ពុជា' })" />
          </div>

          <button class="btn btn-primary submit-btn" @click="handleSubmit" :disabled="!isValid || isLoading">
            <span v-if="isLoading">{{ t('common.loading') }}…</span>
            <span v-else>{{ tBy({ en: 'Complete Profile', km: 'បំពេញប្រវត្តិរូប' }) }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()

const fileInput = ref<HTMLInputElement>()
const previewUrl = ref<string>()
const isLoading = ref(false)

const form = reactive({ displayName: auth.user?.displayName ?? '', username: auth.user?.username ?? '', bio: '', location: '', role: 'artist' })

const roles = [
  { value: 'artist', icon: '🎨', label: { en: 'Artist', km: 'វិចិត្រករ' } },
  { value: 'collector', icon: '🖼️', label: { en: 'Collector', km: 'អ្នកប្រមូល' } },
  { value: 'visitor', icon: '👁️', label: { en: 'Art Lover', km: 'អ្នកស្រឡាញ់សិល្បៈ' } },
]

const isValid = computed(() => form.displayName.trim() && form.username.trim() && form.role)

function triggerUpload() { fileInput.value?.click() }

function handleAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) previewUrl.value = URL.createObjectURL(file)
}

async function handleSubmit() {
  if (!isValid.value) return
  isLoading.value = true
  await new Promise(r => setTimeout(r, 800))
  if (auth.user) {
    auth.user.displayName = form.displayName
    auth.user.username = form.username
    auth.user.bio = form.bio
    auth.user.isProfileComplete = true
    if (import.meta.client) localStorage.setItem('rama_user', JSON.stringify(auth.user))
  }
  isLoading.value = false
  router.push('/dashboard')
}
</script>

<style scoped lang="scss">
.profile-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; background: var(--color-bg-secondary); }
.profile-container { width: 100%; max-width: 520px; }
.profile-card { padding: 2.5rem; }
.profile-card-header { text-align: center; margin-bottom: 2rem; }
.logo-mark { font-size: 2.5rem; color: var(--color-gold); font-family: var(--font-display); margin-bottom: 0.75rem; }
.profile-card-header h1 { font-family: var(--font-display); font-size: 1.75rem; margin-bottom: 0.5rem; }
.profile-card-header p { color: var(--color-text-secondary); font-size: 0.9rem; }

.avatar-upload { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; margin-bottom: 1.75rem; }
.avatar-preview {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: 2px dashed var(--color-border);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color var(--transition);

  &:hover { border-color: var(--color-gold); }
  &:hover .avatar-overlay { opacity: 1; }

  img { width: 100%; height: 100%; object-fit: cover; }
}
.avatar-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted); }
.avatar-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity var(--transition); }
.upload-hint { font-size: 0.75rem; color: var(--color-text-muted); }

.profile-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-secondary); }
.input-prefix-wrap { position: relative; }
.input-prefix { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--color-text-muted); font-weight: 500; }
.input-with-prefix { padding-left: 2rem; }
.textarea { resize: vertical; font-family: var(--font-sans); }
.hidden { display: none; }
.submit-btn { width: 100%; justify-content: center; }

.role-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
.role-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all var(--transition);

  &.selected {
    border-color: var(--color-gold);
    background: rgba(200, 149, 28, 0.06);
  }

  &:hover { border-color: var(--color-gold); }
}
.role-icon { font-size: 1.5rem; }
.role-label { font-size: 0.75rem; font-weight: 500; color: var(--color-text-secondary); text-align: center; }
</style>
