import { onMounted, shallowReactive } from "vue"
import type { ProFormItemProps } from "../types/pro-form-item"

export function useOptions(formItems: ProFormItemProps[]) {
  // Options 对象
  const cachedOptions = shallowReactive<Record<string, any[]>>({})

  const getOptions = () => {
    for (const item of formItems) {
      const { prop, optionLoader } = item
      const key = Array.isArray(prop) ? prop.join('.') : prop
      if (!!key && typeof optionLoader === 'function') {
        optionLoader().then(res => {
          cachedOptions[key] = res
        })
      } 
    }
  }

  onMounted(() => {
    getOptions()
  })

  return cachedOptions
}