import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({
    extend: z.object({
      contentType: z.enum(['post', 'portfolio', 'page', 'til']).optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).default([]),
      pubDate: z.union([z.string(), z.date()]).optional(),
      updatedDate: z.union([z.string(), z.date()]).optional(),
      heroImage: z.string().optional(),
      teaser: z.string().optional(),
      links: z.array(z.string()).default([]),
      graph: z.object({ visible: z.boolean().optional() }).passthrough().optional(),
      backlinks: z.object({ visible: z.boolean().optional() }).passthrough().optional(),
      sitemap: z
        .object({
          include: z.boolean().optional(),
          pageTitle: z.string().optional(),
          linkInclusionRules: z.array(z.string()).default([]),
        })
        .optional(),
    }),
  }),
});

export const collections = { docs };
