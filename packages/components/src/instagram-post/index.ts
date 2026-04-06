import InstagramPost from './index.vue'
export { InstagramPost }
export default InstagramPost

export type { InstagramPostProps, InstagramPostData, InstagramPostAuthor, InstagramPostMedia, InstagramPostStats } from './schema';
export { SerializableInstagramPostSchema, InstagramPostAuthorSchema, InstagramPostMediaSchema, InstagramPostStatsSchema, parseSerializableInstagramPost, safeParseSerializableInstagramPost } from './schema';
