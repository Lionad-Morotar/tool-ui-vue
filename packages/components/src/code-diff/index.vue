<script setup lang="ts">
import { cn } from '@lionad/vtu-core';
import { useI18n } from '@lionad/vtu-core/i18n';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-vue-next';
import { computed, reactive, toRefs } from 'vue';
import { useCodeDiff } from './states';
import type { CodeDiffProps } from './schema';

defineOptions({ name: 'CmptCodeDiff', inheritAttrs: false })

const props = withDefaults(defineProps<CodeDiffProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

// All business logic delegated to states layer
const states = reactive(useCodeDiff(props));

// Destructure state refs for v-model binding in template
const { isCopied } = toRefs(states);

// i18n
const { t } = useI18n()

// Derived i18n values for attribute bindings (type-safe unwrapping)
const copyButtonAriaLabel = computed(() =>
  isCopied.value ? t('codeDiff.copied').value : t('codeDiff.copyCode').value
)
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('@container flex w-full min-w-80 flex-col gap-3', css?.root)"
    :data-tool-ui-id="id"
    data-slot="code-diff"
  >
    <div class="bg-card shadow-xs border border-border rounded-lg overflow-hidden">
      <!-- Header -->
      <div class="flex justify-between items-center gap-2 bg-card px-4 py-2 border-border border-b">
        <div class="flex items-center gap-1">
          <span class="text-muted-foreground text-sm">
            {{ states.languageDisplayName }}
          </span>
          <template v-if="filename">
            <span class="text-muted-foreground/50">&bull;</span>
            <span class="font-medium text-foreground text-sm">{{ filename }}</span>
          </template>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="states.hasChanges" class="font-mono tabular-nums text-xs">
            <span v-if="states.stats.additions > 0" class="text-[#00cab1] dark:text-[#2ee8c8]">+{{ states.stats.additions }}</span>
            <span v-if="states.stats.additions > 0 && states.stats.deletions > 0"> </span>
            <span v-if="states.stats.deletions > 0" class="text-[#ff2e3f] dark:text-[#ff5c6a]">-{{ states.stats.deletions }}</span>
          </span>
          <button
            type="button"
            :class="cn(
              'inline-flex h-7 w-7 items-center justify-center rounded-md p-0 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
            )"
            :aria-label="copyButtonAriaLabel"
            @click="states.copyCode"
          >
            <check v-if="isCopied" class="w-4 h-4 text-green-700 dark:text-green-400" />
            <copy v-else class="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div
        :class="cn('overflow-x-auto overflow-y-clip text-sm', states.isCollapsed && 'max-h-[200px]')"
      >
        <!-- Unified Diff Mode -->
        <template v-if="!states.isSplitMode">
          <div
            v-for="(line, index) in states.displayUnifiedLines"
            :key="index"
            class="flex font-mono"
            :class="[
              line.type === 'addition' && states.additionBgColor,
              line.type === 'deletion' && states.deletionBgColor,
            ]"
          >
            <template v-if="lineNumbers !== 'hidden'">
              <span
                class="px-2 py-0.5 border-border/50 border-r w-10 text-muted-foreground/60 text-xs text-right select-none shrink-0"
              >
                {{ line.oldLineNum ?? '' }}
              </span>
              <span
                class="px-2 py-0.5 border-border/50 border-r w-10 text-muted-foreground text-xs text-right select-none shrink-0"
              >
                {{ line.newLineNum ?? '' }}
              </span>
            </template>
            <span
              class="flex-1 px-3 py-0.5 whitespace-pre"
              :class="[
                line.type === 'addition' && states.additionTextColor,
                line.type === 'deletion' && states.deletionTextColor,
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
                    part.added && states.wordAdditionBg,
                    part.removed && states.wordDeletionBg,
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
            <div class="flex-1 border-border/50 border-r min-w-0">
              <div
                v-for="(line, index) in states.displaySplitLines"
                :key="`old-${index}`"
                class="flex font-mono"
                :class="[
                  line.oldLine?.type === 'deletion' && states.deletionBgColor,
                ]"
              >
                <template v-if="lineNumbers !== 'hidden'">
                  <span
                    class="px-2 py-0.5 border-border/50 border-r w-10 text-muted-foreground/60 text-xs text-right select-none shrink-0"
                  >
                    {{ line.oldLine?.lineNum ?? '' }}
                  </span>
                </template>
                <span
                  class="flex-1 px-3 py-0.5 min-w-0 overflow-hidden whitespace-pre"
                  :class="[
                    line.oldLine?.type === 'deletion' && states.deletionTextColor,
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
                        part.removed && states.wordDeletionBg,
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
            <div class="flex-1 min-w-0">
              <div
                v-for="(line, index) in states.displaySplitLines"
                :key="`new-${index}`"
                class="flex font-mono"
                :class="[
                  line.newLine?.type === 'addition' && states.additionBgColor,
                ]"
              >
                <template v-if="lineNumbers !== 'hidden'">
                  <span
                    class="px-2 py-0.5 border-border/50 border-r w-10 text-muted-foreground text-xs text-right select-none shrink-0"
                  >
                    {{ line.newLine?.lineNum ?? '' }}
                  </span>
                </template>
                <span
                  class="flex-1 px-3 py-0.5 min-w-0 overflow-hidden whitespace-pre"
                  :class="[
                    line.newLine?.type === 'addition' && states.additionTextColor,
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
                        part.added && states.wordAdditionBg,
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
        v-if="states.shouldCollapse"
        type="button"
        :class="cn(
          'w-full rounded-none border-t border-border font-normal text-muted-foreground',
          'inline-flex items-center justify-center px-4 py-2 text-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        )"
        @click="states.toggleExpanded"
      >
        <template v-if="states.isCollapsed">
          <chevron-down class="mr-1 size-4" />
          {{ t('codeDiff.showFullDiff') }}
        </template>
        <template v-else>
          <chevron-up class="mr-1 size-4" />
          {{ t('codeDiff.collapse') }}
        </template>
      </button>
    </div>
  </div>
</template>
