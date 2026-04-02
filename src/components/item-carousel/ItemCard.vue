<script setup lang="ts">
import { computed } from "vue";
import { cn } from "./_adapter";
import type { Item } from "./schema";

interface ItemCardProps {
  item: Item;
  interactive?: boolean;
}

const props = defineProps<ItemCardProps>();

const emit = defineEmits<{
  itemClick: [itemId: string];
  itemAction: [itemId: string, actionId: string];
}>();

const isCardInteractive = computed(() => props.interactive);

function handleCardClick() {
  if (!isCardInteractive.value) return;
  emit("itemClick", props.item.id);
}

function handleActionClick(actionId: string, event: Event) {
  event.stopPropagation();
  emit("itemAction", props.item.id, actionId);
}
</script>

<template>
  <div
    :class="cn(
      'group @container/card relative flex w-52 min-w-48 flex-col gap-0 self-stretch overflow-clip rounded-md p-0 @lg:w-56',
      'bg-card border',
      isCardInteractive && 'cursor-pointer hover:shadow',
      'touch-manipulation'
    )"
  >
    <!-- Clickable overlay for interactive cards -->
    <button
      v-if="isCardInteractive"
      type="button"
      :aria-label="`View item: ${item.name}`"
      :class="cn(
        'absolute inset-0 z-10 rounded-md',
        'cursor-pointer touch-manipulation',
        'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
      )"
      @click="handleCardClick"
    />

    <!-- Image/Color Area -->
    <div class="bg-muted relative aspect-square w-full overflow-hidden">
      <img
        v-if="item.image"
        :src="item.image"
        :alt="item.name"
        loading="lazy"
        decoding="async"
        draggable="false"
        :class="cn(
          'h-full w-full object-cover transition-transform duration-200',
          isCardInteractive && 'group-hover:scale-105'
        )"
      />
      <div
        v-else
        :class="cn(
          'h-full w-full transition-transform duration-200',
          isCardInteractive && 'group-hover:scale-105'
        )"
        :style="item.color ? { backgroundColor: item.color } : undefined"
        role="img"
        :aria-label="item.name"
      />
    </div>

    <!-- Content -->
    <div class="flex flex-1 flex-col gap-1 p-3">
      <div class="flex flex-col gap-1">
        <h3 class="line-clamp-2 text-sm leading-tight font-medium">
          {{ item.name }}
        </h3>
        <p v-if="item.subtitle" class="text-muted-foreground line-clamp-1 text-sm">
          {{ item.subtitle }}
        </p>
      </div>

      <!-- Actions -->
      <div
        v-if="item.actions && item.actions.length > 0"
        :class="cn(
          'relative z-20 mt-auto flex flex-col-reverse gap-2 pt-2 @[176px]/card:flex-row'
        )"
      >
        <button
          v-for="action in item.actions"
          :key="action.id"
          type="button"
          :disabled="action.disabled"
          :class="cn(
            'inline-flex items-center justify-center rounded-md px-3 text-sm font-medium transition-colors',
            'focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',
            'min-h-11 w-full md:min-h-8 @[176px]/card:h-8 @[176px]/card:w-auto @[176px]/card:flex-1',
            action.variant === 'destructive'
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              : action.variant === 'secondary'
                ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                : action.variant === 'outline'
                  ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                  : action.variant === 'ghost'
                    ? 'hover:bg-accent hover:text-accent-foreground'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
          )"
          @click="handleActionClick(action.id, $event)"
        >
          {{ action.label }}
        </button>
      </div>
    </div>
  </div>
</template>
