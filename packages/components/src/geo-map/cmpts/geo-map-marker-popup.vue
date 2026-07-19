<script setup lang="ts">
import { LTooltip, LPopup } from '@vue-leaflet/vue-leaflet';
import { cn } from '../../core';

defineOptions({ name: 'CmptGeoMapMarkerPopup', inheritAttrs: false });

const props = defineProps<{
  tooltip?: 'none' | 'hover' | 'always';
  label?: string;
  description?: string;
  tooltipClassName?: string;
  popupClassName?: string;
}>();

const tooltipMode = props.tooltip ?? 'hover';
const tooltipContent = props.label ?? props.description ?? '';
const hasPopup = Boolean(props.label || props.description);
const shouldRenderTooltip =
  tooltipMode !== 'none' && Boolean(tooltipContent);
</script>

<template>
  <l-tooltip
    v-if="shouldRenderTooltip"
    :direction="'top'"
    :permanent="tooltipMode === 'always'"
    :class-name="cn('geo-map-tooltip', tooltipClassName)"
  >
    <span class="block">{{ tooltipContent }}</span>
  </l-tooltip>

  <l-popup
    v-if="hasPopup"
    :class-name="cn('geo-map-popup', popupClassName)"
    :close-button="true"
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
  </l-popup>
</template>
