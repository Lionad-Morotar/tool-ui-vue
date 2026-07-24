# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.3] - 2026-07-24

### Added

- 样式集成故障排查：补充 `style.css` 注入顺序、`@theme` 作用域与 monorepo 传递依赖解析问题
- 组件索引新增 ContactCard 说明

### Changed

- 明确本 skill 不通过 npm 发布，安装方式改为 `npx skills add Lionad-Morotar/tool-ui-vue` 或指定子目录路径
- 移除 `package.json` 中的 npm 发布字段（`publishConfig`、`scripts.release` 等）
