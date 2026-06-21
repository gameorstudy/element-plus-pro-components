import type { App } from 'vue'
import ProForm from './src/index.vue'

ProForm.install = (app: App) => {
  app.component(ProForm.name as string, ProForm)
}

export default ProForm
export * from './src/pro-form'
export type ProFormInstance = InstanceType<typeof ProForm>