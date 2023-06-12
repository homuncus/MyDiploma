<template>
  <el-form-item size="large">
    <el-input type="text" class="mx-4" @change="doSearch" :prefix-icon="Search" v-model="search" clearable placeholder="Search" />
  </el-form-item>
    <ul
      v-infinite-scroll="load"
      class="m-4"
      :infinite-scroll-disabled="disabled"
      v-loading="loading"
      element-loading-text="Loading...">
      <li v-for="workshop in workshops" :key="workshop.id" class="infinite-list-item p-2">
        <div class="m-4">
          <router-link :to="{ name: 'workshops', params: { slug: workshop.slug } }" class="text-lg">
            {{ workshop.name }}
          </router-link>

        </div>
      </li>
    </ul>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { type Workshop } from 'nets-types'
import { Search } from '@element-plus/icons-vue'
import processAxios from '@/services/AxiosProcessor';

const workshops = ref<Workshop[]>([])
const loading = ref(false)
const noMore = ref(false)
const disabled = computed(() => loading.value || noMore.value)
const search = ref('')

const load = async () => {
  loading.value = true
  await processAxios(async (axios) => {
    const limit = 3
    const fetched = [].concat((await axios.get(
      `/workshops?limit=${limit}&
      offset=${workshops.value.length || 0}
      ${search.value ? `&search=${search.value}` : ''}`)).data);
    workshops.value = workshops.value.concat(fetched)

    if (fetched.length < limit) {
      noMore.value = true
    }
  })
  loading.value = false
}

const doSearch = () => {
  workshops.value = []
  load()
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