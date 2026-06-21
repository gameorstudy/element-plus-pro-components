<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { TableColumnCtx } from 'element-plus'
import CustomRender from 'element-plus-pro-components/packages/base/custom-render'
import FormItem from './FormItem.vue'
import { setOptions } from 'element-plus-pro-components/packages/utils/form'
import type { FormItemProps } from './form-item'
import type { ProFormItemProps } from 'element-plus-pro-components/packages/types/pro-form-item'
import type { DefaultRow } from 'element-plus-pro-components/packages/types/table'
import type { EditableColumnsConfig, RecordKey, TableRowEditable } from '../editable-pro-table'

const props = defineProps<{
  editable: TableRowEditable
  column: EditableColumnsConfig
  scope?: { row: DefaultRow; $index: number; column: TableColumnCtx }
  name: string
  recordKey?: RecordKey
  cachedOptions?: Record<string, any>
  preEditRows?: Map<RecordKey, DefaultRow>
}>()

function resolveSelectLabel(
  options: Record<string, any>[],
  cellValue: any,
  selectProps?: { label?: string; value?: string }
) {
  const labelKey = selectProps?.label ?? 'label'
  const valueKey = selectProps?.value ?? 'value'
  const map = options.reduce(
    (accu, cur) => ({ ...accu, [cur[valueKey]]: cur[labelKey] }),
    {} as Record<string, any>
  )

  return map[cellValue]
}

const formItem = computed((): FormItemProps['formItem'] => {
  const {
    prop,
    formItemProps = {},
    valueType,
    renderField,
    fieldProps = {},
    fieldEvents,
    valueEnum,
    optionLoader,
  } = props.column

  const columnCopy: ProFormItemProps = {
    ...formItemProps,
    prop,
    valueType,
    fieldProps: { ...fieldProps },
    fieldEvents,
    valueEnum,
    optionLoader,
  }

  setOptions(columnCopy, props.cachedOptions ?? {})

  return {
    ...formItemProps,
    prop: prop!,
    valueType,
    renderField: renderField as FormItemProps['formItem']['renderField'],
    fieldProps: columnCopy.fieldProps,
    fieldEvents,
    valueEnum,
  }
})

const row = computed(() => props.scope?.row ?? {})

const index = computed(() => props.scope?.$index ?? 0)

const formItemProp = computed(() => {
  const { prop } = formItem.value
  if (!prop) {
    return undefined
  }
  return `${props.name}.${index.value}.${prop}`
})

const isEditable = computed(() => {
  const {
    editable: { editableKeys },
    recordKey,
    column: { readonly, editable },
    preEditRows,
  } = props
  const { prop } = formItem.value
  const preEditCellValue = preEditRows?.get(recordKey!)?.[prop]

  return editableKeys?.some(key => recordKey === key)
    && readonly !== true
    && (editable ? editable(preEditCellValue, row.value, index.value) : true)
})

const displayValue = computed(() => {
  const { column, scope } = props
  const { formatter } = column
  const { prop, valueType, valueEnum, fieldProps = {} } = formItem.value
  const cellValue = row.value[prop]

  if (formatter && scope) {
    return formatter(row.value, scope.column as TableColumnCtx<DefaultRow>, cellValue, index.value)
  }

  if (valueType === 'select') {
    let label: string | undefined
    if (valueEnum) {
      label = valueEnum instanceof Map
        ? valueEnum.get(cellValue)
        : valueEnum[cellValue]
    } else {
      label = resolveSelectLabel(
        fieldProps.options ?? [],
        cellValue,
        fieldProps.props
      )
    }
    if (label != null && label !== '') {
      return label
    }
    return cellValue == null || cellValue === '' ? '-' : cellValue
  }

  return cellValue ?? '-'
})

const overflowTooltipProps = computed(() =>
  typeof props.column.showOverflowTooltip === 'object'
    ? props.column.showOverflowTooltip
    : {}
)

const textRef = ref<HTMLElement>()
const isOverflow = ref(false)
let resizeObserver: ResizeObserver | undefined

const checkOverflow = () => {
  const el = textRef.value
  if (!el) {
    isOverflow.value = false
    return
  }
  isOverflow.value = el.scrollWidth > el.clientWidth
}

const setupOverflowObserver = () => {
  resizeObserver?.disconnect()
  resizeObserver = undefined
  nextTick(() => {
    checkOverflow()
    const el = textRef.value
    if (el && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => checkOverflow())
      resizeObserver.observe(el)
    }
  })
}

onMounted(setupOverflowObserver)
onBeforeUnmount(() => resizeObserver?.disconnect())
watch([displayValue, isEditable], setupOverflowObserver)
</script>

<template>
  <!-- edit -->
  <!-- start -->
  <template v-if="isEditable">
    <FormItem
      :formItem="formItem"
      :formItemProp="formItemProp"
      :form="row"
      :name="name"
      :recordKey="recordKey"
      :index="index"
    >
      <template #[formItem.prop]>
        <slot
          :name="formItem.prop"
          v-bind="{ form: row, formItem, recordKey, index }"
        />
      </template>
    </FormItem>
  </template>
  <!-- end -->
  <!-- read -->
  <!-- start -->
  <template v-else>
    <!-- el-form-item wrapper required for form validation -->
    <!-- start -->
    <el-form-item class="editable-form-item" :prop="formItemProp">
      <CustomRender
        v-if="column.renderCell"
        :render="() => column.renderCell?.(scope!)"
      />
      <el-tooltip
        v-else-if="column.showOverflowTooltip"
        v-bind="overflowTooltipProps"
        :content="displayValue"
        :disabled="!isOverflow"
        placement="top"
        :show-after="500"
      >
        <span ref="textRef" class="text-ellipsis">{{ displayValue }}</span>
      </el-tooltip>
      <span v-else>{{ displayValue }}</span>
    </el-form-item>
    <!-- end -->
  </template>
  <!-- end -->
</template>

<style lang="less" scoped>
.text-ellipsis {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: inherit;
}

.editable-form-item.el-form-item {
  margin-bottom: 0;

  :deep(.el-form-item__content) {
    font-size: unset;
    min-width: 0;
  }
}
</style>
