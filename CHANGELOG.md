# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
