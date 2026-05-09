import { defineCollection, z } from 'astro:content';

const prompts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    profession: z.string(),
    category: z.string(),
    contentType: z.literal('prompt'),
    tags: z.array(z.string()),
    pubDate: z.coerce.date(),
    featured: z.boolean().default(false),
    promptCount: z.number().default(25),
  }),
});

const workflows = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    profession: z.string(),
    category: z.string(),
    contentType: z.literal('workflow'),
    tags: z.array(z.string()),
    pubDate: z.coerce.date(),
    featured: z.boolean().default(false),
  }),
});

const templates = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    profession: z.string(),
    category: z.string(),
    contentType: z.literal('template'),
    tool: z.string(),
    tags: z.array(z.string()),
    pubDate: z.coerce.date(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { prompts, workflows, templates };
