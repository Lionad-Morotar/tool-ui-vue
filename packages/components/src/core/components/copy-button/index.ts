export { default as CopyButton } from './index.vue'

export interface CopyButtonProps {
  /** Text to copy to clipboard */
  value: string
  /** Button variant (from Button's variant system) */
  variant?: 'ghost' | 'outline' | 'secondary' | 'default'
  /** Button size (from Button's size system) */
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
  /** Additional CSS classes */
  class?: string
}
