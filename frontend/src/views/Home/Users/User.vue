<template>
  <div class="p-6 sm:p-12 dark:text-gray-100">
    <div class="flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row">
      <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
        :alt="`${user?.username}'s avatar'`"
        class="self-center flex-shrink-0 w-24 h-24 border rounded-full md:justify-self-start dark:bg-gray-500 dark:border-gray-700">
      <div class="flex flex-col">
        <h4 class="text-lg font-semibold text-center md:text-left">{{ user?.username }}</h4>
        <p class="dark:text-gray-400">{{ user?.about || 'This user didn\'t write anything about himself' }}</p>
      </div>
    </div>
    <div class="mt-5 flex gap-4">
      <el-form-item>
        <router-link :to="{ name: 'chats', params: { slug: user?.username } }">
          <el-button type="primary"> <el-icon class="mr-3" size="20">
              <Message />
            </el-icon> Send message</el-button>
        </router-link>
      </el-form-item>
      <el-form-item>
        <el-button type="success"> <el-icon class="mr-3" size="20">
            <UserIcon />
          </el-icon> Send friend request</el-button>
      </el-form-item>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router'
import { type User } from 'nets-types'
import { processAxios } from '@/services'
import { Message, User as UserIcon } from '@element-plus/icons-vue'

const route = useRoute()

const user = ref<User>()

const getUser = async (username: string) => {
  user.value = await processAxios(async (axios) => {
    return (await axios.get(`users/findBy/username?value=${username}`)).data
  })
  console.log(user.value);

}

onMounted(() => {
  getUser(route.params.username as string)
})

watch(() => route.params,
  ({ username }) => {
    getUser(username as string)
  })

</script>