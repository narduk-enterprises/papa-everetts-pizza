<script setup lang="ts">
import { formatPrice, menuSizeLabels, restaurantInfo } from '~/composables/useRestaurantInfo'

const props = defineProps<{
  items: MenuItem[]
  /** If true, renders the inline menu-page variant (compact headers, no hero image). */
  inline?: boolean
}>()

const {
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
} = usePizzaBuilder(computed(() => props.items))

const selectedSizeLabel = computed(() => menuSizeLabels[selectedSize.value] || selectedSize.value)

// Mobile sticky total bar visibility
const showMobileSummary = ref(false)
const priceCardRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!priceCardRef.value) return
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry) showMobileSummary.value = !entry.isIntersecting
    },
    { threshold: 0.1 },
  )
  observer.observe(priceCardRef.value)
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <div v-if="buildYourOwnItem">
    <div class="grid lg:grid-cols-[2fr_1fr] gap-6 lg:gap-8 items-start" :class="inline ? '' : 'p-0'">
      <!-- Builder controls -->
      <div class="space-y-6" :class="inline ? '' : 'warm-card p-4 sm:p-6'">
        <!-- Size -->
        <div>
          <component :is="inline ? 'h3' : 'h2'" :class="inline ? 'font-semibold text-lg mb-3' : 'font-display text-2xl'">
            <span class="inline-flex items-center gap-2">
              <span class="inline-flex items-center justify-center size-7 rounded-full bg-(--color-pizza-red)/10 text-(--color-pizza-red) text-xs font-bold shrink-0">1</span>
              Choose Size
            </span>
          </component>
          <div class="grid grid-cols-3 sm:grid-cols-5 gap-2" :class="inline ? '' : 'mt-4'">
            <UButton
              v-for="size in availableSizes"
              :key="size.key"
              variant="outline"
              size="lg"
              :color="selectedSize === size.key ? 'primary' : 'neutral'"
              class="justify-center font-medium transition-all"
              :class="{ 'ring-2 ring-pizza-red/30': selectedSize === size.key }"
              @click="selectedSize = size.key"
            >
              {{ size.label }}
            </UButton>
          </div>
          <p class="warm-muted text-sm mt-2">Base price: <strong>{{ formatPrice(basePrice) }}</strong></p>
        </div>

        <!-- Crust -->
        <div>
          <component :is="inline ? 'h3' : 'h2'" :class="inline ? 'font-semibold text-lg mb-3' : 'font-display text-2xl'">
            <span class="inline-flex items-center gap-2">
              <span class="inline-flex items-center justify-center size-7 rounded-full bg-(--color-pizza-red)/10 text-(--color-pizza-red) text-xs font-bold shrink-0">2</span>
              Crust Option
            </span>
          </component>
          <div
            class="flex items-center gap-3 p-4 rounded-xl border transition-all"
            :class="[
              isDeepDish
                ? 'border-pizza-red bg-pizza-red/5 text-pizza-red'
                : 'border-pizza-border bg-pizza-surface warm-muted hover:bg-elevated',
              inline ? '' : 'mt-4',
            ]"
          >
            <UCheckbox v-model="isDeepDish" color="error" label="Deep Dish" class="flex-1 font-medium" />
            <span class="text-xs opacity-75">+{{ formatPrice(deepDishUpcharge) }}</span>
          </div>
        </div>

        <!-- Toppings -->
        <div>
          <component :is="inline ? 'h3' : 'h2'" :class="inline ? 'font-semibold text-lg mb-2' : 'font-display text-2xl'">
            <span class="inline-flex items-center gap-2">
              <span class="inline-flex items-center justify-center size-7 rounded-full bg-(--color-pizza-red)/10 text-(--color-pizza-red) text-xs font-bold shrink-0">3</span>
              Add Toppings
              <span v-if="selectedToppings.length" class="ml-1 inline-flex items-center justify-center size-6 rounded-full bg-(--color-pizza-red) text-white text-xs font-bold">
                {{ selectedToppings.length }}
              </span>
            </span>
          </component>
          <p class="warm-muted text-sm" :class="inline ? 'mb-3' : 'mt-2'">
            Each topping for {{ selectedSizeLabel }}: <strong>{{ formatPrice(toppingUnitPrice) }}</strong>
          </p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2" :class="inline ? '' : 'mt-4'">
            <UButton
              v-for="topping in toppingOptions"
              :key="topping"
              variant="outline"
              size="md"
              :color="selectedToppings.includes(topping) ? 'primary' : 'neutral'"
              class="justify-start transition-all"
              :class="{ 'ring-2 ring-pizza-red/30 bg-pizza-red/5': selectedToppings.includes(topping) }"
              :icon="selectedToppings.includes(topping) ? 'i-lucide-check-circle' : 'i-lucide-circle'"
              @click="toggleTopping(topping)"
            >
              {{ topping }}
            </UButton>
          </div>
        </div>
      </div>

      <!-- Price estimate sidebar / card -->
      <aside ref="priceCardRef" class="warm-card p-5 h-fit lg:sticky lg:top-24 border-2 border-pizza-border">
        <component :is="inline ? 'h3' : 'h2'" class="font-display text-2xl mb-4">
          Price Estimate
        </component>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between gap-4">
            <span class="warm-muted">Base ({{ selectedSizeLabel }})</span>
            <span>{{ formatPrice(basePrice) }}</span>
          </div>
          <div class="flex justify-between gap-4">
            <span class="warm-muted">Deep dish</span>
            <span>{{ isDeepDish ? formatPrice(deepDishUpcharge) : '$0.00' }}</span>
          </div>
          <div class="flex justify-between gap-4">
            <span class="warm-muted">Toppings ({{ selectedToppings.length }})</span>
            <span>{{ formatPrice(toppingsSubtotal) }}</span>
          </div>
          <div class="pt-2 border-t border-[var(--color-pizza-border)] flex justify-between gap-4">
            <span class="warm-muted">Subtotal</span>
            <span>{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="flex justify-between gap-4">
            <span class="warm-muted">Tax (7%)</span>
            <span>{{ formatPrice(tax) }}</span>
          </div>
        </div>
        <div class="pt-4 mt-4 border-t-2 border-(--color-pizza-red)/20 flex items-center justify-between">
          <span class="font-bold text-lg">Estimated Total</span>
          <span class="text-2xl font-display text-(--color-pizza-red)">{{ formatPrice(total) }}</span>
        </div>
        <div class="flex gap-2 mt-4">
          <UButton color="neutral" variant="soft" @click="reset">Reset</UButton>
          <UButton :to="restaurantInfo.phoneHref">Call to Order</UButton>
        </div>
        <p class="warm-muted text-xs mt-3">Prices include estimated 7% sales tax for Clear Lake, IA. Final total may vary.</p>
      </aside>
    </div>

  </div>
</template>
