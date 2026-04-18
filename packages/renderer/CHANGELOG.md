# @lionad/vtu-renderer

## 0.1.0

首次发布。基于 `@json-render/core` + `@json-render/vue` 的 JSON 渲染集成层。

### 功能

- **Renderer**: 根据 JSON schema 动态渲染 `@lionad/vtu-components` 组件
- **Registry**: 组件注册表，映射 JSON type → Vue component
- **ErrorBoundary**: 渲染错误边界组件，捕获并展示组件渲染异常
- **withErrorBoundary**: HOC，为任意组件包裹错误边界
- **Catalog**: 组件目录，列出所有已注册组件及其 schema
