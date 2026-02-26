<script setup lang="ts">
import { useAsyncData } from '#imports'

const { data, status } = useAsyncData('customer-reviews', () => $fetch('/api/reviews'))
const reviews = computed(() => data.value?.data || [])

const items = computed(() => {
  return reviews.value.map(review => ({
    id: review.id,
    author: review.author,
    date: review.date,
    text: review.text,
    source: review.source,
    rating: review.rating,
    url: review.url,
  }))
})
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="text-center mb-10">
      <p class="uppercase text-xs tracking-[0.2em] text-[--color-pizza-red] font-semibold mb-3">Community Love</p>
      <h2 class="font-display text-4xl text-pizza-text">What Our Guests Say</h2>
      <p class="warm-muted mt-4 max-w-2xl mx-auto text-lg hover:text-pizza-text transition-colors">
        Don't just take our word for it—see what Clear Lake is saying about our handcrafted pizza.
      </p>
    </div>

    <div v-if="status === 'pending'" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-pizza-gold" />
    </div>

    <div v-else-if="status === 'error'" class="text-center text-[--color-pizza-red] py-8">
      Failed to load reviews. Please try again later.
    </div>

    <div v-else-if="items.length > 0">
      <UCarousel
        v-slot="{ item }"
        :items="items"
        :ui="{
          item: 'basis-full md:basis-1/2 lg:basis-1/3 p-2',
        }"
        arrows
      >
        <UCard class="h-full flex flex-col hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm border-pizza-border/50 group" :ui="{ root: 'flex-grow flex flex-col h-full', body: 'flex-grow flex flex-col h-full' }">
          <div class="flex items-start justify-between mb-4">
            <div class="flex flex-col">
              <span class="font-bold text-lg text-pizza-text">{{ item.author }}</span>
              <span class="text-xs text-gray-500 mt-0.5">{{ item.date }}</span>
            </div>
            
            <a :href="item.url" target="_blank" rel="noopener noreferrer" class="opacity-70 hover:opacity-100 transition-opacity" :title="`View on ${item.source}`">
              <UIcon v-if="item.source === 'Google'" name="i-logos-google-icon" class="size-5" />
              <UIcon v-else-if="item.source === 'Yelp'" name="i-simple-icons-yelp" class="size-5 text-gray-400 group-hover:text-[#FF1A1A] transition-colors duration-300" />
            </a>
          </div>

          <div class="flex items-center gap-1 mb-4 text-pizza-gold">
            <UIcon v-for="i in item.rating" :key="i" name="i-lucide-star" class="fill-current size-4" />
          </div>

          <p class="text-gray-700 italic grow leading-relaxed">
            "{{ item.text }}"
          </p>
        </UCard>
      </UCarousel>
    </div>
  </section>
</template>
