#!/usr/bin/env python3
"""
Jekyll Post Generator
Creates a new blog post with proper front matter and filename structure.
"""

import os
import sys
from datetime import datetime
import re

def slugify(text):
    """Convert text to URL-friendly slug"""
    # Convert to lowercase and replace spaces with hyphens
    slug = text.lower().strip()
    # Remove special characters except hyphens and alphanumeric
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    # Replace spaces and multiple hyphens with single hyphen
    slug = re.sub(r'[\s-]+', '-', slug)
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    return slug

def get_categories():
    """Get available categories from existing posts"""
    posts_dir = "_posts"
    categories = set()
    
    if os.path.exists(posts_dir):
        for filename in os.listdir(posts_dir):
            if filename.endswith('.md'):
                try:
                    with open(os.path.join(posts_dir, filename), 'r', encoding='utf-8') as f:
                        content = f.read()
                        # Extract category from front matter
                        if 'category:' in content:
                            lines = content.split('\n')
                            for line in lines:
                                if line.strip().startswith('category:'):
                                    cat = line.split(':', 1)[1].strip().strip('"\'')
                                    if cat:
                                        categories.add(cat)
                except:
                    continue
    
    return sorted(list(categories))

def load_template():
    """Load the post template from _drafts/post-template.md"""
    template_path = "_drafts/post-template.md"
    if os.path.exists(template_path):
        try:
            with open(template_path, 'r', encoding='utf-8') as f:
                return f.read()
        except:
            pass
    return None

def create_post():
    """Main function to create a new post"""
    print("🚀 Jekyll Post Generator")
    print("=" * 40)
    
    # Get post title
    while True:
        title = input("📝 Post Title: ").strip()
        if title:
            break
        print("❌ Title cannot be empty!")
    
    # Get post category
    existing_categories = get_categories()
    if existing_categories:
        print(f"\n📂 Existing categories: {', '.join(existing_categories)}")
    
    category = input("📂 Category (default: Software): ").strip()
    if not category:
        category = "Software"
    
    # Get tags
    print("\n🏷️  Tags (comma-separated, or press Enter to skip):")
    tags_input = input("   Tags: ").strip()
    tags = []
    if tags_input:
        tags = [tag.strip() for tag in tags_input.split(',') if tag.strip()]
    
    # Get excerpt
    excerpt = input("\n📄 Excerpt (optional): ").strip()
    
    # Ask for header image
    header_image = input("\n🖼️  Header Image URL (optional): ").strip()
    
    # Ask for teaser image
    teaser_image = input("🖼️  Teaser Image URL (optional): ").strip()
    
    # Ask for caption
    caption = ""
    if header_image:
        caption = input("📝 Image Caption (optional): ").strip()
    
    # Generate filename
    today = datetime.now()
    date_str = today.strftime("%Y-%m-%d")
    slug = slugify(title)
    filename = f"{date_str}-{slug}.md"
    filepath = os.path.join("_posts", filename)
    
    # Check if file already exists
    if os.path.exists(filepath):
        print(f"\n❌ File {filename} already exists!")
        overwrite = input("Do you want to overwrite it? (y/N): ").strip().lower()
        if overwrite != 'y':
            print("Aborted.")
            return
    
    # Load template and customize it
    template_content = load_template()
    if template_content:
        # Use template and replace placeholders
        content = template_content
        content = content.replace('title: "Your Post Title Here"', f'title: "{title}"')
        content = content.replace('category: Software  # or other categories', f'category: {category}')
        content = content.replace('date: 2025-01-15', f'date: {today.strftime("%Y-%m-%d")}')
        content = content.replace('last_modified_at: 2025-01-15', f'last_modified_at: {today.strftime("%Y-%m-%d")}')
        
        if excerpt:
            content = content.replace('excerpt: "Brief description that appears in previews and social shares"', f'excerpt: "{excerpt}"')
        else:
            content = content.replace('excerpt: "Brief description that appears in previews and social shares"\n', '')
        
        # Replace tags
        if tags:
            tags_yaml = "tags:\n" + "\n".join([f"  - {tag}" for tag in tags])
            content = content.replace('tags: \n  - DevOps\n  - Kubernetes\n  - Tutorial', tags_yaml)
        else:
            # Remove default tags section
            import re
            content = re.sub(r'tags: \n(?:  - .*\n)*', '', content)
        
        # Replace header images
        if header_image:
            content = content.replace('image: /assets/images/posts/your-header-image.jpg', f'image: {header_image}')
            if teaser_image:
                content = content.replace('teaser: /assets/images/posts/your-teaser-image.jpg', f'teaser: {teaser_image}')
            else:
                content = content.replace('\n  teaser: /assets/images/posts/your-teaser-image.jpg', '')
            if caption:
                content = content.replace('caption: "Photo credit: [**Source**](https://example.com)"', f'caption: "{caption}"')
            else:
                content = content.replace('\n  caption: "Photo credit: [**Source**](https://example.com)"', '')
        else:
            # Remove header section if no images
            import re
            content = re.sub(r'header:\n(?:  .*\n)*', '', content)
    else:
        # Fallback to original front matter creation
        front_matter = ["---"]
        front_matter.append(f'title: "{title}"')
        
        if excerpt:
            front_matter.append(f'excerpt: "{excerpt}"')
        
        front_matter.append(f"category: {category}")
        
        if tags:
            front_matter.append("tags:")
            for tag in tags:
                front_matter.append(f"  - {tag}")
        
        if header_image or teaser_image:
            front_matter.append("header:")
            if header_image:
                front_matter.append(f'  image: {header_image}')
            if teaser_image:
                front_matter.append(f'  teaser: {teaser_image}')
            if caption:
                front_matter.append(f'  caption: "{caption}"')
        
        front_matter.extend([
            "toc: true",
            "toc_sticky: true", 
            "comments: true",
            f"date: {today.strftime('%Y-%m-%d')}",
            f"last_modified_at: {today.strftime('%Y-%m-%d')}",
            "author_profile: true",
            "read_time: true",
            "share: true",
            "related: true",
            "---",
            "",
            "## Introduction",
            "",
            f"Brief introduction to {title}...",
            "",
            "## Main Content",
            "",
            "Your detailed content here...",
            "",
            "## Conclusion",
            "",
            "Wrap up your post...",
            ""
        ])
        content = '\n'.join(front_matter)
    
    # Create _posts directory if it doesn't exist
    os.makedirs("_posts", exist_ok=True)
    
    # Write the file
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"\n✅ Post created successfully!")
        print(f"📁 File: {filepath}")
        print(f"🌐 URL slug: {slug}")
        print(f"\n💡 Edit the file to add your content, then commit and push to publish.")
        
        # Ask if user wants to open the file
        if sys.platform == "darwin":  # macOS
            open_file = input("\n🔍 Open the file now? (Y/n): ").strip().lower()
            if open_file != 'n':
                os.system(f'open "{filepath}"')
        
    except Exception as e:
        print(f"\n❌ Error creating post: {e}")

if __name__ == "__main__":
    # Change to the script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    try:
        create_post()
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!")
    except Exception as e:
        print(f"\n❌ An error occurred: {e}")
