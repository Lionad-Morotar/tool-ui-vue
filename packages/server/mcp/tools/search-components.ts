import { z } from 'zod'
import { componentData } from '../../src/data.js'
import type { ToolDefinition } from '../../src/types.js'

const inputSchema = z.object({
  search: z.string().optional().describe('Search term to filter components by name or description'),
})

const tool: ToolDefinition<typeof inputSchema> = {
  name: 'search_components',
  description: 'Search components by name or description. With no params, lists all components.',
  inputSchema,
  handler({ search }) {
    let results = componentData.map((c) => ({
      name: c.name,
      description: c.description || undefined,
      hasSchema: !!c.schemaContent,
      hasTests: !!c.testsContent,
      hasStates: !!c.statesContent,
      hasI18n: c.hasI18n,
    }))

    if (search) {
      const s = search.toLowerCase()
      results = results.filter(
        (c) => c.name.toLowerCase().includes(s) || (c.description?.toLowerCase() || '').includes(s)
      )
    }

    return {
      components: results.sort((a, b) => a.name.localeCompare(b.name)),
      total: results.length,
    }
  },
}

export default tool
