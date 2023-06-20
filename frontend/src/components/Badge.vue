<template>
  <span v-if="color === 'blue'" class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"><slot /></span>
  <span v-else-if="color === 'gray'" class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-900 dark:text-gray-300"><slot /></span>
  <span v-else-if="color === 'red'" class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"><slot /></span>
  <span v-else-if="color === 'green'" class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"><slot /></span>
  <span v-else-if="color === 'yellow'" class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300"><slot /></span>
  <span v-else-if="color === 'orange'" class="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-orange-900 dark:text-orange-300"><slot /></span>
  <span v-else-if="color === 'indigo'" class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300"><slot /></span>
  <span v-else-if="color === 'purple'" class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300"><slot /></span>
  <span v-else-if="color === 'pink'" class="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300"><slot /></span>
</template>

<script lang="ts" setup>
defineProps<{ color: 'blue' | 'gray' | 'red' | 'green' | 'yellow' | 'orange' | 'indigo' | 'purple' | 'pink' }>()
</script>