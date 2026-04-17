import { z } from 'zod'
import type { PromptDefinition } from '../../src/types.js'
import { componentData } from '../../src/data.js'

const argsSchema = z.object({
  usecase: z.string().describe('Describe what you want to build'),
})

const prompt: PromptDefinition<typeof argsSchema> = {
  name: 'find_component_for_usecase',
  description: 'Find the best tool-ui-vue component for a specific use case',
  argsSchema,
  handler({ usecase }) {
    const components = componentData.map((c) => ({
      name: c.name,
      description: c.description || '',
      hasSchema: !!c.schemaContent,
      hasTests: !!c.testsContent,
      hasStates: !!c.statesContent,
    }))

    return {
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Help me find the best tool-ui-vue component for this use case: "${usecase}".\n\nHere are all available components:\n${JSON.stringify(components, null, 2)}`,
          },
        },
      ],
    }
  },
}

export default prompt
