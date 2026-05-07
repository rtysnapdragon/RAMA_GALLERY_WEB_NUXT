<template>
  <div class="teams-page">
    <section class="page-hero">
      <div class="container">
        <p class="section-label animate-on-scroll">{{ tBy({ en: 'The People Behind', km: 'អ្នកដែលនៅពីក្រោយ' }) }}</p>
        <h1 class="page-title animate-on-scroll">{{ tBy({ en: 'Our Team', km: 'ក្រុមការងាររបស់យើង' }) }}</h1>
        <p class="page-subtitle animate-on-scroll">{{ tBy({ en: 'A passionate team of technologists, curators, and art lovers building the future of Cambodian art', km: 'ក្រុមការងារដ៏ស្មោះស្ម័គ្ររបស់អ្នកបច្ចេកវិទ្យា អ្នកថែរក្សា និងអ្នកស្រឡាញ់សិល្បៈ' }) }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="team-grid">
          <div
            v-for="(member, i) in teams"
            :key="member.id"
            class="team-card card animate-on-scroll"
            :style="{ animationDelay: `${i * 0.1}s` }"
          >
            <div class="card-top">
              <img :src="member.avatar" :alt="member.name" class="member-avatar" />
              <div class="member-info">
                <h3 class="member-name">{{ member.name }}</h3>
                <p class="member-role">{{ tBy(member.role) }}</p>
              </div>
            </div>
            <p class="member-bio">{{ tBy(member.bio) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Join us CTA -->
    <section class="section join-section">
      <div class="container">
        <div class="join-card card animate-on-scroll">
          <p class="section-label">{{ tBy({ en: 'Join Us', km: 'ចូលជាមួយយើង' }) }}</p>
          <h2 class="join-title">{{ tBy({ en: 'We\'re Growing', km: 'យើងកំពុងរីកចម្រើន' }) }}</h2>
          <p class="join-desc">{{ tBy({ en: 'Passionate about Cambodian art and technology? We\'d love to meet you.', km: 'ចង់ចូលជានឹងការងារ? ទាក់ទងមក' }) }}</p>
          <NuxtLink to="/contact" class="btn btn-primary">{{ tBy({ en: 'Get in Touch', km: 'ទំនាក់ទំនង' }) }}</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import pagesData from '~/assets/json/pages.json'
useScrollAnimation()
const teams = pagesData.teams

useSeoMeta({ title: 'Team — RamaGallery', description: 'Meet the team behind RamaGallery.' })
</script>

<style scoped lang="scss">
.page-hero { padding: 5rem 0 3rem; text-align: center; background: linear-gradient(to bottom, var(--color-bg-secondary), var(--color-bg)); border-bottom: 1px solid var(--color-border); }
.page-title { font-size: clamp(2rem, 5vw, 3.5rem); margin: 0.5rem 0; }
.page-subtitle { color: var(--color-text-secondary); max-width: 540px; margin: 0 auto; }

.team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.team-card { padding: 1.75rem; transition: all var(--transition); &:hover { transform: translateY(-3px); border-color: var(--color-gold); } }
.card-top { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; }
.member-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-gold); flex-shrink: 0; }
.member-name { font-family: var(--font-display); font-size: 1.15rem; color: var(--color-text-primary); }
.member-role { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-gold); margin-top: 0.2rem; }
.member-bio { font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.7; }

.join-section { background: var(--color-bg-secondary); }
.join-card { max-width: 600px; margin: 0 auto; text-align: center; padding: 3rem 2rem; }
.join-title { font-family: var(--font-display); font-size: 2rem; margin: 0.75rem 0; }
.join-desc { color: var(--color-text-secondary); margin-bottom: 1.5rem; }
</style>
