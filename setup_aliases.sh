#!/bin/bash
# Setup aliases for Jekyll post generation
# Run this once to add aliases to your shell profile

# Get the directory where this script is located (should be the blog root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BLOG_DIR="$SCRIPT_DIR"

# Verify this looks like a Jekyll blog directory
if [[ ! -f "$BLOG_DIR/_config.yml" ]] || [[ ! -d "$BLOG_DIR/_posts" ]]; then
    echo "❌ This doesn't appear to be a Jekyll blog directory"
    echo "   Missing _config.yml or _posts directory"
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

echo "🔧 Setting up Jekyll post generation aliases..."
echo "📁 Using blog directory: $BLOG_DIR"
echo "📝 Adding to: $SHELL_PROFILE"

# Create backup
cp "$SHELL_PROFILE" "${SHELL_PROFILE}.backup"

# Add aliases
cat >> "$SHELL_PROFILE" << EOF

# Jekyll Blog Post Generation Aliases
alias new-post='cd "$BLOG_DIR" && python3 new_post.py'
alias quick-post='cd "$BLOG_DIR" && python3 quick_post.py'
alias draft-post='cd "$BLOG_DIR" && python3 draft_to_post.py'
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
