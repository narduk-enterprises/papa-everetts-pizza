import type { MenuItem } from './useMenu'
import type { MenuPrices } from '#shared/types/menu'

interface NewItemPayload {
  category: string
  name: string
  description: string
  imageUrl: string | null
  prices: MenuPrices
  sortOrder: number
}

interface UpdateItemPayload {
  category?: string
  name?: string
  description?: string
  imageUrl?: string | null
  prices?: MenuPrices
  sortOrder?: number
  isActive?: boolean
}

export interface CategoryRecord {
  id: number
  name: string
  sortOrder: number
  isActive: boolean
}

const CSRF_HEADERS = { 'X-Requested-With': 'XMLHttpRequest' } as const

export function useAdminMenu() {
  const requestFetch = import.meta.server ? useRequestFetch() : $fetch

  const { data, pending, error, refresh } = useAsyncData(
    'admin-menu',
    () => requestFetch<{ items: MenuItem[]; categories: string[] }>('/api/admin/menu'),
  )

  const items = computed(() => data.value?.items || [])
  const categories = computed(() => data.value?.categories || [])

  // ── Menu Item CRUD ──────────────────────────────────────────
  async function saveItem(itemId: number, payload: UpdateItemPayload) {
    await $fetch(`/api/admin/menu/${itemId}`, {
      method: 'PATCH',
      body: payload,
      headers: CSRF_HEADERS,
    })
    await refresh()
  }

  async function addItem(payload: NewItemPayload) {
    await $fetch('/api/admin/menu', {
      method: 'POST',
      body: payload,
      headers: CSRF_HEADERS,
    })
    await refresh()
  }

  async function deleteItem(itemId: number) {
    await $fetch(`/api/admin/menu/${itemId}`, {
      method: 'DELETE',
      headers: CSRF_HEADERS,
    })
    await refresh()
  }

  // ── Category CRUD ───────────────────────────────────────────
  const {
    data: categoryData,
    refresh: refreshCategories,
  } = useAsyncData(
    'admin-categories',
    () => requestFetch<{ categories: CategoryRecord[] }>('/api/admin/categories'),
  )

  const categoryRecords = computed(() => categoryData.value?.categories || [])

  async function addCategory(name: string, sortOrder: number) {
    await $fetch('/api/admin/categories', {
      method: 'POST',
      body: { name, sortOrder },
      headers: CSRF_HEADERS,
    })
    await Promise.all([refresh(), refreshCategories()])
  }

  async function updateCategory(id: number, payload: { name?: string; sortOrder?: number; isActive?: boolean }) {
    await $fetch(`/api/admin/categories/${id}`, {
      method: 'PATCH',
      body: payload,
      headers: CSRF_HEADERS,
    })
    await Promise.all([refresh(), refreshCategories()])
  }

  async function deleteCategory(id: number) {
    await $fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: CSRF_HEADERS,
    })
    await Promise.all([refresh(), refreshCategories()])
  }

  async function uploadImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return $fetch<{ url: string }>('/api/admin/images', {
      method: 'POST',
      body: formData,
      headers: CSRF_HEADERS,
    })
  }

  return {
    items,
    categories,
    categoryRecords,
    pending,
    error,
    refresh,
    refreshCategories,
    saveItem,
    addItem,
    deleteItem,
    addCategory,
    updateCategory,
    deleteCategory,
    uploadImage,
  }
}
