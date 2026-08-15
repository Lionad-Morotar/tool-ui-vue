---
'@lionad/vtu-components': patch
---

feat(components): 数组 props 渲染层宽容——缺字段渲染空态而非抛错

- chart / data-table / option-list / parameter-slider / preferences-panel / progress-tracker 的数组类 props 改为可选，组件 withDefaults 缺省空数组（LLM 产出缺字段时渲染空图/空表/空列表）
- zod 可序列化契约保持必填：usePropsValidator 仍按必填校验并 warn 提示，宽容只发生在渲染层
- states 层 props 类型收窄为必有（withDefaults 保证），消除 undefined 防御噪音
- 同步 skills 文档的组件用法说明
