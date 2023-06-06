<template>
  <el-menu mode="horizontal">
    <el-menu-item index="1">Element Plus</el-menu-item>
    <el-sub-menu index="2">
      <template #title>Workspace</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="3" disabled>Info</el-menu-item>
    <el-menu-item index="4">Orders</el-menu-item>
    <el-menu-item index="5" class="h-full" @click="toggleDark()">
      <button class="border-none bg-transparent cursor-pointer">
        <el-icon v-if="isDark" style="color:rgb(250 204 21); margin-right: 0;"><Sunny /></el-icon>
        <el-icon v-else style="color:rgb(21, 25, 150); margin-right: 0;"><Moon /></el-icon>
      </button>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { toggleDark, isDark } from "@/composables";
import { Sunny, Moon } from '@element-plus/icons-vue'
</script>
