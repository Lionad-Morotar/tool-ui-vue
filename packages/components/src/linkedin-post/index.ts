import LinkedinPost from './cmpts/linkedin-post.vue'
export { LinkedinPost }
export default LinkedinPost

export type { LinkedInPostProps, LinkedInPostData, LinkedInPostAuthor, LinkedInPostMedia, LinkedInPostLinkPreview, LinkedInPostStats } from './schema';
export { SerializableLinkedInPostSchema, LinkedInPostAuthorSchema, LinkedInPostMediaSchema, LinkedInPostLinkPreviewSchema, LinkedInPostStatsSchema, parseSerializableLinkedInPost, safeParseSerializableLinkedInPost } from './schema';
