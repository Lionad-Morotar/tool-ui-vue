# AGENTS.md

Vue 3 component library for tool call widgets (copy-paste style)。

* 现实层你有无限时间和资源，不要因上下文压缩简化任务执行

## 项目上下文

| 文档                                                    | 说明                       |
| ------------------------------------------------------- | -------------------------- |
| [.impeccable.md](./.impeccable.md)                      | 品牌风格、设计理念、视觉方向 |
| [.planning/codebase/STACK.md](./.planning/codebase/STACK.md)               | 技术栈、开发命令、部署流程 |
| [.planning/codebase/STRUCTURE.md](./.planning/codebase/STRUCTURE.md)       | 目录结构、命名规范         |
| [.planning/codebase/ARCHITECTURE.md](./.planning/codebase/ARCHITECTURE.md) | 架构模式、术语表           |
| [.planning/codebase/CONVENTIONS.md](./.planning/codebase/CONVENTIONS.md)   | 代码风格、开发约定         |
| [.planning/codebase/TESTING.md](./.planning/codebase/TESTING.md)           | 测试规范                   |
| [.planning/codebase/INTEGRATIONS.md](./.planning/codebase/INTEGRATIONS.md) | 外部服务、环境变量         |
| [.planning/codebase/CONCERNS.md](./.planning/codebase/CONCERNS.md)         | 技术债务、注意事项         |

更新文档时优先更新到 `.planning/codebase/`。

* 项目从原项目 `@assistant-ui/tool-ui` 这个 React 组件库迁移过来，重构为 Vue 3 + TypeScript + Zod + Tailwind CSS v4 的组件库，采用 Monorepo 分层架构（core → components → nuxt-module → theme）。
* 原项目代码可参考：`/Users/lionad/Github/Run/tool-ui/Claude.md`