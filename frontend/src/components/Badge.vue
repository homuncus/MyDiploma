<template>
  <span :class="`bg-${color}-100 text-${color}-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-${color}-900 dark:text-${color}-300`"><slot /></span>
</template>

<script lang="ts" setup>
defineProps({
  color: {
    type: String,
    required: true,
  }
})
</script>