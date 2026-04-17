import { z } from 'zod'
import type { ToolDefinition } from '../../src/types.js'

const lucideIcons = [
  'home', 'user', 'users', 'settings', 'search', 'bell', 'menu', 'x', 'check', 'chevron-left',
  'chevron-right', 'chevron-down', 'chevron-up', 'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down',
  'plus', 'minus', 'trash', 'edit', 'copy', 'save', 'download', 'upload', 'share', 'link',
  'external-link', 'mail', 'message-square', 'message-circle', 'phone', 'calendar', 'clock', 'star',
  'heart', 'thumbs-up', 'thumbs-down', 'flag', 'bookmark', 'tag', 'folder', 'file', 'file-text',
  'image', 'video', 'music', 'play', 'pause', 'stop', 'skip-forward', 'skip-back', 'volume', 'volume-off',
  'mic', 'camera', 'map', 'map-pin', 'navigation', 'compass', 'globe', 'zap', 'flashlight', 'battery',
  'wifi', 'bluetooth', 'sun', 'moon', 'cloud', 'cloud-rain', 'cloud-snow', 'wind', 'thermometer',
  'alert-circle', 'alert-triangle', 'info', 'help-circle', 'shield', 'lock', 'unlock', 'key', 'eye',
  'eye-off', 'filter', 'sliders', 'list', 'grid', 'layout', 'maximize', 'minimize', 'more-horizontal',
  'more-vertical', 'refresh-cw', 'rotate-ccw', 'undo', 'redo', 'scissors', 'paperclip', 'inbox',
  'send', 'archive', 'trash-2', 'log-in', 'log-out', 'user-plus', 'user-minus', 'user-check',
  'shopping-cart', 'credit-card', 'dollar-sign', 'euro', 'pound-sterling', 'bitcoin', 'bar-chart',
  'pie-chart', 'activity', 'trending-up', 'trending-down', 'layers', 'code', 'terminal', 'github',
  'gitlab', 'twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'slack', 'trello', 'figma',
  'chrome', 'framer', 'aperture', 'anchor', 'award', 'briefcase', 'cpu', 'database', 'disc',
  'feather', 'gift', 'hash', 'loader', 'package', 'pen-tool', 'printer', 'rss', 'scissors',
  'server', 'tool', 'truck', 'umbrella', 'watch', 'anchor', 'box', 'circle', 'hexagon', 'octagon',
  'square', 'triangle', 'diamond', 'asterisk', 'at-sign', 'command', 'option', 'shift', 'control',
  'space', 'tab', 'caps-lock', 'backspace', 'delete', 'enter', 'escape', 'arrow-big-left',
  'arrow-big-right', 'arrow-big-up', 'arrow-big-down', 'caret-left', 'caret-right', 'caret-up',
  'caret-down', 'first-aid', 'pill', 'stethoscope', 'syringe', 'thermometer-snowflake',
  'thermometer-sun', 'brain', 'heart-pulse', 'activity', 'dna', 'microscope', 'rocket',
  'plane', 'train', 'car', 'bus', 'ship', 'bike', 'walk', 'run', 'swim', 'ski', 'snowboard',
  'anchor', 'anchor', 'life-buoy', 'sailboat', 'fuel', 'gauge', 'wrench', 'hammer', 'construction',
  'factory', 'warehouse', 'store', 'hotel', 'school', 'university', 'bank', 'landmark', 'church',
  'mosque', 'synagogue', 'temple', 'castle', 'monument', 'mountain', 'tree-pine', 'tree-deciduous',
  'flower', 'leaf', 'sprout', 'recycle', 'trash', 'zap-off', 'flame', 'droplet', 'snowflake',
  'tornado', 'hurricane', 'earthquake', 'flood', 'tsunami', 'volcano', 'asterisk', 'infinity',
  'sigma', 'pi', 'omega', 'alpha', 'beta', 'gamma', 'delta', 'lambda', 'psi', 'phi',
]

const inputSchema = z.object({
  query: z.string().describe('Search term to filter icon names'),
  collection: z.string().optional().describe('Icon collection to search within (default: lucide)'),
})

const tool: ToolDefinition<typeof inputSchema> = {
  name: 'search_icons',
  description: 'Search for icons across Iconify collections. Defaults to lucide. Returns icon names in the i-{prefix}-{name} format used by the project.',
  inputSchema,
  handler({ query, collection }) {
    const coll = collection || 'lucide'
    if (coll !== 'lucide') {
      return {
        icons: [],
        total: 0,
        note: `Collection "${coll}" is not available. Only "lucide" is supported.`,
      }
    }

    const q = query.toLowerCase()
    const matches = lucideIcons.filter((name) => name.includes(q))
    return {
      icons: matches.map((name) => `i-${coll}-${name}`),
      total: matches.length,
    }
  },
}

export default tool
