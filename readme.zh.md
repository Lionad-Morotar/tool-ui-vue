---
lang: zh-CN
---

[English](readme.md)

# tool-ui-vue（vtu）

Vue 3 组件库，用于 Agent 工具调用时的人机交互。

![Site](./assets/landing.jpg)

首页：https://lionad-morotar.github.io/tool-ui-vue/

## 快速开始

如果你使用 Agent 可以一键安装：

```
安装使用 https://github.com/Lionad-Morotar/tool-ui-vue，并创建 /dev/tool-ui-vue 页面供开发调试
```

或者，你倾向使用传统方法：

```bash
pnpm add @lionad/vtu-components
```

```vue
<script setup lang="ts">
import { Terminal } from '@lionad/vtu-components'
</script>

<template>
  <Terminal
    id="term-1"
    command="pnpm install"
    stdout="added 42 packages in 2s"
    :exit-code="0"
    :duration-ms="2150"
  />
</template>
```

## Skills

```bash
npx skills add https://github.com/Lionad-Morotar/tool-ui-vue
```

了解更多 skills：[@lionad/vtu-skills](/packages/skills/tool-ui-vue/SKILL.md)

**For Agent**: read skills to understand how to install vtu in a project.

## MCP Server

```json
{
  "mcpServers": {
    "tool-ui-vue": {
      "command": "npx",
      "args": ["-y", "vtu-mcp-server"]
    }
  }
}
```

了解更多 MCP server：[@lionad/vtu-server](/packages/server/README.md)
