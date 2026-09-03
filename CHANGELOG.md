# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.17-alpha.1] - 2026-09-03

### Fixed

- resolveLucideIcon 回退命名导出别名并告警未知图标：lucide v1 改名批次（file-edit→file-pen、bar-chart-3→chart-column 等）旧名仅存于命名导出，icons 映射表 miss 后回退查模块命名空间恢复全部向后兼容别名；真未知名渲染占位时补 console.warn（模块级缓存去重，同名仅告警一次）

## [0.3.17-alpha.2] - 2026-09-03

### Added

- QuestionFlow 步骤支持表单字段：fields 复用 PreferencesPanel 字段契约（PreferenceItem），options/fields 二选一交叉校验，required 字段填齐门控推进，返回步骤保留已填值，complete 载荷按步骤类型分化（选项步骤为 optionId 数组、字段步骤为 itemId → 值映射）
- QuestionFlow 步骤 id 唯一性校验，防止重复 id 下选项与字段答案互相覆盖
- Upfront story 新增选项步骤与字段步骤混排、全字段步骤（覆盖全部 12 种字段形态）两个 variant

### Fixed

- select 值文本 shrink-0：窄卡片下 select 与相邻控件争空间时值文字被 flex 压缩逐字换行
- PreferencesPanel 新增 upload 字段类型：上传 handler 经面板 Props 注入（不进 serializable schema），文件传输中禁用 Save 防提交不完整列表，handler 缺省时禁用原子避免 uploading 死态，回执展示文件名列表；Upload 原子 aria 命名通路收敛到 trigger 按钮
- 字段行宽控件（input/textarea/tags/upload/toggle）统一 w-full：无 heading 形态（QuestionFlow 字段步骤）下此前渲染为内容宽

## [0.3.17-alpha.0] - 2026-09-03

### Added

- Upload 公开组件：handler 注入传输，支持 text 与 picture-card 双形态
- 原子表单层落地（reka-ui 底座）：input、textarea、select、switch、toggle-group、date（date/datetime/range 三模式）、rating、number-field、tags-input 十类表单原子，PreferencesPanel 各偏好项全面接线
- PreferencesPanel 集成 rating/number/tags/date 四类新偏好项
- ui/option-indicator 选中指示器原子：radio/checkbox 两形态纯展示，选中态样式与 motion-safe 动画自 QuestionFlow 收敛

### Changed

- QuestionFlow 选项区交互改由 reka Listbox 接管，替代手写 roving tabindex/keydown 实现

### Fixed

- QuestionFlow 换步 transition 窗口内选项全部 disabled 导致 highlight 滞留已卸载元素、键盘焦点无法再进入；换步退场快照指示器不再重播入场动画
- Select 选项较多（约 20 项）时浮层溢出视口，补滚动高度上限后底部选项滚轮与键盘 End 可达
- preference-field toggle 分支补组容器无障碍命名（aria-labelledby）
- date 原子 datetime 模式补 TimeField 段渲染
- PreferencesValue 类型扩展的下游类型对齐
- [internal] select 原子补 [data-slot] 主题覆盖锚点

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
