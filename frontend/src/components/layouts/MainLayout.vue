<template>
  <el-config-provider namespace="ep">
    <BaseHeader />
    <div class="flex main-container">
      <BaseSide />
      <div class="w-full py-4">
        <router-view></router-view>
      </div>
    </div>
  </el-config-provider>
</template>

<script lang="ts" setup>
import BaseSide from '../BaseSide.vue';
import BaseHeader from '../BaseHeader.vue';
</script>

<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 3px);
}
</style>