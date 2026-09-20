import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Keep Jekyll filename case, `$`, and parentheses. Do not github-slug the id. */
function fileId({ entry }: { entry: string }) {
  return entry.replace(/\.(md|mdx|markdown)$/i, '');
}

const headerSchema = z
  .object({
    image: z.string().optional(),
    teaser: z.string().optional(),
    caption: z.string().optional(),
  })
  .passthrough()
  .optional();

const common = {
  title: z.string().optional(),
  excerpt: z.string().optional(),
  description: z.string().optional(),
  date: z.coerce.date().optional(),
  last_modified_at: z.coerce.date().optional(),
  header: headerSchema,
  toc: z.boolean().optional(),
  comments: z.boolean().optional(),
  permalink: z.string().optional(),
  visible: z.boolean().optional(),
  layout: z.string().optional(),
  author_profile: z.boolean().optional(),
  share: z.boolean().optional(),
  related: z.boolean().optional(),
  read_time: z.boolean().optional(),
  sitemap: z.boolean().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
};

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/posts', generateId: fileId }),
  schema: z
    .object({
      ...common,
      category: z.union([z.string(), z.array(z.string())]).optional(),
      categories: z.union([z.string(), z.array(z.string())]).optional(),
      tags: z.union([z.string(), z.array(z.string())]).optional(),
    })
    .passthrough(),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/pages', generateId: fileId }),
  schema: z.object(common).passthrough(),
});

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/portfolio', generateId: fileId }),
  schema: z
    .object({
      ...common,
      gallery: z.any().optional(),
    })
    .passthrough(),
});

const til = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './today-i-learned', generateId: fileId }),
  schema: z.object(common).passthrough(),
});

export const collections = { posts, pages, portfolio, til };
