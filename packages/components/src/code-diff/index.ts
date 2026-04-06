import CodeDiff from './index.vue'
export { CodeDiff }
export default CodeDiff

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
