<template>
  <el-empty description="Select netting guide" v-if="!route.params.slug"></el-empty>
  <div v-else v-loading="loading">
    <div class="text-2xl mb-3">{{ nettingType?.name }}</div>
    <div v-html="nettingType?.description || 'Admin didn\'t provide any description for this net type'" />
  </div>
</template>

<script lang="ts" setup>
import processAxios from '@/services/AxiosProcessor';
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { type NettingType } from 'nets-types'

const route = useRoute()
const router = useRouter()

const nettingType = ref<NettingType>()
const show = computed(() => !!route.params.slug)
const loading = ref(false)

const getGuide = async () => {
  loading.value = true
  if (!show.value) {
    loading.value = false
    return false
  }
  await processAxios(async (axios) => {
    const { data } = await axios.get(`/nettings/types/${route.params.slug}`)

    nettingType.value = data
  }, {
    userErrorCb: () => router.push({ name: 'guide' })
  })
  loading.value = false
}

// const switchTab = (name: string) => {
//   activeTab.value = name
// }

onMounted(async () => {
  if (route.params.slug) await getGuide()
})

watch(() => route.params,
  async () => {
    await getGuide()
  })

</script>