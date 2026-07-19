import { z } from 'zod'
import { componentData, findComponent } from '../../src/data.js'
import type { ToolDefinition } from '../../src/types.js'

const inputSchema = z.object({
  component: z.string().optional().describe('Filter examples by component name (PascalCase). Omit to list all.'),
  limit: z.number().int().positive().optional().describe('Max number of examples to return'),
})

const tool: ToolDefinition<typeof inputSchema> = {
  name: 'list_examples',
  description: 'Lists all available component usage examples extracted from test files. Optionally filter by component.',
  inputSchema,
  handler({ component, limit }) {
    let results: Array<{ component: string; description?: string; props: Record<string, unknown> }> = []

    const sources = component ? [findComponent(component)].filter(Boolean) : componentData

    for (const c of sources) {
      if (!c) continue
      for (const ex of c.examples) {
        results.push({ component: c.name, ...ex })
      }
    }

    if (limit && limit < results.length) {
      results = results.slice(0, limit)
    }

    return {
      examples: results,
      total: results.length,
    }
  },
}

export default tool
