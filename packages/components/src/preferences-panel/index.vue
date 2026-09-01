<script setup lang="ts">
import { Check, AlertCircle } from 'lucide-vue-next';
import { computed, reactive } from 'vue';
import { cn } from '../core';
import { usePreferencesPanel } from './states';
import { useI18n } from '../core/i18n';
import PreferenceField from './cmpts/preference-field.vue';
import type {
  PreferencesPanelProps,
  PreferencesPanelReceiptProps,
} from './schema';

defineOptions({ name: 'CmptPreferencesPanel', inheritAttrs: false })

const props = withDefaults(defineProps<PreferencesPanelProps & Partial<PreferencesPanelReceiptProps>>(), {
  css: () => ({}),
})

const emit = defineEmits<{
  change: [value: Record<string, string | string[] | boolean>];
  action: [actionId: string, value: Record<string, string | string[] | boolean>];
  beforeAction: [actionId: string, value: Record<string, string | string[] | boolean>];
  'update:value': [value: Record<string, string | string[] | boolean>];
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
    <div class="flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card/60 opacity-95 shadow-xs">
      <!-- Header -->
      <template v-if="props.title">
        <div class="flex items-center justify-between gap-3 px-5 py-4">
          <h2 class="text-base leading-none font-semibold">{{ props.title }}</h2>
          <span
            v-if="state.hasErrors"
            class="flex items-center gap-1.5 text-xs font-medium text-destructive"
          >
            <alert-circle class="size-3.5 shrink-0" />
            {{ t('preferencesPanel.error') }}
          </span>
          <span
            v-else
            class="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-500"
          >
            <check class="size-3.5 shrink-0" />
            {{ t('preferencesPanel.saved') }}
          </span>
        </div>
        <hr class="border-border" />
      </template>

      <!-- Content -->
      <div :class="cn('flex flex-col gap-4 px-5', props.title ? 'py-6' : 'py-2')">
        <template v-for="(section, sectionIndex) in state.sections" :key="sectionIndex">
          <fieldset :class="cn('flex flex-col', props.css?.section)">
            <legend
              v-if="section.heading"
              class="pb-1 text-xs tracking-widest text-muted-foreground uppercase"
            >
              {{ section.heading }}
            </legend>
            <div class="flex flex-col">
              <template v-for="(item, itemIndex) in section.items" :key="item.id">
                <hr v-if="itemIndex > 0" class="my-1 border-border" />
                <div
                  :class="
                    cn(
                      'flex items-start justify-between gap-4',
                      !section.heading && itemIndex === 0 && !props.title ? 'pt-0 pb-3' : 'py-3',
                      props.css?.item
                    )
                  "
                >
                  <div class="flex flex-col gap-1">
                    <span class="text-sm leading-6 font-medium text-pretty">{{ item.label }}</span>
                    <span
                      v-if="state.getItemError(item)"
                      class="text-sm font-normal text-pretty text-destructive"
                    >
                      {{ state.getItemError(item) }}
                    </span>
                    <span
                      v-else-if="item.description"
                      class="text-sm font-normal text-pretty text-muted-foreground"
                    >
                      {{ item.description }}
                    </span>
                  </div>
                  <div class="flex shrink-0 items-center gap-2">
                    <span class="text-sm font-medium text-muted-foreground">
                      {{ state.formatDisplayValue(item, state.getItemValue(item)) }}
                    </span>
                    <alert-circle
                      v-if="state.getItemError(item)"
                      class="size-3.5 shrink-0 text-destructive"
                    />
                    <check
                      v-else-if="!state.hasErrors"
                      class="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-500"
                    />
                  </div>
                </div>
              </template>
            </div>
          </fieldset>
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
    <div class="flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <!-- Header -->
      <template v-if="props.title">
        <div class="px-5 py-4">
          <h2 class="text-base leading-none font-semibold">{{ props.title }}</h2>
        </div>
        <hr class="border-border" />
      </template>

      <!-- Content -->
      <div :class="cn('flex flex-col gap-4 px-5', props.title ? 'py-6' : 'py-2')">
        <template v-for="(section, sectionIndex) in state.sections" :key="sectionIndex">
          <fieldset :class="cn('flex flex-col', props.css?.section)">
            <legend
              v-if="section.heading"
              class="pb-1 text-xs tracking-widest text-muted-foreground uppercase"
            >
              {{ section.heading }}
            </legend>
            <div class="flex flex-col">
              <template v-for="(item, itemIndex) in section.items" :key="item.id">
                <hr v-if="itemIndex > 0" class="my-1 border-border" />
                <PreferenceField
                  :item="item"
                  :value="state.getItemValue(item)"
                  :item-index="itemIndex"
                  :has-heading="!!section.heading"
                  :has-title="!!props.title"
                  :css-item="props.css?.item"
                  @update="state.updateValue(item.id, $event)"
                  @toggle="state.toggleOption(item, $event)"
                />
              </template>
            </div>
          </fieldset>
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
