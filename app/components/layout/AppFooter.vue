<template>
  <footer class="footer">
    <div class="footer-inner">
      <!-- Brand -->
      <div class="footer-brand">
        <div class="brand-logo">
          <span class="logo-icon">ར</span>
          <span class="logo-text">RamaGallery</span>
        </div>
        <p class="brand-tagline">{{ tBy(footerData.brand.tagline) }}</p>
        <p class="brand-desc">{{ tBy(footerData.brand.description) }}</p>
        <!-- Social icons -->
        <div class="social-links">
          <a
            v-for="s in footerData.social"
            :key="s.name"
            :href="s.href"
            :aria-label="s.name"
            class="social-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <component :is="socialIcons[s.icon]" />
          </a>
        </div>
      </div>

      <!-- Link columns -->
      <div
        v-for="col in footerData.columns"
        :key="col.title.en"
        class="footer-col"
      >
        <h4 class="col-title">{{ tBy(col.title) }}</h4>
        <ul class="col-links">
          <li v-for="link in col.links" :key="link.href">
            <NuxtLink :to="localePath(link.href)" class="col-link gold-underline">
              {{ tBy(link.label) }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <p class="copyright">{{ tBy(footerData.copyright) }}</p>
      <div class="legal-links">
        <NuxtLink
          v-for="l in footerData.legal"
          :key="l.href"
          :to="localePath(l.href)"
          class="legal-link"
        >
          {{ tBy(l.label) }}
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import footerData from '~/assets/json/footer.json'



// Inline SVG social icons
const socialIcons: Record<string, any> = {
  facebook: defineComponent({
    render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' })
    ])
  }),
  instagram: defineComponent({
    render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('rect', { x: 2, y: 2, width: 20, height: 20, rx: 5, ry: 5 }),
      h('circle', { cx: 12, cy: 12, r: 4 }),
      h('circle', { cx: 17.5, cy: 6.5, r: 1, fill: 'currentColor' })
    ])
  }),
  twitter: defineComponent({
    render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' })
    ])
  }),
  youtube: defineComponent({
    render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' })
    ])
  })
}
</script>

<style scoped lang="scss">
.footer {
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

.footer-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem 3rem;
  display: grid;
  grid-template-columns: 1.6fr repeat(3, 1fr);
  gap: 3rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 580px) {
    grid-template-columns: 1fr;
  }
}

.footer-brand {
  .brand-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .logo-icon {
    font-size: 1.5rem;
    color: var(--color-gold);
    font-family: var(--font-display);
  }

  .logo-text {
    font-family: var(--font-400);
    font-size: 1.25rem;
    color: var(--color-text-primary);
  }

  .brand-tagline {
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-gold);
    font-family: var(--font-400);
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .brand-desc {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
    // max-width: 280px;
    margin-bottom: 1.5rem;
  }
}

.social-links {
  display: flex;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  text-decoration: none;
  transition: all var(--transition);

  &:hover {
    border-color: var(--color-gold);
    color: var(--color-gold);
    transform: translateY(-2px);
  }
}

.footer-col {
  .col-title {
    font-family: var(--font-400);
    font-size: 0.8rem;
    font-weight: 600;
    // letter-spacing: 0.2em;
    // text-transform: uppercase;
    color: var(--color-text-primary);
    margin-bottom: 1.25rem;
  }
}

.col-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.col-link {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition);

  &:hover {
    color: var(--color-gold);
  }
}

.footer-bottom {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.25rem 2rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 580px) {
    flex-direction: column;
    text-align: center;
  }
}

.copyright {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.legal-links {
  display: flex;
  gap: 1.5rem;
}

.legal-link {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition);

  &:hover { color: var(--color-gold); }
}
</style>