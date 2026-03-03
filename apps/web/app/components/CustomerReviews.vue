<script setup lang="ts">
import { useReviews } from '~/composables/useReviews'
import type { ReviewItem } from '~/composables/useReviews'

const { items, status } = useReviews()
</script>

<template>
  <section class="bg-[var(--color-pizza-bg-soft)] py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-10">
      <p class="uppercase text-xs tracking-[0.2em] text-[var(--color-pizza-primary)] font-bold mb-3">Community Love</p>
      <h2 class="font-display text-4xl text-[var(--color-pizza-text)]">What Our Guests Say</h2>
      <p class="text-[var(--color-pizza-muted)] mt-4 max-w-2xl mx-auto text-lg">
        Don't just take our word for it—see what Clear Lake is saying about our handcrafted pizza.
      </p>
    </div>

    <div v-if="status === 'pending'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4" aria-busy="true" aria-label="Loading reviews">
      <UCard v-for="i in 3" :key="i" class="overflow-hidden">
        <div class="flex items-start justify-between mb-4">
          <div class="space-y-2">
            <USkeleton class="h-5 w-32" />
            <USkeleton class="h-4 w-20" />
          </div>
          <USkeleton class="size-5 rounded" />
        </div>
        <div class="flex gap-1 mb-4">
          <USkeleton v-for="j in 5" :key="j" class="size-4 rounded-full" />
        </div>
        <div class="space-y-2">
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-3/4" />
        </div>
      </UCard>
    </div>

    <div v-if="status === 'error'" class="text-center text-[var(--color-pizza-primary)] py-8">
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
        <UCard v-if="item" class="h-full flex flex-col hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm border-[var(--color-pizza-border)]/50 group" :ui="{ root: 'flex-grow flex flex-col h-full', body: 'flex-grow flex flex-col h-full' }">
          <div class="flex items-start justify-between mb-4">
            <div class="flex flex-col">
              <span class="font-bold text-lg text-[var(--color-pizza-text)]">{{ (item as ReviewItem).author }}</span>
              <span class="text-xs text-[var(--color-pizza-muted)] mt-0.5">{{ (item as ReviewItem).date }}</span>
            </div>
            
            <ULink :to="(item as ReviewItem).url" target="_blank" rel="noopener noreferrer" class="opacity-70 hover:opacity-100 transition-opacity" :title="`View on ${(item as ReviewItem).source}`">
              <UIcon name="i-lucide-external-link" class="size-5 text-[var(--color-pizza-muted)]" />
            </ULink>
          </div>

          <div class="flex items-center gap-1 mb-4 text-[var(--color-pizza-cta)]">
            <UIcon v-for="i in (item as ReviewItem).rating" :key="i" name="i-lucide-star" class="fill-current size-4" />
          </div>

          <p class="text-[var(--color-pizza-text)] italic grow leading-relaxed">
            "{{ (item as ReviewItem).text }}"
          </p>
        </UCard>
      </UCarousel>
    </div>
    </div>
  </section>
</template>
