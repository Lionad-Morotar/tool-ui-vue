---
'@lionad/vtu-components': patch
---

修复聚合层/states 工厂在 setup 同步作用域固化 props（首帧固化）：父层以新引用更新 prop（如流式增量渲染逐帧灌入数据）时组件停在挂载首帧不再重渲染。

断点形态与修复：

- 值传参给 MaybeRefOrGetter 型子 composable（data-table 的 useSort/useLayout、parameter-slider 的 useSlider/useDrag/useLayout）→ 聚合层统一 getter 传参
- 工厂入口解构 options/props（code-block、code-diff、terminal、item-carousel、order-summary）→ 删除解构，computed/watch getter 内改读 options.xxx 收集依赖
- ref(首帧值) 构造共享状态（image-gallery 的 gallery context）→ computed(toValue)
- 返回 .value 快照而非 computed 引用（stats-display 的 locale/hasHeader/isSingle、question-flow 的 titleId/descriptionId）→ 返回引用由外层 reactive() 解包
- 静态配置一次性读取（message-draft 的 undoGracePeriod）→ 每次启动定时器时读最新值

11 个组件全部补 props-reactivity 回归测试（mount + setProps 新引用断言渲染跟随，修复前均红）；skills 文档 headless-states 设计原则补 getter 传参规范。
