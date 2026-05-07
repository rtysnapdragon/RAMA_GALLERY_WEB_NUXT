
<template>
  <header class="dash-header">

    <!-- LEFT -->
    <div class="dash-header__left">
      <div class="dash-header__logo">
        <i class="ri-palette-line"></i>
      </div>

      <div class="dash-header__title">
        <span class="dash-header__sub">Control Panel</span>
        <h2>Artist Dashboard</h2>
      </div>
    </div>

    <!-- RIGHT -->
    <div class="dash-header__right">

      <!-- SEARCH -->
      <button class="icon-btn">
        <i class="ri-search-line"></i>
        <span>Search</span>
      </button>

      <!-- THEME -->
      <button class="icon-btn" @click="theme.toggle()">
        <i :class="theme.isDark ? 'ri-sun-line' : 'ri-moon-line'"></i>
        <span>{{ theme.isDark ? 'Light' : 'Dark' }}</span>
      </button>

      <!-- NOTIFICATION -->
      <button @click="ui.toggleNotifPanel()" class="icon-btn notification">
        <i class="ri-notification-3-line"></i>
        <span class="badge"></span>
      </button>

      <!-- PROFILE -->
      <button class="profile">
        <div class="avatar">A</div>

        <div class="meta">
          <p class="name">Artist</p>
          <p class="role">Premium Account</p>
        </div>

        <i class="ri-arrow-down-s-line arrow"></i>
      </button>

    </div>
  </header>
</template>

<script setup>
const theme = useThemeStore()
const ui = useUIStore()

</script>

<style lang="scss" scoped>
.dash-header {
  height: 80px;
  padding: 0 24px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  color: var(--text);

  backdrop-filter: blur(16px);
  transition: all 0.3s ease;
}

/* LEFT */
.dash-header__left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.dash-header__logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;

  display: grid;
  place-items: center;

  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: white;

  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.25);
}

.dash-header__title {
  h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }

  .dash-header__sub {
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }
}

/* RIGHT */
.dash-header__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* BUTTON SYSTEM */
.icon-btn {
  display: flex;
  align-items: center;
  gap: 8px;

  height: 42px;
  padding: 0 14px;

  border-radius: 14px;
  border: 1px solid var(--border);

  background: var(--glass);
  color: var(--muted);

  cursor: pointer;
  transition: 0.25s ease;

  i {
    font-size: 18px;
  }

  span {
    font-size: 13px;
  }

  &:hover {
    background: var(--bg-card);
    color: var(--text);
    transform: translateY(-1px);
  }
}

/* NOTIFICATION */
.notification {
  position: relative;

  .badge {
    position: absolute;
    top: 10px;
    right: 10px;

    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ec4899;
    box-shadow: 0 0 0 2px var(--bg);
  }
}

/* PROFILE */
.profile {
  display: flex;
  align-items: center;
  gap: 10px;

  height: 42px;
  padding: 0 12px;

  border-radius: 14px;
  border: 1px solid var(--border);

  background: var(--glass);
  cursor: pointer;

  transition: 0.25s ease;

  &:hover {
    background: var(--bg-card);
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 10px;

    display: grid;
    place-items: center;

    font-weight: 700;
    color: white;

    background: linear-gradient(135deg, #6366f1, #ec4899);
  }

  .meta {
    text-align: left;

    .name {
      font-size: 13px;
      font-weight: 600;
    }

    .role {
      font-size: 11px;
      color: var(--muted);
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  .arrow {
    font-size: 18px;
    color: var(--muted);
  }
}
</style>