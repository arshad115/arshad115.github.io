# Arshad Mehmood

This repository powers [arshadmehmood.com](https://arshadmehmood.com), now built with Astro, Starlight, GitHub Pages, and a generated content pipeline that pulls together blog posts, portfolio entries, and the `today-i-learned` submodule.

## Stack

- Astro
- Starlight
- `starlight-site-graph`
- GitHub Pages Actions
- Pagefind search
- Giscus comments

## Source layout

- `content/posts/` → blog post source files
- `content/pages/` → long-form page content used by the generator where applicable
- `content/portfolio/` → portfolio source files
- `content/drafts/` → draft template and draft helpers
- `today-i-learned/` → TIL submodule content source
- `scripts/` → content generation, hooks, submodule update, and post creation helpers
- `src/` → Astro/Starlight app source
- `public/` → static assets served by Astro

## Local development

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run sync:content
npm run build
npm run check
npm run setup:hooks
```

Post tooling documentation lives in [docs/post-generator.md](/Users/arshad/Developer/Github/blog/arshad115.github.io/docs/post-generator.md).

The content generator expects the TIL submodule to be present:

```bash
git submodule update --init --recursive
```

## Notes

- Blog post URLs are preserved from the old Jekyll site.
- `projects` has been renamed to `portfolio`.
- A local-neighborhood graph is rendered on posts, portfolio entries, and TIL pages.
- A global graph page is planned later.
