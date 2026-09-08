<script setup lang="ts">
import { ref } from 'vue'
import { DataTable, LocaleProvider, zhCNAll } from '@lionad/vtu-components'
import type { Column } from '@lionad/vtu-components'

// 回归页：data-table 列宽压缩修复（table w-full 压缩显式列宽导致 resizer 拖动看似无效）
// 场景 A 模拟 LLM 产出：列声明固定 px 宽且总和远超容器，此前渲染被压缩、拖动无视觉反馈

interface ProjectRow {
  id: string
  name: string
  region: string
  status: string
  invest: string
}

const wideColumns: Column[] = [
  { key: 'name', label: '项目名称', width: '760px' },
  { key: 'region', label: '所属区域', width: '300px' },
  { key: 'status', label: '推进状态', width: '260px' },
  { key: 'invest', label: '投资规模（万元）', width: '220px' },
]

const autoColumns: Column[] = [
  { key: 'name', label: '项目名称' },
  { key: 'region', label: '所属区域' },
  { key: 'status', label: '推进状态' },
  { key: 'invest', label: '投资规模（万元）' },
]

const rows: ProjectRow[] = Array.from({ length: 8 }, (_, i) => ({
  id: `p-${i + 1}`,
  name: `数实融合智能制造示范项目 ${i + 1} 号（超长列名用于验证 nowrap 挤压行为）`,
  region: ['苏州工业园区', '南通市崇川区', '无锡市新吴区'][i % 3],
  status: ['推进中', '已签约', '筹建'][i % 3],
  invest: `${(i + 1) * 1200}`,
}))

const resizeLog = ref<Record<string, number> | null>(null)
function onColumnResize(widths: Record<string, number>) {
  resizeLog.value = widths
}
</script>

<template>
  <locale-provider :messages="zhCNAll" locale="zh-CN">
    <main class="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 bg-background px-6 py-12 text-foreground">
      <header class="space-y-2">
        <h1 class="text-2xl font-semibold tracking-tight">Data Table 列宽 Resizer 回归</h1>
        <p class="text-sm text-muted-foreground">
          回归点：① 场景 A 首列声明 760px，初始渲染应为真实 760px 而非被压缩；② 拖动列头右缘分隔线，列宽实时跟随；
          ③ 拖宽后总宽超出容器出现横向滚动；④ 悬停列头出现分隔线指示、悬停分隔线自身变为高亮色；⑤ 场景 B 无显式列宽，弹性铺满不回归。
        </p>
      </header>

      <section class="space-y-3" data-testid="scene-wide">
        <h2 class="text-base font-medium">场景 A：显式 px 列宽（总和 1540px &gt; 容器）</h2>
        <DataTable
          id="resize-regression-wide"
          :columns="wideColumns"
          :data="rows"
          row-id-key="id"
          data-testid="table-wide"
          @column-resize="onColumnResize"
        />
      </section>

      <section class="space-y-3" data-testid="scene-auto">
        <h2 class="text-base font-medium">场景 B：无显式列宽（默认弹性）</h2>
        <DataTable
          id="resize-regression-auto"
          :columns="autoColumns"
          :data="rows"
          row-id-key="id"
          data-testid="table-auto"
        />
      </section>

      <section class="space-y-2" data-testid="scene-events">
        <h2 class="text-base font-medium">columnResize 事件回显</h2>
        <p class="min-h-6 rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs text-muted-foreground" data-testid="resize-log">
          {{ resizeLog ? JSON.stringify(resizeLog) : '尚未拖动' }}
        </p>
      </section>
    </main>
  </locale-provider>
</template>
