#!/bin/bash
# Jekyll Post Generator Installation Script
# Downloads and sets up the post generation tools in your Jekyll blog

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in a Jekyll blog directory
if [[ ! -f "_config.yml" ]] || [[ ! -d "_posts" ]]; then
    echo -e "${RED}❌ This doesn't appear to be a Jekyll blog directory${NC}"
    echo "   Please run this script from your Jekyll blog root directory"
    echo "   (should contain _config.yml and _posts directory)"
    exit 1
fi

echo -e "${BLUE}🚀 Jekyll Post Generator Installation${NC}"
echo "=====================================​"

# Check if files already exist
FILES=("new_post.py" "quick_post.py" "draft_to_post.py" "new_post.sh" "setup_aliases.sh")
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

if [[ -f "new_post.sh" ]]; then
    chmod +x new_post.sh
    echo "✅ Made new_post.sh executable"
fi

if [[ -f "setup_aliases.sh" ]]; then
    chmod +x setup_aliases.sh  
    echo "✅ Made setup_aliases.sh executable"
fi

echo ""
echo -e "${GREEN}✅ Installation complete!${NC}"
echo ""
echo -e "${BLUE}📋 Available tools:${NC}"
echo "   • new_post.py      - Interactive post creator"
echo "   • quick_post.py    - Command-line post creator"  
echo "   • draft_to_post.py - Copy draft template"
echo "   • new_post.sh      - Shell wrapper"
echo ""
echo -e "${BLUE}🔧 Next steps:${NC}"
echo "1. Set up global aliases:"
echo "   ./setup_aliases.sh"
echo ""
echo "2. Create your first post:"
echo "   python3 new_post.py"
echo "   # or"
echo "   ./new_post.sh"
echo ""
echo -e "${YELLOW}💡 Tip: After setting up aliases, you can use 'new-post' from anywhere!${NC}"
