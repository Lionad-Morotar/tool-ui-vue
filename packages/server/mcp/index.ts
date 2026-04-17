#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

// Tools
import searchComponents from './tools/search-components.js'
import searchComposables from './tools/search-composables.js'
import searchDocumentation from './tools/search-documentation.js'
import searchIcons from './tools/search-icons.js'
import getComponent from './tools/get-component.js'
import getComponentMetadata from './tools/get-component-metadata.js'
import getDocumentationPage from './tools/get-documentation-page.js'
import getExample from './tools/get-example.js'
import listExamples from './tools/list-examples.js'

// Resources
import resourceComponents from './resources/components.js'
import resourceComposables from './resources/composables.js'
import resourceDocumentationPages from './resources/documentation-pages.js'
import resourceExamples from './resources/examples.js'

// Prompts
import promptFindComponent from './prompts/find-component-for-usecase.js'
import promptImplementComponent from './prompts/implement-component-with-props.js'
import promptSetupProject from './prompts/setup-project-with-template.js'

const server = new McpServer({
  name: 'tool-ui-vue-mcp-server',
  version: '0.1.0',
})

const tools = [
  searchComponents,
  searchComposables,
  searchDocumentation,
  searchIcons,
  getComponent,
  getComponentMetadata,
  getDocumentationPage,
  getExample,
  listExamples,
]

for (const t of tools) {
  server.registerTool(
    t.name,
    { description: t.description, inputSchema: t.inputSchema as any },
    async (args: unknown) => {
      const result = await (t.handler as any)(args)
      const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2)
      return { content: [{ type: 'text' as const, text }] }
    }
  )
}

const resources = [
  resourceComponents,
  resourceComposables,
  resourceDocumentationPages,
  resourceExamples,
]

for (const r of resources) {
  server.registerResource(
    r.uri,
    r.uri,
    { description: r.description },
    async () => await (r.handler as any)()
  )
}

const prompts = [
  promptFindComponent,
  promptImplementComponent,
  promptSetupProject,
]

for (const p of prompts) {
  server.registerPrompt(
    p.name,
    { description: p.description, argsSchema: p.argsSchema as any },
    async (args: unknown) => await (p.handler as any)(args)
  )
}

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('tool-ui-vue MCP server running on stdio')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
