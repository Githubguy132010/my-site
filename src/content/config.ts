import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
    author: z.string().default('Thomas Brugman'),
  }),
});

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    layout: z.string().default('default'),
  }),
});

export const collections = {
  'posts': postsCollection,
  'pages': pagesCollection,
};