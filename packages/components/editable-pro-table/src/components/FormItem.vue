<script setup lang="ts">
import { computed } from 'vue'
import CustomRender from 'element-plus-pro-components/packages/base/custom-render'
import { useProLocale } from 'element-plus-pro-components/packages/locale'
import type { FormItemProps } from './form-item'

const props = defineProps<FormItemProps>()
const { t } = useProLocale()

const normalizedFormItem = computed(() => {
  const {
    renderLabel,
    valueType,
    renderField,
    fieldProps,
    fieldEvents,
    valueEnum,
    optionLoader,
    initialValue,
    colProps,
    hideInForm,
    key,
    ...keys
  } = props.formItem

  return keys
})

const normalizedFieldProps = computed(() => {
  const { valueType, fieldProps = {} } = props.formItem
  const normalized: Record<string, any> = { ...fieldProps }

  if (!normalized.placeholder) {
    switch (valueType) {
      case 'input':
        normalized.placeholder = t('elProComponents.placeholder.input')
        break
      case 'select':
      case 'cascader':
        normalized.placeholder = t('elProComponents.placeholder.select')
        break
      case 'time-picker':
        normalized.placeholder = t('elProComponents.placeholder.selectTime')
        break
      case 'date-picker':
        normalized.placeholder = t('elProComponents.placeholder.selectDate')
        break
      default:
        break
    }
  }

  return normalized
})

const normalizedFieldEvents = computed(() => {
  const { fieldEvents } = props.formItem
  if (!fieldEvents) {
    return {}
  }

  const { recordKey, form: row, index } = props
  const newEvents: Record<string, (...args: any[]) => void> = {}

  for (const eventName in fieldEvents) {
    newEvents[eventName] = (...args: any[]) =>
      fieldEvents[eventName]?.(...args, { recordKey, row, index })
  }

  return newEvents
})
</script>

<template>
  <el-form-item
    v-bind="normalizedFormItem"
    :prop="formItemProp"
    label=""
    class="editable-form-item is-editable"
  >
    <CustomRender
      v-if="formItem.renderField"
      :render="() => formItem.renderField?.({ form, formItem, recordKey, index })"
    />
    <slot
      v-else-if="formItem.valueType === 'slot'"
      :name="formItem.prop"
    />
    <component
      v-else
      :is="`el-${formItem.valueType}`"
      v-model="form[formItem.prop]"
      v-bind="normalizedFieldProps"
      v-on="normalizedFieldEvents"
    />
  </el-form-item>
</template>

<style lang="less" scoped>
.editable-form-item.is-required {
  position: relative;

  &::before {
    content: '*';
    color: #f56c6c;
    position: absolute;
    left: -8px;
  }
}

.editable-form-item {
  :deep(.el-form-item__content) {
    .el-select,
    .el-input-number,
    .el-date-editor,
    .el-cascader {
      width: 100%;
    }
  }
}
</style>
