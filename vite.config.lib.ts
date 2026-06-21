import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vite'

const root = fileURLToPath(new URL('.', import.meta.url))
const packagesRoot = path.resolve(root, 'packages')

export default defineConfig({
  publicDir: false,
  plugins: [
    vue(),
    vueJsx(),
    dts({
      tsconfigPath: './tsconfig.lib.json',
      include: ['packages/**/*'],
      exclude: ['examples/**'],
      outDir: 'es',
      entryRoot: packagesRoot,
      insertTypesEntry: false,
      copyDtsFiles: true,
      cleanVueFileName: true,
      logLevel: 'error',
    }),
  ],
  resolve: {
    alias: {
      'element-plus-pro-components': root,
    },
  },
  build: {
    outDir: 'es',
    emptyOutDir: true,
    cssCodeSplit: true,
    lib: {
      entry: {
        index: path.resolve(packagesRoot, 'index.ts'),
        'resolver/index': path.resolve(packagesRoot, 'resolver/index.ts'),
        'components/pro-table/style/css': path.resolve(
          packagesRoot,
          'components/pro-table/style/css.ts',
        ),
        'components/editable-pro-table/style/css': path.resolve(
          packagesRoot,
          'components/editable-pro-table/style/css.ts',
        ),
        'style/css': path.resolve(packagesRoot, 'style/css.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) => {
        if (id === 'vue') {
          return true
        }
        if (id === 'element-plus' || id.startsWith('element-plus/')) {
          return true
        }
        if (id === '@element-plus/icons-vue' || id.startsWith('@element-plus/icons-vue/')) {
          return true
        }
        if (id === 'el-table-prepend-next' || id.startsWith('el-table-prepend-next/')) {
          return true
        }
        return false
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: packagesRoot,
        entryFileNames: '[name].mjs',
        chunkFileNames: '[name].mjs',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? assetInfo.name ?? 'asset'
          if (name.endsWith('.css')) {
            return '[name][extname]'
          }
          return 'assets/[name][extname]'
        },
      },
    },
  },
})
