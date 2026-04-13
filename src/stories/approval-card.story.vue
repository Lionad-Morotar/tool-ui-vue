<script setup lang="ts">
import { reactive, watch } from 'vue';
import { ApprovalCard } from '@lionad/vtu-components';
import { useStoryLocale, currentLocale } from './_shared/use-story-locale'

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

const defaultVariant = useStoryLocale({ zh: '默认', en: 'Default' })
const destructive = useStoryLocale({ zh: '破坏性操作', en: 'Destructive' })
const withMetadata = useStoryLocale({ zh: '含元数据', en: 'With Metadata' })
const minimal = useStoryLocale({ zh: '极简', en: 'Minimal' })
const receiptStateApproved = useStoryLocale({ zh: '回执状态（已批准）', en: 'Receipt State (Approved)' })
const receiptStateDenied = useStoryLocale({ zh: '回执状态（已拒绝）', en: 'Receipt State (Denied)' })
const customLabels = useStoryLocale({ zh: '自定义标签', en: 'Custom Labels' })
const interactive = useStoryLocale({ zh: '交互模式', en: 'Interactive' })

// Deploy to production
const deployTitle = useStoryLocale({ zh: '部署到生产环境', en: 'Deploy to Production' })
const deployDesc = useStoryLocale({ zh: '这会将最新变更推送给所有用户', en: 'This will push the latest changes to all users.' })
const deployLabel = useStoryLocale({ zh: '部署', en: 'Deploy' })
const cancelLabel = useStoryLocale({ zh: '取消', en: 'Cancel' })

// Delete project
const deleteProjectTitle = useStoryLocale({ zh: '删除项目', en: 'Delete Project' })
const deleteProjectDesc = useStoryLocale({ zh: '此操作无法撤销。所有文件、设置和历史记录将被永久删除。', en: 'This action cannot be undone. All files, settings, and history will be permanently removed.' })
const deleteProjectLabel = useStoryLocale({ zh: '删除项目', en: 'Delete Project' })
const keepProjectLabel = useStoryLocale({ zh: '保留项目', en: 'Keep Project' })

// Email campaign
const emailCampaignTitle = useStoryLocale({ zh: '发送邮件活动', en: 'Send Email Campaign' })
const emailCampaignDesc = useStoryLocale({ zh: '发送前请审查详细信息', en: 'Review the details before sending to your subscribers.' })
const recipientsLabel = useStoryLocale({ zh: '收件人', en: 'Recipients' })
const subjectLabel = useStoryLocale({ zh: '主题', en: 'Subject' })
const scheduledLabel = useStoryLocale({ zh: '计划时间', en: 'Scheduled' })
const sendNowLabel = useStoryLocale({ zh: '立即发送', en: 'Send Now' })
const weeklyDigestLabel = useStoryLocale({ zh: '你的每周摘要', en: 'Your Weekly Digest' })
const immediatelyLabel = useStoryLocale({ zh: '立即', en: 'Immediately' })
const subscriberCount = useStoryLocale({ zh: '12,847 名订阅者', en: '12,847 subscribers' })

// Minimal
const confirmActionTitle = useStoryLocale({ zh: '确认操作？', en: 'Confirm action?' })

// Receipt
const backupDbTitle = useStoryLocale({ zh: '备份数据库', en: 'Back up database' })
const deleteAllFilesTitle = useStoryLocale({ zh: '删除所有项目文件', en: 'Delete all project files' })
const approvedLabel = useStoryLocale({ zh: '已批准', en: 'Approved' })
const deniedLabel = useStoryLocale({ zh: '已拒绝', en: 'Denied' })

// Custom labels
const submitProposalTitle = useStoryLocale({ zh: '提交提案？', en: 'Submit proposal?' })
const submitProposalDesc = useStoryLocale({ zh: '这会将提案发送给客户', en: 'This will send the proposal to the client' })
const submitLabel = useStoryLocale({ zh: '提交', en: 'Submit' })
const saveDraftLabel = useStoryLocale({ zh: '保存草稿', en: 'Save Draft' })

// Interactive
const resetLabel = useStoryLocale({ zh: '重置', en: 'Reset' })
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
