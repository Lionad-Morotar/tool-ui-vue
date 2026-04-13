<script setup lang="ts">
import { reactive } from 'vue';
import { QuestionFlow } from '@lionad/vtu-components';
import { useStoryLocale } from './_shared/use-story-locale';

const progressiveState = reactive({
  step: 1,
  selectedOptions: [] as string[],
});

function handleSelect(options: string[]) {
  progressiveState.selectedOptions = options;
  alert(`Selected: ${options.join(', ')}`);
}

function handleComplete(answers: Record<string, string[]>) {
  alert(`Completed! Answers: ${JSON.stringify(answers)}`);
}

const progressiveModeStep1 = useStoryLocale({ zh: '渐进模式 - 步骤 1', en: 'Progressive Mode - Step 1' })
const progressiveModeStep2 = useStoryLocale({ zh: '渐进模式 - 步骤 2', en: 'Progressive Mode - Step 2' })
const progressiveModeMultiSelect = useStoryLocale({ zh: '渐进模式 - 多选', en: 'Progressive Mode - Multi Select' })
const progressiveModeWithDefaultValue = useStoryLocale({ zh: '渐进模式 - 含默认值', en: 'Progressive Mode - With Default Value' })
const upfrontModeMultiStep = useStoryLocale({ zh: '前置模式 - 多步骤', en: 'Upfront Mode - Multi Step' })
const upfrontModeWithDisabledOptions = useStoryLocale({ zh: '前置模式 - 含禁用选项', en: 'Upfront Mode - With Disabled Options' })
const receiptMode = useStoryLocale({ zh: '回执模式', en: 'Receipt Mode' })
const receiptModeMultipleItems = useStoryLocale({ zh: '回执模式 - 多项', en: 'Receipt Mode - Multiple Items' })
const interactiveProgressive = useStoryLocale({ zh: '交互渐进模式', en: 'Interactive Progressive' })

// Progressive Step 1
const projectSetupTitle = useStoryLocale({ zh: '项目设置', en: 'Project Setup' })
const projectSetupDesc = useStoryLocale({ zh: '让我们来配置你的新项目', en: "Let's configure your new project" })
const webAppLabel = useStoryLocale({ zh: 'Web 应用', en: 'Web Application' })
const apiServiceLabel = useStoryLocale({ zh: 'API 服务', en: 'API Service' })
const mobileAppLabel = useStoryLocale({ zh: '移动应用', en: 'Mobile App' })

// Progressive Step 2
const chooseFrameworkTitle = useStoryLocale({ zh: '选择框架', en: 'Choose Framework' })
const chooseFrameworkDesc = useStoryLocale({ zh: '选择你偏好的框架', en: 'Select your preferred framework' })
const reactDesc = useStoryLocale({ zh: '流行且灵活', en: 'Popular and flexible' })
const vueDesc = useStoryLocale({ zh: '渐进式且易上手', en: 'Progressive and approachable' })
const svelteDesc = useStoryLocale({ zh: '基于编译，最小运行时', en: 'Compiler-based, minimal runtime' })

// Multi-select
const selectFeaturesTitle = useStoryLocale({ zh: '选择功能', en: 'Select Features' })
const selectFeaturesDesc = useStoryLocale({ zh: '选择你需要的功能', en: 'Choose the features you need' })
const authLabel = useStoryLocale({ zh: '身份认证', en: 'Authentication' })
const authDesc = useStoryLocale({ zh: '用户登录和注册', en: 'User login and registration' })
const paymentsLabel = useStoryLocale({ zh: '支付', en: 'Payments' })
const paymentsDesc = useStoryLocale({ zh: 'Stripe 集成', en: 'Stripe integration' })
const notificationsLabel = useStoryLocale({ zh: '通知', en: 'Notifications' })
const notificationsDesc = useStoryLocale({ zh: '邮件和推送通知', en: 'Email and push notifications' })
const analyticsLabel = useStoryLocale({ zh: '数据分析', en: 'Analytics' })
const analyticsDesc = useStoryLocale({ zh: '使用追踪和报告', en: 'Usage tracking and reporting' })

// Default value
const selectPlanTitle = useStoryLocale({ zh: '选择方案', en: 'Select Plan' })
const selectPlanDesc = useStoryLocale({ zh: '选择你的订阅方案', en: 'Choose your subscription plan' })
const freeLabel = useStoryLocale({ zh: '免费', en: 'Free' })
const freeDesc = useStoryLocale({ zh: '基础功能', en: 'Basic features' })
const proLabel = useStoryLocale({ zh: '专业版', en: 'Pro' })
const proDesc = useStoryLocale({ zh: '高级功能', en: 'Advanced features' })
const enterpriseLabel = useStoryLocale({ zh: '企业版', en: 'Enterprise' })
const enterpriseDesc = useStoryLocale({ zh: '定制方案', en: 'Custom solutions' })

// Upfront mode
const choosePlatformTitle = useStoryLocale({ zh: '选择平台', en: 'Choose Platform' })
const platformDesc = useStoryLocale({ zh: '你的应用在哪里运行？', en: 'Where will your app run?' })
const webLabel = useStoryLocale({ zh: '网页', en: 'Web' })
const mobileLabel = useStoryLocale({ zh: '移动端', en: 'Mobile' })
const desktopLabel = useStoryLocale({ zh: '桌面端', en: 'Desktop' })
const chooseLanguageTitle = useStoryLocale({ zh: '选择语言', en: 'Choose Language' })
const languageDesc = useStoryLocale({ zh: '你偏好的语言？', en: 'What language do you prefer?' })
const whatsNeededTitle = useStoryLocale({ zh: '你需要的功能', en: 'What do you need?' })
const databaseLabel = useStoryLocale({ zh: '数据库', en: 'Database' })

// Receipt mode
const configCompleteTitle = useStoryLocale({ zh: '项目配置已完成', en: 'Project Configuration Complete' })
const projectTypeLabel = useStoryLocale({ zh: '项目类型', en: 'Project Type' })
const frameworkLabel = useStoryLocale({ zh: '框架', en: 'Framework' })
const featuresLabel = useStoryLocale({ zh: '功能', en: 'Features' })
const orderSummaryTitle = useStoryLocale({ zh: '订单摘要', en: 'Order Summary' })
const planLabel = useStoryLocale({ zh: '方案', en: 'Plan' })
const usersLabel = useStoryLocale({ zh: '用户', en: 'Users' })
const storageLabel = useStoryLocale({ zh: '存储空间', en: 'Storage' })
const supportLabel = useStoryLocale({ zh: '技术支持', en: 'Support' })
const totalLabel = useStoryLocale({ zh: '总计', en: 'Total' })

// Interactive
const interactiveDemoTitle = useStoryLocale({ zh: '交互演示', en: 'Interactive Demo' })
const interactiveDemoDesc = useStoryLocale({ zh: '做出选择以查看事件', en: 'Make a selection to see the event' })
const optionALabel = useStoryLocale({ zh: '选项 A', en: 'Option A' })
const optionADesc = useStoryLocale({ zh: '第一个选项', en: 'First option' })
const optionBLabel = useStoryLocale({ zh: '选项 B', en: 'Option B' })
const optionBDesc = useStoryLocale({ zh: '第二个选项', en: 'Second option' })
const optionCLabel = useStoryLocale({ zh: '选项 C', en: 'Option C' })
const optionCDesc = useStoryLocale({ zh: '第三个选项', en: 'Third option' })
const selectedText = useStoryLocale({ zh: '已选择:', en: 'Selected:' })
</script>

<template>
  <Story title="QuestionFlow/All Variants">
    <Variant :title="progressiveModeStep1">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-progressive-1"
          :step="1"
          :title="projectSetupTitle"
          :description="projectSetupDesc"
          :options="[
            { id: 'web', label: webAppLabel },
            { id: 'api', label: apiServiceLabel },
            { id: 'mobile', label: mobileAppLabel },
          ]"
          selection-mode="single"
        />
      </div>
    </Variant>

    <Variant :title="progressiveModeStep2">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-progressive-2"
          :step="2"
          :title="chooseFrameworkTitle"
          :description="chooseFrameworkDesc"
          :options="[
            { id: 'react', label: 'React', description: reactDesc },
            { id: 'vue', label: 'Vue', description: vueDesc },
            { id: 'svelte', label: 'Svelte', description: svelteDesc },
          ]"
          selection-mode="single"
        />
      </div>
    </Variant>

    <Variant :title="progressiveModeMultiSelect">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-multi"
          :step="1"
          :title="selectFeaturesTitle"
          :description="selectFeaturesDesc"
          :options="[
            { id: 'auth', label: authLabel, description: authDesc },
            { id: 'payments', label: paymentsLabel, description: paymentsDesc },
            { id: 'notifications', label: notificationsLabel, description: notificationsDesc },
            { id: 'analytics', label: analyticsLabel, description: analyticsDesc },
          ]"
          selection-mode="multi"
        />
      </div>
    </Variant>

    <Variant :title="progressiveModeWithDefaultValue">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-default"
          :step="1"
          :title="selectPlanTitle"
          :description="selectPlanDesc"
          :options="[
            { id: 'free', label: freeLabel, description: freeDesc },
            { id: 'pro', label: proLabel, description: proDesc },
            { id: 'enterprise', label: enterpriseLabel, description: enterpriseDesc },
          ]"
          selection-mode="single"
          :default-value="['pro']"
        />
      </div>
    </Variant>

    <Variant :title="upfrontModeMultiStep">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-upfront"
          :steps="[
            {
              id: 'platform',
              title: choosePlatformTitle,
              description: platformDesc,
              options: [
                { id: 'web', label: webLabel },
                { id: 'mobile', label: mobileLabel },
                { id: 'desktop', label: desktopLabel },
              ],
            },
            {
              id: 'language',
              title: chooseLanguageTitle,
              description: languageDesc,
              options: [
                { id: 'ts', label: 'TypeScript' },
                { id: 'js', label: 'JavaScript' },
                { id: 'python', label: 'Python' },
              ],
            },
            {
              id: 'features',
              title: whatsNeededTitle,
              options: [
                { id: 'auth', label: authLabel },
                { id: 'db', label: databaseLabel },
                { id: 'api', label: 'API' },
              ],
              selectionMode: 'multi',
            },
          ]"
          @complete="handleComplete"
        />
      </div>
    </Variant>

    <Variant :title="upfrontModeWithDisabledOptions">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-disabled"
          :steps="[
            {
              id: 'tier',
              title: selectPlanTitle,
              description: useStoryLocale({ zh: '部分选项不可用', en: 'Some options are unavailable' }),
              options: [
                { id: 'basic', label: useStoryLocale({ zh: '基础版', en: 'Basic' }) },
                { id: 'pro', label: proLabel, disabled: true },
                { id: 'enterprise', label: enterpriseLabel, disabled: true },
              ],
            },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="receiptMode">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-receipt"
          :choice="{
            title: configCompleteTitle,
            summary: [
              { label: projectTypeLabel, value: webAppLabel },
              { label: frameworkLabel, value: 'Vue' },
              { label: featuresLabel, value: useStoryLocale({ zh: '认证, 支付, 数据分析', en: 'Auth, Payments, Analytics' }) },
            ],
          }"
        />
      </div>
    </Variant>

    <Variant :title="receiptModeMultipleItems">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-receipt-multi"
          :choice="{
            title: orderSummaryTitle,
            summary: [
              { label: planLabel, value: useStoryLocale({ zh: '专业版 - 按年', en: 'Pro Annual' }) },
              { label: usersLabel, value: useStoryLocale({ zh: '25 名团队成员', en: '25 team members' }) },
              { label: storageLabel, value: '500 GB' },
              { label: supportLabel, value: useStoryLocale({ zh: '优先', en: 'Priority' }) },
              { label: totalLabel, value: '$299/year' },
            ],
          }"
        />
      </div>
    </Variant>

    <Variant :title="interactiveProgressive" auto-props-disabled>
      <div class="w-full max-w-md space-y-4">
        <div v-if="progressiveState.selectedOptions.length > 0" class="rounded-lg bg-muted p-3 text-sm">
          <strong>{{ selectedText }}</strong> {{ progressiveState.selectedOptions.join(", ") }}
        </div>
        <question-flow
          id="question-flow-interactive"
          :step="progressiveState.step"
          :title="interactiveDemoTitle"
          :description="interactiveDemoDesc"
          :options="[
            { id: 'option-a', label: optionALabel, description: optionADesc },
            { id: 'option-b', label: optionBLabel, description: optionBDesc },
            { id: 'option-c', label: optionCLabel, description: optionCDesc },
          ]"
          selection-mode="single"
          @select="handleSelect"
        />
      </div>
    </Variant>
  </Story>
</template>
