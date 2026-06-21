<script setup lang="ts">
import { computed } from 'vue';
import type { FormItemProps } from './pro-form-item';
import CustomRender from '../../custom-render';
import { useFieldValue } from 'element-plus-pro-components/packages/composables/useFieldValue';
import { useProLocale } from 'element-plus-pro-components/packages/locale';

const props = defineProps<FormItemProps>()
const { t } = useProLocale()

// Normalize form item
const normalizedFormItem = computed(() => {
  // Filter mismatched props
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

/**
 * @description Normalized field props
 */
const normalizedFieldProps = computed(() => {
  const { valueType, fieldProps = {} } = props.formItem
  const normalized = { ...fieldProps }

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

const { fieldValue } = useFieldValue(props)
</script>

<template>
  <el-form-item v-bind="normalizedFormItem">
    <!-- Render label -->
    <!-- start -->
    <template v-if="formItem.renderLabel" #label>
      <CustomRender :render="formItem.renderLabel" />
    </template>
    <!-- end -->
    <!-- Render field -->
    <!-- start -->
    <CustomRender 
      v-if="formItem.renderField" 
      :render="() => formItem.renderField?.({ form, formItem })" 
    />
    <!-- end -->
    <!-- slot -->
    <!-- start -->
    <slot v-else-if="formItem.valueType === 'slot'" :name="formItem.prop"></slot>
    <!-- end -->
    <!-- field -->
    <!-- start -->
    <component
      v-else
      :is="`el-${formItem.valueType}`"
      v-model="fieldValue"
      v-bind="normalizedFieldProps"
      v-on="formItem.fieldEvents ?? {}"
    />
    <!-- end -->
  </el-form-item>
</template>
