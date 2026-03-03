<script setup lang="ts">
import { restaurantInfo, siteImages } from '~/composables/useRestaurantInfo'

useSeo({
  title: "Schools & Teams | Papa Everett's Pizza Co.",
  description: 'Supporting Clear Lake Lions and local schools through meal programs and event catering since 1988.',
  ogImage: {
    title: 'School & Team Partnerships',
    description: 'Fueling schools and teams in Clear Lake.',
    icon: 'i-lucide-school',
  },
})

useWebPageSchema({
  name: 'Schools & Teams',
  description: 'School and team partnership programs in Clear Lake, Iowa.',
})

const { appUrl } = useRuntimeConfig().public

useBreadcrumbSchema([
  { name: 'Home', url: `${appUrl}/` },
  { name: 'Schools & Teams', url: `${appUrl}/schools` },
])
</script>

<template>
  <div>
    <!-- Hero section with real school/team image -->
    <section class="hero-section">
      <img :src="siteImages.heroSchools" alt="School and team sports" class="hero-bg">
      <div class="max-w-4xl mx-auto px-4 py-16">
        <h1 class="font-display text-5xl sm:text-6xl text-white mb-4">Proudly Supporting Clear Lake Lions</h1>
        <p class="text-white/80 text-lg max-w-2xl mx-auto">
          Fueling school events, team celebrations, and community pride with handcrafted pizza since 1988.
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Lions logo -->
      <div class="flex justify-center mb-8">
        <img :src="siteImages.clearLakeLions" alt="Clear Lake Community School District — Lion Pride" class="h-28 w-auto">
      </div>

      <div class="warm-card p-8 mb-8">
        <h2 class="font-display text-2xl mb-3">Made for Schools &amp; Teams</h2>
        <p class="warm-muted leading-relaxed">
          Reliable catering for game nights, banquets, and team celebrations.
          We understand tight schedules and hungry teams. From the first whistle to the final buzzer, we've got your meals covered.
        </p>
      </div>

      <div class="warm-card p-8 mb-8">
        <h2 class="font-display text-2xl mb-4">Perfect For</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div v-for="item in ['Game nights', 'Team meals', 'School fundraisers', 'Banquets & award nights', 'Club meetings', 'Post-game celebrations']" :key="item" class="flex items-center gap-2 warm-muted">
            <UIcon name="i-lucide-check-circle" class="size-5 text-pizza-accent shrink-0" />
            <span>{{ item }}</span>
          </div>
        </div>
      </div>

      <div class="warm-card p-8 mb-8">
        <h2 class="font-display text-2xl mb-4">Why Choose Us</h2>
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-calendar-check" class="size-5 text-pizza-accent shrink-0 mt-0.5" />
            <div>
              <p class="font-semibold">Experience with Large Orders</p>
              <p class="warm-muted text-sm">From dozens to hundreds of pizzas — we've done it all</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-truck" class="size-5 text-pizza-accent shrink-0 mt-0.5" />
            <div>
              <p class="font-semibold">Reliable Delivery</p>
              <p class="warm-muted text-sm">Hot and on time — always</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-list-checks" class="size-5 text-pizza-accent shrink-0 mt-0.5" />
            <div>
              <p class="font-semibold">Flexible Menu Options</p>
              <p class="warm-muted text-sm">Custom menu packages for any size group</p>
            </div>
          </div>
        </div>
      </div>

      <div class="warm-card p-6 text-center bg-linear-to-br from-pizza-blue/5 to-transparent">
        <p class="font-display text-2xl text-pizza-blue">Go Lions! 🦁</p>
        <p class="warm-muted mt-2">Thank you for supporting a local business that proudly supports Clear Lake schools and teams.</p>
        <p class="mt-4"><ULink :to="restaurantInfo.phoneHref" class="text-pizza-accent hover:text-pizza-accent/80 transition-colors underline decoration-pizza-accent/40 underline-offset-4 font-semibold text-lg">Call (641) 357-4040</ULink> for school and team orders.</p>
      </div>
    </section>
  </div>
</template>
