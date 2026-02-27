<script setup lang="ts">
useSeoMeta({
  title: "Site Guide | Admin | Papa Everett's Pizza Co.",
  robots: 'noindex, nofollow',
})

const { loggedIn, user, refresh } = useAuth()

// Fix hydration mismatch: wait for auth so Server matches Client conditional render
await refresh()

const activeSection = ref('overview')

const sections = [
  { id: 'overview', icon: 'i-lucide-info', title: 'Site Overview' },
  { id: 'pages', icon: 'i-lucide-layout-grid', title: 'Your Pages' },
  { id: 'menu-management', icon: 'i-lucide-pen-line', title: 'Managing the Menu' },
  { id: 'hosting', icon: 'i-lucide-cloud', title: 'Hosting & Domain' },
  { id: 'seo', icon: 'i-lucide-search', title: 'Google & Analytics' },
  { id: 'tech', icon: 'i-lucide-code', title: 'Technical Details' },
  { id: 'support', icon: 'i-lucide-life-buoy', title: 'Getting Help' },
]

const pages = [
  { name: 'Home', path: '/', desc: 'Landing page with hero, hours, featured menu items, photos, reviews, and your story.' },
  { name: 'Menu', path: '/menu', desc: 'Full interactive menu with live prices by category. Includes the Pizza Builder.' },
  { name: 'Paper Menu', path: '/paper-menu', desc: 'Scanned images of your physical paper menu.' },
  { name: 'Gallery', path: '/gallery', desc: 'Photo gallery showcasing food and the restaurant.' },
  { name: 'About', path: '/about', desc: "Your story since 1988 and community involvement." },
  { name: 'Contact', path: '/contact', desc: 'Contact form, phone, address, and Google Map.' },
  { name: 'Catering', path: '/catering', desc: 'Catering services for events of all sizes.' },
  { name: 'Fundraisers', path: '/fundraisers', desc: 'Fundraiser programs for local organizations.' },
  { name: 'Schools', path: '/schools', desc: 'School program partnerships.' },
]

function scrollTo(id: string) {
  if (!import.meta.client) return
  activeSection.value = id
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/admin" variant="ghost" size="sm" icon="i-lucide-arrow-left">Back to Admin</UButton>
    </div>

    <h1 class="text-4xl font-bold tracking-tight text-pizza-text">Site Guide</h1>
    <p class="text-pizza-muted mt-2 text-lg">Everything you need to know about your website.</p>

    <!-- Auth gate -->
    <div v-if="!loggedIn" class="mt-8 warm-card p-6">
      <p class="warm-muted">Please <ULink to="/admin" class="text-primary-600 underline">log in</ULink> to view the site guide.</p>
    </div>

    <div v-else-if="!user?.isAdmin" class="mt-8 warm-card p-6">
      <p>This page is only available to admin accounts.</p>
    </div>

    <template v-else>
      <!-- Sticky sidebar + content layout -->
      <div class="mt-8 grid lg:grid-cols-[220px_1fr] gap-8">

        <!-- Sidebar nav -->
        <div class="hidden lg:block">
          <div class="sticky top-24 space-y-1">
            <UButton
              v-for="section in sections"
              :key="section.id"
              variant="ghost"
              :color="activeSection === section.id ? 'primary' : 'neutral'"
              class="w-full justify-start gap-2.5"
              :class="{ 'bg-primary-50/50': activeSection === section.id }"
              @click="scrollTo(section.id)"
            >
              <template #leading>
                <UIcon :name="section.icon" class="size-4 shrink-0" />
              </template>
              {{ section.title }}
            </UButton>
          </div>
        </div>

        <!-- Mobile nav -->
        <div class="lg:hidden sticky top-16 z-10 warm-surface/90 backdrop-blur-sm -mx-4 px-4 py-3 border-b border-pizza-border">
          <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <UButton
              v-for="section in sections"
              :key="section.id"
              size="xs"
              :variant="activeSection === section.id ? 'solid' : 'soft'"
              :color="activeSection === section.id ? 'primary' : 'neutral'"
              class="shrink-0 rounded-full"
              @click="scrollTo(section.id)"
            >
              {{ section.title }}
            </UButton>
          </div>
        </div>

        <!-- Content -->
        <div class="space-y-12 min-w-0">

          <!-- Overview -->
          <article id="overview" class="scroll-mt-24" @click="activeSection = 'overview'">
            <h2 class="text-2xl font-bold tracking-tight flex items-center gap-2 text-pizza-text">
              <UIcon name="i-lucide-info" class="size-6 text-primary-600" />
              Site Overview
            </h2>
            <div class="mt-4 text-pizza-muted leading-relaxed space-y-3">
              <p>
                This website was custom-built for Papa Everett's Pizza Co. It's a modern, fast, mobile-friendly site designed to showcase your menu, photos, and restaurant information to customers in Clear Lake and beyond.
              </p>
              <p>
                The site is optimized for Google search results and loads instantly on any device — phone, tablet, or desktop.
              </p>
            </div>
          </article>

          <USeparator class="border-pizza-border" />

          <!-- Pages -->
          <article id="pages" class="scroll-mt-24" @click="activeSection = 'pages'">
            <h2 class="text-2xl font-bold tracking-tight flex items-center gap-2 text-pizza-text">
              <UIcon name="i-lucide-layout-grid" class="size-6 text-primary-600" />
              Your Pages
            </h2>
            <p class="mt-2 text-pizza-muted">Here are all the pages on your website. Click any to view it.</p>

            <div class="mt-4 grid sm:grid-cols-2 gap-3">
              <ULink
                v-for="page in pages"
                :key="page.path"
                :to="page.path"
                target="_blank"
                class="block rounded-xl border border-pizza-border p-4 hover:border-primary-300 hover:bg-primary-50/50 transition-all group"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="font-semibold text-pizza-text group-hover:text-primary-700 transition-colors">{{ page.name }}</p>
                    <p class="text-pizza-muted text-sm mt-1 leading-snug">{{ page.desc }}</p>
                  </div>
                  <UIcon name="i-lucide-external-link" class="size-4 text-pizza-muted shrink-0 mt-1" />
                </div>
              </ULink>
            </div>
          </article>

          <USeparator class="border-pizza-border" />

          <!-- Menu Management -->
          <article id="menu-management" class="scroll-mt-24" @click="activeSection = 'menu-management'">
            <h2 class="text-2xl font-bold tracking-tight flex items-center gap-2 text-pizza-text">
              <UIcon name="i-lucide-pen-line" class="size-6 text-primary-600" />
              Managing the Menu
            </h2>
            <p class="mt-2 text-pizza-muted">
              The Admin Panel gives you full control over your menu, categories, and prices. Here is exactly how to use it.
            </p>

            <!-- Managing Categories -->
            <div class="mt-8">
              <h3 class="text-lg font-bold text-pizza-text border-b border-pizza-border pb-2 mb-3">1. Managing Categories</h3>
              <p class="text-pizza-muted text-sm mb-3">
                Categories (like "Pizzas" or "Appetizers") are listed in the left sidebar.
              </p>
              <ul class="text-sm text-pizza-muted space-y-2 list-disc pl-5">
                <li>Click the <strong>⚙ gear icon</strong> next to "Categories" to open the manager.</li>
                <li><strong>Add:</strong> Type a new name and click "Add".</li>
                <li><strong>Rename:</strong> Click the pencil icon, type the new name, and click the checkmark or press Enter. <em>This safely updates the category for all items inside it!</em></li>
                <li><strong>Delete:</strong> Click the trash icon. You can only delete a category if it has no active items.</li>
              </ul>
            </div>

            <!-- Updating Existing Items -->
            <div class="mt-8">
              <h3 class="text-lg font-bold text-pizza-text border-b border-pizza-border pb-2 mb-3">2. Updating Menu Items</h3>
              <p class="text-pizza-muted text-sm mb-3">
                Click a category in the sidebar to view its items. To edit an item:
              </p>
              <ul class="text-sm text-pizza-muted space-y-2 list-disc pl-5">
                <li><strong>Basic Info:</strong> Change the Name, Category, Sort Order, or Description directly in the text boxes.</li>
                <li><strong>Active Toggle:</strong> Switch an item to "Inactive" to hide it from the public menu without deleting it.</li>
                <li><strong>Saving:</strong> Click the red <strong>Save</strong> button in the top right of the item card. Changes go live instantly.</li>
              </ul>
            </div>

            <!-- Pricing Fields (The Tricky Part) -->
            <div class="mt-8">
              <h3 class="text-lg font-bold text-pizza-text border-b border-pizza-border pb-2 mb-3">3. How Pricing Fields Work</h3>
              <p class="text-pizza-muted text-sm mb-3">
                Pizzas have multiple sizes, while pastas might just have one price. The pricing editor adapts to both.
              </p>
              <ul class="text-sm text-pizza-muted space-y-3 list-none pl-0">
                <li class="rounded-lg warm-surface border border-pizza-border p-3">
                  <strong class="text-pizza-text block mb-1">Standard Fields</strong>
                  To add a standard size (Le Petit, Small, Medium, Large, XL), use the <strong>Standard Field</strong> dropdown at the bottom of the item, select the size, and click <strong>Add</strong>.
                </li>
                <li class="rounded-lg warm-surface border border-pizza-border p-3">
                  <strong class="text-pizza-text block mb-1">Custom Fields</strong>
                  If you need a unique size (like "Party Tray"), type it into the <strong>Custom Field</strong> box and click <strong>Add Custom</strong>. It handles spacing and formatting automatically.
                </li>
                <li class="rounded-lg warm-surface border border-pizza-border p-3">
                  <strong class="text-pizza-text block mb-1">Removing Prices</strong>
                  Click the <strong>X</strong> icon next to any price field to remove that size option completely.
                </li>
              </ul>
            </div>

            <!-- Tips -->
            <div class="mt-8 rounded-xl bg-primary-50 border border-primary-200 p-4">
              <p class="font-semibold text-primary-800 text-sm flex items-center gap-2">
                <UIcon name="i-lucide-lightbulb" class="size-4" />
                Pro Tips
              </p>
              <ul class="mt-2 text-sm text-primary-700 space-y-1.5 list-disc pl-5">
                <li>Leave a price field <strong>completely blank</strong> to show "Call for Current Price" on the live menu.</li>
                <li>Use the <strong>"Sort Order"</strong> number to control the display order. Lower numbers show up first (e.g., 1 before 10).</li>
                <li>Scroll to the very bottom of the category page to find the <strong>Add Menu Item</strong> section to create new food items!</li>
              </ul>
            </div>
          </article>

          <USeparator class="border-pizza-border" />

          <!-- Hosting -->
          <article id="hosting" class="scroll-mt-24" @click="activeSection = 'hosting'">
            <h2 class="text-2xl font-bold tracking-tight flex items-center gap-2 text-pizza-text">
              <UIcon name="i-lucide-cloud" class="size-6 text-primary-600" />
              Hosting & Domain
            </h2>

            <div class="mt-4 grid sm:grid-cols-2 gap-3">
              <div class="rounded-xl border border-pizza-border p-4">
                <p class="font-semibold text-pizza-text flex items-center gap-2">
                  <UIcon name="i-lucide-zap" class="size-4 text-primary-400" /> Speed
                </p>
                <p class="text-pizza-muted text-sm mt-1">Loads in under 1 second from anywhere in the world.</p>
              </div>
              <div class="rounded-xl border border-pizza-border p-4">
                <p class="font-semibold text-pizza-text flex items-center gap-2">
                  <UIcon name="i-lucide-shield-check" class="size-4 text-primary-500" /> Security
                </p>
                <p class="text-pizza-muted text-sm mt-1">HTTPS encryption and DDoS protection built in.</p>
              </div>
              <div class="rounded-xl border border-pizza-border p-4">
                <p class="font-semibold text-pizza-text flex items-center gap-2">
                  <UIcon name="i-lucide-activity" class="size-4 text-primary-600" /> Uptime
                </p>
                <p class="text-pizza-muted text-sm mt-1">99.99% uptime — your site is almost never down.</p>
              </div>
              <div class="rounded-xl border border-pizza-border p-4">
                <p class="font-semibold text-pizza-text flex items-center gap-2">
                  <UIcon name="i-lucide-globe" class="size-4 text-primary-500" /> Domain
                </p>
                <p class="text-pizza-muted text-sm mt-1">Live at <strong>papaeverettspizza.com</strong></p>
              </div>
            </div>

            <p class="mt-4 text-pizza-muted text-sm leading-relaxed">
              Your website runs on <strong>Cloudflare Workers</strong>, one of the fastest hosting platforms available. Your menu data is stored in a <strong>Cloudflare D1 database</strong>, so menu updates are saved permanently and load instantly.
            </p>
          </article>

          <USeparator class="border-pizza-border" />

          <!-- SEO -->
          <article id="seo" class="scroll-mt-24" @click="activeSection = 'seo'">
            <h2 class="text-2xl font-bold tracking-tight flex items-center gap-2 text-pizza-text">
              <UIcon name="i-lucide-search" class="size-6 text-primary-600" />
              Google & Analytics
            </h2>
            <p class="mt-2 text-pizza-muted">
              Your site is fully optimized to rank well for searches like "pizza Clear Lake Iowa" or "Papa Everett's menu."
            </p>

            <div class="mt-5 space-y-3">
              <div class="flex gap-3 items-start">
                <UIcon name="i-lucide-check-circle" class="size-5 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <p class="font-semibold text-pizza-text">Google Search Console</p>
                  <p class="text-sm text-pizza-muted">Your site is registered and verified. Google is actively crawling and indexing your pages. Sitemap submitted.</p>
                </div>
              </div>
              <div class="flex gap-3 items-start">
                <UIcon name="i-lucide-check-circle" class="size-5 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <p class="font-semibold text-pizza-text">Google Analytics</p>
                  <p class="text-sm text-pizza-muted">Tracks visitors, page views, and traffic sources. Measurement ID: G-8WZ93XNKHX.</p>
                </div>
              </div>
              <div class="flex gap-3 items-start">
                <UIcon name="i-lucide-check-circle" class="size-5 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <p class="font-semibold text-pizza-text">PostHog Analytics</p>
                  <p class="text-sm text-pizza-muted">Additional behavior analytics and session recording.</p>
                </div>
              </div>
              <div class="flex gap-3 items-start">
                <UIcon name="i-lucide-check-circle" class="size-5 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <p class="font-semibold text-pizza-text">Schema.org Markup</p>
                  <p class="text-sm text-pizza-muted">Structured data tells Google your hours, address, phone, and menu — powers rich search results.</p>
                </div>
              </div>
              <div class="flex gap-3 items-start">
                <UIcon name="i-lucide-check-circle" class="size-5 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <p class="font-semibold text-pizza-text">SEO Meta Tags</p>
                  <p class="text-sm text-pizza-muted">Every page has optimized titles, descriptions, and social sharing images.</p>
                </div>
              </div>
            </div>
          </article>

          <USeparator class="border-pizza-border" />

          <!-- Tech Stack -->
          <article id="tech" class="scroll-mt-24" @click="activeSection = 'tech'">
            <h2 class="text-2xl font-bold tracking-tight flex items-center gap-2 text-pizza-text">
              <UIcon name="i-lucide-code" class="size-6 text-primary-600" />
              Technical Details
            </h2>
            <p class="mt-2 text-pizza-muted">For developers maintaining or extending this site.</p>

            <div class="mt-4 overflow-hidden rounded-xl border border-pizza-border">
              <UTable
                :columns="[
                  { accessorKey: 'label', header: 'Property', meta: { class: { td: 'w-40 font-medium text-pizza-text bg-elevated' } } },
                  { accessorKey: 'value', header: 'Value', meta: { class: { td: 'text-pizza-muted' } } }
                ]"
                :data="[
                  { label: 'Framework', value: 'Nuxt 4 (Vue 3) with TypeScript' },
                  { label: 'UI Library', value: 'Nuxt UI 4' },
                  { label: 'Styling', value: 'Tailwind CSS 4 with custom warm pizza theme' },
                  { label: 'Hosting', value: 'Cloudflare Workers (edge serverless)' },
                  { label: 'Database', value: 'Cloudflare D1 (SQLite at the edge)' },
                  { label: 'ORM', value: 'Drizzle ORM' },
                  { label: 'SEO', value: '@nuxtjs/seo (sitemap, robots, schema.org, OG images)' },
                  { label: 'Analytics', value: 'PostHog + Google Analytics 4 + Google Search Console' },
                  { label: 'Secrets', value: 'Doppler (environment variable management)' }
                ]"
                class="w-full text-sm"
              />
            </div>
          </article>

          <USeparator class="border-pizza-border" />

          <!-- Getting Help -->
          <article id="support" class="scroll-mt-24" @click="activeSection = 'support'">
            <h2 class="text-2xl font-bold tracking-tight flex items-center gap-2 text-pizza-text">
              <UIcon name="i-lucide-life-buoy" class="size-6 text-primary-600" />
              Getting Help
            </h2>

            <div class="mt-4 grid sm:grid-cols-2 gap-4">
              <div class="rounded-xl border border-primary-200 bg-primary-50 p-4">
                <p class="font-semibold text-primary-800 flex items-center gap-2 text-sm">
                  <UIcon name="i-lucide-check" class="size-4" />
                  You Can Do These
                </p>
                <ul class="mt-3 text-sm text-primary-700 space-y-2">
                  <li class="flex items-center gap-2"><UIcon name="i-lucide-circle-check" class="size-4 shrink-0" /> Update menu item prices</li>
                  <li class="flex items-center gap-2"><UIcon name="i-lucide-circle-check" class="size-4 shrink-0" /> Add new menu items</li>
                  <li class="flex items-center gap-2"><UIcon name="i-lucide-circle-check" class="size-4 shrink-0" /> Deactivate old items</li>
                  <li class="flex items-center gap-2"><UIcon name="i-lucide-circle-check" class="size-4 shrink-0" /> Change item names or descriptions</li>
                </ul>
              </div>

              <div class="rounded-xl border border-pizza-border warm-surface p-4">
                <p class="font-semibold text-pizza-text flex items-center gap-2 text-sm">
                  <UIcon name="i-lucide-wrench" class="size-4" />
                  Contact Your Developer For
                </p>
                <ul class="mt-3 text-sm text-pizza-muted space-y-2">
                  <li class="flex items-center gap-2"><UIcon name="i-lucide-wrench" class="size-4 shrink-0 o-50" /> Updating business hours</li>
                  <li class="flex items-center gap-2"><UIcon name="i-lucide-wrench" class="size-4 shrink-0 o-50" /> Adding or replacing photos</li>
                  <li class="flex items-center gap-2"><UIcon name="i-lucide-wrench" class="size-4 shrink-0 o-50" /> Creating new pages</li>
                  <li class="flex items-center gap-2"><UIcon name="i-lucide-wrench" class="size-4 shrink-0 o-50" /> Changing the site design</li>
                  <li class="flex items-center gap-2"><UIcon name="i-lucide-wrench" class="size-4 shrink-0 o-50" /> Domain or hosting changes</li>
                </ul>
              </div>
            </div>

            <!-- Developer contact -->
            <div class="mt-5 rounded-xl border border-primary-200 bg-primary-50 p-5">
              <p class="font-semibold text-primary-800 flex items-center gap-2 text-sm">
                <UIcon name="i-lucide-user" class="size-4" />
                Your Developer
              </p>
              <div class="mt-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <p class="font-semibold text-primary-900">Logan Renz</p>
                <ULink to="mailto:narduk@mac.com" class="text-sm text-primary-700 hover:text-primary-900 flex items-center gap-1.5 transition-colors">
                  <UIcon name="i-lucide-mail" class="size-4" />
                  narduk@mac.com
                </ULink>
                <ULink to="tel:+18327682567" class="text-sm text-primary-700 hover:text-primary-900 flex items-center gap-1.5 transition-colors">
                  <UIcon name="i-lucide-phone" class="size-4" />
                  (832) 768-2567
                </ULink>
              </div>
            </div>
          </article>

          <!-- Footer -->
          <div class="pt-6 pb-4 text-center border-t border-pizza-border">
            <p class="text-pizza-muted text-sm">
              Built with ❤️ for Papa Everett's Pizza Co. · Clear Lake, Iowa
            </p>
            <p class="text-pizza-muted text-xs mt-1">
              Nuxt 4 · Cloudflare Workers · Last updated February 2026
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
