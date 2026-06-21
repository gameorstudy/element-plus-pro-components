export interface ElementPlusProComponentsResolverOptions {
  /**
   * Import component styles with on-demand usage.
   * @default true
   */
  importStyle?: boolean
}

export interface ComponentResolver {
  type: 'component'
  resolve: (name: string) =>
    | {
        name?: string
        from: string
        sideEffects?: string
      }
    | undefined
    | Promise<
        | {
            name?: string
            from: string
            sideEffects?: string
          }
        | undefined
      >
}

const COMPONENT_MAP = {
  ProForm: {
    dir: 'pro-form',
    style: false,
  },
  DialogForm: {
    dir: 'dialog-form',
    style: false,
  },
  ProTable: {
    dir: 'pro-table',
    style: true,
  },
  EditableProTable: {
    dir: 'editable-pro-table',
    style: true,
  },
} as const

type ComponentName = keyof typeof COMPONENT_MAP

export function ElementPlusProComponentsResolver(
  options: ElementPlusProComponentsResolverOptions = {},
): ComponentResolver {
  const importStyle = options.importStyle ?? true

  return {
    type: 'component',
    resolve(name: string) {
      const config = COMPONENT_MAP[name as ComponentName]
      if (!config) {
        return
      }

      return {
        name,
        from: '@rasmusxiong/element-plus-pro-components',
        sideEffects: importStyle && config.style
          ? `@rasmusxiong/element-plus-pro-components/es/components/${config.dir}/style/css`
          : undefined,
      }
    },
  }
}
