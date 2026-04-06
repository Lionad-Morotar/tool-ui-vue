<script setup lang="ts">
import { reactive } from 'vue';
import { ApprovalCard } from '@lionad/vtu-components';

/**
 * # ApprovalCard
 *
 * A decision-making component that presents users with a binary choice (approve/deny).
 * Supports destructive actions, metadata display, and receipt states.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | id | string | required | Unique identifier for the component |
 * | title | string | required | The main question or title |
 * | description | string | undefined | Optional descriptive text |
 * | icon | string | undefined | Lucide icon name (e.g., 'rocket', 'mail', 'trash-2', 'check') |
 * | metadata | MetadataItem[] | undefined | Array of key-value pairs to display |
 * | variant | 'default' \| 'destructive' | 'default' | Visual style variant |
 * | confirmLabel | string | 'Approve' | Label for confirm button |
 * | cancelLabel | string | 'Deny' | Label for cancel button |
 * | choice | 'approved' \| 'denied' | undefined | Receipt state - shows result view |
 * | css | { root?: string } | undefined | CSS classes for component elements |
 *
 * ## Emits
 *
 * | Event | Description |
 * |-------|-------------|
 * | confirm | Emitted when user clicks confirm button |
 * | cancel | Emitted when user clicks cancel button or presses Escape |
 *
 * ## Usage
 *
 * ```vue
 * <ApprovalCard
 *   id="deploy-approval"
 *   title="Deploy to production?"
 *   description="This will trigger the deployment pipeline"
 *   icon="rocket"
 *   confirmLabel="Deploy"
 *   cancelLabel="Cancel"
 *   @confirm="handleDeploy"
 *   @cancel="handleCancel"
 * />
 * ```
 */

const interactiveState = reactive({
  title: 'Deploy to Production',
  description: 'This will push the latest changes to all users.',
  variant: 'default' as const,
  icon: 'rocket',
  confirmLabel: 'Deploy',
  cancelLabel: 'Cancel',
  choice: undefined as 'approved' | 'denied' | undefined,
});

function handleConfirm() {
  interactiveState.choice = 'approved';
}

function handleCancel() {
  interactiveState.choice = 'denied';
}

function resetChoice() {
  interactiveState.choice = undefined;
}
</script>

<template>
  <Story title="ApprovalCard/Basic">
    <Variant title="Default">
      <approval-card
        id="approval-card-basic"
        title="Deploy to Production"
        description="This will push the latest changes to all users."
        icon="rocket"
        confirm-label="Deploy"
        cancel-label="Cancel"
      />
    </Variant>

    <Variant title="Destructive">
      <approval-card
        id="approval-card-destructive"
        title="Delete Project"
        description="This action cannot be undone. All files, settings, and history will be permanently removed."
        variant="destructive"
        icon="trash-2"
        confirm-label="Delete Project"
        cancel-label="Keep Project"
      />
    </Variant>

    <Variant title="With Metadata">
      <approval-card
        id="approval-card-metadata"
        title="Send Email Campaign"
        description="Review the details before sending to your subscribers."
        icon="mail"
        :metadata="[
          { key: 'Recipients', value: '12,847 subscribers' },
          { key: 'Subject', value: 'Your Weekly Digest' },
          { key: 'Scheduled', value: 'Immediately' },
        ]"
        confirm-label="Send Now"
        cancel-label="Cancel"
      />
    </Variant>

    <Variant title="Minimal">
      <approval-card
        id="approval-card-minimal"
        title="Confirm action?"
      />
    </Variant>

    <Variant title="Receipt State (Approved)">
      <approval-card
        id="approval-card-receipt-approved"
        title="Back up database"
        choice="approved"
        confirm-label="Approved"
      />
    </Variant>

    <Variant title="Receipt State (Denied)">
      <approval-card
        id="approval-card-receipt-denied"
        title="Delete all project files"
        choice="denied"
        cancel-label="Denied"
      />
    </Variant>

    <Variant title="Custom Labels">
      <approval-card
        id="approval-card-custom"
        title="Submit proposal?"
        description="This will send the proposal to the client"
        icon="file-text"
        confirm-label="Submit"
        cancel-label="Save Draft"
      />
    </Variant>

    <Variant title="Interactive" auto-props-disabled>
      <div class="flex flex-col gap-4">
        <approval-card
          id="approval-card-interactive"
          v-bind="interactiveState"
          @confirm="handleConfirm"
          @cancel="handleCancel"
        />
        <button
          v-if="interactiveState.choice"
          type="button"
          class="self-center rounded-md bg-muted px-3 py-1 text-sm hover:bg-muted/80"
          @click="resetChoice"
        >
          Reset
        </button>
      </div>
    </Variant>
  </Story>
</template>
