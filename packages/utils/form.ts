import type { ProFormItemProps } from "../types/pro-form-item"

function getNestedValue(prop: string[], initialValue: any): Record<string, any> {
  const [first, ...rest] = prop
  
  if (rest.length === 0) {
    // Last layer { key: initialValue }
    return { [first]: initialValue }
  }
  
  // Recursive
  return { [first]: getNestedValue(rest, initialValue) }
}

const hasValidPath = (prop: string[], initialValues: Record<string, any>): boolean => {
  let current = initialValues
  
  for (let i = 0; i < prop.length; i++) {
    const key = prop[i]

    if (i === prop.length - 1 && /^\d+$/.test(key)) {
      return true
    }
    
    if (!current || !(key in current)) {
      return false
    }
    current = current[key]
  }
  
  return true
}

const hasArrayIndex = (prop: string[]) => prop.some(item => /^\d+$/.test(item))

const getInitialValue = (prop: string[], initialValue: any, initialValues: Record<string, any>) => {
  if (initialValue && !hasArrayIndex(prop)) {
    let current = initialValues

    for (let i = 0; i < prop.length - 1; i++) {
      current = current[prop[i]]
    }
    current[prop[prop.length - 1]] = initialValue
  }

  return initialValues
}

export function getValueByProp(prop: string | string[], initialValue: any, initialValues: Record<string, any>) {
  if (typeof prop === 'string') {
    if (prop.includes('.') === false) {
      return { [prop]: initialValue ?? initialValues[prop] }
    }

    prop = prop.split('.')
  }

  if (prop.length === 0) {
    return {}
  }

  const valid = hasValidPath(prop, initialValues)
  
  // If nested object includes array
  if (hasArrayIndex(prop) && !valid) {
    console.error(`[ProForm] Field prop "${prop.join('.')}" contains array index (e.g., '0', '1'), but no initialValues is provided.`)
    return {}
  }

  // initialValues exists
  if (valid) {
    const deepCopy = deepClone(initialValues)
    return getInitialValue(prop, initialValue, deepCopy)
  }

  // Generate nested structure
  return getNestedValue(prop, initialValue)
}

export function deepMerge(target: Record<string, any>, source: Record<string, any>) {
  if (!source) {
    return target
  }

  if (!target) {
    return source
  }

  const result = { ...target }

  for (const key in source) {
    const sourceVal = source[key]
    const targetVal = target[key]

    if (Object.prototype.toString.call(sourceVal) === '[object Object]') {
      // Recursive
      result[key] = deepMerge(targetVal, sourceVal)
    } else {
      result[key] = sourceVal
    }
  }

  return result
}

function deepClone<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(item => deepClone(item)) as T
  }
  
  if (Object.prototype.toString.call(value) === '[object Object]') {
    const cloned: any = {}
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        cloned[key] = deepClone(value[key])
      }
    }
    return cloned as T
  }
  
  return value
}

export function setOptions(item: ProFormItemProps, cachedOptions: Record<string, any>) {
  const { valueType, prop, valueEnum, optionLoader } = item
  if (valueType !== 'select' && valueType !== 'cascader') {
    return
  }

  item.fieldProps = item.fieldProps || {}

  // If exists options
  if (item.fieldProps.options?.length > 0) {
    return
  }

  // If exists valueEnum
  if (valueEnum) {
    if (valueEnum instanceof Map) {
      item.fieldProps.options = Array.from(valueEnum, ([key, value]) => ({ label: value, value: key }))
    } else {
      item.fieldProps.options = Object.entries(valueEnum).map(([key, value]) => ({ label: value, value: key }))
    }

    return
  }

  // If exists optionLoader
  if (optionLoader) {
    const key = Array.isArray(prop) ? prop.join('.') : prop
    if (key && cachedOptions[key]) {
      item.fieldProps.options = cachedOptions[key]
    }
  }
}