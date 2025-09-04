# GitHub Copilot Instructions for Arshad's Jekyll Blog

## Project Architecture
This is a Jekyll-powered personal blog built on the **Minimal Mistakes theme** with two main content types:
- **Blog posts** (`_posts/`) - Technical articles with date-based URLs
- **Today I Learned (TIL)** - Micro-learning snippets in a separate repo structure (`today-i-learned/`)

## Critical File Structure
```
├── _posts/                    # Main blog content (YYYY-MM-DD-title.md)
├── _portfolio/                # Project showcases
├── _pages/                    # Static pages (contact, about, etc.)
├── _layouts/                  # Custom layouts (til.html for TIL integration)
├── _data/navigation.yml       # Site navigation structure
├── today-i-learned/          # Separate TIL content with auto-generation
└── assets/images/posts/      # Post header images
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
- **No frontmatter** - plain markdown only
- Auto-generated README via `update_readme.py` script
- Integrated into main site via custom `til.html` layout

## Jekyll Configuration Specifics
- Uses **GitHub Pages** compatible plugins only (`jekyll-paginate`, `jekyll-sitemap`, `jekyll-gist`, `jekyll-feed`, `jekyll-include-cache`)
- **Collections**: `portfolio` and `today-i-learned` with custom permalinks
- **Theme skin**: `default` (configurable via `minimal_mistakes_skin`)
- **Comments**: Disqus integration (`provider: "disqus"`, `shortname: "arshadmehmood"`)

## Development Workflow
```bash
# Local development
bundle exec jekyll serve

# Build for production  
bundle exec jekyll build

# Update TIL README (auto-generates category stats)
cd today-i-learned && python update_readme.py
```

## Custom Components
- **TIL Integration**: `_layouts/til.html` renders the auto-generated TIL README
- **Visibility Control**: Posts have `visible: true` flag (can be hidden without deletion)
- **Series Navigation**: Manual linking for post series (see DevOps Journey pattern)

## Asset Management
- **Images**: Store in `/assets/images/posts/` with consistent naming
- **Headers**: Both `image` and `teaser` should point to the same file
- **JavaScript**: Build process via npm scripts (`npm run build:js`)

## Integration Points
- **GitHub Pages**: Direct deployment from `master` branch
- **Disqus**: Comment system with site-specific shortname
- **Google Analytics**: Configured in `_config.yml`
- **Social Sharing**: Built-in Minimal Mistakes sharing buttons

## Common Gotchas
- **TIL files**: Never add frontmatter - breaks the auto-generation system
- **Jekyll serve**: Restart required for `_config.yml` changes
- **Collections**: TIL content appears both as collection items and via README inclusion
- **Breadcrumbs**: Enabled globally (`breadcrumbs: true`) but can be overridden per-page

## Content Guidelines
- **Code blocks**: Use triple backticks with language specification
- **Categories**: Consistent capitalization (Software, DevOps, Programming)
- **Tags**: Use existing tags when possible, create sparingly
- **Links**: Prefer absolute paths for internal links (`/category/post-title/`)
