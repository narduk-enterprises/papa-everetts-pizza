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
    <div class="min-h-screen flex flex-col text-[var(--color-pizza-text)]">
      <!-- Header: white bg, real logo, nav, red CTA -->
      <header class="sticky top-0 z-50 warm-surface">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
          <!-- Logo using real logo-main.jpg from original site -->
          <NuxtLink to="/" class="flex items-center gap-3">
            <div class="logo-container">
              <img src="/images/authentic/logo-main.jpg" alt="Papa Everett's Pizza — Handcrafted Pizza, Wings, Pasta, Salad" class="h-11 w-auto object-contain">
            </div>
          </NuxtLink>

          <!-- Desktop nav -->
          <nav class="hidden lg:flex items-center gap-1">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="route.path === item.to
                ? 'text-[var(--color-pizza-red)]'
                : 'text-[var(--color-pizza-muted)] hover:text-[var(--color-pizza-red)]'"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>

          <!-- CTA phone button -->
          <div class="hidden lg:block">
            <a :href="restaurantInfo.phoneHref" class="cta-phone">
              <UIcon name="i-lucide-phone" class="size-4" />
              641-357-4040
            </a>
          </div>

          <!-- Mobile menu toggle -->
          <button class="lg:hidden p-2 rounded-lg border border-[var(--color-pizza-border)]" aria-label="Toggle menu" @click="mobileMenuOpen = !mobileMenuOpen">
            <UIcon :name="mobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="size-5" />
          </button>
        </div>

        <!-- Mobile nav dropdown -->
        <Transition name="slide-down">
          <nav v-if="mobileMenuOpen" class="lg:hidden px-4 pb-4 grid grid-cols-2 gap-2">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="px-3 py-2 text-sm rounded-lg border border-[var(--color-pizza-border)]"
              :class="route.path === item.to
                ? 'bg-red-50 text-[var(--color-pizza-red)] border-red-200'
                : 'text-[var(--color-pizza-muted)]'"
            >
              {{ item.label }}
            </NuxtLink>
            <a :href="restaurantInfo.phoneHref" class="cta-phone col-span-2 justify-center mt-1">
              <UIcon name="i-lucide-phone" class="size-4" />
              641-357-4040
            </a>
          </nav>
        </Transition>
      </header>

      <main class="flex-1">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </main>

      <!-- Footer: dark navy blue 4-column layout -->
      <footer class="site-footer mt-16">
        <div class="h-1 bg-[var(--color-pizza-red)]" />

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
                <li><NuxtLink to="/menu">Menu</NuxtLink></li>
                <li><NuxtLink to="/gallery">Photo Gallery</NuxtLink></li>
                <li><NuxtLink to="/about">About Papa Everett's</NuxtLink></li>
                <li><NuxtLink to="/catering">Catering</NuxtLink></li>
                <li><NuxtLink to="/fundraisers">Fundraiser Nights</NuxtLink></li>
                <li><NuxtLink to="/schools">Schools &amp; Teams</NuxtLink></li>
                <li><NuxtLink to="/contact">Contact Us</NuxtLink></li>
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
                  <a :href="restaurantInfo.phoneHref">(641) 357-4040</a>
                </div>
                <a :href="restaurantInfo.phoneHref" class="cta-phone mt-3 inline-flex">
                  <UIcon name="i-lucide-phone" class="size-4" />
                  Call to Order
                </a>
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
                <div class="flex items-center gap-3 mt-4 pt-3 border-t border-white/10">
                  <a href="https://www.facebook.com/PapaEverettsPizza" target="_blank" rel="noopener noreferrer" class="hover:text-[var(--color-pizza-gold)] transition-colors" aria-label="Facebook">
                    <UIcon name="i-lucide-facebook" class="size-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-white/10 py-5 text-center text-sm opacity-70">
          <p>&copy; {{ currentYear }} Papa Everett's Pizza. All rights reserved.</p>
        </div>
      </footer>
    </div>
  </UApp>
</template>
