<script setup lang="ts">
import { computed, h } from "vue";
import { Check, X, icons } from "lucide-vue-next";
import { cn } from "./_adapter";
import type { ApprovalCardBaseProps, ApprovalDecision } from "./schema";

const props = defineProps<ApprovalCardBaseProps>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const resolvedVariant = computed(() => props.variant ?? "default");
const resolvedConfirmLabel = computed(() => props.confirmLabel ?? "Approve");
const resolvedCancelLabel = computed(() => props.cancelLabel ?? "Deny");
const isDestructive = computed(() => resolvedVariant.value === "destructive");

// Dynamic icon lookup using lucide-vue-next
const IconComponent = computed(() => {
  if (!props.icon) return null;

  // Convert kebab-case to PascalCase for icon lookup
  const pascalName = props.icon
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  const Icon = icons[pascalName as keyof typeof icons];
  return Icon ?? null;
});

// Receipt display label - follows React logic
const receiptLabel = computed(() => {
  // Use the appropriate label based on choice
  if (props.choice === "approved") {
    return resolvedConfirmLabel.value;
  }
  return resolvedCancelLabel.value;
});

function handleConfirm() {
  emit("confirm");
}

function handleCancel() {
  emit("cancel");
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    emit("cancel");
  }
}
</script>

<template>
  <!-- Receipt view when choice is made -->
  <div
    v-if="choice"
    :class="
      cn(
        'flex w-full min-w-64 max-w-md flex-col',
        'text-foreground',
        'motion-safe:animate-in motion-safe:fade-in motion-safe:blur-in-sm motion-safe:zoom-in-95 motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:fill-mode-both',
        className,
      )
    "
    data-slot="approval-card"
    :data-tool-ui-id="id"
    data-receipt="true"
    role="status"
    :aria-label="receiptLabel"
  >
    <div
      :class="
        cn(
          'bg-card/60 border-border flex w-full items-center gap-3 rounded-2xl border px-4 py-3 shadow-xs',
        )
      "
    >
      <span
        :class="
          cn(
            'flex size-8 shrink-0 items-center justify-center rounded-full bg-muted',
            choice === 'approved' ? 'text-primary' : 'text-muted-foreground',
          )
        "
      >
        <component
          :is="choice === 'approved' ? Check : X"
          class="size-4"
        />
      </span>
      <div class="flex flex-col">
        <span class="text-sm font-medium">{{ receiptLabel }}</span>
        <span class="text-muted-foreground text-sm">{{ title }}</span>
      </div>
    </div>
  </div>

  <!-- Interactive view -->
  <article
    v-else
    :class="
      cn(
        'flex w-full min-w-64 max-w-md flex-col gap-3',
        'text-foreground',
        className,
      )
    "
    data-slot="approval-card"
    :data-tool-ui-id="id"
    role="dialog"
    :aria-labelledby="`${id}-title`"
    :aria-describedby="description ? `${id}-description` : undefined"
    tabindex="-1"
    @keydown="handleKeyDown"
  >
    <div
      class="bg-card border-border flex w-full flex-col gap-4 rounded-2xl border p-5 shadow-xs"
    >
      <div class="flex items-start gap-3">
        <span
          v-if="IconComponent"
          :class="
            cn(
              'flex size-10 shrink-0 items-center justify-center rounded-xl',
              isDestructive
                ? 'bg-destructive/10 text-destructive'
                : 'bg-primary/10 text-primary',
            )
          "
        >
          <component :is="IconComponent" class="size-5" />
        </span>
        <div class="flex flex-1 flex-col gap-1">
          <h2
            :id="`${id}-title`"
            class="text-base font-semibold leading-tight"
          >
            {{ title }}
          </h2>
          <p
            v-if="description"
            :id="`${id}-description`"
            class="text-muted-foreground text-sm"
          >
            {{ description }}
          </p>
        </div>
      </div>

      <template v-if="metadata && metadata.length > 0">
        <hr class="border-border shrink-0 border-t" />
        <dl class="flex flex-col gap-2 text-sm">
          <div
            v-for="(item, index) in metadata"
            :key="index"
            class="flex justify-between gap-4"
          >
            <dt class="text-muted-foreground shrink-0">{{ item.key }}</dt>
            <dd class="min-w-0 truncate">{{ item.value }}</dd>
          </div>
        </dl>
      </template>
    </div>

    <!-- Action buttons -->
    <div class="@container/actions">
      <div
        :class="
          cn(
            'flex w-full flex-col gap-3',
            'flex-col @[240px]/actions:flex-row @[240px]/actions:flex-wrap @[240px]/actions:items-center @[240px]/actions:gap-2 @[240px]/actions:justify-end',
          )
        "
      >
        <button
          type="button"
          :class="
            cn(
              'inline-flex items-center justify-center rounded-full px-4 text-base font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              'disabled:pointer-events-none disabled:opacity-50',
              'min-h-11 w-full text-base',
              '@[240px]/actions:min-h-0 @[240px]/actions:w-auto @[240px]/actions:px-3 @[240px]/actions:py-2 @[240px]/actions:text-sm',
            )
          "
          @click="handleCancel"
        >
          {{ resolvedCancelLabel }}
        </button>
        <button
          type="button"
          :class="
            cn(
              'inline-flex items-center justify-center rounded-full px-4 text-base font-medium transition-colors',
              'focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              'disabled:pointer-events-none disabled:opacity-50',
              'min-h-11 w-full text-base',
              '@[240px]/actions:min-h-0 @[240px]/actions:w-auto @[240px]/actions:px-3 @[240px]/actions:py-2 @[240px]/actions:text-sm',
              isDestructive
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )
          "
          @click="handleConfirm"
        >
          {{ resolvedConfirmLabel }}
        </button>
      </div>
    </div>
  </article>
</template>
