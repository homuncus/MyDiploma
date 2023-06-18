<template>
  <el-menu mode="horizontal">
    <el-menu-item index="1">Element Plus</el-menu-item>
    <el-sub-menu index="2">
      <template #title>Workspace</template>
      <el-menu-item index="2-1" @click="logout">Logout</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>Info</template>
      <el-menu-item index="3-1"><router-link :to="{ name: 'guide' }">Types of nets</router-link></el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores'
import { useRouter } from "vue-router";

const userStore = useUserStore()
const router = useRouter()
const logout = () => {
  userStore.$reset()
  router.push({ name: 'login' })
}

</script>
