#!/usr/bin/env bash
set -euo pipefail

# Default: checkout the commit recorded in this repo.
# Pass --remote to move today-i-learned to upstream HEAD (review before committing).

cd "$(dirname "$0")/.."

if [[ ! -f .gitmodules ]]; then
  echo "Run this from the site repo root." >&2
  exit 1
fi

remote=0
if [[ "${1:-}" == "--remote" ]]; then
  remote=1
elif [[ -n "${1:-}" ]]; then
  echo "Usage: $0 [--remote]" >&2
  exit 1
fi

git submodule update --init --recursive
if [[ "$remote" -eq 1 ]]; then
  git submodule update --remote today-i-learned
fi
git status --short today-i-learned
if [[ "$remote" -eq 1 ]]; then
  echo "Commit the submodule pointer when you want it published: git add today-i-learned && git commit"
else
  echo "Pinned today-i-learned is checked out. Pass --remote to fetch upstream HEAD."
fi
