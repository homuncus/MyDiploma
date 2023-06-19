<template>
  <ul>
    <h2 class="my-2 mb-2 ml-4 text-xl text-gray-600 dark:text-neutral-100 font-bold">Guides</h2>
    <li v-for="task in tasks" :key="task.id">
      <router-link :to="{ name: 'guide', params: { id: task.id } }"
        class="flex items-center px-3 py-4 text-md transition duration-150 ease-in-out border-b dark:border-neutral-600 cursor-pointer hover:bg-blue-200 dark:hover:bg-zinc-800 focus:outline-none">
        <el-icon class="mr-2"><Document /></el-icon>{{ task.name }}
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { type Production } from 'nets-types'
import { processAxios } from '@/services';

const tasks = ref<Production[]>([])
const loading = ref(false)

const getTasks = async () => {
  loading.value = true
  tasks.value = await processAxios(async (axios) => {
    return (await axios.get(`/users/productions?completed=false`)).data;
  }, {
    serverErrorCb: (msg) => {
      msg.error({ message: 'Server error, please try again later!' })
    }
  })
  loading.value = false
}

onMounted(() => {
  getTasks()
})

</script>