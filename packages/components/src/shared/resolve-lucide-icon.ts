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
      // The `icons` map only carries canonical names — lucide v1 renamed a
      // batch of icons (file-edit → file-pen, bar-chart-3 → chart-column, …)
      // and kept old names alive solely as named-export aliases, so fall
      // back to the module namespace before giving up.
      const icon = (lucide.icons as Record<string, unknown>)[pascalName] ?? (lucide as unknown as Record<string, unknown>)[pascalName];
      if (!icon) {
        console.warn(
          `[vtu-components] Unknown lucide icon "${iconName}" (resolved as ${pascalName}); rendering a first-letter fallback.`
        );
        return createFallbackComponent(raw);
      }
      return icon as Component;
    },
  });

  iconCache.set(pascalName, asyncIcon);
  return asyncIcon;
}
