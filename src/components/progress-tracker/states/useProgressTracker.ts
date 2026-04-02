import { computed, unref } from 'vue';
import type { ComputedRef, MaybeRef } from 'vue';
import type { ProgressTrackerProps, ProgressStep } from '../schema';

export interface UseProgressTrackerOptions {
  steps: MaybeRef<ProgressStep[]>;
  choice?: MaybeRef<ProgressTrackerProps['choice']>;
  elapsedTime?: MaybeRef<number | undefined>;
}

export interface ReceiptState {
  toneClass: string;
  icon: 'check' | 'alert' | 'x';
}

export interface ProgressSummary {
  total: number;
  completed: number;
  failed: number;
  inProgress: number;
  percent: number;
  isComplete: boolean;
  hasFailed: boolean;
}

export interface ProgressTrackerReturns {
  // State (computed values)
  progress: ComputedRef<ProgressSummary>;
  currentStepId: ComputedRef<string | null>;
  receiptState: ComputedRef<ReceiptState | null>;

  // Actions
  formatElapsedTime: (milliseconds: number) => string;
  formatElapsedTimeDateTime: (milliseconds: number) => string;
}

function getCurrentStepId(steps: ProgressStep[]): string | null {
  const inProgressStep = steps.find((s) => s.status === 'in-progress');
  if (inProgressStep) return inProgressStep.id;

  const failedStep = steps.find((s) => s.status === 'failed');
  if (failedStep) return failedStep.id;

  const firstPendingStep = steps.find((s) => s.status === 'pending');
  if (firstPendingStep) return firstPendingStep.id;

  return null;
}

export function useProgressTracker(options: UseProgressTrackerOptions): ProgressTrackerReturns {
  const { steps, choice } = options;

  const progress = computed(() => {
    const stepsValue = unref(steps);
    const total = stepsValue.length;
    const completed = stepsValue.filter((s) => s.status === 'completed').length;
    const failed = stepsValue.filter((s) => s.status === 'failed').length;
    const inProgress = stepsValue.filter((s) => s.status === 'in-progress').length;

    return {
      total,
      completed,
      failed,
      inProgress,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      isComplete: completed === total && total > 0,
      hasFailed: failed > 0,
    };
  });

  const currentStepId = computed(() => getCurrentStepId(unref(steps)));

  // Receipt state helpers
  const receiptState = computed(() => {
    const choiceValue = unref(choice);
    if (!choiceValue) return null;

    switch (choiceValue.outcome) {
      case 'success':
        return {
          toneClass: 'text-emerald-600 dark:text-emerald-500',
          icon: 'check' as const,
        };
      case 'partial':
        return {
          toneClass: 'text-amber-600 dark:text-amber-500',
          icon: 'alert' as const,
        };
      case 'failed':
        return {
          toneClass: 'text-destructive',
          icon: 'alert' as const,
        };
      case 'cancelled':
        return {
          toneClass: 'text-muted-foreground',
          icon: 'x' as const,
        };
      default:
        return null;
    }
  });

  // Format elapsed time (milliseconds to readable string)
  function formatElapsedTime(milliseconds: number): string {
    const roundedSeconds = Math.round(Math.max(0, milliseconds) / 100) / 10;

    if (roundedSeconds < 60) {
      return `${roundedSeconds.toFixed(1)}s`;
    }

    const wholeSeconds = Math.floor(roundedSeconds);
    const minutes = Math.floor(wholeSeconds / 60);
    const remainingSeconds = wholeSeconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  function formatElapsedTimeDateTime(milliseconds: number): string {
    const roundedSeconds = Math.round(Math.max(0, milliseconds) / 100) / 10;

    if (roundedSeconds < 60) {
      return `PT${Number(roundedSeconds.toFixed(1))}S`;
    }

    const wholeSeconds = Math.floor(roundedSeconds);
    const hours = Math.floor(wholeSeconds / 3600);
    const minutes = Math.floor((wholeSeconds % 3600) / 60);
    const seconds = wholeSeconds % 60;

    const hourPart = hours > 0 ? `${hours}H` : '';
    const minutePart = minutes > 0 ? `${minutes}M` : '';
    const secondPart = seconds > 0 ? `${seconds}S` : '';

    if (!hourPart && !minutePart && !secondPart) {
      return 'PT0S';
    }

    return `PT${hourPart}${minutePart}${secondPart}`;
  }

  return {
    progress,
    currentStepId,
    receiptState,
    formatElapsedTime,
    formatElapsedTimeDateTime,
  };
}
