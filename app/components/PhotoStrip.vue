<script setup lang="ts">
import type { SitePhoto } from '~/composables/usePhotos'

defineProps<{
  photos: SitePhoto[]
}>()
</script>

<template>
  <div class="relative overflow-hidden group/strip">
    <!-- Gradient Overlays -->
    <div class="absolute inset-y-0 left-0 w-8 z-10 pointer-events-none bg-linear-to-r from-pizza-bg to-transparent" />
    <div class="absolute inset-y-0 right-0 w-8 z-10 pointer-events-none bg-linear-to-l from-pizza-bg to-transparent" />

    <div class="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2 px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        v-for="(photo, i) in photos"
        :key="i"
        class="flex-none snap-start w-[220px] h-[165px] sm:w-[280px] sm:h-[210px] rounded-xl overflow-hidden border border-pizza-border shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
      >
        <img
          :src="photo.src"
          :alt="photo.alt"
          loading="lazy"
          class="w-full h-full object-cover"
        >
      </div>
    </div>
  </div>
</template>
