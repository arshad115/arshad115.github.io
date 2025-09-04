# Minimal Mistakes Update Strategy

## Phase 1: Backup and Prepare

1. **Create a backup branch:**
```bash
git checkout -b backup-before-update
git push origin backup-before-update
```

2. **Update Gemfile dependencies:**
```ruby
# Add this to your Gemfile
gem 'jekyll-include-cache'

# Update github-pages
gem 'github-pages', group: :jekyll_plugins
```

3. **Run bundle update:**
```bash
bundle update
```

## Phase 2: Strategic Merge

1. **Create update branch:**
```bash
git checkout master
git checkout -b feature/upstream-update
```

2. **Merge with strategy (auto-resolve in your favor for configs):**
```bash
# Merge but keep your _config.yml, Gemfile, and custom pages
git merge upstream/master --strategy-option=ours --no-commit

# Then selectively add upstream changes to core theme files
git checkout upstream/master -- _includes/_sass _layouts

# Restore your custom files
git checkout HEAD -- _config.yml Gemfile _pages/ _posts/ _portfolio/
git checkout HEAD -- _includes/author-profile-custom-links.html
git checkout HEAD -- _includes/project-head.html  
git checkout HEAD -- _layouts/til.html
git checkout HEAD -- _layouts/projects.html
git checkout HEAD -- assets/css/projects/
git checkout HEAD -- assets/js/projects/
```

## Phase 3: Resolve Conflicts

Your custom files that need manual review:
- `_includes/author-profile.html` (if you customized it)
- `_layouts/single.html` (if you customized it)
- Any custom CSS in `assets/css/`

## Phase 4: Test Thoroughly

1. **Test locally:**
```bash
bundle exec jekyll serve
```

2. **Check these key areas:**
- [ ] Homepage loads correctly
- [ ] Blog posts display properly
- [ ] Today I Learned section works
- [ ] Projects page functions
- [ ] Author sidebar displays correctly
- [ ] Comments work (Disqus)
- [ ] Analytics tracking works
- [ ] Mobile responsiveness

## Phase 5: Deploy

1. **If tests pass:**
```bash
git add .
git commit -m "feat: update to minimal-mistakes 4.27.x"
git push origin feature/upstream-update
```

2. **Create PR and test on staging**

3. **Merge to master when ready**

## Rollback Plan

If anything breaks:
```bash
git checkout master
git reset --hard backup-before-update
git push --force-with-lease origin master
```
