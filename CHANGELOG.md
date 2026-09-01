# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.16] - 2026-09-01

### Added

- DataTable 列拖拽重排、列宽拖拽调整与 CSV 导出
- DataTable 内建全屏查看：`features.fullscreen` 默认开启，全屏态解除 maxHeight 高度限制
- DataTable 行选择：`selectable` 开启多选勾选列（表头全选/半选，排序后选中按 rowId 保持），支持 `'single'` 单选模式；cards 视图与 table 视图共享选择状态，`selectionChange` 上抛 rowId 数组
- DataTable 缺 `rowIdKey` 时探测常见唯一字段兜底（id/uuid/key/name/title/label 取首个全行非空且唯一者）

### Changed

- 数组 props 渲染层宽容——缺字段渲染空态而非抛错

### Fixed

- DataTable 文本溢出 tooltip 判定与定位：hover 时刻测量截断、沿触发链检查裁剪祖先、tooltip teleport 到 body 防滚动容器裁剪
- DataTable 导出 CSV 泄漏 UI 折叠标记——array 列导出完整数据而非 +N 截断
- DataTable 缺 rowIdKey 警告兑现 once 语义——模块级去重，同页多表实例不再刷屏
- Article 展开按钮按真实溢出门控
- Image 组件 src 放行根相对路径
- StatsDisplay 三项改为一行三等分——网格列数按项数收敛，修复 3/5 项时末行出现半行孤儿单元格
- 内联图标改 render 函数，消除 runtime-only Vue 下 template 字符串告警
- 全部未命名 group hover 语义改为命名组，防宿主 .group 祖先劫持
- [internal] code-block 补 pierre 主题模块类型声明

## [0.3.9] - 2026-08-07

### Changed

- DataTable 默认 `layout` 由 `auto` 调整为 `table`：未显式指定布局时固定以表格形态渲染

### Fixed

- [internal] histoire story watcher 的 ignore 列表补字面 dot 目录（`.output`、`.nitro` 等），修复 packages/site Nuxt 构建产物被 chokidar 递归监视导致的 dev 启动 EMFILE 崩溃

## [0.3.8] - 2026-07-28

### Fixed

- 修复 11 个组件 states 层 props 首帧固化：setup 同步作用域以值/解构/`.value` 快照接收 props，父层以新引用更新数据（如流式增量渲染逐帧灌入）时组件固化在挂载首帧；聚合层统一改 getter 传参，并补 props-reactivity 回归测试

## [0.3.7] - 2026-07-23

### Fixed

- GeoMap 引擎以 shallowRef 存储 leaflet 模块对象，修复深响应式包装 CJS interop 只读属性导致的页面崩溃

## [0.3.6] - 2026-05-26

### Fixed

- OptionList label 文本居中对齐

## [0.3.5] - 2026-05-23

### Added

- StatsDisplay 新增 `unit` 与 `boolean` format 支持

## [0.3.4] - 2026-05-22

### Added

- Article 组件：支持 Markdown/HTML 渲染（marked + DOMPurify）、封面图、作者信息、标签、星级评分与可折叠内容

## [0.3.3] - 2026-05-22

### Added

- PreferencesPanel 新增 `textarea` 类型偏好项，支持多行文本输入

### Fixed

- DataTable 文本 tooltip 仅在内容溢出时显示，避免无截断单元格误触发 tooltip
- DataTable maxHeight 与折叠状态下的 overflow 行为

## [0.3.2] - 2026-05-21

### Fixed

- PreferencesPanel toggle 选项容器支持 `flex-wrap` 自动换行与 `justify-end` 右对齐
- PreferencesPanel toggle 布局与 input 保持一致：纵向排列，label/description 独占一行，按钮组独占一行

## [0.3.1] - 2026-05-20

### Fixed

- 为 label/dt 元素添加 `shrink-0` 防止 flex 收缩截断
- 为所有 icon 添加 `shrink-0` 防止 flex 收缩变形
- 修复 approval-card icon 异步加载测试 + catalog 组件数量断言

## [0.3.0] - 2026-05-19

### Added

- 异步 Lucide 图标加载机制，修复 OptionList "lucide:xxx" 图标显示为首字母的问题
- DataTable 默认文本单元格截断 + hover tooltip 显示完整内容

## [0.2.2] - 2025-05-15

### Fixed

- 修复 v0.2.1 发布的 dist 构建产物缺少 PreferencesPanel input 类型（源码正确但构建遗漏）

## [0.2.1] - 2025-05-15

### Added

- DataTable 数组溢出项增加 hover tooltip，显示被截断的具体内容
- PreferencesPanel 新增 `input` 类型偏好项，支持 text/tel/email/url/number 输入

### Added

- 布局原语组件：Stack、Card、Text、Button、Badge、Input、ListItem，随 renderer 默认安装即可使用
- 独立的 `primitives/` 模块，支持单独导入 primitiveEntries 或 primitivesCatalog

### Fixed

- 修复 SSR 环境下 LocaleProvider 跨请求 locale 污染问题（watch 同步改为仅客户端执行）
- 修复 useI18n 注入类型为 ComputedRef 而非 I18nContext 导致的响应性丢失
