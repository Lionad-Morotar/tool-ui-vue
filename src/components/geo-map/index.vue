<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { cn } from "./_adapter";
import GeoMapEngine from "./GeoMapEngine.vue";
import styles from "./geo-map-theme.module.css";
import type { GeoMapProps, GeoMapStyle } from "./schema";

const LIGHT_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const DARK_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

const props = defineProps<GeoMapProps>();

const emit = defineEmits<{
  "marker-click": [marker: import("./schema").GeoMapMarker];
  "route-click": [route: import("./schema").GeoMapRoute];
}>();

// Theme detection
function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getDocumentTheme(): "light" | "dark" | null {
  if (typeof document === "undefined") return null;

  const root = document.documentElement;
  const dataTheme = root.getAttribute("data-theme")?.toLowerCase();
  if (dataTheme === "dark") return "dark";
  if (dataTheme === "light") return "light";
  if (root.classList.contains("dark")) return "dark";
  if (root.classList.contains("light")) return "light";

  return null;
}

const inheritedTheme = ref<"light" | "dark">(
  getDocumentTheme() ?? getSystemTheme()
);

let mql: MediaQueryList | null = null;
let observer: MutationObserver | null = null;

onMounted(() => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const update = () => {
    inheritedTheme.value = getDocumentTheme() ?? getSystemTheme();
  };

  mql = window.matchMedia?.("(prefers-color-scheme: dark)");
  mql?.addEventListener("change", update);

  observer = new MutationObserver(update);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme"],
  });
});

onUnmounted(() => {
  if (mql) {
    mql.removeEventListener("change", () => {});
  }
  observer?.disconnect();
});

// Computed values
const resolvedTheme = computed(() => props.theme ?? inheritedTheme.value);
const isMapReady = ref(false);
const tileUrl = computed(() =>
  resolvedTheme.value === "dark" ? DARK_TILE_URL : LIGHT_TILE_URL
);

const mapAriaLabel = computed(() => {
  if (props.title && props.description) {
    return `${props.title}. ${props.description}`;
  }
  return props.title ?? props.description ?? "Geographic map";
});

const resolvedRootStyle = computed<GeoMapStyle>(() => ({
  "--geo-map-canvas-bg":
    resolvedTheme.value === "dark" ? "var(--background)" : "var(--muted)",
  ...props.style,
}));

// Event handlers
function handleMarkerClick(marker: import("./schema").GeoMapMarker) {
  emit("marker-click", marker);
  props.onMarkerClick?.(marker);
}

function handleRouteClick(route: import("./schema").GeoMapRoute) {
  emit("route-click", route);
  props.onRouteClick?.(route);
}

function handleReadyChange(isReady: boolean) {
  isMapReady.value = isReady;
}
</script>

<template>
  <div
    :class="cn('w-full min-w-80', styles.root, props.className)"
    :style="resolvedRootStyle"
    data-slot="geo-map"
    :data-tool-ui-id="id"
  >
    <div
      class="bg-muted/20 border-border relative h-[320px] w-full overflow-hidden rounded-lg border"
      role="region"
      :aria-label="mapAriaLabel"
    >
      <GeoMapEngine
        :id="id"
        :markers="markers"
        :routes="routes"
        :clustering="clustering"
        :viewport="viewport"
        :show-zoom-control="showZoomControl ?? true"
        :tile-url="tileUrl"
        :map-aria-label="mapAriaLabel"
        :tooltip-class-name="tooltipClassName"
        :popup-class-name="popupClassName"
        @marker-click="handleMarkerClick"
        @route-click="handleRouteClick"
        @ready="handleReadyChange"
      />

      <!-- Title/Description Overlay -->
      <div
        v-if="title || description"
        :class="
          cn(
            'pointer-events-none absolute top-3 left-3 z-[900]',
            'max-w-[min(75%,22rem)] rounded-lg border border-border/70 bg-background/70 px-3 py-2',
            'shadow-sm backdrop-blur-md'
          )
        "
      >
        <p
          v-if="title"
          class="text-foreground text-sm leading-tight font-semibold"
        >
          {{ title }}
        </p>
        <p
          v-if="description"
          class="text-muted-foreground mt-1 text-xs leading-snug"
        >
          {{ description }}
        </p>
      </div>

      <!-- Loading State -->
      <div
        v-if="!isMapReady"
        data-slot="geo-map-loading"
        class="bg-muted/30 text-muted-foreground pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span data-slot="geo-map-loading-label">Loading map...</span>
      </div>
    </div>
  </div>
</template>
