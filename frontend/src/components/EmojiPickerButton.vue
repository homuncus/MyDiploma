<template>
  <el-popover placement="bottom" ref="popover" :width="380" trigger="click">
    <template #reference>
      <button @click="showEmojis = !showEmojis">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </template>
    <template v-slot:default>
      <Picker v-if="showEmojis" :data="emojiIndex" @select="selectEmoji" class="bg-black" />
    </template>
  </el-popover>
</template>

<script lang="ts" setup>
import { ref, defineModel } from 'vue'
import data from "emoji-mart-vue-fast/data/all.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";

import { Picker, EmojiIndex } from "emoji-mart-vue-fast";

let emojiIndex = new EmojiIndex(data);

const showEmojis = ref(false)

const input = defineModel<string>('input', { default: '' })

const selectEmoji = (emoji: any) => {
  input.value += emoji.native
}
</script>