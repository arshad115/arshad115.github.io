#!/bin/bash
# Astro post generator shell wrapper.
# Makes it easy to create new blog posts

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Change to the repository root
cd "$REPO_ROOT"

# Run the Python script
python3 scripts/new_post.py
