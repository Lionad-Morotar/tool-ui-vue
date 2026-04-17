import { z } from 'zod'
import type { ToolDefinition } from '../../src/types.js'
import { findComponent } from '../../src/data.js'

const inputSchema = z.object({
  componentName: z.string().describe('The name of the component (PascalCase)'),
  index: z.number().int().nonnegative().optional().describe('Example index (0-based). Defaults to 0.'),
})

const tool: ToolDefinition<typeof inputSchema> = {
  name: 'get_example',
  description: 'Retrieves a specific usage example for a component by index.',
  inputSchema,
  handler({ componentName, index = 0 }) {
    const c = findComponent(componentName)
    if (!c) {
      throw new Error(`Component '${componentName}' not found`)
    }

    if (!c.examples.length) {
      throw new Error(`No examples found for component '${componentName}'`)
    }

    const ex = c.examples[index]
    if (!ex) {
      throw new Error(`Example index ${index} out of range for component '${componentName}'`)
    }

    return {
      component: c.name,
      index,
      total: c.examples.length,
      example: ex,
    }
  },
}

export default tool
