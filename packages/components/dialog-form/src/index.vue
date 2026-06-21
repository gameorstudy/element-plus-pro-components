<script setup lang="ts">
defineOptions({ name: 'DialogForm' })

import { computed, ref, type Ref, type VNode, } from 'vue';
import { dialogFormPropsDefaults, type DialogFormProps, type DialogFormSubmitterProps } from './dialog-form';
import { useOptions } from 'element-plus-pro-components/packages/composables/useOptions';
import { useProLocale } from 'element-plus-pro-components/packages/locale';
import { deepMerge, getValueByProp, setOptions } from 'element-plus-pro-components/packages/utils/form';
import type { FormInstance } from 'element-plus';
import type { RenderActions } from 'element-plus-pro-components/packages/types/form';
import ProFormItem from 'element-plus-pro-components/packages/base/pro-form-item';
import CustomRender from 'element-plus-pro-components/packages/base/custom-render';
import Submitter from './components/Submitter';

// el-form ref
const proFormRef = ref<FormInstance>()

const props = withDefaults(defineProps<DialogFormProps>(), dialogFormPropsDefaults)
const { t } = useProLocale()

// Normalize dialog props
const normalizedDialogProps = computed(() => {
  const { title, width, dialogProps = {} } = props
  const { modelValue, ...restProps } = dialogProps
  return {
    ...restProps,
    title,
    width
  }
})

// Options
const cachedOptions = useOptions(props.formItems)

// Normalized form items
const normalizedFormItems = computed(() => {
  return props.formItems
    .filter(item => !item.hideInForm)
    .map(item => {
      // Set el-select, el-cascader options
      setOptions(item, cachedOptions)

      return item
    })
})

// Submitter props
const submitterProps = computed(() => {
  if (props.submitter) {
    // Button Text
    const defaultTextConfig: DialogFormSubmitterProps = {
      cancelText: t('elProComponents.dialogForm.cancel'),
      confirmText: t('elProComponents.dialogForm.confirm')
    }

    if (typeof props.submitter === 'object') {
      return {
        ...defaultTextConfig,
        ...props.submitter
      }
    }

    return defaultTextConfig
  }

  return false
})

// Get initial values
const getInitialValues = () => {
  const { formItems, initialValues = {} } = props
  return formItems.reduce((accumulator, cur) => {
    const { prop, initialValue } = cur
    if (!prop) {
      return accumulator
    }

    return deepMerge(accumulator, getValueByProp(prop, initialValue, initialValues))
  }, initialValues)
}

// Form
const form = ref<any>(getInitialValues())

// Emits
const emit = defineEmits(['update:modelValue', 'onReset', 'onFinish', 'onError'])

// v-model
const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})

/**
 * @desc Close
 */
const close = () => {
  emit('update:modelValue', false)
}

/**
 * @desc Reset
 */
const reset = async () => {
  try {
    await proFormRef.value?.resetFields()
    emit('onReset')
  } catch (err) {
    console.error('err', err)
  }
}

/**
 * @desc submit
 */
const submit = async () => {
  try {
    await proFormRef.value?.validate()
    emit('onFinish', form.value)
  } catch (invalidFields) {
    emit('onError', invalidFields)
  }
}

/**
 * @desc 重置表单，过滤了非表单字段
 */
const resetAllFields = () => {
  proFormRef.value?.clearValidate()
  // 重置表单
  form.value = getInitialValues()
}

/**
 * @desc 自定义渲染 submitter
 */
const customRender = (form: Record<string, any>) => {
  const submitter = props.submitter
  if (typeof submitter === 'object' && typeof submitter.customRender === 'function') {
    return (actions: RenderActions, doms: VNode[]) => submitter.customRender?.(form, actions, doms)
  }

  return null
}

/**
 * @desc 获取 el-form ref
 */
const getFormRef: () => Ref<FormInstance | undefined> = () => {
  return proFormRef
}

/**
 * @desc 获取表单数据
 */
const getForm = () => {
  return form.value
}

/**
 * @desc 设置表单多个字段的值
 * @param {Object} data
 */
const setFieldsValue = (data: Record<string, any>) => {
  form.value = {
    ...form.value,
    ...data
  }
}

/**
 * @desc 设置表单单个字段的值
 * @param {String} key 键
 * @param {Any} value 值
 */
const setFieldValue = (key: string, value: any) => {
  form.value[key] = value
}

defineExpose({
  close,
  submit,
  reset,
  resetAllFields,
  getFormRef,
  getForm,
  setFieldsValue,
  setFieldValue
})
</script>

<template>
  <el-dialog
    v-model="visible"
    v-bind="normalizedDialogProps"
    v-on="dialogEvents || {}"
  >
    <!-- header slot -->
    <!-- start -->
    <template v-if="renderHeader" #header="{ close, titleId, titleClass }">
      <CustomRender :render="() => renderHeader?.({ close, titleId, titleClass }, form)" />
    </template>
    <!-- end -->
    <el-form
      ref="proFormRef"
      :model="form"
      class="pro-form"
      :class="className"
      v-bind="formProps">
      <!-- 栅格布局 -->
      <!-- start -->
      <template v-if="grid">
        <el-row v-bind="rowProps">
          <el-col
            v-for="formItem in normalizedFormItems"
            v-bind="formItem.colProps"
            :key="formItem.prop || formItem.key">
            <!-- 自定义 el-form-item -->
            <!-- start -->
            <slot 
              v-if="formItem.customSlot"
              :name="formItem.customSlot === true ? formItem.prop : formItem.customSlot"
              v-bind="{ form }">
            </slot>
            <CustomRender
              v-else-if="formItem.renderFormItem"
              :render="() => formItem.renderFormItem?.(form)" />
            <!-- end -->
            <!-- ProFormItem -->
            <!-- start -->
            <ProFormItem
              v-else
              :form="(form)"
              :formItem="formItem"
              >
              <template #[formItem.prop]>
                <slot :name="formItem.prop" v-bind="{ form, formItem }"></slot>
              </template>
            </ProFormItem>
            <!-- end -->
          </el-col>
        </el-row>
      </template>
      <!-- end -->
      <!-- 非栅格布局 -->
      <!-- start -->
      <template v-else>
        <template v-for="formItem in normalizedFormItems" :key="formItem.prop || formItem.key">
          <!-- 自定义 el-form-item -->
          <!-- start -->
          <slot 
            v-if="formItem.customSlot"
            :name="formItem.customSlot === true ? formItem.prop : formItem.customSlot"
            v-bind="{ form }"
          ></slot>
          <CustomRender
            v-else-if="formItem.renderFormItem"
            :render="() => formItem.renderFormItem?.(form)"
          />
          <!-- end -->
          <!-- ProFormItem -->
          <!-- start -->
          <ProFormItem
            v-else
            :form="(form)" 
            :formItem="formItem"
          >
            <template #[formItem.prop]>
              <slot :name="formItem.prop" v-bind="{ form, formItem }"></slot>
            </template>
          </ProFormItem>
        </template>
      </template>
      <!-- end -->
    </el-form>  
    <!-- submitter -->
    <!-- start -->
    <template v-if="submitterProps" #footer>
      <Submitter
        :submitter="submitterProps"
        :actions="{ close, submit, reset, resetAllFields }"
        :render="customRender(form)"
      />
    </template>
    <!-- end -->
  </el-dialog>
</template>


<style scoped>

</style>