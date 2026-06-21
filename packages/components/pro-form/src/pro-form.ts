import type { FormProps, RowProps } from "element-plus";
import type { ProFormItemProps as FormItemProps } from "element-plus-pro-components/packages/types/pro-form-item";
import type { SubmitterProps } from "./submitter";

export interface ProFormProps {
  /**
   * @description Pro form props
   */
  formProps?: FormProps
  /**
   * @desc el-form class name
   */
  className?: string
  /**
   * @description Form items config
   */
  formItems: ProFormItemProps[]
  /**
   * @description Submitter props
   */
  submitter?: ProFormSubmitterProps
  /**
   * @description If grid or not
   */
  grid?: boolean
  /**
   * @description el-row props
   */
  rowProps?: RowProps
  /**
   * @description Initial values
   */
  initialValues?: Record<string, any>
}

export type ProFormItemProps = FormItemProps

export type ProFormSubmitterProps = SubmitterProps | boolean

export const proFormPropsDefaults = {
  submitter: true,
  rowProps: () => ({ gutter: 8 })
} as const