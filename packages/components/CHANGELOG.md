# @lionad/vtu-components

## 0.3.17-alpha.0

### Patch Changes

- feat(components): 新增 upload 公开组件——handler 注入传输，text/picture-card 双形态

  原子表单层 ui/\* 落地：input、textarea、select、switch、toggle-group、date（date/datetime/range 三模式）、rating、number-field、tags-input 表单原子，PreferencesPanel 偏好项全面接线并集成 rating/number/tags/date 四类新偏好项

  QuestionFlow 选项区改由 reka Listbox 接管交互，修复换步 transition 窗口内 highlight 滞留已卸载元素、键盘焦点无法进入的问题；换步退场快照指示器不再重播入场动画

  fix(components): Select 选项较多时浮层补滚动高度上限，底部选项滚轮与键盘 End 可达；preference-field toggle 分支补组容器无障碍命名；date 原子 datetime 模式补 TimeField 段渲染；PreferencesValue 类型扩展的下游类型对齐

## 0.3.16-alpha.3

### Patch Changes

- fix(components): Image 组件 src 放行根相对路径——states 层本地 sanitizeHref 只收绝对 http(s) URL，宿主经 BFF 代理通道（`/api/...` 根相对路径）喂图时被丢弃致 img 失去 src；改用 core 共享实现（与 video/x-post 同源），相对路径合法、`//` 协议相对与 `javascript:` 仍拦截

## 0.3.16-alpha.2

### Minor Changes

- feat(components): DataTable 缺 `rowIdKey` 时自动探测常见唯一字段兜底——id/uuid/key/name/title/label 取首个每行非空且全量唯一者做行键，流式初帧 `rowIdKey` 尚未到达期间行状态不再随行号漂移；警告仅在显式缺失且探测失败（真落行号）时触发，消除数组增长型流式物料挂载期的误报

## 0.3.16-alpha.1

### Minor Changes

- feat(components): DataTable 内建全屏查看——features.fullscreen 默认开启（显式 false 关闭），useFullscreen 作用根元素随工具栏整体入屏，全屏态解除 maxHeight 有界帽子（根 grid 1fr 行 + h-full 继承链铺满视口，table/cards 双视图各自成滚动区），不支持 Fullscreen API 的环境（如 iPhone Safari）自动隐藏按钮

## 0.3.16-alpha.0

### Patch Changes

- fix(components): Article 展开按钮按真实溢出门控——宿主统一注入默认 maxHeight 后短文章不再挂死钮,scrollHeight 对比上限解析 px(px/vh/rem),未知单位回退恒戴帽旧行为

## 0.3.15

### Patch Changes

- fix(components): DataTable 溢出判定沿触发链检查裁剪祖先——列级 truncate 的 td 比内层 max-w 更紧时,(200,280] 区间文本被视觉截断但 tooltip 漏弹
- fix(components): DataTable 导出 CSV 泄漏 UI 折叠标记——array 列导出完整数据而非 +N 截断

## 0.3.14

### Patch Changes

- fix(components): DataTable 文本截断判定改 hover 时刻测量——修复流式布局/字体晚载下 mount 期一次性测量失效导致截断单元格 tooltip 不弹出的问题

## 0.3.13

### Patch Changes

- fix(components): DataTable 单元格 tooltip 被表格滚动容器 overflow 裁剪——teleport 到 body 改 fixed 定位，hover 提示不再被挡

## 0.3.12

### Patch Changes

- fix(components): DataTable 缺 `rowIdKey` 警告兑现 once 语义——模块级去重，同页多表实例（genui 流式物料常态）各 setup 一次只警一次，不再每实例刷屏淹掉真错误

## 0.3.11

### Patch Changes

- 修复 QuestionFlow / OptionList 内联图标在 runtime-only Vue 构建（Nuxt 等消费端）下不渲染并触发 template 编译告警：字符串模板组件改为 render 函数

## 0.3.10

### Patch Changes

- [`d841052`](https://github.com/Lionad-Morotar/tool-ui-vue/commit/d8410522acbc1ef242158e857fc0e1c1ab432ae2) Thanks [@Lionad-Morotar](https://github.com/Lionad-Morotar)! - fix(components): 全部未命名 group hover 语义改为命名组，防宿主 .group 祖先劫持

  - option-list / question-flow 选项行 hover overlay 改用 group/option：宿主 UI（如聊天消息卡片）带 .group 祖先时，hover 宿主会连带点亮整列选项高亮
  - video / citation / contact-card / link-preview / item-carousel / image-gallery / citation 条目行的 hover 效果同步改为命名组（group/video、group/citation、group/contact、group/link、group/card、group/item）
  - 清理无消费方的 group 类：audio / chart / image / data-table 手风琴行 / item-carousel 容器 / question-flow 退出态克隆

- [`36b5737`](https://github.com/Lionad-Morotar/tool-ui-vue/commit/36b573768a6ee73fa5a7047c57b2f998decfbe2a) Thanks [@Lionad-Morotar](https://github.com/Lionad-Morotar)! - feat(components): 数组 props 渲染层宽容——缺字段渲染空态而非抛错

  - chart / data-table / option-list / parameter-slider / preferences-panel / progress-tracker 的数组类 props 改为可选，组件 withDefaults 缺省空数组（LLM 产出缺字段时渲染空图/空表/空列表）
  - zod 可序列化契约保持必填：usePropsValidator 仍按必填校验并 warn 提示，宽容只发生在渲染层
  - states 层 props 类型收窄为必有（withDefaults 保证），消除 undefined 防御噪音
  - 同步 skills 文档的组件用法说明

## 0.3.9

### Patch Changes

- DataTable 默认 `layout` 由 `auto` 调整为 `table`：未显式指定布局时固定以表格形态渲染

## 0.3.8

### Patch Changes

- [`7416664`](https://github.com/Lionad-Morotar/tool-ui-vue/commit/74166648937f60b8f9f40a00d5669b77843e3330) Thanks [@Lionad-Morotar](https://github.com/Lionad-Morotar)! - 修复聚合层/states 工厂在 setup 同步作用域固化 props（首帧固化）：父层以新引用更新 prop（如流式增量渲染逐帧灌入数据）时组件停在挂载首帧不再重渲染。

  断点形态与修复：

  - 值传参给 MaybeRefOrGetter 型子 composable（data-table 的 useSort/useLayout、parameter-slider 的 useSlider/useDrag/useLayout）→ 聚合层统一 getter 传参
  - 工厂入口解构 options/props（code-block、code-diff、terminal、item-carousel、order-summary）→ 删除解构，computed/watch getter 内改读 options.xxx 收集依赖
  - ref(首帧值) 构造共享状态（image-gallery 的 gallery context）→ computed(toValue)
  - 返回 .value 快照而非 computed 引用（stats-display 的 locale/hasHeader/isSingle、question-flow 的 titleId/descriptionId）→ 返回引用由外层 reactive() 解包
  - 静态配置一次性读取（message-draft 的 undoGracePeriod）→ 每次启动定时器时读最新值

  11 个组件全部补 props-reactivity 回归测试（mount + setProps 新引用断言渲染跟随，修复前均红）；skills 文档 headless-states 设计原则补 getter 传参规范。

## 0.3.7

### Patch Changes

- fix(geo-map): 以 shallowRef 存储 leaflet 模块对象，修复深响应式包装导致的页面崩溃

  leaflet 为 CJS 包，Vite/esbuild 的 interop 包装对象上 default 是只读不可配置属性；
  深 ref 会把模块对象转成 reactive 代理，deep watch 遍历时违反 Proxy invariant 抛 TypeError，
  导致依赖方（如 cx-components-vtu 的 cx-vtu-geo-map 物料）渲染即崩溃

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
