#!/bin/bash
# Jekyll Post Generator - Shell Wrapper
# Makes it easy to create new blog posts

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to the script directory
cd "$SCRIPT_DIR"

# Run the Python script
python3 new_post.py
