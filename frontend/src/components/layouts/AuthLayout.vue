<template>
  <el-container id="container" class="min-h-screen justify-center">
    <el-header height="0px"></el-header>
    <div class="login flex justify-center items-center">
      <el-card>
        <button class="w-full cursor-pointer text-xl mt-4" style="flex-basis: 0;" @click="toggleDark()">
          <el-icon v-if="isDark" style="color:rgb(250, 204, 21)"><Sunny /></el-icon>
          <el-icon v-else><Moon /></el-icon>
        </button>
        <router-view></router-view>
      </el-card>
    </div>
  </el-container>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { isDark, toggleDark } from '../../composables';
import { Sunny, Moon } from '@element-plus/icons-vue'
</script>

<style lang="scss">
#container {
  background: #102a43;
  background-image: url("https://uploads.codesandbox.io/uploads/user/c3fb8e8a-35ea-4232-b5d6-0f3c5373510b/LVs7-dots.png");
  background-size: contain;
}

$teal: rgb(0, 124, 137);

.el-button--primary {
  background: $teal;
  border-color: $teal;
  width: 100%;

  &:hover,
  &.active,
  &:focus {
    background: lighten($teal, 7);
    border-color: lighten($teal, 7);
  }
}

.login .el-input__inner:hover {
  border-color: $teal;
}

.login .el-input__prefix {
  //background: rgb(238, 237, 234);
  //height: calc(100% - 2px);
  top: 1px;
  border-radius: 3px;

  .el-input__icon {
    width: 30px;
  }
}

.login .el-card {
  padding-top: 0;
  padding-bottom: 10px;
}

h2 {
  font-size: xx-large;
  font-weight: bold;
  font-family: "Open Sans";
  letter-spacing: 1px;
  font-family: Roboto, sans-serif;
  padding-bottom: 20px;
}

a {
  color: $teal;
  text-decoration: none;

  &:hover,
  &:active,
  &:focus {
    color: lighten($teal, 7);
  }
}

.login .el-card .el-card__body {
  width: 340px;
  padding-top: 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}</style>