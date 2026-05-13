# i18n 中心化 → 组件独立迁移计划

## 现状调研

### 当前架构

- **中心化 locale 文件**：`packages/core/src/i18n/locales/zh-CN.ts` + `en.ts`，包含 **全部 28 个组件** 的翻译条目
- **组件级 locale 文件**：12 个组件已有 `i18n/` 子目录（`zh-CN.ts` + `en.json`），与中心化文件**内容重复**
- **自动注册**：`packages/core/src/index.ts` 在模块加载时 `import` 12 个组件的 `i18n/zh-CN.ts`，通过 `mergeMessages()` 合并到全局 `_messages`
- **消费方式**：所有组件统一 `import { useI18n } from '@lionad/vtu-core/i18n'`
- **t() 返回值**：`ComputedRef<string>`，模板中自动解包，script 中需 `.value`

### 需要迁移的组件（11 个使用 i18n 但无本地文件）

| 组件 | 实际使用的 key | 复杂度 |
|---|---|---|
| `approval-card` | `approvalCard.approve`, `.reject`（states/index.ts） | 轻 |
| `chart` | 无（死代码：解构了 `t` 但从未调用） | 特殊 |
| `citation` | `citation.viewSource` | 轻 |
| `image` | `image.alt` | 轻 |
| `instagram-post` | `.like`, `.share`, `.logo` + 跨组件 `xPost.verified` | 中 |
| `linkedin-post` | `.like`, `.share`, `.edited`, `.logo`, `.seeMore` | 中 |
| `option-list` | `optionList.selected` | 轻 |
| `parameter-slider` | `.reset` + 跨组件 `shared.confirm` | 轻 |
| `plan` | `.complete`, `.more({count})` | 轻 |
| `stats-display` | `statsDisplay.percent` | 轻 |
| `x-post` | `.verified`, `.logo` | 轻 |

### 不需要迁移的组件（3 个完全不使用 i18n）

- `image-gallery`、`link-preview`、`progress-tracker` — 中心化文件有它们的条目但代码中从未调用 `t()`

### 已有本地 i18n/ 的组件（12 个，无需动）

`terminal`, `code-block`, `code-diff`, `order-summary`, `question-flow`, `data-table`, `message-draft`, `audio`, `video`, `geo-map`, `item-carousel`, `preferences-panel`

## 迁移方案

### 工作单元分组（3 个独立可并行单元）

**Unit 1：轻量组件（7 个）**
- `approval-card`, `citation`, `image`, `option-list`, `plan`, `stats-display`, `x-post`
- 每个创建 `i18n/zh-CN.ts` + `i18n/en.json`，修改 import 路径，删除中心化条目

**Unit 2：复杂/特殊组件（4 个）**
- `chart`（死代码处理）、`instagram-post`（跨组件 `xPost.verified`）、`linkedin-post`、`parameter-slider`（`shared.confirm`）
- 需要特殊处理跨组件 key 和 dead code

**Unit 3：中心化清理**
- 删除 `packages/core/src/i18n/locales/zh-CN.ts` 中 11 个组件的条目 + `shared` 命名空间
- 删除 `packages/core/src/index.ts` 中的自动注册逻辑（所有 `import { zhCN as xxxZhCN }` 和 `setMessages(mergeMessages(...))`）
- 删除 `packages/core/src/i18n/index.ts` 中的 `zhCN` 和 `en` 导出
- 删除 `packages/core/src/i18n/use-i18n.ts` 中 fallback 到 `zhCN` 的逻辑

## E2E 测试方案

1. 启动 dev server: `pnpm dev`
2. 在浏览器中访问 `http://localhost:5740`，检查各组件正常渲染
3. 切换语言后（通过 LocaleProvider），组件文本应从 en 切换到 zh-CN
4. 或运行 `pnpm test` 确保单元测试通过

**简化方案**：运行 `pnpm test && pnpm typecheck` 即可验证。i18n 迁移不改变运行时行为，只需确保翻译 key 能找到。

## 统一约定

- 每个组件的 `i18n/` 目录包含：
  - `zh-CN.ts`：`export const zhCN = { componentName: { ... } } as const`（.ts 保持类型安全）
  - `en.json`：`{ "componentName": { ... } }`（.json 与已有 12 个组件一致）
- import 改为相对路径：`import { zhCN } from './i18n/zh-CN'`（core 自动注册用）
- 组件代码中的 `useI18n()` 调用**不变**（仍通过 provide/inject 获取）
- 跨组件 key（`shared.confirm`）内联到使用该 key 的组件自己的命名空间
- `instagram-post` 使用的 `xPost.verified` 保持引用 `xPost` 命名空间（因为 x-post 也有独立 i18n 文件）

## 核心架构变化

迁移后 `packages/core/src/i18n/use-i18n.ts` 的 fallback 逻辑需要调整：
- 移除 `import { zhCN } from './locales/zh-CN'` 
- 移除 fallback 到 `zhCN` 的分支
- 当无 `LocaleProvider` 且无全局 messages 时，返回空对象（key 找不到时返回 key 本身）

这样组件的本地 `i18n/` 文件**仅由 core 的自动注册使用**，组件本身通过 `useI18n()` 统一消费——架构上只是把 locale 数据源从"一个文件"变成"每个组件一个文件"，消费方式完全不变。
