<script setup lang="ts">
import { cn } from '../core';
import { useI18n } from '../core/i18n';
import { Check, AlertCircle } from 'lucide-vue-next';
import { computed, reactive } from 'vue';
import { usePreferencesPanel } from './states';
import type {
  PreferencesPanelProps,
  PreferencesPanelReceiptProps,
} from './schema';

defineOptions({ name: 'CmptPreferencesPanel', inheritAttrs: false })

const props = withDefaults(defineProps<PreferencesPanelProps & Partial<PreferencesPanelReceiptProps>>(), {
  css: () => ({}),
})

const emit = defineEmits<{
  change: [value: Record<string, string | boolean>];
  action: [actionId: string, value: Record<string, string | boolean>];
  beforeAction: [actionId: string, value: Record<string, string | boolean>];
  'update:value': [value: Record<string, string | boolean>];
}>()

// All business logic delegated to states layer
const state = reactive(usePreferencesPanel(props, emit));
const { t } = useI18n();

// Derived i18n values for attribute bindings (type-safe unwrapping)
const receiptAriaLabel = computed(() => state.hasErrors ? t('preferencesPanel.preferencesWithErrors').value : t('preferencesPanel.confirmedPreferences').value);
</script>

<template>
  <!-- Receipt State -->
  <article
    v-if="state.isReceipt"
    v-bind="$attrs"
    :class="cn('@container/preferences-panel flex w-full max-w-md min-w-80 flex-col', props.css?.root)"
    data-slot="preferences-panel"
    :data-tool-ui-id="props.id"
    data-receipt="true"
    role="status"
    lang="en"
    :aria-busy="false"
    :aria-label="receiptAriaLabel"
  >
    <div class="flex flex-col bg-card/60 opacity-95 shadow-xs border border-border rounded-2xl w-full overflow-hidden">
      <!-- Header -->
      <template v-if="props.title">
        <div class="flex justify-between items-center gap-3 px-5 py-4">
          <h2 class="font-semibold text-base leading-none">{{ props.title }}</h2>
          <span
            v-if="state.hasErrors"
            class="flex items-center gap-1.5 font-medium text-destructive text-xs"
          >
            <alert-circle class="shrink-0 size-3.5" />
            {{ t('preferencesPanel.error') }}
          </span>
          <span
            v-else
            class="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-500 text-xs"
          >
            <check class="shrink-0 size-3.5" />
            {{ t('preferencesPanel.saved') }}
          </span>
        </div>
        <hr class="border-border" />
      </template>

      <!-- Content -->
      <div :class="cn('flex flex-col gap-4 px-5', props.title ? 'py-6' : 'py-2')">
        <template v-for="(section, sectionIndex) in state.sections" :key="sectionIndex">
          <fieldset v-if="section.heading" :class="cn('flex flex-col', props.css?.section)">
            <legend class="pb-1 text-muted-foreground text-xs uppercase tracking-widest">
              {{ section.heading }}
            </legend>
            <div class="flex flex-col">
              <template v-for="(item, itemIndex) in section.items" :key="item.id">
                <hr v-if="itemIndex > 0" class="my-1 border-border" />
                <div :class="cn('flex items-start justify-between gap-4 py-3', props.css?.item)">
                  <div class="flex flex-col gap-1">
                    <span class="font-medium text-sm text-pretty leading-6">{{ item.label }}</span>
                    <span
                      v-if="state.getItemError(item)"
                      class="font-normal text-destructive text-sm text-pretty"
                    >
                      {{ state.getItemError(item) }}
                    </span>
                    <span
                      v-else-if="item.description"
                      class="font-normal text-muted-foreground text-sm text-pretty"
                    >
                      {{ item.description }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="font-medium text-muted-foreground text-sm">
                      {{ state.formatDisplayValue(item, state.getItemValue(item)) }}
                    </span>
                    <alert-circle
                      v-if="state.getItemError(item)"
                      class="shrink-0 size-3.5 text-destructive"
                    />
                    <check
                      v-else-if="!state.hasErrors"
                      class="shrink-0 size-3.5 text-emerald-600 dark:text-emerald-500"
                    />
                  </div>
                </div>
              </template>
            </div>
          </fieldset>
          <div v-else :class="cn('flex flex-col', props.css?.section)">
            <template v-for="(item, itemIndex) in section.items" :key="item.id">
              <hr
                v-if="itemIndex > 0"
                class="my-1 border-border"
              />
              <div
                :class="cn(
                  'flex items-start justify-between gap-4',
                  itemIndex === 0 && !props.title ? 'pt-0 pb-3' : 'py-3',
                  props.css?.item
                )"
              >
                <div class="flex flex-col gap-1">
                  <span class="font-medium text-sm text-pretty leading-6">{{ item.label }}</span>
                  <span
                    v-if="state.getItemError(item)"
                    class="font-normal text-destructive text-sm text-pretty"
                  >
                    {{ state.getItemError(item) }}
                  </span>
                  <span
                    v-else-if="item.description"
                    class="font-normal text-muted-foreground text-sm text-pretty"
                  >
                    {{ item.description }}
                  </span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="font-medium text-muted-foreground text-sm">
                    {{ state.formatDisplayValue(item, state.getItemValue(item)) }}
                  </span>
                  <alert-circle
                    v-if="state.getItemError(item)"
                    class="shrink-0 size-3.5 text-destructive"
                  />
                  <check
                    v-else-if="!state.hasErrors"
                    class="shrink-0 size-3.5 text-emerald-600 dark:text-emerald-500"
                  />
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </article>

  <!-- Interactive State -->
  <article
    v-else
    v-bind="$attrs"
    :class="cn('@container/preferences-panel flex w-full max-w-md min-w-80 flex-col gap-3 text-foreground', props.css?.root)"
    data-slot="preferences-panel"
    :data-tool-ui-id="props.id"
    role="form"
    lang="en"
    :aria-busy="false"
  >
    <div class="flex flex-col bg-card shadow-xs border border-border rounded-2xl w-full overflow-hidden">
      <!-- Header -->
      <template v-if="props.title">
        <div class="px-5 py-4">
          <h2 class="font-semibold text-base leading-none">{{ props.title }}</h2>
        </div>
        <hr class="border-border" />
      </template>

      <!-- Content -->
      <div :class="cn('flex flex-col gap-4 px-5', props.title ? 'py-6' : 'py-2')">
        <template v-for="(section, sectionIndex) in state.sections" :key="sectionIndex">
          <fieldset v-if="section.heading" :class="cn('flex flex-col', props.css?.section)">
            <legend class="pb-1 text-muted-foreground text-xs uppercase tracking-widest">
              {{ section.heading }}
            </legend>
            <div class="flex flex-col">
              <template v-for="(item, itemIndex) in section.items" :key="item.id">
                <hr v-if="itemIndex > 0" class="my-1 border-border" />
                <div
                  :class="cn(
                    'flex items-start justify-between gap-4',
                    'py-3',
                    (item.type === 'input' || item.type === 'toggle') ? 'flex-col gap-3' : (item.type !== 'switch' && 'flex-col gap-3 @sm/preferences-panel:flex-row @sm/preferences-panel:gap-4'),
                    props.css?.item
                  )"
                >
                  <div class="flex flex-col gap-1 shrink-0">
                    <label
                      :for="`preference-${item.id}`"
                      class="font-medium text-pretty leading-6"
                    >
                      {{ item.label }}
                    </label>
                    <p
                      v-if="item.description"
                      class="font-normal text-muted-foreground text-sm text-pretty"
                    >
                      {{ item.description }}
                    </p>
                  </div>
                  <div :class="cn('flex', (item.type === 'input' || item.type === 'toggle') && 'w-full', item.type !== 'input' && item.type !== 'toggle' && 'shrink-0')">
                    <!-- Switch -->
                    <button
                      v-if="item.type === 'switch'"
                      :id="`preference-${item.id}`"
                      type="button"
                      role="switch"
                      :aria-checked="state.isSwitchValue(state.getItemValue(item))"
                      :class="cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                        state.isSwitchValue(state.getItemValue(item)) ? 'bg-primary' : 'bg-muted-foreground/30'
                      )"
                      @click="state.updateValue(item.id, !state.isSwitchValue(state.getItemValue(item)))"
                    >
                      <span
                        :class="cn(
                          'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
                          state.isSwitchValue(state.getItemValue(item)) ? 'translate-x-5' : 'translate-x-0.5'
                        )"
                        :style="{ marginTop: '2px' }"
                      />
                    </button>

                    <!-- Toggle -->
                    <div
                      v-else-if="item.type === 'toggle' && item.options"
                      class="flex flex-wrap items-center justify-end gap-1"
                    >
                      <button
                        v-for="option in item.options"
                        :key="option.value"
                        type="button"
                        :class="cn(
                          'rounded-full px-3 py-1.5 text-sm transition-colors',
                          state.getItemValue(item) === option.value
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent'
                        )"
                        @click="state.updateValue(item.id, option.value)"
                      >
                        {{ option.label }}
                      </button>
                    </div>

                    <!-- Select -->
                    <select
                      v-else-if="item.type === 'select' && item.selectOptions"
                      :id="`preference-${item.id}`"
                      :value="String(state.getItemValue(item))"
                      :class="cn(
                        'h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors',
                        'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none'
                      )"
                      @change="state.updateValue(item.id, ($event.target as HTMLSelectElement).value)"
                    >
                      <option
                        v-for="option in item.selectOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </select>

                    <!-- Input -->
                    <input
                      v-else-if="item.type === 'input'"
                      :id="`preference-${item.id}`"
                      :type="item.inputType ?? 'text'"
                      :placeholder="item.placeholder ?? ''"
                      :value="String(state.getItemValue(item))"
                      :class="cn(
                        'h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors',
                        'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none'
                      )"
                      @input="state.updateValue(item.id, ($event.target as HTMLInputElement).value)"
                    />
                  </div>
                </div>
              </template>
            </div>
          </fieldset>
          <div v-else :class="cn('flex flex-col', props.css?.section)">
            <template v-for="(item, itemIndex) in section.items" :key="item.id">
              <hr
                v-if="itemIndex > 0"
                class="my-1 border-border"
              />
              <div
                :class="cn(
                  'flex items-start justify-between gap-4',
                  itemIndex === 0 && !props.title ? 'pt-0 pb-3' : 'py-3',
                    (item.type === 'input' || item.type === 'toggle') ? 'flex-col gap-3' : (item.type !== 'switch' && 'flex-col gap-3 @sm/preferences-panel:flex-row @sm/preferences-panel:gap-4'),
                  props.css?.item
                )"
              >
                <div class="flex flex-col gap-1">
                  <label
                    :for="`preference-${item.id}`"
                    class="font-medium text-pretty leading-6"
                  >
                    {{ item.label }}
                  </label>
                  <p
                    v-if="item.description"
                    class="font-normal text-muted-foreground text-sm text-pretty"
                  >
                    {{ item.description }}
                  </p>
                </div>
                <div :class="cn('flex', item.type !== 'input' && 'shrink-0')">
                  <!-- Switch -->
                  <button
                    v-if="item.type === 'switch'"
                    :id="`preference-${item.id}`"
                    type="button"
                    role="switch"
                    :aria-checked="state.isSwitchValue(state.getItemValue(item))"
                    :class="cn(
                      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                      state.isSwitchValue(state.getItemValue(item)) ? 'bg-primary' : 'bg-muted-foreground/30'
                    )"
                    @click="state.updateValue(item.id, !state.isSwitchValue(state.getItemValue(item)))"
                  >
                    <span
                      :class="cn(
                        'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
                        state.isSwitchValue(state.getItemValue(item)) ? 'translate-x-5' : 'translate-x-0.5'
                      )"
                      :style="{ marginTop: '2px' }"
                    />
                  </button>

                  <!-- Toggle -->
                  <div
                    v-else-if="item.type === 'toggle' && item.options"
                    class="flex flex-wrap items-center justify-end gap-1"
                  >
                    <button
                      v-for="option in item.options"
                      :key="option.value"
                      type="button"
                      :class="cn(
                        'rounded-full px-3 py-1.5 text-sm transition-colors',
                        state.getItemValue(item) === option.value
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      )"
                      @click="state.updateValue(item.id, option.value)"
                    >
                      {{ option.label }}
                    </button>
                  </div>

                  <!-- Select -->
                  <select
                    v-else-if="item.type === 'select' && item.selectOptions"
                    :id="`preference-${item.id}`"
                    :value="String(state.getItemValue(item))"
                    :class="cn(
                      'h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors',
                      'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none'
                    )"
                    @change="state.updateValue(item.id, ($event.target as HTMLSelectElement).value)"
                  >
                    <option
                      v-for="option in item.selectOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>

                  <!-- Input -->
                  <input
                    v-else-if="item.type === 'input'"
                    :id="`preference-${item.id}`"
                    :type="item.inputType ?? 'text'"
                    :placeholder="item.placeholder ?? ''"
                    :value="String(state.getItemValue(item))"
                    :class="cn(
                      'h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors',
                      'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none'
                    )"
                    @input="state.updateValue(item.id, ($event.target as HTMLInputElement).value)"
                  />
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>

    <!-- Actions -->
    <div v-if="state.normalizedActions" :class="cn('@container/actions', props.css?.actions)">
      <div
        :class="cn(
          'flex w-full gap-2',
          state.normalizedActions.align === 'left' ? 'flex-row justify-start' :
          state.normalizedActions.align === 'center' ? 'flex-row justify-center' :
          'flex-col @[240px]:flex-row @[240px]:justify-end',
        )"
      >
        <button
          v-for="action in state.actionsWithState"
          :key="action.id"
          type="button"
          :class="cn(
            'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
            'disabled:pointer-events-none disabled:opacity-50',
            'h-9',
            state.normalizedActions.align === 'right' ? 'w-full @[240px]:w-auto' : '',
            action.variant === 'destructive'
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              : action.variant === 'secondary'
                ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                : action.variant === 'ghost'
                  ? 'hover:bg-accent hover:text-accent-foreground'
                  : action.variant === 'outline'
                    ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90',
          )"
          :disabled="action.disabled"
          @click="state.handleAction(action.id)"
        >
          {{ action.label }}
        </button>
      </div>
    </div>
  </article>
</template>
