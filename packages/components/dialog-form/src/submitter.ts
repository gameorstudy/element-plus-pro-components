import type { ButtonProps } from "element-plus"
import type { CustomRender } from "element-plus-pro-components/packages/types/form"
import type { ButtonHTMLAttributes } from "vue"

type SubmitterButtonProps = ButtonProps & Omit<ButtonHTMLAttributes, keyof ButtonProps>

export interface SubmitterProps {
  /**
   * @description Cancel button text
   */
  cancelText?: string
  /**
   * @description Confirm button text
   */
  confirmText?: string
  /**
   * @description Cancel button props
   */
  cancelButtonProps?: SubmitterButtonProps
  /**
   * @description Confirm button props
   */
  confirmButtonProps?: SubmitterButtonProps
  /**
   * @description Render
   */
  customRender?: CustomRender
}