import type { App } from 'vue'
import ProForm from 'element-plus-pro-components/packages/components/pro-form'
import DialogForm from 'element-plus-pro-components/packages/components/dialog-form'
import ProTable from 'element-plus-pro-components/packages/components/pro-table'
import EditableProTable from 'element-plus-pro-components/packages/components/editable-pro-table'
import locale, { en, zhCn } from 'element-plus-pro-components/packages/locale'

const components = [
  ProForm,
  DialogForm,
  ProTable,
  EditableProTable,
]

export interface ElementPlusProComponentsInstallOptions {
  locale?: typeof zhCn
  i18n?: (path: string) => string | null | undefined
}

const install = (app: App, opts: ElementPlusProComponentsInstallOptions = {}) => {
  if ((install as typeof install & { installed?: boolean }).installed) {
    return
  }

  locale.use(opts.locale)
  if (opts.i18n) {
    locale.i18n(opts.i18n)
  }

  components.forEach((component) => {
    app.component(component.name!, component)
  })

  ;(install as typeof install & { installed?: boolean }).installed = true
}

export default {
  install,
  locale,
  ProForm,
  DialogForm,
  ProTable,
  EditableProTable,
}

export {
  ProForm,
  DialogForm,
  ProTable,
  EditableProTable,
  locale,
  zhCn,
  en,
}

export type {
  ProFormProps,
  ProFormItemProps,
  ProFormSubmitterProps,
  ProFormInstance,
} from 'element-plus-pro-components/packages/components/pro-form'

export type {
  DialogFormProps,
  DialogFormSubmitterProps,
  DialogFormInstance,
} from 'element-plus-pro-components/packages/components/dialog-form'

export type {
  ProTableProps,
  ColumnsConfig,
  SearchConfig,
  ColumnSettings,
  ProTableInstance,
  TableEmits,
} from 'element-plus-pro-components/packages/components/pro-table'

export type {
  EditableProTableProps,
  EditableColumnsConfig,
  EditableProTableInstance,
  RecordKey,
  TableRowEditable,
  ActionConfig,
  RecordCreatorProps,
  AddLineOptions,
  NewLineConfig,
  ActionRenderConfig,
} from 'element-plus-pro-components/packages/components/editable-pro-table'
