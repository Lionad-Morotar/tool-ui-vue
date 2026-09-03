---
"@lionad/vtu-components": patch
---

feat(components): 新增 upload 公开组件——handler 注入传输，text/picture-card 双形态

原子表单层 ui/* 落地：input、textarea、select、switch、toggle-group、date（date/datetime/range 三模式）、rating、number-field、tags-input 表单原子，PreferencesPanel 偏好项全面接线并集成 rating/number/tags/date 四类新偏好项

QuestionFlow 选项区改由 reka Listbox 接管交互，修复换步 transition 窗口内 highlight 滞留已卸载元素、键盘焦点无法进入的问题；换步退场快照指示器不再重播入场动画

fix(components): Select 选项较多时浮层补滚动高度上限，底部选项滚轮与键盘 End 可达；preference-field toggle 分支补组容器无障碍命名；date 原子 datetime 模式补 TimeField 段渲染；PreferencesValue 类型扩展的下游类型对齐
