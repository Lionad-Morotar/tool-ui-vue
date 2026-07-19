import { z } from 'zod'
import { findComponent } from '../../src/data.js'
import { extractPropsFromInterface } from '../../src/utils.js'
import type { ToolDefinition } from '../../src/types.js'

const inputSchema = z.object({
  componentName: z.string().describe('The name of the component (PascalCase)'),
})

const tool: ToolDefinition<typeof inputSchema> = {
  name: 'get_component',
  description: 'Retrieves component documentation and details, including schema, props, Vue template, and usage examples.',
  inputSchema,
  handler({ componentName }) {
    const c = findComponent(componentName)
    if (!c) {
      throw new Error(`Component '${componentName}' not found`)
    }

    const props = c.schemaContent ? extractPropsFromInterface(c.schemaContent) : []

    return {
      name: c.name,
      description: c.description || undefined,
      hasSchema: !!c.schemaContent,
      hasTests: !!c.testsContent,
      hasStates: !!c.statesContent,
      hasI18n: c.hasI18n,
      props,
      schema: c.schemaContent || undefined,
      vueTemplate: c.vueContent || undefined,
      examples: c.examples,
      stateExports: c.stateExports,
      schemaExports: c.schemaExports,
    }
  },
}

export default tool
