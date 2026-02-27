import type { MenuItem } from '~/composables/useMenu'
import type { MenuPrices } from '#shared/types/menu'

// ── Price Key Configuration ──────────────────────────────────────────
const categoryPriceTemplates: Record<string, string[]> = {
  'Build Your Own Masterpiece': [
    'le_petit', 'small', 'medium', 'large', 'xl',
    'topping_le_petit', 'topping_small', 'topping_medium', 'topping_large', 'topping_xl',
    'deep_dish_le_petit', 'deep_dish_small', 'deep_dish_medium', 'deep_dish_large', 'deep_dish_xl',
  ],
  'Gourmet Pizzas': ['le_petit', 'small', 'medium', 'large', 'xl'],
  'Favorite Pizzas': ['le_petit', 'small', 'medium', 'large', 'xl'],
  'Exclusive Pizzas': ['small', 'medium', 'large'],
  'Oven-Baked Pastas': ['single'],
  Appetizers: ['single'],
  Salads: ['single'],
  Desserts: ['le_petit', 'small', 'medium', 'large', 'single'],
}

const priceKeyLabels: Record<string, string> = {
  le_petit: 'Le Petit',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  xl: 'XL',
  single: 'Single / One Size',
  topping_le_petit: 'Topping (Le Petit)',
  topping_small: 'Topping (Small)',
  topping_medium: 'Topping (Medium)',
  topping_large: 'Topping (Large)',
  topping_xl: 'Topping (XL)',
  deep_dish_le_petit: 'Deep Dish Upcharge (Le Petit)',
  deep_dish_small: 'Deep Dish Upcharge (Small)',
  deep_dish_medium: 'Deep Dish Upcharge (Medium)',
  deep_dish_large: 'Deep Dish Upcharge (Large)',
  deep_dish_xl: 'Deep Dish Upcharge (XL)',
}

const priceKeyOrder = [
  'le_petit', 'small', 'medium', 'large', 'xl', 'single',
  'topping_le_petit', 'topping_small', 'topping_medium', 'topping_large', 'topping_xl',
  'deep_dish_le_petit', 'deep_dish_small', 'deep_dish_medium', 'deep_dish_large', 'deep_dish_xl',
]

const priceKeyAliases: Record<string, string> = {
  'le petit': 'le_petit',
  le_petit: 'le_petit',
  'one size': 'single',
  one_size: 'single',
  price: 'single',
  s: 'small',
  m: 'medium',
  l: 'large',
}

// ── Types ────────────────────────────────────────────────────────────
export interface PriceDraftState {
  priceInputs: Record<string, string>
  enabledPriceKeys: string[]
  addPresetKey: string
  newCustomKey: string
}

export interface MenuItemDraft extends PriceDraftState {
  category: string
  name: string
  description: string
  imageUrl?: string | null
  sortOrder: number | string
  isActive: boolean
}

export interface NewItemForm extends PriceDraftState {
  category: string
  name: string
  description: string
  imageUrl?: string | null
  sortOrder: number | string
}

// ── Helpers ──────────────────────────────────────────────────────────
function dedupeKeys(keys: string[]) {
  return [...new Set(keys)]
}

function getTemplatePriceKeys(category: string) {
  return categoryPriceTemplates[category] || ['single']
}

function sortPriceKeys(keys: string[]) {
  return dedupeKeys(keys).sort((a, b) => {
    const aIndex = priceKeyOrder.indexOf(a)
    const bIndex = priceKeyOrder.indexOf(b)
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    return a.localeCompare(b)
  })
}

function firstMissingPresetKey(category: string, enabledKeys: string[]) {
  return getTemplatePriceKeys(category).find(key => !enabledKeys.includes(key)) || ''
}

function toPriceInput(value: number | null | undefined) {
  return value == null ? '' : String(value)
}

export function normalizePriceKey(rawKey: string) {
  const lower = rawKey.trim().toLowerCase().replace(/\s+/g, ' ')
  const alias = priceKeyAliases[lower]
  if (alias) return alias
  return lower.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
}

export function labelForPriceKey(key: string) {
  if (priceKeyLabels[key]) return priceKeyLabels[key]
  return key.split('_').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

function createPriceDraftState(category: string, prices: MenuPrices, withTemplateDefaults: boolean): PriceDraftState {
  const fromItem = Object.keys(prices || {})
  const baseKeys = withTemplateDefaults
    ? dedupeKeys([...getTemplatePriceKeys(category), ...fromItem])
    : (fromItem.length ? fromItem : getTemplatePriceKeys(category))

  const enabledPriceKeys = sortPriceKeys(baseKeys)
  const priceInputs: Record<string, string> = {}
  for (const key of enabledPriceKeys) {
    priceInputs[key] = toPriceInput(prices[key])
  }

  return {
    priceInputs,
    enabledPriceKeys,
    addPresetKey: firstMissingPresetKey(category, enabledPriceKeys),
    newCustomKey: '',
  }
}

function createItemDraft(item: MenuItem): MenuItemDraft {
  return {
    category: item.category,
    name: item.name,
    description: item.description || '',
    imageUrl: item.imageUrl,
    sortOrder: item.sortOrder,
    isActive: item.isActive,
    ...createPriceDraftState(item.category, item.prices, false),
  }
}

function createNewItemForm(category: string): NewItemForm {
  return {
    category,
    name: '',
    description: '',
    imageUrl: null,
    sortOrder: 50,
    ...createPriceDraftState(category, {}, true),
  }
}

export function parseSortOrder(value: number | string) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric) || numeric < 0) {
    throw new Error('Sort order must be a non-negative number')
  }
  return Math.trunc(numeric)
}

export function parseDraftPrices(priceInputs: Record<string, string>, enabledPriceKeys: string[]) {
  if (!enabledPriceKeys.length) throw new Error('At least one price field is required')

  const prices: MenuPrices = {}
  for (const rawKey of enabledPriceKeys) {
    const key = normalizePriceKey(rawKey)
    if (!key) continue
    if (prices[key] !== undefined) throw new Error(`Duplicate price key after normalization: "${key}"`)

    const rawValue = (priceInputs[rawKey] || '').trim()
    if (!rawValue) {
      prices[key] = null
      continue
    }

    const numeric = Number(rawValue)
    if (!Number.isFinite(numeric)) throw new Error(`Invalid numeric price for key "${rawKey}"`)
    prices[key] = Number(numeric.toFixed(2))
  }

  return prices
}

// ── Composable ───────────────────────────────────────────────────────
export function useAdminMenuEditor(items: Ref<MenuItem[]>, categories: Ref<string[]>) {
  const toast = useToast()

  const activeCategory = ref('Build Your Own Masterpiece')
  const searchQuery = ref('')
  const showInactive = ref(false)

  const itemDrafts = ref<Record<number, MenuItemDraft>>({})
  const newItem = reactive<NewItemForm>(createNewItemForm(activeCategory.value))

  function resetNewItem(category = newItem.category) {
    Object.assign(newItem, createNewItemForm(category))
  }

  // Sync category when categories list changes
  watch(categories, (nextCategories) => {
    if (nextCategories.length && !nextCategories.includes(activeCategory.value)) {
      activeCategory.value = nextCategories[0] || 'Build Your Own Masterpiece'
    }
  }, { immediate: true })

  // Rebuild drafts when items change
  watch(items, (nextItems) => {
    const drafts: Record<number, MenuItemDraft> = {}
    for (const item of nextItems) {
      drafts[item.id] = createItemDraft(item)
    }
    itemDrafts.value = drafts
  }, { immediate: true })

  // Reset new item form when switching categories (if form is blank)
  watch(activeCategory, (category) => {
    if (!newItem.name && !newItem.description) resetNewItem(category)
  })

  // Sync new item price keys when its category changes
  watch(() => newItem.category, (category, previousCategory) => {
    if (!category || category === previousCategory) return
    const nextTemplate = getTemplatePriceKeys(category)
    const previousTemplate = getTemplatePriceKeys(previousCategory || category)
    const preservedCustom = newItem.enabledPriceKeys.filter(key => !previousTemplate.includes(key))
    const enabledPriceKeys = sortPriceKeys([...nextTemplate, ...preservedCustom])
    const nextInputs: Record<string, string> = {}
    for (const key of enabledPriceKeys) {
      nextInputs[key] = newItem.priceInputs[key] || ''
    }
    newItem.enabledPriceKeys = enabledPriceKeys
    newItem.priceInputs = nextInputs
    newItem.addPresetKey = firstMissingPresetKey(category, enabledPriceKeys)
  })

  // Computed views
  const categoryCounts = computed<Record<string, number>>(() => {
    const counts: Record<string, number> = {}
    for (const category of categories.value) counts[category] = 0
    for (const item of items.value) {
      const draft = itemDrafts.value[item.id]
      const isActive = draft?.isActive ?? item.isActive
      if (!showInactive.value && !isActive) continue
      if (counts[item.category] === undefined) counts[item.category] = 0
      counts[item.category] = (counts[item.category] ?? 0) + 1
    }
    return counts
  })

  const currentItems = computed<Array<{ item: MenuItem; draft: MenuItemDraft }>>(() => {
    const search = searchQuery.value.trim().toLowerCase()
    const filtered: Array<{ item: MenuItem; draft: MenuItemDraft }> = []
    for (const item of items.value) {
      if (item.category !== activeCategory.value) continue
      const draft = itemDrafts.value[item.id]
      if (!draft) continue
      if (!showInactive.value && !draft.isActive) continue
      if (search && !draft.name.toLowerCase().includes(search)) continue
      filtered.push({ item, draft })
    }
    return filtered.sort((a, b) => {
      const sortDelta = Number(a.draft.sortOrder) - Number(b.draft.sortOrder)
      if (Number.isFinite(sortDelta) && sortDelta !== 0) return sortDelta
      return a.draft.name.localeCompare(b.draft.name)
    })
  })

  // Price key management
  function availablePresetKeys(draft: { category: string; enabledPriceKeys: string[] }) {
    return getTemplatePriceKeys(draft.category).filter(key => !draft.enabledPriceKeys.includes(key))
  }

  function setNextPresetKey(draft: PriceDraftState & { category: string }) {
    draft.addPresetKey = firstMissingPresetKey(draft.category, draft.enabledPriceKeys)
  }

  function addPresetPriceKey(draft: PriceDraftState & { category: string }) {
    const key = draft.addPresetKey
    if (!key || draft.enabledPriceKeys.includes(key)) return
    draft.enabledPriceKeys = sortPriceKeys([...draft.enabledPriceKeys, key])
    draft.priceInputs[key] = draft.priceInputs[key] || ''
    setNextPresetKey(draft)
  }

  function addCustomPriceKey(draft: PriceDraftState & { category: string }) {
    const normalized = normalizePriceKey(draft.newCustomKey)
    if (!normalized) {
      toast.add({ title: 'Invalid price key', description: 'Enter a valid custom key before adding it.', color: 'error', icon: 'i-lucide-alert-circle' })
      return
    }
    if (draft.enabledPriceKeys.includes(normalized)) {
      toast.add({ title: 'Price key already exists', description: `"${normalized}" is already present for this item.`, color: 'neutral', icon: 'i-lucide-info' })
      draft.newCustomKey = ''
      return
    }
    draft.enabledPriceKeys = sortPriceKeys([...draft.enabledPriceKeys, normalized])
    draft.priceInputs[normalized] = ''
    draft.newCustomKey = ''
    setNextPresetKey(draft)
  }

  function removePriceKey(draft: PriceDraftState & { category: string }, key: string) {
    if (draft.enabledPriceKeys.length <= 1) {
      toast.add({ title: 'At least one price is required', description: 'Keep one price field enabled for each menu item.', color: 'error', icon: 'i-lucide-alert-circle' })
      return
    }
    draft.enabledPriceKeys = draft.enabledPriceKeys.filter(existing => existing !== key)
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete draft.priceInputs[key]
    setNextPresetKey(draft)
  }

  function onDraftCategoryUpdated(draft: MenuItemDraft) {
    setNextPresetKey(draft)
  }

  return {
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
  }
}
