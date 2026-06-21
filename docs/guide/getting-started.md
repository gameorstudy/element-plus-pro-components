# 快速开始

Element Plus Pro Components 是受 [Ant Design Pro Components](https://procomponents.ant.design/) 启发、面向 Vue 3 + Element Plus 的高级模板组件库。

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

## 按需引入（推荐）

配合 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) 使用内置 Resolver：

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

## 手动引入

```ts
import { ProForm, ProTable } from '@rasmusxiong/element-plus-pro-components'

// ProTable / EditableProTable 需单独引入样式
import '@rasmusxiong/element-plus-pro-components/es/components/pro-table/style/css'
```

## 全量注册

```ts
import ElementPlusProComponents from '@rasmusxiong/element-plus-pro-components'
import '@rasmusxiong/element-plus-pro-components/es/index.css'

app.use(ElementPlusProComponents)
```

也可通过 JS 入口引入全量样式：

```ts
import '@rasmusxiong/element-plus-pro-components/es/style/css'
```

## 注册 Element Plus 图标

ProTable 列设置等使用了 `<Setting />` 等图标，需在入口全局注册：

```ts
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```

## 国际化

详见 [国际化指南](/guide/i18n)。

## 相关文档

- [Schema 配置（valueType / valueEnum）](/guide/schema)
- [国际化](/guide/i18n)

## 相关项目

- [element-ui-pro-components](https://github.com/gameorstudy/element-ui-pro-components) — Vue 2 + Element UI 版本
