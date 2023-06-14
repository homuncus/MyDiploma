<template>
  <el-form size="large" class="flex flex-col" ref="form" label-position="top">
    <p class="text-2xl font-bold">Theme preferences</p>
    <hr class="mt-2 mb-4">
    <div class="form-item-wrapper">
      <el-form-item class="mb-0" prop="dark">
        <el-switch inactive-color="#fcc115"
          active-color="#151996"
          v-model="isDark"
          @change="toggleDark"
          class="mb-2"
          active-text="Dark"
          inactive-text="Light"
        />
      </el-form-item>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { isDark, toggleDark } from '@/composables'

</script>