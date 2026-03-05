// deploy-trigger: 2026-03-04T20:40:25Z
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@narduk-enterprises/narduk-nuxt-template-layer'],

  modules: ['nitro-cloudflare-dev'],

  css: ['~/assets/css/main.css'],

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
    googlePlacesApiKey:
      process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_PLATFORM_API_KEY || '',
    gaPropertyId: process.env.GA_PROPERTY_ID || '526158939',
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
    } as Record<string, unknown>,
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: "Papa Everett's Pizza Co.",
      url: 'https://papaeverettspizza.com',
      logo: '/favicon.svg',
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

  routeRules: {
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      },
    },
    '/': { swr: 60 },
    '/menu': { swr: 60 },
    '/about': { swr: 300 },
    '/contact': { swr: 300 },
    '/catering': { swr: 300 },
    '/gallery': { swr: 300 },
    '/fundraisers': { swr: 300 },
    '/schools': { swr: 300 },
    '/paper-menu': { swr: 300 },
  },

  app: {
    head: {
      titleTemplate: "%s | Papa Everett's Pizza",
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'theme-color', content: '#3d4c2f' },
        { property: 'og:image', content: 'https://papaeverettspizza.com/images/og-logo.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:image', content: 'https://papaeverettspizza.com/images/og-logo.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
});
