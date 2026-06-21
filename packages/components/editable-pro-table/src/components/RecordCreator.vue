<script setup lang="ts">
import { computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { RecordCreatorProps } from '../editable-pro-table'

const props = defineProps<{
  recordCreatorProps: RecordCreatorProps
  size?: '' | 'large' | 'default' | 'small'
}>()

const initializedButtonProps = computed(() => {
  const { size, recordCreatorProps: { buttonProps = {} } } = props

  return {
    plain: true,
    ...buttonProps,
    size,
  }
})
</script>

<template>
  <el-button
    class="btn-add"
    :icon="Plus"
    :style="recordCreatorProps.style"
    v-bind="initializedButtonProps"
  >
    {{ recordCreatorProps.creatorButtonText }}
  </el-button>
</template>

<style lang="less" scoped>
.btn-add {
  width: 100%;
  margin: 10px 0;
  border-style: dashed;
}
</style>
