<script setup lang="ts">
import { reactive, computed } from 'vue';
import { DataTable } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const interactiveLayoutPlayground = useStoryLocale('content.interactiveLayoutPlayground', messages)
const featureFlags = useStoryLocale('content.featureFlags', messages)
const interactionHint = useStoryLocale('content.interactionHint', messages)
const featureFlagsHint = useStoryLocale('content.featureFlagsHint', messages)
const colName = useStoryLocale('content.colName', messages)
const colStatus = useStoryLocale('content.colStatus', messages)
const colRevenue = useStoryLocale('content.colRevenue', messages)
const colProject = useStoryLocale('content.colProject', messages)
const colOwner = useStoryLocale('content.colOwner', messages)
const colBudget = useStoryLocale('content.colBudget', messages)
const colDeadline = useStoryLocale('content.colDeadline', messages)
const colNotes = useStoryLocale('content.colNotes', messages)

const playgroundState = reactive({
  layout: 'table' as 'auto' | 'table' | 'cards',
});

// Playground columns
const playgroundColumns = computed<any[]>(() => [
  { key: 'project', label: colProject.value, priority: 'primary' },
  { key: 'owner', label: colOwner.value, priority: 'primary' },
  { key: 'status', label: colStatus.value, priority: 'secondary', format: { kind: 'status', statusMap: {
    'In Progress': { tone: 'info' },
    Planning: { tone: 'warning' },
    Completed: { tone: 'success' },
  }}},
  { key: 'budget', label: colBudget.value, priority: 'secondary', format: { kind: 'currency', currency: 'USD' } },
  { key: 'deadline', label: colDeadline.value, priority: 'tertiary' },
  { key: 'notes', label: colNotes.value, hideOnMobile: true },
])

// Feature flags demo columns
const featureFlagsColumns = computed<any[]>(() => [
  { key: 'name', label: colName.value, sortable: true },
  { key: 'status', label: colStatus.value, sortable: true },
  { key: 'revenue', label: colRevenue.value, sortable: true, format: { kind: 'currency', currency: 'USD' } },
])
</script>

<template>
  <Story title="DataTable/Playground">
    <Variant :title="interactiveLayoutPlayground" auto-props-disabled>
      <div class="w-full max-w-2xl space-y-4">
        <p class="text-sm text-muted-foreground">{{ interactionHint }}</p>
        <data-table
          id="data-table-playground"
          v-bind="playgroundState"
          :columns="playgroundColumns"
          :data="[
            { project: 'Website Redesign', owner: 'Alice', status: 'In Progress', budget: 45000, deadline: '2024-03-15', notes: 'Needs brand assets' },
            { project: 'Mobile App', owner: 'Bob', status: 'Planning', budget: 120000, deadline: '2024-06-30', notes: 'iOS-first approach' },
            { project: 'API Migration', owner: 'Carol', status: 'Completed', budget: 28000, deadline: '2024-01-20', notes: 'Zero downtime' },
            { project: 'Design System', owner: 'Dan', status: 'In Progress', budget: 62000, deadline: '2024-05-10', notes: 'Token pipeline' },
            { project: 'Billing Revamp', owner: 'Eve', status: 'Planning', budget: 88000, deadline: '2024-08-01', notes: 'Proration rules' },
            { project: 'Search Infra', owner: 'Frank', status: 'Completed', budget: 54000, deadline: '2024-02-28', notes: 'Reindex strategy' },
            { project: 'Data Pipeline', owner: 'Grace', status: 'In Progress', budget: 97000, deadline: '2024-07-15', notes: 'CDC connectors' },
            { project: 'Auth Overhaul', owner: 'Heidi', status: 'Planning', budget: 41000, deadline: '2024-09-20', notes: 'Passkey rollout' },
          ]"
          row-id-key="project"
          max-height="320px"
        />
      </div>
    </Variant>

    <Variant :title="featureFlags">
      <p class="mb-3 text-xs text-muted-foreground">{{ featureFlagsHint }}</p>
      <div class="w-full max-w-2xl">
        <data-table
          id="data-table-feature-flags"
          :columns="featureFlagsColumns"
          :data="[
            { name: 'Product A', status: 'Active', revenue: 12450 },
            { name: 'Product B', status: 'Draft', revenue: 8230 },
            { name: 'Product C', status: 'Active', revenue: 24100 },
          ]"
          :features="{ reorder: false, export: false }"
        />
      </div>
    </Variant>
  </Story>
</template>
