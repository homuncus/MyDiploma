<template>
  <el-form-item size="large">
    <el-user-search @select="onSearchSelect" />
  </el-form-item>

  <ul class="h-[32rem]" v-infinite-scroll="load" :infinite-scroll-disabled="disabled" v-loading="loading"
    element-loading-text="Loading...">
    <h2 class="my-2 mb-2 ml-4 text-lg text-gray-600 dark:text-neutral-100 font-bold">Chats</h2>
    <li v-for="chat in chats" :key="chat.id">
      <router-link :to="{ name: 'chats', params: { slug: chat.username } }"
        class="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b dark:border-neutral-600 cursor-pointer hover:bg-blue-200 dark:hover:bg-zinc-800 focus:outline-none">
        <!-- <img class="object-cover w-10 h-10 rounded-full"
          src="https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg" :alt="chat.interlocutor.username" /> -->
        <div class="w-full pb-2">
          <div class="flex justify-between">
            <span class="block ml-2 font-semibold text-gray-800 dark:text-neutral-200">
              {{ chat.username }}
            </span>
            <span class="block ml-2 text-sm font-thin text-gray-600 dark:text-neutral-400">
              {{ dayJs(chat.last_message_date).fromNow() }}</span>
          </div>
          <span class="block ml-2 text-sm text-gray-500 dark:text-gray-400 truncate">{{ chat.last_message }}</span>
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router';
import { type Chat } from 'nets-types'
import ElUserSearch from '@/components/ElUserSearch.vue';
import { processAxios, dayJs } from '@/services';
import { useUserStore } from '@/stores';

const router = useRouter()

const chats = ref<Chat[]>([])

const loading = ref(false)
const noMore = ref(false)
const disabled = computed(() => loading.value || noMore.value)

const load = async () => {
  loading.value = true
  await processAxios(async (axios) => {
    const limit = 3
    const fetched = [].concat((await axios.get(
      `/users/chats?limit=${limit}&
      offset=${chats.value.length}`)).data);

    chats.value = chats.value.concat(fetched)

    if (fetched.length < limit) {
      noMore.value = true
    }
  }, {
    serverErrorCb: (msg) => {
      msg({ message: 'Network error, please try again later!', type: 'error', showClose: true, grouping: true })
      noMore.value = true;
    }
  })
  loading.value = false
}

const onSearchSelect = (user: { value: string }) => {
  router.push({ name: 'chats', params: { slug: user.value } })
}
</script>