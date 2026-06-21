# DialogForm

DialogForm 是 ProForm 的一个变体，本质上仍然是个表单。DialogForm 的表现与 ProForm 相同，可以从 ProForm 直接修改而来。

## 基础用法

<script setup>
import DialogFormBasic from '../../examples/views/dialog-form/basic/index.vue'
import demoSource from '../../examples/views/dialog-form/basic/index.vue?raw'
</script>

<ClientOnly>
  <DemoBlock :code="demoSource">
    <DialogFormBasic />
  </DemoBlock>
</ClientOnly>

## API

### DialogForm Attributes

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 弹窗是否可见 | `boolean` | — |
| title | 弹窗标题 | `string` | — |
| width | 弹窗宽度 | `string \| number` | — |
| renderHeader | 自定义 header | `(headerProps?: { titleId?: string, titleClass?: string, close?: () => void }, form?: any) => VNode` | — |
| dialogProps | `el-dialog` 属性 | [DialogProps](https://element-plus.org/zh-CN/component/dialog.html#attributes) | — |
| dialogEvents | `el-dialog` 事件 | `Partial<DialogEmits>` | — |
| formProps | 同 ProForm | [FormProps](https://element-plus.org/zh-CN/component/form.html#form-attributes) | — |
| className | `el-form` 类名 | `string` | — |
| formItems | 同 ProForm | `ProFormItemProps[]` | — |
| submitter | 提交按钮配置 | `boolean \| DialogFormSubmitterProps` | `true` |
| grid | 栅格模式 | `boolean` | — |
| rowProps | 传给 `el-row` | [RowProps](https://element-plus.org/zh-CN/component/layout.html#row-attributes) | `{ gutter: 8 }` |
| initialValues | 表单默认值 | `Record<string, any>` | — |

### DialogForm Events

同 [ProForm Events](./pro-form#proform-events)。

### DialogForm Methods

在 [ProForm Methods](./pro-form#proform-methods) 基础上新增：

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| close | 关闭弹窗 | `() => void` |

### formItemsConfig

同 [ProForm formItemsConfig](./pro-form#formitemsconfig)。

### submitterProps

设置 `submitter={false}` 可隐藏默认按钮。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| cancelText | 取消按钮文本 | `string` | 取消 |
| confirmText | 确定按钮文本 | `string` | 确定 |
| cancelButtonProps | el-button 的 attributes & button 的原生属性 | [ButtonProps](https://element-plus.org/zh-CN/component/button.html#button-attributes) | — |
| confirmButtonProps | el-button 的 attributes & button 的原生属性 | [ButtonProps](https://element-plus.org/zh-CN/component/button.html#button-attributes) | — |
| customRender | 自定义渲染 | `(form: any, actions: RenderActions, doms: VNode[])` | — |

> 不支持通过 footer 来自定义页脚，如果要定义页脚需要使用 submitter.customRender。

> customRender 的第一个参数是表单数据；第二个参数是事件对象；第三个参数是默认的 doms 数组，第一个是取消按钮，第二个是确定按钮。

```ts
interface RenderActions {
  close?: () => void
  submit?: () => void
  reset?: () => void
  resetAllFields: () => void
}
```