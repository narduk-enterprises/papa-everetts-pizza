<script setup lang="ts">
import { siteImages } from '~/composables/useRestaurantInfo'

useSeo({
  title: "Paper Menu | Papa Everett's Pizza Co.",
  description: "View the classic back-and-front physical paper menu for Papa Everett's Pizza in Clear Lake, Iowa.",
})

// Menu scan lightbox
const lightboxOpen = ref(false)
const lightboxImage = ref('')

function openMenuScan(src: string) {
  lightboxImage.value = src
  lightboxOpen.value = true
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-4xl sm:text-5xl">Original Paper Menu</h1>
        <p class="warm-muted mt-3 max-w-xl">
          Prefer the classic layout? Click either side of the menu to enlarge it, and pinch to zoom in on your mobile device.
        </p>
      </div>
      <UButton
        to="/menu"
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
        class="shrink-0"
      >
        Back to Digital Menu
      </UButton>
    </div>

    <div class="grid md:grid-cols-2 gap-8 lg:gap-12 mb-10">
      <UButton variant="outline" color="neutral" class="warm-card overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group rounded-xl border border-pizza-border bg-white" @click="openMenuScan(siteImages.menuScan1)">
        <img :src="siteImages.menuScan1" alt="Papa Everett's menu front" class="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500 ease-out">
        <div class="p-4 bg-pizza-surface border-t border-pizza-border/50 text-pizza-text font-medium flex items-center justify-center gap-2">
          <UIcon name="i-lucide-zoom-in" class="size-4" />
          Click to zoom — Front Side
        </div>
      </UButton>
      
      <UButton variant="outline" color="neutral" class="warm-card overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group rounded-xl border border-pizza-border bg-white" @click="openMenuScan(siteImages.menuScan2)">
        <img :src="siteImages.menuScan2" alt="Papa Everett's menu back" class="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500 ease-out">
        <div class="p-4 bg-pizza-surface border-t border-pizza-border/50 text-pizza-text font-medium flex items-center justify-center gap-2">
          <UIcon name="i-lucide-zoom-in" class="size-4" />
          Click to zoom — Back Side
        </div>
      </UButton>
    </div>

    <!-- Menu scan lightbox -->
    <ClientOnly>
      <Teleport to="body">
        <Transition name="page">
          <div v-if="lightboxOpen" class="fixed inset-0 z-100 bg-black/95 overflow-y-auto" @click="lightboxOpen = false">
            <div class="sticky top-0 z-101 flex justify-end gap-2 p-3 sm:p-4 bg-linear-to-b from-black/80 to-transparent">
              <ULink :to="lightboxImage" target="_blank" class="text-white bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 sm:py-2.5 text-sm font-medium backdrop-blur-md transition-colors flex items-center gap-2" @click.stop title="Open full resolution">
                <UIcon name="i-lucide-external-link" class="size-4 sm:size-5" />
                <span>Open Full Image</span>
              </ULink>
              <UButton square variant="ghost" color="neutral" class="text-white bg-white/10 hover:bg-white/20 rounded-full p-2 sm:p-2.5 backdrop-blur-md transition-colors flex items-center justify-center" @click.stop="lightboxOpen = false">
                <UIcon name="i-lucide-x" class="size-5 sm:size-6" />
              </UButton>
            </div>
            
            <div class="min-h-full flex flex-col p-2 sm:p-4 pt-0 justify-center">
               <img :src="lightboxImage" alt="Full-size menu scan" class="w-full md:max-w-5xl md:mx-auto lg:max-h-[85vh] lg:w-auto object-contain rounded-xl shadow-2xl mx-auto my-auto" @click.stop>
            </div>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </div>
</template>
