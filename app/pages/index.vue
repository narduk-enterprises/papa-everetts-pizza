<script setup lang="ts">
import { formatPrice, restaurantInfo, siteImages } from '~/composables/useRestaurantInfo'
import { homepagePhotos } from '~/composables/usePhotos'

const { categories, pending } = useMenu()
const info = restaurantInfo

useSeo({
  title: 'Handcrafted Pizza in Clear Lake, Iowa Since 1988',
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
    <section class="relative min-h-[74vh]">
      <img :src="siteImages.heroMain" alt="Papa Everett's featured pizza" class="absolute inset-0 h-full w-full object-cover" width="1920" height="1080">
      <div class="absolute inset-0 bg-linear-to-r from-[#0f172a]/85 via-[#0f172a]/65 to-[#0f172a]/50" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <p class="uppercase tracking-[0.2em] text-pizza-gold text-sm mb-4 font-semibold">Clear Lake, Iowa</p>
        <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl max-w-3xl leading-tight text-white">
          Handcrafted Pizza. Proudly Serving Clear Lake Since 1988.
        </h1>
        <p class="mt-6 max-w-2xl text-white/80 text-lg">
          Your go-to spot for delicious, handcrafted pizzas, wings, pasta, and more. Freshly made and served with love.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <UButton to="/menu" size="lg">View Full Menu</UButton>
          <ULink :to="info.phoneHref" class="cta-phone text-base px-6 py-3">
            <UIcon name="i-lucide-phone" class="size-5" />
            Order Now - (641) 357-4040
          </ULink>
        </div>
      </div>
    </section>

    <!-- Hours & Call card -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-3 gap-6">
      <div class="warm-card p-6 lg:col-span-2">
        <h2 class="font-display text-3xl">Today's Hours</h2>
        <ul class="mt-4 space-y-2 warm-muted">
          <li v-for="line in info.hours" :key="line">{{ line }}</li>
        </ul>
      </div>
      <div class="warm-card p-6">
        <ULink :to="restaurantInfo.phoneHref" class="block uppercase text-xs tracking-[0.2em] text-pizza-accent hover:text-pizza-accent/80 transition-colors font-semibold">Call Us</ULink>
        <ULink :to="info.phoneHref" class="block text-3xl font-display mt-2 text-pizza-text">{{ info.phone }}</ULink>
        <p class="warm-muted mt-3">Dine-in, carryout, delivery, and catering.</p>
      </div>
    </section>

    <!-- Featured Favorites -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 class="font-display text-3xl mb-6">Featured Favorites</h2>
      <div v-if="pending" class="warm-muted">Loading menu highlights...</div>
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <article v-for="item in featuredItems" :key="item.id" class="warm-card p-5 hover:shadow-md transition-shadow">
          <p class="text-xs uppercase tracking-[0.2em] text-pizza-accent font-semibold">{{ item.category }}</p>
          <h3 class="font-semibold text-lg mt-2">{{ item.name }}</h3>
          <p v-show="item.description" class="warm-muted text-sm mt-1 line-clamp-2">{{ item.description || '' }}</p>
          <p class="warm-muted text-sm mt-2">Starting at {{ formatPrice(startingPrice(item.prices)) }}</p>
        </article>
      </div>
    </section>

    <!-- From Our Kitchen photo strip -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-display text-3xl">Straight from Our Kitchen</h2>
        <ULink to="/gallery" class="text-sm text-pizza-accent hover:text-pizza-accent/80 font-medium transition-colors">
          View All Photos →
        </ULink>
      </div>
      <PhotoStrip :photos="homepagePhotos" />
    </section>

    <!-- Build Your Own highlight -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid lg:grid-cols-2 gap-8 items-center">
        <img :src="siteImages.buildYourOwnHero" alt="Build Your Own Masterpiece pizza" class="rounded-2xl border border-pizza-border shadow-sm">
        <div>
          <p class="uppercase text-xs tracking-[0.2em] text-pizza-accent font-semibold mb-3">Build Your Own</p>
          <h2 class="font-display text-3xl">Build Your Own Masterpiece</h2>
          <p class="warm-muted mt-4 leading-relaxed">
            Start with cheese included on our exclusive French bread dough pizza. Add your choice of toppings — each topping is an additional charge. Choose from five sizes: Le Petit, Small, Medium, Large, or XL.
          </p>
          <UButton to="/menu#pizza-builder" class="mt-6" size="lg">Start Building</UButton>
        </div>
      </div>
    </section>

    <!-- Customer Reviews -->
    <CustomerReviews />

    <!-- Our Story teaser -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid lg:grid-cols-2 gap-8 items-center">
      <img :src="siteImages.heroDining" alt="Papa Everett family photo" class="rounded-2xl border border-pizza-border shadow-sm">
      <div>
        <h2 class="font-display text-3xl">Our Story</h2>
        <p class="warm-muted mt-4 leading-relaxed">
          Papa Everett's Pizza has been part of the Clear Lake community since 1988. Family-owned, community-focused,
          and proud supporters of local schools, sports teams, and fundraiser events year-round.
        </p>
        <UButton to="/about" class="mt-6" color="neutral" variant="soft">Learn More About Us</UButton>
      </div>
    </section>
  </div>
</template>
