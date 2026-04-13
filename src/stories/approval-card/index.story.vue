<script setup lang="ts">
import { reactive, watch } from 'vue';
import { ApprovalCard } from '@lionad/vtu-components';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'
import messages from './i18n'

const interactiveStateZh = {
  title: '部署到生产环境',
  description: '这会将最新变更推送给所有用户。',
  variant: 'default' as const,
  icon: 'rocket',
  confirmLabel: '部署',
  cancelLabel: '取消',
  choice: undefined as 'approved' | 'denied' | undefined,
};

const interactiveStateEn = {
  title: 'Deploy to Production',
  description: 'This will push the latest changes to all users.',
  variant: 'default' as const,
  icon: 'rocket',
  confirmLabel: 'Deploy',
  cancelLabel: 'Cancel',
  choice: undefined as 'approved' | 'denied' | undefined,
};

const interactiveState = reactive({ ...interactiveStateZh });

watch(currentLocale, () => { Object.assign(interactiveState, currentLocale.value === 'zh-CN' ? interactiveStateZh : interactiveStateEn); });

function handleConfirm() {
  interactiveState.choice = 'approved';
}

function handleCancel() {
  interactiveState.choice = 'denied';
}

function resetChoice() {
  interactiveState.choice = undefined;
}

const defaultVariant = useStoryLocale('content.defaultVariant', messages)
const destructive = useStoryLocale('content.destructive', messages)
const withMetadata = useStoryLocale('data.withMeta', messages)
const minimal = useStoryLocale('content.minimal', messages)
const receiptStateApproved = useStoryLocale('content.receiptStateApproved', messages)
const receiptStateDenied = useStoryLocale('content.receiptStateDenied', messages)
const customLabels = useStoryLocale('content.customLabels', messages)
const interactive = useStoryLocale('content.interactive', messages)

// Deploy to production
const deployTitle = useStoryLocale('content.deployTitle', messages)
const deployDesc = useStoryLocale('content.deployDesc', messages)
const deployLabel = useStoryLocale('content.deployLabel', messages)
const cancelLabel = useStoryLocale('content.cancelLabel', messages)

// Delete project
const deleteProjectTitle = useStoryLocale('content.deleteProjectTitle', messages)
const deleteProjectDesc = useStoryLocale('content.deleteProjectDesc', messages)
const deleteProjectLabel = useStoryLocale('content.deleteProjectLabel', messages)
const keepProjectLabel = useStoryLocale('content.keepProjectLabel', messages)

// Email campaign
const emailCampaignTitle = useStoryLocale('content.emailCampaignTitle', messages)
const emailCampaignDesc = useStoryLocale('content.emailCampaignDesc', messages)
const recipientsLabel = useStoryLocale('content.recipientsLabel', messages)
const subjectLabel = useStoryLocale('content.subjectLabel', messages)
const scheduledLabel = useStoryLocale('content.scheduledLabel', messages)
const sendNowLabel = useStoryLocale('content.sendNowLabel', messages)
const weeklyDigestLabel = useStoryLocale('content.weeklyDigestLabel', messages)
const immediatelyLabel = useStoryLocale('content.immediatelyLabel', messages)
const subscriberCount = useStoryLocale('content.subscriberCount', messages)

// Minimal
const confirmActionTitle = useStoryLocale('content.confirmActionTitle', messages)

// Receipt
const backupDbTitle = useStoryLocale('content.backupDbTitle', messages)
const deleteAllFilesTitle = useStoryLocale('content.deleteAllFilesTitle', messages)
const approvedLabel = useStoryLocale('content.approvedLabel', messages)
const deniedLabel = useStoryLocale('content.deniedLabel', messages)

// Custom labels
const submitProposalTitle = useStoryLocale('content.submitProposalTitle', messages)
const submitProposalDesc = useStoryLocale('content.submitProposalDesc', messages)
const submitLabel = useStoryLocale('content.submitLabel', messages)
const saveDraftLabel = useStoryLocale('content.saveDraftLabel', messages)

// Interactive
const resetLabel = useStoryLocale('content.resetLabel', messages)
</script>

<template>
  <Story title="ApprovalCard/Basic">
    <Variant :title="defaultVariant">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <approval-card
        id="approval-card-basic"
        :title="deployTitle"
        :description="deployDesc"
        icon="rocket"
        :confirm-label="deployLabel"
        :cancel-label="cancelLabel"
      />
    </Variant>

    <Variant :title="destructive">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <approval-card
        id="approval-card-destructive"
        :title="deleteProjectTitle"
        :description="deleteProjectDesc"
        variant="destructive"
        icon="trash-2"
        :confirm-label="deleteProjectLabel"
        :cancel-label="keepProjectLabel"
      />
    </Variant>

    <Variant :title="withMetadata">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <approval-card
        id="approval-card-metadata"
        :title="emailCampaignTitle"
        :description="emailCampaignDesc"
        icon="mail"
        :metadata="[
          { key: recipientsLabel, value: subscriberCount },
          { key: subjectLabel, value: weeklyDigestLabel },
          { key: scheduledLabel, value: immediatelyLabel },
        ]"
        :confirm-label="sendNowLabel"
        :cancel-label="cancelLabel"
      />
    </Variant>

    <Variant :title="minimal">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <approval-card
        id="approval-card-minimal"
        :title="confirmActionTitle"
      />
    </Variant>

    <Variant :title="receiptStateApproved">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <approval-card
        id="approval-card-receipt-approved"
        :title="backupDbTitle"
        choice="approved"
        :confirm-label="approvedLabel"
      />
    </Variant>

    <Variant :title="receiptStateDenied">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <approval-card
        id="approval-card-receipt-denied"
        :title="deleteAllFilesTitle"
        choice="denied"
        :cancel-label="deniedLabel"
      />
    </Variant>

    <Variant :title="customLabels">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <approval-card
        id="approval-card-custom"
        :title="submitProposalTitle"
        :description="submitProposalDesc"
        icon="file-text"
        :confirm-label="submitLabel"
        :cancel-label="saveDraftLabel"
      />
    </Variant>

    <Variant :title="interactive" auto-props-disabled>
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
          {{ resetLabel }}
        </button>
      </div>
    </Variant>
  </Story>
</template>
