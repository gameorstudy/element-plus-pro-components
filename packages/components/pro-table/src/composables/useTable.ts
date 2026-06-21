import { computed, onMounted, reactive, ref, type ComputedRef, type Ref } from "vue";
import type { DefaultRow } from "element-plus-pro-components/packages/types/table";
import { useProLocale } from 'element-plus-pro-components/packages/locale'
import type { ColumnsConfig, ColumnSettings, ProTableProps } from "../pro-table";
import type { PaginationProps, TableInstance } from "element-plus";
import { getInitialValues } from "./useForm";
import type { ColumnSettingsChangePayload, ColumnSettingsRule, SettingColumns } from "../column-settings";

export function useTable(props: ProTableProps<DefaultRow>, form: Ref<any>, emit: (event: any, ...args: any[]) => void) {
  const proTableRef = ref<TableInstance>()

  const normalizedTableProps = computed(() => {
    const { tableProps, defaultSize } = props
    return {
      size: defaultSize,
      ...tableProps
    }
  })

  const page = reactive({
    pageNum: 1,
    pageSize: props.paginationProps?.pageSize || 10,
  })

  const getParams = () => {
    const { pageNum, pageSize } = page
    const { pageKey, sizeKey } = props.paginationMapping || {}
    return {
      ...form.value,
      [pageKey || 'pageNum']: pageNum,
      [sizeKey || 'pageSize']: pageSize
    }
  } 

  const sortChange = ({ prop, order }: { prop: string, order: any }) => {
    page.pageNum = 1
    emit('onParams', { ...getParams(), prop, order})
  }

  const normalizedTableEvents = computed(() => {
    return {
      sortChange,
      ...props.tableEvents
    }
  })

  const initializedPaginationProps: ComputedRef<Partial<PaginationProps>> = computed(() => {
    return {
      pageSizes: [10, 20, 30, 50],
      layout: 'total, sizes, prev, pager, next, jumper',
      hideOnSinglePage: true,
      ...props.paginationProps,
      currentPage: page.pageNum,
      pageSize: page.pageSize,
      total: props.total
    }
  })

  const handleCurrentChange = (value: number) => {
    page.pageNum = value
    emit('onParams', getParams())
  }

  const handleSizeChange = (value: number) => {
    page.pageSize = value
    page.pageNum = 1
    emit('onParams', getParams())
  }

  const handleReset = () => {
    form.value = getInitialValues(props)
    page.pageNum = 1
    emit('onParams', getParams())
    emit('onReset')
  }

  const handleSearch = () => {
    page.pageNum = 1
    const params = getParams()
    emit('onParams', params)
    emit('onSubmit', params)
  }

  onMounted(() => {
    if (!props.manualRequest) {
      handleSearch()
    }
  })

  const reload = (resetPageIndex = true) => {
    if (resetPageIndex) {
      page.pageNum = 1
    }

    emit('onParams', getParams())
  }

  return {
    proTableRef,
    normalizedTableProps,
    normalizedTableEvents,
    getParams,
    initializedPaginationProps,
    handleCurrentChange,
    handleSizeChange,
    handleReset,
    handleSearch,
    reload
  }
}

export function useTableColumns(props: ProTableProps<DefaultRow>, initializedColumnSettings: Ref<false | ColumnSettings>, columnSettingsRule: Ref<ColumnSettingsRule[]>) {
  const normalizedColumns = computed(() => {
    const { columns } = props

    let normalizedColumns: (ColumnsConfig & {
      nonElColumnProps: {
        valueEnum?: ColumnsConfig['valueEnum']
        renderCellHeader?: ColumnsConfig['renderCellHeader']
        key?: ColumnsConfig['key']
        disabled?: ColumnsConfig['disabled']
        checkable?: boolean
        index?: number
      }
    })[] = columns
      .filter(item => !item.hideInTable)
      .map(col => {
        const {
          formItemProps,
          renderLabel,
          valueType,
          renderField,
          fieldProps,
          fieldEvents,
          valueEnum,
          optionLoader,
          initialValue,
          order,
          hideInSearch,
          renderCellHeader,
          disabled,
          key,
          ...keys
        } = col

        return {
          ...keys,
          nonElColumnProps: {
            valueEnum,
            renderCellHeader,
            key,
            disabled,
          }
        }
      })
    
    /**
     * Merge column settings rules into columns
     */
    if (initializedColumnSettings.value && columnSettingsRule.value.length) {
      normalizedColumns = normalizedColumns.map((col) => {
        const rule = columnSettingsRule.value.find(
          (item: ColumnSettingsRule) => (col.prop || col.nonElColumnProps.key) === item.prop
        )
        
        if (rule) {
          const { checkable, fixed, index } = rule
          
          // Update nonElColumnProps
          col.nonElColumnProps = {
            ...col.nonElColumnProps,
            checkable,
            index,
          }
          
          // Return column with updated fixed property
          return { ...col, fixed }
        }
        
        return col
      })

      // Extract column settings configuration
      const { draggable, checkable } = initializedColumnSettings.value
    
      // Handle drag and drop sorting
      if (draggable) {
        normalizedColumns.sort((a, b) => 
          a.nonElColumnProps.index! - b.nonElColumnProps.index!
        )
      }
    
      // Handle column visibility filtering
      if (checkable) {
        normalizedColumns = normalizedColumns.filter(
          (item) => item.nonElColumnProps.checkable || !!item.type
        )
      }
    }

    return normalizedColumns
  })

  return normalizedColumns
}

export function useColumnSettings(props: ProTableProps<DefaultRow>): Ref<false | ColumnSettings> {
  const { t } = useProLocale()

  const initializedColumnSettings = computed(() => {
    const { columnSettings } = props
    if (columnSettings) {
      const defaultColumnSettings: ColumnSettings = {
        columnSetting: t('elProComponents.tableToolBar.columnSetting'),
        columnDisplay: t('elProComponents.tableToolBar.columnDisplay'),
        resetText: t('elProComponents.tableToolBar.reset'),
        draggable: true,
        checkable: true
      }

      if (typeof columnSettings === 'object') {
        return {
          ...defaultColumnSettings,
          ...columnSettings
        }
      }

      return defaultColumnSettings
    }

    return false
  })

  return initializedColumnSettings
}

export function useColumnSettingsRule(props: ProTableProps<DefaultRow>) {
  const columnSettingsRule = ref<ColumnSettingsRule[]>([])

  const initializeColumnSettingsRule: () => ColumnSettingsRule[] = () => {
    return props.columns
      .filter(item => !item.hideInTable && (item.prop || item.key))
      .map((col, index) => {
        const { prop, key, fixed } = col
        return {
          prop: prop || key,
          fixed,
          checkable: true,
          index
        }
      })
  }

  onMounted(() => {
    if (props.columnSettings) {
      columnSettingsRule.value = initializeColumnSettingsRule()
    }
  })

  /**
   * Check/uncheck all columns
   * @param checked - Checked status
   */
  const checkAllRule = (checked: boolean): void => {
    columnSettingsRule.value = columnSettingsRule.value.map((rule) => {
      const col = props.columns.find((item) => (item.prop || item.key) === rule.prop)
      if (col) {
        return { ...rule, checkable: !col.disabled ? checked : rule.checkable }
      }
      return rule
    })
  }

  /**
   * Check/uncheck a single column
   * @param prop - Column property name
   * @param checked - Checked status
   */
  const checkRule = (prop: string, checked: boolean): void => {
    const index = columnSettingsRule.value.findIndex((item) => item.prop === prop)
    if (index !== -1) {
      columnSettingsRule.value.splice(index, 1, {
        ...columnSettingsRule.value[index],
        checkable: checked,
      })
    }
  }

  /**
   * Handle column fixed position change
   * @param prop - Column property name
   * @param fixed - Fixed position (left/right/undefined)
   */
  const handleAlignRule = (prop: string, fixed?: string): void => {
    const index = columnSettingsRule.value.findIndex((item) => item.prop === prop)
    if (index !== -1) {
      const rule = columnSettingsRule.value[index]
      columnSettingsRule.value.splice(index, 1, { ...rule, fixed })
    }
  }

  /**
   * Reset column settings to default
   */
  const handleResetRule = (): void => {
    columnSettingsRule.value = initializeColumnSettingsRule()
  }

  /**
   * Handle column drag and drop reordering
   * @param fromProp - Source column property name
   * @param toProp - Target column property name
   * @param isAfter - Whether dropping after the target column
   */
  const handleDropRule = (fromProp: string, toProp: string, isAfter: boolean = false): void => {
    const fromIndex = columnSettingsRule.value.findIndex(
      (item) => item.prop === fromProp
    )
    if (fromIndex === -1) return
    
    const toIndex = columnSettingsRule.value.findIndex(
      (item) => item.prop === toProp
    )
    if (toIndex === -1) return
    
    // Dragging direction: true = up, false = down
    const isUp = fromIndex > toIndex
    // Start index for moving
    const startIndex = isUp ? toIndex : fromIndex + 1
    // End index for moving
    const endIndex = isUp ? fromIndex : isAfter ? toIndex + 1 : toIndex
    
    // Update indices for columns in between
    for (let i = startIndex; i < endIndex; ++i) {
      const column = columnSettingsRule.value[i]
      columnSettingsRule.value.splice(i, 1, {
        ...column,
        index: isUp ? column.index! + 1 : column.index! - 1,
      })
    }

    const fromColumn = columnSettingsRule.value[fromIndex]
    if (isUp) {
      // Remove first, then insert
      columnSettingsRule.value.splice(fromIndex, 1)
      columnSettingsRule.value.splice(toIndex, 0, { ...fromColumn, index: toIndex })
    } else {
      // Insert first, then remove
      columnSettingsRule.value.splice(endIndex, 0, { ...fromColumn, index: endIndex - 1 })
      columnSettingsRule.value.splice(fromIndex, 1)
    }
  }

  /**
   * Handle column settings changes from child components
   * @param data - Column settings change payload
   */
  const onColumnSettingsChange = (data: ColumnSettingsChangePayload) => {
    const { event, prop, checked, fixed, fromProp, toProp, isAfter } = data

    switch (event) {      
      case 'checkAll':
        checkAllRule(checked!)
        break
      case 'check':
        checkRule(prop!, checked!)
        break
      case 'align':
        handleAlignRule(prop!, fixed)
        break
      case 'reset':
        handleResetRule()
        break
      case 'drop':
        handleDropRule(fromProp!, toProp!, isAfter!)
        break
      default:
        break
    }
  }

  return { columnSettingsRule, initializeColumnSettingsRule, onColumnSettingsChange }
}

export function useSettingColumns(props: ProTableProps<DefaultRow>, columnSettingsRule: Ref<ColumnSettingsRule[]>): Ref<SettingColumns[]> {
  const settingColumns = computed(() => {
    const { columnSettings, columns } = props
    
    if (!columnSettings) {
      return []
    }

    return columnSettingsRule.value.map(rule => {
      const col = columns.find(item => rule.prop === (item.prop || item.key))
      if (col) {
        const { label, disabled } = col
        return {
          ...rule,
          label,
          disabled
        }
      }
      return rule
    })
  })

  return settingColumns
}