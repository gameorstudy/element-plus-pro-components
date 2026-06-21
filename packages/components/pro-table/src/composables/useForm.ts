import { computed, onMounted, onUnmounted, ref, shallowReactive, shallowRef, watch, type ComputedRef, type ShallowReactive, type ShallowRef } from "vue";
import { useProLocale } from 'element-plus-pro-components/packages/locale'
import type { ColumnsConfig, ProTableProps, SearchConfig } from "../pro-table";
import { BREAKPOINT_ORDER, calculateCurrentSpan, defaultColConfig, GRID_COLUMNS, type Breakpoint, type ColConfig } from "element-plus-pro-components/packages/utils/breakpoints";
import type { DefaultRow } from "element-plus-pro-components/packages/types/table";
import { deepMerge, getValueByProp, setOptions } from "element-plus-pro-components/packages/utils/form";
import type { ColProps } from "element-plus";
import { debounce } from "element-plus-pro-components/packages/utils/debounce";

export function useSearch(props: ProTableProps<DefaultRow>) {
  const { t } = useProLocale()

  const searchProps = computed(() => {
    const { search } = props

    const defaultSearch: SearchConfig = {
      searchText: t('elProComponents.proTable.search'),
      resetText: t('elProComponents.proTable.reset'),
      labelWidth: '80px',
      rowProps: {
        gutter: 8
      },
      colProps: defaultColConfig,
      collapsed: true,
      defaultExpandedRows: 2
    }

    if (typeof search === 'object') {
      return {
        ...defaultSearch,
        ...search,
        collapsed: search.collapsed ?? search.defaultCollapsed ?? defaultSearch.collapsed
      }
    }

    return defaultSearch
  })

  return searchProps
}

export function getInitialValues(props: ProTableProps<DefaultRow>) {
  const { columns, initialValues = {} } = props
  return columns.reduce((accumulator, cur) => {
    const { prop, formItemProps = {}, initialValue } = cur
    const key = formItemProps.prop || prop
    if (!key) {
      return accumulator
    }

    return deepMerge(accumulator, getValueByProp(key, initialValue, initialValues))
  }, initialValues)
}

export function useOptions(props: ProTableProps<DefaultRow>) {
  // Options 对象
  const cachedOptions = shallowReactive<Record<string, any[]>>({})
  
  const getOptions = () => {
    const { columns } = props
    for (const column of columns) {
      const { prop, fieldProps = {}, optionLoader } = column
      const key = (Array.isArray(fieldProps.prop) ? fieldProps.prop.join('.') : fieldProps.prop) || prop
      if (!!key && typeof optionLoader === 'function') {
        optionLoader().then(res => {
          cachedOptions[key] = res
        })
      }
    }
  }

  onMounted(() => {
    getOptions()
  })

  return cachedOptions
}

export function useFormItems(props: ProTableProps<DefaultRow>, options: ShallowReactive<Record<string, any[]>>) {
  const formItems = computed(() => {
    const { columns } = props
    return columns
      .filter(item => !item.hideInSearch && (!!item.valueType || item.renderField))
      .sort((a: ColumnsConfig, b: ColumnsConfig) => (b.order ?? 0) - (a.order ?? 0))
      .map(col => {
        const {
          label,
          prop,
          formItemProps = {},
          renderLabel,
          valueType,
          renderField,
          fieldEvents,
          initialValue
        } = col

        formItemProps.label = formItemProps.label || label
        formItemProps.prop = formItemProps.prop || prop

        const colCopy = {
          ...col,
          prop: formItemProps.prop
        }

        setOptions(colCopy, options)

        return {
          ...formItemProps,
          renderLabel,
          valueType,
          renderField,
          fieldProps: colCopy.fieldProps,
          fieldEvents,
          initialValue
        }
      })
  })

  return formItems
}

export function useSearchColConfig(searchProps: ComputedRef<SearchConfig>, totalSearchCount: ComputedRef<number>, emit: (event: any, ...args: any[]) => void) {
  const searchColConfig: ShallowRef<ColProps> = shallowRef(defaultColConfig)

  const isResponsive = () => {
    const { colProps = {} } = searchProps.value
    const keys = Object.keys(colProps)
    return keys.some(key => BREAKPOINT_ORDER.includes(key as Breakpoint))
  }

  let cachedSpanPerField: number
  let maxVisibleFields: number

  const showExpandToggle = ref(false)

  const collapsed = ref(true)

  const calculateSearchLayout = (responsive = false) => {
    const { colProps, defaultExpandedRows } = searchProps.value

    // 1. Calculate the grid span for each form item
    cachedSpanPerField = responsive ? calculateCurrentSpan(colProps as ColConfig) : (colProps?.span || 8)
    
    // 2. Calculate the maximum number of visible form items
    maxVisibleFields = Math.floor((GRID_COLUMNS / cachedSpanPerField) * (defaultExpandedRows as number)) - 1

    // 3. Determine whether to show the expand/collapse button
    showExpandToggle.value = totalSearchCount.value > maxVisibleFields

    if (showExpandToggle.value) {
      collapsed.value = searchProps.value.collapsed as boolean
    }

    // 4. Update the layout configuration
    updateSearchLayout()
  }

  const searchCount = ref(0)

  const updateSearchLayout = () => {
    const { colProps } = searchProps.value

    // 1. Calculate the number of visible form items
    searchCount.value = showExpandToggle.value && collapsed.value ? maxVisibleFields : totalSearchCount.value

    // 2. Calculate the remaining grid columns after placing search items
    const restSpan = GRID_COLUMNS - ((cachedSpanPerField * searchCount.value) % GRID_COLUMNS)
  
    // 3. Calculate the offset value
    const offset = restSpan - cachedSpanPerField

    searchColConfig.value = { ...colProps, offset }
  }

  const resize = () => {
    calculateSearchLayout(true)
  }

  let debounceResize: (() => void) & {
    cancel: () => void;
  }

  onMounted(() => {
    const responsive = isResponsive()
    calculateSearchLayout(responsive)

    if (responsive) {
      // Window resize
      debounceResize = debounce(resize)
      window.addEventListener('resize', debounceResize)
    }
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resize)
    debounceResize.cancel()
  })

  const handleCollapse = () => {
    collapsed.value = !collapsed.value
    emit('onCollapse', collapsed.value)
    if (showExpandToggle.value) {
      updateSearchLayout()
    }
  }

  // Total search count changes
  watch(totalSearchCount, () => {
    calculateSearchLayout()
  })

  watch(() => searchProps.value.collapsed, (newVal) => {
    if (newVal !== collapsed.value) {
      handleCollapse()
    }
  })

  return {
    searchColConfig,
    showExpandToggle,
    collapsed,
    searchCount,
    handleCollapse
  }
}