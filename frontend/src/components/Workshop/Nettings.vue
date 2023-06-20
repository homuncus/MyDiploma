<template>
  <div v-for="production in props.productions" :key="production.id" class="border-b border-neutral-500">
    <div class="flow-root">
      <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
        <li class="p-3 sm:py-4 hover:bg-blue-200 dark:hover:bg-zinc-800 transition rounded-t-lg">
          <div class="flex items-center space-x-4">
            <div class="min-w-0 pr-4 border-r border-zink-800 dark:border-slate-300">
              <div class="text-sm font-bold text-gray-900 truncate dark:text-white">
                <router-link :to="{ name: 'guide', params: { slug: production.netting.type.slug } }">{{ production.netting.type.name }}</router-link> using {{ production.material.name }}
              </div>
              <div class="text-sm text-gray-500 truncate dark:text-gray-400">
                Chief: <router-link :to="{ name: 'user', params: { username: production.chief.username } }">{{ production.chief.username }}</router-link>
              </div>
              <div class="flex text-sm text-gray-500 dark:text-gray-400 gap-2">
                Status:
                <Badge color="blue" v-if="!production.competed">In progress</Badge>
                <Badge color="green" v-else>Done</Badge>

                <Badge color="red" v-if="dayJs(production.due_date).diff(Date.now(), 'days') < 0">Past due {{ dayJs(production.due_date).fromNow() }}</Badge>
                <Badge color="orange" v-else-if="dayJs(production.due_date).diff(Date.now(), 'days') <= 3">Urgent</Badge>
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
            </div>
            <div class="flex flex-col items-center text-base font-semibold text-gray-900 dark:text-white">
              <div></div>
              <div></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>

  {{ productions }}
</template>

<script lang="ts" setup>
import { type Production } from 'nets-types'
import Badge from '@/components/Badge.vue'
import { dayJs } from '@/services';

const props = defineProps({
  productions: {
    type: Array<Production>,
    required: true
  },
})

</script>