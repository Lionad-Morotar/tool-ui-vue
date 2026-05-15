# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
