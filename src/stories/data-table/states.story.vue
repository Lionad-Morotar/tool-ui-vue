<script setup lang="ts">
import { reactive, computed } from 'vue';
import { DataTable } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const subtitle = useStoryLocale('content.subtitle', messages)
const emptyState = useStoryLocale('content.emptyState', messages)
const controlledSort = useStoryLocale('content.controlledSort', messages)
const withMaxHeight = useStoryLocale('content.withMaxHeight', messages)
const withTextOverflow = useStoryLocale('content.withTextOverflow', messages)
const emptyMessage = useStoryLocale('content.emptyMessage', messages)
const colName = useStoryLocale('content.colName', messages)
const colStatus = useStoryLocale('content.colStatus', messages)
const colScore = useStoryLocale('content.colScore', messages)
const colGrade = useStoryLocale('content.colGrade', messages)
const colId = useStoryLocale('content.colId', messages)
const colProject = useStoryLocale('content.colProject', messages)
const colTags = useStoryLocale('content.colTags', messages)
const colCountry = useStoryLocale('content.colCountry', messages)
const colKeyPolicy = useStoryLocale('content.colKeyPolicy', messages)
const colLocalization = useStoryLocale('content.colLocalization', messages)
const colTarget = useStoryLocale('content.colTarget', messages)

const sortableState = reactive({
  sort: { by: 'score', direction: 'desc' as 'asc' | 'desc' },
});

function handleSortChange(sort: { by?: string; direction?: 'asc' | 'desc' }) {
  if (sort.by && sort.direction) {
    sortableState.sort = { by: sort.by, direction: sort.direction };
  }
}

// Empty columns
const emptyColumns = computed<any[]>(() => [
  { key: 'name', label: colName.value },
  { key: 'status', label: colStatus.value },
])

// Controlled sort columns
const controlledSortColumns = computed<any[]>(() => [
  { key: 'name', label: colName.value, sortable: true },
  { key: 'score', label: colScore.value, sortable: true },
  { key: 'grade', label: colGrade.value, sortable: false },
])

// Max height columns
const maxHeightColumns = computed<any[]>(() => [
  { key: 'id', label: colId.value },
  { key: 'name', label: colName.value },
  { key: 'status', label: colStatus.value },
])

// Array overflow columns
const arrayColumns = computed<any[]>(() => [
  { key: 'project', label: colProject.value },
  { key: 'tags', label: colTags.value, format: { kind: 'array', maxVisible: 2 } },
])

// Text overflow columns
const textOverflowColumns = computed<any[]>(() => [
  { key: 'country', label: colCountry.value, width: '80px' },
  { key: 'key_policy', label: colKeyPolicy.value },
  { key: 'localization', label: colLocalization.value },
  { key: 'target', label: colTarget.value },
])
</script>

<template>
  <Story title="DataTable/States">
    <Variant :title="emptyState">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <data-table
          id="data-table-empty"
          :columns="emptyColumns"
          :data="[]"
          :empty-message="emptyMessage"
        />
      </div>
    </Variant>

    <Variant :title="controlledSort" auto-props-disabled>
      <div class="w-full max-w-2xl space-y-4">
        <div class="text-sm text-muted-foreground">
          Current sort: {{ sortableState.sort.by }} {{ sortableState.sort.direction }}
        </div>
        <data-table
          id="data-table-controlled"
          :columns="controlledSortColumns"
          :data="[
            { name: 'Alice', score: 85, grade: 'B' },
            { name: 'Bob', score: 92, grade: 'A' },
            { name: 'Charlie', score: 78, grade: 'C' },
          ]"
          :sort="sortableState.sort"
          @sort-change="handleSortChange"
        />
      </div>
    </Variant>

    <Variant :title="withMaxHeight">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <data-table
          id="data-table-scroll"
          :columns="maxHeightColumns"
          :data="[
            { id: 1, name: 'Item 1', status: 'Active' },
            { id: 2, name: 'Item 2', status: 'Pending' },
            { id: 3, name: 'Item 3', status: 'Active' },
            { id: 4, name: 'Item 4', status: 'Completed' },
            { id: 5, name: 'Item 5', status: 'Active' },
            { id: 6, name: 'Item 6', status: 'Pending' },
            { id: 7, name: 'Item 7', status: 'Active' },
            { id: 8, name: 'Item 8', status: 'Completed' },
            { id: 9, name: 'Item 9', status: 'Active' },
            { id: 10, name: 'Item 10', status: 'Pending' },
            { id: 11, name: 'Item 11', status: 'Active' },
            { id: 12, name: 'Item 12', status: 'Completed' },
            { id: 13, name: 'Item 13', status: 'Active' },
            { id: 14, name: 'Item 14', status: 'Pending' },
            { id: 15, name: 'Item 15', status: 'Active' },
          ]"
          max-height="200px"
        />
      </div>
    </Variant>

    <Variant :title="withTextOverflow">
      <p class="mb-3 text-xs text-muted-foreground">Array overflow and text truncation with tooltip</p>
      <div class="w-full max-w-3xl space-y-6">
        <div>
          <p class="mb-2 text-sm font-medium">Array Overflow</p>
          <data-table
            id="data-table-array"
            :columns="arrayColumns"
            :data="[
              { project: 'Website Redesign', tags: ['Vue', 'Tailwind', 'TypeScript', 'Vite'] },
              { project: 'Mobile App', tags: ['React Native', 'Expo'] },
              { project: 'API Migration', tags: ['Go', 'gRPC', 'PostgreSQL', 'Docker', 'K8s'] },
            ]"
          />
        </div>
        <div>
          <p class="mb-2 text-sm font-medium">Text Truncation + Tooltip</p>
          <data-table
            id="data-table-text-overflow"
            :columns="textOverflowColumns"
            :data="[
              { country: 'Thailand', key_policy: 'EV3.5 Policy: Pure EV consumption tax reduced to 2%, but requires local battery manufacturing', localization: 'Core components such as batteries must be produced locally; for every 1 imported vehicle, 2-3 must be produced locally.', target: 'Produce 300,000 EVs by 2030, establishing Thailand as ASEAN EV production hub.' },
              { country: 'Indonesia', key_policy: 'Leveraging nickel resources to build full industrial chain from nickel to battery to vehicle', localization: 'Localization rate reaches 40% by 2026; power battery local content no less than 60%.', target: 'Ban ICE vehicle sales by 2040, becoming a global power battery manufacturing center.' },
              { country: 'Vietnam', key_policy: 'High purchase tax reduction and consumption tax incentives; Hanoi to phase out motorcycles from July 2026', localization: 'Localization rate threshold set at 30% by 2028.', target: 'Electric two-wheelers account for 25% of sales by 2030; ban ICE vehicles by 2040.' },
              { country: 'Malaysia', key_policy: 'Ending import EV road tax exemption, implementing tiered road tax; CKD models exempt from consumption tax', localization: 'Local assembly EV parts exempt from import duties until 2027; long-term guidance for local production.', target: 'EV penetration reaches 15% by 2030, 38% by 2040.' },
            ]"
            row-id-key="country"
            max-height="400px"
          />
        </div>
      </div>
    </Variant>
  </Story>
</template>
