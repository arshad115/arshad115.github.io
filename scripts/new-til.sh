#!/usr/bin/env bash
# Create a TIL note in the today-i-learned submodule. Run from anywhere:
#   ./scripts/new-til.sh "Title" git
#   ./scripts/new-til.sh "Title" git --template --readme
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required (see .nvmrc). On a Mac with nvm: nvm use" >&2
  exit 1
fi
exec node "$ROOT/scripts/new-til.mjs" "$@"
