import { h } from 'vue';
import PreferencesPanelRoot from './index.vue';
import type { PreferencesPanelReceiptProps } from './schema'

export type { PreferencesPanelProps, PreferencesPanelReceiptProps, SerializablePreferencesPanel, SerializablePreferencesPanelReceipt, PreferencesValue, PreferenceItem, PreferenceSection } from './schema'
export { SerializablePreferencesPanelSchema, SerializablePreferencesPanelReceiptSchema, parseSerializablePreferencesPanel, safeParseSerializablePreferencesPanel, parseSerializablePreferencesPanelReceipt, safeParseSerializablePreferencesPanelReceipt } from './schema'

// Receipt variant wrapper (compound component pattern matching React)
function PreferencesPanelReceipt(props: PreferencesPanelReceiptProps) {
  return h(PreferencesPanelRoot, { ...props, choice: props.choice });
}

// Attach sub-components
const PreferencesPanel = Object.assign(PreferencesPanelRoot, {
  Receipt: PreferencesPanelReceipt,
});

export { PreferencesPanel }
export default PreferencesPanel;
