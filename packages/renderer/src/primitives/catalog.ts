import { schema } from '@json-render/vue/schema';
import { z } from 'zod';

/**
 * 布局原语的 Catalog 条目定义
 * 供 primitivesCatalog 与主 catalog 共用，消除重复定义
 */
const StackEntry = {
  props: z.object({
    gap: z.number().optional(),
    padding: z.number().optional(),
    direction: z.enum(['vertical', 'horizontal']).optional(),
    align: z.enum(['start', 'center', 'end']).optional(),
  }),
  slots: ['default'],
  description: 'Layout container that stacks children vertically or horizontally',
};

const CardEntry = {
  props: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
  }),
  slots: ['default'],
  description: 'A card container with optional title and subtitle',
};

const TextEntry = {
  props: z.object({
    content: z.string(),
    size: z.enum(['sm', 'md', 'lg', 'xl']).optional(),
    weight: z.enum(['normal', 'medium', 'bold']).optional(),
    color: z.string().optional(),
  }),
  slots: [],
  description: 'Displays a text string',
};

const ButtonEntry = {
  props: z.object({
    label: z.string(),
    variant: z.enum(['primary', 'secondary', 'danger']).optional(),
    disabled: z.boolean().optional(),
  }),
  slots: [],
  description: "A clickable button that emits a 'press' event",
};

const BadgeEntry = {
  props: z.object({
    label: z.string(),
    color: z.string().optional(),
  }),
  slots: [],
  description: 'A small badge/tag label',
};

const ListItemEntry = {
  props: z.object({
    title: z.string(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
  }),
  slots: [],
  description: 'A single item in a list',
};

const InputEntry = {
  props: z.object({
    value: z.string().optional(),
    placeholder: z.string().optional(),
  }),
  slots: [],
  description: 'A text input field that supports two-way state binding',
};

export const primitiveEntries = {
  Stack: StackEntry,
  Card: CardEntry,
  Text: TextEntry,
  Button: ButtonEntry,
  Badge: BadgeEntry,
  ListItem: ListItemEntry,
  Input: InputEntry,
};

/**
 * 布局原语的独立 Catalog
 */
export const primitivesCatalog = schema.createCatalog({
  components: primitiveEntries,
  actions: {},
});

export type PrimitivesCatalog = typeof primitivesCatalog;
