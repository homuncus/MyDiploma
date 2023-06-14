<template>
  <el-form :model="formData" :rules="validationRules" size="large" class="flex flex-col" ref="form" label-position="top">
    <p class="text-2xl font-bold">Profile</p>
    <hr class="mt-2 mb-4">
    <div class="form-item-wrapper">
      <el-form-item class="mb-0" label="Username" prop="username">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <div class="note">
        <p>Your name may appear around the site where you contribute</p>
      </div>
    </div>
    <div class="form-item-wrapper">
      <el-form-item label="Bio" prop="about">
        <el-input type="textarea" maxlength="300" show-word-limit v-model="formData.about"></el-input>
      </el-form-item>
      <div class="note">
        <p>Tell everyone about you</p>
      </div>
    </div>
    <div class="form-item-wrapper">
      <el-form-item label="Pronouns" prop="pronouns">
        <el-select v-model="formData.pronouns">
          <el-option v-for="pronouns in pronounces" :key="pronouns.id" :value="pronouns.value || '-'">{{ pronouns.value ||
            'Don\'t specify' }}</el-option>
          <el-input v-model="formData.pronouns" clearable placeholder="Custom"></el-input>
        </el-select>
      </el-form-item>
    </div>
    <div class="form-item-wrapper">
      <el-button color="#4a934a" size="default" @click="submit" v-loading="loading" plain :dark="isDark">Save</el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { isDark } from '@/composables';
import { processAxios, itemExistsExcept as notExistsExcept } from '@/services';
import { useUserStore } from '@/stores';
import { ref, reactive } from 'vue';

const userStore = useUserStore()
const { user } = userStore
const loading = ref(false)

const formData = reactive({
  username: user.username,
  about: user.about,
  pronouns: user.pronouns
})

const form = ref<any>(null)

const submit = async () => {
  loading.value = true
  let valid = form.value.validate();
  if (!valid) { 
    loading.value = false  
    return
  }
  await processAxios(async (axios) => {
    await axios.patch(`/users/${user.id}`, formData)
  }, (msg) => {
    msg.success({ message: 'Successfully updated your info!' })
    userStore.$patch({ user: formData })
  },
    (msg) => { msg.error({ message: 'Error. Check the data.' }) })
  loading.value = false
}

const validationRules = {
  username: [
    {
      validator: (rule: any, value: any, callback: Function) => {
        if (!value) {
          return callback(new Error('Username is required'))
        }

        // notExistsExcept('users', 'username', value, user.username, callback)
      },
      trigger: 'blur'
    }
  ]
}

const pronounces = [
  { value: '' },
  { value: 'they/them' },
  { value: 'she/her' },
  { value: 'he/him' },
].map((val, id) => { return { ...val, id } })
</script>

<style scoped>
.el-form-item {
  margin-bottom: 0
}

.note {
  color: #909399;
  font-size: 12px;
  margin-top: 0;
}

.el-form-item__label {
  margin-bottom: 0;
}

.form-item-wrapper {
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}
</style>