# 主题与样式

## Token 系统

主题通过 `@lionad/vtu-components/style.css` 提供，包含 CSS 自定义属性和 `@source` 指令：

- `@source "."` — 自动触发 Tailwind v4 扫描组件 JS bundle 中的 class 名
- `:root { }` — 无 Tailwind 环境的兜底
- `@theme { }` — Tailwind CSS v4 主题注册

导入方式：

```css
@import "@lionad/vtu-components/style.css";
```

## 颜色 Token

所有颜色提供 light/dark 两套值：

| Token | 用途 |
|-------|------|
| `--color-background` | 页面背景 |
| `--color-foreground` | 主要文字 |
| `--color-primary` | 主要操作色 |
| `--color-primary-foreground` | 主要操作上的文字 |
| `--color-secondary` | 次要区域 |
| `--color-secondary-foreground` | 次要区域文字 |
| `--color-destructive` | 危险/删除操作 |
| `--color-destructive-foreground` | 危险操作上的文字 |
| `--color-muted` | 弱化背景 |
| `--color-muted-foreground` | 弱化文字 |
| `--color-accent` | 强调背景 |
| `--color-accent-foreground` | 强调文字 |
| `--color-card` | 卡片背景 |
| `--color-card-foreground` | 卡片文字 |
| `--color-popover` | 弹出层背景 |
| `--color-popover-foreground` | 弹出层文字 |
| `--color-border` | 边框 |
| `--color-input` | 输入框边框 |
| `--color-ring` | focus ring |

Tailwind v4 中使用：`bg-primary`、`text-muted-foreground`、`border-border` 等。

## 其他 Token

### 圆角

`--radius-sm` (0.125rem) → `--radius-3xl` (1.5rem)

### 间距

`--spacing-1` (0.25rem) → `--spacing-24` (6rem)

### 阴影

`--shadow-xs` → `--shadow-xl`

## Dark Mode

通过 `data-theme="dark"` 属性切换：

```ts
document.documentElement.setAttribute('data-theme', 'dark')
```

dark mode 会覆盖所有颜色和阴影 token。颜色模式 key 为 `vtu-color-mode`。

## css Prop 覆盖

每个组件支持 `css` prop，通过 Tailwind 类字符串覆盖内部样式：

```ts
interface DataTableCss {
  root?: string      // 根容器
  header?: string    // 表头
  row?: string       // 行
  cell?: string      // 单元格
}
```

使用示例：

```vue
<DataTable
  v-bind="data"
  :css="{ root: 'rounded-xl shadow-lg', header: 'bg-muted' }"
/>
```

组件内部通过 `cn()` 合并默认类和覆盖类：

```vue
<div :class="cn('rounded-md border', css?.root)">
```

## 自定义 Token

在项目 CSS 中覆盖变量即可：

```css
:root {
  --color-primary: hsl(220 80% 50%);
  --color-primary-foreground: hsl(0 0% 100%);
}
```

如果使用 Tailwind v4 的 `@theme`，在自定义 CSS 中重新声明同名变量即可覆盖。
