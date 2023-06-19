<template>
  <div
    class="w-64 bg-white dark:bg-zinc-800 max-w-xs rounded-md overflow-hidden shadow-lg hover:shadow-xl dark:shadow-zinc-600 transition duration-300 transform hover:scale-x-110 cursor-pointer">
    <div :class="['h-16 flex items-center justify-between', props.headerColorClass || 'bg-blue-400 dark:bg-blue-700']">
      <p class="mr-0 text-white text-lg pl-5">{{ props.title }}</p>
    </div>
    <div v-if="props.subtitle" class="flex justify-between px-5 pt-4 text-sm text-gray-600 dark:text-gray-300">
      <p>{{ props.subtitle }}</p>
    </div>
    <p class="py-4 text-3xl ml-5">{{ props.value }}</p>
    <!-- <hr > -->
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(['title', 'value', 'subtitle', 'headerColorClass'])
</script>