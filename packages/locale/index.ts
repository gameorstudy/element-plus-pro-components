import { ref } from 'vue'
import zhCn from './lang/zh-cn'

export { default as zhCn } from './lang/zh-cn'
export { default as en } from './lang/en'

type Locale = typeof zhCn

const lang = ref<Locale>(zhCn)

let i18nHandler: ((path: string) => string | null | undefined) | null = null

function translate(path: string): string {
  if (i18nHandler) {
    const value = i18nHandler(path)
    if (value != null) {
      return value
    }
  }

  const array = path.split('.')
  let current: Record<string, unknown> | string | undefined = lang.value

  for (let i = 0; i < array.length; i++) {
    const property = array[i]
    const value = typeof current === 'object' && current !== null
      ? current[property]
      : undefined

    if (i === array.length - 1) {
      return typeof value === 'string' ? value : path
    }

    if (value == null || typeof value !== 'object') {
      return path
    }

    current = value as Record<string, unknown>
  }

  return path
}

export function use(l?: Locale) {
  if (l) {
    lang.value = l
  }
}

export function i18n(fn: (path: string) => string | null | undefined) {
  i18nHandler = fn
}

export function useProLocale() {
  return {
    locale: lang,
    lang,
    t(path: string) {
      lang.value
      return translate(path)
    },
  }
}

export const locale = {
  use,
  i18n,
}

export default locale
