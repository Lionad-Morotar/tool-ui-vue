# @lionad/vtu-renderer

## 0.3.11

### Patch Changes

- Updated dependencies []:
  - @lionad/vtu-components@0.3.11

## 0.3.10

### Patch Changes

- Updated dependencies [[`d841052`](https://github.com/Lionad-Morotar/tool-ui-vue/commit/d8410522acbc1ef242158e857fc0e1c1ab432ae2), [`36b5737`](https://github.com/Lionad-Morotar/tool-ui-vue/commit/36b573768a6ee73fa5a7047c57b2f998decfbe2a)]:
  - @lionad/vtu-components@0.3.10

## 0.3.9

### Patch Changes

- Updated dependencies []:
  - @lionad/vtu-components@0.3.9

## 0.3.8

### Patch Changes

- Updated dependencies [[`7416664`](https://github.com/Lionad-Morotar/tool-ui-vue/commit/74166648937f60b8f9f40a00d5669b77843e3330)]:
  - @lionad/vtu-components@0.3.8

## 0.3.7

### Patch Changes

- Updated dependencies []:
  - @lionad/vtu-components@0.3.7

## 0.1.2

### Patch Changes

- fix(geo-map): 新增 tileSubdomains prop 修复高德地图瓦片加载失败

  高德地图瓦片 URL `webrd0{s}.is.autonavi.com` 使用数字子域 `1,2,3,4`，
  但 Leaflet 默认使用字母子域 `a,b,c`，导致瓦片请求到无效域名。

  - `GeoMapProps` schema: 新增 `tileSubdomains?: string | string[]`
  - `geo-map-engine.vue`: 将 `tileSubdomains` 透传给 `l-tile-layer` 的 `subdomains` prop
  - `demo-travel.vue`: 传入 `['1','2','3','4']` 匹配高德瓦片子域

- Updated dependencies []:
  - @lionad/vtu-components@0.1.2

## 0.1.0

首次发布。基于 `@json-render/core` + `@json-render/vue` 的 JSON 渲染集成层。

### 功能

- **Renderer**: 根据 JSON schema 动态渲染 `@lionad/vtu-components` 组件
- **Registry**: 组件注册表，映射 JSON type → Vue component
- **ErrorBoundary**: 渲染错误边界组件，捕获并展示组件渲染异常
- **withErrorBoundary**: HOC，为任意组件包裹错误边界
- **Catalog**: 组件目录，列出所有已注册组件及其 schema
