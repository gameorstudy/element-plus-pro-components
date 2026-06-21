import type { App } from 'vue'
import DialogForm from './src/index.vue'

DialogForm.install = (app: App) => {
  app.component(DialogForm.name as string, DialogForm)
}

export default DialogForm
export * from './src/dialog-form'
export type DialogFormInstance = InstanceType<typeof DialogForm>