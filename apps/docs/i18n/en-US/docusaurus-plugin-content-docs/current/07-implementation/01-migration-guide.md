---
title: "Migration Guide"
lang: en
---

# Migration Guide

## Premise

This guide covers two distinct migration scenarios:

1. **Engine version update** — how to update a project using the Aplica Tokens Theme Engine to a newer version, without losing configurations and without breaking existing themes.
2. **Structural migration** — how to move projects with the legacy structure (config in `dynamic-themes/themes/config/`) to the current centralized structure (config at the project root in `config/`).

---

## How the Engine Versions Changes

The engine follows Semantic Versioning (SemVer). What this means for consumers:

| Version type | What changes | Impact |
|-------------|-------------|--------|
| **Patch** (2.18.x → 2.18.1) | Bug fixes, internal adjustments | Safe to update directly |
| **Minor** (2.18.x → 2.19.0) | New tokens added, new optional features | Safe to update — removes nothing existing |
| **Major** (2.x → 3.0) | Tokens renamed or removed, folder structure change | **Requires explicit migration** — old paths cease to exist |

### What counts as a breaking change

- Renaming a token path (e.g., `semantic.color.interface.oldName` → `semantic.color.interface.newName`)
- Removing a token from the schema
- Changing the `dist/` folder structure in an incompatible way

### What is NOT a breaking change

- Adding new tokens to the schema
- Adding new themes
- Adding new output formats (`dts/`, etc.)
- Internal improvements to the build pipeline

### Information sources by version

Before any migration, read:

```
CHANGELOG.md          — Narrative of what changed and why
RELEASE_FILES.md      — Exact list of files added, modified, and removed per version
CHANGELOG-ARCHIVE.md  — History for versions 2.11.x and earlier
```

---

## Minor / Patch Version Update

For updates that do not involve breaking changes (minor or patch):

### Step 1 — Check the current version

```bash
cat package.json | grep '"version"'
```

### Step 2 — Read the CHANGELOG

Read the entries between the current version and the target version. Identify:
- New logic files added (`schemas/`, `lib/`, scripts in `dynamic-themes/`)
- Configurations that need to be updated (marked as "Configurations that MUST be updated")
- New tokens added to the schema (indicate that `sync:architecture` needs to run)

### Step 3 — Separate: logic vs configuration

This is the golden rule of updating:

| What comes from upstream (new version) | What stays from your project |
|---------------------------------------|------------------------------|
| Scripts in `dynamic-themes/` | `config/*.config.mjs` (theme configs) |
| `schemas/` (architecture.mjs, etc.) | `config/global/themes.config.json` |
| `lib/paths.mjs` | `config/foundations/*.config.mjs` |
| `transformers/` | Overrides and customizations |

**Never overwrite your `config/` with upstream files.** Upstream provides logic — your config is yours.

### Step 4 — Run verification before building

```bash
# Verify that the data structure still matches the schema
npm run sync:architecture:test

# Full build to confirm everything resolves correctly
npm run build:themes
```

### Step 5 — Confirm output

```bash
# Verify that dist/ files were generated correctly
ls dist/css/
ls dist/json/

# Confirm no critical token disappeared
grep "semantic-color-interface-function-primary" dist/css/*.css | head -5
```

---

## Structural Migration — Legacy to Centralized

The largest structural change in the engine was the **centralization of configs**: what was in `dynamic-themes/themes/config/` and `dynamic-themes/themes/schemas/` was moved to the project root.

### When this scenario applies

If your project has configs in any of these locations:
- `dynamic-themes/themes/config/*.config.mjs`
- `dynamic-themes/themes/config/global/`
- `dynamic-themes/themes/config/foundations/`
- `dynamic-themes/themes/schemas/`
- `dynamic-themes/schemas/`
- `transformers/schemas/`

### Path map: legacy → centralized

| Legacy location | New location |
|----------------|-------------|
| `dynamic-themes/themes/config/global/themes.config.json` | `config/global/themes.config.json` |
| `dynamic-themes/themes/config/global/dimension.config.mjs` | `config/global/dimension.config.mjs` |
| `dynamic-themes/themes/config/*.config.mjs` | `config/*.config.mjs` |
| `dynamic-themes/themes/config/foundations/` | `config/foundations/` |
| `dynamic-themes/themes/schemas/` or `dynamic-themes/schemas/` | `schemas/` (from upstream) |
| `transformers/schemas/` | `schemas/` (content migrated) |
| Hardcoded paths in scripts | `lib/paths.mjs` (from upstream) |

### Structural migration process

#### 1. Version check (mandatory first)

```bash
cat package.json | grep '"version"'
```

Read the CHANGELOG from the current version to the target version. For versions 2.11.x and earlier, also read `CHANGELOG-ARCHIVE.md`.

#### 2. Backup

```bash
git stash
# or simply create a branch before starting
git checkout -b migration/centralized-config
```

#### 3. Pre-migration inventory

List all project configuration files before moving anything:

```bash
# Theme configs
ls dynamic-themes/themes/config/*.config.mjs

# Global config
ls dynamic-themes/themes/config/global/

# Foundations
ls dynamic-themes/themes/config/foundations/

# Custom schemas (if they exist)
ls dynamic-themes/themes/schemas/ 2>/dev/null
ls dynamic-themes/schemas/ 2>/dev/null
```

#### 4. Run the migration script

The engine provides a script that copies project configs to the new paths without overwriting anything:

```bash
# Dry run — see what would be copied without changing files
npm run migrate:centralized -- --dry-run

# Run the migration (copies, does not move — keeps old files for safety)
npm run migrate:centralized

# To move instead of copy (only after confirming the dry-run is correct)
npm run migrate:centralized -- --move
```

The script creates `config/`, `config/global/`, `config/foundations/`, and `schemas/` if they do not exist. It does **not** create `lib/paths.mjs` — that file comes from upstream.

#### 5. Bring logic from upstream

After moving the configs, bring the logic files from the new version:

```bash
# lib/paths.mjs — single source of paths
# schemas/architecture.mjs, typography-styles.mjs, foundation-styles.mjs
# Updated scripts in dynamic-themes/
```

The updated scripts and transformers use `lib/paths.mjs` as the single source of all paths — any hardcoded reference to `dynamic-themes/themes/config/` in legacy scripts must be replaced by imports from `lib/paths.mjs`.

#### 6. Verification

```bash
# Verify structure without writing
npm run sync:architecture:test

# Full build
npm run build:themes

# Style Dictionary build
npm run build

# Tests (if the project has them)
npm run test
```

Confirm that `data/` and `dist/` were generated correctly and that no script still reads from `dynamic-themes/themes/config/`, `dynamic-themes/themes/schemas/`, or `transformers/schemas/`.

#### 7. Cleanup

Only after confirming that the build and tests pass:

```bash
# Remove legacy structure
rm -rf dynamic-themes/themes/config/
rm -rf dynamic-themes/themes/schemas/
rm -rf transformers/schemas/  # if it exists and content was migrated
```

---

## Migration to Version with $description (2.19.x+)

Version 2.19.x added `$description` fields to tokens to improve context in design tools and AI. This is an additive migration — it breaks nothing — but requires two new files from upstream:

```
schemas/semantic-token-descriptions.mjs     ← Semantic token descriptions
config/foundations/foundation-token-descriptions.mjs  ← Foundation token descriptions
```

Bring these files from upstream. Your description overrides per foundation live in `config/foundations/*.config.mjs` in the `descriptions` and `styles.elevation[level].description` fields — the migration script preserves them.

After adding, run `sync:architecture` and verify that `data/semantic/default.json` and `data/foundation/engine/default.json` have the `$description` fields.

---

## When Tokens Are Renamed (Major Version)

If a token path changed between versions (e.g., a major breaking change):

### 1. Identify which tokens changed

Read the CHANGELOG for the major version — it will list the old paths, new paths, and the reason.

### 2. Find all occurrences in consumer code

```bash
# Search for the old token in components
grep -r "semantic-color-interface-old-name" src/

# Search in CSS files
grep -r "semantic.color.interface.oldName" src/
```

### 3. Replace

Globally replace the old path with the new one. In CSS, tokens follow a direct substitution pattern: `semantic.color.old.path` → `--semantic-color-old-path` becomes `--semantic-color-new-path`.

### 4. Validate the build

```bash
npm run build:themes
npm run build

# Verify the new variable exists in the output
grep "semantic-color-new-path" dist/css/*.css
```

---

## Quick Migration Checklist

**For minor/patch:**
- [ ] Read CHANGELOG from current version to target
- [ ] Update logic (scripts, schemas, lib/) from upstream
- [ ] Preserve project configs (`config/*.config.mjs`, etc.)
- [ ] Run `sync:architecture:test` → `build:themes` → `build`
- [ ] Confirm output in `dist/`

**For structural migration:**
- [ ] Check current version in `package.json`
- [ ] Read CHANGELOG and RELEASE_FILES for the version range
- [ ] Create backup / branch
- [ ] Take inventory of legacy configs
- [ ] Run `npm run migrate:centralized -- --dry-run`
- [ ] Run `npm run migrate:centralized`
- [ ] Bring `lib/paths.mjs`, `schemas/`, and updated scripts from upstream
- [ ] Fix imports in scripts pointing to legacy paths
- [ ] Run `sync:architecture:test` → `build:themes` → `build` → `test`
- [ ] Remove legacy folders only after validation

---

## References

- Build pipeline: [04-build-pipeline.md](../04-theme-engine/04-build-pipeline.md)
- Configuration guide: [03-configuration-guide.md](../04-theme-engine/03-configuration-guide.md)
- Naming and versioning contract: canonical-taxonomy-and-naming-contract.md
- Migration to centralized structure (technical): MIGRATE_TO_CENTRALIZED_THEMES.md
- Engine changelog: `references/aplica-tokens-theme-engine/CHANGELOG.md`
- Files by version: RELEASE_FILES.md
- Platform integration: [02-platform-integration.md](./02-platform-integration.md)
