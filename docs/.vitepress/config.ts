import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vitepress'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const pkgRoot = path.join(root, 'node_modules/@rasmusxiong/element-plus-pro-components')

export default defineConfig({
  title: 'Element Plus Pro Components',
  description: 'Vue 3 + Element Plus schema 驱动高级组件库',
  base: '/element-plus-pro-components/',
  head: [['link', { rel: 'icon', href: '/element-plus-pro-components/favicon.ico' }]],
  markdown: {
    lineNumbers: true,
  },
  vite: {
    plugins: [vueJsx()],
    resolve: {
      alias: [
        {
          find: '@rasmusxiong/element-plus-pro-components/es/index.css',
          replacement: path.join(pkgRoot, 'es/index.css'),
        },
        {
          find: '@rasmusxiong/element-plus-pro-components/es/style/css',
          replacement: path.join(pkgRoot, 'es/style/css.mjs'),
        },
        {
          find: /^@rasmusxiong\/element-plus-pro-components$/,
          replacement: path.join(pkgRoot, 'es/index.mjs'),
        },
      ],
    },
    ssr: {
      noExternal: [
        'element-plus',
        '@element-plus/icons-vue',
        'el-table-prepend-next',
        '@rasmusxiong/element-plus-pro-components',
      ],
    },
  },
  themeConfig: {
    repo: 'gameorstudy/element-plus-pro-components',
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'Schema', link: '/guide/schema' },
      { text: '组件', link: '/components/pro-form' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '国际化', link: '/guide/i18n' },
            { text: 'Schema', link: '/guide/schema' },
          ],
        },
      ],
      '/components/': [
        {
          text: '组件',
          items: [
            { text: 'ProForm', link: '/components/pro-form' },
            { text: 'DialogForm', link: '/components/dialog-form' },
            { text: 'ProTable', link: '/components/pro-table' },
            { text: 'EditableProTable', link: '/components/editable-pro-table' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/gameorstudy/element-plus-pro-components' },
    ],
  },
})
