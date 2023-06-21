<template>
  <el-button @click="dialogFormVisible = true" plain type="success" color="#4a934a" :dark="isDark">
    Add a new netting material
    <el-icon class="ml-2" size="18">
      <CirclePlus />
    </el-icon>
  </el-button>

  <el-dialog v-model="dialogFormVisible" title="Apply for a new workshop">
    <el-form label-position="top" :model="formData" :rules="validationRules" ref="form">
      <el-form-item label="Name" prop="name">
        <el-input v-model="formData.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input type="textarea" maxlength="500" show-word-limit v-model="formData.description" />
      </el-form-item>
      <el-form-item label="Quantity" prop="quantity">
        <el-input type="number" v-model="formData.quantity" />
      </el-form-item>
      <p class="note">You may use this material while creating your nettings</p>
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
import { processAxios } from '@/services';
import type { Material } from 'nets-types';
import { CirclePlus } from '@element-plus/icons-vue';

const props = defineProps({
  workshopId: {
    type: Number,
    required: true
  },
  onSubmit: Function
})

const dialogFormVisible = ref(false)
const loading = ref(false)

const formData = reactive({
  name: '',
  description: '',
  quantity: 0,
})

const form = ref<any>()

const submit = async () => {
  loading.value = true
  if (!await form.value.validate()) {
    loading.value = false;
    return
  }
  await processAxios(async (axios) => {
    await axios.post('/materials', { ...formData, workshop_id: props.workshopId })
  }, {
    successCb: (msg) => {
      msg.success({ message: 'The material was added!' })
    },
    userErrorCb: (msg) => {
      msg.error({ message: 'Check the data and try again' })
    }
  })
  loading.value = false
  if (props.onSubmit) props.onSubmit()
  dialogFormVisible.value = false
}

const validationRules = {
  name: [
    {
      required: true,
      message: "Material name is required",
      trigger: "blur"
    }
  ],
  quantity: [
    {
      validator: (rule: any, val: any, callback: Function) => {
        if (parseInt(val) < 0) return callback(new Error('Quantity must be above 0'))
        return callback()
      }
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
}
</style>