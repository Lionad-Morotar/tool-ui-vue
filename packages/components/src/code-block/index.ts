import CodeBlock from './index.vue'
export { CodeBlock }
export default CodeBlock

export type {
  CodeBlockProps,
  SerializableCodeBlock,
  CodeBlockLineNumbersMode,
} from './schema';
export {
  CodeBlockPropsSchema,
  SerializableCodeBlockSchema,
  parseSerializableCodeBlock,
  safeParseSerializableCodeBlock,
} from './schema';
