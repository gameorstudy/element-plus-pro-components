<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import type { FormInstance } from 'element-plus'
import defaultProps from './defaults';
import { useForm, useOptions } from './composables/useForm';
import { useColumns, useEditable, useEditableTable, useTableProps, useRecordCreatorProps } from './composables/useTable';
import type { EditableColumnsConfig } from './editable-pro-table.ts';
import RecordCreator from './components/RecordCreator.vue'
import RenderCell from './components/RenderCell.vue'
import Editable from './components/Editable.tsx'
import ElTablePrepend from 'el-table-prepend-next'
import CustomRender from 'element-plus-pro-components/packages/base/custom-render'

const getColumnProps = (column: EditableColumnsConfig) => {
  const {
    formItemProps,
    valueType,
    renderField,
    fieldProps,
    fieldEvents,
    valueEnum,
    optionLoader,
    renderCellHeader,
    renderCell,
    editable,
    readonly,
    showOverflowTooltip,
    key,
    ...keys
  } = column

  return keys
}

export default defineComponent({
  name: 'EditableProTable',
  props: defaultProps,
  components: {
    ElTablePrepend,
    RecordCreator,
    RenderCell,
    Editable,
    CustomRender
  },
  setup(props, { expose }) {
    const formRef = ref<FormInstance>()
    const tableRef = ref()
    const { form, getFormRef, wrapperComponent, formWrapperProps } = useForm(props, formRef)
    const cachedOptions = useOptions(props)
    const initializedCreatorProps = useRecordCreatorProps(props)

    const exceedsMax = computed(() => {
      const { maxLength } = props
      if (typeof maxLength === 'number') {
        return form[props.name].length >= maxLength
      }
      return false
    })

    const initializedColumns = useColumns(props)
    const initializedEditable = useEditable(props)
    const initializedTableProps = useTableProps(props)
    const normalizedTableEvents = computed(() => props.tableEvents ?? {})

    const {
      preEditRows,
      newLineRecordCache,
      actions,
      validateRow,
      filterByRecordKey,
      deleteOrResetRow,
      addEditRecord,
      getRowData,
      getRowsData,
      setRowData,
      getRowRecordKey,
    } = useEditableTable(
      props,
      form,
      getFormRef,
      initializedEditable,
      initializedCreatorProps,
      initializedColumns,
    )

    const getTableRef = () => tableRef.value

    expose({
      getFormRef,
      getTableRef,
      validateRow,
      getRowData,
      getRowsData,
      setRowData,
    })

    return {
      formRef,
      tableRef,
      form,
      wrapperComponent,
      formWrapperProps,
      cachedOptions,
      initializedCreatorProps,
      exceedsMax,
      initializedColumns,
      initializedTableProps,
      normalizedTableEvents,
      getColumnProps,
      initializedEditable,
      preEditRows,
      newLineRecordCache,
      actions,
      validateRow,
      filterByRecordKey,
      deleteOrResetRow,
      addEditRecord,
      getRowRecordKey,
    }
  }
})
</script>

<template>
  <component :is="wrapperComponent" ref="formRef" v-bind="formWrapperProps">
    <el-table-prepend
      ref="tableRef"
      class="editable-pro-table"
      :class="className"
      v-loading="loading"
      :data="form[name]"
      v-bind="initializedTableProps"
      v-on="normalizedTableEvents"
    >
      <template v-if="initializedCreatorProps && initializedCreatorProps.position === 'top' && !exceedsMax" #prepend>
        <div class="btn-add-box">
          <RecordCreator
            :recordCreatorProps="initializedCreatorProps"
            :size="defaultSize"
            @click="addEditRecord(null)"
          />
        </div>
      </template>
      <el-table-column
        v-for="column in initializedColumns"
        v-bind="getColumnProps(column)"
        :key="column.prop || column.key || `${column.type}-col`"
      >
        <template v-if="column.renderCellHeader" #header="scope">
          <CustomRender :render="() => column.renderCellHeader?.(scope)" />
        </template>
        <template v-if="column.valueType || column.renderField" #default="scope">
          <Editable
            v-if="column.valueType === 'option'"
            :editable="initializedEditable"
            :actions="actions"
            :validateRow="validateRow"
            :recordKey="getRowRecordKey(scope.row)"
            :scope="scope"
            :name="name"
            :defaultSize="defaultSize"
            :render="(actions) => column.renderCell?.(scope, actions)"
            :newLineRecordCache="newLineRecordCache"
            :preEditRows="preEditRows"
            @delete="filterByRecordKey"
            @cancel="deleteOrResetRow"
          />
          <RenderCell
            v-else
            :editable="initializedEditable"
            :column="column"
            :scope="scope"
            :name="name"
            :recordKey="getRowRecordKey(scope.row)"
            :cachedOptions="cachedOptions"
            :preEditRows="preEditRows"
          >
            <template v-if="column.prop" #[column.prop]="slotScope">
              <slot :name="column.prop" v-bind="slotScope" />
            </template>
          </RenderCell>
        </template>
      </el-table-column>
    </el-table-prepend>
    <RecordCreator
      v-if="initializedCreatorProps && initializedCreatorProps.position === 'bottom' && !exceedsMax"
      :recordCreatorProps="initializedCreatorProps"
      :size="defaultSize"
      @click="addEditRecord(null)"
    />
  </component>
</template>

<style lang="less" scoped>
.editable-pro-table-wrapper {
  width: 100%;
}

.btn-add-box {
  padding: 0 10px;
  position: sticky;
  left: 0;

  &::after {
    content: '';
    display: inline-block;
    width: 100%;
    height: 1px;
    background-color: var(--el-border-color-lighter, #EBEEF5);
    position: absolute;
    left: 0;
    bottom: 0;
  }
}

.editable-pro-table {
  :deep(.editable-pro-table__fixed-left),
  :deep(.editable-pro-table__fixed-right) {
    position: sticky;
    background-color: #fff;
    z-index: 2;
  }

  :deep(th.el-table__cell),
  :deep(td.el-table__cell .cell) {
    overflow: unset;
  }

  :deep(td.el-table__cell:has(.is-editable)) {
    padding: 18px 0;
  }

  &.el-table--small {
    :deep(td.el-table__cell:has(.is-editable)) {
      padding: 16px 0;
    }
  }
}
</style>

<style lang="less">
.el-form-item.is-error .editable-pro-table .el-input__wrapper {
  box-shadow: 0 0 0 1px var(--el-border-color, #DCDFE6) inset;
}

.el-form-item.is-error .editable-pro-table .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1px var(--el-border-color, #DCDFE6) inset;
}

.editable-pro-table .el-form-item.is-error .el-input__wrapper {
  box-shadow: 0 0 0 1px var(--el-color-danger, #F56C6C) inset;
}
</style>
