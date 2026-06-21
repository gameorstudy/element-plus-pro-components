import type { VNode } from "vue"

export interface RenderActions {
  close?: () => void
  submit?: () => void
  reset?: () => void
  resetAllFields: () => void
}

export type CustomRender = (form: any, actions: RenderActions, doms: VNode[]) => VNode[]