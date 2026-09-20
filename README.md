# Arshad Mehmood — personal site

Plain [Astro](https://astro.build) static site for [arshadmehmood.com](https://arshadmehmood.com).

**Production is still Jekyll** on `master`. This branch (`astro-plain-migration`) is the rebuild. Do not point GitHub Pages at it until cutover is intentional.

## Develop

Node 20 (see `.nvmrc`).

```sh
git submodule update --init --recursive
npm ci
npm run dev
```

Search is indexed during `npm run build`.

```sh
npm run verify   # unit tests + build + Pagefind + site tests
```

## Content

Posts are `content/posts/YYYY-MM-DD-slug.md`. The slug after the date **is** the public URL (`/{category}/{slug}/`). Use lowercase kebab-case. YAML `category:` is a lowercase slug (`development`, `devops`); the UI shows Title Case (`DevOps`). Old Jekyll URLs with `$` or parentheses redirect to the cleaned slug.

TIL notes live in the `today-i-learned` submodule as `category/note.md` with YAML `title:`. The site layout prints the H1; the note body should not repeat it. Bump the submodule with `npm run update:til`, then commit the pointer.

```sh
./scripts/new-post.sh "Post title" --category development --tags "go,cli"
./scripts/new-post.sh "Draft title" --draft
./scripts/new-til.sh "Note title" git
./scripts/new-til.sh "Note title" git --template --readme
```

Same commands work as `npm run new:post` / `npm run new:til`. With no arguments they prompt interactively. Do not install shell-profile aliases.

| Path | What |
| --- | --- |
| `content/posts/` | Essays. URL `/{category}/{filename-slug}/` |
| `content/pages/` | Prose pages |
| `content/portfolio/` | Portfolio write-ups |
| `content/drafts/` | Unpublished |
| `today-i-learned/` | Git submodule |
| `public/` | CNAME, images, files |

Live Jekyll URLs are frozen in `tests/fixtures/jekyll-sitemap.xml`. After following redirects they must land on real HTML.

## Comments

Giscus is on **posts only**. Copy `.env.example` to `.env` and fill the Giscus IDs. Empty IDs hide the widget.

## Deploy

`.github/workflows/ci.yml` runs unit tests, `astro check`, build, URL parity, and HTML contract tests on this branch and on `master`.

`.github/workflows/deploy-pages.yml` is **workflow_dispatch only** and will not publish unless the ref is `master`.
