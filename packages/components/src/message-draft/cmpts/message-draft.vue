<script setup lang="ts">
import { cn } from '@lionad/vtu-core';
import { useI18n } from '@lionad/vtu-core/i18n';
import { reactive, toRef } from 'vue';
import { useMessageDraft } from '../states';
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
}>();

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
        <!-- Email Draft Content -->
        <template v-if="state.isEmailDraft">
          <div :class="css?.header" data-slot="header">
          <h2
            :id="`${id}-title`"
            class="pt-2 text-base leading-tight font-semibold"
          >
            {{ state.emailProps.subject }}
          </h2>

          <table class="w-full">
            <tbody>
              <tr v-if="state.emailProps.from" class="text-sm">
                <td
                  class="w-0 pr-4 pb-1 text-right align-top font-medium whitespace-nowrap text-muted-foreground"
                >
                  {{ t('messageDraft.fromLabel') }}
                </td>
                <td class="pb-1 align-top">{{ state.emailProps.from }}</td>
              </tr>
              <tr class="text-sm">
                <td
                  class="w-0 pr-4 pb-1 text-right align-top font-medium whitespace-nowrap text-muted-foreground"
                >
                  {{ t('messageDraft.toLabel') }}
                </td>
                <td class="pb-1 align-top">
                  {{ (state.emailProps.to || []).slice(0, 3).join(", ") }}
                  <span
                    v-if="(state.emailProps.to || []).length > 3"
                    class="text-muted-foreground"
                  >
                    {{ t('messageDraft.moreRecipients', { count: (state.emailProps.to || []).length - 3 }) }}
                  </span>
                </td>
              </tr>
              <tr
                v-if="state.emailProps.cc && state.emailProps.cc.length > 0"
                class="text-sm"
              >
                <td
                  class="w-0 pr-4 pb-1 text-right align-top font-medium whitespace-nowrap text-muted-foreground"
                >
                  {{ t('messageDraft.ccLabel') }}
                </td>
                <td class="pb-1 align-top">
                  {{ state.emailProps.cc.slice(0, 3).join(", ") }}
                  <span
                    v-if="state.emailProps.cc.length > 3"
                    class="text-muted-foreground"
                  >
                    {{ t('messageDraft.moreRecipients', { count: state.emailProps.cc.length - 3 }) }}
                  </span>
                </td>
              </tr>
              <tr
                v-if="state.emailProps.bcc && state.emailProps.bcc.length > 0"
                class="text-sm"
              >
                <td
                  class="w-0 pr-4 pb-1 text-right align-top font-medium whitespace-nowrap text-muted-foreground"
                >
                  {{ t('messageDraft.bccLabel') }}
                </td>
                <td
                  class="pb-1 align-top text-muted-foreground"
                >
                  {{ state.emailProps.bcc.slice(0, 3).join(", ") }}
                  <span
                    v-if="state.emailProps.bcc.length > 3"
                    class="text-muted-foreground"
                  >
                    {{ t('messageDraft.moreRecipients', { count: state.emailProps.bcc.length - 3 }) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          </div>

          <div class="-mx-5 h-px bg-border" role="separator" />

          <!-- Expandable Body -->
          <div class="relative" :class="css?.body" data-slot="body">
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
                    ? `${state.collapsedBodyHeight}px`
                    : isExpanded || !needsExpansion
                      ? '1000px'
                      : `${state.collapsedBodyHeight}px`,
              }"
            >
              <p class="pt-1 whitespace-pre-wrap">{{ state.emailProps.body }}</p>
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
        <template v-if="state.isSlackDraft">
          <div
            :id="`${id}-title`"
            class="flex items-center gap-1.5 text-sm font-medium"
            :class="css?.header"
            data-slot="header"
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
              {{ state.slackProps.target.type === "channel" ? "#" : "" }}{{ state.slackProps.target.name }}
            </span>
            <span
              v-if="state.slackProps.target.type === 'channel' && state.slackProps.target.memberCount !== undefined"
              class="ml-auto text-sm font-normal text-muted-foreground"
            >
              {{ t('messageDraft.members', { count: state.slackProps.target.memberCount.toLocaleString() }) }}
            </span>
          </div>

          <div class="-mx-5 h-px bg-border" role="separator" />

          <!-- Expandable Body -->
          <div class="relative" :class="css?.body" data-slot="body">
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
                    ? `${state.collapsedBodyHeight}px`
                    : isExpanded || !needsExpansion
                      ? '1000px'
                      : `${state.collapsedBodyHeight}px`,
              }"
            >
              <p class="pt-1 whitespace-pre-wrap">{{ state.slackProps.body }}</p>
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
