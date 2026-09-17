---
title: "Introducing Vault Linker"
excerpt: "Automatically link note titles in Obsidian vaults with the rebranded Vault Linker CLI and community plugin."
category: Development
tags:
  - obsidian
  - vault-linker
  - open-source
  - python
  - productivity
header:
  image: /assets/images/posts/vault-linker/before.png
  teaser: /assets/images/posts/vault-linker/before.png
toc: true
toc_sticky: true
comments: true
date: 2026-09-17
last_modified_at: 2026-09-17
author_profile: true
read_time: true
share: true
related: true
---

If you use Obsidian as a knowledge base, you have probably felt the gap between *having* hundreds of notes and *connecting* them. Manually turning every mention of a note title into a wikilink does not scale. That is what **Vault Linker** is for: it scans your vault, matches note titles (and YAML aliases) in prose, and inserts `[[wikilinks]]` where it is safe to do so—skipping front matter, code blocks, existing links, and embeds.

This project started as **Obsidian Linker**. Same idea, sharper name, and a much more capable toolset. The GitHub repo is now [vault-linker](https://github.com/arshad115/vault-linker), the PyPI package is [vaultlinker](https://pypi.org/project/vaultlinker/), and the Obsidian community plugin id is **vault-linker**. The old `obsidian-linker` console entry still works as an alias for the CLI, so existing scripts keep running.

If you read my earlier write-up, [Obsidian Notes Linker - Open Source Tool Released](/2025/01/28/obsidian-notes-linker-open-source/), this post is the successor: rebrand plus CLI depth, audit/unlink, parallelism, and a first-class plugin.

## Why rebrand?

“Obsidian Linker” described the use case but not the product. **Vault Linker** matches how people talk about their notes (a vault), works as a standalone CLI outside Obsidian, and lines up with the plugin listing. One name for the repo, package, and plugin makes discovery and support simpler.

## What it does to your graph

On a large garden-style vault, the difference is dramatic: isolated dots turn into a navigable graph.

### Before linking

![Obsidian graph view before Vault Linker — mostly isolated notes]({{ "/assets/images/posts/vault-linker/before.png" | absolute_url }})
*Graph view before linking: most notes had no wikilinks.*

### After linking

![Obsidian graph view after Vault Linker — dense wikilink connections]({{ "/assets/images/posts/vault-linker/after.png" | absolute_url }})
*Same vault after a link pass: titles and aliases wired together automatically.*

> **Tip:** Run with `--dry-run` first, and use `--backup` when you are ready to write in place. Vault Linker changes file contents; treat it like any bulk editor.

## CLI: built for real vaults

The command is `vaultlinker` (from `pip install vaultlinker`). Point it at a vault directory and go.

```bash
vaultlinker /path/to/vault/
vaultlinker /path/to/vault/ --dry-run -v
vaultlinker /path/to/vault/ --jobs 8
```

![Vault Linker CLI dry run with parallel jobs and progress output]({{ "/assets/images/posts/vault-linker/usage.png" | absolute_url }})
*Dry run with `-v` and `--jobs 8`: see what would change before touching files.*

Highlights that matter day to day:

- **`--jobs`** — Parallel read/process/write. Default is single-threaded; use `--jobs 0` to pick a sensible CPU-based worker count (capped at 32).
- **`--dry-run`** — Lists proposed links (`file:line: text -> [[wikilink]]`) without modifying the vault. Also applies to **`--unlink`**.
- **`--backup`** — Writes `<file>.bak` before overwriting when linking or unlinking in the vault.
- **`--output DIR`** — Mirror linked files into another directory; leave the live vault untouched (great for CI or previews).
- **Globs** — **`--include-glob`** and **`--exclude-glob`** limit which paths are processed (for example `notes/**` only).
- **`--incremental`** — Re-process notes changed since the last run; state lives under `.obsidian/vault-linker-state.json` by default (override with **`--state-file`**).
- **`--audit`** — Report pending links, broken wikilinks, and notes with zero backlinks—without changing files.
- **`--unlink`** — Remove wikilinks that match Vault Linker’s title/alias rules (with optional dry run and backup).
- **Aliases and headings** — YAML **`alias` / `aliases`** are link phrases by default; optional **`--use-headings`**, **`--no-aliases`**, **`--no-self-links`**, and **`--link-headings`** tune behavior.
- **Ignore lists** — **`--ignore-phrase`** and **`--ignore-file`** skip phrases you never want linked.
- **Directory excludes** — **`--exclude`** and **`--no-default-excludes`** control skipping `.obsidian`, `.git`, and similar folders.

Audit mode is especially useful when you have already linked once and want to know what is still missing or broken:

![Vault Linker audit report in the terminal]({{ "/assets/images/posts/vault-linker/audit.png" | absolute_url }})
*CLI audit: pending links, broken wikilinks, and backlink stats at a glance.*

Full flag reference lives in the [README on GitHub](https://github.com/arshad115/vault-linker#usage).

## Obsidian community plugin

You do not have to leave Obsidian to run a pass. **Vault Linker** is on the community plugin store (search for “Vault Linker” or id `vault-linker`). From the plugin you can link, audit, and unlink with the same safety rules as the CLI—handy for vaults you only open on one machine.

![Vault Linker plugin settings in Obsidian]({{ "/assets/images/posts/vault-linker/plugin-settings.png" | absolute_url }})
*Plugin settings: run link, audit, or unlink from the command palette or ribbon.*

Install from Obsidian: **Settings → Community plugins → Browse → Vault Linker → Install → Enable**.

## Installation (quick)

**PyPI (recommended):**

```bash
pip install vaultlinker
vaultlinker /path/to/your/vault/ --dry-run
```

**From source:**

```bash
git clone https://github.com/arshad115/vault-linker.git
cd vault-linker
pip install -e ".[dev]"
```

Requires Python 3.10+.

## Closing thoughts

Vault Linker is the tool I wished I had when my graph was mostly disconnected notes. The rebrand to **Vault Linker** reflects how much it has grown: parallel CLI runs, incremental state, audit and unlink, globs, and a community plugin that stays in sync with the same linking rules.

Try a dry run on a copy of your vault, skim the audit output, then commit to a full link pass when you like what you see. Issues and PRs are welcome on [GitHub](https://github.com/arshad115/vault-linker).

---

**Related posts**

- [Obsidian Notes Linker - Open Source Tool Released](/2025/01/28/obsidian-notes-linker-open-source/)

**Links**

- [vault-linker on GitHub](https://github.com/arshad115/vault-linker)
- [vaultlinker on PyPI](https://pypi.org/project/vaultlinker/)
