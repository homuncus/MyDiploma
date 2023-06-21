<template>

  <div v-for="material in props.materials" :key="material.id" class="border-b border-neutral-500">
    <div class="flow-root">
      <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
        <li :class="[`p-3 sm:py-4 hover:bg-slate-300 dark:hover:bg-zinc-800 transition rounded-t-lg`, { 'bg-red-200 dark:bg-red-950': material.quantity < 4 }]">
          <div class="flex items-center space-x-4">
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-900 truncate dark:text-white">
                {{ material.name }}
              </div>
              <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                Quantity: {{ material.quantity }} {{ material.quantity === 1 ? 'unit' : 'units' }}
              </p>
            </div>
            <div class="flex flex-row items-center text-base font-semibold text-gray-900 dark:text-white">
              <el-button color="#4a934a" @click="increment(material)" :loading="incrementing">
                <el-icon><Plus /></el-icon>
              </el-button>
              <el-button color="#236fba" @click="decrement(material)" :loading="decrementing">
                <el-icon><Minus /></el-icon>
              </el-button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <!-- {{ materials }} -->
</template>

<script lang="ts" setup>
import { processAxios } from '@/services';
import { type Material } from 'nets-types'
import { ref } from 'vue';
import { Plus, Minus } from '@element-plus/icons-vue'

const incrementing = ref(false)
const decrementing = ref(false)

const props = defineProps({
  materials: {
    type: Array<Material>,
    required: true
  },
  onMaterialChange: Function
})

const increment = async (material: Material) => {
  incrementing.value = true
  await processAxios(async (axios) => {
    await axios.patch(`/materials/${material.id}`, {
      quantity: material.quantity + 1
    })
  }, {
    userErrorCb: (msg) => {
      msg.error({ message: 'Something went wrong' })
    }
  })
  if (props.onMaterialChange) props.onMaterialChange()
  incrementing.value = false
}

const decrement = async (material: Material) => {
  decrementing.value = true
  if (material.quantity === 0) {
    decrementing.value = false
    return
  }
  await processAxios(async (axios) => {
    await axios.patch(`/materials/${material.id}`, {
      quantity: material.quantity - 1
    })
  }, {
    userErrorCb: (msg) => {
      msg.error({ message: 'Something went wrong' })
    }
  })
  if (props.onMaterialChange) props.onMaterialChange()
  decrementing.value = false
}

</script>