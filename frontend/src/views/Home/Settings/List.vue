<template>
  <ul class="mx-4">
    <h2 class="text-2xl font-bold m-2">Settings</h2>
    <li v-for="setting in settings" :key="setting.id" class="list-item p-2 hover:bg-slate-300 dark:hover:bg-zinc-800">
      <router-link :to="{ name: 'settings', params: { slug: setting.link } }">
      <div class="mx-4 my-1">
          <font-awesome-icon :icon="setting.icon" class="mr-2"></font-awesome-icon>
          {{ setting.name }}
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser, faTools, faBrush } from '@fortawesome/free-solid-svg-icons';

const settings = [
  {
    name: 'Profile',
    link: 'profile',
    icon: faUser
  },
  {
    name: 'Account',
    link: 'account',
    icon: faTools,
  },
  {
    name: 'Appearance',
    link: 'appearance',
    icon: faBrush
  }
].map((val, id) => { return { ...val, id } })
</script>