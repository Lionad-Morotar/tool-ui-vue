import instagrampost from './index.vue'
export { instagrampost }
export default instagrampost

export type { InstagramPostProps, InstagramPostData, InstagramPostAuthor, InstagramPostMedia, InstagramPostStats } from './schema';
export { SerializableInstagramPostSchema, InstagramPostAuthorSchema, InstagramPostMediaSchema, InstagramPostStatsSchema, parseSerializableInstagramPost, safeParseSerializableInstagramPost } from './schema';
