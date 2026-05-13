# Phase 5: Documentation + Histoire - Discussion Log (Assumptions Mode)

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the analysis.

**Date:** 2026-04-11
**Phase:** 05-documentation-histoire
**Mode:** assumptions
**Areas analyzed:** README 文档结构, API 文档格式, Story 双语描述, Histoire 语言切换器, README 语言策略

## Assumptions Presented

### README 文档结构
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| README 保留英文主体，添加中文 i18n 章节 | Likely | 项目 README 惯例为英文，CLAUDE.md 要求中文回复 |
| 消费者接入指南作为 README 子章节 | Likely | 项目轻量，无独立 docs 站点 |

### Histoire 语言切换器
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| 通过 setupFile (histoire-setup.ts) 添加语言切换按钮 | Likely | config 已有 setupFile 指向，无 .histoire/ 目录 |

### Story 双语描述
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| computed + locale 映射表，各 Story 自行定义 | Likely | ~30 个 Story 文件，无共享 i18n helper |

### API 文档格式
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Histoire Story 注释 + 独立 Markdown 混合 | Unclear | 无 TypeDoc/api-extractor 等工具配置 |

### Histoire setupFile 职责
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| 承担双重职责：全局设置 + 语言切换状态 | Confident | setupFile 已指向 _shared/histoire-setup.ts |

## Corrections Made

### README 语言策略
- **Original assumption:** README 保留英文主体，添加中文 i18n 章节
- **User correction:** README 全中文
- **Reason:** 用户明确要求中文优先

### API 文档格式
- **Original assumption:** Unclear（三种方案待定）
- **User correction:** Histoire 内 Story 注释 + 独立 Markdown
- **Reason:** 避免引入新工具链，保持轻量

### Story 双语描述
- **Original assumption:** Likely（computed + locale 映射表）
- **User correction:** 确认，维持原方案
- **Reason:** 简单直接，各 Story 自行定义映射

---

*No external research performed — codebase analysis was sufficient.*
