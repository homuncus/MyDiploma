<script setup lang="ts">
import { onMounted } from 'vue';
import { usePreferencesStore } from '@/stores';
import { toggleDark } from '@/composables';
onMounted(() => {
  toggleDark(usePreferencesStore().isDark)
})
</script>

<template>
  <RouterView />
</template>