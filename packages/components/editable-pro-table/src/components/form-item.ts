import type { ProFormItemProps } from 'element-plus-pro-components/packages/types/pro-form-item'
import type { RecordKey } from '../editable-pro-table'

type FormItemConfig = Omit<ProFormItemProps, 'prop'> & {
  prop: string
}

export interface FormItemProps {
  formItem: FormItemConfig
  form: Record<string, any>
  name: string
  recordKey?: RecordKey
  index?: number
  formItemProp?: string
}
