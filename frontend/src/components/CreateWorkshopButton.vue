<template>
  <el-button @click="dialogFormVisible = true" type="success" plain :dark="isDark" class="mx-4">
    Apply for a new workshop
    <el-icon class="ml-2">
      <Document />
    </el-icon>
  </el-button>

  <el-dialog v-model="dialogFormVisible" title="Apply for a new workshop">
    <el-form label-position="top" :model="formData" :rules="validationRules" ref="form">
      <el-form-item label="Name" prop="name">
        <el-input v-model="formData.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Address" prop="address">
        <el-input v-model="formData.address" />
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input type="textarea" maxlength="500" show-word-limit v-model="formData.description" />
      </el-form-item>
      <p class="note">Administrators will review your application</p>
    </el-form>
    <template #footer>
      <el-button type="danger" @click="dialogFormVisible = false">Cancel</el-button>
      <el-button :loading="loading" type="primary" @click="submit">
        Confirm
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { isDark } from '@/composables';
import { processAxios, itemExists as notExists } from '@/services';
import { Document } from '@element-plus/icons-vue'

const dialogFormVisible = ref(false)
const loading = ref(false)

const formData = reactive({
  name: '',
  description: '',
  address: ''
})

const form = ref<any>()

const submit = async () => {
  loading.value = true
  if (!await form.value.validate()) {
    loading.value = false;
    return
  }
  await processAxios(async (axios) => {
    return await axios.post('/workshops', formData)
  }, {
    successCb: (msg) => {
      msg.success({ message: 'The application has been sent!' })
    },
    userErrorCb: (msg) => {
      msg.error({ message: 'Check the data and try again' })
    }
  })
  loading.value = false
  dialogFormVisible.value = false
}

const validationRules = {
  name: [
    {
      required: true,
      message: "Workshop name is required",
      trigger: "blur"
    },
    {
      validator: (rule: any, value: any, callback: Function) => {
        notExists('workshops', 'name', value, callback)
      },
      trigger: 'blur'
    }
  ],
  address: [
    {
      required: true,
      message: "Address is required",
      trigger: "blur"
    },
  ],
  description: [
    {
      required: true,
      message: "Description is required",
      trigger: "blur"
    },
  ]
}
</script>

<style scoped lang="scss">
.el-form-item {
  margin-bottom: 18px;
}

.note {
  color: #909399;
  font-size: 14px;
  margin-top: 0;
}</style>