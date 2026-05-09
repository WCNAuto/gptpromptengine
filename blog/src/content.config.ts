import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.optional(image()),
  }),
});

const prompts = defineCollection({
  loader: glob({ base: './src/content/prompts', pattern: '**/*.{md,mdx}' }),
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
  loader: glob({ base: './src/content/workflows', pattern: '**/*.{md,mdx}' }),
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
  loader: glob({ base: './src/content/templates', pattern: '**/*.{md,mdx}' }),
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

export const collections = { blog, prompts, workflows, templates };
