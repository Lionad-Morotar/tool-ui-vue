<script setup lang="ts">
import { ref } from 'vue';
import { MessageDraft } from '@lionad/vtu-components';

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
    <Variant title="Email Draft">
      <div class="w-full max-w-2xl">
        <button
          v-if="emailState.outcome"
          class="mb-4 rounded-md bg-muted px-3 py-1 text-sm hover:bg-muted/80"
          @click="resetEmail"
        >
          Reset
        </button>
        <message-draft
          id="message-draft-email"
          channel="email"
          subject="Q4 Planning Meeting"
          :to="['team@example.com']"
          body="Hi team,

Let's schedule our Q4 planning meeting for next week. Please reply with your availability.

Thanks!"
          :outcome="emailState.outcome"
          @send="handleEmailSend"
          @cancel="handleEmailCancel"
        />
      </div>
    </Variant>

    <Variant title="Email with CC/BCC">
      <div class="w-full max-w-2xl">
        <message-draft
          id="message-draft-cc"
          channel="email"
          subject="Project Update"
          from="manager@example.com"
          :to="['team@example.com', 'lead@example.com']"
          :cc="['stakeholder@example.com', 'pm@example.com']"
          :bcc="['archive@example.com']"
          body="Hi everyone,

Please find the latest project update attached. We've made significant progress on the key milestones.

Best regards"
        />
      </div>
    </Variant>

    <Variant title="Email with Long Body">
      <div class="w-full max-w-2xl">
        <message-draft
          id="message-draft-long"
          channel="email"
          subject="Quarterly Review - Detailed Analysis"
          from="ceo@example.com"
          :to="['exec-team@example.com']"
          :cc="['board@example.com']"
          body="Dear Executive Team,

I hope this message finds you well. As we approach the end of Q4, I wanted to take a moment to reflect on our achievements this quarter and discuss our strategy moving into the new year.

This quarter has been remarkable for several reasons:

1. Revenue Growth: We've exceeded our targets by 15%, driven primarily by our enterprise segment.

2. Product Innovation: The launch of our new platform has received overwhelmingly positive feedback from early adopters.

3. Team Expansion: We've successfully onboarded 25 new team members across engineering, sales, and customer success.

4. Market Expansion: Our entry into the European market has shown promising initial traction.

Looking ahead to Q1, we have several key initiatives:

- International expansion into APAC
- Major platform updates based on user feedback
- Strategic partnerships with key industry players
- Continued investment in our team and culture

I'm incredibly proud of what we've accomplished together and excited about what lies ahead.

Please review the attached detailed report and come prepared to discuss during our all-hands meeting next week.

Best regards,
The CEO"
        />
      </div>
    </Variant>

    <Variant title="Slack Channel">
      <div class="w-full max-w-xl">
        <button
          v-if="slackState.outcome"
          class="mb-4 rounded-md bg-muted px-3 py-1 text-sm hover:bg-muted/80"
          @click="resetSlack"
        >
          Reset
        </button>
        <message-draft
          id="message-draft-slack-channel"
          channel="slack"
          :target="{ type: 'channel', name: 'general', memberCount: 45 }"
          body="Hey team! Don't forget about the standup at 10am tomorrow. We'll be discussing the new release timeline."
          :outcome="slackState.outcome"
          @send="handleSlackSend"
          @cancel="handleSlackCancel"
        />
      </div>
    </Variant>

    <Variant title="Slack DM">
      <div class="w-full max-w-xl">
        <message-draft
          id="message-draft-slack-dm"
          channel="slack"
          :target="{ type: 'dm', name: 'john.doe' }"
          body="Hi John, can we sync up later today about the design review? I have some feedback I'd like to discuss."
        />
      </div>
    </Variant>

    <Variant title="Sent Receipt">
      <div class="w-full max-w-2xl">
        <message-draft
          id="message-draft-sent"
          channel="email"
          subject="Meeting Confirmation"
          :to="['client@example.com']"
          body="Dear Client,

This confirms our meeting scheduled for tomorrow at 2pm.

Best regards"
          outcome="sent"
        />
      </div>
    </Variant>

    <Variant title="Cancelled">
      <div class="w-full max-w-2xl">
        <p class="mb-2 text-sm text-muted-foreground">
          Cancelled state renders nothing (as per design)
        </p>
        <message-draft
          id="message-draft-cancelled"
          channel="email"
          subject="Draft Message"
          :to="['recipient@example.com']"
          body="This is a draft that was not sent."
          outcome="cancelled"
        />
      </div>
    </Variant>
  </Story>
</template>
