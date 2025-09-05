# Jekyll Post Generator

An easy way to create new blog posts for your Jekyll site without manually creating files and front matter. **Now uses your existing draft template** from `_drafts/post-template.md` to ensure consistency.

## Quick Installation

```bash
# From your Jekyll blog root directory
./install.sh    # Sets up and configures all tools
./setup_aliases.sh    # Optional: Create global aliases
```

## Usage

### Option 1: Interactive Mode (Full Template)
```bash
cd arshad115.github.io
python3 new_post.py
# or
./new_post.sh
```

### Option 2: Quick Command-Line Mode
```bash
cd arshad115.github.io
python3 quick_post.py "Post Title" "Category" "tag1,tag2"
```

### Option 3: Copy Draft Template Directly
```bash
cd arshad115.github.io
python3 draft_to_post.py "Post Title"
```

### Option 4: Use Global Aliases (Recommended)
```bash
# Run once to set up aliases (from your blog directory)
./setup_aliases.sh

# Then restart terminal and use anywhere:
new-post          # Interactive mode
quick-post "Title" "Category" "tags"  # Quick mode
draft-post "Title"  # Copy draft template
blog-dir          # Navigate to blog directory
```

The setup script automatically detects your blog directory and creates portable aliases.

## Features

- ✅ **Portable and self-contained** - No hardcoded paths, works anywhere
- ✅ **Uses your draft template** automatically loads `_drafts/post-template.md`
- ✅ **Interactive prompts** for all post details
- ✅ **Automatic filename generation** with proper date format (YYYY-MM-DD-title-slug.md)
- ✅ **Smart slugification** converts titles to URL-friendly slugs
- ✅ **Category suggestions** based on existing posts
- ✅ **Template-based front matter** uses your existing structure
- ✅ **Tag support** with comma-separated input
- ✅ **Image support** for headers and teasers
- ✅ **File existence check** prevents accidental overwrites
- ✅ **Auto-open file** on macOS after creation
- ✅ **Multiple creation modes** - interactive, quick, or template copy
- ✅ **Jekyll validation** ensures scripts run in proper blog directory

## Generated Front Matter

The script generates posts with this front matter structure:

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

## Example Usage

```
🚀 Jekyll Post Generator
========================================
📝 Post Title: My Awesome New Blog Post
📂 Existing categories: Software, Tutorial, DevOps
📂 Category (default: Software): Tutorial
🏷️  Tags (comma-separated, or press Enter to skip):
   Tags: Docker, Kubernetes, DevOps
📄 Excerpt (optional): Learn how to deploy apps with Docker and Kubernetes
🖼️  Header Image URL (optional): https://example.com/header.jpg
🖼️  Teaser Image URL (optional): https://example.com/teaser.jpg

✅ Post created successfully!
📁 File: _posts/2025-01-15-my-awesome-new-blog-post.md
🌐 URL slug: my-awesome-new-blog-post
```

## File Structure

- `new_post.py` - Interactive post creator with full template integration
- `quick_post.py` - Command-line post creator with simplified template  
- `draft_to_post.py` - Direct copy of draft template with date updates
- `new_post.sh` - Shell wrapper for easier execution
- `setup_aliases.sh` - Sets up convenient shell aliases
- `POST_GENERATOR_README.md` - This documentation

## Template Integration

All scripts now automatically use your existing `_drafts/post-template.md`:

- **`new_post.py`** - Uses template with interactive customization
- **`quick_post.py`** - Uses template with simplified prompts (removes images/excerpt)  
- **`draft_to_post.py`** - Direct template copy with only title and date changes

This ensures all your posts maintain the same structure and formatting as your established template.

## Requirements

- Python 3.x
- Jekyll blog with `_posts` directory structure
- `_drafts/post-template.md` template file (automatically detected)
