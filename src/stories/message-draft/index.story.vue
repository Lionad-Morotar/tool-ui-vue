<script setup lang="ts">
import { ref } from 'vue';
import { MessageDraft } from '@lionad/vtu-components';
import { useStoryLocale } from '../_shared/use-story-locale'
import messages from './i18n';

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const MessageDraftProps = useStoryLocale('content.messageDraftProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = MessageDraftProps

// Props documentation
const props = [
  { name: 'id', type: 'string', required: true, description: { zh: '组件唯一标识符', en: 'Unique identifier for the component' } },
  { name: 'channel', type: "'email' | 'slack'", required: true, description: { zh: '消息渠道类型', en: 'Message channel type' } },
  { name: 'body', type: 'string', required: true, description: { zh: '消息正文内容', en: 'Message body content' } },
  { name: 'outcome', type: "'sent' | 'cancelled'", description: { zh: '最终结果状态', en: 'Final outcome state' } },
  { name: 'subject', type: 'string', description: { zh: '邮件主题（email 渠道必填）', en: 'Email subject line (required for email channel)' } },
  { name: 'from', type: 'string', description: { zh: '发件人邮箱地址', en: 'Sender email address' } },
  { name: 'to', type: 'string[]', description: { zh: '收件人邮箱地址数组（email 渠道必填）', en: 'Recipient email addresses (required for email channel)' } },
  { name: 'cc', type: 'string[]', description: { zh: '抄送收件人', en: 'CC recipients' } },
  { name: 'bcc', type: 'string[]', description: { zh: '密送收件人', en: 'BCC recipients' } },
  { name: 'target', type: 'SlackTarget', description: { zh: 'Slack 目标频道或私聊（slack 渠道必填）', en: 'Slack target channel or DM (required for slack channel)' } },
  { name: 'undoGracePeriod', type: 'number', default: '5000', description: { zh: '发送最终确认前的宽限时间（毫秒）', en: 'Grace period before send is final (ms)' } },
  { name: 'css', type: '{ root?: string; header?: string; body?: string; actions?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
];

const lblReset = useStoryLocale('content.lblReset', messages)
const textCancelledRenders = useStoryLocale('content.textCancelledRenders', messages)
const subjQ4Planning = useStoryLocale('content.subjQ4Planning', messages)
const bodyQ4Planning = useStoryLocale('content.bodyQ4Planning', messages)
const subjProjectUpdate = useStoryLocale('content.subjProjectUpdate', messages)
const bodyProjectUpdate = useStoryLocale('content.bodyProjectUpdate', messages)
const subjQuarterlyReview = useStoryLocale('content.subjQuarterlyReview', messages)
const bodyQuarterlyReview = useStoryLocale('content.bodyQuarterlyReview', messages)
const bodySlackStandup = useStoryLocale('content.bodySlackStandup', messages)
const bodySlackDM = useStoryLocale('content.bodySlackDM', messages)
const subjMeetingConfirm = useStoryLocale('content.subjMeetingConfirm', messages)
const bodyMeetingConfirm = useStoryLocale('content.bodyMeetingConfirm', messages)
const subjDraftMessage = useStoryLocale('content.subjDraftMessage', messages)
const bodyDraftNotSent = useStoryLocale('content.bodyDraftNotSent', messages)
const emailDraft = useStoryLocale('content.emailDraft', messages)
const emailWithCCBCC = useStoryLocale('content.emailWithCCBCC', messages)
const emailWithLongBody = useStoryLocale('content.emailWithLongBody', messages)
const slackChannel = useStoryLocale('content.slackChannel', messages)
const slackDM = useStoryLocale('content.slackDM', messages)
const sentReceipt = useStoryLocale('content.sentReceipt', messages)
const cancelled = useStoryLocale('content.cancelled', messages)

const emailState = ref({
  outcome: undefined as 'sent' | 'cancelled' | undefined,
});

const slackState = ref({
  outcome: undefined as 'sent' | 'cancelled' | undefined,
});

function handleEmailSend() {
  emailState.value.outcome = 'sent';
}

function handleEmailCancel() {
  emailState.value.outcome = 'cancelled';
}

function handleSlackSend() {
  slackState.value.outcome = 'sent';
}

function handleSlackCancel() {
  slackState.value.outcome = 'cancelled';
}

function resetEmail() {
  emailState.value.outcome = undefined;
}

function resetSlack() {
  slackState.value.outcome = undefined;
}

/**
 * ## Props
 *
 * ### Common Props
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | id | string | required | Unique identifier for the component |
 * | body | string | required | Message body content |
 * | outcome | 'sent' \| 'cancelled' | undefined | Final outcome state |
 * | channel | 'email' \| 'slack' | required | Message channel type |
 * | css | { root?: string } | undefined | CSS classes for component elements |
 * | undoGracePeriod | number | 5000 | Milliseconds before send is final |
 * | onSend | () => void \| Promise<void> | undefined | Callback when message is sent |
 * | onUndo | () => void | undefined | Callback when send is undone |
 * | onCancel | () => void | undefined | Callback when draft is cancelled |
 *
 * ### Email Channel Props
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | subject | string | required | Email subject line |
 * | from | string | undefined | Sender email address |
 * | to | string[] | required | Recipient email addresses |
 * | cc | string[] | undefined | CC recipients |
 * | bcc | string[] | undefined | BCC recipients |
 *
 * ### Slack Channel Props
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | target | SlackTarget | required | Target channel or DM |
 *
 * ### SlackTarget
 * | Type | Properties |
 * |------|------------|
 * | channel | { type: 'channel', name: string, memberCount?: number } |
 * | dm | { type: 'dm', name: string } |
 *
 * ## Emits
 *
 * | Event | Payload | Description |
 * |-------|---------|-------------|
 * | send | - | Emitted when message is sent (after grace period) |
 * | undo | - | Emitted when user clicks undo |
 * | cancel | - | Emitted when user cancels the draft |
 *
 * ## Slots
 *
 * This component does not use slots. All content is passed via props.
 *
 * ## Accessibility
 *
 * - Has `aria-labelledby` pointing to title
 * - Has `data-state` attribute for state tracking
 * - Receipt state has `role="status"`
 * - Supports Escape key to cancel in review state
 *
 * ## States
 *
 * ### Review
 * - Shows draft content
 * - Send and Cancel buttons available
 * - Expandable body for long content
 *
 * ### Sending
 * - Shows countdown timer
 * - Undo button available
 * - Auto-transitions to sent after grace period
 *
 * ### Sent
 * - Shows receipt with timestamp
 * - No further actions available
 *
 * ### Cancelled
 * - Renders nothing
 */

</script>

<template>
  <Story title="MessageDraft/All Variants">
    <Variant :title="emailDraft">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <button
          v-if="emailState.outcome"
          class="mb-4 rounded-md bg-muted px-3 py-1 text-sm hover:bg-muted/80"
          @click="resetEmail"
        >
          {{ lblReset }}
        </button>
        <message-draft
          id="message-draft-email"
          channel="email"
          :subject="subjQ4Planning"
          :to="['team@example.com']"
          :body="bodyQ4Planning"
          :outcome="emailState.outcome"
          @send="handleEmailSend"
          @cancel="handleEmailCancel"
        />
      </div>
    </Variant>

    <Variant :title="emailWithCCBCC">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <message-draft
          id="message-draft-cc"
          channel="email"
          :subject="subjProjectUpdate"
          from="manager@example.com"
          :to="['team@example.com', 'lead@example.com']"
          :cc="['stakeholder@example.com', 'pm@example.com']"
          :bcc="['archive@example.com']"
          :body="bodyProjectUpdate"
        />
      </div>
    </Variant>

    <Variant :title="emailWithLongBody">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <message-draft
          id="message-draft-long"
          channel="email"
          :subject="subjQuarterlyReview"
          from="ceo@example.com"
          :to="['exec-team@example.com']"
          :cc="['board@example.com']"
          :body="bodyQuarterlyReview"
        />
      </div>
    </Variant>

    <Variant :title="slackChannel">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-xl">
        <button
          v-if="slackState.outcome"
          class="mb-4 rounded-md bg-muted px-3 py-1 text-sm hover:bg-muted/80"
          @click="resetSlack"
        >
          {{ lblReset }}
        </button>
        <message-draft
          id="message-draft-slack-channel"
          channel="slack"
          :target="{ type: 'channel', name: 'general', memberCount: 45 }"
          :body="bodySlackStandup"
          :outcome="slackState.outcome"
          @send="handleSlackSend"
          @cancel="handleSlackCancel"
        />
      </div>
    </Variant>

    <Variant :title="slackDM">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-xl">
        <message-draft
          id="message-draft-slack-dm"
          channel="slack"
          :target="{ type: 'dm', name: 'john.doe' }"
          :body="bodySlackDM"
        />
      </div>
    </Variant>

    <Variant :title="sentReceipt">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <message-draft
          id="message-draft-sent"
          channel="email"
          :subject="subjMeetingConfirm"
          :to="['client@example.com']"
          :body="bodyMeetingConfirm"
          outcome="sent"
        />
      </div>
    </Variant>

    <Variant :title="cancelled">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <p class="mb-2 text-sm text-muted-foreground">
          {{ textCancelledRenders }}
        </p>
        <message-draft
          id="message-draft-cancelled"
          channel="email"
          :subject="subjDraftMessage"
          :to="['recipient@example.com']"
          :body="bodyDraftNotSent"
          outcome="cancelled"
        />
      </div>
    </Variant>
    <Variant :title="propsTitle">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ componentPropsTitle }}</h2>
        <div class="overflow-x-auto">
          <table class="story-table">
            <thead>
              <tr>
                <th>{{ headerName }}</th>
                <th>{{ headerType }}</th>
                <th>{{ headerDefault }}</th>
                <th>{{ headerDesc }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in props" :key="prop.name">
                <td class="font-mono text-emerald-600">{{ prop.name }}</td>
                <td class="font-mono text-blue-600">{{ prop.type }}</td>
                <td class="text-muted-foreground">{{ prop.default || '-' }}</td>
                <td>{{ useStoryLocale(prop.description) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Variant>
  </Story>
</template>
