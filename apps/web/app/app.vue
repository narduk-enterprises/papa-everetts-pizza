<script setup lang="ts">
import { restaurantInfo } from '~/composables/useRestaurantInfo'

const route = useRoute()
const mobileMenuOpen = ref(false)
const currentYear = new Date().getFullYear()

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'About', to: '/about' },
  { label: 'Catering', to: '/catering' },
  { label: 'Fundraisers', to: '/fundraisers' },
  { label: 'Schools', to: '/schools' },
  { label: 'Contact', to: '/contact' },
]

watch(route, () => {
  mobileMenuOpen.value = false
})

// Full Restaurant structured data for Google Knowledge Panel
useSchemaOrg([
  {
    '@type': 'Restaurant',
    '@id': 'https://papaeverettspizza.com/#restaurant',
    'name': "Papa Everett's Pizza Co.",
    'image': 'https://papaeverettspizza.com/images/authentic/logo-icon.png',
    'url': 'https://papaeverettspizza.com',
    'telephone': '+16413574040',
    'priceRange': '$$',
    'servesCuisine': ['Pizza', 'Italian', 'American'],
    'acceptsReservations': false,
    'hasMenu': 'https://papaeverettspizza.com/menu',
    'paymentAccepted': 'Cash, Credit Card, Debit Card',
    'currenciesAccepted': 'USD',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '910 US-18 E',
      'addressLocality': 'Clear Lake',
      'addressRegion': 'IA',
      'postalCode': '50428',
      'addressCountry': 'US',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 43.1316,
      'longitude': -93.3696,
    },
    'areaServed': {
      '@type': 'City',
      'name': 'Clear Lake',
      'containedInPlace': {
        '@type': 'State',
        'name': 'Iowa',
      },
    },
    'openingHoursSpecification': [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '16:00', closes: '20:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '11:00', closes: '21:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '11:00', closes: '21:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '11:00', closes: '21:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '11:00', closes: '22:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '11:00', closes: '22:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '11:00', closes: '21:00' },
    ],
    'sameAs': [
      'https://www.facebook.com/PapaEverettsPizza',
    ],
  },
])
</script>

<template>
  <UApp>
    <div class="min-h-screen flex flex-col bg-[var(--color-pizza-bg)] text-[var(--color-pizza-text)]">
      <!-- Skip to main content for keyboard/screen reader users (WCAG 2.4.1) -->
      <ULink
        to="#main-content"
        class="sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:w-auto focus:h-auto focus:p-4 focus:m-0 focus:overflow-visible focus:bg-pizza-red focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-pizza-gold focus:ring-offset-2"
      >
        Skip to main content
      </ULink>

      <!-- Header: white bg, real logo, nav, red CTA -->
      <div class="sticky top-0 z-50 warm-surface" role="banner">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
          <!-- Logo using real logo-main.jpg from original site -->
          <ULink to="/" class="flex items-center gap-3">
            <div class="logo-container">
              <img src="/images/authentic/logo-main.jpg" alt="Papa Everett's Pizza — Handcrafted Pizza, Wings, Pasta, Salad" class="h-11 w-auto object-contain">
            </div>
          </ULink>

          <!-- Desktop nav: ULink for aria-current and focus-visible -->
          <div class="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            <ULink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              :exact="item.to === '/'"
              active-class="text-pizza-primary"
              inactive-class="text-[var(--color-pizza-text)]/70 hover:text-pizza-primary"
              class="px-3 py-2 text-sm font-medium rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pizza-primary"
            >
              {{ item.label }}
            </ULink>
          </div>

          <!-- CTA phone button -->
          <div class="hidden lg:block">
            <ULink :to="restaurantInfo.phoneHref" class="btn-primary">
              <UIcon name="i-lucide-phone" class="size-4 mr-2" />
              641-357-4040
            </ULink>
          </div>

          <!-- Mobile menu toggle -->
          <UButton variant="ghost" color="neutral" class="lg:hidden p-2 rounded-lg border border-pizza-border" aria-label="Toggle menu" @click="mobileMenuOpen = !mobileMenuOpen">
            <UIcon :name="mobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="size-5" />
          </UButton>
        </div>

        <!-- Mobile nav dropdown -->
        <Transition name="slide-down">
          <div v-if="mobileMenuOpen" class="lg:hidden px-4 pb-4 grid grid-cols-2 gap-2" role="navigation" aria-label="Mobile navigation">
            <ULink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              :exact="item.to === '/'"
              active-class="bg-[var(--color-pizza-bg-soft)] text-pizza-primary border-primary/20"
              inactive-class="text-[var(--color-pizza-text)]/70"
              class="px-3 py-2 text-sm rounded-lg border border-[var(--color-pizza-border)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pizza-primary"
            >
              {{ item.label }}
            </ULink>
            <ULink :to="restaurantInfo.phoneHref" class="btn-primary col-span-2 mt-2 w-full">
              <UIcon name="i-lucide-phone" class="size-4 mr-2" />
              641-357-4040
            </ULink>
          </div>
        </Transition>
      </div>

      <UMain id="main-content" class="flex-1" tabindex="-1">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </UMain>

      <!-- Footer: high contrast, deep warm red -->
      <div class="site-footer mt-16 bg-[var(--color-pizza-text)] text-white" role="contentinfo">
        <div class="h-1 bg-[var(--color-pizza-primary)]" />

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- Logo & tagline -->
            <div>
              <div class="logo-container mb-4">
                <img src="/images/authentic/logo-main.jpg" alt="Papa Everett's Pizza" class="h-14 w-auto object-contain">
              </div>
              <p class="text-sm opacity-80">Serving Clear Lake proudly since 1988</p>
            </div>

            <!-- Quick Links -->
            <div>
              <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
              <ul class="space-y-2 text-sm">
                <li><ULink to="/menu" class="hover:text-pizza-gold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pizza-gold rounded">Menu</ULink></li>
                <li><ULink to="/gallery" class="hover:text-pizza-gold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pizza-gold rounded">Photo Gallery</ULink></li>
                <li><ULink to="/about" class="hover:text-pizza-gold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pizza-gold rounded">About Papa Everett's</ULink></li>
                <li><ULink to="/catering" class="hover:text-pizza-gold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pizza-gold rounded">Catering</ULink></li>
                <li><ULink to="/fundraisers" class="hover:text-pizza-gold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pizza-gold rounded">Fundraiser Nights</ULink></li>
                <li><ULink to="/schools" class="hover:text-pizza-gold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pizza-gold rounded">Schools &amp; Teams</ULink></li>
                <li><ULink to="/contact" class="hover:text-pizza-gold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pizza-gold rounded">Contact Us</ULink></li>
              </ul>
            </div>

            <!-- Contact Us -->
            <div>
              <h3 class="text-lg font-semibold mb-4">Contact Us</h3>
              <div class="space-y-3 text-sm">
                <div class="flex items-start gap-2">
                  <UIcon name="i-lucide-map-pin" class="size-4 mt-0.5 shrink-0" />
                  <div>
                    <p>910 US-18 E</p>
                    <p>Clear Lake, IA 50428</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-phone" class="size-4 shrink-0" />
                  <ULink :to="restaurantInfo.phoneHref" class="hover:text-[var(--color-pizza-gold)] transition-colors">(641) 357-4040</ULink>
                </div>
                <ULink :to="restaurantInfo.phoneHref" class="btn-primary mt-3 inline-flex !text-white !bg-[var(--color-pizza-primary)] hover:!bg-[var(--color-pizza-primary-dark)]">
                  <UIcon name="i-lucide-phone" class="size-4 mr-2" />
                  Call to Order
                </ULink>
              </div>
            </div>

            <!-- Opening Hours -->
            <div>
              <h3 class="text-lg font-semibold mb-4">Opening Hours</h3>
              <div class="space-y-2 text-sm">
                <div class="flex items-center gap-2 mb-2">
                  <UIcon name="i-lucide-clock" class="size-4 shrink-0" />
                  <span class="font-medium">Open 7 Days a Week</span>
                </div>
                <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                  <span>Sun, Tue–Thu</span><span>11:00 AM - 9:00 PM</span>
                  <span>Monday</span><span>4:00 PM - 8:00 PM</span>
                  <span>Fri - Sat</span><span>11:00 AM - 10:00 PM</span>
                </div>
                <!-- Social links -->
                <div class="flex flex-col gap-1 mt-4 pt-3 border-t border-white/10">
                  <ULink href="https://www.facebook.com/PapaEverettsPizza" target="_blank" rel="noopener noreferrer" class="text-pizza-muted hover:text-pizza-gold transition-colors block py-1" aria-label="Facebook">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-facebook" class="size-5" />
                      <span>Facebook</span>
                    </div>
                  </ULink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-white/10 py-5 text-center text-sm opacity-70">
          <p>&copy; {{ currentYear }} Papa Everett's Pizza. All rights reserved.</p>
        </div>
      </div>
    </div>
  </UApp>
</template>
