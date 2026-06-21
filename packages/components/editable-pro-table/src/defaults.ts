import type { PropType } from 'vue'
import type { TableProps } from 'element-plus'
import type { DefaultRow, TableEmits } from 'element-plus-pro-components/packages/types/table'
import type {
  EditableColumnsConfig,
  RecordCreatorProps,
  TableRowEditable
} from './editable-pro-table'

export default {
  /**
   * @description el-table data
   */
  dataSource: {
    type: Array as PropType<DefaultRow[]>,
    default: () => [],
    required: true
  },
  /**
   * @description Config for creating a new row. Set to `false` to hide the button
   */
  recordCreatorProps: {
    type: [Boolean, Object] as PropType<boolean | RecordCreatorProps<DefaultRow>>,
    default: true
  },
  /**
   * @description Max row count; the create button hides when reached
   */
  maxLength: {
    type: Number
  },
  /**
   * @description Editable table config
   */
  editable: {
    type: Object as PropType<TableRowEditable<DefaultRow>>
  },
  /**
   * @description Row key field
   */
  rowKey: {
    type: [String, Function] as PropType<TableProps<DefaultRow>['rowKey']>
  },
  /**
   * @description Table name when embedded in a form; required for validation
   */
  name: {
    type: String,
    default: 'dataSource'
  },
  /**
   * @description el-table class name
   */
  className: {
    type: String
  },
  /**
   * @description Loading state
   */
  loading: {
    type: Boolean
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
    type: Object as PropType<TableEmits<DefaultRow>>,
    default: () => ({}),
  },
  /**
   * @description Column definitions
   */
  columns: {
    type: Array as PropType<EditableColumnsConfig[]>,
    default: () => [],
    required: true
  },
  /**
   * @description Default component size
   */
  defaultSize: {
    type: String as PropType<'' | 'large' | 'default' | 'small'>
  }
}
