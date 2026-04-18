# @lionad/vtu-server

## 0.1.0

首次发布。MCP (Model Context Protocol) server，为 AI 编辑器提供 tool-ui-vue 组件库的文档和元数据查询。

### 工具

- **search-components**: 按名称/描述/分类搜索组件
- **search-composables**: 搜索 composable 函数
- **search-documentation**: 搜索文档页面
- **search-icons**: 通过 Iconify 接口搜索图标（lucide 等集合）
- **get-component**: 获取组件完整文档（props、slots、events、主题）
- **get-component-metadata**: 获取组件 props、slots、events 的详细类型信息
- **get-documentation-page**: 按 URL 路径获取文档页面内容
- **get-example**: 获取示例代码
- **list-examples**: 列出所有可用示例

### 架构

- 基于 `@modelcontextprotocol/sdk` 构建
- 组件源码打包在 `dist/packages/components/src/` 供 AI 实时读取
- Histoire stories 打包在 `dist/src/stories/` 提供使用示例
- bin 入口 `vtu-mcp-server`，支持 `npx @lionad/vtu-server` 直接运行
