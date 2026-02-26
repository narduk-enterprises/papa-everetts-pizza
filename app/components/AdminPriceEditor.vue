<script setup lang="ts">
import { computed } from 'vue'
import type { PriceDraftState } from '~/composables/useAdminMenuEditor'
import { labelForPriceKey } from '~/composables/useAdminMenuEditor'

const props = defineProps<{
  draft: PriceDraftState & { category: string }
  /** Prefix for :key to avoid collisions between existing item editors and the new item form */
  keyPrefix: string
  availablePresetKeys: string[]
}>()

const emit = defineEmits<{
  addPreset: []
  addCustom: []
  removeKey: [key: string]
}>()

const presetOptions = computed(() => {
  return props.availablePresetKeys.map(key => ({
    label: labelForPriceKey(key),
    value: key
  }))
})
</script>

<template>
  <div>
    <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="priceKey in draft.enabledPriceKeys"
        :key="`${keyPrefix}-${priceKey}`"
        class="rounded-xl border border-gray-200 p-5 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
      >
        <div class="flex items-start justify-between gap-2 mb-4">
          <p class="text-[15px] font-bold text-gray-800">{{ labelForPriceKey(priceKey) }}</p>
          <UButton
            color="neutral"
            variant="soft"
            icon="i-lucide-x"
            size="xs"
            class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
            @click="emit('removeKey', priceKey)"
          />
        </div>
        <UInput 
          v-model="draft.priceInputs[priceKey]" 
          placeholder="0.00" 
          size="lg" 
          class="w-full font-medium"
        >
          <template #leading>
            <span class="text-gray-400 sm:text-sm">$</span>
          </template>
        </UInput>
        <p class="text-[10px] text-gray-400 mt-4 font-mono uppercase tracking-widest">{{ priceKey }}</p>
      </div>
    </div>

    <div class="mt-8 flex flex-col xl:flex-row xl:items-end gap-6 p-5 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
      <div class="flex items-end gap-3 flex-1">
        <UFormField label="Standard Field" class="flex-1">
          <USelect
            v-model="draft.addPresetKey"
            :items="presetOptions"
            :disabled="!presetOptions.length"
            placeholder="Select size..."
            size="lg"
            class="w-full"
          />
        </UFormField>
        <UButton
          color="primary"
          variant="soft"
          size="lg"
          :disabled="!draft.addPresetKey"
          @click="emit('addPreset')"
        >
          Add
        </UButton>
      </div>

      <div class="flex items-end gap-3 flex-1">
        <UFormField label="Custom Field" class="flex-1">
          <UInput v-model="draft.newCustomKey" placeholder="e.g. party_size" size="lg" class="w-full" />
        </UFormField>
        <UButton color="neutral" variant="soft" size="lg" @click="emit('addCustom')">Add Custom</UButton>
      </div>
    </div>
  </div>
</template>
