import xpost from './index.vue'
export { xpost }
export default xpost

export type { XPostProps, XPostData, XPostAuthor, XPostMedia, XPostLinkPreview, XPostStats } from './schema';
export { SerializableXPostSchema, XPostAuthorSchema, XPostMediaSchema, XPostLinkPreviewSchema, XPostStatsSchema, parseSerializableXPost, safeParseSerializableXPost } from './schema';
