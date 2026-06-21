import type { PropType } from 'vue'
import type { ColumnsConfig, ColumnSettings, SearchConfig } from './pro-table'
import type { DefaultRow, TableEmits } from 'element-plus-pro-components/packages/types/table'
import type { PaginationProps, TableProps } from 'element-plus'

export default {
  /**
   * @description Search config
   */
  search: {
    type: [Boolean, Object] as PropType<boolean | SearchConfig>,
    default: true
  },
  /**
   * @description el-table class name
   */
  className: {
    type: String
  },
  /**
   * @description el-table data
   */
  dataSource: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  /**
   * @description Loading
   */
  loading: {
    type: Boolean
  },
  /**
   * @description Total
   */
  total: {
    type: Number,
    default: 0
  },
  /**
   * @description el-table props
   */
  tableProps: {
    type: Object as PropType<TableProps<DefaultRow>>
  },
  /**
   * @description el-table events
   */
  tableEvents: {
    type: Object as PropType<TableEmits<DefaultRow>>
  },
  /**
   * @description Columns config
   */
  columns: {
    type: Array as PropType<ColumnsConfig[]>,
    default: () => [],
    required: true
  },
  /**
   * @description el-pagination props
   */
  paginationProps: {
    type: Object as PropType<PaginationProps>,
  },
  /**
   * @description Pagination mapping
   */
  paginationMapping: {
    type: Object as PropType<{
      pageKey?: string
      sizeKey?: string
    }>,
    default: () => ({
      pageKey: 'pageNum',
      sizeKey: 'pageSize'
    })
  },
  /**
   * @description el-form initial values
   */
  initialValues: {
    type: Object as PropType<Record<string, any>>
  },
  /**
   * @description size
   */
  defaultSize: {
    type: String as PropType<'' | 'large' | 'default' | 'small'>,
  },
  /**
   * @description Manual request
   */
  manualRequest: {
    type: Boolean,
    default: false
  },
  /**
   * @description Column settings
   */
  columnSettings: {
    type: [Boolean, Object] as PropType<boolean | ColumnSettings>,
    default: true
  }
}