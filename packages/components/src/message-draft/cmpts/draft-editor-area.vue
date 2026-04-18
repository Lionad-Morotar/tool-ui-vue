<script setup lang="ts">
defineOptions({ name: 'CmptDraftEditorArea', inheritAttrs: false })

import { cn } from '../../core';
import { useI18n } from '../../core/i18n';
import { computed } from 'vue';
import type { SerializableEmailDraft, SerializableSlackDraft } from '../schema';

interface DraftEditorAreaProps {
  isEmailDraft: boolean;
  isSlackDraft: boolean;
  emailProps: SerializableEmailDraft;
  slackProps: SerializableSlackDraft;
  isExpanded: boolean;
  needsExpansion: boolean | null;
  collapsedBodyHeight: number;
  css?: {
    header?: string;
    body?: string;
  };
}

const props = defineProps<DraftEditorAreaProps>();

const { t } = useI18n();

const expandStyle = computed(() => ({
  maxHeight:
    props.needsExpansion === null
      ? `${props.collapsedBodyHeight}px`
      : props.isExpanded || !props.needsExpansion
        ? '1000px'
        : `${props.collapsedBodyHeight}px`,
}));

const gradientClass = computed(() =>
  cn(
    'pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-card to-transparent transition-[height] duration-300 ease-in-out',
    props.isExpanded ? 'h-0' : 'h-12'
  )
);
</script>

<template>
  <!-- Email Draft Content -->
  <template v-if="isEmailDraft">
    <div :class="css?.header" data-slot="header">
      <h2
        :id="`${emailProps.id}-title`"
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
              {{ t('messageDraft.fromLabel') }}
            </td>
            <td class="pb-1 align-top">{{ emailProps.from }}</td>
          </tr>
          <tr class="text-sm">
            <td
              class="w-0 pr-4 pb-1 text-right align-top font-medium whitespace-nowrap text-muted-foreground"
            >
              {{ t('messageDraft.toLabel') }}
            </td>
            <td class="pb-1 align-top">
              {{ (emailProps.to || []).slice(0, 3).join(", ") }}
              <span
                v-if="(emailProps.to || []).length > 3"
                class="text-muted-foreground"
              >
                {{ t('messageDraft.moreRecipients', { count: (emailProps.to || []).length - 3 }) }}
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
              {{ t('messageDraft.ccLabel') }}
            </td>
            <td class="pb-1 align-top">
              {{ emailProps.cc.slice(0, 3).join(", ") }}
              <span
                v-if="emailProps.cc.length > 3"
                class="text-muted-foreground"
              >
                {{ t('messageDraft.moreRecipients', { count: emailProps.cc.length - 3 }) }}
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
              {{ t('messageDraft.bccLabel') }}
            </td>
            <td
              class="pb-1 align-top text-muted-foreground"
            >
              {{ emailProps.bcc.slice(0, 3).join(", ") }}
              <span
                v-if="emailProps.bcc.length > 3"
                class="text-muted-foreground"
              >
                {{ t('messageDraft.moreRecipients', { count: emailProps.bcc.length - 3 }) }}
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
        :style="expandStyle"
      >
        <p class="pt-1 whitespace-pre-wrap">{{ emailProps.body }}</p>
      </div>
      <div
        v-if="needsExpansion"
        :class="gradientClass"
      />
    </div>
  </template>

  <!-- Slack Draft Content -->
  <template v-if="isSlackDraft">
    <div
      :id="`${slackProps.id}-title`"
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
        {{ slackProps.target.type === "channel" ? "#" : "" }}{{ slackProps.target.name }}
      </span>
      <span
        v-if="slackProps.target.type === 'channel' && slackProps.target.memberCount !== undefined"
        class="ml-auto text-sm font-normal text-muted-foreground"
      >
        {{ t('messageDraft.members', { count: slackProps.target.memberCount.toLocaleString() }) }}
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
        :style="expandStyle"
      >
        <p class="pt-1 whitespace-pre-wrap">{{ slackProps.body }}</p>
      </div>
      <div
        v-if="needsExpansion"
        :class="gradientClass"
      />
    </div>
  </template>
</template>
