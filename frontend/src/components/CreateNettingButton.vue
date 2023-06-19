<template>
  <el-button @click="showDialog" plain type="success" color="#4a934a" :dark="isDark">
    Make a new netting 
    <el-icon class="ml-2" size="18">
      <CirclePlus />
    </el-icon>
  </el-button>

  <el-dialog v-model="dialogFormVisible" title="New netting">
    <el-form label-position="top" :model="formData" :rules="validationRules" ref="form">
      <el-form-item label="Type">
        <el-select v-model="formData.type_id" autocomplete="off" default-first-option>
          <el-option v-for="nettingType in nettingTypes" :key="nettingType.id" :label="nettingType.name"
            :value="nettingType.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="Size" prop="size">
        <el-input v-model="formData.size" />
      </el-form-item>
      <el-form-item label="Color" prop="color">
        <el-input v-model="formData.color" />
      </el-form-item>
      <el-form-item label="Material">
        <el-select v-model="formData.material_id" autocomplete="off" default-first-option>
          <el-option v-for="material in materials" :key="material.id" :label="material.name"
            :value="material.id" />
        </el-select>
      </el-form-item>
      <p class="note">note</p>
    </el-form>
    <template #footer>
      <el-button type="danger" @click="dialogFormVisible = false">Cancel</el-button>
      <el-button v-loading="loading" type="primary" @click="submit">
        Confirm
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { isDark } from '@/composables';
import { processAxios } from '@/services';
import type { NettingType, Material } from 'nets-types';
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

const nettingTypes = ref<NettingType[]>([])
// TODO: fetch materials of the workshop, add a materials tab at workshop page
const materials = ref<Material[]>([])

const formData = reactive({
  size: '',
  color: '',
  type_id: 0,
  material_id: 0,
})

const form = ref<any>()

const submit = async () => {
  loading.value = true
  if (!await form.value.validate()) {
    loading.value = false;
    return
  }
  await processAxios(async (axios) => {
    const nettingId = (await axios.post('/nettings', {
      type_id: formData.type_id,
      size: formData.size,
      color: formData.color
    })).data.id
    await axios.post('/productions', {
      material_id: formData.material_id,
      netting_id: nettingId,
      workshop_id: props.workshopId
    })
  }, {
    successCb: (msg) => {
      msg.success({ message: 'The netting has begun!' })
    },
    userErrorCb: (msg) => {
      msg.error({ message: 'Check the data and try again' })
    }
  })
  loading.value = false
  if (props.onSubmit) props.onSubmit()
  dialogFormVisible.value = false
}

const showDialog = async () => {
  nettingTypes.value = await processAxios(async (axios) => {
    return (await axios.get('nettings/types')).data
  })
  materials.value = await processAxios(async (axios) => {
    return (await axios.get(`workshops/${props.workshopId}/materials`)).data
  })

  dialogFormVisible.value = true
}

const validationRules = {
  size: [
    {
      required: true,
      message: "Size is required",
      trigger: "blur"
    },
  ],
  color: [
    {
      required: true,
      message: "Color is required",
      trigger: "blur"
    },
  ],
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