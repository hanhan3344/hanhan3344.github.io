import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    legacySlug: z.string().optional(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    cover: z.string().url().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    math: z.boolean().default(false),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    year: z.number().int(),
    authors: z.array(z.string()).min(1),
    venue: z.string(),
    venueShort: z.string(),
    paperUrl: z.string().url().optional(),
    pdfUrl: z.string().url().optional(),
    codeUrl: z.string().url().optional(),
    doiUrl: z.string().url().optional(),
    scholarUrl: z.string().url().optional(),
    citations: z.number().int().nonnegative().optional(),
    featured: z.boolean().default(false),
    firstAuthor: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    blogSlug: z.string().optional(),
  }),
});

export const collections = { posts, publications };
