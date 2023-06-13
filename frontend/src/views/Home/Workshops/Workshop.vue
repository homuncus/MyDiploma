<template>
  <el-empty v-if="!show" description="Select a workshop" />
  <div v-else v-loading="loading" class="h-full">
    <h1>{{ workshop.name }}</h1>
    {{ workshop }}
  </div>
</template>

<script lang="ts" setup>
import processAxios from '@/services/AxiosProcessor';
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const workshop = ref<any>({})
const show = computed(() => !!route.params.slug)
const loading = ref(false)

const getWorkshop = async () => {
  loading.value = true
  if (!show.value) return false
  await processAxios(async (axios) => {
    const { data } = (await axios.get(`/workshops/${route.params.slug}`))

    workshop.value = data
  })
  loading.value = false
}

onMounted(async () => {
  if (route.params.slug) await getWorkshop()
})

watch(() => route.params,
  async () => {
    await getWorkshop()
  })

</script>