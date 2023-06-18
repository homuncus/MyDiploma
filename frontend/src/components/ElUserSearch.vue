<template>
  <el-autocomplete class="mx-4 w-full" v-model="userSearch" :fetch-suggestions="querySearchAsync"
    placeholder="Search users" @select="props.select" :prefix-icon="Search" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { processAxios } from '@/services'
import { Search } from '@element-plus/icons-vue';
import { type User } from 'nets-types';
import { useUserStore } from '@/stores';

const userStore = useUserStore()

const props = defineProps({
  select: {
    type: Function
  }
})

const userSearch = ref('')

const querySearchAsync = async (queryString: string, cb: (arg: any) => void) => {
  const { data } = await processAxios(async (axios) => {
    return await axios.get(`users?search=${queryString}`)
  })

  cb((data as User[]).map(user => { return { value: user.username } })
    .filter(user => user.value !== userStore.user.username))
}

</script>