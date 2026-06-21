import type { DialogEmits, DialogProps, FormProps, RowProps } from "element-plus"
import type { ProFormItemProps as FormItemProps } from "element-plus-pro-components/packages/types/pro-form-item"
import type { VNode } from "vue"
import type { SubmitterProps } from "./submitter"

interface ProFormProps {
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
  submitter?: DialogFormSubmitterProps
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

export interface DialogFormProps extends ProFormProps {
  /**
   * @description Dialog v-model
   */
  modelValue?: boolean
  /**
   * @description Dialog title
   */
  title?: string
  /**
   * @description Render dialog header
   */
  renderHeader?: (
    headerProps?: {
      titleId?: string
      titleClass?: string
      close?: () => void
    },
    form?: any
  ) => VNode
  /**
   * @description Dialog width
   */
  width?: string | number
  /**
   * @description el-dialog props
   */
  dialogProps?: DialogProps
  /**
   * @description el-dialog events
   */
  dialogEvents?: Partial<DialogEmits>
}

export type ProFormItemProps = FormItemProps

export type DialogFormSubmitterProps = SubmitterProps | boolean

export const dialogFormPropsDefaults = {
  submitter: true,
  rowProps: () => ({
    gutter: 8
  })
} as const