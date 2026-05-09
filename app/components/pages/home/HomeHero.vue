<template>
  <section class="hero-section">
    <div class="hero-bg">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>
      <div class="grid-overlay"></div>
    </div>
    
    <div class="container hero-content">
      <div class="hero-text-wrapper">
          <span class="gradient-text hero-title">{{ $t(String('tagline')) }}</span>
        <p class="hero-subtitle">{{ $t(String('subtitle')) }}</p>
        
        <div class="hero-actions">
          <NuxtLink :to="localePath('/gallery')" class="btn btn-primary btn-large">
            {{ $t(String('cta_explore')) }}
            <i class="ri-arrow-right-line"></i>
          </NuxtLink>
          <NuxtLink to="/join" class="btn btn-outline btn-large">
            {{ $t(String('cta_join')) }}
          </NuxtLink>
        </div>
      </div>
      
      <div class="hero-scroll-indicator">
        <span class="scroll-text">{{ $t(String('scroll')) }}</span>
        <div class="mouse-icon">
          <div class="wheel"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Uses global translations
</script>

<style lang="scss" scoped>
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding-top: 80px; // account for navbar
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: var(--color-bg);
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.6;
  animation: float 10s ease-in-out infinite alternate;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: var(--color-gold);
  top: -20%;
  right: -10%;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: var(--primary-color);
  bottom: -10%;
  left: -20%;
  animation-delay: -5s;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(to right, var(--color-border-strong) 1px, transparent 1px),
    linear-gradient(to bottom, var(--color-border-strong) 1px, transparent 1px);
  background-size: 80px 80px;
  opacity: 0.2;
  mask-image: radial-gradient(circle at center, black, transparent 80%);
}

.hero-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 900px;
}

.hero-text-wrapper {
  animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.hero-title {
  font-family: var(--font-900) !important;
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: var(--color-text-primary);
}

.gradient-text {
  background: linear-gradient(135deg, var(--color-gold), var(--primary-color-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: clamp(1.125rem, 2vw, 1.375rem);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.btn-large {
  padding: 1rem 2.5rem;
  font-size: 1.125rem;
  border-radius: 99px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(200, 149, 28, 0.3);
  }
}

.btn-primary {
  font-family: var(--font-900) !important;
  font-weight: 600;
  background: var(--color-gold);
  color: #fff;
  border: none;
}

.btn-outline {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-strong);
  
  &:hover {
    border-color: var(--color-gold);
    color: var(--color-gold);
    background: rgba(200, 149, 28, 0.05);
    box-shadow: none;
  }
}

.hero-scroll-indicator {
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.7;
  animation: fadeIn 2s ease forwards;
  animation-delay: 1s;
}

.scroll-text {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.mouse-icon {
  width: 24px;
  height: 36px;
  border: 2px solid var(--color-text-muted);
  border-radius: 12px;
  position: relative;
  
  .wheel {
    width: 4px;
    height: 8px;
    background: var(--color-gold);
    border-radius: 2px;
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    animation: scroll 1.5s infinite;
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 0.7; }
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, 30px) scale(1.05); }
  100% { transform: translate(-20px, -10px) scale(0.95); }
}

@keyframes scroll {
  0% { top: 6px; opacity: 1; }
  100% { top: 18px; opacity: 0; }
}
</style>
