<script setup lang="ts">
import { siteImages } from '~/composables/useRestaurantInfo'
import { aboutPhotos } from '~/composables/usePhotos'

useSeo({
  title: "About | Papa Everett's Pizza Co.",
  description: "Serving Clear Lake since 1988. Learn how Papa Everett's Pizza Co. supports local families, schools, and community events.",
  ogImage: {
    title: 'About Papa Everett\'s Pizza Co.',
    description: 'Family-owned pizza in Clear Lake since 1988.',
    icon: 'i-lucide-store',
  },
})

useWebPageSchema({
  type: 'AboutPage',
  name: "About Papa Everett's Pizza Co.",
  description: 'Family-owned and community-focused pizzeria in Clear Lake, Iowa.',
})

useFAQSchema([
  { question: 'How long has Papa Everett\'s been open?', answer: 'Papa Everett\'s Pizza has been proudly serving Clear Lake, Iowa since 1988.' },
  { question: 'Is Papa Everett\'s family-owned?', answer: 'Yes! Papa Everett\'s is a family-owned and operated restaurant deeply rooted in the Clear Lake community.' },
  { question: 'Does Papa Everett\'s support the community?', answer: 'Absolutely. We regularly partner with local schools, teams, and organizations for fundraiser nights and catering.' },
])

const { appUrl } = useRuntimeConfig().public

useBreadcrumbSchema([
  { name: 'Home', url: `${appUrl}/` },
  { name: 'About', url: `${appUrl}/about` },
])
</script>

<template>
  <div>
    <!-- Hero section -->
    <section class="hero-section">
      <img :src="siteImages.heroAbout" alt="Papa Everett's Pizza family" class="hero-bg">
      <div class="max-w-4xl mx-auto px-4 py-16">
        <h1 class="font-display text-5xl sm:text-6xl text-white mb-4">About Us</h1>
        <p class="text-white/80 text-lg max-w-2xl mx-auto">
          Family-owned and community-focused since 1988
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid lg:grid-cols-2 gap-10 items-start">
        <div class="warm-card overflow-hidden">
          <img
            :src="siteImages.about"
            alt="Papa Everett's legacy"
            class="w-full h-auto object-contain rounded-xl"
          >
        </div>

        <div class="space-y-5">
          <div class="warm-card p-6 space-y-4 text-[var(--color-pizza-muted)] leading-relaxed">
            <p>
              Papa Everett's Pizza has been part of the Clear Lake community since 1988. What started as a
              simple dream to serve handcrafted pizza to families has grown into a beloved local landmark on US-18.
            </p>
            <p>
              We serve pizzas on our exclusive French bread dough — a recipe perfected over decades. Along with our
              signature pizzas, we offer wings, oven-baked pastas, appetizers, salads, and dessert pizzas.
            </p>
            <p>
              As a family-owned local business, we stay deeply involved in the community: hosting fundraiser nights
              for local organizations, supporting Clear Lake schools and sports teams, and catering events across the area.
            </p>
            <p>
              Whether you're joining us for dine-in, carryout, or delivery, we appreciate every order and every visit.
              Thank you for supporting a local business that proudly supports Clear Lake.
            </p>
          </div>

          <div class="warm-card p-6">
            <h2 class="font-display text-2xl mb-3">Community First</h2>
            <ul class="space-y-2 text-[var(--color-pizza-muted)]">
              <li class="flex items-start gap-2">
                <UIcon name="i-lucide-heart" class="size-5 text-[var(--color-pizza-primary)] shrink-0 mt-0.5" />
                <span>Supporting local schools through lunch programs and event partnerships</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon name="i-lucide-users" class="size-5 text-[var(--color-pizza-primary)] shrink-0 mt-0.5" />
                <span>Hosting fundraiser nights for schools, teams, and nonprofits</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon name="i-lucide-utensils" class="size-5 text-[var(--color-pizza-primary)] shrink-0 mt-0.5" />
                <span>Catering for events, parties, and group gatherings across Clear Lake</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon name="i-lucide-trophy" class="size-5 text-[var(--color-pizza-primary)] shrink-0 mt-0.5" />
                <span>Proudly supporting Clear Lake Lions athletics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Inside Papa Everett's photo section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 class="font-display text-3xl mb-6">Inside Papa Everett's</h2>
      <PhotoGallery :photos="aboutPhotos" :columns="3" />
    </section>
  </div>
</template>
