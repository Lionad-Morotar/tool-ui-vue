# @lionad/vtu-server

tool-ui-vue 的 MCP (Model Context Protocol) Server。

## 结构

```
mcp/
├── index.ts                    # MCP server 入口 (stdio)
├── tools/
│   ├── search-components.ts    # search_components
│   ├── search-composables.ts   # search_composables
│   ├── search-documentation.ts # search_documentation
│   ├── search-icons.ts         # search_icons
│   ├── get-component.ts        # get_component
│   ├── get-component-metadata.ts # get_component_metadata
│   ├── get-documentation-page.ts # get_documentation_page
│   ├── get-example.ts          # get_example
│   └── list-examples.ts        # list_examples
├── resources/
│   ├── components.ts           # resource://vtu/components
│   ├── composables.ts          # resource://vtu/composables
│   ├── documentation-pages.ts  # resource://vtu/documentation-pages
│   └── examples.ts             # resource://vtu/examples
└── prompts/
    ├── find-component-for-usecase.ts
    ├── implement-component-with-props.ts
    └── setup-project-with-template.ts
```

## 安装

```bash
npm install @lionad/vtu-server
# 或
pnpm add @lionad/vtu-server
```

## 使用方式

### Claude Code

```bash
claude mcp add --transport stdio vtu npx vtu-mcp-server
```

### Claude Desktop (`claude_desktop_config.json`)

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

### Cursor / Windsurf 等编辑器

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

## 开发

```bash
cd packages/server
pnpm dev        # tsx watch mcp/index.ts
pnpm build      # tsc 编译到 dist/
pnpm typecheck  # tsc --noEmit
```

## Thanks

* nuxt-ui: 目前直接照搬了 nuxt-ui mcp server 的设计
