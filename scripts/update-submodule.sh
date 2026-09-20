#!/bin/bash

# Script to update the today-i-learned submodule
# Usage: ./update_submodule.sh [--no-commit]

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}📚 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

# Check if we're in the right directory
if [ ! -f ".gitmodules" ]; then
    print_error "This script must be run from the root of the repository (where .gitmodules exists)"
    exit 1
fi

# Check if today-i-learned submodule exists
if [ ! -d "today-i-learned" ]; then
    print_error "today-i-learned submodule directory not found"
    exit 1
fi

print_status "Updating today-i-learned submodule..."

# Get current submodule commit hash
current_commit=$(git submodule status today-i-learned | awk '{print $1}' | sed 's/^[+-]//')

# Update submodule to latest remote
print_status "Fetching latest changes from remote..."
if git submodule update --remote today-i-learned; then
    print_success "Submodule updated successfully"
else
    print_error "Failed to update submodule"
    exit 1
fi

# Get new submodule commit hash
new_commit=$(git submodule status today-i-learned | awk '{print $1}' | sed 's/^[+-]//')

# Check if there were any changes
if [ "$current_commit" = "$new_commit" ]; then
    print_status "Submodule is already up to date"
    exit 0
fi

print_success "Submodule updated from $current_commit to $new_commit"

# Check command line arguments
AUTO_COMMIT=true
if [ "$1" = "--no-commit" ]; then
    AUTO_COMMIT=false
fi

if [ "$AUTO_COMMIT" = true ]; then
    # Stage the submodule changes
    print_status "Staging submodule changes..."
    git add today-i-learned
    
    # Get the latest commit message from the submodule
    cd today-i-learned
    latest_commit_msg=$(git log -1 --pretty=format:"%s")
    cd ..
    
    # Create commit message
    commit_msg="Update today-i-learned submodule

Latest commit: $latest_commit_msg
Updated to: $new_commit"
    
    print_status "Creating commit..."
    if git commit -m "$commit_msg"; then
        print_success "Submodule update committed successfully"
        print_status "You can now push the changes with: git push origin master"
    else
        print_warning "No changes to commit or commit failed"
    fi
else
    print_status "Changes staged but not committed (--no-commit flag used)"
    print_status "Run 'git add today-i-learned && git commit' to commit the changes"
fi

print_success "Script completed successfully"
