<template>
  <div class="mobile-theme-switcher" ref="switcherRef">
    <div class="switcher-container">
      <div class="theme-options" :class="{ 'expanded': isExpanded }">
        
        <button 
          class="theme-btn" 
          :class="{ 
            active: themeStore.mode === 'light',
            hidden: !isExpanded && themeStore.mode !== 'light'
          }" 
          @click="handleButtonClick('light')"
          aria-label="Light theme"
        >
          <i class="ri-sun-line"></i>
        </button>

        <button 
          class="theme-btn" 
          :class="{ 
            active: themeStore.mode === 'system',
            hidden: !isExpanded && themeStore.mode !== 'system'
          }" 
          @click="handleButtonClick('system')"
          aria-label="System theme"
        >
          <i class="ri-settings-4-line"></i>
        </button>

        <button 
          class="theme-btn" 
          :class="{ 
            active: themeStore.mode === 'dark',
            hidden: !isExpanded && themeStore.mode !== 'dark'
          }" 
          @click="handleButtonClick('dark')"
          aria-label="Dark theme"
        >
          <i class="ri-moon-line"></i>
        </button>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '~/stores/theme'

const themeStore = useThemeStore()
const isExpanded = ref(false)
const switcherRef = ref<HTMLElement | null>(null)

const handleButtonClick = (mode: 'light' | 'dark' | 'system') => {
  if (!isExpanded.value) {
    // Expand the panel when clicking the active button
    isExpanded.value = true
  } else {
    // Select the theme and collapse the panel
    themeStore.set(mode)
    isExpanded.value = false
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (isExpanded.value && switcherRef.value && !switcherRef.value.contains(event.target as Node)) {
    isExpanded.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
// Mobile responsive only (hidden on desktop)
@media (min-width: 768px) {
  .mobile-theme-switcher {
    display: none !important;
  }
}

// Default shown on mobile
.mobile-theme-switcher {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: block; 
}

.switcher-container {
  display: flex;
  align-items: center;
}

// Animation settings
.theme-options {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0;
  padding: 5px;
  background: var(--panel-bg);
  border: 1px solid var(--glass-border);
  border-radius: 99px;
  box-shadow: var(--glass-shadow);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  &.expanded {
    gap: 8px;
  }
}

.theme-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-secondary);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  opacity: 1;
  transform: scale(1);
  flex-shrink: 0;

  &.hidden {
    width: 0;
    opacity: 0;
    transform: scale(0.5);
    pointer-events: none;
    margin: 0;
    padding: 0;
    border: none;
  }

  &:hover:not(.hidden) {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }

  &.active {
    background: var(--primary-color);
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(18, 116, 170, 0.3);
  }
}

// For dark mode toggle btn shadow logic if we want them to feel integrated
:root.dark .theme-btn.active {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6);
}
</style>
