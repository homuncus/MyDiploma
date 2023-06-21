<template>
  <h2 class="my-2 ml-4 text-xl text-gray-600 dark:text-neutral-100 font-bold">Tasks ({{ [...tasksWhereChief, ...tasksWhereContributor].length }})</h2>
  <el-tabs stretch>
    <el-tab-pane label="Manager" name="manager">
      <ul>
        <h2 class="my-2 mb-2 ml-4 text-lg text-gray-600 dark:text-neutral-100 font-bold">You are managing:</h2>
        <li v-for="task in tasksWhereChief" :key="task.id">
          <router-link :to="{ name: 'tasks', params: { id: task.id } }"
            class="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b dark:border-neutral-600 cursor-pointer hover:bg-blue-200 dark:hover:bg-zinc-800 focus:outline-none">
            <div class="w-full pb-2">
              <div class="flex justify-between">
                <span class="block ml-2 font-semibold text-gray-800 dark:text-neutral-200">
                  {{ task.netting.type.name }} using {{ task.material.name }} in {{ task.workshop.name }}
                </span>
                <span class="block ml-2 text-sm font-thin text-gray-600 dark:text-neutral-400">
                  Due {{ dayJs(task.due_date).fromNow() }}</span>
              </div>
              <span class="block ml-2 text-sm text-gray-500 dark:text-gray-400 truncate">Participants: {{
                task.users.length + 1 }}</span>
            </div>
          </router-link>
        </li>
        <li v-if="tasksWhereChief.length === 0" class="text-center">None</li>
      </ul>
    </el-tab-pane>
    <el-tab-pane label="Contributor" name="contributor">
      <ul>
        <h2 class="my-2 mb-2 ml-4 text-lg text-gray-600 dark:text-neutral-100 font-bold">You are contributing:</h2>
        <li v-for="task in tasksWhereContributor" :key="task.id">
          <router-link :to="{ name: 'tasks', params: { id: task.id } }"
            class="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b dark:border-neutral-600 cursor-pointer hover:bg-blue-200 dark:hover:bg-zinc-800 focus:outline-none">
            <div class="w-full pb-2">
              <div class="flex justify-between">
                <span class="block ml-2 font-semibold text-gray-800 dark:text-neutral-200">
                  {{ task.netting.type.name }} using {{ task.material.name }} in {{ task.workshop.name }}
                </span>
                <span class="block ml-2 text-sm font-thin text-gray-600 dark:text-neutral-400">
                  Due {{ dayJs(task.due_date).fromNow() }}</span>
              </div>
              <span class="block ml-2 text-sm text-gray-500 dark:text-gray-400 truncate">Participants: {{
                task.users.length +
                1 }}</span>
            </div>
          </router-link>
        </li>
        <li v-if="tasksWhereContributor.length === 0" class="text-center">None</li>
      </ul>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { type Production } from 'nets-types'
import { processAxios } from '@/services';
import { useUserStore } from '@/stores';
import { dayJs } from '@/services';
// import {  } from '@element-plus/icons-vue'

const userStore = useUserStore()
const tasksWhereChief = ref<Production[]>([])
const tasksWhereContributor = ref<Production[]>([])
const loading = ref(false)

const getTasks = async () => {
  loading.value = true
  const data = await processAxios(async (axios) => {
    return (await axios.get(`/users/productions?completed=false`)).data;
  }, {
    serverErrorCb: (msg) => {
      msg.error({ message: 'Server error, please try again later!' })
    }
  }) as Production[]

  tasksWhereChief.value = data.filter(task => task.chief.id === userStore.user.id)
  tasksWhereContributor.value = data.filter(task => task.chief.id !== userStore.user.id)

  loading.value = false
}

onMounted(() => {
  getTasks()
})

</script>