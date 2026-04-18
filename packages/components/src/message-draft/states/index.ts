// MessageDraft component state layer - Headless architecture
// All business logic lives here, cmpts/message-draft.vue is UI-only

import { ref, computed, watch, onUnmounted, nextTick } from 'vue';
import { usePropsValidator } from '../../core';
import { SerializableMessageDraftSchema } from '../schema';
import type {
  RuntimeMessageDraftProps,
  SerializableEmailDraft,
  SerializableSlackDraft,
} from '../schema';
import type { ComputedRef, Ref } from 'vue';

export type DraftState = 'review' | 'sending' | 'sent' | 'cancelled';

export type MessageDraftEmit = {
  (e: 'send'): void;
  (e: 'undo'): void;
  (e: 'cancel'): void;
};

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

export function useMessageDraft(
  props: RuntimeMessageDraftProps & {
    undoGracePeriod?: number;
    onSend?: () => void | Promise<void>;
    onUndo?: () => void;
    onCancel?: () => void;
  },
  emit: MessageDraftEmit,
): MessageDraftState {
  usePropsValidator(SerializableMessageDraftSchema, props, 'MessageDraft');

  const undoGracePeriod = props.undoGracePeriod ?? DEFAULT_UNDO_GRACE_PERIOD;

  const state = ref<DraftState>(resolveStateFromOutcome(props.outcome));
  const countdown = ref(Math.ceil(undoGracePeriod / 1000));
  const sentAt = ref<Date | null>(props.outcome === 'sent' ? new Date() : null);
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

  watch(
    () => props.outcome,
    (newOutcome) => {
      const nextState = resolveStateFromOutcome(newOutcome);

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
          await props.onSend?.();
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
  const isEmailDraft = computed(() => props.channel === 'email');
  const isSlackDraft = computed(() => props.channel === 'slack');
  const emailProps = computed(() => props as unknown as SerializableEmailDraft);
  const slackProps = computed(() => props as unknown as SerializableSlackDraft);

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
