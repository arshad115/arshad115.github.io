# Astro + Starlight Migration Plan with Backup Branch, Deploy Action, and Script Reorganization

## Summary
Create a safety backup of current `master`, then perform the Astro + Starlight migration on a separate feature branch. The new site will use Starlight as the shell for the whole website, replace Disqus with Giscus, preserve all public URLs, keep the `today-i-learned` submodule workflow, add inline local-neighborhood graphs via [`starlight-site-graph`](https://github.com/Fevol/starlight-site-graph), add a GitHub Pages deploy workflow for Astro, move custom helper scripts into a top-level `scripts/` folder, and preserve the existing hook workflow.

Recommended branches:
- `backup/master-before-astro-starlight-migration`
- `codex/astro-starlight-migration`

A dedicated global graph page is explicitly deferred to a later phase.

## Key Implementation Changes
### 1. Git safety and branch setup
- Verify `master` is clean and current.
- Create `backup/master-before-astro-starlight-migration` from the current `master` HEAD and leave it unchanged.
- Create `codex/astro-starlight-migration` from the same `master` HEAD.
- Perform all migration commits only on `codex/astro-starlight-migration`.
- Preserve the current `today-i-learned` submodule pointer at branch creation time unless the migration explicitly updates it.

### 2. Astro + Starlight migration
- Create a new Astro app at the repo root and make it the new runtime/build system.
- Add Starlight as the primary site shell for the entire site.
- Add `starlight-site-graph` and configure v1 inline local-neighborhood graphs on content pages.
- Migrate content into Astro collections for:
  - blog posts
  - portfolio
  - static pages
  - TIL content from the submodule
- Preserve all current public URLs.
- Rename `projects` to `portfolio` everywhere in the new implementation.
- Replace Disqus with Giscus.
- Keep the contact page route and Wufoo behavior in v1.
- Keep the TIL submodule workflow, but rebuild rendering from actual TIL markdown files rather than the current Jekyll page loop.

### 3. Rendering and routing
- Rebuild the home page inside the Starlight shell.
- Rebuild posts, categories, tags, static pages, TIL landing page, and portfolio landing page in Astro.
- Keep `/portfolio/` as the canonical route.
- Keep `/today-i-learned/` as the canonical TIL route.
- Keep old page/post URLs unchanged.
- Do not add the global graph page in this phase, but keep the graph data/config compatible with adding it later.

### 4. GitHub Actions
- Replace the current Jekyll Pages workflow with a new Astro GitHub Pages workflow in `.github/workflows/`.
- Trigger the Astro deploy workflow on:
  - push to `master`
  - `workflow_dispatch`
- Build the Astro site, upload the Pages artifact, and deploy via the standard GitHub Pages actions flow.
- Keep the existing submodule update workflow, but adapt it to the new repo structure and Astro build assumptions.
- Ensure the deploy workflow initializes submodules before build so TIL content is available.
- Do not deploy automatically from the migration branch.

### 5. Script reorganization
- Move custom helper scripts from the repo root into a top-level `scripts/` directory.
- Move current repo-local helper scripts into `scripts/`, including:
  - post creation helpers
  - draft conversion helpers
  - install/setup helpers
  - submodule update helpers
- Update README/docs and any workflow/hook references to use the new `scripts/...` paths.
- Keep script names descriptive and kebab-case or current naming consistently; no mixed path conventions.
- Root-level script entrypoints should be removed after references are updated, except where a compatibility wrapper is intentionally kept for transition.

### 6. Hooks preservation
- Preserve the current hook behavior:
  - pre-commit hook support remains
  - TIL README/update behavior remains
  - submodule-related hook behavior remains if currently relied on
- Store version-controlled hook source under `scripts/hooks/` in the Astro branch.
- Keep installation target as `.git/hooks/...`; the hooks remain actual git hooks, not ad hoc npm commands.
- Update the hook setup script to install/copy/symlink from `scripts/hooks/` into `.git/hooks/`.
- Update any hardcoded root-level script paths inside hook scripts to the new `scripts/` locations.
- Preserve existing local developer workflow: one command should still install/refresh hooks after cloning.

## Public Interfaces / Schemas
- Define Astro content schemas for:
  - posts
  - portfolio entries
  - static pages
  - TIL entries
- Required normalized fields:
  - `title`
  - `description` or `excerpt`
  - `pubDate`
  - `tags`
  - `draft`
  - optional `hero`/`teaser` image
- Optional graph fields:
  - `graph`
  - `aliases`
- `portfolio` is the only public-facing collection/category name for that section.
- No public URL changes are allowed.

## Test Plan
- Git safety:
  - backup branch points exactly to the original `master` HEAD
  - migration branch starts from the same commit
- Content parity:
  - posts, pages, TIL, and portfolio routes resolve as before
- Terminology:
  - no user-facing `projects` labels remain
- TIL:
  - build fails clearly if the submodule is missing
  - submodule content renders correctly when initialized
- Graph:
  - inline graph appears on posts, TIL pages, and portfolio pages
  - local-neighborhood behavior works
  - no dedicated global graph route exists yet
- Scripts:
  - all helper scripts run from `scripts/`
  - no broken references remain to deleted root-level script paths
- Hooks:
  - hook install command works
  - installed pre-commit hook executes successfully from `.git/hooks/`
  - hook logic still calls the moved helper scripts correctly
- GitHub Actions:
  - Astro Pages workflow deploys on push to `master`
  - manual dispatch still works
  - submodule update workflow still functions after path changes
- Integrations:
  - Giscus renders where expected
  - analytics works in production
  - contact form still submits

## Assumptions
- Backup branch is created first and then left untouched.
- Migration work happens only on `codex/astro-starlight-migration`.
- Starlight is the shell for the whole site.
- `projects` is fully renamed to `portfolio`.
- Giscus replaces Disqus during migration.
- `starlight-site-graph` is used for v1 inline graphs.
- Global graph page is deferred.
- Custom helper scripts move to `scripts/`.
- Hooks are preserved as git hooks and their source is versioned under `scripts/hooks/`.
- GitHub Pages deployment should run automatically on pushes to `master` and manually via dispatch.
- The scheduled/manual TIL submodule updater remains and is adapted, not removed.
