import LinkedInPost from './cmpts/linkedin-post.vue'
export { LinkedInPost }
export default LinkedInPost

export type { LinkedInPostProps, LinkedInPostData, LinkedInPostAuthor, LinkedInPostMedia, LinkedInPostLinkPreview, LinkedInPostStats } from './schema';
export { SerializableLinkedInPostSchema, LinkedInPostAuthorSchema, LinkedInPostMediaSchema, LinkedInPostLinkPreviewSchema, LinkedInPostStatsSchema, parseSerializableLinkedInPost, safeParseSerializableLinkedInPost } from './schema';
