#!/bin/bash
# Setup aliases for Astro post generation.

# Get the repository root from the scripts directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BLOG_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Verify this looks like the blog repository
if [[ ! -d "$BLOG_DIR/content/posts" ]] || [[ ! -d "$BLOG_DIR/scripts" ]]; then
    echo "❌ This doesn't appear to be the blog repository root"
    echo "   Missing content/posts or scripts directory"
    echo "   Current directory: $BLOG_DIR"
    exit 1
fi

SHELL_PROFILE=""

# Detect shell profile
if [ -f ~/.zshrc ]; then
    SHELL_PROFILE="$HOME/.zshrc"
elif [ -f ~/.bashrc ]; then
    SHELL_PROFILE="$HOME/.bashrc"
elif [ -f ~/.bash_profile ]; then
    SHELL_PROFILE="$HOME/.bash_profile"
else
    echo "❌ Could not find shell profile file"
    exit 1
fi

echo "🔧 Setting up blog post generation aliases..."
echo "📁 Using blog directory: $BLOG_DIR"
echo "📝 Adding to: $SHELL_PROFILE"

# Create backup
cp "$SHELL_PROFILE" "${SHELL_PROFILE}.backup"

# Add aliases
cat >> "$SHELL_PROFILE" << EOF

# Blog Post Generation Aliases
alias new-post='cd "$BLOG_DIR" && python3 scripts/new_post.py'
alias quick-post='cd "$BLOG_DIR" && python3 scripts/quick_post.py'
alias draft-post='cd "$BLOG_DIR" && python3 scripts/draft_to_post.py'
alias blog-dir='cd "$BLOG_DIR"'
EOF

echo ""
echo "✅ Aliases added successfully!"
echo ""
echo "📋 Available commands after restarting your terminal:"
echo "   • new-post      - Interactive post creator (uses template)"
echo "   • quick-post    - Command-line post creator (simplified template)"
echo "   • draft-post    - Copy draft template directly"
echo "   • blog-dir      - Navigate to blog directory"
echo ""
echo "📖 Usage examples:"
echo '   new-post'
echo '   quick-post "My New Post" "Tutorial" "Docker,Kubernetes"'
echo '   draft-post "My Template Post"'
echo ""
echo "🔄 Restart your terminal or run: source $SHELL_PROFILE"
