<template>
  <div class="contact-page">
    <section id="contact" class="page-hero">
      <div class="container">
        <p class="section-label animate-on-scroll">{{ tBy({ en: 'Reach Out', km: 'ទំនាក់ទំនង' }) }}</p>
        <h1 class="page-title animate-on-scroll delay-1">{{ tBy({ en: "We'd Love to Hear From You", km: 'យើងចង់ស្តាប់ពីអ្នក' }) }}</h1>
        <p class="page-subtitle animate-on-scroll delay-2">{{ tBy({ en: 'Whether artist, collector, or partner — our team is ready', km: 'ថ្វីបើអ្នកជាវិចិត្រករ អ្នកប្រមូល ឬដៃគូ — ក្រុមការងារពួកយើងត្រៀម' }) }}</p>
      </div>
    </section>

    <section id="contact-form" class="section">
      <div class="container">
        <div class="contact-grid">
          <div class="form-wrap animate-on-scroll slide-right">
            <div v-if="submitted" class="success-state">
              <div class="success-icon-wrap">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h2 class="success-title">{{ tBy({ en: 'Message Sent!', km: 'សារបានផ្ញើ!' }) }}</h2>
              <p class="success-sub">{{ tBy({ en: "We'll reply within 24 hours.", km: 'យើងនឹងឆ្លើយតបក្នុង ២៤ ម៉ោង' }) }}</p>
              <button class="btn btn-outline" @click="submitted = false">{{ tBy({ en: 'Send another', km: 'ផ្ញើមួយទៀត' }) }}</button>
            </div>
            <div v-else class="form-fields">
              <h2 class="form-title">{{ tBy({ en: 'Send a Message', km: 'ផ្ញើសារ' }) }}</h2>
              <div class="form-row">
                <div class="form-group"><label class="form-label">{{ tBy({ en: 'Full Name', km: 'ឈ្មោះ' }) }} *</label><input v-model="form.name" type="text" class="input" :placeholder="tBy({ en: 'Your name', km: 'ឈ្មោះ' })" /></div>
                <div class="form-group"><label class="form-label">{{ tBy({ en: 'Email', km: 'អ៊ីមែល' }) }} *</label><input v-model="form.email" type="email" class="input" placeholder="you@email.com" /></div>
              </div>
              <div class="form-group">
                <label class="form-label">{{ tBy({ en: 'I am a…', km: 'ខ្ញុំជា…' }) }}</label>
                <div class="who-opts">
                  <label v-for="w in whoOptions" :key="w.v" class="who-opt" :class="{ selected: form.who === w.v }"><input type="radio" v-model="form.who" :value="w.v" class="hidden" /><span>{{ tBy(w.l) }}</span></label>
                </div>
              </div>
              <div class="form-group"><label class="form-label">{{ tBy({ en: 'Subject', km: 'ប្រធានបទ' }) }}</label><select v-model="form.subject" class="input"><option value="">{{ tBy({ en: 'Select…', km: 'ជ្រើស…' }) }}</option><option v-for="s in subjects" :key="s.en" :value="s.en">{{ tBy(s) }}</option></select></div>
              <div class="form-group"><label class="form-label">{{ tBy({ en: 'Message', km: 'សារ' }) }} *</label><textarea v-model="form.message" class="input contact-textarea" rows="6" :placeholder="tBy({ en: 'How can we help…', km: 'យើងអាចជួយ…' })" /></div>
              <button class="btn btn-primary submit-btn" @click="handleSubmit" :disabled="!isValid || isSending">
                <svg v-if="isSending" class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                {{ isSending ? tBy({ en: 'Sending…', km: 'កំពុងផ្ញើ…' }) : tBy({ en: 'Send Message', km: 'ផ្ញើសារ' }) }}
              </button>
            </div>
          </div>

          <aside class="contact-aside animate-on-scroll slide-left delay-2">
            <div class="aside-section">
              <p class="section-label">{{ tBy({ en: 'Contact Info', km: 'ព័ត៌មាន' }) }}</p>
              <div class="info-list">
                <div v-for="info in contactInfo" :key="info.label.en" class="info-item"><i :class="`info-icon ${info.icon}`"></i><div><p class="info-label">{{ tBy(info.label) }}</p><p class="info-value">{{ info.value }}</p></div></div>
              </div>
            </div>
            <div class="divider" />
            <div class="aside-section">
              <p class="section-label">{{ tBy({ en: 'Follow Us', km: 'តាមដាន' }) }}</p>
              <div class="social-list">
                <a v-for="s in socials" :key="s.name" :href="s.href" target="_blank" rel="noopener noreferrer" class="social-item"><i :class="`social-icon ${s.icon}`"></i><span>{{ s.name }}</span></a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section id="contact-faq" class="section faq-section">
      <div class="container">
        <div class="section-head animate-on-scroll"><p class="section-label">{{ tBy({ en: 'Quick Answers', km: 'ចម្លើយ' }) }}</p><h2 class="section-title animate-on-scroll delay-1">{{ tBy({ en: 'Common Questions', km: 'សំណួរទូទៅ' }) }}</h2></div>
        <div class="faq-grid">
          <div v-for="(faq, i) in faqs" :key="faq.q.en" class="faq-card card animate-on-scroll" :class="`delay-${i+1}`"><h3 class="faq-q">{{ tBy(faq.q) }}</h3><p class="faq-a">{{ tBy(faq.a) }}</p></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { t } = useI18n();
useScrollAnimation()
const submitted = ref(false)
const isSending = ref(false)
const form = reactive({ name: '', email: '', who: 'artist', subject: '', message: '' })
const isValid = computed(() => form.name && form.email && form.message)
const whoOptions = [{ v: 'artist', l: { en: 'Artist', km: 'វិចិត្រករ' } }, { v: 'collector', l: { en: 'Collector', km: 'អ្នកប្រមូល' } }, { v: 'partner', l: { en: 'Partner', km: 'ដៃគូ' } }, { v: 'other', l: { en: 'Other', km: 'ផ្សេង' } }]
const subjects = [{ en: 'Artist Inquiry', km: 'ការស្វែងយល់' }, { en: 'Collector Support', km: 'ជំនួយ' }, { en: 'Partnership', km: 'ភាពជាដៃគូ' }, { en: 'Technical Support', km: 'ជំនួយបច្ចេកទេស' }, { en: 'Press & Media', km: 'ព័ត៌មាន' }, { en: 'Other', km: 'ផ្សេង' }]
const contactInfo = [{ icon: 'ri:home-2-fill', label: { en: 'Address', km: 'អាសយដ្ឋាន' }, value: 'Street 240, Daun Penh, Phnom Penh' }, { icon: 'ri:mail-fill', label: { en: 'Email', km: 'អ៊ីមែល' }, value: 'hello@ramagallery.com' }, { icon: 'ri:phone-fill', label: { en: 'Phone', km: 'ទូរស័ព្ទ' }, value: '+855 23 123 456' }, { icon: 'ri:time-fill', label: { en: 'Hours', km: 'ម៉ោង' }, value: 'Mon–Fri 9:00–18:00 ICT' }]
const socials = [{ name: 'Facebook', href: 'https://facebook.com/ramagallery', icon: 'ri-facebook-fill' }, { name: 'Instagram', href: 'https://instagram.com/ramagallery', icon: 'ri-instagram-line' }, { name: 'Twitter/X', href: 'https://twitter.com/ramagallery', icon: 'ri-twitter-line' }]
const faqs = [{ q: { en: 'How do I list my artwork?', km: 'ខ្ញុំដាក់ស្នាដៃដូចម្ដេច?' }, a: { en: 'Register free, complete your artist profile, and upload in minutes.', km: 'ចុះឈ្មោះ បំពេញប្រវត្តិ ហើយបញ្ចូលស្នាដៃ' } }, { q: { en: 'How does image protection work?', km: 'ការការពាររូបភាព?' }, a: { en: 'We use signed URLs, watermarks, and anti-scraping JavaScript.', km: 'យើងប្រើ signed URL ស្លាកទឹក និង JavaScript' } }, { q: { en: 'Is there a sales commission?', km: 'តើមាន Hand sale?' }, a: { en: '10% platform commission. Artists keep 90% of every sale.', km: 'ការ commission ១០%  វិចិត្រករ ទទួល 90%' } }, { q: { en: 'Do you support Khmer language?', km: 'គាំទ្រភាសាខ្មែរ?' }, a: { en: 'Yes — the entire platform is bilingual in Khmer and English.', km: 'បាទ/ចាស — វេទិកា ជា ពីរ ភាសា' } }]
async function handleSubmit() { if (!isValid.value) return; isSending.value = true; await new Promise(r => setTimeout(r, 1200)); isSending.value = false; submitted.value = true }
useSeoMeta({ title: t('Contact — RamaGallery') })
</script>

<style scoped lang="scss">
.page-hero { padding: 5.5rem 0 3rem; text-align: center; background: linear-gradient(180deg, var(--color-bg-secondary) 0%, var(--color-bg) 100%); border-bottom: 1px solid var(--color-border); }
.page-title { font-size: clamp(2.5rem, 6vw, 4.5rem); margin: 0.5rem 0; }
.page-subtitle { color: var(--color-text-secondary); max-width: 520px; margin: 0 auto; }
.contact-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 4rem; align-items: start; @media (max-width: 900px) { grid-template-columns: 1fr; gap: 2.5rem; } }
.form-title { font-family: var(--font-display); font-size: 1.75rem; margin-bottom: 1.75rem; }
.form-fields { display: flex; flex-direction: column; gap: 1.25rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; @media (max-width: 500px) { grid-template-columns: 1fr; } }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-secondary); }
.contact-textarea { resize: vertical; font-family: var(--font-sans); min-height: 140px; }
.submit-btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.who-opts { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.who-opt { padding: 0.4rem 1rem; border: 1px solid var(--color-border); border-radius: 20px; font-size: 0.8rem; cursor: pointer; transition: all var(--transition); color: var(--color-text-secondary); &.selected { border-color: var(--color-gold); color: var(--color-gold); background: rgba(200,149,28,0.08); } }
.success-state { text-align: center; padding: 4rem 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.success-icon-wrap { width: 80px; height: 80px; background: rgba(200,149,28,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.success-title { font-family: var(--font-display); font-size: 2rem; }
.success-sub { color: var(--color-text-secondary); }
.contact-aside { display: flex; flex-direction: column; gap: 1.5rem; }
.aside-section { display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1rem; }
.info-list { display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1rem; }
.info-item { display: flex; align-items: flex-start; gap: 0.875rem; }
.info-icon { font-size: 1.1rem; flex-shrink: 0; }
.info-label { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-muted); margin-bottom: 0.2rem; }
.info-value { font-size: 0.9rem; color: var(--color-text-primary); }
.social-list { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; }
.social-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); text-decoration: none; font-size: 0.875rem; color: var(--color-text-secondary); transition: all var(--transition); &:hover { border-color: var(--color-gold); color: var(--color-gold); transform: translateX(4px); } }
.divider { height: 1px; background: var(--color-border); }
.faq-section { background: var(--color-bg-secondary); }
.section-head { margin-bottom: 2.5rem; }
.section-title { font-size: clamp(2rem, 4vw, 3rem); margin-top: 0.5rem; }
.faq-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
.faq-card { padding: 1.75rem; transition: all var(--transition); &:hover { transform: translateY(-3px); border-color: var(--color-gold); } }
.faq-q { font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 0.875rem; }
.faq-a { font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.7; }
.hidden { display: none; }
.spin-icon { animation: spin 1s linear infinite; }
</style>
