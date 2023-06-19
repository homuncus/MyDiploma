<template>
  <ul>
    <h2 class="my-2 mb-2 ml-4 text-xl text-gray-600 dark:text-neutral-100 font-bold">Guides</h2>
    <li v-for="nettingType in nettingTypes" :key="nettingType.id">
      <router-link :to="{ name: 'guide', params: { slug: nettingType.slug } }"
        class="flex items-center px-3 py-4 text-md transition duration-300 ease-in-out border-b dark:border-neutral-600 cursor-pointer hover:bg-blue-200 dark:hover:bg-zinc-800 focus:outline-none">
        <el-icon class="mr-2"><Document /></el-icon>{{ nettingType.name }}
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { type NettingType } from 'nets-types'
import { processAxios } from '@/services';
import { Document } from '@element-plus/icons-vue'

const nettingTypes = ref<NettingType[]>([])
const loading = ref(false)

const getNettingTypes = async () => {
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
  getNettingTypes()
})

</script>