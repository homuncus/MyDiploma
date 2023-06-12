<template>
  <el-empty v-if="!show" description="Select a workshop" />
  <div v-else>
    {{ workshop }}
  </div>
</template>

<script lang="ts" setup>
import processAxios from '@/services/AxiosProcessor';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { type Workshop } from 'nets-types'

const route = useRoute()
const { slug } = route.params
const show = computed(() => !!slug)
const workshop = ref<any>({})

const getWorkshop = async () => {
  if (!show.value) return {}
  await processAxios(async (axios) => {
    const { data } = (await axios.get(`/workshops/${slug}`))
    workshop.value = data
  })
}

onMounted(async () => {
  getWorkshop()
})

</script>