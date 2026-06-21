# ProForm

ProForm 是一个支持动态配置的高级表单组件，减少了模板语法，使表单开发更简单。

## 基础用法

<script setup>
import ProFormBasic from '../../examples/views/pro-form/basic/index.vue'
import demoSource from '../../examples/views/pro-form/basic/index.vue?raw'
</script>

<ClientOnly>
  <DemoBlock :code="demoSource">
    <ProFormBasic />
  </DemoBlock>
</ClientOnly>

## API

ProForm 在 `el-form` 上进行了一层封装，支持了一些预设。

### ProForm Attributes

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| formProps | `el-form` 属性配置 | [FormProps](https://element-plus.org/zh-CN/component/form.html#form-attributes) | — |
| className | `el-form` 类名 | `string` | — |
| formItems | 列定义 | `ProFormItemProps[]` | — |
| submitter | 提交按钮区域配置 | `boolean \| ProFormSubmitterProps` | `true` |
| grid | 开启栅格化模式 | `boolean` | — |
| rowProps | 开启 `grid` 时传给 `el-row` | [RowProps](https://element-plus.org/zh-CN/component/layout.html#row-attributes) | `{ gutter: 8 }` |
| initialValues | 表单默认值 | `Record<string, any>` | — |

### ProForm Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| onFinish | 提交表单且数据验证成功后回调事件 | `(values: Record<string, any>) => void` |
| onError | 提交表单数据验证失败后的回调事件 | `(error: unknown) => void` |
| onReset | 点击重置按钮的回调，此时数据已重置完成 | `() => void` |

### ProForm Methods

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| getFormRef | 获取 `el-form` 的 ref | `() => FormInstance \| undefined` |
| getForm | 获取表单数据 | `() => Record<string, any>` |
| setFieldsValue | 批量更新表单数据 | `(values: Record<string, any>) => void` |
| setFieldValue | 更新单个字段 | `(key: string, value: any) => void` |
| submit | 手动提交 | `() => void` |
| reset | 手动重置 | `() => void` |
| resetAllFields | 重置表单的拓展方法，过滤了非初始化收集的字段 | `() => void` |

### formItemsConfig

继承 `el-form-item` 的 [FormItemProps](https://element-plus.org/zh-CN/component/form.html#form-item-attributes)，并扩展（详见 [Schema 说明](/guide/schema)）：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| renderLabel | 自定义 `label`，不支持 slot | `() => VNode` | — |
| valueType | 表单元素类型；`slot` 表示自定义 | [valueType](/guide/schema#valuetype) \| `slot` | — |
| renderField | 自定义表单元素 | `({ form: any, formItem: ProFormItemProps, recordKey?: RecordKey, index?: number }) => VNode` | — |
| fieldProps | 表单元素 props（如 `el-input` 的 props） | `Record<string, any>` | — |
| fieldEvents | 表单元素 events | `Record<string, any>` | — |
| valueEnum | 选择器枚举，自动生成 options | [valueEnum](/guide/schema#valueenum) | — |
| optionLoader | 异步加载选择器/级联选项 | `() => Promise<Record<string, any>[]>` | — |
| initialValue | 单项默认值，优先级高于 `initialValues` | `any` | — |
| colProps | 开启 `grid` 时传给 `el-col` | [ColProps](https://element-plus.org/zh-CN/component/layout.html#col-attributes) | — |
| hideInForm | 在表单中隐藏 | `boolean` | — |
| customSlot | 自定义 `el-form-item`；`true` 时默认 slot 名为 `prop` | `boolean \| string` | — |
| renderFormItem | 自定义整个 `el-form-item` | `(form: any) => VNode` | — |
| key | 组件 key | `string` | — |

> `fieldProps.options` 用于选择器、单选框组、多选框组的数据，格式同 Element Plus [Select 选项](https://element-plus.org/zh-CN/component/select.html)。

> `renderField` / `renderFormItem`：若配置了 `prop`，会参与表单初始化；否则请在 `initialValues` 中提供默认值。

### submitterProps

设置 `submitter={false}` 可隐藏默认提交按钮。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| resetText | 重置按钮文本 | `string` | 重置 |
| submitText | 提交按钮文本 | `string` | 提交 |
| resetButtonProps | el-button 的 attributes & button 的原生属性 | [ButtonProps](https://element-plus.org/zh-CN/component/button.html#button-attributes) | — |
| submitButtonProps | el-button 的 attributes & button 的原生属性 | [ButtonProps](https://element-plus.org/zh-CN/component/button.html#button-attributes) | — |
| customRender | 自定义渲染 | `(form: any, actions: RenderActions, doms: VNode[])` | — |

```ts
interface RenderActions {
  close?: () => void
  submit?: () => void
  reset?: () => void
  resetAllFields: () => void
}
```

### valueType slot

| name | 描述 |
| --- | --- |
| `[prop]` | 自定义表单项，参数 `{ form }` |

### el-form-item slot
<table style="display: table">
  <tr>
    <th style="width: 60px">name</th>
    <th>描述</th>
  </tr>
  <tr>
    <td>customSlot</td>
    <td>自定义 el-form-item，参数为 ({ form })</td>
  </tr>
</table>
