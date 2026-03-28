#!/usr/bin/env python3
"""
Quick Astro post generator.
Creates a new blog post with minimal prompts.
Usage: python3 quick_post.py "Post Title" [category] [tags]
"""

import os
import sys
from datetime import datetime
import re

def slugify(text):
    """Convert text to URL-friendly slug"""
    slug = text.lower().strip()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    slug = slug.strip('-')
    return slug

def load_template():
    """Load the post template from content/drafts/post-template.mdx or .md"""
    for template_path in DRAFT_TEMPLATES:
        if os.path.exists(template_path):
            try:
                with open(template_path, 'r', encoding='utf-8') as f:
                    return f.read()
            except:
                pass
    return None

def create_quick_post(title, category="Software", tags_str=""):
    """Create a post with minimal front matter"""
    
    # Generate filename
    today = datetime.now()
    date_str = today.strftime("%Y-%m-%d")
    slug = slugify(title)
    filename = f"{date_str}-{slug}.mdx"
    filepath = os.path.join(POSTS_DIR, filename)
    
    # Check if file already exists
    if os.path.exists(filepath):
        print(f"❌ File {filename} already exists!")
        return False
    
    # Parse tags
    tags = []
    if tags_str:
        tags = [tag.strip() for tag in tags_str.split(',') if tag.strip()]
    
    # Load template and customize it for quick post
    template_content = load_template()
    if template_content:
        # Use template and replace placeholders
        content = template_content
        content = content.replace('title: "Your Post Title Here"', f'title: "{title}"')
        content = content.replace('category: Software  # or other categories', f'category: {category}')
        content = content.replace('date: 2025-01-15', f'date: {today.strftime("%Y-%m-%d")}')
        content = content.replace('last_modified_at: 2025-01-15', f'last_modified_at: {today.strftime("%Y-%m-%d")}')
        
        # Remove excerpt for quick posts
        content = content.replace('excerpt: "Brief description that appears in previews and social shares"\n', '')
        
        # Replace tags
        if tags:
            tags_yaml = "tags:\n" + "\n".join([f"  - {tag}" for tag in tags])
            content = content.replace('tags: \n  - DevOps\n  - Kubernetes\n  - Tutorial', tags_yaml)
        else:
            # Remove default tags section
            import re
            content = re.sub(r'tags: \n(?:  - .*\n)*', '', content)
        
        # Remove header section for quick posts
        import re
        content = re.sub(r'header:\n(?:  .*\n)*', '', content)
        
        # Simplify content for quick posts
        content = re.sub(r'## Introduction.*?## Main Content', f'## {title}\n\nYour content goes here...\n\n## Main Content', content, flags=re.DOTALL)
    else:
        # Fallback to simple front matter creation
        front_matter = [
            "---",
            f'title: "{title}"',
            f"category: {category}",
        ]
        
        if tags:
            front_matter.append("tags:")
            for tag in tags:
                front_matter.append(f"  - {tag}")
        
        front_matter.extend([
            "comments: true",
            f"date: {today.strftime('%Y-%m-%d')}",
            "---",
            "",
            f"## {title}",
            "",
            "Your content goes here...",
            ""
        ])
        content = '\n'.join(front_matter)
    
    os.makedirs(POSTS_DIR, exist_ok=True)
    
    # Write the file
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Post created: {filepath}")
        return True
        
    except Exception as e:
        print(f"❌ Error creating post: {e}")
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 quick_post.py \"Post Title\" [category] [tags]")
        print("Example: python3 quick_post.py \"My New Post\" \"Tutorial\" \"Docker,Kubernetes\"")
        sys.exit(1)
    
    title = sys.argv[1]
    category = sys.argv[2] if len(sys.argv) > 2 else "Software"
    tags = sys.argv[3] if len(sys.argv) > 3 else ""
    
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    os.chdir(repo_root)

    create_quick_post(title, category, tags)

if __name__ == "__main__":
    main()
POSTS_DIR = "content/posts"
DRAFT_TEMPLATES = ["content/drafts/post-template.mdx", "content/drafts/post-template.md"]
