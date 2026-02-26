<script setup lang="ts">
import { restaurantInfo, siteImages } from '~/composables/useRestaurantInfo'

const { items, pending, error } = useMenu()

useSeo({
  title: "Pizza Builder | Papa Everett's Pizza Co.",
  description: 'Customize your build-your-own pizza with live pricing for size, deep dish, and toppings.',
  ogImage: {
    title: "Papa Everett's Pizza Builder",
    description: 'Customize your pizza and get a live price estimate.',
    icon: 'i-lucide-pizza',
  },
})

useWebPageSchema({
  name: "Papa Everett's Pizza Builder",
  description: 'Interactive build-your-own pizza estimator with current pricing.',
})
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
    <header class="space-y-2 sm:space-y-3">
      <h1 class="font-display text-4xl sm:text-5xl">Pizza Builder</h1>
      <p class="warm-muted max-w-3xl text-sm sm:text-base">
        Build your pizza the same way we do at the counter: choose your size, deep-dish option, and toppings to see a live estimate including 7% local tax.
      </p>
    </header>

    <!-- Hero — smaller on mobile, side-by-side on desktop -->
    <div class="grid sm:grid-cols-[1.2fr_1fr] gap-4 sm:gap-6 items-stretch">
      <img
        :src="siteImages.buildYourOwnHero"
        alt="Build Your Own Masterpiece pizza"
        class="rounded-2xl border border-[var(--color-pizza-border)] w-full h-48 sm:h-full min-h-0 sm:min-h-[260px] object-cover shadow-sm"
      >

      <div class="warm-card p-5 sm:p-6 space-y-3">
        <p class="uppercase text-xs tracking-[0.2em] text-[var(--color-pizza-red)] font-semibold">Pricing Basis</p>
        <p class="text-lg font-semibold">Build Your Own Masterpiece</p>
        <p class="warm-muted text-sm">
          Start with cheese included on our exclusive French bread dough pizza. Add your choice of toppings — each topping is an additional charge.
        </p>
        <p class="warm-muted text-sm">For exact order totals <a :href="restaurantInfo.phoneHref" class="text-[var(--color-pizza-red)] hover:text-[var(--color-pizza-red)]/80 transition-colors underline decoration-[var(--color-pizza-red)]/40 underline-offset-4 font-medium">call (641) 357-4040</a>.</p>
      </div>
    </div>

    <div v-if="pending" class="warm-muted">Loading builder pricing...</div>
    <div v-else-if="error" class="text-red-600">Unable to load current pricing right now.</div>

    <PizzaBuilderWidget v-else :items="items" />
  </section>
</template>
