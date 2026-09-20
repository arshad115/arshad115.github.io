# Restart the site as plain Astro

**Live contract:** [`AGENTS.md`](../AGENTS.md) on `astro-plain-migration`. That is the rebuild. This file is the original restart brief — historical context, not “you are on the Starlight branch.”

**History:** `codex/astro-starlight-migration` was a failed first attempt (Starlight + Pelagornis). Do not merge it to `master`. Do not keep iterating Starlight on it.

Related reference branches (not a base):

- `codex/astro-starlight-migration`
- `origin/codex/astro-starlight-migration` (diverged; graph/image work)
- `backup/master-before-astro-starlight-migration`

Production remains Jekyll on `master` / [arshadmehmood.com](https://arshadmehmood.com) until URL parity is green.

---

## Decision

Build a **plain Astro static site** with layouts we own.

| Keep | Do not use |
| --- | --- |
| Astro (current major is fine) | Starlight |
| GitHub Pages + `arshadmehmood.com` | `@pelagornis/page` |
| Markdown in git | A third-party blog theme as a dependency |
| `today-i-learned` submodule | `scripts/generate-content.mjs` writing `src/content/docs/generated/` |
| Giscus, RSS `/feed.xml`, `@astrojs/sitemap` | Disqus |
| Pagefind for search | Universal Analytics (`UA-114855578-1`) as a default |
| TOC from Astro `render().headings` | Synthetic tag-overlap graph edges |

Starlight is a docs framework. Using it as the blog shell forced a generator, a `docs` collection, theme overrides, and Pelagornis. Search and TOC do not need Starlight: Pagefind indexes `dist/` after build; content collections already return heading `{ depth, slug, text }` arrays.

Do **not** `npm install` another blog theme (Astro Paper, Cactus, etc.). This repo already lost years to Minimal Mistakes upstream and then fought Starlight/Pelagornis (`PageTitle`, `PageSidebar`, `TwoColumnContent`, hidden sidebar, `custom.css`). Own `Base.astro` / `Post.astro` and reuse visual language from `src/styles/global.css` (terracotta `#b8563d`, home photo, ~65ch reading column). Steal *structure* from the official Astro blog example (collections, RSS, markdown), not a theme package.

---

## Graph (optional, second)

The Obsidian-style **local neighborhood graph** is desirable. It is **not** a reason to keep Starlight.

`starlight-site-graph` works on vanilla Astro (`starlight-site-graph/integration`, `@astrojs/starlight` is an optional peer). This branch set `starlight: true` only because Starlight was present.

The graph on this branch is **not** a model to copy. `generate-content.mjs` invents `links` from shared tags/category so the widget is never empty. Example: the Go `sync/atomic` post was linked to Angular ViewContainerRef, Langur, and the Android library — same `Development` bucket, no real relationship. There are no `[[wikilinks]]` in `content/`. Real edges already exist where authors wrote them (the SSH guide → TIL notes).

If the graph is built on the next branch:

1. Parse real markdown links (`[](/path/)`, later `[[wikilink]]` if wanted).
2. Honor optional frontmatter `links:` for edges markdown cannot express.
3. **Do not synthesize** neighbors from tags. An isolated TIL with one node is correct.
4. Ship a **local** graph (depth 1, maybe 2) on post / TIL / portfolio layouts first.
5. Add a global `/graph/` page only after local graphs look true.

If that is too much for v1, ship the blog **without** a graph. Empty-looking fake graphs are worse than no graph. Do not polish graph code on this Starlight tree.

---

## What to take from this branch

Copy by file, **do not merge** this branch into `master` or into the new branch.

### Take (with fixes)

**URL freeze idea + redirect table + parity test**

- `scripts/legacy-url-redirects.mjs`
- `tests/url-parity.test.mjs`
- `astro.config.mjs` `redirects` + `trailingSlash: 'always'` + `site: 'https://arshadmehmood.com'`

Re-implement redirects correctly (this copy is a checklist, not drop-in):

1. **Landing URL after aliases = real HTML in `dist/`.** The frozen Jekyll sitemap is the set of live inbound paths. They may redirect to a cleaned slug (`$2`, `(2FA)`). The destination must exist as a page, not as another redirect.
2. Redirects are **aliases only**: `/projects/` → `/portfolio/`, `/page2/`…`/page9/` → `/posts/`, and old punctuation post URLs → lowercase kebab slugs. Do not keep `$` or `(2FA)` as canonical filenames.
3. GitHub Pages is case-sensitive. The cleaned slug is the one page; extra casings are redirects only when they are not already that slug.
4. **Fix the test.** Today it adds every redirect *source* to `availablePaths`, so a mapped live URL can pass even if the **target** was never built. After following redirects, the landing path must exist as HTML in `dist/`.
5. **Commit a Jekyll sitemap fixture** (`tests/fixtures/jekyll-sitemap.xml` or a URL list). Do not use live `https://arshadmehmood.com/sitemap.xml` as the only source: after cutover the test becomes “site vs itself,” and this branch already drifted (parity failed for `/development/introducing-vault-linker/` and two TIL notes).
6. Run the fixture test in CI on every PR, without depending on a stale local `dist/`.

**Content layout (the folders, not the generator)**

- `content/posts/`, `content/pages/`, `content/portfolio/`, `content/drafts/`
- Recreate them from **current `master`** `_posts/`, `_pages/`, `_portfolio/` so Vault Linker and other live posts are not lost. This branch is behind `origin/master`.

**Astro app pieces worth reading, then rewriting**

- `src/pages/index.astro`, `posts/`, `categories/`, `tags/`, `today-i-learned/`, `portfolio/`, `404.astro` — listing UX, not Starlight coupling
- `src/components/GiscusComments.astro`, `PostMetaRow.astro` — keep the behavior
- `src/pages/feed.xml.js` — keep `/feed.xml`
- `src/pages/contact/index.astro` — Wufoo; keep until it breaks
- `src/styles/custom.css` — visual identity; strip Starlight/Pelagornis selectors as layouts land
- `public/CNAME` (`arshadmehmood.com`)
- `.env.example` Giscus keys (client-visible by design)
- `.github/workflows/deploy-pages.yml` — Node 20, `submodules: recursive`, `npm ci`, `npm run build`, Pages artifact. Add `check` + fixture URL test **before** upload. Do not deploy from the migration branch automatically.

**TIL**

- `.gitmodules` + `scripts/update-submodule.sh` (paths already updated)
- Fail the build if the submodule is missing (good idea from the generator; do it in the Astro integration or a prebuild script without writing Starlight MDX)

**Post / TIL scaffolding**

- Use `./scripts/new-post.sh` and `./scripts/new-til.sh` (Node implementations in `scripts/new-post.mjs` / `scripts/new-til.mjs`). They replace the root Python helpers (`new_post.py`, `quick_post.py`, `draft_to_post.py`) and the submodule wrappers for creating notes from this repo.
- Do not copy `install.sh` / `setup_aliases.sh` (`setup_aliases.sh` appends to the user shell profile).

### Take as a warning only

- `src/components/PageTitle.astro` on **origin** (not necessarily this checkout) rendered header images with `set:html` on captions. Do not copy that. Plain text or a real markdown renderer.
- Origin `scripts/generate-content.mjs` asset-exists checks and graph link caps are closer to right, but the generator itself should not come along.

### Do not take

| Leave | Why |
| --- | --- |
| `@astrojs/starlight`, `@pelagornis/page` | Wrong shell; Pelagornis pulls OpenAI / Anthropic / Google AI SDKs unused |
| `scripts/generate-content.mjs` | Exists to feed Starlight `docs` |
| `src/content/docs/generated/`, `src/generated/site-data.json` | Build output; gitignored; dual metadata with collections |
| Synthetic `buildSyntheticLinks` | Fake graph |
| Starlight component overrides | Fighting the theme |
| `resume.json` | JsonResume **sample** for Thomas Davis, not Arshad |
| Root `assets/` next to `public/assets/` | Astro only serves `public/` |
| UA default in `astro.config.mjs` | Universal Analytics is dead; omit the script or use GA4 explicitly |
| Newsletter Mailchimp `YOUR_USER_ID` form | Non-functional on Jekyll too; RSS-only until a real list exists |
| `.github/copilot-instructions.md` as-is | Still describes `_posts/` and Starlight |
| Categories/tags `slice(0, 8)` | Hides posts (Tutorial has 11) |
| Giscus on every TIL page | Prefer posts only unless we decide otherwise |
| Starlight `lastUpdated` / `editLink` on generated MDX | “Last updated” became generator mtime; Edit pointed at gitignored files on `master` |

---

## What went wrong

1. **Wrong product shell.** The written plan (`MIGRATION_PLAN.md` on `master`, deleted in `789e08ce astro init`) required Starlight for the whole site. A 44-post blog with a TIL notebook is not a docs site.
2. **A compatibility compiler instead of collections.** Jekyll-shaped markdown was copied into generated Starlight MDX plus `site-data.json`. Two metadata planes, Liquid regex, no generator tests.
3. **Theme stacking.** Starlight + Pelagornis + overrides + `custom.css`. Latest commits here are still fighting chrome (`side bar removed`).
4. **Fake graph to justify the plugin.** Tag synthesis is not an Obsidian graph.
5. **Branch diverged from production.** Live `master` kept receiving posts (e.g. Vault Linker, 2026-09-17). Local submodule pin missed TIL notes. URL parity against the live sitemap failed on three paths. `dist/` on this checkout was also stale relative to later source.
6. **Plan deleted from the branch that needed it.** Copilot instructions were never updated. Agents (and humans) were told `_posts/` was still the source of truth.
7. **Cutover gates were not in CI.** `verify:migration` is a README command. The one test talks to production and treats redirect sources as present pages.
8. **Product holes copied forward.** Placeholder newsletter, sample `resume.json`, `content/pages/projects.html` excluded so `/portfolio/` is one Langur entry while `/projects/` used to list Android apps.

The Jekyll → Astro move was still the right *direction* (escape the Minimal Mistakes fork). The failure was **Starlight as the site**, not Astro.

---

## What not to do next time

- Do not merge this branch. Do not rebase Starlight into “almost plain Astro.”
- Do not start the new branch from `backup/master-before-astro-starlight-migration`. Start from **current `origin/master`**.
- Do not keep a generator whose only job is to satisfy Starlight.
- Do not add a blog theme package “for speed.”
- Do not synthesize graph links so the widget looks busy.
- Do not keep `$` or parentheses in Jekyll filenames as canonical URLs. Redirect those live paths to lowercase kebab slugs.
- Do not deploy Astro until the **fixture** URL test is green.
- Do not use `GITHUB_TOKEN` submodule auto-commits as the publish path without a follow-up deploy (`GITHUB_TOKEN` pushes do not start other workflows).
- Do not leave `content/pages/foo.md` *and* `src/pages/foo/` as competing sources. One source per route.
- Do not ship header images from `assets/` at the repo root; only `public/`.
- Do not enable Starlight `editLink` / `lastUpdated` on files that are not in git.
- Do not treat live sitemap fetch as a post-cutover regression test unless the fixture is frozen first.

---

## Target shape (new branch)

```
content/posts/              # from master _posts (keep permalinks / category URLs)
content/pages/              # prose pages only
content/portfolio/          # plus a real port of _pages/projects (or equivalent)
content/drafts/
today-i-learned/            # submodule, glob collection, skip README/script markdown
src/layouts/Base.astro
src/layouts/Post.astro      # TOC from headings, optional PageGraph, Giscus on posts
src/pages/                  # home, listings, 404, feed.xml, contact, redirects
public/                     # CNAME, assets, fonts
tests/fixtures/jekyll-sitemap.xml
tests/url-parity.test.mjs
scripts/legacy-url-redirects.mjs
```

Collections load `content/` and the TIL tree **directly**. No generated MDX.

v1: pages, posts, TIL, portfolio, RSS, Pagefind, TOC, Giscus, contact, URL parity.  
v1.1 (maybe): local graph from real links.  
Later: global graph, real newsletter, JsonResume, GA4 or no analytics.

---

## First commits on the new branch

1. Copy **this file** onto the branch. Optionally copy a Cursor rule that points at it.
2. Snapshot the live Jekyll sitemap into `tests/fixtures/`.
3. `git submodule update --init --recursive` from that `master`.
4. Scaffold plain Astro (no Starlight) with `site`, trailing slashes, CNAME, Pages workflow (deploy still **off** until parity).
5. Move `_posts` / `_pages` / `_portfolio` into `content/` without changing permalinks.
6. Implement listings + post layout + fixture test; iterate until green.
7. Only then: Pagefind, Giscus, graph maybe.

Until then, Jekyll on `master` stays production.
