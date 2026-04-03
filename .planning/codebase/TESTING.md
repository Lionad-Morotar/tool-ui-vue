# Testing Patterns

**分析日期：** 2026-04-03

## 测试框架

**运行器：** Vitest `^4.0.18`

**配置：** `vitest.config.ts`

**环境：** jsdom（`globals: true`）

**断言库：** Vitest 内置（`expect`、`test`、`describe`、`vi`）

**Vue 测试工具：** `@vue/test-utils` `^2.4.6`

**覆盖率：** `@vitest/coverage-v8` `^4.1.2`

**运行命令：**
```bash
pnpm test           # vitest run
pnpm test:watch     # vitest
```

## 测试文件组织

**位置模式：**
- 组件测试：`src/components/{name}/__tests__/*.test.ts`
- E2E 导入/挂载测试：`src/test/e2e/*.test.ts`
- 工具测试：与源码同位置（如 `src/shared/utils.test.ts`）
- Playground 测试：`playground/**/*.test.ts`

**命名：**
- 组件入口测试：`__tests__/index.test.ts`
- 命名子组件测试：`__tests__/ComponentName.test.ts`
- E2E 测试：描述性名称如 `component-imports.test.ts`、`component-mounts.test.ts`

## 测试结构

**套件组织：**
```typescript
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import Component from '../index.vue';

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-id',
    ...overrides,
  };
}

describe('ComponentName', () => {
  describe('rendering', () => {
    test('renders title', () => {
      const wrapper = mount(Component, { props: createProps() });
      expect(wrapper.text()).toContain('Expected Title');
    });
  });

  describe('events', () => {
    test('emits event on interaction', async () => {
      const wrapper = mount(Component, { props: createProps() });
      await wrapper.find('button').trigger('click');
      expect(wrapper.emitted('eventName')).toBeTruthy();
    });
  });
});
```

**模式：**
- 构建 props 的工厂函数（`createProps`、`createEmailProps`）
- 嵌套 `describe` 块按行为区域分组：`rendering`、`events`、`states`、`variants`
- 测试包含注释 ID：`/** TEST-UTIL-01: Description */`

## Mocking

**框架：** Vitest `vi`

**浏览器 API mocks（在 `src/test/setup.ts` 中）：**
- `matchMedia`
- `ResizeObserver`
- `IntersectionObserver`
- `HTMLCanvasElement.prototype.getContext`（2d 和 WebGL）
- `HTMLMediaElement.prototype.play/pause/load`
- `HTMLDialogElement.prototype.showModal/close`

**模块 mocks：**
```typescript
vi.mock('leaflet', () => ({
  default: {},
  map: () => ({ setView: vi.fn(), ... }),
  ...
}));
```

**Mock 内容：**
- 重量级外部库（GeoMap 的 Leaflet）
- jsdom 不可用的浏览器 API（Media API、observer、canvas）
- 通过 `ALLOWED_PATTERNS` 注册的 Playground 特定警告

## 控制台守卫

**文件：** `src/test/console-guard.ts`

**行为：**
- 自动监听每个测试中的 `console.error` 和 `console.warn`
- 如果检测到意外的控制台输出，测试后抛出错误
- 允许的模式可以全局注册：如 Vue 注入警告、Shiki 单例警告
- Playground 测试通过 `ALLOWED_PATTERNS.push()` 添加自己的允许模式

## E2E 测试策略

**范围：** 最小存在性测试，验证所有 27 个组件可以导入和挂载

**文件：**
- `src/test/e2e/component-imports.test.ts` — barrel 导入测试
- `src/test/e2e/component-mounts.test.ts` — 用最小 props 挂载每个组件
- `playground/e2e/playground-loads.test.ts` — playground App.vue 挂载和 main.ts 导入测试

**方法：**
- 无深度行为测试
- 每个组件一个测试，验证挂载不抛出错误
- Props 工厂内联在每个测试用例中

## 单元测试策略

**组件测试：**
- 位于每个组件的 `__tests__/` 中
- 测试关键内容渲染（title、text、attributes）
- 测试用户交互上的事件发射
- 测试通过 `css.root` prop 应用 CSS 类
- 测试变体特定 DOM 结构

**工具测试：**
- 与源文件同位置（如 `src/shared/utils.test.ts`）
- 彻底的边缘情况覆盖（空值、混合输入、条件对象）

## 覆盖率

**`vitest.config.ts` 中的配置：**
```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  exclude: ['node_modules', 'dist', '**/*.test.ts', '**/test/**'],
}
```

**配置或 CI 脚本中未设置明确目标。**

**查看覆盖率：**
```bash
pnpm test -- --coverage
```

## 测试类型总结

| 类型 | 位置 | 框架 | 范围 |
|------|----------|-----------|-------|
| 单元 | `src/components/**/__tests__/*.test.ts` | Vitest + @vue/test-utils | 组件渲染、事件、props |
| 单元 | `src/shared/*.test.ts` | Vitest | 工具函数 |
| E2E | `src/test/e2e/*.test.ts` | Vitest + @vue/test-utils | 导入 + 挂载所有 27 个组件 |
| E2E | `playground/**/*.test.ts` | Vitest + @vue/test-utils | Playground 入口点 |

## 异步测试模式

**定时器：**
```typescript
await new Promise((r) => setTimeout(r, 80));
```

**测试中的动态导入：**
```typescript
const { Component } = await import('@/components/name');
const wrapper = mount(Component as Component, { props: { ... } });
```

## Playground 特定测试

**文件：** `playground/weather-tuning/weather-tuning.test.ts`

- 测试文件中定义 TypeScript 接口用于本地类型
- Mock 数据常量（`PARAMETER_DEFINITIONS`）
- 测试辅助函数而不渲染组件

---

*测试分析：2026-04-03*
