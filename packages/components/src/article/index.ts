import Article from './index.vue'
export { Article }
export default Article

export type {
  ArticleProps,
  SerializableArticle,
  ArticleType,
  HeaderPattern,
  ArticleCss,
} from './schema'

export {
  ArticleTypeSchema,
  HeaderPatternSchema,
  SerializableArticleSchema,
  ArticleCssSchema,
  parseSerializableArticle,
  safeParseSerializableArticle,
} from './schema'

export { useArticle } from './states'
export type { ArticleState } from './states'
