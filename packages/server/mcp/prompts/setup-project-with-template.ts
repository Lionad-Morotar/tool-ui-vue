import { z } from 'zod'
import type { PromptDefinition } from '../../src/types.js'
import { readDocumentationPage } from '../../src/utils.js'

const argsSchema = z.object({
  framework: z.string().optional().describe('Target framework (e.g., vue, nuxt)'),
})

const prompt: PromptDefinition<typeof argsSchema> = {
  name: 'setup_project_with_template',
  description: 'Get guided setup instructions for integrating tool-ui-vue into a project',
  argsSchema,
  handler({ framework }) {
    const readme = readDocumentationPage('/README.md') || ''
    const stack = readDocumentationPage('/.planning/codebase/STACK.md') || ''

    return {
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Help me set up tool-ui-vue in a ${framework || 'Vue'} project.\n\nProject README:\n${readme.slice(0, 3000)}\n\nStack Documentation:\n${stack.slice(0, 3000)}\n\nProvide step-by-step installation and integration instructions.`,
          },
        },
      ],
    }
  },
}

export default prompt
