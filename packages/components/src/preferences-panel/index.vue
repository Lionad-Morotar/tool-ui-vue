<script setup lang="ts">
import { cn } from '@lionad/core';
import { Check, AlertCircle } from 'lucide-vue-next';
import { reactive } from 'vue';
import { usePreferencesPanel } from './states';
import type {
  PreferencesPanelProps,
  PreferencesPanelReceiptProps,
} from './schema';

defineOptions({ name: 'CmptPreferencesPanel', inheritAttrs: false })

const props = withDefaults(defineProps<PreferencesPanelProps & Partial<PreferencesPanelReceiptProps> & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

const emit = defineEmits<{
  change: [value: Record<string, string | boolean>];
  action: [actionId: string, value: Record<string, string | boolean>];
  beforeAction: [actionId: string, value: Record<string, string | boolean>];
  'update:value': [value: Record<string, string | boolean>];
}>()

// All business logic delegated to states layer
const state = reactive(usePreferencesPanel({
  props,
  emit: (name: string, ...args: unknown[]) => (emit as (n: string, ...a: unknown[]) => void)(name, ...args),
}));
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
    :aria-label="state.hasErrors ? 'Preferences with errors' : 'Confirmed preferences'"
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
            <alert-circle class="size-3.5" />
            Error
          </span>
          <span
            v-else
            class="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-500"
          >
            <check class="size-3.5" />
            Saved
          </span>
        </div>
        <hr class="border-border" />
      </template>

      <!-- Content -->
      <div :class="cn('flex flex-col gap-4 px-5', props.title ? 'py-6' : 'py-2')">
        <template v-for="(section, sectionIndex) in state.sections" :key="sectionIndex">
          <fieldset v-if="section.heading" class="flex flex-col">
            <legend class="pb-1 text-xs tracking-widest text-muted-foreground uppercase">
              {{ section.heading }}
            </legend>
            <div class="flex flex-col">
              <template v-for="(item, itemIndex) in section.items" :key="item.id">
                <hr v-if="itemIndex > 0" class="my-1 border-border" />
                <div class="flex items-start justify-between gap-4 py-3">
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
                      class="size-3.5 text-destructive"
                    />
                    <check
                      v-else-if="!state.hasErrors"
                      class="size-3.5 text-emerald-600 dark:text-emerald-500"
                    />
                  </div>
                </div>
              </template>
            </div>
          </fieldset>
          <div v-else class="flex flex-col">
            <template v-for="(item, itemIndex) in section.items" :key="item.id">
              <hr
                v-if="itemIndex > 0"
                class="my-1 border-border"
              />
              <div
                :class="cn(
                  'flex items-start justify-between gap-4',
                  itemIndex === 0 && !props.title ? 'pt-0 pb-3' : 'py-3'
                )"
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
                    class="size-3.5 text-destructive"
                  />
                  <check
                    v-else-if="!state.hasErrors"
                    class="size-3.5 text-emerald-600 dark:text-emerald-500"
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
          <fieldset v-if="section.heading" class="flex flex-col">
            <legend class="pb-1 text-xs tracking-widest text-muted-foreground uppercase">
              {{ section.heading }}
            </legend>
            <div class="flex flex-col">
              <template v-for="(item, itemIndex) in section.items" :key="item.id">
                <hr v-if="itemIndex > 0" class="my-1 border-border" />
                <div
                  :class="cn(
                    'flex items-start justify-between gap-4',
                    'py-3',
                    item.type !== 'switch' && 'flex-col gap-3 @sm/preferences-panel:flex-row @sm/preferences-panel:gap-4'
                  )"
                >
                  <div class="flex flex-col gap-1">
                    <label
                      :for="`preference-${item.id}`"
                      class="leading-6 font-medium text-pretty"
                    >
                      {{ item.label }}
                    </label>
                    <p
                      v-if="item.description"
                      class="text-sm font-normal text-pretty text-muted-foreground"
                    >
                      {{ item.description }}
                    </p>
                  </div>
                  <div class="flex shrink-0">
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
                      class="flex items-center gap-1"
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
                  </div>
                </div>
              </template>
            </div>
          </fieldset>
          <div v-else class="flex flex-col">
            <template v-for="(item, itemIndex) in section.items" :key="item.id">
              <hr
                v-if="itemIndex > 0"
                class="my-1 border-border"
              />
              <div
                :class="cn(
                  'flex items-start justify-between gap-4',
                  itemIndex === 0 && !props.title ? 'pt-0 pb-3' : 'py-3',
                  item.type !== 'switch' && 'flex-col gap-3 @sm/preferences-panel:flex-row @sm/preferences-panel:gap-4'
                )"
              >
                <div class="flex flex-col gap-1">
                  <label
                    :for="`preference-${item.id}`"
                    class="leading-6 font-medium text-pretty"
                  >
                    {{ item.label }}
                  </label>
                  <p
                    v-if="item.description"
                    class="text-sm font-normal text-pretty text-muted-foreground"
                  >
                    {{ item.description }}
                  </p>
                </div>
                <div class="flex shrink-0">
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
                    class="flex items-center gap-1"
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
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>

    <!-- Actions -->
    <div v-if="state.normalizedActions" class="@container/actions">
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
