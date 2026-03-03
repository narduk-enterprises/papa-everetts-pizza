<script setup lang="ts">
import { z } from 'zod'
import { restaurantInfo } from '~/composables/useRestaurantInfo'
import { useContact } from '~/composables/useContact'

useSeo({
  title: "Contact | Papa Everett's Pizza Co.",
  description: "Visit or contact Papa Everett's Pizza Co. at 910 US-18 E, Clear Lake, IA 50428. Call (641) 357-4040.",
  ogImage: {
    title: 'Contact Papa Everett\'s Pizza Co.',
    description: 'Address, hours, phone, and contact form.',
    icon: 'i-lucide-phone',
  },
})

useWebPageSchema({
  type: 'ContactPage',
  name: 'Contact',
  description: 'Address, hours, and contact details for Papa Everett\'s Pizza Co.',
})

useFAQSchema([
  { question: 'What is the phone number for Papa Everett\'s?', answer: 'Call us at (641) 357-4040 for orders, catering, or questions.' },
  { question: 'What is the address of Papa Everett\'s?', answer: '910 US-18 E, Clear Lake, IA 50428.' },
  { question: 'Does Papa Everett\'s offer delivery?', answer: 'Yes! Delivery begins after 4:30 PM. Call (641) 357-4040 to order.' },
])

const { appUrl } = useRuntimeConfig().public

useBreadcrumbSchema([
  { name: 'Home', url: `${appUrl}/` },
  { name: 'Contact', url: `${appUrl}/contact` },
])

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Please include a message'),
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
  onSubmit: (values) => submitContact(values, 'contact'),
  successMessage: 'Message sent. Thank you for reaching out.',
})
</script>

<template>
  <div>
    <!-- Page header -->
      <section class="bg-[var(--color-pizza-surface)] border-b border-[var(--color-pizza-border)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <h1 class="font-display text-5xl">Contact Papa Everett's Pizza</h1>
        <p class="text-[var(--color-pizza-muted)] mt-3">We'd love to hear from you — <ULink :to="restaurantInfo.phoneHref" class="text-[var(--color-pizza-primary)] hover:text-[var(--color-pizza-primary-dark)] transition-colors underline decoration-[var(--color-pizza-primary)]/40 underline-offset-4">call</ULink>, visit, or send us a message.</p>
      </div>
    </section>

    <!-- Split layout: info + map on left, form on right -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-8 items-start">
      <div class="space-y-6">
        <!-- Visit Us card -->
        <div class="warm-card p-6">
          <div class="flex items-start gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-[var(--color-pizza-primary)]/10 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-map-pin" class="size-5 text-[var(--color-pizza-primary)]" />
            </div>
            <div>
              <h2 class="font-semibold text-lg">Visit Us</h2>
              <p class="warm-muted">910 US-18 E</p>
              <p class="warm-muted">Clear Lake, IA 50428</p>
            </div>
          </div>
 
          <!-- Map -->
          <div class="rounded-xl overflow-hidden border border-[var(--color-pizza-border)] h-[280px]">
            <iframe
              title="Papa Everett's Pizza Co. Map"
              src="https://www.google.com/maps?q=910+US-18+E,+Clear+Lake,+IA+50428&output=embed"
              width="100%"
              height="100%"
              style="border:0"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen
            />
          </div>
        </div>

        <!-- Call Us card -->
        <div class="warm-card p-6">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-[var(--color-pizza-primary)]/10 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-phone" class="size-5 text-[var(--color-pizza-primary)]" />
            </div>
            <div>
              <h2 class="font-semibold text-lg">Call Us</h2>
              <p class="warm-muted">For delivery or pickup orders:</p>
              <ULink :to="restaurantInfo.phoneHref" class="text-[var(--color-pizza-primary)] text-xl font-semibold">(641) 357-4040</ULink>
            </div>
          </div>
        </div>

        <!-- Hours card -->
        <div class="warm-card p-6">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-[var(--color-pizza-primary)]/10 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-clock" class="size-5 text-[var(--color-pizza-primary)]" />
            </div>
            <div>
              <h2 class="font-semibold text-lg">Hours</h2>
              <ul class="warm-muted mt-1 space-y-1 text-sm">
                <li>Sunday, Tuesday-Thursday: 11:00 AM - 9:00 PM</li>
                <li>Monday: 4:00 PM - 8:00 PM</li>
                <li>Friday-Saturday: 11:00 AM - 10:00 PM</li>
                <li>Delivery begins after 4:30 PM</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact form — fills the right column -->
      <div class="warm-card p-8">
        <h2 class="font-display text-3xl mb-2">Send us a Message</h2>
        <p class="warm-muted mb-6 text-sm">We'll get back to you as soon as we can.</p>
        <UForm :schema="schema" :state="form.state" class="form-section" @submit="form.submit">
          <div class="form-row">
            <UFormField label="Name" name="name" required>
              <UInput v-model="form.state.name" placeholder="Your name" icon="i-lucide-user" class="w-full" />
            </UFormField>
            <UFormField label="Email" name="email" required>
              <UInput v-model="form.state.email" type="email" placeholder="you@example.com" icon="i-lucide-mail" class="w-full" />
            </UFormField>
          </div>

          <UFormField label="Phone" name="phone" description="Optional">
            <UInput v-model="form.state.phone" type="tel" placeholder="(641) 555-1234" icon="i-lucide-phone" class="w-full" />
          </UFormField>

          <UFormField label="Message" name="message" required>
            <UTextarea v-model="form.state.message" :rows="5" placeholder="How can we help you?" class="w-full" />
          </UFormField>

          <div class="form-actions form-actions-full">
            <UButton type="submit" :loading="form.loading.value" icon="i-lucide-send" size="lg">
              Send Message
            </UButton>
          </div>
        </UForm>
      </div>
    </section>
  </div>
</template>
