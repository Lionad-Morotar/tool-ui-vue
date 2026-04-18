# 测试模式

**分析日期:** 2026-04-18

## 测试框架

**运行器:**
- Vitest `^4.1.2`
- 配置: `vitest.config.ts`

**环境:**
- jsdom（`environment: 'jsdom'`）
- globals: `true`（直接使用 `describe`/`it`/`expect`，无需导入）

**断言库:**
- Vitest 内置（`expect`、`test`/`it`、`describe`、`vi`）
- Vue 测试工具: `@vue/test-utils ^2.4.6`

**覆盖率:**
- `@vitest/coverage-v8 ^4.1.2`
- 无强制覆盖率阈值

**运行命令:**
```bash
pnpm test                # vitest run（一次性运行所有测试）
pnpm test -- --watch     # 监听模式
pnpm test -- --coverage  # 生成覆盖率报告
```

## 测试文件组织

**位置模式:**
- 组件测试: `packages/components/src/{component}/__tests__/*.test.ts`
- i18n 测试: `packages/components/src/core/i18n/__tests__/*.test.ts`
- 渲染器测试: `packages/renderer/src/__tests__/*.test.ts`
- E2E 测试: `src/test/e2e/*.test.ts`
- 服务端测试: `packages/server/mcp/__test__/*.test.ts`

**命名:**
- 组件入口测试: `__tests__/index.test.ts`
- 子组件/模块测试: `__tests__/ComponentName.test.ts`（如 `ItemCarousel.test.ts`、`SparkLine.test.ts`）
- 纯逻辑测试: `__tests__/xxx.test.ts`（如 `diff.test.ts`、`button-click.test.ts`）
- E2E 测试: `component-imports.test.ts`、`component-mounts.test.ts`
- 性能测试: `weather-widget.perf.test.ts`

**当前测试文件统计:**
- 组件测试: 40 个文件
- 渲染器测试: 4 个文件
- E2E 测试: 3 个文件
- 总测试代码: ~13,400 行

**目录结构:**
```
packages/components/src/
├── code-block/__tests__/         # 组件单元测试
│   └── index.test.ts
├── item-carousel/__tests__/
│   ├── index.test.ts             # 主组件测试
│   ├── ItemCarousel.test.ts      # 同级详细测试
│   └── button-click.test.ts      # 特定交互测试
├── weather-widget/__tests__/
│   ├── index.test.ts
│   ├── EffectCompositor.test.ts  # 子组件测试
│   ├── WeatherDataOverlay.test.ts
│   └── weather-widget.perf.test.ts  # 性能测试
├── core/i18n/__tests__/
│   ├── use-i18n.test.ts          # composable 测试
│   └── locale-provider.test.ts
└── ...

src/test/
├── setup.ts                      # 全局 setup
├── console-guard.ts              # 控制台守卫
└── e2e/
    ├── component-imports.test.ts
    ├── component-mounts.test.ts
    └── histoire-config.test.ts
```

## 测试 Setup

**全局 Setup 文件:** `src/test/setup.ts`

职责:
1. 注册英文 locale: `registerEnglish()` — 测试断言基于英文文案
2. 激活控制台守卫: `setupConsoleGuard()`
3. Mock 浏览器 API:
   - `window.matchMedia` — 主题检测
   - `ResizeObserver` — ParameterSlider、ItemCarousel
   - `IntersectionObserver` — 懒加载
   - `HTMLCanvasElement.prototype.getContext` — 2d + WebGL（WeatherWidget）
   - `HTMLMediaElement.prototype.play/pause/load` — Audio、Video
   - `HTMLDialogElement.prototype.showModal/close` — ImageGallery lightbox
   - `HTMLElement.prototype.showPopover/hidePopover/togglePopover` — Citation popovers

## 测试结构

### 标准组件测试套件

```typescript
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import CodeBlock from '../index.vue';

// Mock navigator.clipboard（如需要）
Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

describe('CodeBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders code content', async () => {
      const wrapper = mount(CodeBlock, {
        props: { id: 'code-1', code: 'const x = 1;' },
      });
      await nextTick();
      expect(wrapper.text()).toContain('const x = 1;');
    });
  });

  describe('copy functionality', () => {
    it('copies code to clipboard on click', async () => {
      const wrapper = mount(CodeBlock, {
        props: { id: 'code-1', code: 'const x = 1;' },
      });
      await wrapper.find("button[aria-label='Copy code']").trigger('click');
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('const x = 1;');
    });
  });
});
```

### Props 工厂函数模式

复杂组件使用 `createProps` 工厂:

```typescript
function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-weather',
    location: { name: 'San Francisco' },
    current: {
      temperature: 72,
      conditionCode: 'partly-cloudy' as WeatherConditionCode,
      tempMax: 75,
      tempMin: 60,
    },
    ...overrides,
  };
}
```

### 嵌套 describe 分组

测试按行为区域分组，常见分组:
- `rendering` — 渲染相关测试
- `selection - single` / `selection - multi` — 模式分支
- `keyboard navigation` — 键盘交互
- `actions` — 按钮操作
- `accessibility` — ARIA 属性
- `i18n` — 国际化
- `structure` — data 属性、DOM 结构
- `effects` / `edge cases` — 特定场景

## Mocking

### 框架
- Vitest 内置 `vi` mock 系统

### 浏览器 API Mocks（全局）

在 `src/test/setup.ts` 中设置，所有测试自动生效:
- `matchMedia` — 媒体查询
- `ResizeObserver` — 尺寸监听
- `IntersectionObserver` — 可见性检测
- Canvas 2D/WebGL context — 图形渲染
- `HTMLMediaElement` — 音视频播放
- `HTMLDialogElement` — 对话框
- Popover API — 弹出层

### 模块级 Mocks

在需要时在单个测试文件中设置:

```typescript
// Mock 整个外部库
vi.mock('leaflet', () => ({
  default: {},
  map: () => ({ setView: vi.fn(), fitBounds: vi.fn(), remove: vi.fn() }),
  tileLayer: () => ({ addTo: vi.fn() }),
  marker: () => ({ addTo: vi.fn(), bindPopup: vi.fn() }),
}));

// Mock VueUse composable
vi.mock('@vueuse/core', () => ({
  usePreferredReducedMotion: () => mockPreferredReducedMotion,
}));

// Mock i18n 模块（带 locale 切换控制）
vi.mock('../../core/i18n', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => computed(() => {
        const msgs = messagesByLocale[currentLocale.value] ?? {};
        return msgs[key] ?? key;
      }),
      locale: computed(() => currentLocale.value),
      setLocale: (locale: string) => { currentLocale.value = locale; },
    }),
  };
});
```

### 组件 Stub

复杂子组件使用 stub 替代:

```typescript
const EffectCompositorStub = {
  template: '<div data-testid="effect-compositor-stub" />',
  props: ['conditionCode', 'windSpeed', 'precipitationLevel', 'visibility', 'timestamp', 'timeOfDay', 'settings'],
};

const wrapper = mount(WeatherWidget, {
  props: createProps(),
  global: {
    stubs: {
      EffectCompositor: EffectCompositorStub,
      WeatherDataOverlay: WeatherDataOverlayStub,
    },
  },
});
```

### Mock 内容指导

**需要 Mock:**
- 重量级外部库（Leaflet、Shiki 高亮器）
- jsdom 不支持的浏览器 API
- Canvas/WebGL 渲染
- 网络/剪贴板操作

**不要 Mock:**
- 组件内部的 composable 逻辑（直接测试行为）
- Vue 响应式系统
- `cn()` 工具函数

## 控制台守卫

**文件:** `src/test/console-guard.ts`

**行为:**
- 每个 `beforeEach` 中自动监听 `console.error` 和 `console.warn`
- `afterEach` 中检查是否有未预期的控制台输出
- 未预期的输出导致测试失败并打印详细信息

**允许的模式（ALLOWED_PATTERNS）:**
- Shiki 多实例警告
- Vue 注入未找到警告（ImageGallery 无 provider 场景）
- QuestionFlow union type props 验证警告
- i18n 缺失 key / 无 LocaleProvider 警告
- Vue 缺失必需 prop 警告

## E2E 测试

### 组件导入测试

**文件:** `src/test/e2e/component-imports.test.ts`

验证所有组件可从库入口点导入:
```typescript
test('all components can be imported from library entry', async () => {
  const imports = await import('@/index');
  expect(Object.keys(imports).length).toBeGreaterThan(0);
});
```

### 组件挂载测试

**文件:** `src/test/e2e/component-mounts.test.ts`

验证所有 27 个组件可用最小 props 挂载:
```typescript
test('CodeBlock mounts with minimal props', async () => {
  const { CodeBlock } = await import('@lionad/vtu-components/code-block');
  const wrapper = mount(CodeBlock as Component, {
    props: { id: 'test-code', code: "console.log('hello');" },
  });
  expect(wrapper.exists()).toBe(true);
});
```

每个组件一个独立测试，使用动态 `import()` 确保模块隔离。

## 纯逻辑测试

不涉及 Vue 组件挂载的纯函数测试:

```typescript
// packages/components/src/code-diff/__tests__/diff.test.ts
import { computeDiff, computeWordDiff, type DiffLine } from '../diff';

describe('computeDiff', () => {
  it('should correctly identify context lines', () => {
    const result = computeDiff('line1\nline2', 'line1\nline2');
    expect(result.lines.every((l: DiffLine) => l.type === 'context')).toBe(true);
  });
});
```

## 异步测试模式

### nextTick + setTimeout

异步操作（如 Shiki 语法高亮）需要等待:

```typescript
await nextTick();
await new Promise((r) => setTimeout(r, 100)); // 等待异步高亮完成
```

### 动态导入

E2E 测试使用动态导入隔离模块:

```typescript
const { Component } = await import('@lionad/vtu-components/xxx');
```

## 性能测试

**文件:** `packages/components/src/weather-widget/__tests__/weather-widget.perf.test.ts`

- WebGL Budget Guard 测试
- GPU 内存约束检测
- 缺失 WebGL context 降级
- 组件性能基准

## 测试类型总结

| 类型 | 位置 | 框架 | 范围 |
|------|------|------|------|
| 组件单元 | `packages/components/src/**/__tests__/*.test.ts` | Vitest + @vue/test-utils | 渲染、事件、props、可访问性、i18n |
| 纯逻辑单元 | `packages/components/src/**/__tests__/xxx.test.ts` | Vitest | diff、计算函数 |
| 渲染器单元 | `packages/renderer/src/__tests__/*.test.ts` | Vitest | 注册表、目录、错误边界 |
| E2E | `src/test/e2e/*.test.ts` | Vitest + @vue/test-utils | 导入 + 挂载所有 27 个组件 |
| 性能 | `packages/components/src/**/__tests__/*.perf.test.ts` | Vitest + @vue/test-utils | WebGL 降级、渲染性能 |

## 覆盖率

**配置:**
```typescript
// vitest.config.ts
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  exclude: ['node_modules', 'dist', '**/*.test.ts', '**/test/**'],
}
```

**无强制覆盖率阈值。**

**查看覆盖率:**
```bash
pnpm test -- --coverage
```

## i18n 测试

**文件:** `packages/components/src/core/i18n/__tests__/use-i18n.test.ts`

使用 `defineComponent` 创建消费者组件来测试 composable:

```typescript
function createTConsumer() {
  return defineComponent({
    props: { i18nKey: { type: String, required: true }, params: { type: Object, default: undefined } },
    setup() {
      const { t } = useI18n<MessageSchema>();
      return { t };
    },
    template: '<span data-testid="result">{{ t(i18nKey, params) }}</span>',
  });
}
```

测试范围: key 解析、嵌套 key、参数插值、locale 切换、缺失 key 回退。

## 常用断言模式

### DOM 查询
```typescript
wrapper.find('[data-slot="code-block"]')           // data 属性查询
wrapper.find('[data-tool-ui-id="test-id"]')         // ID 查询
wrapper.find("button[aria-label='Copy code']")      // ARIA 查询
wrapper.findAll("[role='option']")                   // 角色查询
wrapper.findComponent(StubComponent)                 // 子组件查询
```

### 事件验证
```typescript
wrapper.emitted('change')?.[0])                      // 事件参数
wrapper.emitted('action')?.[0])                      // 多参数事件
```

### 类名验证
```typescript
wrapper.attributes('class')).toContain('my-class')   // 自定义 css prop
wrapper.classes()).toContain('snap-x')                // Tailwind 类
wrapper.find('[data-slot]').classes()).toContain('custom-class')
```

### 可访问性验证
```typescript
wrapper.find('[role="listbox"]').exists()
wrapper.find('[aria-multiselectable]').attributes('aria-multiselectable')
wrapper.find('[aria-selected="true"]').exists()
wrapper.find('[aria-label]').attributes('aria-label')
```

---

*测试分析: 2026-04-18*
