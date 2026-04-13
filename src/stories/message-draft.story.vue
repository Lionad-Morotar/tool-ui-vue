<script setup lang="ts">
import { ref } from 'vue';
import { MessageDraft } from '@lionad/vtu-components';
import { useStoryLocale } from './_shared/use-story-locale';

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

const lblReset = useStoryLocale({ zh: '重置', en: 'Reset' })
const textCancelledRenders = useStoryLocale({ zh: '已取消状态不渲染任何内容（按设计）', en: 'Cancelled state renders nothing (as per design)' })

const subjQ4Planning = useStoryLocale({ zh: 'Q4 规划会议', en: 'Q4 Planning Meeting' })
const bodyQ4Planning = useStoryLocale({ zh: '团队大家好，\n\n我们计划下周召开 Q4 规划会议。请回复告知您的时间安排。\n\n谢谢！', en: 'Hi team,\n\nLet\'s schedule our Q4 planning meeting for next week. Please reply with your availability.\n\nThanks!' })

const subjProjectUpdate = useStoryLocale({ zh: '项目更新', en: 'Project Update' })
const bodyProjectUpdate = useStoryLocale({ zh: '大家好，\n\n请查阅最新项目更新。我们在关键里程碑上取得了重大进展。\n\n此致', en: 'Hi everyone,\n\nPlease find the latest project update attached. We\'ve made significant progress on the key milestones.\n\nBest regards' })

const subjQuarterlyReview = useStoryLocale({ zh: '季度回顾 - 详细分析', en: 'Quarterly Review - Detailed Analysis' })
const bodyQuarterlyReview = useStoryLocale({ zh: '尊敬的高管团队，\n\n希望此消息传达时大家一切安好。随着第四季度的结束，我想借此机会回顾本季度的成就，并讨论新一年的战略。\n\n本季度我们取得了令人瞩目的成绩：\n\n1. 收入增长：我们超额完成目标 15%，主要来自企业板块。\n\n2. 产品创新：新平台的发布获得了早期用户的高度好评。\n\n3. 团队扩展：我们成功在工程、销售和客户成功部门入职了 25 名新团队成员。\n\n4. 市场拓展：我们进入欧洲市场已显示出良好的初步成效。\n\n展望第一季度，我们有几个关键举措：\n\n- 向亚太地区的国际扩张\n- 基于用户反馈的主要平台更新\n- 与关键行业参与者的战略合作伙伴关系\n- 持续投资于团队和文化\n\n我为我们共同取得的成就感到无比自豪，也对未来充满期待。\n\n请审阅随附的详细报告，并准备在下周的全员会议中进行讨论。\n\n此致，\n首席执行官', en: 'Dear Executive Team,\n\nI hope this message finds you well. As we approach the end of Q4, I wanted to take a moment to reflect on our achievements this quarter and discuss our strategy moving into the new year.\n\nThis quarter has been remarkable for several reasons:\n\n1. Revenue Growth: We\'ve exceeded our targets by 15%, driven primarily by our enterprise segment.\n\n2. Product Innovation: The launch of our new platform has received overwhelmingly positive feedback from early adopters.\n\n3. Team Expansion: We\'ve successfully onboarded 25 new team members across engineering, sales, and customer success.\n\n4. Market Expansion: Our entry into the European market has shown promising initial traction.\n\nLooking ahead to Q1, we have several key initiatives:\n\n- International expansion into APAC\n- Major platform updates based on user feedback\n- Strategic partnerships with key industry players\n- Continued investment in our team and culture\n\nI\'m incredibly proud of what we\'ve accomplished together and excited about what lies ahead.\n\nPlease review the attached detailed report and come prepared to discuss during our all-hands meeting next week.\n\nBest regards,\nThe CEO' })

const bodySlackStandup = useStoryLocale({ zh: '团队大家好！别忘了明天上午10点的站会。我们将讨论新版本发布时间表。', en: 'Hey team! Don\'t forget about the standup at 10am tomorrow. We\'ll be discussing the new release timeline.' })

const bodySlackDM = useStoryLocale({ zh: '你好 John，我们今天晚些时候能就设计评审同步一下吗？我有一些反馈想讨论。', en: 'Hi John, can we sync up later today about the design review? I have some feedback I\'d like to discuss.' })

const subjMeetingConfirm = useStoryLocale({ zh: '会议确认', en: 'Meeting Confirmation' })
const bodyMeetingConfirm = useStoryLocale({ zh: '尊敬的客户，\n\n此消息确认我们明天下午2点的会议安排。\n\n此致', en: 'Dear Client,\n\nThis confirms our meeting scheduled for tomorrow at 2pm.\n\nBest regards' })

const subjDraftMessage = useStoryLocale({ zh: '草稿消息', en: 'Draft Message' })
const bodyDraftNotSent = useStoryLocale({ zh: '这是一条未发送的草稿。', en: 'This is a draft that was not sent.' })

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
const emailDraft = useStoryLocale({ zh: '邮件草稿', en: 'Email Draft' })
const emailWithCCBCC = useStoryLocale({ zh: '含抄送/密送邮件', en: 'Email with CC/BCC' })
const emailWithLongBody = useStoryLocale({ zh: '含长正文邮件', en: 'Email with Long Body' })
const slackChannel = useStoryLocale({ zh: 'Slack 频道', en: 'Slack Channel' })
const slackDM = useStoryLocale({ zh: 'Slack 私聊', en: 'Slack DM' })
const sentReceipt = useStoryLocale({ zh: '已发送回执', en: 'Sent Receipt' })
const cancelled = useStoryLocale({ zh: '已取消', en: 'Cancelled' })
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
  </Story>
</template>
