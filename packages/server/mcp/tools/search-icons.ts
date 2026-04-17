import { z } from 'zod'
import type { ToolDefinition } from '../../src/types.js'

const ICONIFY_SEARCH_URL = 'https://api.iconify.design/search'
const ICONIFY_SVG_URL = 'https://api.iconify.design'

const inputSchema = z.object({
  query: z.string().describe('Search term to filter icon names'),
  collection: z.string().optional().describe('Icon collection prefix to search within (default: lucide). Examples: lucide, heroicons, mdi, tabler, ph'),
  limit: z.number().min(1).max(64).optional().describe('Maximum number of results (default: 16)'),
})

interface IconResult {
  name: string
  preview: string
}

async function searchIconify(query: string, prefix: string, limit: number): Promise<IconResult[]> {
  const url = new URL(ICONIFY_SEARCH_URL)
  url.searchParams.set('query', query)
  url.searchParams.set('prefix', prefix)
  url.searchParams.set('limit', String(limit))

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`Iconify search failed: ${res.status} ${res.statusText}`)
  }

  const data = await res.json() as { icons: string[]; total: number }
  return (data.icons || []).map((iconId: string) => {
    const [coll, name] = iconId.split(':')
    return {
      name: `i-${coll}-${name}`,
      preview: `${ICONIFY_SVG_URL}/${coll}/${name}.svg`,
    }
  })
}

const tool: ToolDefinition<typeof inputSchema> = {
  name: 'search_icons',
  description:
    'Search for icons using the Iconify API. Supports all Iconify collections (lucide, heroicons, mdi, tabler, ph, etc). Returns icon names in i-{prefix}-{name} format with SVG preview URLs.',
  inputSchema,
  async handler({ query, collection, limit }) {
    const prefix = collection || 'lucide'
    const max = limit || 16

    try {
      const icons = await searchIconify(query, prefix, max)
      return { icons, total: icons.length }
    } catch (err: any) {
      return {
        icons: [],
        total: 0,
        error: `Iconify API error: ${err.message}`,
      }
    }
  },
}

export default tool
