#!/usr/bin/env python3
"""
Draft to Post Converter
Copies the draft template to create a new post with today's date.
Usage: python3 draft_to_post.py "Post Title"
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

def copy_draft_template(title):
    """Copy the draft template to create a new post"""
    
    # Load template
    template_path = "_drafts/post-template.md"
    if not os.path.exists(template_path):
        print(f"❌ Template not found: {template_path}")
        return False
    
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Error reading template: {e}")
        return False
    
    # Generate filename
    today = datetime.now()
    date_str = today.strftime("%Y-%m-%d")
    slug = slugify(title)
    filename = f"{date_str}-{slug}.md"
    filepath = os.path.join("_posts", filename)
    
    # Check if file already exists
    if os.path.exists(filepath):
        print(f"❌ File {filename} already exists!")
        return False
    
    # Update template with current date and title
    content = content.replace('title: "Your Post Title Here"', f'title: "{title}"')
    content = content.replace('date: 2025-01-15', f'date: {today.strftime("%Y-%m-%d")}')
    content = content.replace('last_modified_at: 2025-01-15', f'last_modified_at: {today.strftime("%Y-%m-%d")}')
    
    # Create _posts directory if it doesn't exist
    os.makedirs("_posts", exist_ok=True)
    
    # Write the file
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Post created from template: {filepath}")
        print(f"🌐 URL slug: {slug}")
        print(f"📝 Edit the file to customize categories, tags, and content.")
        return True
        
    except Exception as e:
        print(f"❌ Error creating post: {e}")
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 draft_to_post.py \"Post Title\"")
        print("Example: python3 draft_to_post.py \"My Awesome New Post\"")
        sys.exit(1)
    
    title = sys.argv[1]
    
    # Change to script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    copy_draft_template(title)

if __name__ == "__main__":
    main()
