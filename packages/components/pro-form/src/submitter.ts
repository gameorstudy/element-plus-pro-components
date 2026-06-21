import type { ButtonProps } from "element-plus"
import type { CustomRender } from "element-plus-pro-components/packages/types/form"
import type { ButtonHTMLAttributes } from "vue"

type SubmitterButtonProps = ButtonProps & Omit<ButtonHTMLAttributes, keyof ButtonProps>

export interface SubmitterProps {
  /**
   * @description Reset button text
   */
  resetText?: string
  /**
   * @description Submit button text
   */
  submitText?: string
  /**
   * @description Reset button props
   */
  resetButtonProps?: SubmitterButtonProps
  /**
   * @description Submit button props
   */
  submitButtonProps?: SubmitterButtonProps
  /**
   * @description Render
   */
  customRender?: CustomRender
}