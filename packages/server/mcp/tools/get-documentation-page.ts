import { z } from 'zod'
import type { ToolDefinition } from '../../src/types.js'
import { readDocumentationPage } from '../../src/utils.js'

const inputSchema = z.object({
  path: z.string().describe('The path to the documentation page (e.g., /README.md or /.planning/codebase/STACK.md)'),
})

const tool: ToolDefinition<typeof inputSchema> = {
  name: 'get_documentation_page',
  description: 'Retrieves documentation page content by path.',
  inputSchema,
  handler({ path }) {
    const content = readDocumentationPage(path)
    if (content === null) {
      throw new Error(`Documentation page not found at path: ${path}`)
    }
    return { content }
  },
}

export default tool
