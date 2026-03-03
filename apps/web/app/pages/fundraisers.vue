<script setup lang="ts">
import { restaurantInfo, siteImages } from '~/composables/useRestaurantInfo'

useSeo({
  title: "Fundraisers | Papa Everett's Pizza Co.",
  description: 'Partner with Papa Everett\'s Pizza Co. for fundraiser nights supporting local schools and organizations in Clear Lake.',
  ogImage: {
    title: 'Fundraiser Nights',
    description: 'Local partnership programs for schools and nonprofits.',
    icon: 'i-lucide-hand-heart',
  },
})

useWebPageSchema({
  name: 'Fundraisers',
  description: 'Fundraiser partnership information for local organizations and schools.',
})

useFAQSchema([
  { question: 'How do fundraiser nights work?', answer: 'We donate a percentage of meal sales back to your organization on your scheduled fundraiser night. It\'s easy — your group eats pizza, and we give back!' },
  { question: 'How do I schedule a fundraiser night?', answer: 'Call (641) 357-4040 or visit our contact page to set up a fundraiser night for your school, team, or organization.' },
  { question: 'What organizations can host a fundraiser?', answer: 'Schools, sports teams, churches, nonprofits, and any local community organization are welcome to partner with us.' },
])

const { appUrl } = useRuntimeConfig().public

useBreadcrumbSchema([
  { name: 'Home', url: `${appUrl}/` },
  { name: 'Fundraisers', url: `${appUrl}/fundraisers` },
])
</script>

<template>
  <div>
    <!-- Hero section with real fundraiser image -->
    <section class="hero-section">
      <img :src="siteImages.heroFundraiser" alt="Community fundraiser" class="hero-bg">
      <div class="max-w-4xl mx-auto px-4 py-16">
        <h1 class="font-display text-5xl sm:text-6xl text-white mb-4">Raise Funds the Easy (and Delicious) Way</h1>
        <p class="text-white/80 text-lg max-w-2xl mx-auto">
          Papa Everett's Pizza proudly supports Clear Lake schools, teams, and organizations with fundraiser nights.
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="warm-card p-8 mb-8">
        <p class="warm-muted leading-relaxed text-lg">
          Fundraiser nights are simple, effective, and delicious. No upfront costs to your organization.
          Just pick a night, spread the word, and earn funds while your supporters enjoy great pizza.
        </p>
      </div>

      <h2 class="font-display text-3xl mb-6">How It Works</h2>
      <div class="grid md:grid-cols-3 gap-4 mb-10">
        <article class="warm-card p-6 text-center">
          <div class="w-14 h-14 rounded-full bg-[var(--color-pizza-primary)]/10 flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-lucide-calendar" class="size-7 text-[var(--color-pizza-primary)]" />
          </div>
          <h3 class="font-semibold text-lg">1. Schedule a Night</h3>
          <p class="warm-muted mt-2 text-sm">Coordinate a fundraiser evening with our team. We'll reserve the date.</p>
        </article>
        <article class="warm-card p-6 text-center">
          <div class="w-14 h-14 rounded-full bg-[var(--color-pizza-primary)]/10 flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-lucide-megaphone" class="size-7 text-[var(--color-pizza-primary)]" />
          </div>
          <h3 class="font-semibold text-lg">2. Spread the Word</h3>
          <p class="warm-muted mt-2 text-sm">Invite families and supporters to dine in, carryout, or order delivery.</p>
        </article>
        <article class="warm-card p-6 text-center">
          <div class="w-14 h-14 rounded-full bg-[var(--color-pizza-primary)]/10 flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-lucide-hand-heart" class="size-7 text-[var(--color-pizza-primary)]" />
          </div>
          <h3 class="font-semibold text-lg">3. Earn Funds</h3>
          <p class="warm-muted mt-2 text-sm">A portion of qualifying sales goes back to your organization.</p>
        </article>
      </div>

      <div class="warm-card p-8 mb-8">
        <h2 class="font-display text-2xl mb-4">Perfect For</h2>
        <div class="grid sm:grid-cols-2 gap-2">
          <div v-for="item in ['Schools and PTOs', 'Sports teams', 'Clubs & activities', 'Churches', 'Nonprofits & community organizations']" :key="item" class="flex items-center gap-2 warm-muted">
            <UIcon name="i-lucide-check-circle" class="size-5 text-[var(--color-pizza-primary)] shrink-0" />
            <span>{{ item }}</span>
          </div>
        </div>
      </div>

      <div class="warm-card p-8">
        <h2 class="font-display text-2xl mb-4">Why Fundraise with Us?</h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-home" class="size-5 text-[var(--color-pizza-primary)] shrink-0 mt-0.5" />
            <div>
              <p class="font-semibold">Local Family-Owned</p>
              <p class="warm-muted text-sm">Your dollars stay in the Clear Lake community</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-zap" class="size-5 text-[var(--color-pizza-primary)] shrink-0 mt-0.5" />
            <div>
              <p class="font-semibold">Easy Setup</p>
              <p class="warm-muted text-sm">We handle the food — you handle the fun</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-wallet" class="size-5 text-[var(--color-pizza-primary)] shrink-0 mt-0.5" />
            <div>
              <p class="font-semibold">No Upfront Costs</p>
              <p class="warm-muted text-sm">Zero risk for your organization</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-star" class="size-5 text-[var(--color-pizza-primary)] shrink-0 mt-0.5" />
            <div>
              <p class="font-semibold">Trusted Since 1988</p>
              <p class="warm-muted text-sm">A Clear Lake favorite for over 35 years</p>
            </div>
          </div>
        </div>
      </div>

      <div class="warm-card p-6 mt-8 text-center">
        <p class="text-lg">Ready to schedule a fundraiser night?</p>
        <p class="mt-2"><ULink :to="restaurantInfo.phoneHref" class="text-[var(--color-pizza-primary)] hover:text-[var(--color-pizza-primary-dark)] transition-colors underline decoration-[var(--color-pizza-primary)]/40 underline-offset-4 font-semibold text-lg">Call (641) 357-4040</ULink> or use our <NuxtLink to="/contact" class="text-[var(--color-pizza-primary)] font-semibold">contact form</NuxtLink>.</p>
      </div>
    </section>
  </div>
</template>
