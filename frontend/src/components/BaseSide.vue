<template>
  <el-menu
    :default-active="activeIndex"
    :collapse="isCollapse"
  >
    <!-- <el-sub-menu index="1">
      <template #title>
        <router-link to="workshops">
          <el-icon><house /></el-icon>
        </router-link>
        <span>Workshops</span>
      </template>
      <el-menu-item-group>
        <template #title><span>Group One</span></template>
        <el-menu-item index="1-1">item one</el-menu-item>
        <el-menu-item index="1-2">item two</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="1-3">item three</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title><span>item four</span></template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu> -->
    <router-link :to="{ name: 'workshops' }">
      <el-menu-item index="1">
        <el-icon><house /></el-icon>
        <template #title>Workshops</template>
      </el-menu-item>
    </router-link>
    <router-link :to="{ name: 'tasks' }">
      <el-menu-item index="2">
        <el-icon><document /></el-icon>
        <template #title>Tasks</template>
      </el-menu-item>
    </router-link>
    <router-link :to="{ name: 'settings' }">
      <el-menu-item index="3">
        <el-icon><setting /></el-icon>
        <template #title>Settings</template>
      </el-menu-item>
    </router-link>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router'
import {
  House,
  Document,
  Menu as IconMenu,
  Setting,
} from "@element-plus/icons-vue";

const route = useRoute()

const isCollapse = ref(true);
const activeIndex = ref(1)

const findActive = (): number => {
  const index = route.matched[1].meta.activeIndex as number
  if (!index) return 1
  return index
}
onMounted(() => {
  activeIndex.value = findActive()
})
</script>