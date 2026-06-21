import type { ButtonProps, FormInstance, FormItemProps, TableColumnCtx, TableInstance, TableProps } from "element-plus"
import type { CSSProperties, VNode } from "vue"
import type { DefaultRow, TableEmits } from "element-plus-pro-components/packages/types/table"
import type { ProFormItemProps } from "element-plus-pro-components/packages/types/pro-form-item"
import type { RecordKey as TableRecordKey } from "element-plus-pro-components/packages/types/table"

export type RecordKey = TableRecordKey

export interface EditableProTableProps<T extends DefaultRow = DefaultRow> {
  /**
   * @description el-table data
   */
  dataSource: T[]
  /**
   * @description Config for creating a new row. Set to `false` to hide the button
   */
  recordCreatorProps?: boolean | RecordCreatorProps<T>
  /**
   * @description Max row count; the create button hides when reached
   */
  maxLength?: number
  /**
   * @description Editable table config
   */
  editable?: TableRowEditable<T>
  /**
   * @description Row key field
   */
  rowKey?: TableProps<T>['rowKey']
  /**
   * @description Table name when embedded in a form; required for validation
   */
  name: string
  /**
   * @description el-table class name
   */
  className?: string
  /**
   * @description Loading state
   */
  loading?: boolean
  /**
   * @description el-table props
   */
  tableProps?: TableProps<T>
  /**
   * @description el-table events
   */
  tableEvents?: TableEmits<T>
  /**
   * @description Column definitions
   */
  columns: EditableColumnsConfig[]
  /**
   * @description Default component size
   */
  defaultSize?: '' | 'large' | 'default' | 'small'
}

export interface RecordCreatorProps<T extends DefaultRow = DefaultRow> {
  /**
   * @description Add row at top or bottom
   */
  position?: 'top' | 'bottom'
  /**
   * @description `cache` removes the row on cancel; `dataSource` keeps it until deleted
   */
  newRecordType?: 'dataSource' | 'cache'
  /**
   * @description Default values for a new row
   */
  record?: T | ((index: number, dataSource: T[]) => T)
  /**
   * @description Create button text
   */
  creatorButtonText?: string
  /**
   * @description Button style; use to control visibility for min/max row limits
   */
  style?: CSSProperties
  /**
   * @description el-button props
   */
  buttonProps?: Partial<ButtonProps>
  /**
   * @description Alert when only one new row is allowed (`newRecordType: 'cache'`)
   */
  onlyAddOneLineAlertMessage?: string
}

export interface TableRowEditable<T extends DefaultRow = DefaultRow> {
  /**
   * @description Single-row or multi-row edit mode
   */
  type?: 'single' | 'multiple'
  /**
   * @description Currently editing row keys (controlled). Uses `rowKey` when set, otherwise row index
   */
  editableKeys?: RecordKey[]
  /**
   * @description Triggered when editing rows change
   */
  onChange?: (editableKeys: RecordKey[], editableRows: T[]) => void
  /**
   * @description Triggered when a row is saved
   */
  onSave?: (recordKey: RecordKey, editRow: T, originRow?: T) => Promise<any>
  /**
   * @description Save button text
   */
  saveText?: string
  /**
   * @description Triggered when a row is deleted
   */
  onDelete?: (recordKey: RecordKey, editRow: T) => Promise<any>
  /**
   * @description Delete button text
   */
  deleteText?: string
  /**
   * @description Triggered when editing is cancelled
   */
  onCancel?: (recordKey: RecordKey, editRow: T, originRow?: T) => Promise<any>
  /**
   * @description Cancel button text
   */
  cancelText?: string
  /**
   * @description Custom action bar in edit mode
   */
  actionRender?: (
    row: T,
    config: ActionRenderConfig<T>,
    defaultDom: ActionRenderDefaultDom
  ) => VNode[]
  /**
   * @description Delete confirmation message
   */
  deletePopconfirmMessage?: string
  /**
   * @description Alert when only one row can be edited at a time
   */
  onlyOneLineEditorAlertMessage?: string
}

export interface AddLineOptions {
  /**
   * @description Add row at top or bottom
   */
  position?: 'top' | 'bottom'
  /**
   * @description Row key for the new line
   */
  recordKey?: RecordKey
  /**
   * @description `cache` removes the row on cancel; `dataSource` keeps it until deleted
   */
  newRecordType?: 'dataSource' | 'cache'
}

export interface NewLineConfig<T extends DefaultRow = DefaultRow> {
  /**
   * @description Default row value
   */
  defaultValue?: T
  /**
   * @description New line options
   */
  options: AddLineOptions
}

export interface ActionRenderDefaultDom {
  save: VNode
  delete: VNode
  cancel: VNode
}

export interface ActionRenderConfig<T extends DefaultRow = DefaultRow> {
  editableKeys?: TableRowEditable<T>['editableKeys']
  setEditableRowKeys: (value: RecordKey[]) => void
  recordKey: RecordKey
  preEditRow: T
  index?: number
  onSave: NonNullable<TableRowEditable<T>['onSave']>
  onDelete?: TableRowEditable<T>['onDelete']
  onCancel: NonNullable<TableRowEditable<T>['onCancel']>
  cancelEditable: (key: RecordKey) => void
  newLineConfig?: NewLineConfig<T>
  saveText?: string | VNode
  deleteText?: string | VNode
  cancelText?: string | VNode
  deletePopconfirmMessage: NonNullable<TableRowEditable<T>['deletePopconfirmMessage']>
  addEditRecord?: (row: T, options?: AddLineOptions) => boolean
  tableName?: string
}

export interface ActionConfig {
  startEditable: (rowKey: RecordKey) => boolean
  cancelEditable: (rowKey: RecordKey) => Promise<boolean>
  addEditRecord: (record: any, newLine?: Partial<RecordCreatorProps<any>>) => void
}

export interface EditableColumnsConfig extends Omit<TableColumnCtx, 'renderCell'> {
  /**
   * @description el-form-item props
   */
  formItemProps?: FormItemProps
  /**
   * @description Field render
   */
  valueType?: string
  /**
   * @description Render field
   */
  renderField?: (data: { form: any, formItem: ProFormItemProps, recordKey: RecordKey, index: number }) => VNode
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
   */
  optionLoader?: () => Promise<Record<string, any>[]>
  /**
   * @description Hide in table?
   */
  hideInTable?: boolean
  /**
   * @description Render el-table header
   */
  renderCellHeader?: (scope: { column: TableColumnCtx<DefaultRow>, $index: number }) => VNode
  /**
   * @description Render el-table cell
   */
  renderCell?: (scope: any, actions?: ActionConfig) => VNode | VNode[]
  /**
   * @description Whether the cell is editable
   */
  editable?: (cellValue: any, record: DefaultRow, index: number) => boolean
  /**
   * @description Read-only cell
   */
  readonly?: boolean  
  /**
   * @description Component key
   */
  key?: string
}

export interface EditableProTableInstance {
  getFormRef: () => FormInstance | undefined
  getTableRef: () => TableInstance | undefined
  validateRow: (index: number) => Promise<boolean>
  getRowData: (rowIndex: number | RecordKey) => DefaultRow | undefined
  getRowsData: () => DefaultRow[]
  setRowData: (rowIndex: number | RecordKey, data: DefaultRow) => void
}
