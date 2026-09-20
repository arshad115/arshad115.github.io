# Arshad Mehmood — personal site

Plain [Astro](https://astro.build) static site for [arshadmehmood.com](https://arshadmehmood.com).

**Production is still Jekyll** on `master`. This branch (`astro-plain-migration`) is the rebuild. Do not point GitHub Pages at it until `npm run test:urls` is green and cutover is intentional.

## Develop

Needs Node 20.

```sh
git submodule update --init --recursive
npm ci
npm run dev
```

Open the printed local URL. Search (Pagefind) is indexed during `npm run build`.

```sh
npm run build
npm run preview
npm run test:urls
npm run verify
```

## Content

| Path | What |
| --- | --- |
| `content/posts/` | Blog posts. Public URL is `/{category}/{filename-slug}/` |
| `content/pages/` | Prose pages (`/about/`, `/resources/`, …) |
| `content/portfolio/` | Portfolio write-ups |
| `content/drafts/` | Unpublished |
| `today-i-learned/` | Git submodule. Notes at `/today-i-learned/{category}/{slug}/` |
| `public/` | CNAME, images, files |

Do not add Starlight, a blog theme package, or a content generator that writes `src/content/docs/`. Canonical URLs are frozen in `tests/fixtures/jekyll-sitemap.xml`.

## Comments

Giscus is on **posts only**. Copy `.env.example` to `.env` and fill `PUBLIC_GISCUS_REPO_ID` / `PUBLIC_GISCUS_CATEGORY_ID` from [giscus.app](https://giscus.app). Empty IDs hide the widget.

## Deploy

`.github/workflows/deploy-pages.yml` is **workflow_dispatch only** and will not publish unless the ref is `master`. CI on this branch builds and runs the URL fixture test without deploying.
