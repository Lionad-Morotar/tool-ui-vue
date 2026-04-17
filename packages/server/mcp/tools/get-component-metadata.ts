import { z } from 'zod'
import type { ToolDefinition } from '../../src/types.js'
import { findComponent } from '../../src/data.js'
import { extractPropsFromInterface } from '../../src/utils.js'

const inputSchema = z.object({
  componentName: z.string().describe('The name of the component (PascalCase)'),
})

const tool: ToolDefinition<typeof inputSchema> = {
  name: 'get_component_metadata',
  description: 'Retrieves detailed metadata for a component including props, exported schemas, types, and state composables. Lightweight, no full documentation content.',
  inputSchema,
  handler({ componentName }) {
    const c = findComponent(componentName)
    if (!c) {
      throw new Error(`Component '${componentName}' not found`)
    }

    const props = c.schemaContent ? extractPropsFromInterface(c.schemaContent) : []

    // 从 schemaExports 中分类 schema、type、parser
    const schemas = c.schemaExports.filter((n) => n.endsWith('Schema'))
    const types = c.schemaExports.filter((n) => !n.endsWith('Schema') && !n.startsWith('parse') && !n.startsWith('safeParse'))
    const parsers = c.schemaExports.filter((n) => n.startsWith('parse') || n.startsWith('safeParse'))

    return {
      name: c.name,
      description: c.description || undefined,
      props,
      schemas,
      types,
      parsers,
      stateComposables: c.stateExports.filter((n) => n.startsWith('use')),
      hasI18n: c.hasI18n,
    }
  },
}

export default tool
