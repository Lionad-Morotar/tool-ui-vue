<script setup lang="ts">
import { reactive } from 'vue';
import { ItemCarousel, ItemCard } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const withMultipleActionVariants = useStoryLocale('variant.key6', messages)
const itemCardStandalone = useStoryLocale('data.itemCard', messages)
const actionVariantsTitle = useStoryLocale('variant.key19', messages)
const primaryAction = useStoryLocale('variant.key25', messages)
const secondaryAction = useStoryLocale('variant.key26', messages)
const outlineAction = useStoryLocale('variant.key27', messages)
const deleteAction = useStoryLocale('variant.key28', messages)
const ghostAction2 = useStoryLocale('variant.key29', messages)
const disabledAction = useStoryLocale('variant.key30', messages)
const primaryActionLabel = useStoryLocale('content.key31', messages)
const secondaryActionLabel = useStoryLocale('content.key32', messages)
const outlineActionLabel = useStoryLocale('content.key33', messages)
const destructiveActionLabel = useStoryLocale('content.key34', messages)
const ghostActionLabel = useStoryLocale('content.key35', messages)
const disabledActionLabel = useStoryLocale('content.key36', messages)
const defaultStyle = useStoryLocale('variant.key37', messages)
const secondaryStyle = useStoryLocale('variant.key38', messages)
const outlineStyle = useStoryLocale('variant.key39', messages)
const destructiveStyle = useStoryLocale('variant.key40', messages)
const ghostStyle = useStoryLocale('variant.key41', messages)
const disabledState = useStoryLocale('variant.key42', messages)
const standaloneCardName = useStoryLocale('variant.key62', messages)
const standaloneCardSubtitle = useStoryLocale('content.key63', messages)
const colorBgName = useStoryLocale('variant.key64', messages)
const colorBgSubtitle = useStoryLocale('content.key65', messages)
const interactiveCardName = useStoryLocale('variant.key66', messages)
const interactiveCardSubtitle = useStoryLocale('content.key67', messages)
const withActionsCardName = useStoryLocale('variant.key68', messages)
const withActionsCardSubtitle = useStoryLocale('content.key69', messages)
const viewAction = useStoryLocale('variant.key70', messages)
const buyAction = useStoryLocale('variant.key71', messages)

const carouselState = reactive({
  selectedItem: null as string | null,
  currentSlide: 0,
  actionLog: [] as string[],
});

function handleItemClick(itemId: string) {
  carouselState.selectedItem = itemId;
  carouselState.actionLog.push(`Clicked item: ${itemId}`);
  setTimeout(() => {
    carouselState.selectedItem = null;
  }, 2000);
}

function handleItemAction(itemId: string, actionId: string) {
  carouselState.actionLog.push(`Action "${actionId}" on item: ${itemId}`);
}
</script>

<template>
  <Story title="ItemCarousel/Actions">
    <Variant :title="withMultipleActionVariants">
      <div class="w-full max-w-2xl">
        <item-carousel
          id="carousel-action-variants"
          :title="actionVariantsTitle"
          :items="[
            { id: '1', name: primaryActionLabel, subtitle: defaultStyle, color: '#3b82f6', actions: [{ id: 'action', label: primaryAction }] },
            { id: '2', name: secondaryActionLabel, subtitle: secondaryStyle, color: '#10b981', actions: [{ id: 'action', label: secondaryAction, variant: 'secondary' }] },
            { id: '3', name: outlineActionLabel, subtitle: outlineStyle, color: '#f59e0b', actions: [{ id: 'action', label: outlineAction, variant: 'outline' }] },
            { id: '4', name: destructiveActionLabel, subtitle: destructiveStyle, color: '#ef4444', actions: [{ id: 'action', label: deleteAction, variant: 'destructive' }] },
            { id: '5', name: ghostActionLabel, subtitle: ghostStyle, color: '#6b7280', actions: [{ id: 'action', label: ghostAction2, variant: 'ghost' }] },
            { id: '6', name: disabledActionLabel, subtitle: disabledState, color: '#9ca3af', actions: [{ id: 'action', label: disabledAction, disabled: true }] },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="itemCardStandalone">
      <div class="flex flex-wrap gap-4 p-4">
        <div class="w-52">
          <item-card
            :item="{ id: '1', name: standaloneCardName, subtitle: standaloneCardSubtitle, image: 'https://picsum.photos/200/150?random=80' }"
            :interactive="false"
          />
        </div>
        <div class="w-52">
          <item-card
            :item="{ id: '2', name: colorBgName, subtitle: colorBgSubtitle, color: '#8b5cf6' }"
            :interactive="false"
          />
        </div>
        <div class="w-52">
          <item-card
            :item="{ id: '3', name: interactiveCardName, subtitle: interactiveCardSubtitle, image: 'https://picsum.photos/200/150?random=81', color: '#10b981' }"
            :interactive="true"
            @item-click="handleItemClick"
          />
        </div>
        <div class="w-52">
          <item-card
            :item="{ id: '4', name: withActionsCardName, subtitle: withActionsCardSubtitle, color: '#f59e0b', actions: [{ id: 'view', label: viewAction }, { id: 'buy', label: buyAction }] }"
            :interactive="false"
            @item-action="handleItemAction"
          />
        </div>
      </div>
    </Variant>
  </Story>
</template>
