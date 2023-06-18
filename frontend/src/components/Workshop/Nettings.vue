<template>
  <div v-for="production in productions" :key="production.id" class="border-y border-neutral-500">
    {{ production }}
  </div>

  {{ productions }}
</template>

<script lang="ts" setup>
import { type Production } from 'nets-types'

const props = defineProps({
  productions: {
    type: Array<Production>,
    required: true
  },
})

</script>