import type { App } from 'vue'
import EditableProTable from './src/index.vue'

EditableProTable.install = (app: App) => {
  app.component(EditableProTable.name as string, EditableProTable)
}

export default EditableProTable
export * from './src/editable-pro-table'
export type { EditableProTableInstance } from './src/editable-pro-table'
