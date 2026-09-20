# Agent notes — arshadmehmood.com

This branch (`astro-plain-migration`) rebuilds the site as a **plain Astro static site**. Production `master` is still Jekyll + Minimal Mistakes on [arshadmehmood.com](https://arshadmehmood.com) until URL parity is green.

Read `docs/plain-astro-restart.md` first. Ignore root `MIGRATION_PLAN.md` (Starlight plan; superseded).

## Hard rules

- Do **not** add Starlight, `@pelagornis/page`, an Astro blog theme package, or `scripts/generate-content.mjs`.
- Do **not** merge `codex/astro-starlight-migration` or `backup/master-before-astro-starlight-migration`.
- Do **not** auto-deploy this branch to GitHub Pages. Deploy workflow is `workflow_dispatch` only and must refuse to publish unless `master`.
- Do **not** change git config, force-push, or skip hooks.
- Canonical URLs are the paths in `tests/fixtures/jekyll-sitemap.xml`. GitHub Pages is case-sensitive. Ugly live paths stay. Redirects are aliases only (`/projects/` → `/portfolio/`, `/page2/`–`/page9/` → `/posts/`, extra casings **not** in the fixture).
- One source per URL. Do not keep a `content/pages/foo.md` *and* `src/pages/foo/` for the same route.
- Static files live in `public/`. Do not revive a second `assets/` tree at the repo root.
- Giscus on **posts only**, never every TIL note.
- No Universal Analytics default. No Mailchimp `YOUR_USER_ID` placeholder. Newsletter is RSS-only until there is a real list.
- No synthetic tag-overlap graph. Graph is v1.1 and optional, from real markdown links only.
- `today-i-learned/` is a git submodule. Fail the build if it is missing. `git submodule update --init --recursive` after clone.
- Do not publish `content/drafts/`.
- Licensed or open fonts only. Do not use Square Market / SqMarket unless a license file is in this repo.

## Layouts and look

Own `src/layouts/Base.astro` and `src/layouts/Post.astro`. Original CSS in `src/styles/global.css` — warm engineering notebook, light by default, terracotta `#b8563d`, ~65ch reading column, wordmark “Arshad Mehmood”, home photo `/assets/images/bio-photo.jpg`. No cards, drop shadows, glassmorphism, hero gradients, docs sidebar, or emoji nav.

## Content

| Source (Jekyll / git) | Destination |
| --- | --- |
| `_posts/` | `content/posts/` — URLs `/{category}/{filename-slug}/` |
| Prose `_pages/` | `content/pages/` |
| Indexes, contact form, 404 | dedicated `src/pages/` |
| `_portfolio/` + Android apps list | `content/portfolio/` + `/portfolio/` |
| `today-i-learned/<category>/*.md` | `til` collection; skip README / SCRIPT_README / TIL_SCRIPTS_README |
| `_drafts/` | `content/drafts/` |

Post permalinks keep the **filename** slug (case, `$`, parentheses). Category in the path is lowercased. Do not prettify slugs.

Jekyll leftover in markdown (`{{ "/path" \| absolute_url }}`, `{% raw %}`, kramdown `{:.class}`) is rewritten at load time in `src/lib/jekyll.ts`. Do not treat Angular `{{ }}` in TIL notes as Liquid.

## Routes (v1)

`/`, `/posts/`, `/today-i-learned/` (+ notes), `/portfolio/` (+ entries), `/categories/`, `/tags/`, `/about/`, `/contact/` (Wufoo), `/resources/`, `/resume/`, `/support/`, `/terms/`, `/newsletter/` (RSS copy), `/sitemap/`, `/search/`, `/feed.xml`, `/404`.

## Commands

```sh
git submodule update --init --recursive
npm ci
npm run dev
npm run build          # also runs Pagefind
npm run test:urls      # fixture vs dist/; landing path must be real HTML, not a redirect source
npm run verify
```

Node 20. Site URL: `https://arshadmehmood.com`. `trailingSlash: 'always'`.
