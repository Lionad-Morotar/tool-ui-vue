<script setup lang="ts">
defineOptions({ name: 'CmptCitationItem', inheritAttrs: false })

import { typeIcons } from '../icons';
import type { CitationType, SerializableCitation } from '../schema';

interface CitationItemProps {
  citation: SerializableCitation;
  index: number;
}

const props = defineProps<CitationItemProps>();

const emit = defineEmits<{
  navigate: [href: string, citation: SerializableCitation];
}>();

function getTypeIcon(type: CitationType | undefined) {
  return typeIcons[type ?? 'webpage'] ?? typeIcons.webpage;
}

function handleClick() {
  const href = props.citation.href;
  if (!href) return;
  emit('navigate', href, props.citation);
}
</script>

<template>
  <button
    type="button"
    class="group flex w-full cursor-pointer items-center gap-2.5 rounded-md p-2 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
    @click="handleClick"
  >
    <img
      v-if="citation.favicon"
      :src="citation.favicon"
      alt=""
      aria-hidden="true"
      width="16"
      height="16"
      class="size-4 shrink-0 rounded bg-muted object-cover"
    />
    <svg
      v-else
      :viewBox="getTypeIcon(citation.type).viewBox"
      class="size-4 shrink-0 text-muted-foreground"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path :d="getTypeIcon(citation.type).path" />
    </svg>
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-medium group-hover:underline group-hover:decoration-foreground/30 group-hover:underline-offset-2">
        {{ citation.title }}
      </p>
      <p class="truncate text-xs text-muted-foreground">
        {{ citation.domain }}
      </p>
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="mt-0.5 size-3.5 shrink-0 self-start text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line
        x1="10"
        x2="21"
        y1="14"
        y2="3"
      />
    </svg>
  </button>
</template>
