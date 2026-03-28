#!/bin/bash

# Setup script for git hooks and submodule management
# This script sets up the pre-commit hook and provides utilities for submodule management

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}🔧 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

echo "Git Hooks and Submodule Setup"
echo "=============================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "This script must be run from the root of a git repository"
    exit 1
fi

# Check if .gitmodules exists
if [ ! -f ".gitmodules" ]; then
    print_warning ".gitmodules file not found - this repository may not have submodules"
fi

print_status "Setting up git hooks..."
HOOK_SOURCE="scripts/hooks/pre-commit"
HOOK_TARGET="$(git rev-parse --git-path hooks/pre-commit)"

# Make sure hooks directory exists
if [ ! -d "$(dirname "$HOOK_TARGET")" ]; then
    mkdir -p "$(dirname "$HOOK_TARGET")"
    print_status "Created git hooks directory"
fi

# Check if pre-commit hook already exists
if [ -f "$HOOK_TARGET" ]; then
    print_warning "Existing pre-commit hook found"
    echo -n "Do you want to backup and replace it? (y/N): "
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        cp "$HOOK_TARGET" "$HOOK_TARGET.backup.$(date +%Y%m%d_%H%M%S)"
        print_status "Backed up existing pre-commit hook"
    else
        print_status "Keeping existing pre-commit hook"
        exit 0
    fi
fi

if [ ! -f "$HOOK_SOURCE" ]; then
    print_error "Hook source not found at $HOOK_SOURCE"
    exit 1
fi

cp "$HOOK_SOURCE" "$HOOK_TARGET"

# Make pre-commit hook executable
if [ -f "$HOOK_TARGET" ]; then
    chmod +x "$HOOK_TARGET"
    print_success "Pre-commit hook is now executable"
else
    print_error "Pre-commit hook file not found"
    exit 1
fi

# Make update script executable if it exists
if [ -f "scripts/update-submodule.sh" ]; then
    chmod +x scripts/update-submodule.sh
    print_success "scripts/update-submodule.sh is now executable"
fi

if [ -d "today-i-learned" ] && git -C today-i-learned rev-parse --git-dir > /dev/null 2>&1; then
    SUBMODULE_HOOK_TARGET="$(git -C today-i-learned rev-parse --git-path hooks/pre-commit)"
    if [ -f "today-i-learned/pre-commit-hook.sh" ]; then
        mkdir -p "$(dirname "$SUBMODULE_HOOK_TARGET")"
        cp today-i-learned/pre-commit-hook.sh "$SUBMODULE_HOOK_TARGET"
        chmod +x "$SUBMODULE_HOOK_TARGET"
        print_success "Installed today-i-learned pre-commit hook"
    else
        print_warning "today-i-learned/pre-commit-hook.sh not found"
    fi
fi

# Check dependencies
print_status "Checking dependencies..."

# Check for exiftool (optional for image processing)
if command -v exiftool &> /dev/null; then
    print_success "exiftool is installed"
else
    print_warning "exiftool is not installed"
    echo "  Install with: brew install exiftool"
    echo "  (Required for EXIF data removal from images)"
fi

# Test the pre-commit hook
print_status "Testing pre-commit hook..."
if "$HOOK_TARGET"; then
    print_success "Pre-commit hook test passed"
else
    print_error "Pre-commit hook test failed"
    exit 1
fi

echo ""
print_success "Setup completed successfully!"
echo ""
echo "Available commands:"
echo "  ./scripts/update-submodule.sh             - Update submodule manually"
echo "  ./scripts/update-submodule.sh --no-commit - Update submodule without committing"
echo ""
echo "The pre-commit hook will automatically:"
echo "  1. Refresh generated Astro content when relevant files change"
echo "  2. Stage refreshed generated content for the commit"
echo "  3. Keep the today-i-learned submodule hook installed for README updates"
