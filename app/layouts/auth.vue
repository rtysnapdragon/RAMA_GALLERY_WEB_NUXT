<template>
  <section class="auth">
        <!-- floating top UI -->
    <div class="auth__topbar">
      <LangSwitch />
    </div>
    <!-- LEFT -->
    <div class="auth__left">
      <div class="auth__brand">
        <h1>{{ tBy({en: 'Welcome Back', km: 'សូមស្វាគមន៍មកកាន់ប្រព័ន្ធ!'})}}</h1>
        <p>{{ tBy({en: 'Login to access your dashboard and manage your content.', km: 'ចូលប្រើប្រព័ន្ធដើម្បីគ្រប់គ្រងផ្ទាំងគ្រប់គ្រង និងមាតិកា'})}}</p>
      </div>
    </div>

    <!-- RIGHT -->
    <div class="auth__right">
      <slot />
    </div>

  </section>
</template>

<script setup>
useHead({
  bodyAttrs: { class: 'bg-gray-900' }
})
</script>

<style lang="scss" scoped>
.auth {
  min-height: 100vh;
  display: flex;
//   gap: 32px;
    position: relative; // ✅ ADD THIS
  background: radial-gradient(circle at 20% 20%, #141428, #0a0a10 60%);
  color: #fff;
  
  &__topbar {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
    display: flex;
    gap: 10px;
    align-items: center;
  }

  &__left {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 80px;

    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.15),
      transparent 60%
    );

    h1 {
      font-size: 52px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    p {
      max-width: 420px;
      color: rgba(255,255,255,0.6);
      font-size: 16px;
      line-height: 1.6;
    }
  }

  &__right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px;
  }
}
</style>