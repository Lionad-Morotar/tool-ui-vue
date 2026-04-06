<script setup lang="ts">
import { cn } from '@lionad/vtu-core';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-vue-next';
import { reactive, toRefs } from 'vue';
import { useCodeDiff } from './states';
import type { CodeDiffProps } from './schema';

defineOptions({ name: 'CmptCodeDiff', inheritAttrs: false })

const props = withDefaults(defineProps<CodeDiffProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

// All business logic delegated to states layer
const codeDiffState = reactive(useCodeDiff(props));

// Destructure state refs for v-model binding in template
const { isCopied } = toRefs(codeDiffState);
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('@container flex w-full min-w-80 flex-col gap-3', css?.root)"
    :data-tool-ui-id="id"
    data-slot="code-diff"
  >
    <div class="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
      <!-- Header -->
      <div class="flex items-center justify-between gap-2 border-b bg-card px-4 py-2">
        <div class="flex items-center gap-1">
          <span class="text-sm text-muted-foreground">
            {{ codeDiffState.languageDisplayName }}
          </span>
          <template v-if="filename">
            <span class="text-muted-foreground/50">&bull;</span>
            <span class="text-sm font-medium text-foreground">{{ filename }}</span>
          </template>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="codeDiffState.hasChanges" class="font-mono text-xs tabular-nums">
            <span v-if="codeDiffState.stats.additions > 0" class="text-[#00cab1] dark:text-[#2ee8c8]">+{{ codeDiffState.stats.additions }}</span>
            <span v-if="codeDiffState.stats.additions > 0 && codeDiffState.stats.deletions > 0"> </span>
            <span v-if="codeDiffState.stats.deletions > 0" class="text-[#ff2e3f] dark:text-[#ff5c6a]">-{{ codeDiffState.stats.deletions }}</span>
          </span>
          <button
            type="button"
            :class="cn(
              'inline-flex h-7 w-7 items-center justify-center rounded-md p-0 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
            )"
            :aria-label="isCopied ? 'Copied' : 'Copy code'"
            @click="codeDiffState.copyCode"
          >
            <check v-if="isCopied" class="h-4 w-4 text-green-700 dark:text-green-400" />
            <copy v-else class="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div
        :class="cn('overflow-x-auto overflow-y-clip text-sm', codeDiffState.isCollapsed && 'max-h-[200px]')"
      >
        <!-- Unified Diff Mode -->
        <template v-if="!codeDiffState.isSplitMode">
          <div
            v-for="(line, index) in codeDiffState.displayUnifiedLines"
            :key="index"
            class="flex font-mono"
            :class="[
              line.type === 'addition' && codeDiffState.additionBgColor,
              line.type === 'deletion' && codeDiffState.deletionBgColor,
            ]"
          >
            <template v-if="lineNumbers !== 'hidden'">
              <span
                class="w-10 shrink-0 border-r border-border/50 px-2 py-0.5 text-right text-xs text-muted-foreground/60 select-none"
              >
                {{ line.oldLineNum ?? '' }}
              </span>
              <span
                class="w-10 shrink-0 border-r border-border/50 px-2 py-0.5 text-right text-xs text-muted-foreground select-none"
              >
                {{ line.newLineNum ?? '' }}
              </span>
            </template>
            <span
              class="flex-1 px-3 py-0.5 whitespace-pre"
              :class="[
                line.type === 'addition' && codeDiffState.additionTextColor,
                line.type === 'deletion' && codeDiffState.deletionTextColor,
              ]"
            >
              <span
                class="mr-1 select-none"
                :class="line.type === 'addition' ? 'text-emerald-500' : line.type === 'deletion' ? 'text-red-500' : ''"
              >
                {{ line.type === 'addition' ? '+' : line.type === 'deletion' ? '-' : ' ' }}
              </span>
              <!-- Word-level diff highlighting -->
              <template v-if="line.wordDiffs && line.wordDiffs.length > 0">
                <span
                  v-for="(part, partIndex) in line.wordDiffs"
                  :key="partIndex"
                  :class="[
                    part.added && codeDiffState.wordAdditionBg,
                    part.removed && codeDiffState.wordDeletionBg,
                    part.added && 'rounded px-0.5',
                    part.removed && 'rounded px-0.5',
                  ]"
                >{{ part.value }}</span>
              </template>
              <template v-else>
                {{ line.content || ' ' }}
              </template>
            </span>
          </div>
        </template>

        <!-- Split Diff Mode -->
        <template v-else>
          <div class="flex">
            <!-- Old side -->
            <div class="min-w-0 flex-1 border-r border-border/50">
              <div
                v-for="(line, index) in codeDiffState.displaySplitLines"
                :key="`old-${index}`"
                class="flex font-mono"
                :class="[
                  line.oldLine?.type === 'deletion' && codeDiffState.deletionBgColor,
                ]"
              >
                <template v-if="lineNumbers !== 'hidden'">
                  <span
                    class="w-10 shrink-0 border-r border-border/50 px-2 py-0.5 text-right text-xs text-muted-foreground/60 select-none"
                  >
                    {{ line.oldLine?.lineNum ?? '' }}
                  </span>
                </template>
                <span
                  class="min-w-0 flex-1 overflow-hidden px-3 py-0.5 whitespace-pre"
                  :class="[
                    line.oldLine?.type === 'deletion' && codeDiffState.deletionTextColor,
                  ]"
                >
                  <span
                    v-if="line.oldLine"
                    class="mr-1 select-none"
                    :class="line.oldLine.type === 'deletion' && 'text-red-500'"
                  >
                    {{ line.oldLine.type === 'deletion' ? '-' : ' ' }}
                  </span>
                  <!-- Word-level diff highlighting for old side -->
                  <template v-if="line.oldLine?.wordDiffs && line.oldLine.wordDiffs.length > 0">
                    <span
                      v-for="(part, partIndex) in line.oldLine.wordDiffs"
                      :key="partIndex"
                      :class="[
                        part.removed && codeDiffState.wordDeletionBg,
                        part.removed && 'rounded px-0.5',
                      ]"
                    >{{ part.value }}</span>
                  </template>
                  <template v-else>
                    {{ line.oldLine?.content || ' ' }}
                  </template>
                </span>
              </div>
            </div>

            <!-- New side -->
            <div class="min-w-0 flex-1">
              <div
                v-for="(line, index) in codeDiffState.displaySplitLines"
                :key="`new-${index}`"
                class="flex font-mono"
                :class="[
                  line.newLine?.type === 'addition' && codeDiffState.additionBgColor,
                ]"
              >
                <template v-if="lineNumbers !== 'hidden'">
                  <span
                    class="w-10 shrink-0 border-r border-border/50 px-2 py-0.5 text-right text-xs text-muted-foreground select-none"
                  >
                    {{ line.newLine?.lineNum ?? '' }}
                  </span>
                </template>
                <span
                  class="min-w-0 flex-1 overflow-hidden px-3 py-0.5 whitespace-pre"
                  :class="[
                    line.newLine?.type === 'addition' && codeDiffState.additionTextColor,
                  ]"
                >
                  <span
                    v-if="line.newLine"
                    class="mr-1 select-none"
                    :class="line.newLine.type === 'addition' && 'text-emerald-500'"
                  >
                    {{ line.newLine.type === 'addition' ? '+' : ' ' }}
                  </span>
                  <!-- Word-level diff highlighting for new side -->
                  <template v-if="line.newLine?.wordDiffs && line.newLine.wordDiffs.length > 0">
                    <span
                      v-for="(part, partIndex) in line.newLine.wordDiffs"
                      :key="partIndex"
                      :class="[
                        part.added && codeDiffState.wordAdditionBg,
                        part.added && 'rounded px-0.5',
                      ]"
                    >{{ part.value }}</span>
                  </template>
                  <template v-else>
                    {{ line.newLine?.content || ' ' }}
                  </template>
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Collapse Toggle -->
      <button
        v-if="codeDiffState.shouldCollapse"
        type="button"
        :class="cn(
          'w-full rounded-none border-t font-normal text-muted-foreground',
          'inline-flex items-center justify-center px-4 py-2 text-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        )"
        @click="codeDiffState.toggleExpanded"
      >
        <template v-if="codeDiffState.isCollapsed">
          <chevron-down class="mr-1 size-4" />
          Show full diff
        </template>
        <template v-else>
          <chevron-up class="mr-1 size-4" />
          Collapse
        </template>
      </button>
    </div>
  </div>
</template>
