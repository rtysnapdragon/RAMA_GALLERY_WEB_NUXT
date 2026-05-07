
import getComponentPaths from './app/utils/getComponentPaths'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  components: getComponentPaths(),
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-schema-org'
  ],

  css: ['~/assets/styles/main.scss'],

  i18n: {
    locales: [
      { code: 'en', name: 'English', iso: 'en-US', file: 'en.json', flag: '/flags/gb.svg' },
      { code: 'km', name: 'ខ្មែរ', iso: 'km-KH', file: 'km.json', flag: '/flags/kh.svg' },
    ],
    defaultLocale: 'en',
    langDir: '../langs/',
    strategy: 'prefix_except_default',
    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      // CRITICAL FIX
      alwaysRedirect: true,

      // ONLY detect at root
      redirectOn: 'root',
    },
    // detectBrowserLanguage: false //Are you SSR + client mismatch?
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'RamaGallery — Cambodian Art Platform',
      titleTemplate: '%s | RamaGallery',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Cambodia\'s premier artist portfolio, gallery, and AI-powered art SaaS platform.' },
        { property: 'og:title', content: 'RamaGallery' },
        { property: 'og:description', content: 'Discover Cambodian art — browse, collect, and connect.' },
        { property: 'og:type', content: 'website' },
        {
          name: 'theme-color',
          content: '#111111'
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=Noto+Serif+Khmer:wght@300;400;500&display=swap',
        },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.css' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/phosphor-icons@1.4.2/src/css/icons.css' },
        // { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css' },
        // { rel: 'stylesheet', href: 'https://unpkg.com/@fortawesome/fontawesome-free@6.5.1/css/all.min.css' }
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  runtimeConfig: {
    public: {
      // apiBase: 'http://127.0.0.1:8000/',
      apiBase: 'http://127.0.0.1:52467/',
      wsBase: 'ws://127.0.0.1:8000/'
    }
  },
  robots: {
    rules: [
      {
        userAgent: '*',
        allow: '/'
      }
    ],
    sitemap: 'https://ramagallery.angkordragon.space/sitemap.xml'
  },
  sitemap: {
    gzip: true,
    autoLastmod: true,
    sources: [
      '/api/sitemap/artworks',
      '/api/sitemap/artists'
    ],
    urls: [
      '/',
      '/gallery',
      '/artists',
      '/blogs',
      '/events',
      '/services',
      '/about',
      '/contact'
    ]
  },
  site: {
    url: 'https://ramagallery.angkordragon.space',
    name: 'RamaGallery'
  },
  typescript: {
    strict: true,
    shim: false,
  },
})