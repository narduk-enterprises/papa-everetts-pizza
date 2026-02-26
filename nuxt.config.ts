// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/seo',
  ],
  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4
  },

  ui: {
    colorMode: true
  },

  colorMode: {
    preference: 'light'
  },

  runtimeConfig: {
    // Private keys are only available on the server
    googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_PLATFORM_API_KEY,
    yelpApiKey: process.env.YELP_API_KEY,
    googleServiceAccountKey: process.env.GSC_SERVICE_ACCOUNT_JSON,
    posthogApiKey: process.env.POSTHOG_PERSONAL_API_KEY,
    posthogProjectId: process.env.POSTHOG_PROJECT_ID,
    public: {
      appUrl: process.env.SITE_URL || 'https://papaeverettspizza.com',
      appName: "Papa Everett's Pizza Co.",
      // Analytics
      posthogPublicKey: process.env.POSTHOG_PROJECT_TOKEN || process.env.POSTHOG_PUBLIC_KEY || '',
      posthogHost: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
      gaMeasurementId: process.env.GA_MEASUREMENT_ID || 'G-8WZ93XNKHX',
      // Public keys that are exposed to the client
      googlePlaceId: process.env.GOOGLE_PLACE_ID || 'ChIJdZ_W5w3b8YcRc8eW0Ew5iB8', // Placeholder Papa Everett's Place ID
      yelpBusinessId: process.env.YELP_BUSINESS_ID || 'papa-everetts-pizza-clear-lake',
    }
  },

  // ─── SEO Configuration (@nuxtjs/seo) ──────────────────────────
  // This single config block powers sitemap, robots, schema.org,
  // OG images, and site-wide SEO defaults. Individual pages override
  // these via the `useSeo()` composable.

  site: {
    url: 'https://papaeverettspizza.com',
    name: "Papa Everett's Pizza Co.",
    description: 'Handcrafted pizza, pasta, and more. Proudly serving Clear Lake, Iowa since 1988. Dine-in, carryout, delivery, and catering.',
    defaultLocale: 'en',
  },

  ogImage: {
    defaults: {
      component: 'OgImageDefault',
    },
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: "Papa Everett's Pizza Co.",
      url: 'https://papaeverettspizza.com',
      logo: '/favicon.png',
    },
    // Full Restaurant schema injected via app.vue useSchemaOrg
  },

  image: {
    provider: 'cloudflare',
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

  // ─── Nitro (Cloudflare Workers) ────────────────────────────────

  nitro: {
    preset: 'cloudflare-module',
    esbuild: {
      options: {
        target: 'esnext'
      }
    },
    externals: {
      inline: ['drizzle-orm']
    },
    rollupConfig: {
      plugins: [
        {
          name: 'fix-og-image-mock',
          resolveId(id: string) {
            if (id.includes('nuxt-og-image') && id.includes('proxy-cjs')) {
              return { id: './node_modules/nuxt-og-image/dist/runtime/mock/proxy-cjs.js', external: false }
            }
          },
        },
      ],
    },
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
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
