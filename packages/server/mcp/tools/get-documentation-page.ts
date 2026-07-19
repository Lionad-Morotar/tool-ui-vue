import { z } from 'zod'
import { readDocumentationPage } from '../../src/utils.js'
import type { ToolDefinition } from '../../src/types.js'

const inputSchema = z.object({
  path: z.string().describe('The path to the documentation page (e.g., /README.md or /.planning/codebase/STACK.md)'),
})

const tool: ToolDefinition<typeof inputSchema> = {
  name: 'get_documentation_page',
  description: 'Retrieves a Histoire story page source code by path. Returns the .story.vue file content.',
  inputSchema,
  handler({ path }) {
    const content = readDocumentationPage(path)
    if (content === null) {
      throw new Error(`Story page not found at path: ${path}`)
    }
    return { content }
  },
}

export default tool
