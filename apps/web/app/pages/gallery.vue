<script setup lang="ts">
import { siteImages } from '~/composables/useRestaurantInfo'
import { allPhotos } from '~/composables/usePhotos'

useSeo({
  title: "Photo Gallery | Papa Everett's Pizza Co.",
  description: "Browse photos of our handcrafted pizzas, pasta, and restaurant in Clear Lake, Iowa. Everything made fresh daily.",
  ogImage: {
    title: "Papa Everett's Photo Gallery",
    description: 'Our food speaks for itself.',
    icon: 'i-lucide-camera',
  },
})

useWebPageSchema({
  type: 'CollectionPage',
  name: "Photo Gallery | Papa Everett's Pizza Co.",
  description: 'Photo gallery showcasing food and atmosphere at Papa Everett\'s Pizza.',
})

const { appUrl } = useRuntimeConfig().public

useBreadcrumbSchema([
  { name: 'Home', url: `${appUrl}/` },
  { name: 'Gallery', url: `${appUrl}/gallery` },
])

const activeFilter = ref<string>('all')

const filters = [
  { key: 'all', label: 'All' },
  { key: 'pizza', label: 'Pizza' },
  { key: 'pasta', label: 'Pasta & Sides' },
  { key: 'restaurant', label: 'Restaurant' },
]

const filteredPhotos = computed(() => {
  if (activeFilter.value === 'all') return allPhotos
  if (activeFilter.value === 'pasta') {
    return allPhotos.filter(p => p.category === 'pasta' || p.category === 'sides')
  }
  if (activeFilter.value === 'restaurant') {
    return allPhotos.filter(p => p.category === 'restaurant' || p.category === 'team' || p.category === 'branding')
  }
  return allPhotos.filter(p => p.category === activeFilter.value)
})
</script>

<template>
  <div>
    <!-- Hero section -->
    <section class="hero-section">
      <img :src="siteImages.heroMain" alt="Papa Everett's kitchen" class="hero-bg">
      <div class="max-w-4xl mx-auto px-4 py-16">
        <h1 class="font-display text-5xl sm:text-6xl text-white mb-4">Photo Gallery</h1>
        <p class="text-white/80 text-lg max-w-2xl mx-auto">
          Real food, real kitchen, real Clear Lake since 1988
        </p>
      </div>
    </section>

    <!-- Filters + Gallery -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Filter buttons -->
      <div class="flex flex-wrap gap-2 mb-8">
        <UButton
          v-for="filter in filters"
          :key="filter.key"
          :color="activeFilter === filter.key ? 'primary' : 'neutral'"
          :variant="activeFilter === filter.key ? 'solid' : 'outline'"
          size="sm"
          class="rounded-full"
          @click="activeFilter = filter.key"
        >
          {{ filter.label }}
        </UButton>
      </div>

      <!-- Photo count -->
      <p class="warm-muted text-sm mb-4">
        {{ filteredPhotos.length }} {{ filteredPhotos.length === 1 ? 'photo' : 'photos' }}
      </p>

      <!-- Gallery grid -->
      <PhotoGallery :photos="filteredPhotos" :columns="4" />
    </section>
  </div>
</template>


