
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
    'nuxt-schema-org',
    'nuxt-security'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Make sure these paths exist in your project
          additionalData: `
          @use "~/assets/styles/_variables.scss" as *;
          @use "~/assets/styles/_mixins.scss" as *;
        `
        }
      }
    }
  },

  css: ['~/assets/styles/main.scss'],

  i18n: {
    lazy: true,
    langDir: '../langs/',
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', iso: 'en', file: 'en.json', flag: '/flags/gb.svg' },
      { code: 'km', name: 'ខ្មែរ', iso: 'km', file: 'km.json', flag: '/flags/kh.svg' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      // CRITICAL FIX
      // alwaysRedirect: true,
      // ONLY detect at root
      redirectOn: 'root',
      alwaysRedirect: false,
    },
    // detectBrowserLanguage: false //Are you SSR + client mismatch?
  },

  app: {
    head: {
      // htmlAttrs: { //It overrides Nuxt i18n runtime updates.
      //   lang: 'en'
      // },
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
  security: {
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'base-uri': ["'self'"],
        // 'img-src': ["'self'", 'data:', 'https:'],
        'img-src': [
          "'self'",
          'data:',
          'https:',                    // Allow all HTTPS images (for dev)
          'https://api.dicebear.com',
          'https://picsum.photos',
          'https://ui-avatars.com',
          "'sha256-9O8u7v1t2s3x4y5z6a7b8c9d0e1f2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0'",   // For default-avatar.png
          "'sha256-m5H09l59Q2l58h47t+u152/J4uC29n36h/i9/e5j/0E='",                  // For google-icon.png
          "'sha256-4eF0h95kU1b5/J4uC29n36h/i9/e5j/0E='",                          // For x.png
          "'sha256-9hM8q8j6j4i3k5k7b2c4g6e8w9a1n3p5t7d9f1j3h5k7g9c3b2n1p5t7d9f1j3h5k7g9c1b2n1p5t7d9f1j3h5k7"
        ],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],   // unsafe-eval needed in dev
        'style-src': ["'self'", "'unsafe-inline'"],
        'font-src': ["'self'", 'data:', 'https:'],
        'object-src': ["'none'"],
        'frame-ancestors': ["'none'"],
        'upgrade-insecure-requests': true,

        'connect-src': [
          "'self'",
          'http://127.0.0.1:52467',     // Your Django backend
          'http://localhost:52467',
          'ws://127.0.0.1:8000',        // WebSocket
          'wss://127.0.0.1:8000',
          'https://api.dicebear.com',
          'http://localhost:3000',
          'http://127.0.0.1:3000',
        ],
        'media-src': ["'self'", 'https:', 'http:'],
        'object-src': ["'none'"],
        'frame-ancestors': ["'none'"],
        'base-uri': ["'self'"],
        // 'upgrade-insecure-requests': process.env.NODE_ENV === 'production'
      },

      crossOriginEmbedderPolicy: 'require-corp',
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginResourcePolicy: 'same-origin',
      referrerPolicy: 'strict-origin-when-cross-origin',

      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      },

      xContentTypeOptions: true,
      xDNSPrefetchControl: true,
      xFrameOptions: 'DENY',
      xXSSProtection: true
    },

    // Rate Limiting
    rateLimiter: {
      enabled: false,        // Disable temporarily if causing issues during login
      // enabled: true,
      driver: 'memory',        // Change to 'redis' in production
      tokensPerInterval: 100,
      interval: 60000,
      max: 200,
      allowList: ['127.0.0.1', '::1']
    },

    requestSizeLimiter: {
      enabled: true,
      maxRequestSize: '2MB'
    },
    // ✅ Fixed CORS Configuration
    corsHandler: {
      // origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Explicit origins
      origin: process.env.NODE_ENV === 'production'
        ? [
          'https://ramagallery.com',
          'https://www.ramagallery.com'
        ]
        : [
          'http://localhost:3000',
          'http://127.0.0.1:3000'
        ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['Content-Length', 'X-Request-ID']
    },
    // corsHandler: {
    //   // origin: true, // Allow all origins in development

    //   credentials: true
    // }
  },

  // Nitro-specific security
  nitro: {
    experimental: {
      openAPI: true
    },
    security: {
      // headers: true
      headers: process.env.NODE_ENV === 'production'
    }
  },
  // Optional: Enable appConfig reactivity
  appConfig: {
    // You can also override here in production if needed
    rama: {
      name: "RamaGallery",
      primaryColor: "#C89D1C",      // Gold
      primaryHover: "#E5B93D",
      secondaryColor: "#4B3F35",

      // Semantic colors
      accent: "#C89D1C",
      success: "#10B981",
      danger: "#EF4444",
      info: "#3B82F6",

      // Neutral palette
      neutral: {
        50: "#F8F7F5",
        900: "#1C1917"
      }
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NODE_ENV === 'production'
        ? 'https://api.ramagallery.com/'
        : 'http://127.0.0.1:52467/',

      wsBase: process.env.NODE_ENV === 'production'
        ? 'wss://api.ramagallery.com/ws/'
        : 'ws://127.0.0.1:8000/ws/'
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