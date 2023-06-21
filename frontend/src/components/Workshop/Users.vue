<template>
  <div v-for="user in props.users" :key="user.id" class="border-b border-neutral-500">
    <div class="flow-root">
      <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
        <li class="p-3 sm:py-4 hover:bg-slate-300 dark:hover:bg-zinc-800 transition rounded-t-lg">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <img class="w-8 h-8 rounded-full"
                src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                :alt="`${user.username} image`">
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-900 truncate dark:text-white">
                <router-link :to="{ name: 'user', params: { username: user.username } }">
                  {{ user.username }}
                </router-link>
                <span v-if="user.id == userStore.user.id"
                  class="ml-2 bg-green-100 text-green-800 text-xs font-medium mr-2 px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                  You
                </span>
                <span v-if="user.pivot.is_manager"
                  class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                  Manager
                </span>
              </div>
              <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                <a :href="`mailto:${user.email}`">{{ user.email }}</a>
              </p>
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
  <!-- {{ users }} -->
</template>

<script lang="ts" setup>
import { type User } from 'nets-types'
import { useUserStore } from '@/stores';

const userStore = useUserStore()

const props = defineProps({
  users: {
    type: Array<User>,
    required: true
  }
})
</script>