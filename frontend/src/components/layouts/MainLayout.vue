<template>
  <div class="min-h-screen flex flex-col">
    <base-header />
    <div class="flex flex-1">
      <base-side />
      <div class="w-full grid grid-cols-12">
        <div class="col-span-3 py-4 overflow-auto" style="border-right: solid 1px var(--el-menu-border-color);">
          <router-view name="side" />
        </div>
        <div class="col-span-9 p-4 overflow-auto">
          <router-view name="content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router';
import BaseSide from '../BaseSide.vue';
import BaseHeader from '../BaseHeader.vue';
</script>

<style lang="scss">
.infinite-list-item {
  display: flex;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  border-radius: 0.25rem;
}

.list-item {
  display: flex;
  border-bottom: 1px solid var(--el-menu-border-color);
  &:last-child {
    border-bottom: none;
  }
}
</style>