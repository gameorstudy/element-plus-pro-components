import type { ColProps, FormItemProps } from "element-plus";
import type { VNode } from "vue";
import type { RecordKey } from "./table";

export interface ProFormItemProps extends FormItemProps {
  /**
   * @description Render el-form-item label
   * @returns {VNode}
   */
  renderLabel?: () => VNode
  /**
   * @description Field render
   */
  valueType?: string
  /**
   * @description Render field
   * @param {Object} form form data
   * @param {ProFormItemProps} formItem form item config
   * @returns 
   */
  renderField?: ({ form, formItem, recordKey, index }: { form: any, formItem: ProFormItemProps, recordKey?: RecordKey, index?: number }) => VNode
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
   * @description el-col props
   */
  colProps?: ColProps
  /**
   * @description If hide in form
   */
  hideInForm?: boolean
  /**
   * @description el-form-item slot, slot names prop when setting truthy
   */
  customSlot?: boolean | string
  /**
   * @description Render el-form-item
   * @param {Object} form form data
   * @returns {VNode}
   */
  renderFormItem?: (form: Record<string, any>) => VNode
  /**
   * @description Key of component
   */
  key?: string
}