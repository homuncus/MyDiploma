<template>
  <div></div>
  <el-empty v-if="!show || !workshop" description="Select a workshop" />
  <div v-else v-loading="loading" class="h-full">
    <div class="mb-10">
      <p class="text-5xl font-bold text-blue-800 dark:text-white">{{ workshop.name }}</p>
      <p class="text-slate-800 dark:text-slate-400">
        <a :href="`http://maps.google.com/?q=${workshop.address}`">{{ workshop.address }}</a>
      </p>
    </div>
    <div class="py-4 border-y border-neutral-400 max-h-40 overflow-y-auto">
      {{ workshop.description }}
    </div>
    <div class="my-4">
      <el-tabs v-model="activeTab">
        <el-tab-pane lazy label="Summary" name="summary">
          <div class="container flex flex-col lg:flex-row items-start justify-around mx-auto px-4 pb-20 pt-4 w-3/4">
            <stats-card @click="switchTab('users')" title="Participants" subtitle="TOTAL" :value="workshop.users.length || 0"></stats-card>
            <stats-card @click="switchTab('nettings')" title="Nettings" subtitle="TOTAL" :value="workshop.productions.length || 0"></stats-card>
            <stats-card @click="switchTab('tasks')" title="Nettings" subtitle="In progress"
              :value="workshop.productions.filter((prod: any) => !prod.completed).length || 0"></stats-card>
          </div>
        </el-tab-pane>
        <el-tab-pane lazy label="Nettings" name="nettings">
          <el-form-item v-if="workshop.is_user_manager">
            <el-button plain type="success" color="#4a934a" :dark="isDark">
              Make a new netting <el-icon class="ml-2" size="18"><CirclePlus /></el-icon>
            </el-button>
          </el-form-item>
          <workshop-nettings :productions="workshop.productions" />
        </el-tab-pane>
        <el-tab-pane lazy label="Tasks" name="tasks">
          <workshop-nettings :productions="workshop.productions.filter((prod: any) => !prod.completed)" />
        </el-tab-pane>
        <el-tab-pane lazy label="Users" name="users">
          <workshop-users :users="workshop.users" />
        </el-tab-pane>
      </el-tabs>
    </div>
    {{ workshop }}
  </div>
</template>

<script lang="ts" setup>
import processAxios from '@/services/AxiosProcessor';
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StatsCard from '@/components/StatsCard.vue';
import WorkshopNettings from '@/components/Workshop/Nettings.vue';
import WorkshopUsers from '@/components/Workshop/Users.vue';
import { CirclePlus } from '@element-plus/icons-vue'
import { isDark } from '@/composables'

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