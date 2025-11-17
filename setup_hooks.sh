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

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "This script must be run from the root of a git repository"
    exit 1
fi

# Check if .gitmodules exists
if [ ! -f ".gitmodules" ]; then
    print_warning ".gitmodules file not found - this repository may not have submodules"
fi

print_status "Setting up git hooks..."

# Make sure hooks directory exists
if [ ! -d ".git/hooks" ]; then
    mkdir -p .git/hooks
    print_status "Created .git/hooks directory"
fi

# Check if pre-commit hook already exists
if [ -f ".git/hooks/pre-commit" ]; then
    print_warning "Existing pre-commit hook found"
    echo -n "Do you want to backup and replace it? (y/N): "
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        cp .git/hooks/pre-commit .git/hooks/pre-commit.backup.$(date +%Y%m%d_%H%M%S)
        print_status "Backed up existing pre-commit hook"
    else
        print_status "Keeping existing pre-commit hook"
        exit 0
    fi
fi

# Make pre-commit hook executable
if [ -f ".git/hooks/pre-commit" ]; then
    chmod +x .git/hooks/pre-commit
    print_success "Pre-commit hook is now executable"
else
    print_error "Pre-commit hook file not found"
    exit 1
fi

# Make update_submodule.sh executable if it exists
if [ -f "update_submodule.sh" ]; then
    chmod +x update_submodule.sh
    print_success "update_submodule.sh is now executable"
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
if .git/hooks/pre-commit; then
    print_success "Pre-commit hook test passed"
else
    print_error "Pre-commit hook test failed"
    exit 1
fi

echo ""
print_success "Setup completed successfully!"
echo ""
echo "Available commands:"
echo "  ./update_submodule.sh           - Update submodule manually"
echo "  ./update_submodule.sh --no-commit - Update submodule without committing"
echo ""
echo "The pre-commit hook will automatically:"
echo "  1. Update the today-i-learned submodule"
echo "  2. Remove EXIF data from staged images"
echo "  3. Process all images in assets/images directory"
