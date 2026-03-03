import type { Ref } from 'vue'
import type { MenuItem } from './useMenu'
import { LOCAL_TAX_RATE, menuSizeLabels, toppings } from './useRestaurantInfo'

const sizeOrder = ['le_petit', 'small', 'medium', 'large', 'xl'] as const
export type PizzaBuilderSize = typeof sizeOrder[number]
function getNumericPrice(item: MenuItem | null, key: string) {
  if (!item) return 0
  const value = item.prices[key]
  return typeof value === 'number' ? value : 0
}

export function usePizzaBuilder(menuItems: Ref<MenuItem[]>) {
  const selectedSize = ref<PizzaBuilderSize>('small')
  const isDeepDish = ref(false)
  const selectedToppings = ref<string[]>([])

  const buildYourOwnItem = computed(() => {
    return menuItems.value.find(item => {
      const isCategoryMatch = ['Build Your Own Masterpiece', 'Build Your Own'].includes(item.category)
      const isNameMatch = ['Build Your Own Masterpiece', 'Cheese Pizza'].includes(item.name)
      return isCategoryMatch || isNameMatch
    }) || null
  })

  const availableSizes = computed(() => {
    const item = buildYourOwnItem.value
    if (!item) return [] as Array<{ key: PizzaBuilderSize; label: string }>

    return sizeOrder
      .filter(size => typeof item.prices[size] === 'number')
      .map(size => ({ key: size, label: menuSizeLabels[size] || size }))
  })

  watch(availableSizes, (sizes) => {
    if (!sizes.length) return
    if (!sizes.some(size => size.key === selectedSize.value)) {
      const firstSize = sizes[0]
      if (!firstSize) return
      selectedSize.value = firstSize.key
    }
  }, { immediate: true })

  const basePrice = computed(() => {
    const item = buildYourOwnItem.value
    if (!item) return null
    const price = item.prices[selectedSize.value]
    return typeof price === 'number' ? price : null
  })

  const toppingUnitPrice = computed(() => {
    return getNumericPrice(buildYourOwnItem.value, `topping_${selectedSize.value}`)
  })

  const deepDishUpcharge = computed(() => {
    if (!isDeepDish.value) return 0
    return getNumericPrice(buildYourOwnItem.value, `deep_dish_${selectedSize.value}`)
  })

  const toppingsSubtotal = computed(() => selectedToppings.value.length * toppingUnitPrice.value)

  const subtotal = computed(() => {
    if (basePrice.value == null) return null
    return basePrice.value + toppingsSubtotal.value + deepDishUpcharge.value
  })

  const tax = computed(() => {
    if (subtotal.value == null) return null
    return Math.round(subtotal.value * LOCAL_TAX_RATE * 100) / 100
  })

  const total = computed(() => {
    if (subtotal.value == null || tax.value == null) return null
    return subtotal.value + tax.value
  })

  const toppingOptions = computed(() => toppings)

  function toggleTopping(topping: string) {
    if (selectedToppings.value.includes(topping)) {
      selectedToppings.value = selectedToppings.value.filter(name => name !== topping)
      return
    }
    selectedToppings.value = [...selectedToppings.value, topping]
  }

  function reset() {
    selectedSize.value = availableSizes.value[0]?.key || 'small'
    isDeepDish.value = false
    selectedToppings.value = []
  }

  return {
    buildYourOwnItem,
    availableSizes,
    selectedSize,
    isDeepDish,
    selectedToppings,
    toppingOptions,
    basePrice,
    toppingUnitPrice,
    deepDishUpcharge,
    toppingsSubtotal,
    subtotal,
    tax,
    total,
    toggleTopping,
    reset,
  }
}
