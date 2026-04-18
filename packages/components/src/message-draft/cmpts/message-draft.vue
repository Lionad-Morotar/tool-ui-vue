<script setup lang="ts">
import { cn } from '../../core';
import { useI18n } from '../../core/i18n';
import { reactive, toRef } from 'vue';
import { useMessageDraft } from '../states';
import DraftEditorArea from './draft-editor-area.vue';
import type { RuntimeMessageDraftProps } from '../schema';

defineOptions({ name: 'CmptMessageDraft', inheritAttrs: false })

const props = withDefaults(defineProps<RuntimeMessageDraftProps & {
  undoGracePeriod?: number;
  onSend?: () => void | Promise<void>;
  onUndo?: () => void;
  onCancel?: () => void;
}>(), {
  css: () => ({})
})

const emit = defineEmits<{
  send: [];
  undo: [];
  cancel: [];
}>()

const state = reactive(useMessageDraft(props, emit));
const { t } = useI18n()
const draftState = toRef(state, 'state');
const isExpanded = toRef(state, 'isExpanded');
const needsExpansion = toRef(state, 'needsExpansion');
const undoButtonRef = toRef(state, 'undoButtonRef');
</script>

<template>
  <!-- Cancelled state - render nothing -->
  <template v-if="draftState !== 'cancelled'">
    <!-- Sent receipt state -->
    <div
      v-if="draftState === 'sent'"
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
      :aria-label="t('messageDraft.messageSent').value"
    >
      <div class="flex items-center justify-end gap-2 text-sm">
        <span class="text-muted-foreground">
          {{ t('messageDraft.sentAt', { time: state.formatSentTime(state.sentAt ?? new Date()) }) }}
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
      :data-state="draftState"
      :aria-labelledby="`${id}-title`"
      tabindex="-1"
      @keydown="state.handleKeyDown"
    >
      <div
        class="flex w-full flex-col gap-3 rounded-2xl border border-border bg-card px-5 pt-3 pb-5 shadow-xs transition-none"
      >
        <DraftEditorArea
          :is-email-draft="state.isEmailDraft"
          :is-slack-draft="state.isSlackDraft"
          :email-props="state.emailProps"
          :slack-props="state.slackProps"
          :is-expanded="isExpanded"
          :needs-expansion="needsExpansion"
          :collapsed-body-height="state.collapsedBodyHeight"
          :css="{ header: props.css?.header, body: props.css?.body }"
        />

        <!-- Expand Button -->
        <button
          v-if="state.showExpandButton"
          type="button"
          :class="
            cn(
              'inline-flex items-center justify-center rounded-md px-2 py-1 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
              'h-7 gap-1'
            )
          "
          @click="state.handleToggleExpand"
        >
          {{ isExpanded ? t('messageDraft.showLess') : t('messageDraft.readMore') }}
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
      <div class="@container/actions" :class="css?.actions" data-slot="actions">
        <!-- Sending State -->
        <div
          v-if="draftState === 'sending'"
          class="flex items-center justify-end gap-3"
          aria-live="polite"
        >
          <span class="text-sm text-muted-foreground">
            {{ t('messageDraft.sendingIn', { count: state.countdown }) }}
          </span>
          <button
            :ref="(el) => { undoButtonRef = el as HTMLButtonElement | null }"
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
            @click="state.handleUndo"
          >
            {{ t('messageDraft.undo') }}
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
            @click="state.handleCancel"
          >
            {{ t('messageDraft.cancel') }}
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
            @click="state.handleSend"
          >
            {{ t('messageDraft.send') }}
          </button>
        </div>
      </div>
    </article>
  </template>
</template>
