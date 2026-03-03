<script setup lang="ts">
import { z } from 'zod'
import { restaurantInfo, siteImages } from '~/composables/useRestaurantInfo'
import { useContact } from '~/composables/useContact'
import { cateringPhotos } from '~/composables/usePhotos'

useSeo({
  title: "Catering | Papa Everett's Pizza Co.",
  description: 'Catering for parties, business lunches, and events in Clear Lake. Pizza, pasta, appetizers, and more.',
  ogImage: {
    title: "Papa Everett's Catering",
    description: 'Pizza catering for events and groups.',
    icon: 'i-lucide-concierge-bell',
  },
})

useWebPageSchema({
  name: "Catering | Papa Everett's Pizza Co.",
  description: 'Catering services for parties, corporate events, and group gatherings.',
})

useFAQSchema([
  { question: 'Does Papa Everett\'s cater events?', answer: 'Yes! We cater parties, corporate events, school functions, and more. Call (641) 357-4040 or fill out the form on our catering page for a custom quote.' },
  { question: 'How far in advance should I book catering?', answer: 'We recommend booking at least one week in advance for large events. For smaller orders, 2-3 days notice is usually sufficient.' },
  { question: 'What do you offer for catering?', answer: 'We offer pizza, pasta, appetizers, salads, and desserts for groups of all sizes. Custom menu options are available.' },
])

const { appUrl } = useRuntimeConfig().public

useBreadcrumbSchema([
  { name: 'Home', url: `${appUrl}/` },
  { name: 'Catering', url: `${appUrl}/catering` },
])

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Phone is required'),
  message: z.string().min(10, 'Tell us about your event'),
})

const { submitContact } = useContact()

const form = useFormHandler({
  schema,
  defaults: {
    name: '',
    email: '',
    phone: '',
    message: '',
  },
  onSubmit: (values) => submitContact(values, 'catering'),
  successMessage: 'Catering request sent. We will follow up shortly.',
})
</script>

<template>
  <div>
    <!-- Hero section with real Unsplash catering image -->
    <section class="hero-section">
      <img :src="siteImages.heroCatering" alt="Catering event" class="hero-bg">
      <div class="max-w-4xl mx-auto px-4 py-16">
        <h1 class="font-display text-5xl sm:text-6xl text-white mb-4">Catering for Every Occasion</h1>
        <p class="text-white/80 text-lg max-w-2xl mx-auto">
          From school events to family celebrations, Papa Everett's Pizza proudly serves our Clear Lake community — one pizza at a time.
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div class="warm-card p-8">
        <h2 class="font-display text-3xl mb-4">Catering Made Easy</h2>
        <p class="warm-muted leading-relaxed">
          Planning an event? Papa Everett's Pizza has been part of the Clear Lake community since 1988.
          We prepare every order fresh and deliver it hot. Whether it's a business lunch, birthday party, or team celebration, we've got you covered.
        </p>
        <h3 class="font-semibold mt-6 mb-3 text-lg">Perfect For:</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <div v-for="item in ['School events', 'Business lunches', 'Church groups', 'Birthday parties', 'Team celebrations', 'Community gatherings']" :key="item" class="flex items-center gap-2 warm-muted">
            <UIcon name="i-lucide-check" class="size-4 text-[var(--color-pizza-primary)] shrink-0" />
            <span>{{ item }}</span>
          </div>
        </div>
      </div>

      <div class="warm-card p-8">
        <h2 class="font-display text-2xl mb-4">What We Cater</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div v-for="item in ['Classic and specialty pizzas', 'Cheese bread & breadsticks', 'Wings', 'Quesadillas', 'Oven-baked pastas', 'Dessert pizzas']" :key="item" class="flex items-center gap-2 warm-muted">
            <UIcon name="i-lucide-pizza" class="size-4 text-[var(--color-pizza-primary)] shrink-0" />
            <span>{{ item }}</span>
          </div>
        </div>
        <p class="warm-muted mt-5">From dozens to hundreds of pizzas — large orders are always welcome.</p>
      </div>

      <!-- Food photo showcase -->
      <div>
        <h2 class="font-display text-2xl mb-4">See What We're Serving</h2>
        <PhotoGallery :photos="cateringPhotos" :columns="4" />
      </div>

      <div class="warm-card p-6">
        <h2 class="font-display text-2xl mb-3">How to Order</h2>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="text-center p-4">
            <div class="w-10 h-10 rounded-full bg-[var(--color-pizza-primary)]/10 flex items-center justify-center mx-auto mb-3">
              <UIcon name="i-lucide-phone" class="size-5 text-[var(--color-pizza-primary)]" />
            </div>
            <p class="font-semibold">1. <ULink :to="restaurantInfo.phoneHref" class="text-[var(--color-pizza-primary)] hover:text-[var(--color-pizza-primary-dark)] transition-colors underline decoration-[var(--color-pizza-primary)]/40 underline-offset-4">Call Us</ULink></p>
            <p class="warm-muted text-sm mt-1">Reach us at <ULink :to="restaurantInfo.phoneHref" class="text-[var(--color-pizza-primary)]">{{ restaurantInfo.phone }}</ULink></p>
          </div>
          <div class="text-center p-4">
            <div class="w-10 h-10 rounded-full bg-[var(--color-pizza-primary)]/10 flex items-center justify-center mx-auto mb-3">
              <UIcon name="i-lucide-message-square" class="size-5 text-[var(--color-pizza-primary)]" />
            </div>
            <p class="font-semibold">2. Share Details</p>
            <p class="warm-muted text-sm mt-1">Event size, date, timing, and menu preferences</p>
          </div>
          <div class="text-center p-4">
            <div class="w-10 h-10 rounded-full bg-[var(--color-pizza-primary)]/10 flex items-center justify-center mx-auto mb-3">
              <UIcon name="i-lucide-truck" class="size-5 text-[var(--color-pizza-primary)]" />
            </div>
            <p class="font-semibold">3. We Deliver</p>
            <p class="warm-muted text-sm mt-1">Fresh, hot, and on time for your event</p>
          </div>
        </div>
      </div>

      <div class="warm-card p-8">
        <h2 class="font-display text-3xl mb-2">Request Catering</h2>
        <p class="warm-muted mb-6 text-sm">Tell us about your event and we'll get back to you with a quote.</p>
        <UForm :schema="schema" :state="form.state" class="form-section" @submit="form.submit">
          <div class="form-row">
            <UFormField label="Name" name="name" required>
              <UInput v-model="form.state.name" placeholder="Your name" icon="i-lucide-user" class="w-full" />
            </UFormField>
            <UFormField label="Email" name="email" required>
              <UInput v-model="form.state.email" type="email" placeholder="you@example.com" icon="i-lucide-mail" class="w-full" />
            </UFormField>
          </div>

          <UFormField label="Phone" name="phone" required>
            <UInput v-model="form.state.phone" type="tel" placeholder="(641) 555-1234" icon="i-lucide-phone" class="w-full" />
          </UFormField>

          <UFormField label="Event Details" name="message" required>
            <UTextarea v-model="form.state.message" :rows="5" placeholder="Tell us about your event: date, number of guests, menu preferences..." class="w-full" />
          </UFormField>

          <div class="form-actions form-actions-full">
            <UButton type="submit" :loading="form.loading.value" icon="i-lucide-send" size="lg">
              Send Request
            </UButton>
          </div>
        </UForm>
      </div>
    </section>
  </div>
</template>
