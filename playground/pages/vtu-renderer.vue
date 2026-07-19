<script setup lang="ts">
import { VtuRenderer } from '@lionad/vtu-renderer';
import type { Spec } from '@json-render/core';

const approvalCardSpec: Spec = {
  root: 'card',
  elements: {
    card: {
      type: 'ApprovalCard',
      props: {
        id: 'approval-1',
        title: '确认部署到生产环境？',
        description: '此操作将触发 CI/CD 流水线并将最新构建推送至 production 集群。',
        icon: 'rocket',
        variant: 'default',
        confirmLabel: '确认部署',
        cancelLabel: '取消',
        metadata: [
          { label: '版本', value: 'v2.14.0' },
          { label: '提交', value: 'a1b2c3d' },
        ],
      },
    },
  },
};

const statsDisplaySpec: Spec = {
  root: 'stats',
  elements: {
    stats: {
      type: 'StatsDisplay',
      props: {
        id: 'stats-1',
        title: '本周核心指标',
        description: '数据截至昨日 23:59',
        stats: [
          {
            key: 'mau',
            label: '月活跃用户',
            value: 12480,
            format: { kind: 'number', compact: true },
            diff: { value: 12.5, upIsPositive: true, label: '环比上周' },
            sparkline: { data: [11000, 11500, 11200, 11800, 12100, 12300, 12480], color: '#10b981' },
          },
          {
            key: 'revenue',
            label: '营收',
            value: 42800,
            format: { kind: 'currency', currency: 'CNY' },
            diff: { value: -3.2, upIsPositive: true, label: '环比上周' },
          },
        ],
      },
    },
  },
};

const terminalSpec: Spec = {
  root: 'term',
  elements: {
    term: {
      type: 'Terminal',
      props: {
        id: 'term-1',
        command: 'pnpm build && pnpm test',
        stdout: 'vite v8.0.3 building for production...\n✓ 89 modules transformed.\ndist/index.js  94.84 kB │ gzip: 23.40 kB\n✓ built in 2.88s\n\nTest Files  4 passed (4)\nTests  19 passed (19)',
        exitCode: 0,
        durationMs: 3240,
        cwd: '/Users/lionad/Github/Lionad-Morotar/tool-ui-vue/packages/renderer',
      },
    },
  },
};

const citationSpec: Spec = {
  root: 'cite',
  elements: {
    cite: {
      type: 'Citation',
      props: {
        id: 'cite-1',
        href: 'https://github.com/vercel-labs/json-render',
        title: 'json-render — Vercel Labs',
        snippet: 'A JSON-based UI rendering system for AI applications.',
        domain: 'github.com',
        variant: 'default',
      },
    },
  },
};

const codeBlockSpec: Spec = {
  root: 'code',
  elements: {
    code: {
      type: 'CodeBlock',
      props: {
        id: 'code-1',
        code: "import { VtuRenderer } from '@lionad/vtu-renderer';\n\nconst spec = {\n  root: 'terminal',\n  elements: {\n    terminal: {\n      type: 'Terminal',\n      props: { id: 't1', command: 'echo hello', exitCode: 0 }\n    }\n  }\n};\n",
        language: 'typescript',
        filename: 'demo.vue',
        lineNumbers: 'visible',
      },
    },
  },
};

const progressTrackerSpec: Spec = {
  root: 'progress',
  elements: {
    progress: {
      type: 'ProgressTracker',
      props: {
        id: 'progress-1',
        title: '订单处理进度',
        steps: [
          { id: 's1', label: '下单成功', status: 'completed' },
          { id: 's2', label: '支付确认', status: 'completed' },
          { id: 's3', label: '仓库配货', status: 'in-progress' },
          { id: 's4', label: '物流配送', status: 'pending' },
          { id: 's5', label: '签收完成', status: 'pending' },
        ],
        elapsedTime: 186,
      },
    },
  },
};

const orderSummarySpec: Spec = {
  root: 'order',
  elements: {
    order: {
      type: 'OrderSummary',
      props: {
        id: 'order-1',
        title: '订单确认',
        variant: 'summary',
        items: [
          { id: 'i1', name: 'Vue 3 高级进阶', description: '电子书 + 源码', quantity: 1, unitPrice: 129 },
          { id: 'i2', name: 'Tailwind 设计系统', description: '视频课程', quantity: 1, unitPrice: 199 },
        ],
        pricing: {
          subtotal: 328,
          tax: 0,
          total: 328,
          currency: 'CNY',
        },
      },
    },
  },
};

const imageSpec: Spec = {
  root: 'img',
  elements: {
    img: {
      type: 'Image',
      props: {
        id: 'img-1',
        assetId: 'asset-demo-1',
        src: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
        alt: 'MacBook 展示图',
        title: '开发工作站',
        description: '搭载 M3 Max 的 MacBook Pro，开发效率的终极选择。',
        ratio: '16:9',
        fit: 'cover',
      },
    },
  },
};

const demos = [
  { title: 'ApprovalCard', spec: approvalCardSpec },
  { title: 'StatsDisplay', spec: statsDisplaySpec },
  { title: 'Terminal', spec: terminalSpec },
  { title: 'Citation', spec: citationSpec },
  { title: 'CodeBlock', spec: codeBlockSpec },
  { title: 'ProgressTracker', spec: progressTrackerSpec },
  { title: 'OrderSummary', spec: orderSummarySpec },
  { title: 'Image', spec: imageSpec },
];
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="border-b border-border px-6 py-8">
      <h1 class="text-2xl font-semibold tracking-tight">
        VtuRenderer 测试页面
      </h1>
      <p class="mt-2 text-sm text-muted-foreground">
        完全由 vtu spec 构建的组件渲染展示，所有内容均通过 @lionad/vtu-renderer 渲染。
      </p>
    </header>

    <main class="mx-auto max-w-5xl px-6 py-10">
      <section
        v-for="demo in demos"
        :key="demo.title"
        class="mb-12 rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <h2 class="mb-4 text-sm font-medium tracking-wider text-muted-foreground uppercase">
          {{ demo.title }}
        </h2>
        <div class="rounded-lg border border-dashed border-border bg-background/50 p-4">
          <vtu-renderer :spec="demo.spec" />
        </div>
      </section>
    </main>
  </div>
</template>
