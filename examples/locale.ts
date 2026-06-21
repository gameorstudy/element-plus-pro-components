import { computed, ref, watch } from 'vue'
import elementEn from 'element-plus/es/locale/lang/en'
import elementZhCn from 'element-plus/es/locale/lang/zh-cn'
import { en, locale, zhCn } from '@rasmusxiong/element-plus-pro-components'

export type ExampleLocale = 'zh-cn' | 'en'

const localeMap = {
  'zh-cn': {
    element: elementZhCn,
    pro: zhCn,
  },
  en: {
    element: elementEn,
    pro: en,
  },
} as const

const currentLocale = ref<ExampleLocale>('zh-cn')

watch(currentLocale, (key) => {
  locale.use(localeMap[key].pro)
})

export function useExampleLocale() {
  const elementLocale = computed(() => localeMap[currentLocale.value].element)

  const setLocale = (value: ExampleLocale) => {
    currentLocale.value = value
  }

  return {
    currentLocale,
    elementLocale,
    setLocale,
  }
}
