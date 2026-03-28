# GitHub Copilot Instructions for Arshad's Astro Blog

## Project Architecture
This is an Astro + Starlight personal site with generated content sourced from legacy content folders and the `today-i-learned` submodule. The main content types are:
- **Blog posts** from `_posts/`
- **Portfolio entries** from `_portfolio/`
- **Today I Learned (TIL)** from `today-i-learned/`

## Critical File Structure
```
├── _posts/                    # Legacy blog content source
├── _portfolio/                # Legacy portfolio source
├── _pages/                    # Legacy static page source
├── today-i-learned/           # TIL submodule source
├── scripts/generate-content.mjs
├── src/content.config.ts
├── src/pages/                 # Astro routes
├── src/components/            # Astro components
└── public/assets/             # Static assets
```

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
