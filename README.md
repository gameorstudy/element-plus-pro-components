# element-plus-pro-components

Vue 3 + [Element Plus](https://element-plus.org/) 版 schema 驱动高级组件库，API 对齐 [element-ui-pro-components](https://github.com/gameorstudy/element-ui-pro-components)（Vue 2 + Element UI）。

📖 [文档](https://gameorstudy.github.io/element-plus-pro-components/) · [GitHub](https://github.com/gameorstudy/element-plus-pro-components)

## 组件

| 组件 | 说明 |
| --- | --- |
| **ProForm** | Schema 驱动表单 |
| **DialogForm** | 弹窗表单 |
| **ProTable** | 带搜索、分页、列设置的表格 |
| **EditableProTable** | 可编辑表格 |

## 安装

```bash
pnpm add @rasmusxiong/element-plus-pro-components element-plus vue
# EditableProTable 需要
pnpm add el-table-prepend-next
# ProTable 列设置等图标（建议全局注册）
pnpm add @element-plus/icons-vue
```

### Peer Dependencies

| 包 | 说明 |
| --- | --- |
| `vue` | ^3.5.0 |
| `element-plus` | ^2.13.0 |
| `el-table-prepend-next` | ^1.0.2，**可选**；使用 EditableProTable 时需安装 |
| `@element-plus/icons-vue` | **建议**；ProTable 等组件使用 Element Plus 图标 |

## 快速开始

### 按需引入（推荐）

配合 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) 使用内置 Resolver，ProTable / EditableProTable 会自动引入样式。

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { ElementPlusProComponentsResolver } from '@rasmusxiong/element-plus-pro-components/resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        ElementPlusResolver(),
        ElementPlusProComponentsResolver(),
      ],
    }),
  ],
})
```

模板中直接使用组件，无需手动 import：

```vue
<template>
  <ProTable :columns="columns" :data-source="dataSource" />
</template>
```

### 手动引入

```ts
import { ProForm, ProTable } from '@rasmusxiong/element-plus-pro-components'
// ProTable / EditableProTable 需单独引入样式
import '@rasmusxiong/element-plus-pro-components/es/components/pro-table/style/css'
```

### 全量注册

```ts
import ElementPlusProComponents from '@rasmusxiong/element-plus-pro-components'
import '@rasmusxiong/element-plus-pro-components/es/index.css'

app.use(ElementPlusProComponents)
```

也可通过 JS 入口引入全量样式：

```ts
import '@rasmusxiong/element-plus-pro-components/es/style/css'
```

### 注册 Element Plus 图标

ProTable 列设置等使用了 `<Setting />` 等图标，需在入口全局注册：

```ts
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```

## 国际化

组件内置文案默认中文。多语言项目推荐 **vue-i18n + `locale.i18n()`**：

```ts
import { createI18n } from 'vue-i18n'
import { locale, zhCn, en } from '@rasmusxiong/element-plus-pro-components'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-cn',
  messages: { 'zh-cn': zhCn, en },
})

locale.i18n((path) => {
  const { t, te } = i18n.global
  return te(path) ? t(path) : null
})

// 切换语言
i18n.global.locale.value = 'en'
```

Element Plus 自身文案需单独通过 `el-config-provider` 切换，与 Pro 组件 locale 互不影响。

未使用 vue-i18n 时，也可直接切换内置语言包：

```ts
import { locale, en, zhCn } from '@rasmusxiong/element-plus-pro-components'

locale.use(en) // 或 zhCn
```

## 本地开发

```bash
pnpm install
pnpm dev          # examples  playground
pnpm build:lib    # 构建 es 产物到 es/
```

## 相关项目

- [element-ui-pro-components](https://github.com/gameorstudy/element-ui-pro-components) — Vue 2 + Element UI 版本

## License

MIT
