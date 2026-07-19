<script setup lang="ts">
defineOptions({ name: 'CmptCitationOverflowPopover', inheritAttrs: false })

import CitationItem from './citation-item.vue';
import { cn } from '../../core';
import { usePopover } from '../states/usePopover';
import type { SerializableCitation } from '../schema';

interface CitationOverflowPopoverProps {
  id: string;
  citations: SerializableCitation[];
  placement: 'top' | 'bottom';
  onNavigate?: (href: string, citation: SerializableCitation) => void;
  triggerText: string;
  triggerClass?: string;
  testid?: string;
}

const props = defineProps<CitationOverflowPopoverProps>();

const emit = defineEmits<{
  navigate: [href: string, citation: SerializableCitation];
}>();

const popover = usePopover({ placement: props.placement, id: `${props.id}-popover-${props.placement}` });

function handleNavigate(href: string, citation: SerializableCitation) {
  if (props.onNavigate) {
    props.onNavigate(href, citation);
  } else {
    emit('navigate', href, citation);
  }
}

const popoverClass = props.placement === 'bottom'
  ? 'citation-list-popover--bottom'
  : 'citation-list-popover--top';
</script>

<template>
  <div
    class="relative"
    :data-testid="testid"
  >
    <button
      :ref="(el: any) => { if (el) popover.triggerRef.value = el as HTMLElement }"
      type="button"
      :class="triggerClass"
      :style="popover.supportsAnchor ? { anchorName: `--citation-list-${placement}` } : undefined"
      v-bind="popover.triggerAttrs()"
      @mouseenter="popover.handleMouseEnter"
      @mouseleave="popover.handleMouseLeave"
      @keydown="popover.handleTriggerKeyDown"
    >
      <span class="text-muted-foreground">{{ triggerText }}</span>
    </button>
    <!-- Overflow popover -->
    <div
      :ref="(el: any) => { if (el) popover.popoverRef.value = el as HTMLElement }"
      data-testid="popover"
      :class="cn(
        placement === 'bottom'
          ? 'absolute top-full left-0 z-50 mt-2'
          : 'absolute bottom-full left-0 z-50 mb-2',
        'w-80 rounded-md border border-border bg-popover p-1 shadow-md',
        popover.supportsAnchor && popoverClass
      )"
      v-bind="popover.popoverAttrs()"
      @mouseenter="popover.handleMouseEnter"
      @mouseleave="popover.handleMouseLeave"
      @keydown="popover.handlePopoverKeyDown"
    >
      <div class="flex max-h-72 flex-col overflow-y-auto">
        <citation-item
          v-for="(citation, index) in citations"
          :key="citation.id"
          :citation="citation"
          :index="index"
          @navigate="handleNavigate"
        />
      </div>
    </div>
  </div>
</template>
