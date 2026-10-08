# V-Element

基于 Vue 3 的轻量级组件库项目，参考 Element Plus 的设计规范，从零实现一套包含 10+ 个核心组件的 UI 组件库。

项目以组件设计、交互逻辑、表单校验、工程化构建和组件文档为主要实践方向，适合作为前端工程化与组件库开发的学习项目及简历项目展示。

## 项目亮点

- 使用 Vue 3、TypeScript 和 Vite 搭建组件库开发环境，采用 `<script setup>` 和组合式 API 编写组件。
- 实现 Button、Input、Select、Form、Message、Collapse、Dropdown、Tooltip、Switch、Alert、Icon 等核心组件。
- Select 支持远程搜索防抖、过滤搜索、加载状态、清空操作，以及 Enter、Escape、ArrowUp、ArrowDown 等键盘导航逻辑。
- 基于 Vue Provide/Inject 构建 Form 与 FormItem 的嵌套通信机制，结合 Async-validator 实现表单规则校验、触发器匹配和异步校验状态管理。
- 封装 Message 命令式调用 API，使用 Vue 的 `h` 与 `render` 函数脱离模板动态挂载组件，并实现实例管理、层级控制和批量关闭。
- 使用 Vitest 和 Vue Test Utils 编写组件测试，通过 Mock/Stub 隔离第三方依赖和复杂渲染场景。
- 使用 PostCSS 处理嵌套样式，使用 Rollup/Vite 输出 ES Module 与 UMD 多格式构建产物。
- 使用 VitePress 搭建交互式组件文档，提供组件示例、API 说明和在线预览。

## 技术栈

Vue 3 · TypeScript · Vite · Vitest · VitePress · PostCSS · Rollup · Async-validator · Vue Test Utils · Popper.js

## 在线文档与本地预览

项目文档通过 VitePress 启动。安装依赖后执行：

```bash
npm install
npm run docs:dev
```

启动成功后，打开终端输出的本地地址进入文档主页。进入主页后，请点击「开始使用」按钮，才能看到部分组件的交互展示和示例页面。

其他文档命令：

```bash
# 构建静态文档
npm run docs:build

# 预览构建后的静态文档
npm run docs:preview
```

## 开发与构建

```bash
# 启动组件库开发环境
npm run dev

# 类型检查并构建项目
npm run build

# 分别构建 ES Module 和 UMD 产物
npm run build-es
npm run build-umd

# 运行测试
npm test
```

## 组件目录

组件源码位于 `src/components`，目前包括：

`Alert`、`Button`、`Collapse`、`Dropdown`、`Form`、`Icon`、`Input`、`Message`、`Select`、`Switch`、`Tooltip`。

文档示例位于 `docs/demo`，组件说明位于 `docs/components`。

## 项目结构

```text
├─ docs/                  # VitePress 文档与组件示例
├─ src/
│  ├─ components/         # 组件源码、类型定义、样式与测试
│  ├─ hooks/              # 通用组合式逻辑
│  ├─ styles/             # 全局样式与设计变量
│  └─ index.ts            # 组件库入口
├─ vite.config.ts         # 开发与默认构建配置
├─ vite.es.config.ts      # ES Module 构建配置
├─ vite.umd.config.ts     # UMD 构建配置
└─ vitest.config.ts       # 单元测试配置
```

## 项目定位

这是一个以组件库源码实现为核心的工程实践项目，重点体现以下能力：

- Vue 3 组件抽象与可复用 API 设计
- TypeScript 类型建模与组件通信
- 复杂交互场景下的异步、键盘和状态管理
- 表单校验系统与第三方库集成
- 单元测试、依赖隔离和构建产物发布
- VitePress 组件文档与示例工程建设
