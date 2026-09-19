# GitHub Copilot Instructions for Arshad's Astro Blog

**Stop.** This file is stale and describes the abandoned Starlight attempt (it even still says `_posts/`). The target architecture and salvage list are in [docs/plain-astro-restart.md](../docs/plain-astro-restart.md). Do not extend Starlight, Pelagornis, or `generate-content.mjs`.

## Project Architecture (this branch only — do not copy forward)
This branch is an Astro + Starlight experiment with generated content sourced from `content/` and the `today-i-learned` submodule. The main content types on **this** tree are:
- **Blog posts** from `content/posts/` (not `_posts/` — that path is Jekyll `master`)
- **Portfolio entries** from `content/portfolio/`
- **Today I Learned (TIL)** from `today-i-learned/`

## Critical File Structure (this branch only)
```
├── content/posts|pages|portfolio|drafts/
├── today-i-learned/           # TIL submodule
├── scripts/generate-content.mjs   # Starlight adapter — do not take to the next branch
├── src/content.config.ts
├── src/pages/
├── src/components/
└── public/assets/
```

Jekyll `master` still uses `_posts/`, `_pages/`, `_portfolio/`. Recreate `content/` from those live trees, not from this branch if they have diverged. See `docs/plain-astro-restart.md`.

## Content Creation Patterns

### Blog Posts
- **Filename**: `YYYY-MM-DD-kebab-case-title.md`
- **Required frontmatter**:
  ```yaml
  ---
  title: "Descriptive Title"
  category: Software|DevOps|Programming
  tags: [tag1, tag2]
  header:
    image: /assets/images/posts/image.png
    teaser: /assets/images/posts/image.png
  comments: true
  ---
  ```
- **DevOps series**: Use `_**Note** This post is part of the [DevOps Journey](/software/devops-journey/)_`

### Today I Learned (TIL)
- Lives in `today-i-learned/[category]/` folders
- Usually plain markdown without frontmatter
- README is still maintained inside the submodule
- Astro generates TIL pages from the underlying note files, not from the README page loop

## Development Workflow
```bash
# Sync generated docs content
npm run sync:content

# Local development
npm run dev

# Build for production
npm run build

# Update TIL README (auto-generates category stats)
cd today-i-learned && python update_readme.py
```

## Custom Components
- **TIL Integration**: Generated from the submodule into Starlight docs entries
- **Graph**: Added through `src/components/StarlightFooter.astro`
- **Comments**: Giscus component in `src/components/GiscusComments.astro`

## Asset Management
- **Images**: Store in `/public/assets/images/posts/` with consistent naming
- **Headers**: Both `image` and `teaser` should point to the same file
- **Generator output**: `src/content/docs/generated/` and `src/generated/site-data.json`

## Integration Points
- **GitHub Pages**: Deploys from `master` via `.github/workflows/deploy-pages.yml`
- **Giscus**: Configured through `PUBLIC_GISCUS_*` environment variables
- **Google Analytics**: Added in `astro.config.mjs`
- **Graph**: `starlight-site-graph` integration outputs `dist/sitegraph/sitemap.json`

## Common Gotchas
- **TIL files**: Plain markdown is still the safest input shape
- **Legacy sources**: `_posts`, `_pages`, and `_portfolio` are source-of-truth inputs for the generator
- **Submodule**: Run `git submodule update --init --recursive` before build if missing
- **Generated content**: Re-run `npm run sync:content` after changing legacy source folders

## Content Guidelines
- **Code blocks**: Use triple backticks with language specification
- **Categories**: Consistent capitalization (Software, DevOps, Programming)
- **Tags**: Use existing tags when possible, create sparingly
- **Links**: Prefer absolute paths for internal links (`/category/post-title/`)
