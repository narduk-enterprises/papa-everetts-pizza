<!-- eslint-disable atx/no-fetch-in-component -- SSR admin page data fetching -->
<script setup lang="ts">
definePageMeta({ title: 'PostHog Analytics', middleware: 'auth' })
useSeo({
  title: 'PostHog Analytics | Admin', description: 'Admin PostHog.', robots: 'noindex, nofollow' })
useWebPageSchema({ name: 'PostHog Analytics | Admin', description: 'Admin PostHog.' })

interface PHAction {
  math?: string
}
interface PHSeries {
  action?: PHAction
  count?: number
  data?: number[]
  labels?: string[]
}
interface PHInsights {
  results: PHSeries[]
  resolved_date_range?: { date_from: string; date_to: string }
}
interface PHPageRow {
  page: string
  pageviews: number
  uniqueVisitors: number
}
interface PHReferrerRow {
  referrer: string
  visits: number
  uniqueVisitors: number
}
interface PHDeviceRow {
  device: string
  pageviews: number
  uniqueVisitors: number
}
interface PHEntryExitRow {
  page: string
  count: number
}
interface PHRecording {
  id: string
  startTime: string
  endTime: string
  duration: number
  activeSeconds: number
  clickCount: number
  keypressCount: number
  startUrl: string
  personId: string
  replayUrl: string
}

// Authentication is handled by the 'auth' middleware
const { loggedIn } = useAuth()
if (!loggedIn.value) {
  navigateTo('/admin')
}

// Date range selector
const dateRange = ref('30d')
const dateRangeOptions = [
  { label: '1 hour', value: '1h' },
  { label: '1 day', value: '1d' },
  { label: '7 days', value: '7d' },
  { label: '14 days', value: '14d' },
  { label: '30 days', value: '30d' },
  { label: '60 days', value: '60d' },
  { label: '90 days', value: '90d' },
]

const insightParams = computed(() => ({ startDate: `-${dateRange.value}` }))
const dayParams = computed(() => ({ period: dateRange.value }))

// All fetches are lazy — page renders immediately with skeletons
const { data: posthogData, status: insightsStatus } = useFetch<PHInsights>('/api/admin/posthog/insights', {
  query: insightParams,
  watch: [insightParams],
  lazy: true,
})

const { data: pagesData, status: pagesStatus } = useFetch<{ rows: PHPageRow[] }>('/api/admin/posthog/pages', {
  query: dayParams,
  watch: [dayParams],
  lazy: true,
})

const { data: referrersData, status: referrersStatus } = useFetch<{ rows: PHReferrerRow[] }>(
  '/api/admin/posthog/referrers',
  {
    query: dayParams,
    watch: [dayParams],
    lazy: true,
  },
)

const { data: devicesData, status: devicesStatus } = useFetch<{ rows: PHDeviceRow[] }>(
  '/api/admin/posthog/devices',
  {
    query: dayParams,
    watch: [dayParams],
    lazy: true,
  },
)

const { data: entryExitData, status: entryExitStatus } = useFetch<{
  entryPages: PHEntryExitRow[]
  exitPages: PHEntryExitRow[]
}>('/api/admin/posthog/entry-exit', {
  query: dayParams,
  watch: [dayParams],
  lazy: true,
})

const { data: recordingsData, status: recordingsStatus } = useFetch<{
  recordings: PHRecording[]
  projectReplayUrl: string
}>('/api/admin/posthog/recordings', {
  query: { limit: '10' },
  lazy: true,
})

const results = computed(() => posthogData.value?.results || [])
const pages = computed(() => pagesData.value?.rows || [])
const referrers = computed(() => referrersData.value?.rows || [])
const devices = computed(() => devicesData.value?.rows || [])
const entryPages = computed(() => entryExitData.value?.entryPages || [])
const exitPages = computed(() => entryExitData.value?.exitPages || [])
const recordings = computed(() => recordingsData.value?.recordings || [])

// Split results into Pageviews (total) and Unique Visitors (dau)
const pageviewSeries = computed(() =>
  results.value.find((r: PHSeries) => r.action?.math === 'total'),
)
const dauSeries = computed(() => results.value.find((r: PHSeries) => r.action?.math === 'dau'))

// Summary stats
const totalPageviews = computed(() => pageviewSeries.value?.count || 0)
const totalUniqueVisitors = computed(() => dauSeries.value?.count || 0)
const avgPerDay = computed(() => {
  const data = pageviewSeries.value?.data || []
  const nonZero = data.filter((v: number) => v > 0)
  return nonZero.length > 0
    ? Math.round(data.reduce((a: number, b: number) => a + b, 0) / nonZero.length)
    : 0
})
const pagesPerVisitor = computed(() => {
  if (!totalPageviews.value || !totalUniqueVisitors.value) return '—'
  return (totalPageviews.value / totalUniqueVisitors.value).toFixed(1)
})

// Device stats
const totalDevicePageviews = computed(
  () => devices.value.reduce((sum: number, d: PHDeviceRow) => sum + d.pageviews, 0) || 1,
)
const deviceColors: Record<string, string> = {
  Desktop: 'bg-pizza-red',
  Mobile: 'bg-pizza-gold',
  Tablet: 'bg-pizza-black',
}

const formatLabel = (label: string) => {
  if (!label) return ''
  const parts = (label || '').split('-')
  return parts.length === 3 ? `${parts[1]}/${Number.parseInt(parts[2] || '0')}` : label
}

const dateRangeText = computed(() => {
  const range = posthogData.value?.resolved_date_range
  if (!range) return ''
  const from = new Date(range.date_from).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
  const to = new Date(range.date_to).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${from} – ${to}`
})

const maxPageviews = computed(() =>
  pages.value.length ? Math.max(...pages.value.map((p: PHPageRow) => p.pageviews)) : 1,
)
const maxRefVisits = computed(() =>
  referrers.value.length ? Math.max(...referrers.value.map((r: PHReferrerRow) => r.visits)) : 1,
)
const maxEntries = computed(() =>
  entryPages.value.length ? Math.max(...entryPages.value.map((p: PHEntryExitRow) => p.count)) : 1,
)
const maxExits = computed(() =>
  exitPages.value.length ? Math.max(...exitPages.value.map((p: PHEntryExitRow) => p.count)) : 1,
)

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${Math.round(seconds)}s`
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return `${mins}m ${secs}s`
}

const formatRecordingTime = (iso: string) => {
  const d = new Date(iso)
  return (
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  )
}

</script>

<template>
  <div class="max-w-6xl mx-auto py-8 px-4 flex flex-col gap-8">
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center gap-3">
        <UButton variant="ghost" color="neutral" to="/admin" icon="i-lucide-arrow-left" size="sm" />
        <div>
          <h1 class="text-2xl font-bold tracking-tight">PostHog Analytics</h1>
          <p class="text-sm text-dimmed">
            Product analytics for papaeverettspizza.com
            <span v-if="dateRangeText" class="ml-1 opacity-60">· {{ dateRangeText }}</span>
          </p>
        </div>
      </div>

      <!-- Date range selector -->
      <UFieldGroup class="p-1">
        <UButton
          v-for="opt in dateRangeOptions"
          :key="opt.value"
          size="sm"
          :variant="dateRange === opt.value ? 'solid' : 'ghost'"
          :color="dateRange === opt.value ? 'primary' : 'neutral'"
          class="font-medium"
          @click="dateRange = opt.value"
        >
          {{ opt.label }}
        </UButton>
      </UFieldGroup>
    </div>

    <!-- ═══════════════════════ Summary Stat Cards ═══════════════════════ -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <template v-if="insightsStatus === 'pending'">
        <UCard v-for="i in 4" :key="i">
          <div class="flex items-center gap-2 mb-3">
            <USkeleton class="size-4 rounded" />
            <USkeleton class="h-3 w-20" />
          </div>
          <USkeleton class="h-8 w-24" />
        </UCard>
      </template>
      <template v-else-if="results.length === 0">
        <div class="col-span-full h-32 flex flex-col items-center justify-center text-dimmed">
          <UIcon name="i-lucide-zap-off" class="size-12 mb-3 opacity-20" />
          <p class="text-sm">No PostHog data found</p>
          <p class="text-xs mt-1">Ensure the PostHog API key is configured</p>
        </div>
      </template>
      <template v-else>
        <UCard>
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-lucide-eye" class="size-4 text-primary" />
            <span class="text-xs text-dimmed uppercase tracking-wider font-medium">Pageviews</span>
          </div>
          <p class="text-3xl font-bold tabular-nums">{{ totalPageviews.toLocaleString() }}</p>
        </UCard>
        <UCard>
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-lucide-users" class="size-4 text-pizza-gold" />
            <span class="text-xs text-dimmed uppercase tracking-wider font-medium"
              >Unique Visitors</span
            >
          </div>
          <p class="text-3xl font-bold tabular-nums">{{ totalUniqueVisitors.toLocaleString() }}</p>
        </UCard>
        <UCard>
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-lucide-trending-up" class="size-4 text-pizza-red" />
            <span class="text-xs text-dimmed uppercase tracking-wider font-medium"
              >Avg / Active Day</span
            >
          </div>
          <p class="text-3xl font-bold tabular-nums">{{ avgPerDay.toLocaleString() }}</p>
        </UCard>
        <UCard>
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-lucide-ratio" class="size-4 text-pizza-black" />
            <span class="text-xs text-dimmed uppercase tracking-wider font-medium"
              >Pages / Visitor</span
            >
          </div>
          <p class="text-3xl font-bold tabular-nums">{{ pagesPerVisitor }}</p>
        </UCard>
      </template>
    </div>

    <!-- ═══════════════════════ Pageview Trend Chart ═══════════════════════ -->
    <UCard v-if="insightsStatus === 'pending'">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <USkeleton class="w-3 h-3 rounded-full" />
            <USkeleton class="h-4 w-24" />
            <USkeleton class="w-3 h-3 rounded-full ml-4" />
            <USkeleton class="h-3 w-28" />
          </div>
          <USkeleton class="h-3 w-20" />
        </div>
      </template>
      <div class="h-44 flex items-end gap-[2px]">
        <USkeleton
          v-for="i in 30"
          :key="i"
          class="flex-1 rounded-t"
          :style="{ height: `${20 + Math.random() * 60}%` }"
        />
      </div>
      <div class="flex justify-between mt-2">
        <USkeleton class="h-3 w-12" />
        <USkeleton class="h-3 w-12" />
        <USkeleton class="h-3 w-12" />
      </div>
    </UCard>
    <UCard v-else-if="pageviewSeries">
      <template #header>
        <div class="flex items-center justify-between font-display">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-pizza-red" />
              <span class="font-bold">Pageviews</span>
            </div>
            <div v-if="dauSeries" class="flex items-center gap-2 ml-4">
              <div class="w-3 h-3 rounded-full bg-pizza-gold" />
              <span class="text-sm text-pizza-muted">Unique Visitors</span>
            </div>
          </div>
          <span class="text-sm text-pizza-muted tabular-nums"
            >{{ totalPageviews.toLocaleString() }} total</span
          >
        </div>
      </template>

      <div class="h-44 flex items-end gap-[2px] relative">
        <div
          v-for="(val, idx) in pageviewSeries.data || []"
          :key="idx"
          class="flex-1 relative group"
          :style="{ height: '100%' }"
        >
          <!-- Pageview bar -->
          <div
            class="absolute bottom-0 left-0 right-0 bg-pizza-red/25 hover:bg-pizza-red/50 transition-all duration-150 rounded-t"
            :style="{
              height: `${Math.max((val / Math.max(...(pageviewSeries.data || []), 1)) * 100, val > 0 ? 2 : 0)}%`,
            }"
          />
          <!-- DAU overlay bar -->
          <div
            v-if="dauSeries?.data?.[idx]"
            class="absolute bottom-0 left-[15%] right-[15%] bg-pizza-gold/40 rounded-t pointer-events-none"
            :style="{
              height: `${Math.max((dauSeries.data[idx] / Math.max(...(pageviewSeries.data || []), 1)) * 100, dauSeries.data[idx] > 0 ? 2 : 0)}%`,
            }"
          />
          <!-- Tooltip -->
          <div
            class="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverted text-inverted text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10"
          >
            {{ formatLabel(pageviewSeries.labels?.[idx] || '') }}: {{ val }}
            <span v-if="dauSeries?.data?.[idx]" class="text-success-300">
              · {{ dauSeries.data[idx] }} uv</span>
          </div>
        </div>
      </div>
      <div class="flex justify-between text-xs text-dimmed px-1 mt-2">
        <span>{{ formatLabel(pageviewSeries.labels?.[0] || '') }}</span>
        <span>{{
          formatLabel(
            pageviewSeries.labels?.[Math.floor((pageviewSeries.labels?.length || 0) / 2)] || '',
          )
        }}</span>
        <span>{{
          formatLabel(pageviewSeries.labels?.[(pageviewSeries.labels?.length || 1) - 1] || '')
        }}</span>
      </div>
    </UCard>

    <!-- ═══════════════════════ Device Breakdown ═══════════════════════ -->
    <UCard v-if="devicesStatus === 'pending'">
      <template #header>
        <div class="flex items-center gap-2">
          <USkeleton class="size-5 rounded" />
          <USkeleton class="h-4 w-36" />
        </div>
      </template>
      <div class="flex flex-col gap-4">
        <USkeleton class="h-8 w-full rounded-xl" />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i" class="flex items-center gap-3 p-3 rounded-xl border border-default">
            <USkeleton class="size-3 rounded-full shrink-0" />
            <div class="flex-1 space-y-1.5">
              <USkeleton class="h-3.5 w-16" />
              <USkeleton class="h-3 w-24" />
            </div>
            <div class="space-y-1.5 text-right">
              <USkeleton class="h-3.5 w-10 ml-auto" />
              <USkeleton class="h-3 w-8 ml-auto" />
            </div>
          </div>
        </div>
      </div>
    </UCard>
    <UCard v-else-if="devices.length > 0">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-monitor-smartphone" class="size-5 text-primary" />
          <span class="font-semibold">Device Breakdown</span>
        </div>
      </template>

      <div class="flex flex-col gap-4">
        <!-- Device distribution bar -->
        <div class="h-8 flex rounded-xl overflow-hidden">
          <div
            v-for="device in devices"
            :key="device.device"
            class="transition-all duration-300 relative group"
            :class="deviceColors[device.device] || 'bg-pizza-muted'"
            :style="{ width: `${(device.pageviews / totalDevicePageviews) * 100}%` }"
          >
            <div
              v-if="(device.pageviews / totalDevicePageviews) * 100 > 8"
              class="absolute inset-0 flex items-center justify-center text-xs font-medium text-white"
            >
              {{ Math.round((device.pageviews / totalDevicePageviews) * 100) }}%
            </div>
          </div>
        </div>

        <!-- Device details -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="device in devices"
            :key="device.device"
            class="flex items-center gap-3 p-3 rounded-xl border border-default"
          >
            <div
              class="size-3 rounded-full shrink-0"
              :class="deviceColors[device.device] || 'bg-pizza-muted'"
            />
            <div class="flex-1">
              <p class="text-sm font-medium">{{ device.device || 'Unknown' }}</p>
              <p class="text-xs text-dimmed">
                {{ device.uniqueVisitors.toLocaleString() }} unique visitors
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold tabular-nums">
                {{ device.pageviews.toLocaleString() }}
              </p>
              <p class="text-xs text-dimmed tabular-nums">
                {{ Math.round((device.pageviews / totalDevicePageviews) * 100) }}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- ═══════════════════════ Top Pages + Top Referrers ═══════════════════════ -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Pages -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-text" class="size-4 text-primary" />
            <span class="font-semibold">Top Pages</span>
          </div>
        </template>
        <template v-if="pagesStatus === 'pending'">
          <div class="flex flex-col gap-3">
            <div v-for="i in 6" :key="i">
              <div class="flex items-center justify-between mb-1.5">
                <USkeleton class="h-3.5" :style="{ width: `${100 + Math.random() * 120}px` }" />
                <div class="flex items-center gap-3">
                  <USkeleton class="h-3.5 w-8" />
                  <USkeleton class="h-3 w-10" />
                </div>
              </div>
              <USkeleton class="h-1.5 rounded-full" :style="{ width: `${30 + Math.random() * 70}%` }" />
            </div>
          </div>
        </template>
        <template v-else>
          <div v-if="pages.length === 0" class="text-sm text-dimmed italic py-4 text-center">
            No page data available
          </div>
          <div v-else class="flex flex-col gap-2.5">
            <div v-for="page in pages.slice(0, 10)" :key="page.page">
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="truncate max-w-[240px] font-medium" :title="page.page">{{
                  page.page || '/'
                }}</span>
                <div class="flex items-center gap-3 text-dimmed shrink-0">
                  <span class="tabular-nums">{{ page.pageviews.toLocaleString() }}</span>
                  <span class="text-xs w-12 text-right tabular-nums">
                    {{ page.uniqueVisitors }} <span class="opacity-50">uv</span>
                  </span>
                </div>
              </div>
              <div class="h-1.5 rounded-full bg-default overflow-hidden">
                <div
                  class="h-full rounded-full bg-primary/50 transition-all duration-300"
                  :style="{ width: `${(page.pageviews / maxPageviews) * 100}%` }"
                />
              </div>
            </div>
          </div>
        </template>
      </UCard>

      <!-- Top Referrers -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-link" class="size-4 text-success" />
            <span class="font-semibold">Top Referrers</span>
          </div>
        </template>
        <template v-if="referrersStatus === 'pending'">
          <div class="flex flex-col gap-3">
            <div v-for="i in 6" :key="i">
              <div class="flex items-center justify-between mb-1.5">
                <USkeleton class="h-3.5" :style="{ width: `${80 + Math.random() * 140}px` }" />
                <div class="flex items-center gap-3">
                  <USkeleton class="h-3.5 w-8" />
                  <USkeleton class="h-3 w-10" />
                </div>
              </div>
              <USkeleton class="h-1.5 rounded-full" :style="{ width: `${25 + Math.random() * 75}%` }" />
            </div>
          </div>
        </template>
        <template v-else>
          <div v-if="referrers.length === 0" class="text-sm text-dimmed italic py-4 text-center">
            No referrer data available
          </div>
          <div v-else class="flex flex-col gap-2.5">
            <div v-for="ref in referrers.slice(0, 10)" :key="ref.referrer">
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="truncate max-w-[240px] font-medium" :title="ref.referrer">{{
                  ref.referrer
                }}</span>
                <div class="flex items-center gap-3 text-dimmed shrink-0">
                  <span class="tabular-nums">{{ ref.visits.toLocaleString() }}</span>
                  <span class="text-xs w-12 text-right tabular-nums">
                    {{ ref.uniqueVisitors }} <span class="opacity-50">uv</span>
                  </span>
                </div>
              </div>
              <div class="h-1.5 rounded-full bg-default overflow-hidden">
                <div
                  class="h-full rounded-full bg-success/50 transition-all duration-300"
                  :style="{ width: `${(ref.visits / maxRefVisits) * 100}%` }"
                />
              </div>
            </div>
          </div>
        </template>
      </UCard>
    </div>

    <!-- ═══════════════════════ Entry & Exit Pages ═══════════════════════ -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Entry Pages -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-log-in" class="size-4 text-primary" />
            <span class="font-semibold">Entry Pages</span>
          </div>
        </template>
        <template v-if="entryExitStatus === 'pending'">
          <div class="flex flex-col gap-3">
            <div v-for="i in 5" :key="i">
              <div class="flex items-center justify-between mb-1.5">
                <USkeleton class="h-3.5" :style="{ width: `${90 + Math.random() * 100}px` }" />
                <USkeleton class="h-3.5 w-10" />
              </div>
              <USkeleton class="h-1.5 rounded-full" :style="{ width: `${20 + Math.random() * 80}%` }" />
            </div>
          </div>
        </template>
        <template v-else>
          <div v-if="entryPages.length === 0" class="text-sm text-dimmed italic py-4 text-center">
            No entry page data
          </div>
          <div v-else class="flex flex-col gap-2.5">
            <div v-for="page in entryPages.slice(0, 8)" :key="page.page">
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="truncate max-w-[240px] font-medium" :title="page.page">{{
                  page.page || '/'
                }}</span>
                <span class="text-dimmed tabular-nums shrink-0">{{
                  page.count.toLocaleString()
                }}</span>
              </div>
              <div class="h-1.5 rounded-full bg-default overflow-hidden">
                <div
                  class="h-full rounded-full bg-primary/50 transition-all duration-300"
                  :style="{ width: `${(page.count / maxEntries) * 100}%` }"
                />
              </div>
            </div>
          </div>
        </template>
      </UCard>

      <!-- Exit Pages -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-log-out" class="size-4 text-error" />
            <span class="font-semibold">Exit Pages</span>
          </div>
        </template>
        <template v-if="entryExitStatus === 'pending'">
          <div class="flex flex-col gap-3">
            <div v-for="i in 5" :key="i">
              <div class="flex items-center justify-between mb-1.5">
                <USkeleton class="h-3.5" :style="{ width: `${90 + Math.random() * 100}px` }" />
                <USkeleton class="h-3.5 w-10" />
              </div>
              <USkeleton class="h-1.5 rounded-full" :style="{ width: `${20 + Math.random() * 80}%` }" />
            </div>
          </div>
        </template>
        <template v-else>
          <div v-if="exitPages.length === 0" class="text-sm text-dimmed italic py-4 text-center">
            No exit page data
          </div>
          <div v-else class="flex flex-col gap-2.5">
            <div v-for="page in exitPages.slice(0, 8)" :key="page.page">
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="truncate max-w-[240px] font-medium" :title="page.page">{{
                  page.page || '/'
                }}</span>
                <span class="text-dimmed tabular-nums shrink-0">{{
                  page.count.toLocaleString()
                }}</span>
              </div>
              <div class="h-1.5 rounded-full bg-default overflow-hidden">
                <div
                  class="h-full rounded-full bg-error/50 transition-all duration-300"
                  :style="{ width: `${(page.count / maxExits) * 100}%` }"
                />
              </div>
            </div>
          </div>
        </template>
      </UCard>
    </div>

    <!-- ═══════════════════════ Recent Recordings ═══════════════════════ -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-play-circle" class="size-4 text-error" />
            <span class="font-semibold">Recent Recordings</span>
          </div>
          <ULink
            v-if="recordingsData?.projectReplayUrl"
            :to="recordingsData.projectReplayUrl"
            target="_blank"
            class="text-xs text-primary hover:underline"
          >
            View all →
          </ULink>
        </div>
      </template>

      <template v-if="recordingsStatus === 'pending'">
        <div class="flex flex-col divide-y divide-default">
          <div v-for="i in 5" :key="i" class="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div class="flex items-center gap-3">
              <USkeleton class="size-4 rounded shrink-0" />
              <div class="space-y-1.5">
                <USkeleton class="h-3.5" :style="{ width: `${150 + Math.random() * 100}px` }" />
                <USkeleton class="h-3 w-40" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <USkeleton class="h-3 w-6" />
              <USkeleton class="h-3.5 w-12" />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-if="recordings.length === 0" class="text-sm text-dimmed italic py-4 text-center">
          No recordings available
        </div>
        <div v-else class="flex flex-col divide-y divide-default">
          <ULink
            v-for="rec in recordings"
            :key="rec.id"
            :to="rec.replayUrl"
            target="_blank"
            class="flex items-center justify-between py-3 hover:bg-elevated -mx-2 px-2 rounded-lg transition-colors group first:pt-0 last:pb-0"
          >
            <div class="flex items-center gap-3 min-w-0">
              <UIcon
                name="i-lucide-play"
                class="size-4 text-pizza-red shrink-0 group-hover:text-pizza-red/80 transition-colors"
              />
              <div class="min-w-0">
                <p class="text-sm font-medium text-pizza-text truncate max-w-sm">
                  {{ rec.startUrl?.replace(/^https?:\/\//, '') || 'Unknown page' }}
                </p>
                <p class="text-xs text-pizza-muted">
                  {{ formatRecordingTime(rec.startTime) }} · {{ rec.personId }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4 text-xs text-pizza-muted shrink-0">
              <span class="flex items-center gap-1" :title="`${rec.clickCount} clicks`">
                <UIcon name="i-lucide-mouse-pointer-click" class="size-3" />
                {{ rec.clickCount }}
              </span>
              <span class="font-medium text-pizza-text tabular-nums">{{
                formatDuration(rec.duration)
              }}</span>
            </div>
          </ULink>
        </div>
      </template>
    </UCard>
  </div>
</template>
