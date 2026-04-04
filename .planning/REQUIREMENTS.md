# Requirements: tool-ui-vue Monorepo Refactor

**Defined:** 2026-04-03
**Core Value:** 组件可以通过 `pnpm add @lionad/components` 安装，26 个现有工具组件正常运行且 Zod 契约不变

## v1 Requirements

### Infrastructure

- [ ] **INFRA-01**: pnpm workspace 配置完成，packages/* 可被正确解析
- [ ] **INFRA-02**: packages/core 包结构创建，包含 Vite 库模式构建配置
- [ ] **INFRA-03**: packages/components 包结构创建，依赖 @lionad/core
- [ ] **INFRA-04**: packages/theme 包结构创建，包含设计 tokens 和 CSS 变量
- [ ] **INFRA-05**: 纯 pnpm scripts 构建流程（build/typecheck/test），不使用 Turborepo
- [ ] **INFRA-06**: Root package.json scripts 支持批量构建（pnpm -r build）

### Base Components (P0)

- [ ] **BASE-01**: Button 基础组件实现，使用 cva 变体系统（variant: default/destructive/outline/ghost，size: default/sm/lg）
- [ ] **BASE-02**: Button 支持 asChild/slot 模式，允许外部元素继承 Button 样式
- [ ] **BASE-03**: Card 基础组件实现，包含 Card/CardHeader/CardContent/CardFooter 子组件
- [ ] **BASE-04**: Card 容器样式统一，替代 25 处内联重复

### Base Components (P1)

- [ ] **BASE-05**: Badge 基础组件实现，使用 cva 变体系统（variant: default/secondary/destructive/outline）
- [ ] **BASE-06**: CopyButton 基础组件实现，封装复制到剪贴板逻辑 + 图标状态切换

### Component Migration

- [ ] **MIGR-01**: 26 个工具组件迁移到 packages/components，保持 Zod schemas 不变
- [ ] **MIGR-02**: 工具组件消费 core 基础组件（Button 替代内联按钮样式，Card 替代内联容器样式）
- [ ] **MIGR-03**: 所有现有 Vitest 测试通过
- [ ] **MIGR-04**: 组件支持按需加载（Tree-shaking），named exports

### Theme System

- [ ] **THEME-01**: CSS 变量系统（colors/spacing/radius/shadows），使用 Tailwind v4 @theme 指令
- [ ] **THEME-02**: Light/dark 主题切换支持（data-theme 属性）
- [ ] **THEME-03**: 主题可通过 CSS 变量定制，无需修改组件源码

### Distribution

- [ ] **DIST-01**: packages/components 可通过 pnpm add 安装（本地 workspace 验证）
- [ ] **DIST-02**: 完整 TypeScript 类型声明输出（.d.ts）
- [ ] **DIST-03**: ESM + CJS 双格式输出

## v2 Requirements

Deferred to post-core-stability.

### Nuxt Module

- **NUXT-01**: packages/nuxt-module 实现 Nuxt 3 集成模块
- **NUXT-02**: 自动导入组件（auto-import）
- **NUXT-03**: 组件注册 + Nuxt 特定配置选项

### Documentation

- **DOCS-01**: VitePress 文档站点搭建
- **DOCS-02**: 组件使用文档（含示例代码）
- **DOCS-03**: API 参考文档自动生成

### Release

- **REL-01**: Changesets 版本管理
- **REL-02**: CI/CD 发布 Pipeline
- **REL-03**: CHANGELOG 自动生成

## Out of Scope

| Feature | Reason |
|---------|--------|
| Vue 2 支持 | Vue 2 已停止维护，团队使用 Vue 3 + Nuxt 3 |
| Input/Select/Dialog/Table 基础组件 | 使用频率低（< 3 处），当前阶段不需要独立组件 |
| Turborepo | 3-4 个包不需要，pnpm scripts 足够 |
| 自定义变体系统 | 使用 cva 库替代，成熟且与参考项目一致 |
| 代码生成器方案 | 概念验证性质，短期交付价值不如标准组件库 |
| Storybook | 项目已使用 Histoire，不需要迁移 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Pending |
| INFRA-02 | Phase 1 | Pending |
| INFRA-03 | Phase 1 | Pending |
| INFRA-04 | Phase 1 | Pending |
| INFRA-05 | Phase 1 | Pending |
| INFRA-06 | Phase 1 | Pending |
| BASE-01 | Phase 2 | Pending |
| BASE-02 | Phase 2 | Pending |
| BASE-03 | Phase 2 | Pending |
| BASE-04 | Phase 2 | Pending |
| BASE-05 | Phase 3 | Pending |
| BASE-06 | Phase 3 | Pending |
| THEME-01 | Phase 3 | Pending |
| THEME-02 | Phase 3 | Pending |
| THEME-03 | Phase 3 | Pending |
| MIGR-01 | Phase 4 | Pending |
| MIGR-02 | Phase 4 | Pending |
| MIGR-03 | Phase 4 | Pending |
| MIGR-04 | Phase 4 | Pending |
| DIST-01 | Phase 5 | Pending |
| DIST-02 | Phase 5 | Pending |
| DIST-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0

---
*Requirements defined: 2026-04-03*
*Last updated: 2026-04-03 after roadmap creation*
