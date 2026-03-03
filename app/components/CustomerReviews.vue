<script setup lang="ts">
import { useReviews } from '~/composables/useReviews'
import type { ReviewItem } from '~/composables/useReviews'

const { items, status } = useReviews()
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="text-center mb-10">
      <p class="uppercase text-xs tracking-[0.2em] text-pizza-accent font-semibold mb-3">Community Love</p>
      <h2 class="font-display text-4xl text-pizza-text">What Our Guests Say</h2>
      <p class="warm-muted mt-4 max-w-2xl mx-auto text-lg hover:text-pizza-text transition-colors">
        Don't just take our word for it—see what Clear Lake is saying about our handcrafted pizza.
      </p>
    </div>

    <div v-if="status === 'pending'" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-pizza-gold" />
    </div>

    <div v-if="status === 'error'" class="text-center text-pizza-accent py-8">
      Failed to load reviews. Please try again later.
    </div>

    <div v-if="status === 'success' && items.length > 0">
      <UCarousel
        v-slot="{ item }"
        :items="items as ReviewItem[]"
        :ui="{
          item: 'basis-full md:basis-1/2 lg:basis-1/3 p-2',
        }"
        arrows
      >
        <UCard v-if="item" class="h-full flex flex-col hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm border-pizza-border/50 group" :ui="{ root: 'flex-grow flex flex-col h-full', body: 'flex-grow flex flex-col h-full' }">
          <div class="flex items-start justify-between mb-4">
            <div class="flex flex-col">
              <span class="font-bold text-lg text-pizza-text">{{ (item as ReviewItem).author }}</span>
              <span class="text-xs text-pizza-muted mt-0.5">{{ (item as ReviewItem).date }}</span>
            </div>
            
            <ULink :to="(item as ReviewItem).url" target="_blank" rel="noopener noreferrer" class="opacity-70 hover:opacity-100 transition-opacity" :title="`View on ${(item as ReviewItem).source}`">
              <UIcon name="i-lucide-external-link" class="size-5 text-pizza-muted" />
            </ULink>
          </div>

          <div class="flex items-center gap-1 mb-4 text-pizza-gold">
            <UIcon v-for="i in (item as ReviewItem).rating" :key="i" name="i-lucide-star" class="fill-current size-4" />
          </div>

          <p class="text-pizza-text italic grow leading-relaxed">
            "{{ (item as ReviewItem).text }}"
          </p>
        </UCard>
      </UCarousel>
    </div>
  </section>
</template>
