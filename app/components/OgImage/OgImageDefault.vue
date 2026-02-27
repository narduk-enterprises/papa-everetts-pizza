<!-- 
  OG Image Default Template
  
  Rendered at the edge via Satori (part of nuxt-og-image / @nuxtjs/seo).
  This is the default template used when calling `defineOgImage()` or
  the `useSeo({ ogImage: {...} })` composable.
  
  Satori renders this Vue component to an SVG, then converts to PNG.
  Note: Satori has limited CSS support — use inline styles and flexbox only.
  No Tailwind classes, no CSS Grid, no pseudo-elements.
-->
<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
  icon?: string
  siteName?: string
}>(), {
  title: "Papa Everett's Pizza",
  description: 'Authentic local pizza, wings, and more. Order online for delivery or pickup!',
  icon: '🍕',
  siteName: "Papa Everett's",
})

const colors = {
  slate100: 'rgb(241, 245, 249)',
  slate400: 'rgb(148, 163, 184)',
  slate500: 'rgb(100, 116, 139)',
  pizzaRed: 'rgb(209, 0, 0)',
}
</script>

<template>
  <div
    :style="{
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '80px',
      background: 'linear-gradient(135deg, #000000 0%, #1a1510 40%, #2a2010 100%)',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }"
  >
    <!-- Accent gradient blob -->
    <div
      :style="{
        position: 'absolute',
        top: '-120px',
        right: '-80px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(209, 0, 0, 0.15) 0%, transparent 70%)',
      }"
    />

    <!-- Bottom accent line -->
    <div
      :style="{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: '4px',
        background: `linear-gradient(90deg, ${colors.pizzaRed}, #ffcc00, #000000)`,
      }"
    />

    <!-- Icon -->
    <div
      :style="{
        fontSize: '48px',
        marginBottom: '24px',
      }"
    >
      {{ icon }}
    </div>

    <!-- Title -->
    <div
      :style="{
        fontSize: '56px',
        fontWeight: '700',
        color: colors.slate100,
        lineHeight: '1.15',
        marginBottom: '16px',
        maxWidth: '900px',
        letterSpacing: '-0.02em',
      }"
    >
      {{ title }}
    </div>

    <!-- Description -->
    <div
      :style="{
        fontSize: '24px',
        fontWeight: '400',
        color: colors.slate400,
        lineHeight: '1.5',
        maxWidth: '800px',
      }"
    >
      {{ description }}
    </div>

    <!-- Site name badge -->
    <div
      :style="{
        position: 'absolute',
        bottom: '40px',
        right: '80px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }"
    >
      <div
        :style="{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: colors.pizzaRed,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '14px',
          fontWeight: '700',
        }"
      >
        PEP
      </div>
      <div
        :style="{
          fontSize: '18px',
          fontWeight: '600',
          color: colors.slate500,
        }"
      >
        {{ siteName }}
      </div>
    </div>
  </div>
</template>
