<template>
  <el-empty description="Select a task" v-if="!route.params.id"></el-empty>
  <div v-else v-loading="loading" class="text-lg">
    <div class="border-b">
      <div class="text-2xl mb-3 font-bold">To-do: {{ task?.netting.type.name }}</div>
    </div>
    <div>
      <div class="flex gap-2 min-w-0 text-md font-bold">
        Chief:
        <div class="font-medium text-gray-900 truncate dark:text-white">
          <router-link v-if="task" :to="{ name: 'user', params: { username: task?.chief.username } }">
            {{ task?.chief.username }}
          </router-link>
        </div>
      </div>
      <p class="text-4xl italic text-center">Netting</p>
      <div class="px-4 py-4 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-10">
        <div class="grid grid-cols-3 row-gap-8 lg:grid-cols-5">
          <div class="text-center">
            <p class="font-bold">Color</p>
            <h6 class="text-3xl font-bold text-deep-purple-accent-400">{{ task?.netting.color }}</h6>
          </div>
          <div class="text-center">
            <p class="font-bold">Size</p>
            <h6 class="text-3xl font-bold text-deep-purple-accent-400">{{ task?.netting.size }}</h6>
          </div>
          <div class="text-center">
            <p class="font-bold">Material</p>
            <h6 class="text-3xl font-bold text-deep-purple-accent-400">{{ task?.material.name }}</h6>
          </div>
          <div class="text-center">
            <p class="font-bold">Due</p>
            <h6 class="text-3xl font-bold text-deep-purple-accent-400">{{ dayJs(task?.due_date).format('MMMM D, YYYY') }}</h6>
          </div>
          <div class="text-center">
            <p class="font-bold">Workshop</p>
            <h6 class="text-3xl font-bold text-deep-purple-accent-400">
              <router-link :to="{ name: 'workshops', params: { slug: task?.workshop.slug } }">
                {{ task?.workshop.name }}
              </router-link>
            </h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import processAxios from '@/services/AxiosProcessor';
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { type Production } from 'nets-types'
import { dayJs } from '@/services';

const route = useRoute()
const router = useRouter()

const task = ref<Production>()
const show = computed(() => !!route.params.id)
const loading = ref(false)

const getTask = async () => {
  loading.value = true
  if (!show.value) {
    loading.value = false
    return false
  }
  await processAxios(async (axios) => {
    const { data } = await axios.get(`/productions/${route.params.id}`)

    task.value = data
  }, {
    userErrorCb: () => router.push({ name: 'tasks' })
  })
  loading.value = false
}

// const switchTab = (name: string) => {
//   activeTab.value = name
// }

onMounted(async () => {
  if (route.params.id) await getTask()
})

watch(() => route.params,
  async () => {
    await getTask()
  })

</script>