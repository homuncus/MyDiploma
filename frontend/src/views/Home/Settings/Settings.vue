<template>
  <el-empty v-if="!show" description="Select a category" />
  <div v-else class="h-full">
    <Profile v-if="route.params.slug === 'profile'" />
    <Account v-else-if="route.params.slug === 'account'" />
    <Appearance v-else-if="route.params.slug === 'appearance'" />
    <p v-else>Error: no such page</p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import Profile from './ProfilePage.vue'
import Appearance from './AppearancePage.vue'
import Account from './AccountPage.vue'
import { useRoute } from 'vue-router';

const route = useRoute()

const show = computed(() => !!route.params.slug)
// const settingsPage = ref<Component>()

// watch(() => route.params, 
// ({ slug }) => {
//   const slugUpperFirst = slug[0].toUpperCase() + slug.slice(1)
//   settingsPage.value = import(`./${slugUpperFirst}Page.vue`)
// })
</script>