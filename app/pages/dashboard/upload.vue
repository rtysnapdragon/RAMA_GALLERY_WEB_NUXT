<template>
  <div class="upload-page">
    <div class="up-header animate-on-scroll">
      <div>
        <p class="section-label">{{ tBy({ en: 'Share Your Work', km: 'ចែករំលែកស្នាដៃ' }) }}</p>
        <h1 class="up-title">{{ tBy({ en: 'Upload Artwork', km: 'បញ្ចូលស្នាដៃ' }) }}</h1>
      </div>
    </div>

    <div class="up-form-wrap">
      <!-- Step indicator -->
      <div class="steps animate-on-scroll delay-1">
        <div v-for="(step, i) in steps" :key="step.en" class="step" :class="{ active: currentStep === i, done: currentStep > i }">
          <div class="step-circle">
            <svg v-if="currentStep > i" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="step-label">{{ tBy(step) }}</span>
        </div>
      </div>

      <!-- Step 1: Upload image -->
      <div v-if="currentStep === 0" class="step-panel card animate-on-scroll delay-2">
        <h2 class="panel-title">{{ tBy({ en: 'Upload Image', km: 'បញ្ចូលរូបភាព' }) }}</h2>
        <div
          class="drop-zone"
          :class="{ dragging: isDragging, 'has-file': previewUrl }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          @click="fileInput?.click()"
        >
          <template v-if="!previewUrl">
            <div class="dz-icon"><i class="fa-solid fa-image"></i></div>
            <p class="dz-primary">{{ tBy({ en: 'Drop your artwork here', km: 'ទម្លាក់ស្នាដៃនៅទីនេះ' }) }}</p>
            <p class="dz-secondary">{{ tBy({ en: 'or click to browse — JPG, PNG, WEBP up to 50MB', km: 'ឬចុចដើម្បីរកមើល — JPG, PNG, WEBP រហូតដល់ 50MB' }) }}</p>
          </template>
          <template v-else>
            <img :src="previewUrl" alt="Preview" class="dz-preview" />
            <div class="dz-change-overlay">
              <span>{{ tBy({ en: 'Change image', km: 'ប្តូររូបភាព' }) }}</span>
            </div>
          </template>
        </div>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFile" />
        <button class="btn btn-primary step-btn" :disabled="!previewUrl" @click="currentStep = 1">
          {{ tBy({ en: 'Continue', km: 'បន្ត' }) }} →
        </button>
      </div>

      <!-- Step 2: Details -->
      <div v-if="currentStep === 1" class="step-panel card animate-on-scroll delay-2">
        <h2 class="panel-title">{{ tBy({ en: 'Artwork Details', km: 'ព័ត៌មានស្នាដៃ' }) }}</h2>
        <div class="form-grid">
          <div class="form-group col-span-2">
            <label class="form-label">{{ tBy({ en: 'Title (English)', km: 'ចំណងជើង (អង់គ្លេស)' }) }} *</label>
            <input v-model="form.title" type="text" class="input" :placeholder="tBy({ en: 'e.g. Apsara in Gold', km: 'ឧ. អប្សរក្នុងមាស' })" />
          </div>
          <div class="form-group col-span-2">
            <label class="form-label">{{ tBy({ en: 'Title (Khmer)', km: 'ចំណងជើង (ខ្មែរ)' }) }}</label>
            <input v-model="form.title_km" type="text" class="input khmer" :placeholder="tBy({ en: 'ចំណងជើងជាភាសាខ្មែរ', km: 'ចំណងជើងជាភាសាខ្មែរ' })" />
          </div>
          <div class="form-group">
            <label class="form-label">{{ tBy({ en: 'Category', km: 'ប្រភេទ' }) }} *</label>
            <select v-model="form.category" class="input">
              <option value="">{{ tBy({ en: 'Select…', km: 'ជ្រើស…' }) }}</option>
              <option value="painting">{{ tBy({ en: 'Painting', km: 'គំនូរ' }) }}</option>
              <option value="sculpture">{{ tBy({ en: 'Sculpture', km: 'ចម្លាក់' }) }}</option>
              <option value="digital">{{ tBy({ en: 'Digital', km: 'ឌីជីថល' }) }}</option>
              <option value="photography">{{ tBy({ en: 'Photography', km: 'ថតរូប' }) }}</option>
              <option value="traditional">{{ tBy({ en: 'Traditional', km: 'បុរាណ' }) }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">{{ tBy({ en: 'Year Created', km: 'ឆ្នាំបង្កើត' }) }}</label>
            <input v-model="form.year" type="number" class="input" :placeholder="new Date().getFullYear().toString()" min="1900" :max="new Date().getFullYear()" />
          </div>
          <div class="form-group col-span-2">
            <label class="form-label">{{ tBy({ en: 'Description', km: 'ការពិពណ៌នា' }) }}</label>
            <textarea v-model="form.description" class="input" rows="4" :placeholder="tBy({ en: 'Describe your artwork — technique, inspiration, meaning…', km: 'ពិពណ៌នាស្នាដៃ — បច្ចេកទេស ការលើកទឹកចិត្ត…' })" />
          </div>
          <div class="form-group">
            <label class="form-label">{{ tBy({ en: 'Price (USD)', km: 'តម្លៃ (ដុល្លារ)' }) }}</label>
            <div class="input-prefix-wrap">
              <span class="input-prefix">$</span>
              <input v-model="form.price" type="number" class="input input-with-prefix" placeholder="0" min="0" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">{{ tBy({ en: 'Tags (comma-separated)', km: 'ស្លាក (ខណ្ឌដោយក្បៀស)' }) }}</label>
            <input v-model="form.tags" type="text" class="input" :placeholder="tBy({ en: 'cambodia, apsara, gold-leaf', km: 'ខ្មែរ, អប្សរ, មាស' })" />
          </div>
          <div class="form-group col-span-2">
            <label class="form-label-checkbox">
              <input type="checkbox" v-model="form.forSale" class="checkbox" />
              <span>{{ tBy({ en: 'This artwork is available for sale', km: 'ស្នាដៃនេះ​អាច​លក់​បាន' }) }}</span>
            </label>
          </div>
        </div>
        <div class="step-actions">
          <button class="btn btn-ghost" @click="currentStep = 0">← {{ tBy({ en: 'Back', km: 'ត្រឡប់' }) }}</button>
          <button class="btn btn-primary" :disabled="!form.title || !form.category" @click="currentStep = 2">
            {{ tBy({ en: 'Continue', km: 'បន្ត' }) }} →
          </button>
        </div>
      </div>

      <!-- Step 3: AI & Publish -->
      <div v-if="currentStep === 2" class="step-panel card animate-on-scroll delay-2">
        <h2 class="panel-title">{{ tBy({ en: 'AI Assist & Publish', km: 'AI និងផ្សព្វផ្សាយ' }) }}</h2>

        <!-- AI suggestions -->
        <div class="ai-assist-box">
          <div class="aab-header">
            <div class="aab-icon"><i class="fa-solid fa-robot"></i></div>
            <div>
              <p class="aab-title">{{ tBy({ en: 'RamaAI Suggestions', km: 'ការណែនាំ RamaAI' }) }}</p>
              <p class="aab-sub">{{ tBy({ en: 'Click to apply AI-generated content', km: 'ចុចដើម្បីអនុវត្តខ្លឹមសារ AI' }) }}</p>
            </div>
          </div>
          <div class="aab-chips">
            <button class="aab-chip" @click="applyAICaption">
              <i class="fa-solid fa-robot"></i> {{ tBy({ en: 'Generate caption', km: 'បង្កើតចំណងជើង' }) }}
            </button>
            <button class="aab-chip" @click="applyAITags">
              <i class="fa-solid fa-tag"></i> {{ tBy({ en: 'Suggest tags', km: 'ស្នើស្លាក' }) }}
            </button>
            <button class="aab-chip" @click="applyAISEO">
              <i class="fa-solid fa-chart-line"></i> {{ tBy({ en: 'SEO description', km: 'ពិពណ៌នា SEO' }) }}
            </button>
          </div>
          <div v-if="aiCaption" class="ai-result">
            <p class="air-label">{{ tBy({ en: 'AI Caption:', km: 'ចំណងជើង AI:' }) }}</p>
            <p class="air-text">{{ aiCaption }}</p>
          </div>
        </div>

        <!-- Privacy -->
        <div class="privacy-box card">
          <h3 class="pb-title">{{ tBy({ en: 'Protection Settings', km: 'ការការពារ' }) }}</h3>
          <div class="pb-options">
            <label class="pb-opt" :class="{ selected: form.protection === 'watermark' }">
              <input type="radio" v-model="form.protection" value="watermark" class="hidden" />
              <span class="pbo-icon"><i class="fa-solid fa-water"></i></span>
              <div>
                <strong>{{ tBy({ en: 'Watermark', km: 'ស្លាកទឹក' }) }}</strong>
                <p>{{ tBy({ en: 'Subtle watermark overlay', km: 'ស្លាកទឹកស្ងាត់' }) }}</p>
              </div>
            </label>
            <label class="pb-opt" :class="{ selected: form.protection === 'full' }">
              <input type="radio" v-model="form.protection" value="full" class="hidden" />
              <span class="pbo-icon"><i class="fa-solid fa-shield-halved"></i></span>
              <div>
                <strong>{{ tBy({ en: 'Full Protection', km: 'ការការពារពេញ' }) }}</strong>
                <p>{{ tBy({ en: 'Watermark + signed URL + no right-click', km: 'ស្លាកទឹក + signed URL' }) }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Visibility -->
        <div class="vis-row">
          <label class="form-label">{{ tBy({ en: 'Visibility', km: 'ភាពមើលឃើញ' }) }}</label>
          <div class="vis-opts">
            <label v-for="v in ['public', 'private', 'collectors']" :key="v" class="vis-opt" :class="{ selected: form.visibility === v }">
              <input type="radio" v-model="form.visibility" :value="v" class="hidden" />
              {{ tBy({ en: v.charAt(0).toUpperCase() + v.slice(1), km: v === 'public' ? 'សាធារណៈ' : v === 'private' ? 'ឯកជន' : 'អ្នកប្រមូលផ្ដាច់មុខ' }) }}
            </label>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-ghost" @click="currentStep = 1">← {{ tBy({ en: 'Back', km: 'ត្រឡប់' }) }}</button>
          <button class="btn btn-primary publish-btn" @click="handlePublish" :disabled="isPublishing">
            <svg v-if="isPublishing" class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            {{ isPublishing ? tBy({ en: 'Publishing…', km: 'កំពុងផ្សព្វ…' }) : tBy({ en: 'Publish Artwork', km: 'ផ្សព្វផ្សាយស្នាដៃ' }) }}
          </button>
        </div>
      </div>

      <!-- Success state -->
      <div v-if="currentStep === 3" class="success-panel animate-on-scroll">
        <div class="success-icon"><i class="fa-solid fa-check"></i></div>
        <h2 class="success-title">{{ tBy({ en: 'Artwork Published!', km: 'ស្នាដៃបានផ្សព្វ!' }) }}</h2>
        <p class="success-sub">{{ tBy({ en: 'Your artwork is now live on RamaGallery.', km: 'ស្នាដៃរបស់អ្នកឥឡូវបង្ហាញនៅ RamaGallery។' }) }}</p>
        <div class="success-actions">
          <NuxtLink to="/gallery" class="btn btn-primary">{{ tBy({ en: 'View in Gallery', km: 'មើលក្នុងវិចិត្រសាល' }) }}</NuxtLink>
          <button class="btn btn-outline" @click="resetForm">{{ tBy({ en: 'Upload Another', km: 'បញ្ចូលបន្ថែម' }) }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

// useScrollAnimation()

const currentStep = ref(0)
const isDragging = ref(false)
const previewUrl = ref('')
const isPublishing = ref(false)
const aiCaption = ref('')
const fileInput = ref<HTMLInputElement>()

const form = reactive({
  title: '', title_km: '', category: '', year: new Date().getFullYear(),
  description: '', price: 0, tags: '', forSale: false,
  protection: 'watermark', visibility: 'public',
})

const steps = [
  { en: 'Upload', km: 'បញ្ចូល' },
  { en: 'Details', km: 'ព័ត៌មាន' },
  { en: 'Publish', km: 'ផ្សព្វ' },
]

function handleFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) previewUrl.value = URL.createObjectURL(file)
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file?.type.startsWith('image/')) previewUrl.value = URL.createObjectURL(file)
}

async function applyAICaption() {
  await new Promise(r => setTimeout(r, 800))
  aiCaption.value = tBy({
    en: 'A masterful composition blending traditional Cambodian iconography with contemporary painterly expression — rich textures and luminous colour palette evoke both heritage and modernity.',
    km: 'ការសំយោគដ៏ពូកែ ឆ្លុះបញ្ចាំងរូបតំណាងខ្មែរបុរាណ ជាមួយការបញ្ចេញមតិតាមបែបសិល្បៈ'
  })
}

async function applyAITags() {
  if (!form.tags) form.tags = 'cambodia, khmer, contemporary, gallery, ramagallery'
}

async function applyAISEO() {
  if (!form.description) {
    form.description = tBy({
      en: 'An extraordinary work from a Cambodian artist exploring the intersection of classical heritage and contemporary vision. Available exclusively on RamaGallery.',
      km: 'ស្នាដៃពិសេសពីវិចិត្រករខ្មែរ ស្វែងយល់ពីចំណុចប្រសព្វរវាងបុរានកម្ម និងចក្ខុវិស័យ'
    })
  }
}

async function handlePublish() {
  isPublishing.value = true
  await new Promise(r => setTimeout(r, 1800))
  isPublishing.value = false
  currentStep.value = 3
}

function resetForm() {
  Object.assign(form, { title: '', title_km: '', category: '', description: '', price: 0, tags: '', forSale: false, protection: 'watermark', visibility: 'public' })
  previewUrl.value = ''
  aiCaption.value = ''
  currentStep.value = 0
}
</script>

<style scoped lang="scss">
.upload-page { padding: 3rem 0 6rem; max-width: 760px; margin: 0 auto; padding-left: var(--container-pad); padding-right: var(--container-pad); }
.up-header { margin-bottom: 2rem; }
.up-title { font-size: 2.25rem; margin-top: 0.5rem; }

.steps { display: flex; align-items: center; gap: 0; margin-bottom: 2.5rem; }
.step { display: flex; align-items: center; gap: 0.75rem; flex: 1; position: relative; &:not(:last-child)::after { content: ''; flex: 1; height: 1px; background: var(--color-border); margin: 0 0.75rem; } }
.step-circle { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--color-border); background: var(--color-bg-card); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600; color: var(--color-text-muted); transition: all var(--transition); flex-shrink: 0; .step.active & { border-color: var(--color-gold); color: var(--color-gold); } .step.done & { background: var(--color-gold); border-color: var(--color-gold); } }
.step-label { font-size: 0.75rem; font-weight: 500; color: var(--color-text-muted); .step.active & { color: var(--color-gold); } .step.done & { color: var(--color-text-secondary); } }

.step-panel { padding: 2rem; }
.panel-title { font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1.75rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-border); }

.drop-zone {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition);
  position: relative;
  overflow: hidden;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  &:hover, &.dragging { border-color: var(--color-gold); background: rgba(200,149,28,0.04); }
  &.has-file { padding: 0; border-style: solid; }
}
.dz-icon { font-size: 2.5rem; }
.dz-primary { font-size: 1rem; font-weight: 500; color: var(--color-text-primary); }
.dz-secondary { font-size: 0.8rem; color: var(--color-text-muted); }
.dz-preview { width: 100%; height: 100%; object-fit: contain; max-height: 320px; }
.dz-change-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 500; opacity: 0; transition: opacity var(--transition); .drop-zone:hover & { opacity: 1; } }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem; }
.col-span-2 { grid-column: 1 / -1; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-secondary); }
.form-label-checkbox { display: flex; align-items: center; gap: 0.625rem; cursor: pointer; font-size: 0.875rem; color: var(--color-text-secondary); }
.checkbox { width: 16px; height: 16px; accent-color: var(--color-gold); cursor: pointer; }
.khmer { font-family: var(--font-khmer); }
.input-prefix-wrap { position: relative; }
.input-prefix { position: absolute; left: 0.875rem; top: 50%; transform: translateY(-50%); color: var(--color-text-muted); }
.input-with-prefix { padding-left: 1.75rem; }
.hidden { display: none; }

.step-actions { display: flex; justify-content: space-between; align-items: center; padding-top: 1.5rem; border-top: 1px solid var(--color-border); }
.step-btn { width: 100%; }

.ai-assist-box { background: var(--color-bg-secondary); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem; }
.aab-header { display: flex; align-items: center; gap: 0.875rem; margin-bottom: 1rem; }
.aab-icon { font-size: 1.5rem; }
.aab-title { font-weight: 600; font-size: 0.9rem; color: var(--color-text-primary); }
.aab-sub { font-size: 0.78rem; color: var(--color-text-muted); }
.aab-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
.aab-chip { padding: 0.4rem 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-full); background: var(--color-bg-card); font-size: 0.78rem; font-weight: 500; cursor: pointer; font-family: var(--font-sans); color: var(--color-text-secondary); transition: all var(--transition); &:hover { border-color: var(--color-gold); color: var(--color-gold); } }
.ai-result { background: var(--color-bg-card); border-left: 3px solid var(--color-gold); padding: 0.875rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
.air-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-gold); margin-bottom: 0.375rem; }
.air-text { font-size: 0.875rem; color: var(--color-text-primary); line-height: 1.6; }

.privacy-box { padding: 1.25rem; margin-bottom: 1.5rem; }
.pb-title { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.875rem; }
.pb-options { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.pb-opt { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; transition: all var(--transition); &.selected { border-color: var(--color-gold); background: rgba(200,149,28,0.06); } &:hover { border-color: var(--color-gold); } strong { font-size: 0.85rem; display: block; margin-bottom: 0.2rem; } p { font-size: 0.75rem; color: var(--color-text-muted); } }
.pbo-icon { font-size: 1.5rem; flex-shrink: 0; }

.vis-row { margin-bottom: 1.5rem; }
.vis-opts { display: flex; gap: 0.5rem; margin-top: 0.625rem; }
.vis-opt { padding: 0.45rem 1.25rem; border: 1px solid var(--color-border); border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all var(--transition); color: var(--color-text-secondary); &.selected { border-color: var(--color-gold); color: var(--color-gold); background: rgba(200,149,28,0.08); } &:hover { border-color: var(--color-gold); } }

.publish-btn { min-width: 160px; display: flex; align-items: center; gap: 0.5rem; }
.spin-icon { animation: spin 1s linear infinite; }

.success-panel { text-align: center; padding: 4rem 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.success-icon { font-size: 4rem; }
.success-title { font-family: var(--font-display); font-size: 2rem; }
.success-sub { color: var(--color-text-secondary); }
.success-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin-top: 1rem; }
</style>
