<template>
  <div class="contact-page">
    <section class="page-hero">
      <div class="container">
        <p class="section-label animate-on-scroll">{{ tBy({ en: 'Get In Touch', km: 'ទំនាក់ទំនងមក' }) }}</p>
        <h1 class="page-title animate-on-scroll">{{ tBy({ en: 'We\'d Love to Hear From You', km: 'យើងចង់ស្តាប់ពីអ្នក' }) }}</h1>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="contact-grid">
          <!-- Form -->
          <div class="contact-form-wrap animate-on-scroll">
            <h2 class="form-title">{{ tBy({ en: 'Send a Message', km: 'ផ្ញើសារ' }) }}</h2>

            <div class="form-success" v-if="submitted">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <h3>{{ tBy({ en: 'Message sent!', km: 'សារបានផ្ញើ!' }) }}</h3>
              <p>{{ tBy({ en: 'We\'ll get back to you within 24 hours.', km: 'យើងនឹងឆ្លើយតបក្នុងរយៈពេល ២៤ ម៉ោង' }) }}</p>
            </div>

            <div v-else class="form-fields">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">{{ tBy({ en: 'Name', km: 'ឈ្មោះ' }) }}</label>
                  <input v-model="form.name" type="text" class="input" :placeholder="tBy({ en: 'Your name', km: 'ឈ្មោះរបស់អ្នក' })" />
                </div>
                <div class="form-group">
                  <label class="form-label">{{ tBy({ en: 'Email', km: 'អ៊ីមែល' }) }}</label>
                  <input v-model="form.email" type="email" class="input" :placeholder="tBy({ en: 'you@email.com', km: 'you@email.com' })" />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">{{ tBy({ en: 'Subject', km: 'ប្រធានបទ' }) }}</label>
                <select v-model="form.subject" class="input" :class="{ 'gray-placeholder': !form.subject }">
                  <option value="" disabled>{{ tBy({ en: 'Select a topic…', km: 'ជ្រើសប្រធានបទ…' }) }}</option>
                  <option>{{ tBy({ en: 'Artist Inquiry', km: 'ការស្វែងយល់អំពីវិចិត្រករ' }) }}</option>
                  <option>{{ tBy({ en: 'Collector Support', km: 'ជំនួយអ្នកប្រមូល' }) }}</option>
                  <option>{{ tBy({ en: 'Partnership', km: 'ភាពជាដៃគូ' }) }}</option>
                  <option>{{ tBy({ en: 'Technical Support', km: 'ជំនួយបច្ចេកទេស' }) }}</option>
                  <option>{{ tBy({ en: 'Other', km: 'ផ្សេងទៀត' }) }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">{{ tBy({ en: 'Message', km: 'សារ' }) }}</label>
                <textarea v-model="form.message" class="input textarea" rows="5" :placeholder="tBy({ en: 'Tell us how we can help…', km: 'ប្រាប់យើងអំពីរបៀបដែលយើងអាចជួយ…' })" />
              </div>
              <button class="btn btn-primary submit-btn" @click="handleSubmit" :disabled="isSubmitting">
                <span v-if="isSubmitting">{{ tBy({ en: 'Sending…', km: 'កំពុងផ្ញើ…' }) }}</span>
                <span v-else>{{ tBy({ en: 'Send Message', km: 'ផ្ញើសារ' }) }}</span>
              </button>
            </div>
          </div>

          <!-- Info -->
          <div class="contact-info animate-on-scroll">
            <h2 class="info-title">{{ tBy({ en: 'Contact Info', km: 'ព័ត៌មានទំនាក់ទំនង' }) }}</h2>
            <div class="info-list">
              <div v-for="info in contactInfo" :key="info.label.en" class="info-item">
                <div class="info-icon">{{ info.icon }}</div>
                <div>
                  <p class="info-label">{{ tBy(info.label) }}</p>
                  <p class="info-value">{{ info.value }}</p>
                </div>
              </div>
            </div>

            <div class="map-placeholder">
              <div class="map-inner">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <p>Phnom Penh, Cambodia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useScrollAnimation()

const form = reactive({ name: '', email: '', subject: '', message: '' })
const submitted = ref(false)
const isSubmitting = ref(false)

const contactInfo = [
  { icon: '📍', label: { en: 'Address', km: 'អាសយដ្ឋាន' }, value: 'Street 240, Daun Penh, Phnom Penh, Cambodia' },
  { icon: '📧', label: { en: 'Email', km: 'អ៊ីមែល' }, value: 'hello@ramagallery.com' },
  { icon: '📱', label: { en: 'Phone', km: 'ទូរស័ព្ទ' }, value: '+855 23 123 456' },
  { icon: '🕐', label: { en: 'Hours', km: 'ម៉ោងធ្វើការ' }, value: 'Mon–Fri 9am–6pm ICT' },
]

async function handleSubmit() {
  if (!form.name || !form.email || !form.message) return
  isSubmitting.value = true
  await new Promise(r => setTimeout(r, 1200))
  isSubmitting.value = false
  submitted.value = true
}

useSeoMeta({ title: 'Contact — RamaGallery', description: 'Get in touch with the RamaGallery team.' })
</script>

<style scoped lang="scss">
.page-hero { padding: 5rem 0 3rem; text-align: center; background: linear-gradient(to bottom, var(--color-bg-secondary), var(--color-bg)); border-bottom: 1px solid var(--color-border); }
.page-title { font-size: clamp(2rem, 5vw, 3.5rem); margin: 0.5rem 0; }

.contact-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 4rem; @media (max-width: 768px) { grid-template-columns: 1fr; gap: 2rem; } }

.form-title, .info-title { font-family: var(--font-); font-size: 1.5rem; margin-bottom: 1.5rem; }
.form-fields { display: flex; flex-direction: column; gap: 1.25rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; @media (max-width: 500px) { grid-template-columns: 1fr; } }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-label { font-size: 0.8rem; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--color-text-secondary); }
.textarea { resize: vertical; min-height: 120px; font-family: var(--font-400); }
.submit-btn { width: 100%; justify-content: center; }

.form-success { text-align: center; padding: 3rem 0; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; h3 { font-family: var(--font-display); font-size: 1.5rem; } p { color: var(--color-text-secondary); } }

.info-list { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2rem; }
.info-item { display: flex; align-items: flex-start; gap: 1rem; }
.info-icon { font-size: 1.25rem; flex-shrink: 0; }
.info-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-muted); margin-bottom: 0.25rem; }
.info-value { font-size: 0.9rem; color: var(--color-text-primary); }

.map-placeholder {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  .map-inner { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
  p { font-size: 0.875rem; color: var(--color-text-secondary); }
}
</style>
