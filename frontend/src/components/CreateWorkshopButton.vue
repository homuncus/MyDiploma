<template>
  <slot @click="dialogFormVisible = true" />

  <el-dialog v-model="dialogFormVisible" title="Apply for a new workshop">
    <el-form :model="form" :rules="validationRules">
      <el-form-item label="Name" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Address" prop="address">
        <el-input v-model="form.address" />
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <ckeditor :editor="ClassicEditor" v-model="form.description" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="danger" plain :dark="isDark" @click="dialogFormVisible = false">Cancel</el-button>
      <el-button v-loading="loading" type="primary" @click="submit">
        Confirm
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import ckeditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { isDark } from '@/composables';
import { processAxios, itemExists as notExists } from '@/services';

const dialogFormVisible = ref(false)
const loading = ref(false)

const form = reactive({
  name: '',
  description: '',
  address: ''
})

const submit = async () => {
  loading.value = true
  await processAxios(async (axios) => {
    return await axios.post('/workshops', form)
  }, {
    successCb: (msg) => {
      msg.success({ message: 'The application has been sent!' })
    }
  })
  loading.value = false
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