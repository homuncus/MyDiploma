<template>
  <div></div>
</template>

<script lang="ts" setup>
import processAxios from '@/services/AxiosProcessor';
import { ref, computed, onMounted, watch, Suspense } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

const activeTab = ref('')
const workshop = ref<any>({})
const show = computed(() => !!route.params.slug)
const loading = ref(false)

const getWorkshop = async () => {
  loading.value = true
  if (!show.value) {
    loading.value = false
    return false
  }
  await processAxios(async (axios) => {
    const { data } = (await axios.get(`/workshops/${route.params.slug}`))

    workshop.value = data
  }, {
    userErrorCb: () => router.push({ name: 'workshops' })

  })
  loading.value = false
}

const switchTab = (name: string) => {
  activeTab.value = name
}

onMounted(async () => {
  if (route.params.slug) await getWorkshop()
})

watch(() => route.params,
  async () => {
    await getWorkshop()
  })

</script>