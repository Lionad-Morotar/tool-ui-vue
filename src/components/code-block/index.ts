export { default as CodeBlock } from './index.vue';
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
