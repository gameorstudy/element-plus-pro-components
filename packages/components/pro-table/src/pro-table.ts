import type { ColProps, FormItemProps, PaginationProps, RowProps, TableColumnCtx, TableInstance, TableProps } from "element-plus"
import type { Ref, VNode } from "vue"
import type { ProFormItemProps } from "element-plus-pro-components/packages/types/pro-form-item"
import type { DefaultRow, TableEmits } from "element-plus-pro-components/packages/types/table"

export type { TableEmits } from "element-plus-pro-components/packages/types/table"

export interface ProTableProps<T extends DefaultRow> {
  /**
   * @description Search config
   */
  search?: boolean | SearchConfig
  /**
   * @description el-table class name
   */
  className?: string
  /**
   * @description el-table data
   */
  dataSource: T[]
  /**
   * @description Loading
   */
  loading?: boolean
  /**
   * @description Total
   */
  total: number
  /**
   * @description el-table props
   */
  tableProps?: TableProps<T>
  /**
   * @description el-table events
   */
  tableEvents?: TableEmits<T>
  /**
   * @description Columns config
   */
  columns: ColumnsConfig[]
  /**
   * @description el-pagination props
   */
  paginationProps?: PaginationProps
  /**
   * @description Pagination mapping
   */
  paginationMapping?: {
    /**
     * @description Page key
     */
    pageKey?: string
    /**
     * @description Size key
     */
    sizeKey?: string
  }
  /**
   * @description el-form initial values
   */
  initialValues?: Record<string, any>
  /**
   * @description size
   */
  defaultSize?: '' | 'large' | 'default' | 'small'
  /**
   * @description Manual request
   */
  manualRequest?: boolean
  /**
   * @description Column settings
   */
  columnSettings?: boolean | ColumnSettings
}

export type SearchConfig = {
  /**
   * @description Search text
   */
  searchText?: string
  /**
   * @description Reset text
   */
  resetText?: string
  /**
   * @desc Label width
   */
  labelWidth?: string | number
  /**
   * @desc Label position
   */
  labelPosition?: 'left' | 'right'
  /**
   * @description el-row props
   */
  rowProps?: RowProps
  /**
   * @description el-col props
   */
  colProps?: ColProps
  /**
   * @description el-form class name
   */
  className?: string
  /**
   * @description Default collapsed
   */
  defaultCollapsed?: boolean
  /**
   * @description Collapsed
   */
  collapsed?: boolean
  /**
   * @description Default expanded rows
   */
  defaultExpandedRows?: number
}

export interface ColumnsConfig extends Omit<Partial<TableColumnCtx>, 'order'> {
  /**
   * @description el-form-item props
   */
  formItemProps?: FormItemProps
  /**
   * @description el-form-item label
   */
  renderLabel?: () => VNode
  /**
   * @description Field render
   */
  valueType?: string
  /**
   * @description Render field
   */
  renderField?: (data: { form: any, formItem: ProFormItemProps }) => VNode
  /**
   * @desc Field props (el-input props e.g.)
   */
  fieldProps?: Record<string, any>
  /**
   * @desc Field events (el-input events e.g.)
   */
  fieldEvents?: Record<string, any>
  /**
   * @description Other way to generate el-select options
   */
  valueEnum?: Record<string | number, string> | Map<string | number, string>
  /**
   * @description Generate options of el-select or el-cascader
   * @returns {Promise}
   */
  optionLoader?: () => Promise<Record<string, any>[]>
  /**
   * @description Initial value, which has a higher priority than initialValues
   */
  initialValue?: any
  /**
   * @desc Field order
   */
  order?: number
  /**
   * @description Hide in search?
   */
  hideInSearch?: boolean
  /**
   * @description Hide in table?
   */
  hideInTable?: boolean
  /**
   * @description Render el-table header
   */
  renderCellHeader?: (scope: { column: TableColumnCtx<DefaultRow>, $index: number }) => VNode
  /**
   * @description Disabled for column settings
   */
  disabled?: boolean
  /**
   * @description Component key
   */
  key?: string
}

export interface ColumnSettings {
  /**
   * @description Column setting text
   */
  columnSetting?: string
  /**
   * @description Column display text
   */
  columnDisplay?: string
  /**
   * @description Reset text
   */
  resetText?: string
  /**
   * @description Draggable?
   */
  draggable?: boolean
  /**
   * @description Checkable?
   */
  checkable?: boolean
}

export interface ProTableInstance {
  setFieldsValue: (data: Record<string, any>) => void
  setFieldValue: (key: string, value: any) => void
  reload: (resetPageIndex?: boolean) => void
  getTableRef: () => Ref<TableInstance | undefined>
}