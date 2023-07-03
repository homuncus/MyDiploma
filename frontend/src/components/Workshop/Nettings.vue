<template>
  <div v-for="production in props.productions" :key="production.id" :class="[`border-l-4 mb-4`, {
    'border-green-500': production.completed,
    'border-orange-500': isUrgent(production),
    'border-red-500': isPastDue(production),
    'border-blue-500': !production.completed && !isUrgent(production) && !isPastDue(production)
  }]">
    <div class="flow-root">
      <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
        <li class="p-3 sm:py-4 hover:bg-blue-200 dark:hover:bg-zinc-800 transition rounded-r-xl">
          <div class="flex items-center space-x-4">
            <div class="min-w-0 pr-4 border-r border-zink-800 dark:border-slate-300">
              <div class="text-sm font-bold text-gray-900 truncate dark:text-white">
                <router-link :to="{ name: 'guide', params: { slug: production.netting.type.slug } }">{{
                  production.netting.type.name }}</router-link> using {{ production.material.name }}
              </div>
              <div class="text-sm text-gray-500 truncate dark:text-gray-400">
                Chief: <router-link :to="{ name: 'user', params: { username: production.chief.username } }">{{
                  production.chief.username }}</router-link>
              </div>
              <div class="flex text-sm text-gray-500 dark:text-gray-400 gap-2">
                Status:
                <Badge color="blue" v-if="!production.completed">In progress</Badge>
                <Badge color="green" v-else>Done</Badge>

                <Badge color="red" v-if="isPastDue(production)">Past due {{
                  dayJs(production.due_date).fromNow() }}</Badge>
                <Badge color="orange" v-else-if="isUrgent(production)">Urgent
                  <font-awesome-icon class="ml-1" :icon="faExclamationCircle" />
                </Badge>
              </div>
              <div class="flex text-sm text-gray-500 dark:text-gray-400 gap-2"
                :title="dayJs(production.due_date).fromNow()">
                Due:
                <p class="font-bold text-gray-900 dark:text-white">
                  {{ dayJs(production.due_date).format('MMMM D, YYYY') }}
                </p>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-bold text-gray-900 truncate dark:text-white">
                Characteristics:
              </div>
              <div class="text-sm text-gray-500 truncate dark:text-gray-400">
                Color: {{ production.netting.color }}
              </div>
              <div class="text-sm text-gray-500 truncate dark:text-gray-400">
                Size: {{ production.netting.size }}
              </div>
              <div class="flex gap-1 text-sm text-gray-500 truncate dark:text-gray-400">
                Participants:
                <router-link v-for="(user, index) in production.users" :key="user.id"
                  :to="{ name: 'user', params: { username: user.username } }" class="flex">
                  <div v-if="index > 0">,</div>
                  {{ user.username }}
                </router-link>
                <div v-if="production.users.length === 0">---</div>
              </div>
            </div>
            <div class="flex flex-col gap-2 items-end text-base font-semibold text-gray-900 dark:text-white">
              <div>
                <el-button type="success" @click="joinNetting(production)" :loading="joining"
                  :disabled="joinButtonBlocked(production)">Join</el-button>
              </div>
              <div v-if="isChiefOf(production)">
                <el-button type="primary" @click="openSureDialogFor(production)"
                  :disabled="production.completed">Complete</el-button>

                <el-dialog v-model="sureDialogOpen" title="Are you sure?" width="30%">
                  <span class="text-lg">Is the netting of type {{ production.netting.type.name }}, color {{
                    production.netting.color }} and size {{ production.netting.size }} done?</span>
                  <template #footer>
                    <el-button @click="sureDialogOpen = false">Cancel</el-button>
                    <el-button type="primary" @click="completeProduction()">
                      Confirm
                    </el-button>
                  </template>
                </el-dialog>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <el-empty class="text-center font-bold" v-if="props.productions.length === 0" description="No data" />
  <!-- {{ productions }} -->
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { type Production } from 'nets-types'
import Badge from '@/components/Badge.vue'
import { dayJs, processAxios } from '@/services';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { useUserStore } from '@/stores';

const userStore = useUserStore()

const joining = ref(false)
const completing = ref(false)
const sureDialogOpen = ref(false)
const selectedProd = ref<Production>()

const props = defineProps({
  productions: {
    type: Array<Production>,
    required: true
  },
})

const isUrgent = (prod: Production) => {
  const dayDiff = dayJs(prod.due_date).diff(Date.now(), 'days')
  return dayDiff <= 3 && dayDiff >= 0 && !prod.completed
}

const isPastDue = (prod: Production) => {
  return dayJs(prod.due_date).diff(Date.now(), 'days') < 0 && !prod.completed
}

const isChiefOf = (prod: Production) => {
  return userStore.user.id === prod.chief.id
}

const isMemberOf = (prod: Production) => {
  return prod.users.map(user => user.id).includes(userStore.user.id)
}

const joinButtonBlocked = (prod: Production): boolean => {
  return isChiefOf(prod) || isMemberOf(prod) || prod.completed
}

const joinNetting = async ({ id }: Production) => {
  joining.value = true
  await processAxios(async (axios) => {
    await axios.post(`/productions/${id}/users`)
  }, {
    successCb: (msg) => {
      msg.success({ message: 'And now, go knit a net!' })
    }
  })
  joining.value = false
}

const completeProduction = async () => {
  completing.value = true
  await processAxios(async (axios) => {
    await axios.patch(`/productions/${selectedProd.value?.id}`, {
      completed: true
    })
  }, {
    successCb: (msg) => {
      msg.success({ message: 'Fine job for AFU!' })
    }
  })
  if (selectedProd.value)
    selectedProd.value.completed = true
  completing.value = false
}

const openSureDialogFor = (prod: Production) => {
  selectedProd.value = prod
  sureDialogOpen.value = true
}
</script>