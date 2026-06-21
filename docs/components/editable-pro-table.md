# EditableProTable

可编辑表格 EditableProTable 与 ProTable 的功能基本相同，为了方便使用 EditableProTable，增加了一些预设，关掉了查询表单、操作栏和分页。

## 基础用法

<script setup>
import EditableProTableBasic from '../../examples/views/editable-pro-table/basic/index.vue'
import demoSource from '../../examples/views/editable-pro-table/basic/index.vue?raw'
</script>

<ClientOnly>
  <DemoBlock :code="demoSource">
    <EditableProTableBasic />
  </DemoBlock>
</ClientOnly>

## API
EditableProTable 在 el-table 上进行了一层封装，支持了一些预设。这里只列出与 el-table 不同的 API。

### EditableProTable Attributes

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| dataSource | 表格数据 | `DefaultRow[]` | — |
| recordCreatorProps | 新建一行数据的相关配置；`false` 隐藏按钮 | `boolean \| RecordCreatorProps` | — |
| maxLength | 最大行数，达到后隐藏新增按钮 | `number` | — |
| editable | 可编辑表格的相关配置 | `TableRowEditable` | — |
| rowKey | 行数据的 Key | `string \| ((row) => string)` | — |
| name | 可编辑表格嵌入表单时，需要校验时必填 | `string` | — |
| className | `el-table` 类名 | `string` | — |
| loading | 加载状态 | `boolean` | — |
| tableProps | `el-table` 属性 | [TableProps](https://element-plus.org/zh-CN/component/table.html#table-attributes) | — |
| tableEvents | `el-table` 事件 | [TableEmits](https://element-plus.org/en-US/component/table#table-events) | — |
| columns | 列定义 | `EditableColumnsConfig[]` | — |
| defaultSize | 默认组件尺寸 | `'' \| 'large' \| 'default' \| 'small'` | — |

```ts
type DefaultRow = Record<string | number | symbol, any>
```

### EditableProTable Methods

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| getFormRef | 获取内部表单 ref | `() => FormInstance \| undefined` |
| getTableRef | 获取 `el-table` ref | `() => TableInstance \| undefined` |
| validateRow | 校验指定行 | `(index: number) => Promise<boolean>` |
| getRowData | 获取行数据 | `(rowIndex: number \| RecordKey) => DefaultRow \| undefined` |
| getRowsData | 获取全部行数据 | `() => DefaultRow[]` |
| setRowData | 设置行数据 | `(rowIndex: number \| RecordKey, data: DefaultRow) => void` |

### recordCreatorProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| position | 顶部添加还是末尾添加 | `'top' \| 'bottom'` | `bottom` |
| newRecordType | 新增一行的方式，默认是缓存，取消后就会消失。设置为 `dataSource`，取消后也不会消失，只能删除 | `'dataSource' \| 'cache'` | `cache` |
| record | 新增行的默认值 | `T \| ((index, dataSource) => T)` | — |
| creatorButtonText | 设置按钮文案 | `string` | `添加一行数据` |
| style | 按钮的样式设置，可以设置按钮是否显示，这样可以做最大行限制和最小行限制之类的功能 | `CSSProperties` | — |
| buttonProps | `el-button` props | [ButtonProps](https://element-plus.org/zh-CN/component/button.html#button-attributes) | — |
| onlyAddOneLineAlertMessage | 只能同时新增一行的提示，`newRecordType` 设置 `cache` 时会校验 | `string` | `只能新增一行` |

新增一行的时候要保证 `recordCreatorProps.record` key 唯一，不然会导致编辑出错。
```tsx
<EditableProTable
  rowKey="id"
  :recordCreatorProps={
    // 每次新增的时候需要Key
    record: () => ({ id: getNewId() }),
  }
/>
```

### editable

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 可编辑表格的类型，单行编辑或者多行编辑 | `'single' \| 'multiple'` | `single` |
| editableKeys | 正在编辑的行，受控属性。 默认 `key` 会使用 `rowKey` 的配置，如果没有配置会使用 `index`，建议使用 `rowKey` | `RecordKey[]` | — |
| onChange | 行数据被修改的时候触发 | `(editableKeys: RecordKey[], editableRows: T[]) => void` | — |
| onSave | 保存一行的时候触发 | `(recordKey: RecordKey, editRow: T, originRow?: T) => Promise<any>` | — |
| saveText | 保存一行的文字 | `string` | `保存` |
| onDelete | 删除一行的时候触发 | `(recordKey: RecordKey, editRow: T) => Promise<any>` | — |
| deleteText | 删除按钮文本 | `string` | `删除` |
| onCancel | 取消编辑一行时触发 | `(recordKey: RecordKey, editRow: T, originRow?: T) => Promise<any>` | — |
| cancelText | 取消按钮文本 | `string` | `取消` |
| actionRender | 自定义编辑模式的操作栏 | `( row: T, config: ActionRenderConfig<T>, defaultDom: ActionRenderDefaultDom ) => VNode[]` | — |
| deletePopconfirmMessage | 删除时弹出的确认框提示消息 | `string` | `删除此项？` |
| onlyOneLineEditorAlertMessage | 只能编辑一行的的提示 | `string` | `只能同时编辑一行` |

```ts
interface ActionRenderDefaultDom {
  save: VNode
  delete: VNode
  cancel: VNode
}

interface ActionRenderConfig<T extends DefaultRow = DefaultRow> {
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

interface ActionConfig {
  startEditable: (rowKey: RecordKey) => boolean
  cancelEditable: (rowKey: RecordKey) => Promise<boolean>
  addEditRecord: (record: any, newLine?: Partial<RecordCreatorProps<any>>) => void
}
```

### columnsConfig

在 el-table-column attributes 的基础上新增了以下 API。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| formItemProps | 编辑态 `el-form-item` 配置 | [FormItemProps](https://element-plus.org/zh-CN/component/form.html#form-item-attributes) | — |
| valueType | 表单元素类型；`option` 为操作列 | 见 [valueType](/guide/schema#valuetype) | — |
| renderField | 自定义编辑单元格 | `(data: { form: any, formItem: ProFormItemProps, recordKey: RecordKey, index: number }) => VNode` | — |
| fieldProps | 表单元素 props | `Record<string, any>` | — |
| fieldEvents | 表单元素 events | `Record<string, any>` | — |
| valueEnum | 选择器枚举 / 只读展示 | `Record \| Map` | — |
| optionLoader | 异步加载选项 | `() => Promise<Record<string, any>[]>` | — |
| hideInTable | 在表格隐藏 | `boolean` | — |
| renderCellHeader | 自定义表头 | `(scope: { column: TableColumnCtx<DefaultRow>, $index: number }) => VNode` | — |
| renderCell | 自定义表格内容，操作栏多一个 <code>actions</code> | `(scope: any, actions?: ActionConfig) => VNode \| VNode[]` | — |
| editable | 是否可编辑 | `(cellValue: any, record: DefaultRow, index: number) => boolean` | — |
| readonly | 只读 | `boolean` | — |
| key | vue 需要的 key，如果是 `type: index\|selection\|expand` 或已经设置了唯一的 `prop`，可以忽略这个属性 | `string` | — |

> 表单元素绑定 `column.prop`；操作列需 `valueType: 'option'`。

> `fieldEvents` 封装了一层，添加了一个额外的 `options` 对象实参，包含了 `recordKey`、`row` 和 `index` 等 `key`。

### valueType slot

| name | 描述 |
| --- | --- |
| `[prop]` | 自定义编辑单元格，参数 ` { form: any, formItem: ProFormItemProps, recordKey: RecordKey, index: number }` |
