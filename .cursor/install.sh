#!/usr/bin/env bash
# Cloud Agent bootstrap for the plain Astro site.
# Idempotent: safe to run repeatedly and against cached state.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

if command -v nvm >/dev/null 2>&1; then
  # shellcheck disable=SC1091
  nvm install 20 >/dev/null
  nvm use 20 >/dev/null
fi

git submodule update --init --recursive

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

echo "Environment ready: $(node --version)"
