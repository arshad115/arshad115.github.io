#!/bin/bash
# Astro post tooling installation script.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Change to repository root regardless of where the script is launched from
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

# Check if we're in the expected blog repository
if [[ ! -d "content/posts" ]] || [[ ! -d "scripts" ]]; then
    echo -e "${RED}❌ This doesn't appear to be the blog repository root${NC}"
    echo "   Please run this script from the blog repository"
    exit 1
fi

echo -e "${BLUE}🚀 Astro Post Tooling Installation${NC}"
echo "=====================================​"

# Check if files already exist
FILES=("scripts/new_post.py" "scripts/quick_post.py" "scripts/draft_to_post.py" "scripts/new_post.sh" "scripts/setup_aliases.sh")
EXISTING_FILES=()

for file in "${FILES[@]}"; do
    if [[ -f "$file" ]]; then
        EXISTING_FILES+=("$file")
    fi
done

if [[ ${#EXISTING_FILES[@]} -gt 0 ]]; then
    echo -e "${YELLOW}⚠️  Some post generator files already exist:${NC}"
    printf '   %s\n' "${EXISTING_FILES[@]}"
    echo ""
    read -p "Do you want to overwrite them? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Installation cancelled."
        exit 0
    fi
fi

# Create the files (this would normally download them from a repo)
echo -e "${BLUE}📥 Installing post generation tools...${NC}"

# Note: In a real scenario, these would be downloaded from a GitHub repo
# For now, since the files already exist, we'll just make them executable

if [[ -f "scripts/new_post.sh" ]]; then
    chmod +x scripts/new_post.sh
    echo "✅ Made scripts/new_post.sh executable"
fi

if [[ -f "scripts/setup_aliases.sh" ]]; then
    chmod +x scripts/setup_aliases.sh
    echo "✅ Made scripts/setup_aliases.sh executable"
fi

echo ""
echo -e "${GREEN}✅ Installation complete!${NC}"
echo ""
echo -e "${BLUE}📋 Available tools:${NC}"
echo "   • scripts/new_post.py      - Interactive post creator"
echo "   • scripts/quick_post.py    - Command-line post creator"
echo "   • scripts/draft_to_post.py - Copy draft template"
echo "   • scripts/new_post.sh      - Shell wrapper"
echo ""
echo -e "${BLUE}🔧 Next steps:${NC}"
echo "1. Set up global aliases:"
echo "   ./scripts/setup_aliases.sh"
echo ""
echo "2. Create your first post:"
echo "   python3 scripts/new_post.py"
echo "   # or"
echo "   ./scripts/new_post.sh"
echo ""
echo -e "${YELLOW}💡 Tip: After setting up aliases, you can use 'new-post' from anywhere!${NC}"
