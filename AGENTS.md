# Agent notes — arshadmehmood.com

This branch (`astro-plain-migration`) rebuilds the site as a **plain Astro static site**. Production `master` is still Jekyll + Minimal Mistakes on [arshadmehmood.com](https://arshadmehmood.com) until URL parity is green. Cloudflare Workers Builds owns preview deployments and will own production after cutover; GitHub Actions is validation only.

This file is the live contract. `docs/plain-astro-restart.md` is historical context for the Starlight false start. Ignore root `MIGRATION_PLAN.md`.

## Hard rules

- Do **not** add Starlight, `@pelagornis/page`, an Astro blog theme package, or `scripts/generate-content.mjs`.
- Do **not** merge `codex/astro-starlight-migration` or `backup/master-before-astro-starlight-migration`.
- Do **not** deploy with GitHub Pages. GitHub Actions runs CI only; Cloudflare Workers Builds handles preview and production deployment.
- Do **not** change git config, force-push, or skip hooks.
- Live Jekyll paths are frozen in `tests/fixtures/jekyll-sitemap.xml`. After following aliases, the landing URL must be real HTML. New posts use lowercase kebab slugs. Punctuation live paths (`$2`, `(2FA)`) redirect to the cleaned slug; do not keep those as canonical pages. Other aliases: `/projects/` → `/portfolio/`, `/page2/`–`/page9/` → `/posts/`. Alias HTML must exist in `dist/` (case-only aliases are written after build on case-sensitive filesystems).
- One source per URL. Do not keep a `content/pages/foo.md` *and* `src/pages/foo/` for the same route.
- Static files live in `public/`. Do not revive a second `assets/` tree at the repo root.
- Giscus on **posts only**, never every TIL note. Its public repository/category IDs have checked-in defaults; hosts may override the four `PUBLIC_GISCUS_*` values. `COMMENTS_DISABLED=true` is the explicit kill switch.
- The contact form posts to `/api/contact`. `worker/index.js` injects `W3FORMS_ACCESS_KEY` at runtime; never put that key in Astro source, generated HTML, `wrangler.jsonc`, or committed environment files.
- No Universal Analytics default. No Mailchimp `YOUR_USER_ID` placeholder. Newsletter is RSS-only until there is a real list.
- No synthetic tag-overlap graph. Graph is v1.1 and optional, from real markdown links only.
- `today-i-learned/` is a git submodule. Fail the build if it is missing. `git submodule update --init --recursive` after clone. `scripts/update-submodule.sh` checks out the pin; pass `--remote` only when you intend to bump it.
- Do not publish `content/drafts/`. Do not publish posts with `draft: true`.
- Licensed or open fonts only. Do not use Square Market / SqMarket unless a license file is in this repo.

## Layouts and look

Own `src/layouts/Base.astro` and `src/layouts/Post.astro`. Original CSS in `src/styles/global.css` — cool paper, light by default, ink `#1a1e1b`, accent `#0c6b62`, Source Serif for reading, ~65ch column, wordmark “Arshad Mehmood”, home photo `/assets/images/arshad-mehmood-software-engineer-germany.jpg`. No cards, drop shadows, glassmorphism, hero gradients, docs sidebar, or emoji nav.

## Content

| Source (Jekyll / git) | Destination |
| --- | --- |
| `_posts/` | `content/posts/` — URLs `/{category}/{filename-slug}/` |
| Prose `_pages/` | `content/pages/` |
| Indexes, contact form, 404 | dedicated `src/pages/` |
| `_portfolio/` + Android apps list | `content/portfolio/` + `/portfolio/` |
| `today-i-learned/<category>/*.md` | `til` collection; skip README / SCRIPT_README / TIL_SCRIPTS_README |
| `_drafts/` | `content/drafts/` |

Post files are `YYYY-MM-DD-slug.md`. The **slug after the date is the public URL path** (`/{category}/{slug}/`). Use lowercase kebab slugs. Category in YAML is a closed lowercase slug from `src/lib/taxonomy.mjs` (`development`, `devops`); the UI Title-Cases it, with an exception only when English is irregular (`DevOps`). Date in the filename and `date:` in YAML should match. Old Jekyll punctuation URLs belong in `astroRedirects` in `scripts/legacy-url-redirects.mjs`. Mixed-case live URLs belong in `caseAliasRedirects` and are written after build on case-sensitive filesystems only.

Header images use `header.image`, required `header.alt`, optional plain-text `header.caption` and `header.captionHref`. Do not put Markdown in YAML captions.

TIL notes live in the submodule (`today-i-learned/{category}/{slug}.md`) with YAML `title:`. The layout prints the H1; do not repeat it in the body. `update_readme.py` in that repo reads `title:` first, then a heading. Do not use Jekyll `{% raw %}` around Angular examples.

Jekyll leftover in older post bodies (`{{ "/path" \| absolute_url }}`, kramdown `{:.class}`) is still rewritten at load time in `src/lib/jekyll.ts`. Do not treat Angular `{{ }}` in TIL notes as Liquid.

## Routes (v1)

`/`, `/posts/`, `/today-i-learned/` (+ notes), `/portfolio/` (+ entries), `/categories/`, `/tags/`, `/about/`, `/contact/` (Web3Forms), `/resources/`, `/resume/`, `/support/`, `/terms/`, `/newsletter/` (RSS copy), `/sitemap/`, `/search/`, `/feed.xml`, `/llms.txt`, `/llms-full.txt`, `/404`.

## Commands

```sh
git submodule update --init --recursive
npm ci
npm run dev
npm run build          # also runs Pagefind
npm test               # unit tests (no dist/ required)
npm run test:site      # URL fixture + HTML contracts; needs a fresh build
npm run verify         # test, check, build, test:site
npm run lighthouse:ci # official Lighthouse CI; needs a fresh build
npm run preview:worker # build + local Cloudflare Worker/static assets
./scripts/new-post.sh "Title"
./scripts/new-til.sh "Title" category
./scripts/update-submodule.sh  # pin; add --remote to fetch upstream HEAD
```

Node 20. Site URL: `https://arshadmehmood.com`. `trailingSlash: 'always'`.
