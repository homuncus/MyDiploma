<template>
  <el-form :model="formData" :rules="validationRules" size="large" class="flex flex-col" ref="form" label-position="top">
    <p class="text-2xl font-bold">Account settings</p>
    <hr class="mt-2 mb-4">
    <el-form-item class="my-2" label="Password" prop="password">
      <el-input v-model="formData.password" type="password" />
    </el-form-item>
    <el-form-item label="Confirm password" prop="confirmPassword">
      <el-input v-model="formData.confirmPassword" type="password" />
    </el-form-item>
    <div class="form-item-wrapper">
      <el-button color="#4a934a" size="default" @click="submit" v-loading="loading" plain :dark="isDark">Save</el-button>
    </div>
    <div class="form-item-wrapper mt-4">
      <el-button type="danger" plain :dark="isDark" @click="openSureDialog">Delete account</el-button>

                <el-dialog v-model="sureDialogOpen" title="Are you sure?" width="30%">
                  <span class="text-lg">Are you sure? This cannot be undone!</span>
                  <template #footer>
                    <el-button @click="sureDialogOpen = false">Cancel</el-button>
                    <el-button type="danger" @click="deleteAccount">
                      Confirm
                    </el-button>
                  </template>
                </el-dialog>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { isDark } from '@/composables';
import { processAxios } from '@/services';
import { useUserStore } from '@/stores';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore()
const router = useRouter()
const { user } = userStore
const loading = ref(false)

const formData = reactive({
  password: '',
  confirmPassword: '',
})

const form = ref<any>()
const sureDialogOpen = ref(false)

const submit = async () => {
  loading.value = true
  const valid = await form.value.validate();
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

const openSureDialog = () => {
  sureDialogOpen.value = true
}

const deleteAccount = async () => {
  await processAxios(async (axios) => {
    await axios.delete(`users/${user.id}`)
  }, {
    successCb: (msg) => {
      msg.success({ message: 'Account deleted' })
      userStore.$reset()
      router.push({ name: 'login' })
    }
  })
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
        if (value === '') {
          callback(new Error('Please input the password again'))
        } else if (value !== formData.password) {
          callback(new Error("Two inputs don't match!"))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

</script>