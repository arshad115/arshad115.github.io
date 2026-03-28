# Post Generator

Utilities for creating new blog posts from the shared draft template in `content/drafts/post-template.mdx`.

## Setup

From the repository root:

```bash
./scripts/install.sh
./scripts/setup_aliases.sh
```

## Usage

### Interactive mode

```bash
python3 scripts/new_post.py
# or
./scripts/new_post.sh
```

### Quick CLI mode

```bash
python3 scripts/quick_post.py "Post Title" "Category" "tag1,tag2"
```

### Copy the draft template directly

```bash
python3 scripts/draft_to_post.py "Post Title"
```

### Optional aliases

```bash
./scripts/setup_aliases.sh
```

After reloading your shell:

```bash
new-post
quick-post "Title" "Category" "tags"
draft-post "Title"
blog-dir
```

## Features

- Portable scripts with no hardcoded machine-specific paths
- Reuses `content/drafts/post-template.mdx` and falls back to `.md` if needed
- Interactive prompts for title, excerpt, category, tags, and images
- Automatic filename slug generation and date prefixing
- Existing-category suggestions based on `content/posts/`
- File existence checks to avoid overwrites
- Optional macOS file open after creation

## Generated front matter

```yaml
---
title: "Your Post Title"
excerpt: "Brief description"
category: Software
tags:
  - Tag1
  - Tag2
header:
  image: "header-image-url"
  teaser: "teaser-image-url"
toc: true
toc_sticky: true
comments: true
date: 2025-01-15
last_modified_at: 2025-01-15
author_profile: true
read_time: true
share: true
---
```

## Files

- `scripts/new_post.py` - Interactive post creator
- `scripts/quick_post.py` - Command-line post creator
- `scripts/draft_to_post.py` - Template copy helper
- `scripts/new_post.sh` - Shell wrapper
- `scripts/setup_aliases.sh` - Alias installer

## Requirements

- Python 3.x
- `content/posts/` directory
- `content/drafts/post-template.mdx`
