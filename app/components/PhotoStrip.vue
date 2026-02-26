<script setup lang="ts">
import type { SitePhoto } from '~/composables/usePhotos'

defineProps<{
  photos: SitePhoto[]
}>()
</script>

<template>
  <div class="photo-strip-wrapper">
    <div class="photo-strip">
      <div
        v-for="(photo, i) in photos"
        :key="i"
        class="photo-strip-item"
      >
        <img
          :src="photo.src"
          :alt="photo.alt"
          loading="lazy"
          class="photo-strip-img"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-strip-wrapper {
  position: relative;
  overflow: hidden;
}

.photo-strip-wrapper::before,
.photo-strip-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2rem;
  z-index: 2;
  pointer-events: none;
}

.photo-strip-wrapper::before {
  left: 0;
  background: linear-gradient(to right, var(--color-pizza-bg), transparent);
}

.photo-strip-wrapper::after {
  right: 0;
  background: linear-gradient(to left, var(--color-pizza-bg), transparent);
}

.photo-strip {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding: 0.5rem 1rem;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.photo-strip::-webkit-scrollbar {
  display: none;
}

.photo-strip-item {
  flex: 0 0 auto;
  scroll-snap-align: start;
  width: 280px;
  height: 210px;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--color-pizza-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.photo-strip-item:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14);
}

.photo-strip-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 640px) {
  .photo-strip-item {
    width: 220px;
    height: 165px;
  }
}
</style>
