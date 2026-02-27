<script setup lang="ts">
import type { SitePhoto } from '~/composables/usePhotos'

const props = defineProps<{
  photos: SitePhoto[]
  columns?: 2 | 3 | 4
}>()

const cols = computed(() => props.columns ?? 3)

const lightboxPhoto = ref<SitePhoto | null>(null)
const isModalOpen = computed({
  get: () => !!lightboxPhoto.value,
  set: (val) => { if (!val) lightboxPhoto.value = null }
})

function openLightbox(photo: SitePhoto) {
  lightboxPhoto.value = photo
}
</script>

<template>
  <div class="space-y-4">
    <div
      class="grid gap-2 sm:gap-3"
      :class="{
        'grid-cols-2': cols === 2,
        'grid-cols-2 md:grid-cols-3': cols === 3,
        'grid-cols-2 lg:grid-cols-4 md:grid-cols-2': cols === 4,
      }"
    >
      <UButton
        v-for="(photo, i) in photos"
        :key="i"
        variant="ghost"
        color="neutral"
        class="group relative flex flex-col p-0 rounded-xl overflow-hidden aspect-4/3 border border-pizza-border shadow-sm transition-all duration-300 hover:scale-102 hover:shadow-lg bg-none"
        @click="openLightbox(photo)"
      >
        <img
          :src="photo.src"
          :alt="photo.alt"
          loading="lazy"
          class="w-full h-full object-cover"
        >
        <div class="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <UIcon name="i-lucide-zoom-in" class="size-8 text-white" />
        </div>
      </UButton>
    </div>

    <!-- Lightbox Modal -->
    <UModal v-model:open="isModalOpen">
      <div v-if="lightboxPhoto" class="relative group">
        <div class="flex flex-col items-center p-2 sm:p-4">
          <img
            :src="lightboxPhoto.src"
            :alt="lightboxPhoto.alt"
            class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          >
          <p v-if="lightboxPhoto.alt" class="mt-4 text-center text-pizza-text font-medium">{{ lightboxPhoto.alt }}</p>
        </div>
      </div>
    </UModal>
  </div>
</template>
