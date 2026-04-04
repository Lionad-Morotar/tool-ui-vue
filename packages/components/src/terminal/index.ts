import Terminal from './index.vue'
export { Terminal }
export default Terminal

export type { TerminalProps, SerializableTerminal } from './schema'

export {
  TerminalPropsSchema,
  SerializableTerminalSchema,
  parseSerializableTerminal,
  safeParseSerializableTerminal,
} from './schema'
