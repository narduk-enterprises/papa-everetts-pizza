<script setup lang="ts">
import { formatPrice, restaurantInfo, siteImages } from '~/composables/useRestaurantInfo'
import { homepagePhotos } from '~/composables/usePhotos'

const { categories, pending } = useMenu()
const info = restaurantInfo

useSeo({
  title: "Papa Everett's Pizza Co. | Clear Lake Pizza Since 1988",
  description: 'Handcrafted Pizza. Proudly Serving Clear Lake Since 1988. Dine-in, carryout, delivery, and catering in Clear Lake, Iowa.',
  image: 'https://papaeverettspizza.com/images/og-logo.jpg',
})

useWebPageSchema({
  name: "Papa Everett's Pizza Co.",
  description: 'Family-owned pizza restaurant in Clear Lake, Iowa.',
})

useFAQSchema([
  { question: 'Does Papa Everett\'s deliver?', answer: 'Yes! Delivery begins after 4:30 PM daily. Call (641) 357-4040 to place your order.' },
  { question: 'What are the hours?', answer: 'Sunday, Tuesday-Thursday: 11 AM - 9 PM. Monday: 4 PM - 8 PM. Friday-Saturday: 11 AM - 10 PM.' },
  { question: 'Do you have daily specials?', answer: 'Yes! We offer rotating specials throughout the week. Call or visit for today\'s deal.' },
  { question: 'Does Papa Everett\'s cater events?', answer: 'Absolutely! We cater events of all sizes. Visit our catering page or call (641) 357-4040 for a custom quote.' },
  { question: 'Where is Papa Everett\'s located?', answer: '910 US-18 E, Clear Lake, IA 50428. We\'ve been proudly serving Clear Lake since 1988.' },
])

const { appUrl } = useRuntimeConfig().public

useBreadcrumbSchema([
  { name: 'Home', url: `${appUrl}/` },
])



const featuredItems = computed(() => {
  const preferred = ['Build Your Own Masterpiece', 'Combo', 'Meatavore', 'Lasagna']
  const all = categories.value.flatMap(group => group.items)
  return preferred
    .map(name => all.find(item => item.name === name))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
})

function startingPrice(prices: Record<string, number | null>) {
  const baseSizes = ['le_petit', 'small', 'medium', 'large', 'xl', 'single']
  const numeric = Object.entries(prices)
    .filter(([key, value]) => baseSizes.includes(key) && typeof value === 'number' && value > 0)
    .map(([_, value]) => value as number)
  return numeric.length ? Math.min(...numeric) : null
}
</script>

<template>
  <div>
    <!-- Hero section -->
    <section class="relative min-h-[74vh] bg-[var(--color-pizza-bg)]">
      <img :src="siteImages.heroMain" alt="Papa Everett's featured pizza" class="absolute inset-0 h-full w-full object-cover">
      <!-- Darkened overlay — clean dark gradient for text legibility -->
      <div class="absolute inset-0 bg-linear-to-r from-[#0f172a]/90 via-[#0f172a]/70 to-[#0f172a]/50" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <p class="uppercase tracking-[0.2em] text-[var(--color-pizza-gold)] text-sm mb-4 font-semibold">Clear Lake, Iowa</p>
        <h1 class="font-display text-4xl sm:text-5xl lg:text-7xl max-w-4xl leading-tight text-white drop-shadow-md">
          Handcrafted Pizza. Proudly Serving Clear Lake Since 1988.
        </h1>
        <p class="mt-6 max-w-2xl text-white/90 text-xl font-medium">
          Your go-to spot for delicious, handcrafted pizzas, wings, pasta, and more. Freshly made and served with love.
        </p>
        <div class="mt-10 flex flex-wrap gap-4">
          <ULink to="/menu" class="btn-primary">View Full Menu</ULink>
          <ULink :to="info.phoneHref" class="btn-secondary !text-white !border-white hover:!bg-white/10 text-base">
            <UIcon name="i-lucide-phone" class="size-5 mr-2" />
            Order Now - (641) 357-4040
          </ULink>
        </div>
      </div>
    </section>

    <!-- Hours & Call card -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-3 gap-8">
      <div class="card p-8 lg:col-span-2">
        <h2 class="font-display text-3xl text-[var(--color-pizza-text)]">Today's Hours</h2>
        <ul class="mt-4 space-y-3 text-[var(--color-pizza-muted)] text-lg">
          <li v-for="line in info.hours" :key="line">{{ line }}</li>
        </ul>
      </div>
      <div class="card p-8 bg-[var(--color-pizza-primary)] text-white border-none shadow-[var(--shadow-lg)] justify-center flex flex-col">
        <span class="block uppercase text-xs tracking-[0.2em] text-white/80 font-bold mb-2">Call Us</span>
        <ULink :to="info.phoneHref" class="block text-4xl font-display text-white hover:text-[var(--color-pizza-gold)] transition-colors">{{ info.phone }}</ULink>
        <p class="text-white/80 mt-4 text-base font-medium">Dine-in, carryout, delivery, and catering.</p>
      </div>
    </section>

    <!-- Featured Favorites -->
    <section class="bg-[var(--color-pizza-bg-soft)] py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="font-display text-4xl mb-10 text-center text-[var(--color-pizza-text)]">Featured Favorites</h2>
        <div v-if="pending" class="text-center text-[var(--color-pizza-muted)]">Loading menu highlights...</div>
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink v-for="item in featuredItems" :key="item.id" to="/menu" class="card p-6 flex flex-col bg-white">
            <p class="text-xs uppercase tracking-[0.2em] text-[var(--color-pizza-primary)] font-bold">{{ item.category }}</p>
            <h3 class="font-semibold text-xl mt-3 text-[var(--color-pizza-text)]">{{ item.name }}</h3>
            <p v-show="item.description" class="text-[var(--color-pizza-muted)] text-sm mx-auto mt-2 mb-4 line-clamp-3 grow">{{ item.description || '' }}</p>
            <p class="text-[var(--color-pizza-text)] font-semibold text-base mt-auto">Starting at {{ formatPrice(startingPrice(item.prices)) }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- From Our Kitchen photo strip -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="flex items-end justify-between mb-8">
        <div>
          <p class="uppercase text-xs tracking-[0.2em] text-[var(--color-pizza-secondary)] font-bold mb-2">Gallery</p>
          <h2 class="font-display text-4xl text-[var(--color-pizza-text)]">Straight from Our Kitchen</h2>
        </div>
        <ULink to="/gallery" class="text-sm font-semibold text-[var(--color-pizza-primary)] hover:text-[var(--color-pizza-primary-dark)] transition-colors flex items-center gap-1">
          View All Photos <UIcon name="i-lucide-arrow-right" class="size-4" />
        </ULink>
      </div>
      <PhotoStrip :photos="homepagePhotos" class="rounded-xl overflow-hidden shadow-md" />
    </section>

    <!-- Build Your Own highlight -->
    <section class="bg-[var(--color-pizza-surface)] py-20 border-y border-[var(--color-pizza-border)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="relative">
            <div class="absolute inset-0 bg-[var(--color-pizza-primary)]/10 translate-x-4 translate-y-4 rounded-2xl"></div>
            <img :src="siteImages.buildYourOwnHero" alt="Build Your Own Masterpiece pizza" class="relative rounded-2xl border border-[var(--color-pizza-border)] shadow-lg hover:shadow-xl transition-shadow duration-300 w-full object-cover aspect-4/3">
          </div>
          <div>
            <p class="uppercase text-sm tracking-[0.2em] text-[var(--color-pizza-primary)] font-bold mb-3">Custom Creation</p>
            <h2 class="font-display text-4xl lg:text-5xl text-[var(--color-pizza-text)]">Build Your Own Masterpiece</h2>
            <p class="text-[var(--color-pizza-muted)] mt-6 text-lg leading-relaxed">
              Start with cheese included on our exclusive French bread dough pizza. Add your choice of toppings — each topping is an additional charge. Choose from five sizes: Le Petit, Small, Medium, Large, or XL.
            </p>
            <div class="mt-8">
              <ULink to="/menu#pizza-builder" class="btn-primary">Start Building</ULink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Customer Reviews -->
    <CustomerReviews />

    <!-- Our Story teaser -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="order-2 lg:order-1">
          <h2 class="font-display text-4xl lg:text-5xl text-[var(--color-pizza-text)]">Our Story</h2>
          <p class="text-[var(--color-pizza-muted)] mt-6 text-lg leading-relaxed">
            Papa Everett's Pizza has been part of the Clear Lake community since 1988. Family-owned, community-focused,
            and proud supporters of local schools, sports teams, and fundraiser events year-round.
          </p>
          <div class="mt-8">
            <ULink to="/about" class="btn-secondary">Learn More About Us</ULink>
          </div>
        </div>
        <div class="relative order-1 lg:order-2">
            <div class="absolute inset-0 bg-[var(--color-pizza-cta)]/10 -translate-x-4 -translate-y-4 rounded-2xl"></div>
            <img :src="siteImages.heroDining" alt="Papa Everett family photo" class="relative rounded-2xl border border-[var(--color-pizza-border)] shadow-lg hover:shadow-xl transition-shadow duration-300 w-full object-cover aspect-4/3">
        </div>
      </div>
    </section>
  </div>
</template>
