<script setup lang="ts">
import { QuestionFlow } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const progressiveModeStep1 = useStoryLocale('variant.progressiveModeStep1', messages)
const projectSetupTitle = useStoryLocale('content.projectSetupTitle', messages)
const projectSetupDesc = useStoryLocale('content.projectSetupDesc', messages)
const webAppLabel = useStoryLocale('content.webAppLabel', messages)
const apiServiceLabel = useStoryLocale('content.apiServiceLabel', messages)
const mobileAppLabel = useStoryLocale('content.mobileAppLabel', messages)

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const QuestionFlowProps = useStoryLocale('content.questionFlowProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = QuestionFlowProps

const props = [
  { name: 'id', type: 'string', required: true, description: { zh: '组件的唯一标识符', en: 'Unique identifier for the component' } },
  { name: 'step', type: 'number', description: { zh: '当前步骤索引（从1开始，渐进模式）', en: 'Current step index (1-based, progressive mode)' } },
  { name: 'title', type: 'string', description: { zh: '问题的标题（渐进模式）', en: 'Title of the question (progressive mode)' } },
  { name: 'description', type: 'string', description: { zh: '问题的描述（渐进模式）', en: 'Description of the question (progressive mode)' } },
  { name: 'options', type: 'QuestionFlowOption[]', description: { zh: '选项数组（渐进模式）', en: 'Array of options (progressive mode)' } },
  { name: 'steps', type: 'QuestionFlowStepDefinition[]', description: { zh: '步骤定义数组（前置模式）', en: 'Array of step definitions (upfront mode)' } },
  { name: 'choice', type: 'QuestionFlowChoice', description: { zh: '回执状态下展示的选择结果', en: 'Choice result to display in receipt mode' } },
  { name: 'selectionMode', type: "'single' | 'multi'", default: 'single', description: { zh: '选择模式（渐进模式）', en: 'Selection mode (progressive mode)' } },
  { name: 'defaultValue', type: 'string[]', description: { zh: '默认选中的值', en: 'Default selected values' } },
  { name: 'css', type: '{ root?: string; header?: string; options?: string; actions?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
]

// Progressive Step 1

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
