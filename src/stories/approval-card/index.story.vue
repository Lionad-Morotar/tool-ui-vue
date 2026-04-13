<script setup lang="ts">
import { reactive, watch } from 'vue';
import { ApprovalCard } from '@lionad/vtu-components';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'
import messages from './i18n'

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const ApprovalCardProps = useStoryLocale('content.approvalCardProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = ApprovalCardProps

// Props documentation
const props = [
  { name: 'id', type: 'string', required: true, description: { zh: '组件唯一标识符', en: 'Unique identifier for the component' } },
  { name: 'title', type: 'string', required: true, description: { zh: '审批卡片标题', en: 'Title of the approval card' } },
  { name: 'description', type: 'string', description: { zh: '可选描述文本', en: 'Optional description text' } },
  { name: 'icon', type: 'string', description: { zh: '头部显示的图标名称', en: 'Icon name displayed in the header' } },
  { name: 'metadata', type: 'MetadataItem[]', description: { zh: '键值对形式的元数据数组', en: 'Array of key-value metadata items' } },
  { name: 'variant', type: "'default' | 'destructive'", default: 'default', description: { zh: '卡片视觉变体', en: 'Visual variant of the card' } },
  { name: 'confirmLabel', type: 'string', description: { zh: '确认按钮标签', en: 'Label for the confirm button' } },
  { name: 'cancelLabel', type: 'string', description: { zh: '取消按钮标签', en: 'Label for the cancel button' } },
  { name: 'choice', type: "'approved' | 'denied'", description: { zh: '回执状态选择', en: 'Receipt state selection' } },
  { name: 'css', type: '{ root?: string; header?: string; content?: string; actions?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
]

const defaultVariant = useStoryLocale('content.defaultVariant', messages)
const destructive = useStoryLocale('content.destructive', messages)
const withMetadata = useStoryLocale('data.withMeta', messages)
const minimal = useStoryLocale('content.minimal', messages)
const receiptStateApproved = useStoryLocale('content.receiptStateApproved', messages)
const receiptStateDenied = useStoryLocale('content.receiptStateDenied', messages)
const customLabels = useStoryLocale('content.customLabels', messages)
const interactive = useStoryLocale('content.interactive', messages)
const deployTitle = useStoryLocale('content.deployTitle', messages)
const deployDesc = useStoryLocale('content.deployDesc', messages)
const deployLabel = useStoryLocale('content.deployLabel', messages)
const cancelLabel = useStoryLocale('content.cancelLabel', messages)
const deleteProjectTitle = useStoryLocale('content.deleteProjectTitle', messages)
const deleteProjectDesc = useStoryLocale('content.deleteProjectDesc', messages)
const deleteProjectLabel = useStoryLocale('content.deleteProjectLabel', messages)
const keepProjectLabel = useStoryLocale('content.keepProjectLabel', messages)
const emailCampaignTitle = useStoryLocale('content.emailCampaignTitle', messages)
const emailCampaignDesc = useStoryLocale('content.emailCampaignDesc', messages)
const recipientsLabel = useStoryLocale('content.recipientsLabel', messages)
const subjectLabel = useStoryLocale('content.subjectLabel', messages)
const scheduledLabel = useStoryLocale('content.scheduledLabel', messages)
const sendNowLabel = useStoryLocale('content.sendNowLabel', messages)
const weeklyDigestLabel = useStoryLocale('content.weeklyDigestLabel', messages)
const immediatelyLabel = useStoryLocale('content.immediatelyLabel', messages)
const subscriberCount = useStoryLocale('content.subscriberCount', messages)
const confirmActionTitle = useStoryLocale('content.confirmActionTitle', messages)
const backupDbTitle = useStoryLocale('content.backupDbTitle', messages)
const deleteAllFilesTitle = useStoryLocale('content.deleteAllFilesTitle', messages)
const approvedLabel = useStoryLocale('content.approvedLabel', messages)
const deniedLabel = useStoryLocale('content.deniedLabel', messages)
const submitProposalTitle = useStoryLocale('content.submitProposalTitle', messages)
const submitProposalDesc = useStoryLocale('content.submitProposalDesc', messages)
const submitLabel = useStoryLocale('content.submitLabel', messages)
const saveDraftLabel = useStoryLocale('content.saveDraftLabel', messages)
const resetLabel = useStoryLocale('content.resetLabel', messages)

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

// Deploy to production

// Delete project

// Email campaign

// Minimal

// Receipt

// Custom labels

// Interactive

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
                <td class="text-muted-foreground">{{ prop.default || (prop.required ? 'required' : '-') }}</td>
                <td>{{ useStoryLocale(prop.description) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Variant>
  </Story>
</template>
