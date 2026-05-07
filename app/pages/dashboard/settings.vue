<template>
  <section class="settings">

    <h1 class="settings__title">Settings</h1>

    <div class="settings__grid">

      <!-- ACCOUNT -->
      <div class="card">
        <h2 class="card__title">Account</h2>

        <div class="form">
          <div class="field">
            <label>Email</label>
            <input type="email" placeholder="you@email.com" />
          </div>

          <div class="field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" />
          </div>

          <button class="btn">Update Account</button>
        </div>
      </div>

      <!-- PREFERENCES -->
      <div class="card">
        <h2 class="card__title">Preferences</h2>

        <div class="form">
          <div class="field">
            <label>Language</label>
            <select>
              <option>English</option>
              <option>Khmer</option>
            </select>
          </div>

          <div class="field">
            <label>Theme</label>

            <div class="theme-grid">

                <button
                class="theme-card"
                :class="{ active: themeStore.mode === 'light' }"
                @click="themeStore.set('light')"
                >
                <div class="preview light"></div>
                <span>Light</span>
                </button>

                <button
                class="theme-card"
                :class="{ active: themeStore.mode === 'dark' }"
                @click="themeStore.set('dark')"
                >
                <div class="preview dark"></div>
                <span>Dark</span>
                </button>

                <button
                class="theme-card"
                :class="{ active: themeStore.mode === 'system' }"
                @click="themeStore.set('system')"
                >
                <div class="preview system"></div>
                <span>System</span>
                </button>

            </div>
            </div>
        </div>
      </div>

      <!-- PRIVACY -->
      <div class="card">
        <h2 class="card__title">Privacy</h2>

        <div class="toggle-list">

          <div class="toggle-item">
            <span>Public profile</span>
            <input type="checkbox" />
          </div>

          <div class="toggle-item">
            <span>Notifications</span>
            <input type="checkbox" />
          </div>

        </div>
      </div>

    </div>
  </section>
</template>


<script setup>
const themeStore = useThemeStore()



themeStore.set('system')

definePageMeta({
  layout: 'dashboard'
})

</script>

<style lang="css" scoped>
.settings {
  padding: 32px;
}

/* TITLE */
.settings__title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--text);
}

/* GRID */
.settings__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

/* CARD SYSTEM */
.card {
  padding: 20px;
  border-radius: 16px;

  background: var(--bg-card);
  border: 1px solid var(--border);
  backdrop-filter: blur(14px);

  transition: 0.25s ease;
}

.card__title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text);
}

/* FORM SYSTEM */
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 12px;
    color: var(--muted);
  }

  input,
  select {
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
  margin-top: 6px;

  padding: 12px;
  border-radius: 12px;

  border: none;
  cursor: pointer;

  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;

  font-weight: 600;
}

/* TOGGLE LIST */
.toggle-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px 0;
  color: var(--muted);
}
.theme-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.theme-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  padding: 12px;
  border-radius: 14px;

  border: 1px solid var(--border);
  background: var(--glass);

  cursor: pointer;
  transition: 0.2s ease;

  color: var(--muted);
  font-size: 12px;

  &:hover {
    transform: translateY(-2px);
    border-color: #6366f1;
    color: var(--text);
  }

  &.active {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99,102,241,0.25);
    color: var(--text);
  }
}

/* PREVIEW BOX */
.preview {
  width: 100%;
  height: 64px;
  border-radius: 10px;
  border: 1px solid var(--border);
}

/* LIGHT MOCK */
.preview.light {
  background: #f8f9fb;
}

/* DARK MOCK */
.preview.dark {
  background: #0f1115;
}

/* SYSTEM MOCK (split) */
.preview.system {
  background: linear-gradient(to right, #f8f9fb 50%, #0f1115 50%);
}
/* responsive */
@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
