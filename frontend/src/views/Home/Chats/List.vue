<template>
  <div class="mx-3 my-3">
    <div class="relative text-gray-600">
      <span class="absolute inset-y-0 left-0 flex items-center pl-2">
        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          viewBox="0 0 24 24" class="w-6 h-6 text-gray-300">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </span>
      <input type="search" class="block w-full py-2 pl-10 bg-gray-100 rounded outline-none" name="search"
        placeholder="Search" required />
    </div>
  </div>

  <ul class="overflow-auto h-[32rem]">
    <h2 class="my-2 mb-2 ml-2 text-lg text-gray-600">Chats</h2>
    <li v-for="chat in chats" :key="chat.id">
      <router-link :to="{ name: 'chat', params: { slug: chat.interlocutor.username } }"
        class="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none">
        <img class="object-cover w-10 h-10 rounded-full"
          src="https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg" :alt="chat.interlocutor.username" />
        <div class="w-full pb-2">
          <div class="flex justify-between">
            <span class="block ml-2 font-semibold text-gray-600">{{ chat.interlocutor.username }}</span>
            <span class="block ml-2 text-sm text-gray-600">{{ dayjs(chat.lastMessage.created_at).toNow() }}</span>
          </div>
          <span class="block ml-2 text-sm text-gray-600">{{ chat.lastMessage.message }}</span>
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router';
import { type Chat } from 'nets-types'
import processAxios from '@/services/AxiosProcessor';
import { useUserStore } from '@/stores';
import dayjs from '@/services/DayJs'

const userStore = useUserStore()
const chats = ref<Chat[]>([])

const loading = ref(false)
const noMore = ref(false)
const disabled = computed(() => loading.value || noMore.value)
const search = ref('')

const load = async () => {
  loading.value = true
  await processAxios(async (axios) => {
    const limit = 3
    const fetched = [].concat((await axios.get(
      `/users/${userStore.user.id}/chats?limit=${limit}&
      offset=${chats.value.length || 0}
      ${search.value ? `&search=${search.value}` : ''}`)).data);

    chats.value = chats.value.concat(fetched)

    if (fetched.length < limit) {
      noMore.value = true
    }
  })
  loading.value = false
}
</script>