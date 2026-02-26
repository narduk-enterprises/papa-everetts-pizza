<script setup lang="ts">
import type { SitePhoto } from '~/composables/usePhotos'

const props = defineProps<{
  photos: SitePhoto[]
  columns?: 2 | 3 | 4
}>()

const cols = computed(() => props.columns ?? 3)

const lightboxPhoto = ref<SitePhoto | null>(null)

function openLightbox(photo: SitePhoto) {
  lightboxPhoto.value = photo
}

function closeLightbox() {
  lightboxPhoto.value = null
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeLightbox()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div>
    <div
      class="photo-gallery-grid"
      :style="{ '--gallery-cols': cols }"
    >
      <button
        v-for="(photo, i) in photos"
        :key="i"
        class="photo-gallery-item"
        @click="openLightbox(photo)"
      >
        <img
          :src="photo.src"
          :alt="photo.alt"
          loading="lazy"
          class="photo-gallery-img"
        >
        <div class="photo-gallery-overlay">
          <UIcon name="i-lucide-zoom-in" class="size-6 text-white" />
        </div>
      </button>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="lightboxPhoto"
          class="lightbox-backdrop"
          @click.self="closeLightbox"
        >
          <button class="lightbox-close" aria-label="Close" @click="closeLightbox">
            <UIcon name="i-lucide-x" class="size-7" />
          </button>
          <div class="lightbox-content">
            <img
              :src="lightboxPhoto.src"
              :alt="lightboxPhoto.alt"
              class="lightbox-img"
            >
            <p class="lightbox-caption">{{ lightboxPhoto.alt }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.photo-gallery-grid {
  display: grid;
  grid-template-columns: repeat(var(--gallery-cols, 3), 1fr);
  gap: 0.75rem;
}

@media (max-width: 1024px) {
  .photo-gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .photo-gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
}

.photo-gallery-item {
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--color-pizza-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  aspect-ratio: 4 / 3;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: 0;
  background: none;
}

.photo-gallery-item:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.photo-gallery-item:hover .photo-gallery-overlay {
  opacity: 1;
}

.photo-gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.photo-gallery-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

/* ─── Lightbox ─── */

.lightbox-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: white;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
  z-index: 10;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.lightbox-content {
  max-width: 90vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 0.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.lightbox-caption {
  color: rgba(255, 255, 255, 0.8);
  margin-top: 1rem;
  font-size: 0.875rem;
  text-align: center;
}

/* Transitions */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
