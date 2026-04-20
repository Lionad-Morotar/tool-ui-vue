# @lionad/vtu-components

## 0.1.2

### Patch Changes

- fix(geo-map): 新增 tileSubdomains prop 修复高德地图瓦片加载失败

  高德地图瓦片 URL `webrd0{s}.is.autonavi.com` 使用数字子域 `1,2,3,4`，
  但 Leaflet 默认使用字母子域 `a,b,c`，导致瓦片请求到无效域名。

  - `GeoMapProps` schema: 新增 `tileSubdomains?: string | string[]`
  - `geo-map-engine.vue`: 将 `tileSubdomains` 透传给 `l-tile-layer` 的 `subdomains` prop
  - `demo-travel.vue`: 传入 `['1','2','3','4']` 匹配高德瓦片子域

## 0.1.0

首次发布。Vue 3 tool call UI 组件库，从 React 版本 `@assistant-ui/tool-ui` 重构为 headless 架构。

### 组件（27 个）

- **媒体**: Audio、Video、Image、ImageGallery（含 GalleryGrid、GalleryLightbox）
- **社交**: XPost、InstagramPost、LinkedInPost
- **代码**: CodeBlock（Shiki 高亮）、CodeDiff、Terminal（ANSI → HTML）
- **数据展示**: StatsDisplay、Chart（Chart.js）、DataTable（排序+分页）
- **地图**: GeoMap（Leaflet + supercluster 聚合）
- **交互**: OptionList、QuestionFlow、PreferencesPanel、ParameterSlider
- **布局**: Plan（可展开步骤）、ProgressTracker、ItemCarousel
- **卡片**: ApprovalCard、OrderSummary、Citation / CitationList
- **表单**: MessageDraft（邮件/Slack 通道）
- **复合**: WeatherWidget（含 WeatherDataOverlay、EffectCompositor、WebGL 特效）
- **工具**: LinkPreview
- **基础**: Badge、Button、Card、CopyButton（core 内嵌）

### 架构

- **Headless composable**: 每个组件由 `states/use*.ts` composable 驱动，视图与逻辑分离
- **Zod schema**: 每个组件提供 `Serializable*Schema`、`parseSerializable*`、`safeParseSerializable*`，可直接校验 LLM 输出
- **CSS 变量**: Tailwind CSS v4 设计令牌（`tokens.css`），通过 CSS 变量覆盖主题
- **i18n**: 内置中文/英文，`setMessages` + `setLocale` 全局切换，`registerEnglish()` 一键切英文
- **CSS 对象 props**: 组件通过 `css` prop 接收样式覆盖，支持 Tailwind 任意值

### 构建

- ESM + CJS 双格式输出
- 完整 `.d.ts` 类型声明（vite-plugin-dts）
- `exports` map: `.`（主入口）、`./tokens.css`

### 从 React 版本迁移的主要改动

- className → css 对象 prop
- PascalCase 子组件移至 `cmpts/` 目录
- React hooks → Vue composable（响应式保留）
- Props 类型由 Zod schema 自动推导
