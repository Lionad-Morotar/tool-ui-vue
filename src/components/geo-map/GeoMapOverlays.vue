<script setup lang="ts">
import { ref, computed } from "vue";
import { LPopup, LTooltip } from "@vue-leaflet/vue-leaflet";
import { cn } from "./_adapter";

const props = defineProps<{
  tooltipMode: "none" | "hover" | "always";
  tooltipContent?: string;
  label?: string;
  description?: string;
  tooltipClassName?: string;
  popupClassName?: string;
}>();

const hasPopup = computed(() => Boolean(props.label || props.description));
const isPopupOpen = ref(false);

const shouldRenderTooltip = computed(() => {
  return (
    props.tooltipMode !== "none" &&
    props.tooltipContent &&
    (!hasPopup.value || !isPopupOpen.value)
  );
});

function handlePopupOpen() {
  isPopupOpen.value = true;
}

function handlePopupClose() {
  isPopupOpen.value = false;
}
</script>

<template>
  <LTooltip
    v-if="shouldRenderTooltip"
    :direction="'top'"
    :permanent="tooltipMode === 'always'"
    :class-name="cn('geo-map-tooltip', tooltipClassName)"
  >
    <span class="block">{{ tooltipContent }}</span>
  </LTooltip>

  <LPopup
    v-if="hasPopup"
    :class-name="cn('geo-map-popup', popupClassName)"
    :close-button="true"
    @ready="handlePopupOpen"
    @update:visible="(visible: boolean) => {
      if (!visible) handlePopupClose();
    }"
  >
    <div class="flex flex-col gap-0.5">
      <p
        v-if="label"
        class="block text-sm leading-tight font-semibold tracking-tight text-foreground"
      >
        {{ label }}
      </p>
      <p
        v-if="description"
        class="block text-xs leading-relaxed text-muted-foreground"
      >
        {{ description }}
      </p>
    </div>
  </LPopup>
</template>
