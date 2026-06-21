import { computed, inject, onMounted, reactive, shallowReactive, watch, type Ref } from "vue";
import { formContextKey } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { EditableColumnsConfig, EditableProTableProps } from "../editable-pro-table";

export function useForm(
  props: EditableProTableProps,
  formRef: Ref<FormInstance | undefined>,
) {
  const parentForm = inject(formContextKey, undefined)

  const form = reactive<any>({
    [props.name]: props.dataSource
  })

  watch(
    () => props.dataSource,
    (newValue) => {
      form[props.name] = newValue
    },
  )

  const getFormRef = (): FormInstance | undefined => {
    if (parentForm) {
      return parentForm as unknown as FormInstance
    }
    return formRef.value
  }

  const wrapperComponent = computed(() => (parentForm ? 'div' : 'el-form'))

  const formWrapperProps = computed(() => {
    if (parentForm) {
      return { class: 'editable-pro-table-wrapper' }
    }
    return {
      model: form,
      ...(props.defaultSize ? { size: props.defaultSize } : {}),
    }
  })

  return {
    form,
    getFormRef,
    wrapperComponent,
    formWrapperProps,
  }
}

export function useOptions(props: EditableProTableProps) {
  const cachedOptions = shallowReactive<Record<string, any[]>>({})

  const getOptions = () => {
    const { columns } = props
    for (const column of columns) {
      const { prop, optionLoader } = column
      if (typeof optionLoader === 'function') {
        optionLoader().then(res => {
          cachedOptions[prop] = res
        })
      }
    }
  }

  onMounted(() => {
    getOptions()
  })

  return cachedOptions
}

export function useInitialValues(columns: EditableColumnsConfig[]) {
  return columns
    .reduce((accu, cur) => {
      const { prop } = cur
      if (!prop) {
        return accu
      }

      return {
        ...accu,
        [prop]: undefined
      }
    }, {})
}
