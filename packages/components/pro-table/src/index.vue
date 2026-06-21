<script lang="ts">
import { computed, defineComponent, provide, ref } from 'vue';
import defaultProps from './defaults'
import { getInitialValues, useFormItems, useOptions, useSearch, useSearchColConfig } from './composables/useForm'
import ProFormItem from 'element-plus-pro-components/packages/base/pro-form-item';
import { useProLocale } from 'element-plus-pro-components/packages/locale'
import ArrowIcon from './components/svg/ArrowIcon.vue';
import { Refresh, Search } from '@element-plus/icons-vue'
import { useColumnSettings, useColumnSettingsRule, useSettingColumns, useTable, useTableColumns } from './composables/useTable';
import CustomRender from 'element-plus-pro-components/packages/base/custom-render';
import ColumnSettings from './components/ColumnSettings.vue';
import type { ColumnsConfig } from './pro-table';

const getValueEnumLabel = (
  column: { prop?: string; nonElColumnProps: { valueEnum?: ColumnsConfig['valueEnum'] } },
  scope: { row?: Record<string, any> },
) => {
  const { valueEnum } = column.nonElColumnProps
  const { prop } = column
  if (!valueEnum || !prop || !scope.row) {
    return ''
  }

  const cellValue = scope.row[prop]
  if (valueEnum instanceof Map) {
    return valueEnum.get(cellValue)
  }

  return valueEnum[cellValue as keyof typeof valueEnum]
}

export default defineComponent({
  name: 'ProTable',
  props: defaultProps,
  components: {
    ProFormItem,
    ArrowIcon,
    CustomRender,
    ColumnSettings
  },
  emits: [
    'onCollapse',
    'onParams',
    'onSubmit',
    'onReset',
  ],
  setup(props, { emit, expose }) {
    const { t } = useProLocale()

    // Search props
    const searchProps = useSearch(props)

    // Form
    const form = ref<any>(getInitialValues(props))

    // Set fields value
    const setFieldsValue = (data: Record<string, any>) => {
      form.value = {
        ...form.value,
        ...data
      }
    }

    // Set field value
    const setFieldValue = (key: string, value: any) => {
      form.value[key] = value
    }

    // Cached options
    const cachedOptions = useOptions(props)

    // Form items
    const formItems = useFormItems(props, cachedOptions)

    // Search count
    const totalSearchCount = computed(() => {
      return formItems.value.length
    })

    // Search col config
    const { searchColConfig, showExpandToggle, collapsed, searchCount, handleCollapse } = useSearchColConfig(searchProps, totalSearchCount, emit)

    // Table
    const { 
      proTableRef,
      normalizedTableProps,
      normalizedTableEvents,
      initializedPaginationProps, 
      handleCurrentChange, 
      handleSizeChange,
      handleReset,
      handleSearch,
      reload
    } = useTable(props, form, emit)

    // Initialized column settings
    const initializedColumnSettings = useColumnSettings(props)
    
    // Column settings rule
    const { columnSettingsRule, onColumnSettingsChange } = useColumnSettingsRule(props)
 
    // Setting columns
    const settingColumns = useSettingColumns(props, columnSettingsRule)

    // Table columns
    const normalizedColumns = useTableColumns(props, initializedColumnSettings, columnSettingsRule)

    const expandText = computed(() =>
      collapsed.value
        ? t('elProComponents.proTable.expand')
        : t('elProComponents.proTable.collapse')
    )

    // Table ref
    const getTableRef = () => {
      return proTableRef
    }

    // Provide
    provide('onColumnSettingsChange', props.columnSettings ? onColumnSettingsChange : () => {})

    // Expose
    expose({
      setFieldsValue,
      setFieldValue,
      reload,
      getTableRef
    })

    return {
      searchProps,
      form,
      formItems,
      totalSearchCount,
      Refresh,
      Search,
      searchColConfig,
      showExpandToggle,
      collapsed,
      searchCount,
      handleCollapse,
      normalizedTableProps,
      normalizedTableEvents,
      initializedPaginationProps,
      handleCurrentChange,
      handleSizeChange,
      handleReset,
      handleSearch,
      settingColumns,
      initializedColumnSettings,
      normalizedColumns,
      expandText,
      getValueEnumLabel,
    }
  }
})
</script>

<template>
  <div class="pro-table">
    <!-- Search form -->
    <!-- start -->
    <template v-if="search">
      <el-form
        class="pro-table__form"
        :label-width="searchProps.labelWidth"
        :label-position="searchProps.labelPosition"
        :model="form"
        :size="defaultSize"
        :class="searchProps.className"
      >
        <!-- Grid -->
        <!-- start -->
        <el-row v-bind="searchProps.rowProps">
          <el-col
            v-for="(formItem, index) in formItems"
            v-bind="searchProps.colProps"
            :style="{ display: index >= searchCount ? 'none' : '' }"
            :key="formItem.prop"
          >
            <ProFormItem
              :form="(form)" 
              :formItem="formItem"
            >
              <template #[formItem.prop]>
                <slot :name="formItem.prop" v-bind="{ form, formItem }"></slot>
              </template>
            </ProFormItem>
          </el-col>
          <el-col 
            v-bind="searchColConfig" 
            class="search-wrapper" 
            key="search"
            align="right"
          >
            <el-button
              :icon="Refresh"
              :size="defaultSize"
              @click="handleReset"
            >{{ searchProps.resetText }}</el-button>
            <el-button
              type="primary"
              :icon="Search"
              :loading="loading"
              :size="defaultSize"
              @click="handleSearch"
            >{{ searchProps.searchText }}</el-button>
            <template v-if="showExpandToggle">
              <el-button class="btn-collapse" type="primary" link :size="defaultSize" @click="handleCollapse">
                {{ expandText }}
                <ArrowIcon
                  style="transition: 0.3s"
                  :style="{ transform: `rotate(${collapsed ? 0 : 0.5}turn)` }"
                />
              </el-button>
            </template>
          </el-col>
        </el-row>
        <!-- end -->
      </el-form>
    </template>
    <!-- end -->
    <!-- title bar -->
    <!-- start -->
    <div v-if="$slots.default || columnSettings" class="pro-table__toolbar">
      <slot></slot>
      <div v-if="initializedColumnSettings" class="pro-table__toolbar-items">
        <ColumnSettings
          :columns="settingColumns"
          :columnSettings="initializedColumnSettings"
        />
      </div>
    </div>
    <!-- end -->
    <el-table
      ref="proTableRef"
      class="pro-table__table"
      :class="className"
      v-loading="loading"
      :data="dataSource"
      v-bind="normalizedTableProps"
      v-on="normalizedTableEvents"
    >
      <el-table-column
        v-for="column in normalizedColumns"
        v-bind="{
          ...column,
          nonElColumnProps: undefined
        }"
        :key="column.prop || column.nonElColumnProps.key || `${column.type}-col`"
      >
        <template v-if="column.nonElColumnProps.renderCellHeader" #header="scope">
          <CustomRender :render="() => column.nonElColumnProps.renderCellHeader?.(scope)" />
        </template>
        <template v-if="column.nonElColumnProps.valueEnum" #default="scope">
          <span>{{ getValueEnumLabel(column, scope) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pro-table__pagination"
      v-bind="initializedPaginationProps"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<style lang="less" scoped>
.pro-table__form {
  margin-block-end: 16px;
  background-color: #fff;

  :deep(.el-form-item__content) {
    .el-select,
    .el-input-number,
    .el-date-editor,
    .el-cascader {
      width: 100%;
    }
  }

  .btn-collapse.el-button {
    :deep(span) {
      display: inline-flex;
      gap: 0.5em;
      align-items: center;
    }
  }
}

.pro-table__toolbar {
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;

  .pro-table__toolbar-items {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-left: auto;
  }
}

.pro-table__pagination {
  margin: 16px 0;
  margin-block-end: 0;
  display: flex;
  justify-content: flex-end;
}
</style>