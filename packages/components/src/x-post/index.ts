import XPost from './index.vue'
export { XPost }
export default XPost

export type { XPostProps, XPostData, XPostAuthor, XPostMedia, XPostLinkPreview, XPostStats } from './schema';
export { SerializableXPostSchema, XPostAuthorSchema, XPostMediaSchema, XPostLinkPreviewSchema, XPostStatsSchema, parseSerializableXPost, safeParseSerializableXPost } from './schema';
