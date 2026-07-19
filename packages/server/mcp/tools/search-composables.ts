import { z } from 'zod'
import { componentData } from '../../src/data.js'
import type { ToolDefinition } from '../../src/types.js'

const inputSchema = z.object({
  search: z.string().optional().describe('Search term to filter composables by name'),
})

const tool: ToolDefinition<typeof inputSchema> = {
  name: 'search_composables',
  description: 'Search headless composables exported from component states/. With no params, lists all composables.',
  inputSchema,
  handler({ search }) {
    const results: Array<{ component: string; composable: string }> = []

    for (const c of componentData) {
      for (const exp of c.stateExports) {
        if (exp.startsWith('use')) {
          if (!search || exp.toLowerCase().includes(search.toLowerCase())) {
            results.push({ component: c.name, composable: exp })
          }
        }
      }
    }

    return {
      composables: results.sort((a, b) => a.composable.localeCompare(b.composable)),
      total: results.length,
    }
  },
}

export default tool
