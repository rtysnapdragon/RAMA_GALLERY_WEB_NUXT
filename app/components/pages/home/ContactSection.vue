<script setup lang="ts">
// components/sections/ContactSection.vue
const { t } = useI18n()
const { form, errors, isSubmitting, isSuccess, submit } = useContact()
</script>

<template>
  <section class="section contact-section" id="contact">
    <div class="container">
      <div class="contact-section__grid">
        <!-- Info column -->
        <div class="contact-section__info">
          <RgSectionHeader :title="t('contact.title')" :subtitle="t('contact.subtitle')" />

          <div class="contact-section__details">
            <div class="contact-section__detail">
              <i class="ri-map-pin-2-line contact-section__detail-icon" />
              <div>
                <p class="contact-section__detail-label">{{ t('contact.studio') }}</p>
                <p class="contact-section__detail-value">{{ t('contact.studio_address') }}</p>
              </div>
            </div>
            <div class="contact-section__detail">
              <i class="ri-time-line contact-section__detail-icon" />
              <div>
                <p class="contact-section__detail-label">Response time</p>
                <p class="contact-section__detail-value">{{ t('contact.response') }}</p>
              </div>
            </div>
            <div class="contact-section__detail">
              <i class="ri-mail-line contact-section__detail-icon" />
              <div>
                <p class="contact-section__detail-label">Email</p>
                <p class="contact-section__detail-value">studio@ramagallery.art</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Form column -->
        <div class="contact-section__form-wrap">
          <Transition name="success">
            <div v-if="isSuccess" class="contact-section__success">
              <i class="ri-check-double-line" />
              <p>{{ t('contact.success') }}</p>
            </div>
          </Transition>

          <form v-if="!isSuccess" class="contact-section__form" @submit.prevent="submit">
            <RgInput
              v-model="form.name"
              :label="t('contact.name')"
              :placeholder="t('contact.name')"
              :error="errors.name"
            />
            <RgInput
              v-model="form.email"
              :label="t('contact.email')"
              type="email"
              :placeholder="t('contact.email')"
              :error="errors.email"
            />
            <RgInput
              v-model="form.message"
              :label="t('contact.message')"
              :placeholder="t('contact.message')"
              :error="errors.message"
              :textarea="true"
              :rows="5"
            />
            <RgButton
              type="submit"
              variant="primary"
              size="lg"
              :loading="isSubmitting"
              icon="send-plane-line"
              class="contact-section__submit"
            >
              {{ t('contact.send') }}
            </RgButton>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.contact-section {
  background: var(--bg-surface);

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(3rem, 6vw, 6rem);

    @include lg { grid-template-columns: 1fr 1.2fr; align-items: start; }
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    margin-top: 1rem;
  }

  &__detail {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  &__detail-icon {
    font-size: 1.2rem;
    color: var(--gold);
    margin-top: 2px;
    flex-shrink: 0;
  }

  &__detail-label {
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 0.2rem;
  }

  &__detail-value {
    font-size: 0.9rem;
    color: var(--text);
  }

  &__form-wrap { position: relative; }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__submit { margin-top: 0.5rem; }

  &__success {
    @include flex-center(1rem);
    flex-direction: column;
    padding: 4rem 2rem;
    border: 1px solid var(--border);
    text-align: center;

    i {
      font-size: 2.5rem;
      color: var(--gold);
    }

    p {
      @include body-text;
      color: var(--text-muted);
    }
  }
}

.success-enter-active, .success-leave-active {
  transition: opacity 0.4s ease, transform 0.4s $ease-expo;
}
.success-enter-from, .success-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
