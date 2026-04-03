# External Integrations

**分析日期：** 2026-04-03

## API 与外部服务

**本项目为纯前端组件库，无业务后端 API 集成。**

组件运行时涉及以下外部资源依赖：

**地图 Tile 服务：**
- CartoDB basemaps — `geo-map` 组件默认使用
  - Light theme: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`
  - Dark theme: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
  - 文件: `src/components/geo-map/index.vue`

**语法高亮引擎：**
- Shiki — `code-block` / `code-diff` 组件动态加载
  - 运行时通过 `import('shiki')` 按需加载（`src/components/code-block/index.vue:10`）
  - 使用 `createJavaScriptRegexEngine()` 作为正则引擎
  - 语言包通过 `highlighter.loadLanguage()` 按需加载

**Story / 演示资源（仅文档/示例）：**
- `picsum.photos` — Story 示例中的占位图片
- `cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css` — Histoire 文档站点样式（`src/stories/_shared/histoire-styles.css`）
- `cdn.tailwindcss.com` — Histoire 测试 Story 动态加载（`src/stories/tailwind-test.story.vue`）
- `commondatastorage.googleapis.com` — Story 中示例视频资源

## 数据存储

**数据库：**
- 无

**文件存储：**
- 本地文件系统 — 组件接收 URL/数据，不直接管理存储

**缓存：**
- 无显式缓存层；浏览器原生缓存 Shiki 语言包与地图 tiles

## 认证与身份

**认证提供者：**
- 无 — 纯 UI 组件库，不承担认证职责

## 监控与可观测性

**错误追踪：**
- 无

**日志：**
- 控制台日志限于测试辅助（`src/test/console-guard.ts`）

## CI/CD 与部署

**托管：**
- 未检测到 CI/CD 配置文件（无 `.github/workflows`、无 Dockerfile）

**CI 流水线：**
- 无

**发布流程：**
- 手动或通过外部流程发布 npm package
- 构建产物输出到 `dist/` 目录
- Histoire 文档站点可构建到 `dist-histoire/`

## 环境配置

**必需的环境变量：**
- 无 — 项目本身不依赖环境变量

**Secrets 位置：**
- 无 `.env` 文件

## Webhooks 与回调

**接收：**
- 无

**发送：**
- 无

---

*集成审计：2026-04-03*
