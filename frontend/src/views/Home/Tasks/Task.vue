<template>
  <el-empty description="Select a task" v-if="!route.params.id"></el-empty>
  <div v-else v-loading="loading" class="text-lg">
    <div>
      <div class="text-2xl mb-3 font-bold">ToDo: {{ task?.netting.type.name }}</div>
      <div class="text-lg text-neutral-200 dark:text-zinc-800 pb-3 border-b" :title="dayJs(task?.due_date).fromNow()">Due:
        {{ dayJs(task?.due_date).format('MMMM D, YYYY') }}</div>
    </div>
    <div>
      <p class="text-xl italic">Netting:</p>
      <p>Color: {{ task?.netting.color }}</p>
      <p>Size: {{ task?.netting.size }}</p>
      <p>Where:
        <router-link :to="{ name: 'workshops', params: { slug: task?.workshop.slug } }">
          {{ task?.workshop.name }}
        </router-link>
      </p>
      <div class="flex-1 min-w-0 text-sm">
        Chief:
        <div class="font-medium text-gray-900 truncate dark:text-white">
          <router-link :to="{ name: 'user', params: { username: task?.chief.username } }">
            {{ task?.chief.username }}
          </router-link>
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