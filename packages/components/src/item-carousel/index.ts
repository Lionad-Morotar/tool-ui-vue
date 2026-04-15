import ItemCard from './cmpts/item-card.vue'
import ItemCarousel from './index.vue'

export { ItemCarousel, ItemCard }
export default ItemCarousel
export type { ItemCarouselProps, SerializableItemCarousel, Item, SerializableItem, ItemCardCss, ItemCarouselCss } from './schema';
export { SerializableItemCarouselSchema, ItemSchema, SerializableItemSchema, ItemCardCssSchema, ItemCarouselCssSchema, parseSerializableItemCarousel, safeParseSerializableItemCarousel } from './schema';
