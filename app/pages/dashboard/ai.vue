<template>
  <div class="ai-page">
    <div class="ai-header animate-on-scroll">
      <p class="section-label">{{ tBy({ en: 'Powered by AI', km: 'ขับ​ Movement​ ដោយ AI' }) }}</p>
      <h1 class="ai-title">{{ t('dashboard.ai_tools') }}</h1>
      <p class="ai-sub">{{ tBy({ en: 'Generate captions, tags, SEO descriptions, and upscale your images', km: 'បង្កើតចំណងជើង ស្លាក ពិពណ៌នា SEO និងដំឡើងរូបភាព' }) }}</p>
    </div>

    <div class="ai-tools-grid">
      <!-- Caption Generator -->
      <div class="tool-card card animate-on-scroll delay-1">
        <div class="tc-head">
          <div class="tc-icon">✍️</div>
          <div>
            <h3 class="tc-title">{{ tBy({ en: 'Caption Generator', km: 'បង្កើតចំណងជើង' }) }}</h3>
            <p class="tc-sub">{{ tBy({ en: 'Write compelling artwork descriptions instantly', km: 'សរសេរការពិពណ៌នាស្នាដៃយ៉ាងឆាប់រហ័ស' }) }}</p>
          </div>
        </div>
        <textarea v-model="captionPrompt" class="input tool-textarea" :placeholder="tBy({ en: 'Describe your artwork briefly (style, subject, technique)…', km: 'ពិពណ៌នាស្នាដៃខ្លីៗ…' })" rows="3" />
        <button class="btn btn-primary tool-btn" @click="generateCaption" :disabled="captionLoading">
          <svg v-if="captionLoading" class="spin-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          {{ captionLoading ? tBy({ en: 'Generating…', km: 'កំពុងបង្កើត…' }) : tBy({ en: 'Generate Caption', km: 'បង្កើតចំណងជើង' }) }}
        </button>
        <div v-if="captionResult" class="tool-result">
          <div class="tr-header">
            <span class="tr-label">{{ tBy({ en: 'Generated Caption:', km: 'ចំណងជើងបានបង្កើត:' }) }}</span>
            <button class="copy-btn" @click="copy(captionResult)" :data-tooltip="tBy({ en: 'Copy', km: 'ចម្លង' })">📋</button>
          </div>
          <p class="tr-text">{{ captionResult }}</p>
        </div>
      </div>

      <!-- Tag Suggester -->
      <div class="tool-card card animate-on-scroll delay-2">
        <div class="tc-head">
          <div class="tc-icon">🏷️</div>
          <div>
            <h3 class="tc-title">{{ tBy({ en: 'Smart Tagging', km: 'ស្លាកឆ្លាត' }) }}</h3>
            <p class="tc-sub">{{ tBy({ en: 'Auto-suggest SEO-optimised tags for discoverability', km: 'ស្នើស្លាក SEO ដោយស្វ័យប្រវត្តិ' }) }}</p>
          </div>
        </div>
        <input v-model="tagPrompt" type="text" class="input" :placeholder="tBy({ en: 'Artwork title or keywords…', km: 'ចំណងជើង ឬ​ ពាក្យគន្លឹះ…' })" />
        <button class="btn btn-primary tool-btn" @click="generateTags" :disabled="tagLoading">
          {{ tagLoading ? tBy({ en: 'Suggesting…', km: 'កំពុងស្នើ…' }) : tBy({ en: 'Suggest Tags', km: 'ស្នើស្លាក' }) }}
        </button>
        <div v-if="tagResult.length" class="tag-chips">
          <button v-for="tag in tagResult" :key="tag" class="tag tag-gold" @click="copy(tag)">{{ tag }}</button>
        </div>
      </div>

      <!-- SEO Description -->
      <div class="tool-card card animate-on-scroll delay-3">
        <div class="tc-head">
          <div class="tc-icon">📈</div>
          <div>
            <h3 class="tc-title">{{ tBy({ en: 'SEO Description', km: 'ពិពណ៌នា SEO' }) }}</h3>
            <p class="tc-sub">{{ tBy({ en: 'Write search-engine-optimised descriptions', km: 'សរសេរការពិពណ៌នាបង្កើនប្រសិទ្ធភាព SEO' }) }}</p>
          </div>
        </div>
        <div class="seo-form">
          <input v-model="seoTitle" type="text" class="input" :placeholder="tBy({ en: 'Artwork title', km: 'ចំណងជើងស្នាដៃ' })" />
          <select v-model="seoCategory" class="input">
            <option value="">{{ tBy({ en: 'Category', km: 'ប្រភេទ' }) }}</option>
            <option v-for="c in ['Painting','Sculpture','Photography','Digital','Traditional']" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <button class="btn btn-primary tool-btn" @click="generateSEO" :disabled="seoLoading">
          {{ seoLoading ? tBy({ en: 'Writing…', km: 'កំពុងសរសេរ…' }) : tBy({ en: 'Generate SEO Text', km: 'បង្កើតអត្ថបទ SEO' }) }}
        </button>
        <div v-if="seoResult" class="tool-result">
          <div class="tr-header">
            <span class="tr-label">SEO:</span>
            <button class="copy-btn" @click="copy(seoResult)"><i class="fa-solid fa-copy"></i></button>
          </div>
          <p class="tr-text">{{ seoResult }}</p>
        </div>
      </div>

      <!-- Style Analysis -->
      <div class="tool-card card animate-on-scroll delay-4">
        <div class="tc-head">
          <div class="tc-icon"><i class="fa-solid fa-palette"></i></div>
          <div>
            <h3 class="tc-title">{{ tBy({ en: 'Style Analysis', km: 'វិភាគស្ទីល' }) }}</h3>
            <p class="tc-sub">{{ tBy({ en: 'Identify your artistic influences and style fingerprint', km: 'កំណត់ឥទ្ធិពលសិល្បៈ និងចំណុចពិសេសសិល្បៈ' }) }}</p>
          </div>
        </div>
        <div class="style-upload" @click="styleInput?.click()">
          <img v-if="stylePreview" :src="stylePreview" class="style-preview" />
          <div v-else class="su-placeholder">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span>{{ tBy({ en: 'Upload artwork image', km: 'បញ្ចូលរូបភាពស្នាដៃ' }) }}</span>
          </div>
        </div>
        <input ref="styleInput" type="file" accept="image/*" class="hidden" @change="handleStyleUpload" />
        <button class="btn btn-primary tool-btn" @click="analyseStyle" :disabled="!stylePreview || styleLoading">
          {{ styleLoading ? tBy({ en: 'Analysing…', km: 'កំពុងវិភាគ…' }) : tBy({ en: 'Analyse Style', km: 'វិភាគស្ទីល' }) }}
        </button>
        <div v-if="styleResult" class="style-result">
          <div v-for="inf in styleResult" :key="inf.label" class="style-item">
            <div class="si-header">
              <span class="si-label">{{ inf.label }}</span>
              <span class="si-pct">{{ inf.pct }}%</span>
            </div>
            <div class="si-bar"><div class="si-fill" :style="{ width: `${inf.pct}%` }" /></div>
          </div>
        </div>
      </div>

      <!-- Image Upscale -->
      <div class="tool-card card animate-on-scroll delay-5" style="grid-column: 1 / -1">
        <div class="tc-head">
          <div class="tc-icon"><i class="fa-solid fa-expand"></i></div>
          <div>
            <h3 class="tc-title">{{ tBy({ en: 'Image Upscale', km: 'ដំឡើងរូបភាព' }) }}</h3>
            <p class="tc-sub">{{ tBy({ en: 'Enhance resolution up to 4× without quality loss using AI super-resolution', km: 'ប្រសើរ Resolution រហូតដល់ 4× ដោយគ្មានការបាត់បង់គុណភាព' }) }}</p>
          </div>
        </div>
        <div class="upscale-grid">
          <div class="upscale-drop card" @click="upscaleInput?.click()">
            <img v-if="upscalePreview" :src="upscalePreview" class="up-preview" />
            <div v-else class="upd-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <p>{{ tBy({ en: 'Upload image to upscale', km: 'បញ្ចូលរូបភាពដើម្បីដំឡើង' }) }}</p>
            </div>
          </div>
          <div class="upscale-controls">
            <input ref="upscaleInput" type="file" accept="image/*" class="hidden" @change="handleUpscaleUpload" />
            <div class="form-group">
              <label class="form-label">{{ tBy({ en: 'Scale Factor', km: 'ទំហំ' }) }}</label>
              <div class="scale-opts">
                <button v-for="s in [2, 3, 4]" :key="s" class="scale-btn" :class="{ active: scaleFactor === s }" @click="scaleFactor = s">{{ s }}×</button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">{{ tBy({ en: 'Format', km: 'ទ្រង់ទ្រាយ' }) }}</label>
              <select v-model="upscaleFormat" class="input">
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
                <option value="webp">WEBP</option>
              </select>
            </div>
            <button class="btn btn-primary" :disabled="!upscalePreview || upscaleLoading" @click="runUpscale" style="width:100%">
              <svg v-if="upscaleLoading" class="spin-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              {{ upscaleLoading ? tBy({ en: 'Processing…', km: 'កំពុងដំណើរការ…' }) : tBy({ en: `Upscale ${scaleFactor}×`, km: `ដំឡើង ${scaleFactor}×` }) }}
            </button>
            <div v-if="upscaleDone" class="upscale-done">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {{ tBy({ en: 'Upscale complete — download ready', km: 'រួចរាល់ — ការទាញ​យក​ត្រៀម' }) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Credits indicator -->
    <div class="credits-bar animate-on-scroll">
      <div class="cb-inner">
        <span class="cb-label">{{ tBy({ en: 'AI Credits remaining', km: 'ស្លាក AI ​នៅសល់' }) }}</span>
        <div class="cb-bar"><div class="cb-fill" style="width: 60%" /></div>
        <span class="cb-count">30 / 50</span>
      </div>
      <NuxtLink to="/services#pricing" class="btn btn-outline btn-sm">{{ tBy({ en: 'Get more credits', km: 'ទទួលបានស្លាកបន្ថែម' }) }}</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
useScrollAnimation()

// Caption
const captionPrompt = ref('')
const captionResult = ref('')
const captionLoading = ref(false)

// Tags
const tagPrompt = ref('')
const tagResult = ref<string[]>([])
const tagLoading = ref(false)

// SEO
const seoTitle = ref('')
const seoCategory = ref('')
const seoResult = ref('')
const seoLoading = ref(false)

// Style
const styleInput = ref<HTMLInputElement>()
const stylePreview = ref('')
const styleLoading = ref(false)
const styleResult = ref<{ label: string; pct: number }[]>([])

// Upscale
const upscaleInput = ref<HTMLInputElement>()
const upscalePreview = ref('')
const upscaleLoading = ref(false)
const upscaleDone = ref(false)
const scaleFactor = ref(2)
const upscaleFormat = ref('jpg')

async function generateCaption() {
  if (!captionPrompt.value) return
  captionLoading.value = true
  await new Promise(r => setTimeout(r, 1200))
  captionResult.value = tBy({
    en: `A compelling work that ${captionPrompt.value.slice(0, 60)}… — rendered with exquisite attention to light, texture, and cultural resonance. A bridge between ancient Khmer heritage and contemporary artistic vision.`,
    km: `ស្នាដៃដ៏ស្រស់ស្អាតដែល ${captionPrompt.value.slice(0, 40)}… — ផ្ដោតលើពន្លឺ ផ្ទៃ និងអត្ថន័យវប្បធម៌`
  })
  captionLoading.value = false
}

async function generateTags() {
  if (!tagPrompt.value) return
  tagLoading.value = true
  await new Promise(r => setTimeout(r, 800))
  tagResult.value = ['cambodia', 'khmer-art', 'contemporary', 'southeast-asia', tagPrompt.value.toLowerCase().replace(/\s+/g, '-'), 'ramagallery', 'gallery', 'collector']
  tagLoading.value = false
}

async function generateSEO() {
  if (!seoTitle.value) return
  seoLoading.value = true
  await new Promise(r => setTimeout(r, 1000))
  seoResult.value = tBy({
    en: `Discover "${seoTitle.value}" — an original ${seoCategory.value || 'artwork'} by a Cambodian artist. Available exclusively on RamaGallery, Cambodia's premier digital art platform. Shop, collect, and celebrate authentic Khmer creativity.`,
    km: `រកឃើញ "${seoTitle.value}" — ស្នាដៃ${seoCategory.value || ''} ដើម ដោយវិចិត្រករខ្មែរ។ អាចរកបានតែនៅ RamaGallery។`
  })
  seoLoading.value = false
}

function handleStyleUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) stylePreview.value = URL.createObjectURL(file)
}

async function analyseStyle() {
  styleLoading.value = true
  await new Promise(r => setTimeout(r, 1500))
  styleResult.value = [
    { label: 'Khmer Classical',   pct: 72 },
    { label: 'Contemporary Asian', pct: 18 },
    { label: 'Abstract Expressionism', pct: 10 },
  ]
  styleLoading.value = false
}

function handleUpscaleUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) { upscalePreview.value = URL.createObjectURL(file); upscaleDone.value = false }
}

async function runUpscale() {
  upscaleLoading.value = true
  await new Promise(r => setTimeout(r, 2000))
  upscaleLoading.value = false
  upscaleDone.value = true
}

function copy(text: string) {
  if (import.meta.client) navigator.clipboard?.writeText(text)
}
</script>

<style scoped lang="scss">
.ai-page { padding: 3rem 0 6rem; max-width: 900px; margin: 0 auto; padding-left: var(--container-pad); padding-right: var(--container-pad); }
.ai-header { margin-bottom: 2.5rem; }
.ai-title { font-size: 2.25rem; margin: 0.5rem 0; }
.ai-sub { color: var(--color-text-secondary); }

.ai-tools-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; @media (max-width: 700px) { grid-template-columns: 1fr; } }

.tool-card { padding: 1.75rem; display: flex; flex-direction: column; gap: 1rem; }
.tc-head { display: flex; align-items: flex-start; gap: 1rem; }
.tc-icon { font-size: 1.75rem; flex-shrink: 0; }
.tc-title { font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 0.2rem; }
.tc-sub { font-size: 0.78rem; color: var(--color-text-muted); line-height: 1.5; }
.tool-textarea { resize: vertical; font-family: var(--font-sans); }
.tool-btn { align-self: flex-start; display: flex; align-items: center; gap: 0.5rem; }

.tool-result { background: var(--color-bg-secondary); border-left: 3px solid var(--color-gold); padding: 0.875rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
.tr-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.375rem; }
.tr-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-gold); }
.copy-btn { background: none; border: none; cursor: pointer; font-size: 1rem; transition: transform var(--transition); &:hover { transform: scale(1.2); } }
.tr-text { font-size: 0.875rem; color: var(--color-text-primary); line-height: 1.65; }

.tag-chips { display: flex; flex-wrap: wrap; gap: 0.375rem; }

.seo-form { display: flex; flex-direction: column; gap: 0.625rem; }

.style-upload { border: 2px dashed var(--color-border); border-radius: var(--radius-md); min-height: 120px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: border-color var(--transition); overflow: hidden; &:hover { border-color: var(--color-gold); } }
.style-preview { width: 100%; height: 120px; object-fit: cover; }
.su-placeholder { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--color-text-muted); font-size: 0.82rem; padding: 1.5rem; }

.style-result { display: flex; flex-direction: column; gap: 0.875rem; }
.style-item { padding: 0.875rem; background: var(--color-bg-secondary); border-left: 3px solid var(--color-gold); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
.si-header { display: flex; justify-content: space-between; margin-bottom: 0.35rem; font-size: 0.8rem; }
.si-label { color: var(--color-text-secondary); }
.si-pct { color: var(--color-gold); font-weight: 600; }
.si-bar { height: 6px; background: var(--color-bg-secondary); border-radius: 3px; overflow: hidden; }
.si-fill { height: 100%; background: linear-gradient(90deg, var(--color-gold), var(--color-gold-light)); border-radius: 3px; transition: width 0.8s var(--ease-out); }

.upscale-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; @media (max-width: 600px) { grid-template-columns: 1fr; } }
.upscale-drop { min-height: 200px; cursor: pointer; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 2px dashed var(--color-border); &:hover { border-color: var(--color-gold); } }
.up-preview { width: 100%; height: 100%; object-fit: cover; }
.upd-placeholder { display: flex; flex-direction: column; align-items: center; gap: 0.625rem; color: var(--color-text-muted); font-size: 0.82rem; text-align: center; padding: 1.5rem; }
.upscale-controls { display: flex; flex-direction: column; gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-secondary); }
.scale-opts { display: flex; gap: 0.5rem; }
.scale-btn { flex: 1; padding: 0.5rem; border: 1px solid var(--color-border); background: var(--color-bg-secondary); border-radius: var(--radius-sm); font-family: var(--font-sans); font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all var(--transition); &.active { border-color: var(--color-gold); background: rgba(200,149,28,0.1); color: var(--color-gold); } }
.upscale-done { display: flex; align-items: center; gap: 0.5rem; font-size: 0.83rem; color: var(--color-text-secondary); }

.credits-bar { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
.cb-inner { display: flex; align-items: center; gap: 1rem; flex: 1; }
.cb-label { font-size: 0.8rem; color: var(--color-text-secondary); white-space: nowrap; }
.cb-bar { flex: 1; height: 6px; background: var(--color-bg-secondary); border-radius: 3px; overflow: hidden; }
.cb-fill { height: 100%; background: linear-gradient(90deg, var(--color-gold), var(--color-gold-light)); border-radius: 3px; }
.cb-count { font-size: 0.8rem; color: var(--color-gold); font-weight: 600; white-space: nowrap; }

.hidden { display: none; }
.spin-icon { animation: spin 1s linear infinite; }
</style>
