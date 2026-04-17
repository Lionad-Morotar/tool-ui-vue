# 组件索引

所有组件通过 `@lionad/vtu-components` 导出。每个组件导出：组件、Props 类型、Serializable Schema、parse/safeParse 函数。

详细的 props 和 slots 请使用 MCP server 查询（`pnpm add @lionad/vtu-server`，然后 `npx vtu-mcp-server`）。本文件帮助你找到正确的组件名。

## 数据展示（Data Display）

| Component | 用途 |
|-----------|------|
| `Chart` | 柱状/折线数据可视化，基于 chart.js |
| `DataTable` | 可排序、可筛选的数据表格，支持列分类和格式化 |
| `StatsDisplay` | 统计数值展示，支持 sparkline 和差值显示 |
| `WeatherWidget` | 天气预报卡片，含 WebGL 动画天气效果 |

## 代码与终端（Code & Terminal）

| Component | 用途 |
|-----------|------|
| `CodeBlock` | 语法高亮代码块，基于 Shiki |
| `CodeDiff` | 并排/统一模式的代码 diff 视图 |
| `Terminal` | 终端输出模拟，支持 ANSI 着色 |

## 媒体（Media）

| Component | 用途 |
|-----------|------|
| `Audio` | 音频播放器，含播放控制和进度条 |
| `Image` | 响应式图片，支持宽高比和填充模式 |
| `ImageGallery` | 图片画廊，含网格布局和灯箱浏览 |
| `ItemCarousel` | 水平滚动轮播，展示项目卡片列表 |
| `Video` | 视频播放器，含播放控制和全屏 |

## 社交（Social）

| Component | 用途 |
|-----------|------|
| `ApprovalCard` | 审批决策卡片，含确认/取消操作和元数据展示 |
| `Citation` | 单条引用/参考链接，含弹出详情 |
| `CitationList` | 引用列表，含折叠/展开行为 |
| `InstagramPost` | Instagram 帖子预览卡片 |
| `LinkedInPost` | LinkedIn 帖子预览卡片 |
| `LinkPreview` | 富文本链接预览卡片 |
| `MessageDraft` | 邮件或 Slack 消息草稿预览（discriminated union） |
| `XPost` | X/Twitter 帖子预览卡片，支持引用帖子 |

## 表单与输入（Forms & Input）

| Component | 用途 |
|-----------|------|
| `OptionList` | 可选择列表，支持单选/多选 |
| `ParameterSlider` | 数值参数滑块，含拖拽和刻度 |
| `PreferencesPanel` | 偏好配置面板，含开关/选择项 |

## 工作流（Workflow）

| Component | 用途 |
|-----------|------|
| `GeoMap` | 交互式地图，支持标记、路线和聚合（基于 Leaflet） |
| `Plan` | 计划/待办列表，含状态跟踪和进度庆祝 |
| `ProgressTracker` | 多步骤进度追踪器 |
| `QuestionFlow` | 交互式问答流程，支持渐进/预填/回执三种模式 |
| `OrderSummary` | 订单摘要，含商品列表和价格明细 |

## 核心基础组件（Core Primitives）

| Component | 用途 |
|-----------|------|
| `Button` | 按钮，支持变体（default/destructive/secondary/ghost/outline） |
| `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` | 卡片容器及子组件 |
| `Badge` | 标签，支持变体 |
| `CopyButton` | 复制到剪贴板按钮 |

> 核心组件由 `@lionad/vtu-components` 重导出。
