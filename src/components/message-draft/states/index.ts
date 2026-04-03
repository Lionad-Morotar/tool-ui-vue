// MessageDraft component state layer - Headless architecture
// All business logic lives here, cmpts/message-draft.vue is UI-only

import { ref, computed, watch, onUnmounted, nextTick } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import type {
  RuntimeMessageDraftProps,
  SerializableEmailDraft,
  SerializableSlackDraft,
} from '../schema';

export type DraftState = 'review' | 'sending' | 'sent' | 'cancelled';

export interface UseMessageDraftOptions extends RuntimeMessageDraftProps {
  undoGracePeriod?: number;
  onSend?: () => void | Promise<void>;
  onUndo?: () => void;
  onCancel?: () => void;
  emit: {
    (e: 'send'): void;
    (e: 'undo'): void;
    (e: 'cancel'): void;
  };
}

export interface MessageDraftState {
  state: Ref<DraftState>;
  countdown: Ref<number>;
  sentAt: Ref<Date | null>;
  isExpanded: Ref<boolean>;
  needsExpansion: Ref<boolean>;
  undoButtonRef: Ref<HTMLButtonElement | null>;
  showExpandButton: ComputedRef<boolean>;
  isEmailDraft: ComputedRef<boolean>;
  isSlackDraft: ComputedRef<boolean>;
  emailProps: ComputedRef<SerializableEmailDraft>;
  slackProps: ComputedRef<SerializableSlackDraft>;
  collapsedBodyHeight: number;
  formatSentTime: (date: Date) => string;
  handleSend: () => void;
  handleUndo: () => void;
  handleCancel: () => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleToggleExpand: () => void;
}

const COLLAPSED_BODY_HEIGHT = 280;
const DEFAULT_UNDO_GRACE_PERIOD = 5000;

function resolveStateFromOutcome(outcome: string | undefined): DraftState {
  if (outcome === 'sent') return 'sent';
  if (outcome === 'cancelled') return 'cancelled';
  return 'review';
}

export function useMessageDraft(options: UseMessageDraftOptions): MessageDraftState {
  const { emit, onSend, onUndo, onCancel } = options;
  const undoGracePeriod = options.undoGracePeriod ?? DEFAULT_UNDO_GRACE_PERIOD;

  const state = ref<DraftState>(resolveStateFromOutcome(options.outcome));
  const countdown = ref(Math.ceil(undoGracePeriod / 1000));
  const sentAt = ref<Date | null>(options.outcome === 'sent' ? new Date() : null);
  const isExpanded = ref(false);
  const needsExpansion = ref(false);
  const undoButtonRef = ref<HTMLButtonElement | null>(null);

  let timer: ReturnType<typeof setTimeout> | null = null;
  let countdownInterval: ReturnType<typeof setInterval> | null = null;

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
    onUndo?.();
    emit('undo');
  }

  function handleCancel() {
    clearTimers();
    state.value = 'cancelled';
    onCancel?.();
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
  let previousOutcome = options.outcome;
  watch(
    () => options.outcome,
    (newOutcome) => {
      if (previousOutcome === newOutcome) return;
      const nextState = resolveStateFromOutcome(newOutcome);
      previousOutcome = newOutcome;

      clearTimers();
      state.value = nextState;
      countdown.value = Math.ceil(undoGracePeriod / 1000);
      sentAt.value = nextState === 'sent' ? new Date() : null;
    }
  );

  // Watch for state changes to handle sending timer
  watch(
    () => state.value,
    async (newState) => {
      if (newState === 'sending') {
        await nextTick();
        undoButtonRef.value?.focus();

        countdown.value = Math.ceil(undoGracePeriod / 1000);

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
          await onSend?.();
          emit('send');
          sentAt.value = new Date();
          state.value = 'sent';
        }, undoGracePeriod);
      }
    }
  );

  onUnmounted(() => {
    clearTimers();
  });

  const showExpandButton = computed(() => needsExpansion.value);
  const isEmailDraft = computed(() => options.channel === 'email');
  const isSlackDraft = computed(() => options.channel === 'slack');
  const emailProps = computed(() => options as unknown as SerializableEmailDraft);
  const slackProps = computed(() => options as unknown as SerializableSlackDraft);

  return {
    state,
    countdown,
    sentAt,
    isExpanded,
    needsExpansion,
    undoButtonRef,
    showExpandButton,
    isEmailDraft,
    isSlackDraft,
    emailProps,
    slackProps,
    collapsedBodyHeight: COLLAPSED_BODY_HEIGHT,
    formatSentTime,
    handleSend,
    handleUndo,
    handleCancel,
    handleKeyDown,
    handleToggleExpand,
  };
}
