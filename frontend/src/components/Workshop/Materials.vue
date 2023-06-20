<template>

  <div v-for="material in props.materials" :key="material.id" class="border-b border-neutral-500">
    <div class="flow-root">
      <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
        <li :class="[`p-3 sm:py-4 hover:bg-slate-300 dark:hover:bg-zinc-800 transition rounded-t-lg`, { 'bg-red-200 dark:bg-red-950': material.quantity < 4 }]">
          <div class="flex items-center space-x-4">
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-900 truncate dark:text-white">
                {{ material.name }}
              </div>
              <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                Quantity: {{ material.quantity }}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>

  {{ materials }}
</template>

<script lang="ts" setup>
import { type Material } from 'nets-types'

const props = defineProps({
  materials: {
    type: Array<Material>,
    required: true
  }
})

</script>