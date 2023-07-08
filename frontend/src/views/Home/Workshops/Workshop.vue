<template>
  <div></div>
  <el-empty v-if="!show || !workshop" description="Select a workshop" />
  <div v-else v-loading="loading" class="h-max">
    <div class="mb-6">
      <p class="text-5xl font-bold text-blue-800 dark:text-white">{{ workshop.name }}</p>
      <p class="text-slate-800 dark:text-slate-400">
        <a :href="`http://maps.google.com/?q=${workshop.address}`" target="_blank"><el-icon class="mr-1">
            <MapLocation />
          </el-icon>{{ workshop.address }}</a>
      </p>
    </div>
    <el-form-item>
      <el-button v-if="workshop.is_user_member"
        :disabled="leaveButtonBlocked()"
        :title="leaveButtonBlocked() ? 'You are the only manager' : ''"
        type="danger"
        v-loading="participationLoading" 
        @click="leaveWorkshop">
        Leave
      </el-button>
      <el-button v-else type="primary" v-loading="participationLoading" @click="joinWorkshop">Become a member</el-button>
    </el-form-item>
    <div class="py-4 border-y border-neutral-400 max-h-40 overflow-y-auto">
      {{ workshop.description }}
    </div>
    <div class="my-4">
      <el-tabs v-model="activeTab">
        <el-tab-pane lazy label="Summary" name="summary">
          <div class="container flex flex-col lg:flex-row items-start justify-around mx-auto px-4 pb-20 pt-4 w-3/4">
            <stats-card @click="switchTab('users')" title="Participants" subtitle="TOTAL"
              :value="workshop.users.length || 0"></stats-card>
            <stats-card @click="switchTab('nettings')" title="Nettings" subtitle="TOTAL"
              :value="workshop.productions.length || 0"></stats-card>
            <stats-card @click="switchTab('tasks')" title="Nettings" subtitle="In progress"
              :value="workshop.productions.filter((prod: any) => !prod.completed).length || 0"></stats-card>
          </div>
        </el-tab-pane>
        <el-tab-pane lazy label="Nettings" name="nettings">
          <el-form-item v-if="workshop.is_user_manager">
            <create-netting-button :on-submit="getWorkshop" :workshopId="workshop.id" />
          </el-form-item>
          <workshop-nettings :productions="workshop.productions" />
        </el-tab-pane>
        <el-tab-pane lazy label="Tasks" name="tasks">
          <workshop-nettings :productions="workshop.productions.filter((prod: any) => !prod.completed)" />
        </el-tab-pane>
        <el-tab-pane lazy label="Materials" name="materials" v-if="workshop.is_user_manager">
          <el-form-item>
            <create-material-button :on-submit="getWorkshop" :workshop-id="workshop.id" />
          </el-form-item>
          <workshop-materials :materials="workshop.materials" :on-material-change="getWorkshop" />
        </el-tab-pane>
        <el-tab-pane lazy label="Users" name="users">
          <workshop-users :users="workshop.users" :manager="workshop.is_user_manager" :on-submit="getWorkshop" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- {{ workshop }} -->
  </div>
</template>

<script lang="ts" setup>
import processAxios from '@/services/AxiosProcessor';
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import StatsCard from '@/components/StatsCard.vue';
import WorkshopNettings from '@/components/Workshop/Nettings.vue';
import WorkshopMaterials from '@/components/Workshop/Materials.vue';
import WorkshopUsers from '@/components/Workshop/Users.vue';
import CreateNettingButton from '@/components/CreateNettingButton.vue'
import CreateMaterialButton from '@/components/CreateMaterialButton.vue'

import { CirclePlus, MapLocation } from '@element-plus/icons-vue'
import { isDark } from '@/composables'

const route = useRoute()
const router = useRouter()

const activeTab = ref('')
const workshop = ref<any>({})
const show = computed(() => !!route.params.slug)
const loading = ref(false)
const participationLoading = ref(false)

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

const joinWorkshop = async () => {
  participationLoading.value = true
  await processAxios(async (axios) => {
    await axios.post(`/users/workshops/${workshop.value.id}`)
  }, {
    successCb: (msg) => {
      msg.success({ message: `Joined ${workshop.value.name}!` })
      workshop.value.is_user_member = true
    }
  })
  getWorkshop()
  participationLoading.value = false
}

const leaveWorkshop = async () => {
  participationLoading.value = true
  await processAxios(async (axios) => {
    await axios.delete(`/users/workshops/${workshop.value.id}`)
  }, {
    successCb: (msg) => {
      msg.success({ message: `Left ${workshop.value.name}!` })
      workshop.value.is_user_member = false
    }
  })
  getWorkshop()
  participationLoading.value = false
}

const leaveButtonBlocked = () => {
  return workshop.value.users.filter(({ pivot }: any) => pivot.is_manager).length === 1 && workshop.value.is_user_manager
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