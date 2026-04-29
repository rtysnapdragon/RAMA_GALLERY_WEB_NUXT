<template>
  <div class="about-page">
    <!-- Hero -->
    <section class="about-hero">
      <div class="container">
        <p class="section-label animate-on-scroll">{{ tBy({ en: 'Our Story', km: 'រឿងរ៉ាវរបស់យើង' }) }}</p>
        <h1 class="about-title animate-on-scroll">
          {{ tBy({ en: 'Art Deserves a Home', km: 'សិល្បៈត្រូវការកន្លែងស្នាក់' }) }}
        </h1>
        <p class="about-lead animate-on-scroll">
          {{ tBy({ en: 'RamaGallery was born from a simple belief: Cambodian art is extraordinary, and the world should know it.', km: 'RamaGallery កើតឡើងពីជំនឿសាមញ្ញ៖ សិល្បៈខ្មែរគឺពិសេសណាស់ ហើយពិភពលោកគួរតែដឹង។' }) }}
        </p>
      </div>
    </section>

    <!-- Stats -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.label" class="stat-item animate-on-scroll">
            <span class="stat-number gold-text">{{ stat.value }}</span>
            <span class="stat-label">{{ tBy(stat.label) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission -->
    <section class="section mission-section">
      <div class="container">
        <div class="mission-grid">
          <div class="mission-img animate-on-scroll">
            <RAImage src="https://picsum.photos/seed/about1/600/700" aspect="portrait" :watermark="false" />
          </div>
          <div class="mission-content animate-on-scroll">
            <p class="section-label">{{ tBy({ en: 'Mission', km: 'បេសកកម្ម' }) }}</p>
            <h2 class="mission-title">{{ tBy({ en: 'Bridging Tradition and Tomorrow', km: 'ភ្ជាប់ប្រពៃណីទៅអនាគត' }) }}</h2>
            <div class="mission-body">
              <p>{{ tBy({ en: 'From the intricate stone carvings of Angkor to contemporary digital expression, Cambodian artists have always told stories that transcend borders. We built RamaGallery to give those stories a permanent, beautiful, and protected home on the internet.', km: 'ពីការចម្លាក់ថ្មដ៏ស្មុគស្មាញនៃអង្គរ ដល់ការបញ្ចេញមតិឌីជីថលសម័យទំនើប វិចិត្រករខ្មែរតែងតែរៀបរាប់រឿងរ៉ាវដែលហួសពីព្រំដែន។' }) }}</p>
              <p>{{ tBy({ en: 'We are more than a platform — we are a movement to preserve, celebrate, and economically empower the artists who define Cambodian culture for generations to come.', km: 'យើងជាច្រើនជាងវេទិកា — យើងជាចលនាដើម្បីការពារ អបអរ និងផ្តល់力量ដល់វិចិត្រករ' }) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="section values-section">
      <div class="container">
        <div class="section-head animate-on-scroll" style="text-align:center">
          <p class="section-label">{{ tBy({ en: 'What We Stand For', km: 'អ្វីដែលយើងតស៊ូ' }) }}</p>
          <h2 class="section-title">{{ tBy({ en: 'Our Values', km: 'គុណតម្លៃរបស់យើង' }) }}</h2>
        </div>
        <div class="values-grid">
          <div v-for="(v, i) in values" :key="v.title.en" class="value-card animate-on-scroll" :style="{ animationDelay: `${i * 0.1}s` }">
            <div class="value-icon">{{ v.icon }}</div>
            <h3 class="value-title">{{ tBy(v.title) }}</h3>
            <p class="value-desc">{{ tBy(v.desc) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="section team-section">
      <div class="container">
        <div class="section-head animate-on-scroll">
          <p class="section-label">{{ tBy({ en: 'The People', km: 'មនុស្ស' }) }}</p>
          <h2 class="section-title">{{ tBy({ en: 'Our Team', km: 'ក្រុមការងាររបស់យើង' }) }}</h2>
        </div>
        <div class="team-grid">
          <div
            v-for="(member, i) in teams"
            :key="member.id"
            class="team-card card animate-on-scroll"
            :style="{ animationDelay: `${i * 0.1}s` }"
          >
            <img :src="member.avatar" :alt="member.name" class="team-avatar" />
            <h3 class="team-name">{{ member.name }}</h3>
            <p class="team-role">{{ tBy(member.role) }}</p>
            <p class="team-bio">{{ tBy(member.bio) }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import pagesData from '~/assets/json/pages.json'
useScrollAnimation()

const teams = pagesData.teams

const stats = [
  { value: '2,400+', label: { en: 'Artworks', km: 'ស្នាដៃ' } },
  { value: '180+', label: { en: 'Artists', km: 'វិចិត្រករ' } },
  { value: '45+', label: { en: 'Countries', km: 'ប្រទេស' } },
  { value: '12k+', label: { en: 'Collectors', km: 'អ្នកប្រមូល' } },
]

const values = [
  { icon: '🏛️', title: { en: 'Cultural Preservation', km: 'ការអភិរក្សវប្បធម៌' }, desc: { en: 'We protect and celebrate Cambodia\'s artistic heritage, from ancient traditions to emerging voices.', km: 'យើងការពារ និងអបអរសំបូរបែបសិល្បៈខ្មែរ' } },
  { icon: '🤝', title: { en: 'Artist Empowerment', km: 'ការផ្តល់力量ដល់វិចិត្រករ' }, desc: { en: 'Every tool we build puts more economic control and creative freedom in artists\' hands.', km: 'ឧបករណ៍ដែលយើងបង្កើតដាក់ Control ដល់វិចិត្រករ' } },
  { icon: '🌏', title: { en: 'Global Reach', km: 'ការឈានដល់ពិភពលោក' }, desc: { en: 'We connect Cambodian creators with collectors, galleries, and art lovers worldwide.', km: 'យើងភ្ជាប់អ្នកបង្កើតខ្មែរជាមួយអ្នកប្រមូលទូទាំងពិភពលោក' } },
  { icon: '🛡️', title: { en: 'Integrity', km: 'ភាពស្មោះត្រង់' }, desc: { en: 'We protect artists\' intellectual property with the most advanced image security available.', km: 'យើងការពារកម្មសិទ្ធិបញ្ញារបស់វិចិត្រករ' } },
]
usePageSeo(
  'About — RamaGallery',
  'The story behind Cambodia\'s premier art platform.'
)
</script>

<style scoped lang="scss">
.about-hero {
  padding: 7rem 0 5rem;
  text-align: center;
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
}
.about-title { font-size: clamp(2.5rem, 6vw, 5rem); max-width: 700px; margin: 0.75rem auto; line-height: 1.1; }
.about-lead { font-size: 1.15rem; color: var(--color-text-secondary); max-width: 560px; margin: 0 auto; line-height: 1.7; }

.stats-section { padding: 3rem 0; border-bottom: 1px solid var(--color-border); }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; text-align: center; @media (max-width: 600px) { grid-template-columns: repeat(2, 1fr); } }
.stat-item { display: flex; flex-direction: column; gap: 0.5rem; }
.stat-number { font-family: var(--font-display); font-size: 3rem; line-height: 1; }
.stat-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--color-text-muted); }

.mission-grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 5rem;
  align-items: center;

  @media (max-width: 768px) { grid-template-columns: 1fr; gap: 2rem; }
}

.mission-title { font-size: clamp(1.5rem, 3vw, 2.5rem); margin: 0.75rem 0 1.5rem; }
.mission-body { display: flex; flex-direction: column; gap: 1rem; }
.mission-body p { color: var(--color-text-secondary); line-height: 1.8; font-size: 0.95rem; }

.section-head { margin-bottom: 3rem; }
.section-title { font-size: 2.5rem; margin-top: 0.5rem; }

.values-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; }
.value-card { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 8px; padding: 2rem; transition: all var(--transition); &:hover { transform: translateY(-3px); border-color: var(--color-gold); } }
.value-icon { font-size: 2rem; margin-bottom: 1rem; }
.value-title { font-family: var(--font-display); font-size: 1.2rem; color: var(--color-text-primary); margin-bottom: 0.75rem; }
.value-desc { font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.7; }

.team-section { background: var(--color-bg-secondary); }
.team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; }
.team-card { padding: 2rem; text-align: center; }
.team-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto 1rem; display: block; border: 3px solid var(--color-gold); }
.team-name { font-family: var(--font-display); font-size: 1.2rem; color: var(--color-text-primary); }
.team-role { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-gold); margin: 0.375rem 0 0.75rem; }
.team-bio { font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.6; }
</style>
