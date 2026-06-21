import type { ProFormItemProps } from "element-plus-pro-components/packages/types/pro-form-item";

export interface FormItemProps {
  /**
   * @desc Form data
   */
  form: Record<string, any>
  /**
   * @description Form item config
   */
  formItem: ProFormItemProps
}