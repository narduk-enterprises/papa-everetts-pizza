export type { MenuPrices } from '#shared/types/menu'
import type { MenuPrices } from '#shared/types/menu'

export interface MenuItem {
  id: number
  category: string
  name: string
  description: string | null
  imageUrl: string | null
  prices: MenuPrices
  sortOrder: number
  isActive: boolean
  updatedAt: string
}

export function useMenu() {
  const { data, pending, error, refresh } = useAsyncData(
    'public-menu',
    () => $fetch<{ items: MenuItem[]; categories: Array<{ category: string; items: MenuItem[] }> }>('/api/menu'),
  )

  const items = computed(() => data.value?.items || [])
  const categories = computed(() => data.value?.categories || [])

  return {
    items,
    categories,
    pending,
    error,
    refresh,
  }
}
