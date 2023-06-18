<template>
<ul>
  <li v-for="nettingType in nettingTypes" :key="nettingType.id" class="border-b border-zinc-500 py-2">
    {{ nettingType.name }}
  </li>
</ul>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { type NettingType } from 'nets-types'
import { processAxios } from '@/services';

const nettingTypes = ref<NettingType[]>([])
const loading = ref(false)

const load = async () => {
  loading.value = true
  nettingTypes.value = await processAxios(async (axios) => {
    return (await axios.get(`/nettings/types`)).data;
  }, { 
    serverErrorCb: (msg) => {
      msg.error({ message: 'Server error, please try again later!' })
    }
  })
  loading.value = false
}

onMounted(() => {
  load()
})

</script>