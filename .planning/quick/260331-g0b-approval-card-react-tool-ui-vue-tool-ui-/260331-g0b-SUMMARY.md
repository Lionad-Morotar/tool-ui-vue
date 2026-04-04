# Quick Task Summary: 260331-g0b

## Task
将 Approval Card 组件从 React tool-ui 完全迁移到 Vue tool-ui，确保逻辑、功能、样式和类型定义完全一致。

## Changes Made

### 1. ApprovalCard.vue (src/components/approval-card/ApprovalCard.vue)

**图标系统升级**
- 从硬编码的 5 个 SVG 图标升级为使用 `lucide-vue-next` 的动态图标加载
- 实现 `getLucideIcon` 等效逻辑：将 kebab-case 转换为 PascalCase 查找图标
- 支持任意 Lucide 图标（rocket, mail, trash-2, check 等）

**Receipt 功能完善**
- 添加 `receiptLabel` computed 属性
- 逻辑与 React 版本一致：根据 choice 自动选择 confirmLabel 或 cancelLabel

**样式同步**
- 按钮添加 `focus-visible:ring-offset-2` 样式，与 React 版本一致

### 2. schema.ts (src/components/approval-card/schema.ts)

**类型定义优化**
- 添加 `ApprovalCardBaseProps` 接口用于组件内部使用
- 保留 `ApprovalCardProps` 继承 base props 并添加 callbacks
- 解决 Vue SFC 无法从导入类型继承的限制

### 3. index.ts (src/components/approval-card/index.ts)

- 导出新的 `ApprovalCardBaseProps` 类型

### 4. Playground (playground/App.vue)

**新增 5 个 ApprovalCard 示例**
- `approval-card`: 基础部署确认（使用 rocket 图标）
- `approval-card-destructive`: 删除项目（destructive 变体，trash-2 图标）
- `approval-card-metadata`: 发送邮件（带 metadata）
- `approval-card-receipt-approved`: 已批准回执
- `approval-card-receipt-denied`: 已拒绝回执

**更新卡片顺序**
- 在 `galleryCardOrder` 和 `stackRankOrder` 中添加新示例

### 5. Histoire Story (src/stories/approval-card.story.vue)

**更新示例**
- 使用 rocket 图标替换 check 图标
- 使用 trash-2 图标替换 trash 图标
- 添加 mail 图标示例
- 更新文档说明支持任意 Lucide 图标

## Verification

- [x] ApprovalCard 单元测试通过 (30 tests)
- [x] 图标系统支持动态加载（rocket, mail, trash-2 等）
- [x] Receipt 显示文本与 React 版本一致
- [x] 按钮样式包含完整的 focus 状态
- [x] TypeScript 类型与 React 版本一致
- [x] Playground 展示所有变体
- [x] Histoire 可预览所有状态

## Test Results

```
✓ src/components/approval-card/ApprovalCard.test.ts (30 tests)
```

## Migration Comparison

| Feature | React Version | Vue Version (Before) | Vue Version (After) |
|---------|--------------|---------------------|---------------------|
| Icon System | Dynamic Lucide | 5 hardcoded icons | Dynamic Lucide |
| Receipt Labels | Uses confirmLabel/cancelLabel | Auto "Approve"/"Deny" | Uses confirmLabel/cancelLabel |
| Button Focus | ring-offset-2 | Missing | ring-offset-2 |
| Metadata | Supported | Supported | Supported |
| Destructive | Supported | Supported | Supported |
| Type Safety | Full | Missing callbacks | Full |

## Notes

- `lucide-vue-next` 已存在于依赖中，无需新增安装
- Vue SFC 类型限制通过分离 BaseProps 和 Props 解决
- Playground 示例与 React Gallery 预设保持一致
