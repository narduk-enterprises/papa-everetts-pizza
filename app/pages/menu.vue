<script setup lang="ts">
import type { MenuItem, MenuPrices } from '~/composables/useMenu'
import { callForCurrentPriceLabel, formatPrice, menuSizeLabels, menuSizeOrder, siteImages } from '~/composables/useRestaurantInfo'

const { appUrl } = useRuntimeConfig().public

useSeo({
  title: "Menu | Papa Everett's Pizza Co.",
  description: "Explore Papa Everett's Pizza Co. full menu with pizzas, pastas, appetizers, salads, and desserts. Prices are updated live.",
  ogImage: {
    title: "Papa Everett's Pizza Co. Menu",
    description: 'Pizzas, pasta, wings, salads, and desserts.',
    icon: 'i-lucide-utensils-crossed',
  },
})

useWebPageSchema({
  name: "Papa Everett's Pizza Co. Menu",
  description: 'Full pizza, pasta, appetizer, salad, and dessert menu.',
  type: 'CollectionPage',
})

useBreadcrumbSchema([
  { name: 'Home', url: `${appUrl}/` },
  { name: 'Menu', url: `${appUrl}/menu` },
])

useSchemaOrg([
  {
    '@type': 'Restaurant',
    name: "Papa Everett's Pizza Co.",
    servesCuisine: 'Pizza',
    hasMenu: `${appUrl}/menu`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '910 US-18 E',
      addressLocality: 'Clear Lake',
      addressRegion: 'IA',
      postalCode: '50428',
      addressCountry: 'US',
    },
  },
])

const { items, categories, pending, error } = useMenu()
const { data: photosData, status: photosStatus } = await useAsyncData('location-photos', () => $fetch('/api/photos'))
const photos = computed(() => photosData.value?.data || [])

// displayPrice is an alias for formatPrice for backwards compatibility in this template
const displayPrice = formatPrice

const hiddenPriceKeyPrefixes = ['topping_', 'deep_dish_']

function toPriceKeyLabel(key: string) {
  if (menuSizeLabels[key]) return menuSizeLabels[key]
  return key.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
}

function isVisiblePriceKey(key: string) {
  return !hiddenPriceKeyPrefixes.some(prefix => key.startsWith(prefix))
}

function getOrderedPriceKeys(prices: MenuPrices) {
  return Object.keys(prices || {})
    .filter(key => isVisiblePriceKey(key) && (prices[key] ?? 0) > 0)
    .sort((a, b) => {
      const aIndex = menuSizeOrder.indexOf(a as any)
      const bIndex = menuSizeOrder.indexOf(b as any)
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1
      return a.localeCompare(b)
    })
}

function priceEntries(item: MenuItem) {
  return getOrderedPriceKeys(item.prices).map(key => ({
    key,
    label: toPriceKeyLabel(key),
    value: item.prices[key],
  }))
}

function hasVisiblePrices(item: MenuItem) {
  return getOrderedPriceKeys(item.prices).length > 0
}

const visibleCategories = computed(() =>
  categories.value.filter(section => section.items.length > 0 && section.category !== 'Build Your Own Masterpiece')
)

const secondPizzaCategories = [
  'Build Your Own Masterpiece',
  'Gourmet Pizzas',
  'Favorite Pizzas',
  'Exclusive Pizzas',
  'Desserts',
]



// Lightbox for food photos
const lightboxSrc = ref<string | null>(null)
const lightboxAlt = ref('')

function openLightbox(src: string, alt: string) {
  lightboxSrc.value = src
  lightboxAlt.value = alt
}

function closeLightbox() {
  lightboxSrc.value = null
}

// Close on Escape key
if (import.meta.client) {
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLightbox() }
  onMounted(() => document.addEventListener('keydown', onKey))
  onUnmounted(() => document.removeEventListener('keydown', onKey))
}
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <header class="mb-8">
      <h1 class="font-display text-5xl">Menu</h1>
      <p class="warm-muted mt-3 max-w-3xl">All prices reflect our current menu data. Tap any menu scan image to view full-size.</p>
    </header>

    <!-- Link to Paper Menu -->
    <div class="mb-10 p-6 sm:p-8 rounded-2xl bg-linear-to-br from-pizza-red/5 to-transparent border border-pizza-red/10 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div>
        <h2 class="font-display text-2xl text-pizza-red mb-1">Looking for the Original Paper Menu?</h2>
        <p class="warm-muted text-sm max-w-lg">View high-resolution scans of the physical menu we hand out in the restaurant, complete with pinch-to-zoom support.</p>
      </div>
      <UButton
        to="/paper-menu"
        color="primary"
        size="lg"
        icon="i-lucide-file-text"
        trailing
        class="shrink-0 shadow-sm"
      >
        View Paper Menu
      </UButton>
    </div>

    <div v-if="pending" class="warm-muted">Loading menu...</div>
    <div v-else-if="error" class="text-red-600">Unable to load menu right now.</div>

    <div v-else class="space-y-10">
      <!-- ═══════════════════════════════════ Pizza Builder (integrated) ═══════════════════════════════════ -->
      <section id="pizza-builder" class="warm-card p-0 overflow-hidden border-2 border-[var(--color-pizza-red)]/20">
        <div class="bg-gradient-to-r from-[var(--color-pizza-red)]/5 to-transparent p-6 sm:p-8 border-b border-[var(--color-pizza-border)]">
          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-chef-hat" class="size-6 text-[var(--color-pizza-red)]" />
            </div>
            <div>
              <h2 class="font-display text-3xl">Build Your Own Masterpiece</h2>
              <p class="warm-muted mt-1">Choose your size, add toppings, and see your estimated price live — including 7% local tax.</p>
            </div>
          </div>
        </div>

        <div class="p-6 sm:p-8">
          <PizzaBuilderWidget :items="items" inline />
        </div>
      </section>

      <!-- ═══════════════════════════════════ Other Menu Categories ══════════════════════════════════ -->
      <section v-for="section in visibleCategories" :key="section.category" class="space-y-4">
        <!-- Category header -->
        <div class="border-b-2 border-[var(--color-pizza-red)]/15 pb-3">
          <h2 class="font-display text-3xl">{{ section.category }}</h2>
          <p v-if="secondPizzaCategories.includes(section.category)" class="warm-muted text-sm mt-1">
            2nd pizza of equal or lesser value discounted.
          </p>
        </div>

        <!-- Menu items grid for readability -->
        <div class="grid md:grid-cols-2 gap-3">
          <article
            v-for="item in section.items"
            :key="item.id"
            class="warm-card p-4 hover:shadow-md transition-all duration-300 group flex flex-col sm:flex-row gap-4 sm:items-start"
          >
            <!-- Premium Item Imagery -->
            <div v-if="item.imageUrl" class="shrink-0 w-full sm:w-28 sm:h-28 aspect-video sm:aspect-square overflow-hidden rounded-lg shadow-sm border border-[var(--color-pizza-border)]/50 group-hover:border-[var(--color-pizza-red)]/30 transition-colors cursor-zoom-in" @click="openLightbox(item.imageUrl!, item.name)">
              <img :src="item.imageUrl" :alt="item.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out">
            </div>

            <div class="flex-1 min-w-0 flex flex-col w-full">
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-lg transition-colors group-hover:text-pizza-red">{{ item.name }}</p>
                  <p v-show="item.description" class="warm-muted mt-1 text-sm leading-relaxed">{{ item.description || '' }}</p>
                </div>
                <div v-if="hasVisiblePrices(item) && priceEntries(item).length === 1" class="text-lg font-medium whitespace-nowrap text-pizza-text mt-0.5">
                  {{ displayPrice(priceEntries(item)[0]?.value ?? 0) }}
                </div>
              </div>

            <div v-if="hasVisiblePrices(item) && priceEntries(item).length > 1" class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="entry in priceEntries(item)"
                :key="`${item.id}-${entry.key}`"
                class="text-sm rounded-lg border border-[var(--color-pizza-border)] px-3 py-1.5 bg-white font-medium"
              >
                <span class="warm-muted font-normal">{{ entry.label }}:</span>
                <span class="text-[var(--color-pizza-text)]"> {{ displayPrice(entry.value) }}</span>
              </span>
            </div>
            <div v-else-if="!hasVisiblePrices(item)" class="mt-3 text-sm font-medium">
              <a :href="restaurantInfo.phoneHref" class="text-pizza-red hover:text-pizza-red/80 transition-colors underline decoration-pizza-red/40 underline-offset-4">
                {{ callForCurrentPriceLabel }}
              </a>
            </div>
            </div> <!-- End flex-1 container -->
          </article>
        </div>
      </section>
    </div>

    <!-- Fullscreen Lightbox -->
    <ClientOnly>
      <Teleport to="body">
        <Transition name="fade">
          <div
            v-if="lightboxSrc"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm cursor-zoom-out p-4"
            @click="closeLightbox"
          >
            <img
              :src="lightboxSrc"
              :alt="lightboxAlt"
              class="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
              @click.stop
            />
            <button class="absolute top-4 right-4 text-white/70 hover:text-white transition-colors" @click="closeLightbox">
              <UIcon name="i-lucide-x" class="size-8" />
            </button>
            <p class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-black/40 px-4 py-1.5 rounded-full">{{ lightboxAlt }}</p>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
