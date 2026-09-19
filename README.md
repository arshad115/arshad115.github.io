# Arshad Mehmood

This repository powers [arshadmehmood.com](https://arshadmehmood.com). **Production `master` is still Jekyll.** This branch is a failed Astro + Starlight attempt and is not the destination.

The next migration is **plain Astro** (no Starlight, no Pelagornis theme). What to copy from this branch, what went wrong, and what not to repeat: [docs/plain-astro-restart.md](docs/plain-astro-restart.md).

The rest of this README describes **this branch only**, so local `npm run dev` still makes sense until the new branch exists.

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
- `projects` has been renamed to `portfolio` (with redirects from `/projects/`).
- A local-neighborhood graph is rendered on posts, portfolio entries, and TIL pages.
- A global graph page is planned later.

## Migration verification

Before merging to `master`, run the URL parity check against the live site:

```bash
npm run verify:migration
```

This builds the site and compares every URL in https://arshadmehmood.com/sitemap.xml against the Astro output (including legacy redirects).

Set GitHub Actions secrets before deploy:

- `PUBLIC_GISCUS_REPO`
- `PUBLIC_GISCUS_REPO_ID`
- `PUBLIC_GISCUS_CATEGORY`
- `PUBLIC_GISCUS_CATEGORY_ID`

Optional: `PUBLIC_GA_MEASUREMENT_ID` (defaults to the legacy UA property).
