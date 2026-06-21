# Schema

ProComponents 的核心是 **Schema 配置**：通过 `valueType`、`fieldProps`、`valueEnum` 等字段描述表单项/列，而不用写大量模板。

## valueType

`valueType` 决定渲染哪种 Element Plus 表单控件：

| valueType | 对应组件 |
| --- | --- |
| `input` | `el-input` |
| `select` | `el-select` |
| `cascader` | `el-cascader` |
| `radio-group` | `el-radio-group` |
| `checkbox-group` | `el-checkbox-group` |
| `input-number` | `el-input-number` |
| `switch` | `el-switch` |
| `time-select` | `el-time-select` |
| `time-picker` | `el-time-picker` |
| `date-picker` | `el-date-picker` |
| `upload` | `el-upload` |
| `rate` | `el-rate` |
| `slot` | 自定义 slot（slot 名为 `prop`） |
| `option` | 操作列（EditableProTable） |

也可通过 `renderField` / `renderFormItem` 完全自定义。

## fieldProps.options

下拉、单选、多选等选项数据放在 **`fieldProps.options`**：

```ts
{
  label: '状态',
  prop: 'status',
  valueType: 'select',
  fieldProps: {
    placeholder: '请选择',
    options: [
      { label: '启用', value: '1' },
      { label: '禁用', value: '0' },
    ],
  },
}
```

也支持 Select [分组选项](https://element-plus.org/zh-CN/component/select.html#option-group)（项内含 `options` 数组）。

## valueEnum

`valueEnum` 用于从枚举快速生成 options，支持 `Object` 或 `Map`：

```ts
// Object
valueEnum: {
  open: '未解决',
  closed: '已解决',
}

// Map
valueEnum: new Map([
  ['open', '未解决'],
  ['closed', '已解决'],
])
```

等价于：

```ts
[
  { label: '未解决', value: 'open' },
  { label: '已解决', value: 'closed' },
]
```

### ProTable 中的 valueEnum

在 ProTable 里要区分两个场景：

| 场景 | 配置 |
| --- | --- |
| 搜索表单下拉 | `fieldProps.options` |
| 表格单元格展示 | `valueEnum`（把 `'1'` 显示成「待处理」） |

## optionLoader

异步加载选项，返回 Promise：

```ts
{
  label: '区域',
  prop: 'region',
  valueType: 'select',
  optionLoader: () => fetchRegions().then(list => list),
}
```

## 初始值

| 配置 | 说明 |
| --- | --- |
| `initialValues` | 表单/搜索区整体初始值 |
| `initialValue` | 单项初始值，**优先级更高** |

## 自定义渲染

| 配置 | 说明 |
| --- | --- |
| `renderLabel` | 自定义 `el-form-item` 的 label |
| `renderField` | 自定义表单控件（值需写回 `form`） |
| `renderFormItem` | 自定义整个 `el-form-item` |
| `renderCell` | 自定义表格单元格 |
| `renderCellHeader` | 自定义表头 |

> `renderField` / `renderFormItem`：若配置了 `prop` 会自动初始化；否则请在 `initialValues` 或 `recordCreatorProps.record` 中补默认值。

## 与 Vue 2 版的差异

- 包名：`@rasmusxiong/element-plus-pro-components`
- 选项写在 `fieldProps.options`（不再使用顶层 `options`）
- 事件/属性命名采用 Vue 3 + Element Plus 风格（如 `labelPosition`、`modelValue`）
