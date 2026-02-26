<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { labelForPriceKey, parseDraftPrices, parseSortOrder } from '~/composables/useAdminMenuEditor'

useSeoMeta({
  title: "Admin | Papa Everett's Pizza Co.",
  robots: 'noindex, nofollow',
})

const toast = useToast()
const { user, loggedIn, login, logout, refresh: refreshAuth } = useAuth()
const { items, categories, categoryRecords, pending, saveItem, addItem, deleteItem, addCategory, updateCategory, deleteCategory } = useAdminMenu()

const {
  activeCategory,
  searchQuery,
  showInactive,
  itemDrafts,
  newItem,
  resetNewItem,
  categoryCounts,
  currentItems,
  availablePresetKeys,
  addPresetPriceKey,
  addCustomPriceKey,
  removePriceKey,
  onDraftCategoryUpdated,
} = useAdminMenuEditor(items, categories)

// ── Auth ──────────────────────────────
const authLoading = ref(false)

const authSchema = computed(() => z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
}))

type AuthState = { email?: string, password?: string }
const authState = reactive<AuthState>({ email: undefined, password: undefined })

async function submitAuth(_event: FormSubmitEvent<any>) {
  authLoading.value = true
  try {
    await login(authState.email!, authState.password!)
    await refreshAuth()
  } catch (error: any) {
    toast.add({ title: 'Auth Error', description: error?.data?.message || 'Unable to authenticate.', color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    authLoading.value = false
  }
}

// ── CRUD mutations ────────────────────
async function onSaveItem(itemId: number) {
  const draft = itemDrafts.value[itemId]
  if (!draft) return

  try {
    const prices = parseDraftPrices(draft.priceInputs, draft.enabledPriceKeys)
    await saveItem(itemId, {
      category: draft.category,
      name: draft.name.trim(),
      description: draft.description.trim(),
      imageUrl: draft.imageUrl || null,
      sortOrder: parseSortOrder(draft.sortOrder),
      isActive: draft.isActive,
      prices,
    })
    toast.add({ title: 'Saved', description: 'Menu item updated successfully.', color: 'success', icon: 'i-lucide-check' })
  } catch (error: any) {
    toast.add({ title: 'Unable to save item', description: error?.data?.message || error?.message || 'Please review the fields and try again.', color: 'error', icon: 'i-lucide-alert-circle' })
  }
}

async function onDeleteItem(itemId: number) {
  try {
    await deleteItem(itemId)
    toast.add({ title: 'Set Inactive', description: 'Item has been set inactive.', color: 'neutral', icon: 'i-lucide-trash' })
  } catch (error: any) {
    toast.add({ title: 'Unable to deactivate item', description: error?.data?.message || 'Please try again.', color: 'error', icon: 'i-lucide-alert-circle' })
  }
}

async function onAddItem() {
  try {
    const prices = parseDraftPrices(newItem.priceInputs, newItem.enabledPriceKeys)
    await addItem({
      category: newItem.category,
      name: newItem.name.trim(),
      description: newItem.description.trim(),
      imageUrl: newItem.imageUrl || null,
      sortOrder: parseSortOrder(newItem.sortOrder),
      prices,
    })
    activeCategory.value = newItem.category
    resetNewItem(newItem.category)
    toast.add({ title: 'Item Added', description: 'New menu item created.', color: 'success', icon: 'i-lucide-check' })
  } catch (error: any) {
    toast.add({ title: 'Unable to add item', description: error?.data?.message || error?.message || 'Please review the fields and try again.', color: 'error', icon: 'i-lucide-alert-circle' })
  }
}

async function onUploadImage(event: Event, draft: any) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await $fetch<{ url: string }>('/api/admin/images', {
      method: 'POST',
      body: formData,
    })
    draft.imageUrl = response.url
    toast.add({ title: 'Image uploaded', color: 'success', icon: 'i-lucide-check' })
  } catch (error: any) {
    toast.add({ title: 'Upload failed', description: error?.data?.message || 'Please try again.', color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    // Reset file input so the same file could be selected again if needed
    target.value = ''
  }
}

// ── Category Management ───────────────
const showCategoryPanel = ref(false)
const newCategoryName = ref('')
const editingCategory = ref<number | null>(null)
const editCategoryName = ref('')

async function onAddCategory() {
  if (!newCategoryName.value.trim()) return
  try {
    const nextOrder = categoryRecords.value.length
    await addCategory(newCategoryName.value.trim(), nextOrder)
    newCategoryName.value = ''
    toast.add({ title: 'Category Added', color: 'success', icon: 'i-lucide-check' })
  } catch (error: any) {
    toast.add({ title: 'Error', description: error?.data?.message || 'Unable to add category.', color: 'error', icon: 'i-lucide-alert-circle' })
  }
}

function startEditCategory(cat: { id: number; name: string }) {
  editingCategory.value = cat.id
  editCategoryName.value = cat.name
}

async function saveEditCategory(catId: number) {
  if (!editCategoryName.value.trim()) return
  try {
    await updateCategory(catId, { name: editCategoryName.value.trim() })
    editingCategory.value = null
    toast.add({ title: 'Category Renamed', color: 'success', icon: 'i-lucide-check' })
  } catch (error: any) {
    toast.add({ title: 'Error', description: error?.data?.message || 'Unable to rename category.', color: 'error', icon: 'i-lucide-alert-circle' })
  }
}

async function onDeleteCategory(catId: number) {
  try {
    await deleteCategory(catId)
    toast.add({ title: 'Category Removed', color: 'neutral', icon: 'i-lucide-trash' })
  } catch (error: any) {
    toast.add({ title: 'Cannot Delete', description: error?.data?.message || 'Unable to delete category.', color: 'error', icon: 'i-lucide-alert-circle' })
  }
}
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" style="font-family: system-ui, -apple-system, sans-serif;">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold tracking-tight">Admin</h1>
        <p class="text-gray-500 mt-1">Manage your menu, prices, and categories.</p>
        
        <div v-if="loggedIn && user?.isAdmin" class="mt-4 flex items-center gap-2 flex-wrap">
          <UButton to="/admin/posthog" variant="soft" color="info" size="xs" icon="i-lucide-bar-chart-2">PostHog</UButton>
          <UButton to="/admin/analytics" variant="soft" color="primary" size="xs" icon="i-lucide-line-chart">Google Analytics</UButton>
          <UButton to="/admin/gsc" variant="soft" color="primary" size="xs" icon="i-lucide-search">Search Console</UButton>
        </div>
      </div>
      <div v-if="loggedIn" class="flex items-center gap-2">
        <UButton v-if="user?.isAdmin" to="/admin/guide" variant="soft" color="neutral" size="sm" icon="i-lucide-book-open">Site Guide</UButton>
        <UButton variant="soft" color="error" size="sm" icon="i-lucide-log-out" @click="logout">Logout</UButton>
      </div>
    </div>

    <!-- Auth gate -->
    <div v-if="!loggedIn" class="mt-8">
      <AppFormCard title="Admin Login" description="Log in to manage menu pricing." icon="i-lucide-shield-check" size="narrow">
        <div class="space-y-4">
          <UForm :schema="authSchema" :state="authState" class="form-section" @submit="submitAuth">
            <UFormField label="Email" name="email">
              <UInput v-model="authState.email" type="email" placeholder="you@example.com" icon="i-lucide-mail" class="w-full" />
            </UFormField>
            <UFormField label="Password" name="password">
              <UInput v-model="authState.password" type="password" placeholder="••••••••" icon="i-lucide-lock" class="w-full" />
            </UFormField>

            <div class="form-actions form-actions-full">
              <UButton type="submit" :loading="authLoading" icon="i-lucide-arrow-right">
                Sign In
              </UButton>
            </div>
          </UForm>
        </div>
      </AppFormCard>
    </div>

    <!-- Non-admin notice -->
    <div v-else-if="!user?.isAdmin" class="mt-8 rounded-xl border border-gray-200 p-6">
      <p class="text-lg font-medium">This account is not an admin account.</p>
      <p class="text-gray-500 mt-2">Use an admin account to access menu management.</p>
    </div>

    <!-- Admin panel -->
    <div v-else class="mt-8 grid xl:grid-cols-[250px_1fr] gap-6">

      <!-- Sidebar -->
      <aside class="space-y-4">
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm xl:sticky xl:top-24">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs uppercase tracking-wider text-gray-400 font-semibold">Categories</p>
            <UButton size="xs" variant="ghost" color="neutral" icon="i-lucide-settings" @click="showCategoryPanel = !showCategoryPanel" />
          </div>

          <div class="space-y-0.5">
            <button
              v-for="category in categories"
              :key="category"
              class="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors"
              :class="activeCategory === category ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
              @click="activeCategory = category"
            >
              <span class="truncate">{{ category }}</span>
              <span class="text-xs tabular-nums" :class="activeCategory === category ? 'text-blue-500' : 'text-gray-400'">{{ categoryCounts[category] || 0 }}</span>
            </button>
          </div>

          <USeparator class="my-3" />

          <label class="flex items-center justify-between gap-3 text-sm text-gray-600">
            <span>Show inactive</span>
            <USwitch v-model="showInactive" />
          </label>
        </div>

        <!-- Category management panel -->
        <div v-if="showCategoryPanel" class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p class="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Manage Categories</p>

          <div class="space-y-2">
            <div
              v-for="cat in categoryRecords"
              :key="cat.id"
              class="flex items-center gap-2"
            >
              <template v-if="editingCategory === cat.id">
                <UInput v-model="editCategoryName" size="sm" class="flex-1" @keyup.enter="saveEditCategory(cat.id)" />
                <UButton size="xs" icon="i-lucide-check" variant="soft" @click="saveEditCategory(cat.id)" />
                <UButton size="xs" icon="i-lucide-x" variant="ghost" color="neutral" @click="editingCategory = null" />
              </template>
              <template v-else>
                <span class="flex-1 text-sm text-gray-700 truncate">{{ cat.name }}</span>
                <UButton size="xs" icon="i-lucide-pencil" variant="ghost" color="neutral" @click="startEditCategory(cat)" />
                <UButton size="xs" icon="i-lucide-trash-2" variant="ghost" color="error" @click="onDeleteCategory(cat.id)" />
              </template>
            </div>
          </div>

          <form @submit.prevent="onAddCategory" class="mt-3 flex gap-2">
            <UInput v-model="newCategoryName" placeholder="New category name" size="sm" class="flex-1" />
            <UButton type="submit" size="sm" icon="i-lucide-plus" :disabled="!newCategoryName.trim()">Add</UButton>
          </form>
        </div>
      </aside>

      <!-- Main content -->
      <div class="space-y-6 min-w-0">
        <!-- Category header -->
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold tracking-tight">{{ activeCategory }}</h2>
              <p class="text-gray-500 text-sm mt-1">
                Update names, descriptions, and pricing. Leave a price blank to show "Call for Current Price."
              </p>
            </div>
            <div class="w-full lg:w-72">
              <UInput v-model="searchQuery" placeholder="Search items..." icon="i-lucide-search" />
            </div>
          </div>
        </div>

        <!-- Loading -->
        <p v-if="pending" class="text-gray-500 py-8 text-center">Loading menu items...</p>

        <!-- Empty state -->
        <div v-else-if="!currentItems.length" class="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <UIcon name="i-lucide-package-open" class="size-8 text-gray-400 mx-auto" />
          <p class="text-gray-500 mt-2">No items match your current selection.</p>
        </div>

        <!-- Item cards -->
        <article
          v-for="entry in currentItems"
          :key="entry.item.id"
          class="rounded-xl border bg-white shadow-sm overflow-hidden"
          :class="entry.draft.isActive ? 'border-gray-200' : 'border-orange-200 bg-orange-50/20'"
        >
          <!-- Item header bar -->
          <div class="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100 bg-gray-50/50">
            <div class="flex items-center gap-4">
              <span class="font-display text-xl font-bold text-gray-900 tracking-tight leading-none">{{ entry.draft.name || 'Untitled' }}</span>
              <span
                class="text-[11px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider"
                :class="entry.draft.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'"
              >
                {{ entry.draft.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="flex items-center gap-3">
              <UButton size="md" color="neutral" variant="ghost" icon="i-lucide-trash-2" @click="onDeleteItem(entry.item.id)" />
              <UButton size="md" color="error" class="px-5 font-bold shadow-sm" @click="onSaveItem(entry.item.id)" icon="i-lucide-save">Save</UButton>
            </div>
          </div>

          <!-- Item body -->
          <div class="p-6 sm:p-8 space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <UFormField label="Name" class="md:col-span-4 lg:col-span-3">
                <UInput v-model="entry.draft.name" size="lg" class="w-full font-medium" />
              </UFormField>
              <UFormField label="Category" class="md:col-span-4 lg:col-span-4">
                <USelect v-model="entry.draft.category" :items="categories" size="lg" class="w-full" @update:model-value="onDraftCategoryUpdated(entry.draft)" />
              </UFormField>
              <UFormField label="Sort Order" class="md:col-span-2 lg:col-span-2">
                <UInput v-model="entry.draft.sortOrder" type="number" size="lg" class="w-full" />
              </UFormField>
              <div class="md:col-span-2 lg:col-span-3 flex items-center h-full pt-[2px] lg:pt-8 xl:pt-[2px]">
                <label class="inline-flex items-center gap-3 cursor-pointer">
                  <USwitch v-model="entry.draft.isActive" color="error" size="md" />
                  <span class="text-sm font-semibold text-gray-700">Active</span>
                </label>
              </div>

              <UFormField label="Description" class="md:col-span-12">
                <UTextarea v-model="entry.draft.description" autoresize :rows="2" size="lg" class="w-full text-base" />
              </UFormField>

              <UFormField label="Image" class="md:col-span-12">
                <div class="flex items-center gap-4">
                  <div v-if="entry.draft.imageUrl" class="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-gray-200 shadow-sm bg-gray-50 flex items-center justify-center">
                    <img :src="entry.draft.imageUrl" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-20 h-20 rounded-lg shrink-0 border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400">
                    <UIcon name="i-lucide-image" class="size-6" />
                  </div>
                  <div class="flex items-center gap-2">
                    <UButton color="neutral" variant="soft" as="label" class="cursor-pointer relative overflow-hidden" icon="i-lucide-upload">
                      <span>{{ entry.draft.imageUrl ? 'Change Image' : 'Upload Image' }}</span>
                      <input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer w-full" @change="e => onUploadImage(e, entry.draft)" />
                    </UButton>
                    <UButton v-if="entry.draft.imageUrl" color="error" variant="ghost" icon="i-lucide-trash-2" @click="entry.draft.imageUrl = null" />
                  </div>
                </div>
              </UFormField>
            </div>

            <!-- Pricing -->
            <div class="pt-2">
              <div class="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
                <h3 class="font-display text-2xl font-bold text-gray-900 tracking-tight">Pricing</h3>
                <p class="text-[11px] text-gray-400 font-mono tracking-wider uppercase bg-gray-50 px-2 py-1 rounded-md">ID {{ entry.item.id }} · {{ entry.item.updatedAt }}</p>
              </div>

              <AdminPriceEditor
                :draft="entry.draft"
                :key-prefix="String(entry.item.id)"
                :available-preset-keys="availablePresetKeys(entry.draft)"
                @add-preset="addPresetPriceKey(entry.draft)"
                @add-custom="addCustomPriceKey(entry.draft)"
                @remove-key="(key) => removePriceKey(entry.draft, key)"
              />
            </div>
          </div>
        </article>

        <!-- Add new item -->
        <div class="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 p-6 sm:p-8 shadow-sm">
          <div class="flex flex-col mb-8 border-b border-blue-100 pb-4">
            <h3 class="font-display text-2xl font-bold tracking-tight flex items-center gap-2 text-blue-900">
              <UIcon name="i-lucide-plus-circle" class="size-6 text-blue-600" />
              Add Menu Item
            </h3>
            <p class="text-blue-700/80 text-sm mt-2">Create a new item in the current category.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mt-6">
            <UFormField label="Name" class="md:col-span-5">
              <UInput v-model="newItem.name" size="lg" class="w-full font-medium" />
            </UFormField>
            <UFormField label="Category" class="md:col-span-5">
              <USelect v-model="newItem.category" :items="categories" size="lg" class="w-full" />
            </UFormField>
            <UFormField label="Sort Order" class="md:col-span-2">
              <UInput v-model="newItem.sortOrder" type="number" size="lg" class="w-full" />
            </UFormField>

            <UFormField label="Description" class="md:col-span-12">
              <UTextarea v-model="newItem.description" autoresize :rows="2" size="lg" class="w-full text-base" />
            </UFormField>

            <UFormField label="Image" class="md:col-span-12">
              <div class="flex items-center gap-4">
                <div v-if="newItem.imageUrl" class="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-blue-200 shadow-sm bg-blue-50 flex items-center justify-center">
                  <img :src="newItem.imageUrl" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-20 h-20 rounded-lg shrink-0 border border-dashed border-blue-300 bg-blue-50 flex items-center justify-center text-blue-400">
                  <UIcon name="i-lucide-image" class="size-6" />
                </div>
                <div class="flex items-center gap-2">
                  <UButton color="neutral" variant="soft" as="label" class="cursor-pointer relative overflow-hidden" icon="i-lucide-upload">
                    <span>{{ newItem.imageUrl ? 'Change Image' : 'Upload Image' }}</span>
                    <input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer w-full" @change="e => onUploadImage(e, newItem)" />
                  </UButton>
                  <UButton v-if="newItem.imageUrl" color="error" variant="ghost" icon="i-lucide-trash-2" @click="newItem.imageUrl = null" />
                </div>
              </div>
            </UFormField>
          </div>

          <div class="mt-10">
            <div class="flex items-center justify-between mb-6 border-b border-blue-100 pb-2">
              <h4 class="font-display text-2xl font-bold text-blue-900 tracking-tight">Pricing</h4>
            </div>
            <AdminPriceEditor
              :draft="newItem"
              key-prefix="new"
              :available-preset-keys="availablePresetKeys(newItem)"
              @add-preset="addPresetPriceKey(newItem)"
              @add-custom="addCustomPriceKey(newItem)"
              @remove-key="(key) => removePriceKey(newItem, key)"
            />
          </div>

          <div class="mt-8 pt-6 border-t border-blue-100 flex items-center justify-end gap-3">
            <UButton size="lg" color="neutral" variant="soft" @click="resetNewItem(activeCategory)">Reset</UButton>
            <UButton size="lg" color="primary" @click="onAddItem" icon="i-lucide-plus" class="px-6 font-bold">Add Item</UButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
