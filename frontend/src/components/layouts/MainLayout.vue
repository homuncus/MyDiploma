<template>
  <div class="min-h-screen max-h-screen">
    <BaseHeader />
    <div class="flex">
      <BaseSide />
      <div class="w-full py-4">
        <router-view></router-view>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import BaseSide from '../BaseSide.vue';
import BaseHeader from '../BaseHeader.vue';
</script>