import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@loganrenz/narduk-nuxt-template-layer'],

  modules: ['nitro-cloudflare-dev'],

  nitro: {
    cloudflareDev: {
      configPath: resolve(__dirname, 'wrangler.json'),
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: true },

  ui: {
    colorMode: true,
  },

  colorMode: {
    preference: 'light',
  },

  runtimeConfig: {
    googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_PLATFORM_API_KEY || '',
    yelpApiKey: process.env.YELP_API_KEY || '',
    googleServiceAccountKey: process.env.GSC_SERVICE_ACCOUNT_JSON || '',
    posthogApiKey: process.env.POSTHOG_PERSONAL_API_KEY || '',
    posthogProjectId: process.env.POSTHOG_PROJECT_ID || '',
    public: {
      appUrl: process.env.SITE_URL || 'https://papaeverettspizza.com',
      appName: "Papa Everett's Pizza Co.",
      posthogPublicKey: process.env.POSTHOG_PROJECT_TOKEN || process.env.POSTHOG_PUBLIC_KEY || '',
      posthogHost: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
      gaMeasurementId: process.env.GA_MEASUREMENT_ID || 'G-8WZ93XNKHX',
      googlePlaceId: process.env.GOOGLE_PLACE_ID || 'ChIJdZ_W5w3b8YcRc8eW0Ew5iB8',
      yelpBusinessId: process.env.YELP_BUSINESS_ID || 'papa-everetts-pizza-clear-lake',
      indexNowKey: process.env.INDEXNOW_KEY || '',
    },
  },

  site: {
    url: 'https://papaeverettspizza.com',
    name: "Papa Everett's Pizza Co.",
    description:
      'Handcrafted pizza, pasta, and more. Proudly serving Clear Lake, Iowa since 1988. Dine-in, carryout, delivery, and catering.',
    defaultLocale: 'en',
  },

  ogImage: {
    defaults: {
      component: 'OgImageDefaultTakumi',
    },
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: "Papa Everett's Pizza Co.",
      url: 'https://papaeverettspizza.com',
      logo: '/favicon.png',
    },
  },

  image: {
    cloudflare: {
      baseURL: process.env.SITE_URL || 'https://papaeverettspizza.com',
    },
  },

  sitemap: {
    exclude: ['/admin', '/admin/**', '/pizza-builder'],
  },

  robots: {
    groups: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/'],
      },
    ],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'theme-color', content: '#ffffff' },
        { property: 'og:image', content: 'https://papaeverettspizza.com/images/og-logo.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:image', content: 'https://papaeverettspizza.com/images/og-logo.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/favicon.png' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
})
