---
title: "Migration Guide"
lang: en
---

# Migration Guide

## Premise

This guide covers three distinct migration scenarios:

1. **Monolithic to NPM package** — how to migrate a project that embedded the engine source directly to the new `@aplica/aplica-theme-engine` NPM package model.
2. **Engine version update** — how to update a project using the NPM package to a newer version, without losing configurations and without breaking existing themes.
3. **Legacy structural migration** — how to move projects with the old config structure (config in `dynamic-themes/themes/config/`) to the current consumer workspace model.

---

## Monolithic to NPM Package Migration

If your project contains the engine source code directly (a copy of the engine repo or a git subtree), the `migrate:legacy-consumer` command automates the conversion to the NPM package consumer model.

### When this applies

Your project has any of:
- A `dynamic-themes/` directory at the project root
- Engine scripts directly in your repo (`lib/`, `transformers/`, `schemas/`)
- `npm run build:themes` in `package.json` pointing to a local script path

### Migration process

#### Step 1 — Install the package

```bash
npm install @aplica/aplica-theme-engine
```

#### Step 2 — Analyze the current workspace

Run the analyzer first to understand what will be migrated:

```bash
aplica-theme-engine migrate:legacy-consumer analyze --source=./dynamic-themes
```

The analyzer reports:
- Which config files were found and where they will land in the new structure
- Which schema overrides exist (will move to `theme-engine/schemas/`)
- Whether any custom scripts override default engine behavior (must be handled manually)

#### Step 3 — Run the migration

```bash
# Dry run — preview all changes without writing
aplica-theme-engine migrate:legacy-consumer run --source=./dynamic-themes --dry-run

# Run the migration
aplica-theme-engine migrate:legacy-consumer run --source=./dynamic-themes
```

The migration:
- Creates `theme-engine/config/` with your brand configs and global config
- Creates `aplica-theme-engine.config.mjs` at the project root
- Creates `theme-engine/transformers.config.mjs` from your existing transformer settings
- Creates `theme-engine/schemas/` if you had schema overrides
- Does **not** delete the old structure (cleanup is manual, after verification)

#### Step 4 — Verify parity

The migration is successful when both the before and after builds produce identical `dist/` output. The `compare` sub-command checks this:

```bash
# Build with the new package model
npm run tokens:build

# Compare new output against the legacy output
aplica-theme-engine migrate:legacy-consumer compare
```

The compare command diffs `dist/` file-by-file and reports any discrepancies. Parity means the migration is complete.

#### Step 5 — Update package.json scripts

Replace old build scripts with the new consumer scripts:

```json
{
  "scripts": {
    "tokens:build":       "aplica-theme-engine build",
    "tokens:build:all":   "aplica-theme-engine build:all",
    "tokens:themes":      "aplica-theme-engine themes:generate",
    "tokens:sync":        "aplica-theme-engine sync:architecture",
    "tokens:foundations": "aplica-theme-engine foundations:generate",
    "tokens:validate":    "aplica-theme-engine validate:data"
  }
}
```

#### Step 6 — Cleanup (after parity confirmed)

```bash
# Remove the embedded engine source
rm -rf dynamic-themes/
rm -rf lib/
rm -rf transformers/
```

Update `.gitignore` to exclude generated directories:

```gitignore
/data/
/dist/
```

#### Migration flags

| Flag | Description |
|------|-------------|
| `--source=<path>` | Path to the legacy engine directory (default: `./dynamic-themes`) |
| `--force` | Overwrite existing files in the target consumer workspace |
| `--profile=<name>` | Use a specific migration profile for non-standard layouts |

---

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

- Build pipeline: [04-theme-engine/04-build-pipeline.md](../04-theme-engine/04-build-pipeline.md)
- Configuration guide: [04-theme-engine/03-configuration-guide.md](../04-theme-engine/03-configuration-guide.md)
- CLI reference (migrate:legacy-consumer): [09-engineering/05-cli-reference.md](../09-engineering/05-cli-reference.md)
- Engineering quick start: [09-engineering/01-quick-start.md](../09-engineering/01-quick-start.md)
- Platform integration: [02-platform-integration.md](./02-platform-integration.md)
