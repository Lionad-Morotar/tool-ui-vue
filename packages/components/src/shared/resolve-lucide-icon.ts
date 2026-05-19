import { defineAsyncComponent, defineComponent, h, type Component } from 'vue';

const iconCache = new Map<string, Component>();

function kebabToPascalCase(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/** Fallback component that renders the first character of the icon name */
function createFallbackComponent(text: string): Component {
  return defineComponent({
    setup() {
      return () => h('span', { class: 'text-xs' }, text.charAt(0).toUpperCase());
    },
  });
}

/**
 * Resolve an icon name to a Vue component.
 *
 * Supports the "lucide:xxx" prefix (e.g. "lucide:settings").
 * Plain names are also treated as Lucide icons.
 *
 * Uses async loading so unused icons are never bundled.
 * If the icon is not found, renders the first character as fallback.
 */
export function resolveLucideIcon(iconName: string | undefined): Component | null {
  if (!iconName) return null;

  const raw = iconName.startsWith('lucide:') ? iconName.slice(7) : iconName;
  const pascalName = kebabToPascalCase(raw);

  const cached = iconCache.get(pascalName);
  if (cached) return cached;

  const asyncIcon = defineAsyncComponent({
    loader: async () => {
      const lucide = await import('lucide-vue-next');
      const Icon = (lucide.icons as Record<string, unknown>)[pascalName];
      if (!Icon) {
        return createFallbackComponent(raw);
      }
      return Icon as Component;
    },
  });

  iconCache.set(pascalName, asyncIcon);
  return asyncIcon;
}
