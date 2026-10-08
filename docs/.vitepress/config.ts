import { defineConfig } from 'vitepress'
import path from 'node:path' // 引入 path
import { containerPreview, componentPreview } from "@vitepress-demo-preview/plugin";
import postcssEach from 'postcss-each'
import postcssNesting from 'postcss-nesting'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  vite:{
    resolve: {
      alias: {
        // 使用 __dirname 配合 path.resolve
        '@': path.resolve(__dirname, '../../src')
      }
    },
    css: {
      postcss: {
        plugins: [
          postcssEach(),    // 处理 @each
          postcssNesting(), // 处理 & 嵌套
        ]
      }
    }
  },
  markdown:{
    config(md) {
      md.use(containerPreview)
      md.use(componentPreview)
    }
  },
  srcDir: 'components',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: 'Basic',
        items:[
          { text: 'Button', link: '/button' },
          { text: 'Input', link: '/input' },
          { text: 'Switch', link: '/switch' },
          { text: 'Select', link: '/select' },
          { text: 'Form', link: '/form' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
