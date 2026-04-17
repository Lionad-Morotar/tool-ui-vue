import { z } from 'zod'
import type { PromptDefinition } from '../../src/types.js'
import { findComponent } from '../../src/data.js'

const argsSchema = z.object({
  component: z.string().describe('Component name (PascalCase)'),
  intent: z.string().describe('What you want the component to render or do'),
})

const prompt: PromptDefinition<typeof argsSchema> = {
  name: 'implement_component_with_props',
  description: 'Generate a complete component payload with proper props for tool-ui-vue',
  argsSchema,
  handler({ component, intent }) {
    const c = findComponent(component)
    if (!c) {
      throw new Error(`Component '${component}' not found`)
    }

    const examples = c.examples.slice(0, 3).map((e) => JSON.stringify(e.props, null, 2)).join('\n\n')

    return {
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `You are generating a valid payload for the \`${c.name}\` component in tool-ui-vue.\n\nSchema exports: ${c.schemaExports.join(', ')}\nState exports: ${c.stateExports.join(', ')}\n\nExamples:\n${examples || '(none available)'}\n\nGiven the user intent: "${intent}", produce a valid JSON payload that matches the component's serializable schema.`,
          },
        },
      ],
    }
  },
}

export default prompt
