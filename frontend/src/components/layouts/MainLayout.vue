<template>
  <div class="min-h-screen flex flex-col">
    <base-header />
    <div class="flex flex-1">
      <base-side />
      <div class="w-full grid grid-cols-12">
        <div class="col-span-3 py-4 overflow-auto" style="border-right: solid 1px var(--el-menu-border-color);">
          <router-view name="side" />
        </div>
        <div class="col-span-9 py-4 overflow-auto">
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