<script setup lang="ts">
import { cn } from '../core';
import { useI18n } from '../core/i18n';
import { reactive } from 'vue';
import { useOptionList } from './states';
import type { OptionListProps, OptionListSelection } from './schema';

defineOptions({ name: 'CmptOptionList', inheritAttrs: false })

const props = withDefaults(defineProps<OptionListProps & { modelValue?: OptionListSelection }>(), {
  css: () => ({})
})

const emit = defineEmits<{
  change: [value: OptionListSelection];
  action: [actionId: string, value: OptionListSelection];
  'update:modelValue': [value: OptionListSelection];
}>()

// i18n
const { t } = useI18n();

// All business logic delegated to states layer
const state = reactive(useOptionList(props, emit));
</script>

<template>
  <!-- Receipt view -->
  <div
    v-if="state.isReceipt"
    v-bind="$attrs"
    :class="
      cn(
        '@container/option-list flex w-full max-w-md min-w-80 flex-col',
        'text-foreground',
        'motion-safe:animate-in motion-safe:fade-in motion-safe:blur-in-sm motion-safe:zoom-in-95 motion-safe:fill-mode-both motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]',
        props.css?.root,
      )
    "
    data-slot="option-list"
    :data-tool-ui-id="props.id"
    data-receipt="true"
    role="status"
    :aria-label="t('optionList.selected').value"
  >
    <div class="flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card/60 px-5 py-2.5 shadow-xs">
      <template v-for="(option, index) in state.selectedOptions" :key="option.id">
        <div class="flex items-start gap-3 py-1">
          <span class="flex h-6 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4 shrink-0 text-primary"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <span v-if="option.icon" class="flex h-6 items-center">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
              <component
                :is="state.getIconComponent(option.icon)"
                v-if="state.getIconComponent(option.icon)"
                class="size-4"
              />
              <span v-else class="text-xs">{{ option.icon.charAt(0).toUpperCase() }}</span>
            </span>
          </span>
          <div class="flex flex-col text-left">
            <span class="text-base leading-6 font-medium text-pretty @md/option-list:text-sm">{{ option.label }}</span>
            <span v-if="option.description" class="text-sm font-normal text-pretty text-muted-foreground">
              {{ option.description }}
            </span>
          </div>
        </div>
        <hr v-if="index < state.selectedOptions.length - 1" class="my-1.5 border-border" />
      </template>
    </div>
  </div>

  <!-- Interactive view -->
  <div
    v-else
    v-bind="$attrs"
    :class="
      cn(
        '@container/option-list flex w-full max-w-md min-w-80 flex-col gap-3',
        'text-foreground',
        props.css?.root,
      )
    "
    data-slot="option-list"
    :data-tool-ui-id="props.id"
    role="group"
    aria-label="Option list"
  >
    <div
      :class="cn(
        'group/list flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card px-4 py-1.5 shadow-xs',
      )"
      role="listbox"
      :aria-multiselectable="state.resolvedSelectionMode === 'multi'"
      @keydown="state.handleListboxKeyDown"
    >
      <template v-for="(option, index) in props.options" :key="option.id">
        <hr
          v-if="index > 0"
          class="border-border transition-opacity [@media(hover:hover)]:[&:has(+_:hover)]:opacity-0 [@media(hover:hover)]:[.peer:hover+&]:opacity-0"
        />
        <button
          :ref="(el) => { if (el) state.optionRefs[index] = el as HTMLButtonElement }"
          type="button"
          :data-id="option.id"
          :class="
            cn(
              'peer group relative h-auto min-h-12 w-full justify-start text-left text-base font-medium',
              'rounded-none border-0 bg-transparent px-0 py-2 shadow-none transition-none hover:bg-transparent! @md/option-list:text-sm',
              index === 0 && 'pb-2.5',
              index > 0 && index < props.options.length - 1 && 'py-2.5',
              props.css?.item,
            )
          "
          :aria-selected="state.getOptionState(option).isSelected"
          :disabled="state.getOptionState(option).isDisabled"
          :tabindex="index === state.activeIndex ? 0 : -1"
          role="option"
          @click="state.handleOptionClick(option)"
          @focus="state.activeIndex = index"
        >
          <span
            :class="cn(
              'absolute inset-0 -mx-3 -my-0.5 rounded-xl bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100',
            )"
          />
          <div class="relative flex items-start gap-3">
            <!-- Selection indicator -->
            <span class="flex h-6 items-center">
              <span
                :class="
                  cn(
                    'flex size-4 shrink-0 items-center justify-center border-2 transition-colors',
                    state.resolvedSelectionMode === 'single' ? 'rounded-full' : 'rounded',
                    state.getOptionState(option).isSelected
                      ? 'motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 border-primary bg-primary text-primary-foreground motion-safe:duration-300 motion-safe:ease-out'
                      : 'border-muted-foreground/50',
                    state.getOptionState(option).isDisabled ? 'opacity-50' : undefined,
                  )
                "
              >
                <svg
                  v-if="state.resolvedSelectionMode === 'multi' && state.getOptionState(option).isSelected"
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:fill-mode-both motion-safe:delay-75 motion-safe:duration-200"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span
                  v-if="state.resolvedSelectionMode === 'single' && state.getOptionState(option).isSelected"
                  class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 size-2 rounded-full bg-current motion-safe:duration-300 motion-safe:ease-out"
                />
              </span>
            </span>

            <!-- Icon (if provided) -->
            <span v-if="option.icon" class="flex h-6 items-center">
              <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <component
                  :is="state.getIconComponent(option.icon)"
                  v-if="state.getIconComponent(option.icon)"
                  class="size-4"
                />
                <span v-else class="text-xs">{{ option.icon.charAt(0).toUpperCase() }}</span>
              </span>
            </span>

            <!-- Content -->
            <div class="flex flex-col text-left">
              <span class="leading-6 text-pretty">{{ option.label }}</span>
              <span
                v-if="option.description"
                class="text-sm font-normal text-pretty text-muted-foreground"
              >
                {{ option.description }}
              </span>
            </div>
          </div>
        </button>
      </template>
    </div>

    <!-- Actions -->
    <div class="@container/actions">
      <div
        :class="cn(
          'flex w-full flex-col gap-3',
          state.normalizedActions.align === 'left' ? 'flex-col @[240px]/actions:flex-row @[240px]/actions:flex-wrap @[240px]/actions:items-center @[240px]/actions:justify-start @[240px]/actions:gap-2' :
          state.normalizedActions.align === 'center' ? 'flex-col @[240px]/actions:flex-row @[240px]/actions:flex-wrap @[240px]/actions:items-center @[240px]/actions:justify-center @[240px]/actions:gap-2' :
          'flex-col @[240px]/actions:flex-row @[240px]/actions:flex-wrap @[240px]/actions:items-center @[240px]/actions:justify-end @[240px]/actions:gap-2',
          props.css?.actions,
        )"
      >
        <button
          v-for="action in state.actionsWithDisabledState"
          :key="action.id"
          type="button"
          :class="cn(
            'inline-flex items-center justify-center rounded-full px-4 text-base font-medium transition-colors',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
            'disabled:pointer-events-none disabled:opacity-50',
            'min-h-11 w-full text-base',
            '@[240px]/actions:min-h-0 @[240px]/actions:w-auto @[240px]/actions:px-3 @[240px]/actions:py-2 @[240px]/actions:text-sm',
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
  </div>
</template>
