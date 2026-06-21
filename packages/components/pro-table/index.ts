import type { App } from 'vue'
import ProTable from './src/index.vue'

ProTable.install = (app: App) => {
  app.component(ProTable.name as string, ProTable)
}

export default ProTable
export * from './src/pro-table'
export type { ProTableInstance } from './src/pro-table'