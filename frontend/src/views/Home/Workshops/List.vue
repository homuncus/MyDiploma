<template>
  <el-form-item size="large">
    <el-input type="text" class="mx-4" @change="doSearch" :prefix-icon="Search" v-model="search" clearable placeholder="Search" />
  </el-form-item>
  <el-form-item >
    <create-workshop-button />
  </el-form-item>
    <ul
      v-infinite-scroll="load"
      class="m-4"
      :infinite-scroll-disabled="disabled"
      v-loading="loading"
      element-loading-text="Loading...">
      <li v-for="workshop in workshops" :key="workshop.id">
        <router-link :to="{ name: 'workshops', params: { slug: workshop.slug } }" 
        class="flex items-center px-3 py-2 text-lg transition duration-150 ease-in-out border-b dark:border-neutral-600 cursor-pointer hover:bg-blue-200 dark:hover:bg-zinc-800 focus:outline-none">
          <div class="w-full pb-2">
            <div class="flex justify-between">
              <span class="block ml-2 font-semibold text-gray-800 dark:text-neutral-200">
                {{ workshop.name }}
              </span>
            </div>
            <span class="block ml-2 text-sm text-gray-500 dark:text-gray-400 truncate">Members: 
              {{ workshop.users_count }}
            </span>
          </div>
        </router-link>
      </li>
    </ul>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { type Workshop } from 'nets-types'
import { Search } from '@element-plus/icons-vue'
import processAxios from '@/services/AxiosProcessor';
import CreateWorkshopButton from '@/components/CreateWorkshopButton.vue';
import { isDark } from '@/composables';

const workshops = ref<Workshop[]>([])
const loading = ref(false)
const noMore = ref(false)
const disabled = computed(() => loading.value || noMore.value)
const search = ref('')

const createWorkshopModalVisible = ref(false)

const load = async () => {
  loading.value = true
  await processAxios(async (axios) => {
    const limit = 3
    const fetched = [].concat((await axios.get(
      `/workshops?limit=${limit}&offset=${workshops.value.length || 0}&search=${search.value}`)).data);
    workshops.value = workshops.value.concat(fetched)

    if (fetched.length < limit) {
      noMore.value = true
    }
  }, { 
    serverErrorCb: (msg) => {
      msg.error({ message: 'Server error, please try again later!' })
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
