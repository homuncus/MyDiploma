<template>
  <div v-infinite-scroll="load" class="m-4" :infinite-scroll-disabled="disabled">
    <div v-for="workshop in workshops" :key="workshop.id" class="infinite-list-item p-2">
      <div class="m-4">
        {{ workshop.name }}
      </div>
    </div>
  </div>
  <p v-if="loading" class="text-center font-bold">Loading...</p>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import processAxios from '@/services/AxiosProcessor';

interface Workshop {
  id: number,
  name: string,
  address: string,
  users_count: string
}

const workshops = ref<Workshop[]>([])
const loading = ref(false)
const noMore = ref(false)
const disabled = computed(() => loading.value || noMore.value)

const load = async () => {
  loading.value = true
  setTimeout(async () => {
    await processAxios(async (axios) => {
      const limit = 3
      const fetched = [].concat((await axios.get(`/workshops?limit=${limit}&offset=${workshops.value.length}`)).data);
      workshops.value = workshops.value.concat(fetched)

      if (fetched.length < limit) {
        noMore.value = true
      }
    })
    
    loading.value = false
  }, 1000)
}
</script>

<style>
.infinite-list-item {
  display: flex;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  border-radius: 0.25rem;
}

</style>