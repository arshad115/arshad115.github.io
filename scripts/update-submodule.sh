#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f .gitmodules ]]; then
  echo "Run this from the site repo root." >&2
  exit 1
fi

git submodule update --init --recursive
git submodule update --remote today-i-learned
git status --short today-i-learned
echo "Commit the submodule pointer when you want it published: git add today-i-learned && git commit"
