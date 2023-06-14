<template>
  <el-empty v-if="!show"></el-empty>
  <div v-else class="w-full">
    <div class="relative flex items-center p-3 border-b border-gray-300">
      <img class="object-cover w-10 h-10 rounded-full"
        src="https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg" alt="username" />
      <span class="block ml-2 font-bold text-gray-600">{{ route.params.slug }}</span>
      <span class="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3">
      </span>
    </div>
    <div class="relative w-full p-6 overflow-y-auto h-full">
      <ul class="space-y-2">
        <li v-for="message in chatMessages" :key="message.id" :class="['flex', {'justify-start': !isSenderOf(message), 'justify-end': isSenderOf(message)}]">
          <div :class="['relative', 'max-w-xl', 'px-4', 'py-2', 'text-gray-700', 'rounded', 'shadow', { 'bg-gray-100': isSenderOf(message) }]">
            <span class="block">{{ message.message }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="flex items-center justify-between w-full p-3 border-t border-gray-300">
      <button>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      <button>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      </button>
      <el-form-item :rules="{ required: true }" v-loading="sending">
        <el-input v-model="message" type="text" placeholder="Message..."
        class="block w-full py-2 pl-4 mx-3 bg-gray-100 outline-none focus:text-gray-700" name="message"
        required />
      </el-form-item>
      
      <button>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
      <button type="submit" @click="sendMessage">
        <svg class="w-5 h-5 text-gray-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20" fill="currentColor">
          <path
            d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import processAxios from '@/services/AxiosProcessor'
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores';
import { type Message } from 'nets-types'
import { clean } from 'leo-profanity'

const route = useRoute()
const { user } = useUserStore()

const chatMessages = ref<Message[]>([])
const message = ref('')
const show = computed(() => !!route.params.slug)
const loading = ref(false)
const sending = ref(false)

const getChat = async () => {
  loading.value = true
  if (!show.value) return false
  await processAxios(async (axios) => {
    const { data } = (await axios.get(`/users/${user.id}/messages/${route.params.slug}`))

    chatMessages.value = data
  })
  loading.value = false
  return true
}

const sendMessage = async () => {
  if (!message.value) return
  sending.value = true;
  const msg = clean(message.value)
  await processAxios(async (axios) => {
    await axios.post(`/messages/${route.params.slug}`, {
      message: msg
    })
  }, undefined, (msg) => {
    msg.error({ message: 'Something went wrong' })
  })
  sending.value = false;
}

const isSenderOf = (message: Message): boolean => {
  return message.sender.id === user.id
}

onMounted(async () => {
  if (route.params.slug) await getChat()
})

watch(() => route.params,
  async () => {
    await getChat()
  })

</script>