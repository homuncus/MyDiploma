<template>
  <el-empty v-if="!show" description="Select a chat"></el-empty>
  <div v-else class="w-full" style="height: calc(100% - 7rem)">
    <div class="relative flex items-center p-3" style="border-bottom: 1px solid var(--el-menu-border-color);">
      <img class="object-cover w-10 h-10 rounded-full"
        src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" alt="username" />
      <router-link class="block ml-2 font-bold text-gray-600 dark:text-gray-200" :to="{ name: 'user', params: { username: route.params.slug } }">{{ route.params.slug }}</router-link>
      <span class="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3">
      </span>
    </div>
    <div class="relative w-full p-6 overflow-y-auto h-full">
      <ul class="space-y-2">
        <li v-for="message in chatMessages" :key="message.id"
          :class="['flex', 'items-center', { 'justify-start': !isSenderOf(message) }, { 'justify-end': isSenderOf(message) }]">
          <div
            :class="['relative', 'max-w-xl', 'px-4', 'py-2', 'text-gray-700', 'dark:text-zinc-200', 'rounded', 'shadow', { 'bg-blue-300 dark:bg-sky-900': isSenderOf(message) }, { 'bg-gray-100 dark:bg-gray-800': !isSenderOf(message) }]">
            <span class="block">{{ message.message }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="flex items-center space-x-2 justify-between w-full p-3"
      style="border-top: 1px solid var(--el-menu-border-color)">
      <EmojiPickerButton v-model:input="message" />
      <button>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      </button>
      <el-form-item size="large" class="flex-grow" :rules="{ required: true }" v-loading="sending"
        style="margin-bottom: 0;">
        <el-input v-model="message" type="text" placeholder="Message..." @keyup.enter="sendMessage"
          class="block w-full bg-gray-100 dark:bg-inherit outline-none focus:text-gray-700" name="message" required />
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
import { processAxios } from '@/services'
import EmojiPickerButton from '@/components/EmojiPickerButton.vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores';
import { type Message } from 'nets-types'
import profanity from 'leo-profanity'
// import { Flag } from '@element-plus/icons-vue'

const route = useRoute()
const { user } = useUserStore()

const chatMessages = ref<Message[]>([])
const message = ref('')
const show = computed(() => !!route.params.slug)
const loading = ref(false)
const sending = ref(false)

const getChatMessages = async () => {
  loading.value = true
  if (!show.value) return false
  await processAxios(async (axios) => {
    const interlocutorId = (await axios.get(`/users/findBy/username?value=${route.params.slug}`)).data.id
    const { data } = await axios.get(`/users/messagesWith/${interlocutorId}`)

    chatMessages.value = data
  })
  loading.value = false
  return true
}

const sendMessage = async () => {
  if (!message.value) return
  sending.value = true;
  const msg = profanity.clean(message.value)
  await processAxios(async (axios) => {
    const interlocutorId = (await axios.get(`/users/findBy/username?value=${route.params.slug}`)).data.id
    await axios.post(`/messages/${interlocutorId}`, {
      message: msg
    })
  }, {
    userErrorCb: (msg) => {
      msg.error({ message: 'Something went wrong' })
    }
  })

  message.value = ''

  await getChatMessages()

  sending.value = false;
}

const isSenderOf = (message: Message): boolean => {
  return message.sender_username == user.username
}

// const showEmojis = ref(false)

// const onEmojiSelect = (emoji: any) => {
//   message.value += emoji.i
// }

onMounted(async () => {
  if (route.params.slug) await getChatMessages()
})

watch(() => route.params,
  async () => {
    await getChatMessages()
  })

</script>