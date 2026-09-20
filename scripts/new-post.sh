#!/usr/bin/env bash
# Create a blog post. Run from anywhere:
#   ./scripts/new-post.sh "Title"
#   ./scripts/new-post.sh "Title" --category development --tags "go,cli"
#   ./scripts/new-post.sh "Title" --draft
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required (see .nvmrc). On a Mac with nvm: nvm use" >&2
  exit 1
fi
exec node "$ROOT/scripts/new-post.mjs" "$@"
