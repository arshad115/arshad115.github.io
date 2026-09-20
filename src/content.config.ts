import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_SLUGS } from './lib/taxonomy.mjs';

/** Keep the filename as the collection id. Do not github-slug it. */
function fileId({ entry }: { entry: string }) {
  return entry.replace(/\.(md|mdx|markdown)$/i, '');
}

const header = z
  .object({
    image: z.string().optional(),
    alt: z.string().min(1).optional(),
    caption: z.string().optional(),
    captionHref: z.url().optional(),
    teaser: z.string().optional(),
  })
  .refine((value) => !value.image || Boolean(value.alt), {
    message: 'header.alt is required when header.image is set',
  })
  .refine((value) => !value.captionHref || Boolean(value.caption), {
    message: 'header.captionHref requires header.caption',
  })
  .optional();

const tags = z.array(z.string()).optional();

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/posts', generateId: fileId }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z
      .string()
      .refine((value) => CATEGORY_SLUGS.includes(value), {
        message: `category must be one of: ${CATEGORY_SLUGS.join(', ')}`,
      }),
    tags,
    excerpt: z.string().optional(),
    last_modified_at: z.coerce.date().optional(),
    header,
    toc: z.boolean().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/pages', generateId: fileId }),
  schema: z.object({
    title: z.string(),
    permalink: z.string(),
    excerpt: z.string().optional(),
    header,
    toc: z.boolean().optional(),
  }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/portfolio', generateId: fileId }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    date: z.coerce.date().optional(),
    header,
    tags,
  }),
});

/** TIL notes use YAML `title:`. The layout prints the H1; the body must not repeat it. */
const til = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './today-i-learned', generateId: fileId }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    excerpt: z.string().optional(),
    tags,
  }),
});

export const collections = { posts, pages, portfolio, til };
