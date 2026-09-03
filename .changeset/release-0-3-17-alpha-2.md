---
"@lionad/vtu-components": patch
---

feat(components): QuestionFlow 步骤支持表单字段——fields复用 PreferenceItem 契约，options/fields 二选一校验，required 填齐门控推进，complete 载荷按步骤类型分化

fix(components): select 值文本 shrink-0 防窄卡片下被 flex 压缩换行；PreferencesPanel 新增 upload 字段类型（handler 注入、传输中门控 Save、回执文件名展示）；字段行宽控件统一 w-full；QuestionFlow 步骤 id 唯一性校验防答案互相覆盖
