import { computed } from "vue";
import type { FormItemProps } from "../base/pro-form-item/src/pro-form-item";

export function useFieldValue(props: FormItemProps) {
  const getNestedValue = (form: Record<string, any>, prop: string | string[]) => {
    if (typeof prop === 'string') {
      prop = prop.split('.')
    }
    return prop.reduce((acc, cur) => acc[cur], form)
  }

  const setNestedValue = (form: Record<string, any>, prop: string | string[], value: any) => {
    const keys = typeof prop === 'string' ? prop.split('.') : [...prop]
    let current = form
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
  }

  const fieldValue = computed({
    get: () => {
      if (props.formItem.prop) {
        return getNestedValue(props.form, props.formItem.prop)
      }

      return undefined
    },
    set: (val: any) => {
      if (props.formItem.prop) {
        setNestedValue(props.form, props.formItem.prop, val)
      }
    }
  })

  return {
    fieldValue
  }
}