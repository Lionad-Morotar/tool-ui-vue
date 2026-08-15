---
'@lionad/vtu-components': patch
---

fix(components): 全部未命名 group hover 语义改为命名组，防宿主 .group 祖先劫持

- option-list / question-flow 选项行 hover overlay 改用 group/option：宿主 UI（如聊天消息卡片）带 .group 祖先时，hover 宿主会连带点亮整列选项高亮
- video / citation / contact-card / link-preview / item-carousel / image-gallery / citation 条目行的 hover 效果同步改为命名组（group/video、group/citation、group/contact、group/link、group/card、group/item）
- 清理无消费方的 group 类：audio / chart / image / data-table 手风琴行 / item-carousel 容器 / question-flow 退出态克隆
