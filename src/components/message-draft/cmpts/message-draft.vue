<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick } from 'vue';
import { cn } from '../_adapter';
import type {
  RuntimeMessageDraftProps,
  SerializableEmailDraft,
  SerializableSlackDraft,
} from '../schema';

defineOptions({ name: 'cmpt-message-draft', inheritAttrs: false })

const props = withDefaults(defineProps<RuntimeMessageDraftProps & {
  undoGracePeriod?: number;
  onSend?: () => void | Promise<void>;
  onUndo?: () => void;
  onCancel?: () => void;
  css?: { root?: string };
}>(), {
  css: () => ({ root: '' })
})

const emit = defineEmits<{
  send: [];
  undo: [];
  cancel: [];
}>();

type DraftState = 'review' | 'sending' | 'sent' | 'cancelled';

const COLLAPSED_BODY_HEIGHT = 280;
const DEFAULT_UNDO_GRACE_PERIOD = 5000;

const state = ref<DraftState>(resolveStateFromOutcome(props.outcome));
const countdown = ref(Math.ceil((props.undoGracePeriod ?? DEFAULT_UNDO_GRACE_PERIOD) / 1000));
const sentAt = ref<Date | null>(props.outcome === 'sent' ? new Date() : null);
const isExpanded = ref(false);
const needsExpansion = ref(false);
const undoButtonRef = ref<HTMLButtonElement | null>(null);

let timer: ReturnType<typeof setTimeout> | null = null;
let countdownInterval: ReturnType<typeof setInterval> | null = null;

function resolveStateFromOutcome(outcome: typeof props.outcome): DraftState {
  if (outcome === 'sent') return 'sent';
  if (outcome === 'cancelled') return 'cancelled';
  return 'review';
}

function resolveOutcomeTransition(
  previousOutcome: typeof props.outcome,
  nextOutcome: typeof props.outcome
): DraftState | null {
  if (previousOutcome === nextOutcome) return null;
  return resolveStateFromOutcome(nextOutcome);
}

function clearTimers() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

function formatSentTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function handleSend() {
  state.value = 'sending';
}

function handleUndo() {
  clearTimers();
  state.value = 'review';
  props.onUndo?.();
  emit('undo');
}

function handleCancel() {
  clearTimers();
  state.value = 'cancelled';
  props.onCancel?.();
  emit('cancel');
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && state.value === 'review') {
    event.preventDefault();
    handleCancel();
  }
}

function handleToggleExpand() {
  isExpanded.value = !isExpanded.value;
}

// Watch for outcome prop changes
let previousOutcome = props.outcome;
watch(
  () => props.outcome,
  (newOutcome) => {
    const nextState = resolveOutcomeTransition(previousOutcome, newOutcome);
    previousOutcome = newOutcome;

    if (nextState === null) return;

    clearTimers();
    state.value = nextState;
    countdown.value = Math.ceil((props.undoGracePeriod ?? DEFAULT_UNDO_GRACE_PERIOD) / 1000);
    sentAt.value = nextState === 'sent' ? new Date() : null;
  }
);

// Watch for state changes to handle sending timer
watch(
  () => state.value,
  async (newState) => {
    if (newState === 'sending') {
      // Focus undo button after DOM update
      await nextTick();
      undoButtonRef.value?.focus();

      countdown.value = Math.ceil((props.undoGracePeriod ?? DEFAULT_UNDO_GRACE_PERIOD) / 1000);

      countdownInterval = setInterval(() => {
        if (countdown.value <= 1) {
          if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
          }
          countdown.value = 0;
        } else {
          countdown.value = countdown.value - 1;
        }
      }, 1000);

      timer = setTimeout(async () => {
        clearTimers();
        await props.onSend?.();
        emit('send');
        sentAt.value = new Date();
        state.value = 'sent';
      }, props.undoGracePeriod ?? DEFAULT_UNDO_GRACE_PERIOD);
    }
  }
);

onUnmounted(() => {
  clearTimers();
});

// Computed for expand button visibility
const showExpandButton = computed(() => needsExpansion.value);

// Type guards for discriminated union
const isEmailDraft = computed(() => props.channel === 'email');
const isSlackDraft = computed(() => props.channel === 'slack');

// Cast props for type narrowing in template
const emailProps = computed(() => props as unknown as SerializableEmailDraft);
const slackProps = computed(() => props as unknown as SerializableSlackDraft);
</script>

<template>
  <!-- Cancelled state - render nothing -->
  <template v-if="state !== 'cancelled'">
    <!-- Sent receipt state -->
    <div
      v-if="state === 'sent'"
      :class="
        cn(
          'flex w-full max-w-lg min-w-64 flex-col',
          'text-foreground',
          'motion-safe:animate-in motion-safe:fade-in motion-safe:blur-in-sm motion-safe:zoom-in-95 motion-safe:fill-mode-both motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]',
          props.css?.root
        )
      "
      data-slot="message-draft"
      :data-tool-ui-id="id"
      data-receipt="true"
      role="status"
      aria-label="Message sent"
    >
      <div class="flex items-center justify-end gap-2 text-sm">
        <span class="text-muted-foreground">
          Sent at {{ formatSentTime(sentAt ?? new Date()) }}
        </span>
        <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
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
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      </div>
    </div>

    <!-- Interactive states (review/sending) -->
    <article
      v-else
      v-bind="$attrs"
      :class="
        cn(
          'flex w-full max-w-lg min-w-64 flex-col gap-3',
          'text-foreground',
          'motion-safe:animate-in motion-safe:fade-in motion-safe:blur-in-sm motion-safe:zoom-in-95 motion-safe:fill-mode-both motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]',
          props.css?.root
        )
      "
      data-slot="message-draft"
      :data-tool-ui-id="id"
      :data-state="state"
      :aria-labelledby="`${id}-title`"
      tabindex="-1"
      @keydown="handleKeyDown"
    >
      <div
        class="flex w-full flex-col gap-3 rounded-2xl border border-border bg-card px-5 pt-3 pb-5 shadow-xs transition-none"
      >
        <!-- Email Draft Content -->
        <template v-if="isEmailDraft">
          <h2
            :id="`${id}-title`"
            class="pt-2 text-base leading-tight font-semibold"
          >
            {{ emailProps.subject }}
          </h2>

          <table class="w-full">
            <tbody>
              <tr v-if="emailProps.from" class="text-sm">
                <td
                  class="w-0 pr-4 pb-1 text-right align-top font-medium whitespace-nowrap text-muted-foreground"
                >
                  From
                </td>
                <td class="pb-1 align-top">{{ emailProps.from }}</td>
              </tr>
              <tr class="text-sm">
                <td
                  class="w-0 pr-4 pb-1 text-right align-top font-medium whitespace-nowrap text-muted-foreground"
                >
                  To
                </td>
                <td class="pb-1 align-top">
                  {{ (emailProps.to || []).slice(0, 3).join(", ") }}
                  <span
                    v-if="(emailProps.to || []).length > 3"
                    class="text-muted-foreground"
                  >
                    +{{ (emailProps.to || []).length - 3 }} more
                  </span>
                </td>
              </tr>
              <tr
                v-if="emailProps.cc && emailProps.cc.length > 0"
                class="text-sm"
              >
                <td
                  class="w-0 pr-4 pb-1 text-right align-top font-medium whitespace-nowrap text-muted-foreground"
                >
                  Cc
                </td>
                <td class="pb-1 align-top">
                  {{ emailProps.cc.slice(0, 3).join(", ") }}
                  <span
                    v-if="emailProps.cc.length > 3"
                    class="text-muted-foreground"
                  >
                    +{{ emailProps.cc.length - 3 }} more
                  </span>
                </td>
              </tr>
              <tr
                v-if="emailProps.bcc && emailProps.bcc.length > 0"
                class="text-sm"
              >
                <td
                  class="w-0 pr-4 pb-1 text-right align-top font-medium whitespace-nowrap text-muted-foreground"
                >
                  Bcc
                </td>
                <td
                  class="pb-1 align-top text-muted-foreground"
                >
                  {{ emailProps.bcc.slice(0, 3).join(", ") }}
                  <span
                    v-if="emailProps.bcc.length > 3"
                    class="text-muted-foreground"
                  >
                    +{{ emailProps.bcc.length - 3 }} more
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="-mx-5 h-px bg-border" role="separator" />

          <!-- Expandable Body -->
          <div class="relative">
            <div
              :class="
                cn(
                  'overflow-hidden text-sm leading-relaxed',
                  needsExpansion !== null &&
                    'transition-[max-height] duration-300 ease-in-out'
                )
              "
              :style="{
                maxHeight:
                  needsExpansion === null
                    ? `${COLLAPSED_BODY_HEIGHT}px`
                    : isExpanded || !needsExpansion
                      ? '1000px'
                      : `${COLLAPSED_BODY_HEIGHT}px`,
              }"
            >
              <p class="pt-1 whitespace-pre-wrap">{{ emailProps.body }}</p>
            </div>
            <div
              v-if="needsExpansion"
              :class="
                cn(
                  'pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-card to-transparent transition-[height] duration-300 ease-in-out',
                  isExpanded ? 'h-0' : 'h-12'
                )
              "
            />
          </div>
        </template>

        <!-- Slack Draft Content -->
        <template v-if="isSlackDraft">
          <div
            :id="`${id}-title`"
            class="flex items-center gap-1.5 text-sm font-medium"
          >
            <!-- Slack Logo -->
            <svg class="size-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#E01E5A"
                d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
              />
              <path
                fill="#36C5F0"
                d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
              />
              <path
                fill="#2EB67D"
                d="M18.958 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.52 2.521h-2.522V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.165 0a2.528 2.528 0 0 1 2.522 2.522v6.312z"
              />
              <path
                fill="#ECB22E"
                d="M15.165 18.958a2.528 2.528 0 0 1 2.522 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.521-2.52v-2.522h2.521zm0-1.271a2.527 2.527 0 0 1-2.521-2.521 2.526 2.526 0 0 1 2.521-2.521h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.521h-6.313z"
              />
            </svg>
            <span>
              {{ slackProps.target.type === "channel" ? "#" : "" }}{{ slackProps.target.name }}
            </span>
            <span
              v-if="slackProps.target.type === 'channel' && slackProps.target.memberCount !== undefined"
              class="ml-auto text-sm font-normal text-muted-foreground"
            >
              {{ slackProps.target.memberCount.toLocaleString() }} members
            </span>
          </div>

          <div class="-mx-5 h-px bg-border" role="separator" />

          <!-- Expandable Body -->
          <div class="relative">
            <div
              :class="
                cn(
                  'overflow-hidden text-sm leading-relaxed',
                  needsExpansion !== null &&
                    'transition-[max-height] duration-300 ease-in-out'
                )
              "
              :style="{
                maxHeight:
                  needsExpansion === null
                    ? `${COLLAPSED_BODY_HEIGHT}px`
                    : isExpanded || !needsExpansion
                      ? '1000px'
                      : `${COLLAPSED_BODY_HEIGHT}px`,
              }"
            >
              <p class="pt-1 whitespace-pre-wrap">{{ slackProps.body }}</p>
            </div>
            <div
              v-if="needsExpansion"
              :class="
                cn(
                  'pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-card to-transparent transition-[height] duration-300 ease-in-out',
                  isExpanded ? 'h-0' : 'h-12'
                )
              "
            />
          </div>
        </template>

        <!-- Expand Button -->
        <button
          v-if="showExpandButton"
          type="button"
          :class="
            cn(
              'inline-flex items-center justify-center rounded-md px-2 py-1 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
              'h-7 gap-1'
            )
          "
          @click="handleToggleExpand"
        >
          {{ isExpanded ? "Show less" : "Read more" }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            :class="cn('size-3', isExpanded && 'rotate-180')"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      <!-- Actions -->
      <div class="@container/actions">
        <!-- Sending State -->
        <div
          v-if="state === 'sending'"
          class="flex items-center justify-end gap-3"
          aria-live="polite"
        >
          <span class="text-sm text-muted-foreground">
            Sending in {{ countdown }}s
          </span>
          <button
            ref="undoButtonRef"
            type="button"
            :class="
              cn(
                'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors',
                'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                'disabled:pointer-events-none disabled:opacity-50',
                'h-9'
              )
            "
            @click="handleUndo"
          >
            Undo
          </button>
        </div>

        <!-- Review State -->
        <div
          v-else
          :class="
            cn(
              'flex w-full gap-2',
              'flex-col @[240px]:flex-row @[240px]:justify-end'
            )
          "
        >
          <button
            type="button"
            :class="
              cn(
                'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                'disabled:pointer-events-none disabled:opacity-50',
                'h-9 w-full @[240px]:w-auto'
              )
            "
            @click="handleCancel"
          >
            Cancel
          </button>
          <button
            type="button"
            :class="
              cn(
                'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
                'bg-primary text-primary-foreground hover:bg-primary/90',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                'disabled:pointer-events-none disabled:opacity-50',
                'h-9 w-full @[240px]:w-auto'
              )
            "
            @click="handleSend"
          >
            Send
          </button>
        </div>
      </div>
    </article>
  </template>
</template>
