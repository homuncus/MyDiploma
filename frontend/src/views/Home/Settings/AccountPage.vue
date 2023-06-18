<template>
  <el-form :model="formData" :rules="validationRules" size="large" class="flex flex-col" ref="form" label-position="top">
    <p class="text-2xl font-bold">Account settings</p>
    <hr class="mt-2 mb-4">
    <el-form-item class="my-2" label="Password" prop="password">
      <el-input v-model="formData.password"></el-input>
    </el-form-item>
    <el-form-item label="Confirm password" prop="confirm">
      <el-input v-model="formData.confirmPassword"></el-input>
    </el-form-item>
    <div class="form-item-wrapper">
      <el-button color="#4a934a" size="default" @click="submit" v-loading="loading" plain :dark="isDark">Save</el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { isDark } from '@/composables';
import { processAxios } from '@/services';
import { useUserStore } from '@/stores';
import { ref, reactive } from 'vue';

const userStore = useUserStore()
const { user } = userStore
const loading = ref(false)

const formData = reactive({
  password: '',
  confirmPassword: '',
})

const form = ref<any>()

const submit = async () => {
  loading.value = true
  let valid = form.value.validate();
  if (!valid) {
    loading.value = false
    return
  }
  await processAxios(async (axios) => {
    await axios.patch(`/users/${user.id}`, formData)
  }, {
    successCb: (msg) => {
      msg.success({ message: 'Successfully updated your password!' })
    },
    userErrorCb: (msg) => { msg.error({ message: 'Error. Check the data.' }) }
  })
  loading.value = false
}

const validationRules = {
  password: [
    { required: true, message: "Password is required", trigger: "blur" },
    {
      min: 5,
      message: "Password length should be at least 5 characters",
      trigger: "blur"
    }
  ],
  confirmPassword: [
    {
      validator: (rule: any, value: any, callback: Function) => {
        if (!value) {
          return callback(new Error('Password confirmation is required'))
        }
        if (value.length < 5) {
          return callback(new Error('Password length should be at least 5 characters'))
        }
        if (value !== formData.password) {
          return callback(new Error('Passwords don\'t match'))
        }
        return callback()
      },
      trigger: 'blur'
    }
  ]
}

</script>