<script setup lang="ts">
useSeoMeta({
  title: "Site Guide | Admin | Papa Everett's Pizza Co.",
  robots: 'noindex, nofollow',
})

const { loggedIn, user } = useAuth()

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
  activeSection.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10" style="font-family: system-ui, -apple-system, sans-serif;">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/admin" variant="ghost" size="sm" icon="i-lucide-arrow-left">Back to Admin</UButton>
    </div>

    <h1 class="text-4xl font-bold tracking-tight">Site Guide</h1>
    <p class="text-gray-500 mt-2 text-lg">Everything you need to know about your website.</p>

    <!-- Auth gate -->
    <div v-if="!loggedIn" class="mt-8 warm-card p-6">
      <p class="warm-muted">Please <NuxtLink to="/admin" class="text-blue-600 underline">log in</NuxtLink> to view the site guide.</p>
    </div>

    <div v-else-if="!user?.isAdmin" class="mt-8 warm-card p-6">
      <p>This page is only available to admin accounts.</p>
    </div>

    <template v-else>
      <!-- Sticky sidebar + content layout -->
      <div class="mt-8 grid lg:grid-cols-[220px_1fr] gap-8">

        <!-- Sidebar nav -->
        <nav class="hidden lg:block">
          <div class="sticky top-24 space-y-1">
            <button
              v-for="section in sections"
              :key="section.id"
              class="w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2.5 transition-colors"
              :class="activeSection === section.id
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'"
              @click="scrollTo(section.id)"
            >
              <UIcon :name="section.icon" class="size-4 shrink-0" />
              {{ section.title }}
            </button>
          </div>
        </nav>

        <!-- Mobile nav -->
        <div class="lg:hidden sticky top-16 z-10 bg-white/90 backdrop-blur-sm -mx-4 px-4 py-3 border-b border-gray-200">
          <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              v-for="section in sections"
              :key="section.id"
              class="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              :class="activeSection === section.id
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'"
              @click="scrollTo(section.id)"
            >
              {{ section.title }}
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="space-y-12 min-w-0">

          <!-- Overview -->
          <article id="overview" class="scroll-mt-24" @click="activeSection = 'overview'">
            <h2 class="text-2xl font-bold tracking-tight flex items-center gap-2">
              <UIcon name="i-lucide-info" class="size-6 text-blue-600" />
              Site Overview
            </h2>
            <div class="mt-4 text-gray-600 leading-relaxed space-y-3">
              <p>
                This website was custom-built for Papa Everett's Pizza Co. It's a modern, fast, mobile-friendly site designed to showcase your menu, photos, and restaurant information to customers in Clear Lake and beyond.
              </p>
              <p>
                The site is optimized for Google search results and loads instantly on any device — phone, tablet, or desktop.
              </p>
            </div>
          </article>

          <hr class="border-gray-200">

          <!-- Pages -->
          <article id="pages" class="scroll-mt-24" @click="activeSection = 'pages'">
            <h2 class="text-2xl font-bold tracking-tight flex items-center gap-2">
              <UIcon name="i-lucide-layout-grid" class="size-6 text-blue-600" />
              Your Pages
            </h2>
            <p class="mt-2 text-gray-500">Here are all the pages on your website. Click any to view it.</p>

            <div class="mt-4 grid sm:grid-cols-2 gap-3">
              <NuxtLink
                v-for="page in pages"
                :key="page.path"
                :to="page.path"
                target="_blank"
                class="block rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{{ page.name }}</p>
                    <p class="text-gray-500 text-sm mt-1 leading-snug">{{ page.desc }}</p>
                  </div>
                  <UIcon name="i-lucide-external-link" class="size-4 text-gray-400 shrink-0 mt-1" />
                </div>
              </NuxtLink>
            </div>
          </article>

          <hr class="border-gray-200">

          <!-- Menu Management -->
          <article id="menu-management" class="scroll-mt-24" @click="activeSection = 'menu-management'">
            <h2 class="text-2xl font-bold tracking-tight flex items-center gap-2">
              <UIcon name="i-lucide-pen-line" class="size-6 text-blue-600" />
              Managing the Menu
            </h2>
            <p class="mt-2 text-gray-500">
              The Admin Panel gives you full control over your menu, categories, and prices. Here is exactly how to use it.
            </p>

            <!-- Managing Categories -->
            <div class="mt-8">
              <h3 class="text-lg font-bold text-gray-900 border-b pb-2 mb-3">1. Managing Categories</h3>
              <p class="text-gray-600 text-sm mb-3">
                Categories (like "Pizzas" or "Appetizers") are listed in the left sidebar.
              </p>
              <ul class="text-sm text-gray-600 space-y-2 list-disc pl-5">
                <li>Click the <strong>⚙ gear icon</strong> next to "Categories" to open the manager.</li>
                <li><strong>Add:</strong> Type a new name and click "Add".</li>
                <li><strong>Rename:</strong> Click the pencil icon, type the new name, and click the checkmark or press Enter. <em>This safely updates the category for all items inside it!</em></li>
                <li><strong>Delete:</strong> Click the trash icon. You can only delete a category if it has no active items.</li>
              </ul>
            </div>

            <!-- Updating Existing Items -->
            <div class="mt-8">
              <h3 class="text-lg font-bold text-gray-900 border-b pb-2 mb-3">2. Updating Menu Items</h3>
              <p class="text-gray-600 text-sm mb-3">
                Click a category in the sidebar to view its items. To edit an item:
              </p>
              <ul class="text-sm text-gray-600 space-y-2 list-disc pl-5">
                <li><strong>Basic Info:</strong> Change the Name, Category, Sort Order, or Description directly in the text boxes.</li>
                <li><strong>Active Toggle:</strong> Switch an item to "Inactive" to hide it from the public menu without deleting it.</li>
                <li><strong>Saving:</strong> Click the red <strong>Save</strong> button in the top right of the item card. Changes go live instantly.</li>
              </ul>
            </div>

            <!-- Pricing Fields (The Tricky Part) -->
            <div class="mt-8">
              <h3 class="text-lg font-bold text-gray-900 border-b pb-2 mb-3">3. How Pricing Fields Work</h3>
              <p class="text-gray-600 text-sm mb-3">
                Pizzas have multiple sizes, while pastas might just have one price. The pricing editor adapts to both.
              </p>
              <ul class="text-sm text-gray-600 space-y-3 list-none pl-0">
                <li class="rounded-lg bg-gray-50 border border-gray-200 p-3">
                  <strong class="text-gray-900 block mb-1">Standard Fields</strong>
                  To add a standard size (Le Petit, Small, Medium, Large, XL), use the <strong>Standard Field</strong> dropdown at the bottom of the item, select the size, and click <strong>Add</strong>.
                </li>
                <li class="rounded-lg bg-gray-50 border border-gray-200 p-3">
                  <strong class="text-gray-900 block mb-1">Custom Fields</strong>
                  If you need a unique size (like "Party Tray"), type it into the <strong>Custom Field</strong> box and click <strong>Add Custom</strong>. It handles spacing and formatting automatically.
                </li>
                <li class="rounded-lg bg-gray-50 border border-gray-200 p-3">
                  <strong class="text-gray-900 block mb-1">Removing Prices</strong>
                  Click the <strong>X</strong> icon next to any price field to remove that size option completely.
                </li>
              </ul>
            </div>

            <!-- Tips -->
            <div class="mt-8 rounded-xl bg-amber-50 border border-amber-200 p-4">
              <p class="font-semibold text-amber-800 text-sm flex items-center gap-2">
                <UIcon name="i-lucide-lightbulb" class="size-4" />
                Pro Tips
              </p>
              <ul class="mt-2 text-sm text-amber-700 space-y-1.5 list-disc pl-5">
                <li>Leave a price field <strong>completely blank</strong> to show "Call for Current Price" on the live menu.</li>
                <li>Use the <strong>"Sort Order"</strong> number to control the display order. Lower numbers show up first (e.g., 1 before 10).</li>
                <li>Scroll to the very bottom of the category page to find the <strong>Add Menu Item</strong> section to create new food items!</li>
              </ul>
            </div>
          </article>

          <hr class="border-gray-200">

          <!-- Hosting -->
          <article id="hosting" class="scroll-mt-24" @click="activeSection = 'hosting'">
            <h2 class="text-2xl font-bold tracking-tight flex items-center gap-2">
              <UIcon name="i-lucide-cloud" class="size-6 text-blue-600" />
              Hosting & Domain
            </h2>

            <div class="mt-4 grid sm:grid-cols-2 gap-3">
              <div class="rounded-xl border border-gray-200 p-4">
                <p class="font-semibold text-gray-900 flex items-center gap-2">
                  <UIcon name="i-lucide-zap" class="size-4 text-yellow-500" /> Speed
                </p>
                <p class="text-gray-500 text-sm mt-1">Loads in under 1 second from anywhere in the world.</p>
              </div>
              <div class="rounded-xl border border-gray-200 p-4">
                <p class="font-semibold text-gray-900 flex items-center gap-2">
                  <UIcon name="i-lucide-shield-check" class="size-4 text-green-500" /> Security
                </p>
                <p class="text-gray-500 text-sm mt-1">HTTPS encryption and DDoS protection built in.</p>
              </div>
              <div class="rounded-xl border border-gray-200 p-4">
                <p class="font-semibold text-gray-900 flex items-center gap-2">
                  <UIcon name="i-lucide-activity" class="size-4 text-blue-500" /> Uptime
                </p>
                <p class="text-gray-500 text-sm mt-1">99.99% uptime — your site is almost never down.</p>
              </div>
              <div class="rounded-xl border border-gray-200 p-4">
                <p class="font-semibold text-gray-900 flex items-center gap-2">
                  <UIcon name="i-lucide-globe" class="size-4 text-purple-500" /> Domain
                </p>
                <p class="text-gray-500 text-sm mt-1">Live at <strong>papaeverettspizza.com</strong></p>
              </div>
            </div>

            <p class="mt-4 text-gray-500 text-sm leading-relaxed">
              Your website runs on <strong>Cloudflare Workers</strong>, one of the fastest hosting platforms available. Your menu data is stored in a <strong>Cloudflare D1 database</strong>, so menu updates are saved permanently and load instantly.
            </p>
          </article>

          <hr class="border-gray-200">

          <!-- SEO -->
          <article id="seo" class="scroll-mt-24" @click="activeSection = 'seo'">
            <h2 class="text-2xl font-bold tracking-tight flex items-center gap-2">
              <UIcon name="i-lucide-search" class="size-6 text-blue-600" />
              Google & Analytics
            </h2>
            <p class="mt-2 text-gray-500">
              Your site is fully optimized to rank well for searches like "pizza Clear Lake Iowa" or "Papa Everett's menu."
            </p>

            <div class="mt-5 space-y-3">
              <div class="flex gap-3 items-start">
                <UIcon name="i-lucide-check-circle" class="size-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p class="font-semibold text-gray-900">Google Search Console</p>
                  <p class="text-sm text-gray-500">Your site is registered and verified. Google is actively crawling and indexing your pages. Sitemap submitted.</p>
                </div>
              </div>
              <div class="flex gap-3 items-start">
                <UIcon name="i-lucide-check-circle" class="size-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p class="font-semibold text-gray-900">Google Analytics</p>
                  <p class="text-sm text-gray-500">Tracks visitors, page views, and traffic sources. Measurement ID: G-8WZ93XNKHX.</p>
                </div>
              </div>
              <div class="flex gap-3 items-start">
                <UIcon name="i-lucide-check-circle" class="size-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p class="font-semibold text-gray-900">PostHog Analytics</p>
                  <p class="text-sm text-gray-500">Additional behavior analytics and session recording.</p>
                </div>
              </div>
              <div class="flex gap-3 items-start">
                <UIcon name="i-lucide-check-circle" class="size-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p class="font-semibold text-gray-900">Schema.org Markup</p>
                  <p class="text-sm text-gray-500">Structured data tells Google your hours, address, phone, and menu — powers rich search results.</p>
                </div>
              </div>
              <div class="flex gap-3 items-start">
                <UIcon name="i-lucide-check-circle" class="size-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p class="font-semibold text-gray-900">SEO Meta Tags</p>
                  <p class="text-sm text-gray-500">Every page has optimized titles, descriptions, and social sharing images.</p>
                </div>
              </div>
            </div>
          </article>

          <hr class="border-gray-200">

          <!-- Tech Stack -->
          <article id="tech" class="scroll-mt-24" @click="activeSection = 'tech'">
            <h2 class="text-2xl font-bold tracking-tight flex items-center gap-2">
              <UIcon name="i-lucide-code" class="size-6 text-blue-600" />
              Technical Details
            </h2>
            <p class="mt-2 text-gray-500">For developers maintaining or extending this site.</p>

            <div class="mt-4 overflow-hidden rounded-xl border border-gray-200">
              <table class="w-full text-sm">
                <tbody>
                  <tr class="border-b border-gray-100">
                    <td class="px-4 py-2.5 font-medium text-gray-900 bg-gray-50 w-40">Framework</td>
                    <td class="px-4 py-2.5 text-gray-600">Nuxt 4 (Vue 3) with TypeScript</td>
                  </tr>
                  <tr class="border-b border-gray-100">
                    <td class="px-4 py-2.5 font-medium text-gray-900 bg-gray-50">UI Library</td>
                    <td class="px-4 py-2.5 text-gray-600">Nuxt UI 4</td>
                  </tr>
                  <tr class="border-b border-gray-100">
                    <td class="px-4 py-2.5 font-medium text-gray-900 bg-gray-50">Styling</td>
                    <td class="px-4 py-2.5 text-gray-600">Tailwind CSS 4 with custom warm pizza theme</td>
                  </tr>
                  <tr class="border-b border-gray-100">
                    <td class="px-4 py-2.5 font-medium text-gray-900 bg-gray-50">Hosting</td>
                    <td class="px-4 py-2.5 text-gray-600">Cloudflare Workers (edge serverless)</td>
                  </tr>
                  <tr class="border-b border-gray-100">
                    <td class="px-4 py-2.5 font-medium text-gray-900 bg-gray-50">Database</td>
                    <td class="px-4 py-2.5 text-gray-600">Cloudflare D1 (SQLite at the edge)</td>
                  </tr>
                  <tr class="border-b border-gray-100">
                    <td class="px-4 py-2.5 font-medium text-gray-900 bg-gray-50">ORM</td>
                    <td class="px-4 py-2.5 text-gray-600">Drizzle ORM</td>
                  </tr>
                  <tr class="border-b border-gray-100">
                    <td class="px-4 py-2.5 font-medium text-gray-900 bg-gray-50">SEO</td>
                    <td class="px-4 py-2.5 text-gray-600">@nuxtjs/seo (sitemap, robots, schema.org, OG images)</td>
                  </tr>
                  <tr class="border-b border-gray-100">
                    <td class="px-4 py-2.5 font-medium text-gray-900 bg-gray-50">Analytics</td>
                    <td class="px-4 py-2.5 text-gray-600">PostHog + Google Analytics 4 + Google Search Console</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2.5 font-medium text-gray-900 bg-gray-50">Secrets</td>
                    <td class="px-4 py-2.5 text-gray-600">Doppler (environment variable management)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <hr class="border-gray-200">

          <!-- Getting Help -->
          <article id="support" class="scroll-mt-24" @click="activeSection = 'support'">
            <h2 class="text-2xl font-bold tracking-tight flex items-center gap-2">
              <UIcon name="i-lucide-life-buoy" class="size-6 text-blue-600" />
              Getting Help
            </h2>

            <div class="mt-4 grid sm:grid-cols-2 gap-4">
              <div class="rounded-xl border border-green-200 bg-green-50 p-4">
                <p class="font-semibold text-green-800 flex items-center gap-2 text-sm">
                  <UIcon name="i-lucide-check" class="size-4" />
                  You Can Do These
                </p>
                <ul class="mt-3 text-sm text-green-700 space-y-2">
                  <li class="flex items-center gap-2"><UIcon name="i-lucide-circle-check" class="size-4 shrink-0" /> Update menu item prices</li>
                  <li class="flex items-center gap-2"><UIcon name="i-lucide-circle-check" class="size-4 shrink-0" /> Add new menu items</li>
                  <li class="flex items-center gap-2"><UIcon name="i-lucide-circle-check" class="size-4 shrink-0" /> Deactivate old items</li>
                  <li class="flex items-center gap-2"><UIcon name="i-lucide-circle-check" class="size-4 shrink-0" /> Change item names or descriptions</li>
                </ul>
              </div>

              <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p class="font-semibold text-gray-700 flex items-center gap-2 text-sm">
                  <UIcon name="i-lucide-wrench" class="size-4" />
                  Contact Your Developer For
                </p>
                <ul class="mt-3 text-sm text-gray-600 space-y-2">
                  <li class="flex items-center gap-2"><UIcon name="i-lucide-wrench" class="size-4 shrink-0 text-gray-400" /> Updating business hours</li>
                  <li class="flex items-center gap-2"><UIcon name="i-lucide-wrench" class="size-4 shrink-0 text-gray-400" /> Adding or replacing photos</li>
                  <li class="flex items-center gap-2"><UIcon name="i-lucide-wrench" class="size-4 shrink-0 text-gray-400" /> Creating new pages</li>
                  <li class="flex items-center gap-2"><UIcon name="i-lucide-wrench" class="size-4 shrink-0 text-gray-400" /> Changing the site design</li>
                  <li class="flex items-center gap-2"><UIcon name="i-lucide-wrench" class="size-4 shrink-0 text-gray-400" /> Domain or hosting changes</li>
                </ul>
              </div>
            </div>

            <!-- Developer contact -->
            <div class="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-5">
              <p class="font-semibold text-blue-800 flex items-center gap-2 text-sm">
                <UIcon name="i-lucide-user" class="size-4" />
                Your Developer
              </p>
              <div class="mt-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <p class="font-semibold text-blue-900">Logan Renz</p>
                <a href="mailto:narduk@mac.com" class="text-sm text-blue-700 hover:text-blue-900 flex items-center gap-1.5 transition-colors">
                  <UIcon name="i-lucide-mail" class="size-4" />
                  narduk@mac.com
                </a>
                <a href="tel:+18327682567" class="text-sm text-blue-700 hover:text-blue-900 flex items-center gap-1.5 transition-colors">
                  <UIcon name="i-lucide-phone" class="size-4" />
                  (832) 768-2567
                </a>
              </div>
            </div>
          </article>

          <!-- Footer -->
          <div class="pt-6 pb-4 text-center border-t border-gray-200">
            <p class="text-gray-400 text-sm">
              Built with ❤️ for Papa Everett's Pizza Co. · Clear Lake, Iowa
            </p>
            <p class="text-gray-400 text-xs mt-1">
              Nuxt 4 · Cloudflare Workers · Last updated February 2026
            </p>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>
