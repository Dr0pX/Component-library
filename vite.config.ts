import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
// @ts-ignore
import postcssEach from 'postcss-each'
import postcssNested from 'postcss-nested'
import {resolve} from "path";
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    dts({
      tsconfigPath: "./tsconfig.build.json"
    }),
  ],
  css: {
    postcss: {
      plugins: [
        postcssEach(),   // 处理 @each 循环
        postcssNested(), // 处理 &:hover 等嵌套
      ]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build:{
    lib:{
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VElement',
      fileName: 'v-element'
    },
    rollupOptions: {
      external: ['vue'],
      output:{
        exports: "named",
        globals: {
          vue: 'Vue'
        },
        assetFileNames: (assetInfo) => {
          // 确保 assetInfo.name 存在再进行比较
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'index.css'
          }
          return '[name][extname]' // 使用占位符是更推荐的做法
        }
      }
    }
  },
})
