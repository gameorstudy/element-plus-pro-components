import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import checker from 'vite-plugin-checker'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    checker({
      typescript: {
        tsconfigPath: './tsconfig.app.json'
      },
      vueTsc: {
        tsconfigPath: './tsconfig.app.json'
      },
      overlay: true,
      terminal: true
    })
  ],
  resolve: {
    alias: {
      'element-plus-pro-components': path.resolve(__dirname),
      '@rasmusxiong/element-plus-pro-components': path.resolve(__dirname, 'packages/index.ts'),
    }
  }
})
