#!/usr/bin/env bash
# Cloud Agent bootstrap for the Jekyll (Minimal Mistakes) blog.
# Idempotent: safe to run repeatedly and against cached state.
set -euo pipefail

RUBY_VERSION="3.1.6"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# 1. System build dependencies required to compile Ruby and native gems.
#    github-pages pins liquid 4.0.3, which relies on Object#tainted? (removed in
#    Ruby 3.2), so the toolchain must be Ruby 3.1 to match CI (ruby/setup-ruby 3.1).
if ! dpkg -s build-essential >/dev/null 2>&1; then
  sudo DEBIAN_FRONTEND=noninteractive apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    autoconf patch build-essential rustc libssl-dev libyaml-dev libreadline6-dev \
    zlib1g-dev libgmp-dev libncurses5-dev libffi-dev libgdbm6 libgdbm-dev \
    libdb-dev uuid-dev git curl
fi

# 2. rbenv + ruby-build, then Ruby 3.1.x (matches the GitHub Pages CI toolchain).
export RBENV_ROOT="$HOME/.rbenv"
if [ ! -d "$RBENV_ROOT" ]; then
  git clone --depth 1 https://github.com/rbenv/rbenv.git "$RBENV_ROOT"
fi
if [ ! -d "$RBENV_ROOT/plugins/ruby-build" ]; then
  git clone --depth 1 https://github.com/rbenv/ruby-build.git "$RBENV_ROOT/plugins/ruby-build"
fi
export PATH="$RBENV_ROOT/bin:$PATH"
eval "$(rbenv init - bash)"

if ! rbenv versions --bare | grep -qx "$RUBY_VERSION"; then
  rbenv install -s "$RUBY_VERSION"
fi
rbenv global "$RUBY_VERSION"
rbenv rehash

# Persist rbenv for interactive shells and terminals.
if ! grep -q 'rbenv init' "$HOME/.bashrc" 2>/dev/null; then
  {
    echo ''
    echo '# rbenv (Ruby version manager)'
    echo 'export PATH="$HOME/.rbenv/bin:$PATH"'
    echo 'eval "$(rbenv init - bash)"'
  } >> "$HOME/.bashrc"
fi

# 3. Bundler.
if ! gem list -i bundler >/dev/null 2>&1; then
  gem install bundler --no-document
  rbenv rehash
fi

# 4. Blog content submodule (the "today-i-learned" collection).
git submodule update --init --recursive

# 5. Ruby gem dependencies into a project-local, gitignored path.
bundle config set --local path vendor/bundle
bundle install

echo "Environment ready: $(ruby --version)"
