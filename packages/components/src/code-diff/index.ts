import codediff from './index.vue'
export { codediff }
export default codediff

export type {
  CodeDiffProps,
  SerializableCodeDiff,
} from './schema';
export {
  CodeDiffPropsSchema,
  SerializableCodeDiffSchema,
  parseSerializableCodeDiff,
  safeParseSerializableCodeDiff,
} from './schema';
