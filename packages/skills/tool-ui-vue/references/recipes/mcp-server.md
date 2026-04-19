# MCP Server 安装

`@lionad/vtu-server` 提供 MCP (Model Context Protocol) Server，让 AI 编码助手（Claude Code、Cursor 等）能查询 VTU 组件文档、示例和 schema。

## Claude Code

```bash
claude mcp add --transport stdio vtu npx vtu-mcp-server
```

## Claude Desktop

编辑 `claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "tool-ui-vue": {
      "command": "npx",
      "args": ["vtu-mcp-server"]
    }
  }
}
```

## Cursor / Windsurf 等编辑器

在 MCP 配置中添加：

```json
{
  "mcpServers": {
    "tool-ui-vue": {
      "command": "npx",
      "args": ["vtu-mcp-server"]
    }
  }
}
```

## Server 能力

安装后，AI 助手可使用以下能力：

| 工具 | 用途 |
|------|------|
| `search_components` | 按名称/类别搜索组件 |
| `get_component` | 获取组件完整文档 |
| `search_documentation` | 搜索文档页面 |
| `search_icons` | 搜索可用图标 |
| `list_examples` | 列出所有示例 |

以及 `resource://vtu/components`、`resource://vtu/composables` 等资源端点。
