---
title: "CLI Reference"
lang: en
---

# CLI Reference

The `aplica-theme-engine` CLI is the primary interface for generating and building design tokens. All commands run against the current consumer workspace — the engine reads your configuration from `aplica-theme-engine.config.mjs` and writes all output inside your project root.

---

## Installation

```bash
npm install @aplica/aplica-theme-engine
```

After installation, the CLI is available as `aplica-theme-engine` (or via `npx aplica-theme-engine`).

---

## Command groups

| Group | Purpose |
|-------|---------|
| [Build](#build-commands) | Transform `data/` into `dist/` |
| [Generate](#generate-commands) | Generate `data/` from config |
| [Architecture](#architecture-commands) | Sync token references across layers |
| [Validate](#validate-commands) | Validate `data/` contract before build |
| [Setup](#setup-commands) | Scaffold consumer workspace and schemas |
| [Migration](#migration-commands) | Migrate monolithic projects to package model |

---

## Build commands

### `build` (recommended default)

Runs the full generation + build pipeline in a single command. This is the recommended command for CI and day-to-day use.

```bash
aplica-theme-engine build
```

**Pipeline executed:**
1. `ensure:data` — validates / creates `data/` directory structure
2. `themes:generate` — decomposes brand colors into OKLCh palettes
3. `dimension:generate` — generates the spatial scale (minor / normal / major)
4. `sync:architecture` — propagates token references across all layers
5. `foundations:generate` — generates Foundation aliases from Semantic tokens
6. `figma:generate` — generates Tokens Studio / Figma scaffolding files
7. `build:all` — transforms `data/` into `dist/` via Style Dictionary

> `build` and `build:themes` are aliases for the same command.

---

### `build:all`

Transforms the existing `data/` into `dist/` without regenerating `data/`. Use this when the token data is already correct and you only need to rebuild the output artifacts.

```bash
aplica-theme-engine build:all
```

Useful for iterating on output format changes without re-running the full generation pipeline.

---

### `build:semantic`

Builds only the Semantic layer output.

```bash
aplica-theme-engine build:semantic
```

---

### `build:foundation`

Builds only the Foundation layer output.

```bash
aplica-theme-engine build:foundation
```

---

### `build:components`

Builds only the Components layer output. Skipped with an informational message if `data/components` does not exist.

```bash
aplica-theme-engine build:components
```

---

## Generate commands

These commands produce or update `data/` from your configuration. Run them individually when you need to regenerate a specific pipeline stage.

### `themes:generate`

Decomposes all brand color configurations into the full OKLCh token palette. Writes to `data/brand/`, `data/mode/`, and `data/surface/`.

```bash
aplica-theme-engine themes:generate
```

---

### `themes:single <brand>`

Generates the token data for a single brand. Useful during brand development when you don't want to regenerate all brands.

```bash
aplica-theme-engine themes:single my-brand
```

---

### `dimension:generate`

Generates the spatial scale (spacing, sizing, border radius) for all three dimension variants (minor, normal, major). Writes to `data/dimension/`.

```bash
aplica-theme-engine dimension:generate
```

---

### `foundations:generate`

Generates Foundation token aliases from the Semantic layer. Writes to `data/foundation/`.

```bash
aplica-theme-engine foundations:generate
```

---

### `figma:generate`

Generates (or merges) the three files Tokens Studio needs to understand which token sets belong to which theme variant. Writes to `data/`.

```bash
aplica-theme-engine figma:generate
```

**Files produced:**

| File | Purpose |
|------|---------|
| `data/$themes.json` | Active theme entries imported by Tokens Studio. Preserves Figma-owned fields on merge (`id`, `$figmaStyleReferences`, variable IDs). |
| `data/$themes.engine.json.template` | Engine-owned template with the same structure and empty Figma fields. Use as a reset reference. |
| `data/$metadata.json` | Token-set load order for the active workspace. |

Use this command standalone when you added or renamed a theme, surface, or mode and want to update the Tokens Studio files without running a full build. In a full build (`aplica-theme-engine build`), this step runs automatically between `foundations:generate` and `build:all`.

> Do not delete `data/$themes.json`. If it is deleted, Figma style references stored in it are lost.

---

### `ensure:data`

Validates the `data/` directory structure and creates any missing directories. Run before generation commands when setting up a new workspace.

```bash
aplica-theme-engine ensure:data
```

---

## Architecture commands

### `sync:architecture`

Propagates token references across all layers (Brand → Mode → Surface → Semantic → Foundation). Run after `themes:generate` and before `foundations:generate`.

```bash
aplica-theme-engine sync:architecture
```

---

### `sync:architecture:test`

Runs architecture sync in test mode — reports what would change without writing to `data/`.

```bash
aplica-theme-engine sync:architecture:test
```

---

### `sync:architecture:schema`

Runs architecture sync in schema mode — validates the token structure contract.

```bash
aplica-theme-engine sync:architecture:schema
```

---

## Validate commands

### `validate:data`

Validates the current `data/` directory against:
- The active consumer generation schemas
- The data-output contract schemas
- Foundation and typography style contracts

```bash
aplica-theme-engine validate:data
```

Run this before `build:all` in CI to catch generation errors before the Style Dictionary build.

> `validate:data` and `data:validate` are aliases.

---

## Setup commands

### `init`

Scaffolds a new consumer workspace. Run this once after installing the package.

```bash
aplica-theme-engine init
```

Offers two onboarding paths:
- **Load starter template** — ready-to-run workspace with one starter theme
- **Create using the wizard** — same base + generates `theme-engine/schemas/architecture.mjs` from guided answers

> `init` and `consumer:init` are aliases.

---

### `schemas:helper`

Interactively generates a `theme-engine/schemas/architecture.mjs` scaffold. Use this when you need to customize the token structure contract beyond what the starter template provides.

```bash
aplica-theme-engine schemas:helper
```

The helper asks about:
- Brand items
- Intensity / decomposition levels
- Interface function items
- Feedback items and variants
- Product categories and variants
- Gradient names

> `schemas:helper` and `schemas:init` are aliases.

---

## Migration commands

### `migrate:legacy-consumer`

Migrates a monolithic (pre-package) project to the consumer workspace model. Validates parity between the migrated output and the original project.

**Recommended: run the full migration in one step**

```bash
aplica-theme-engine migrate:legacy-consumer run --source <path-to-legacy-project>
```

This command:
1. Analyzes the legacy project structure
2. Selects the appropriate migration profile
3. Converts the workspace
4. Runs the build for the chosen profile
5. Compares the converted `data/` and `dist/` against the legacy reference

**Run phases separately (for inspection or debugging)**

```bash
# Analyze only — no changes made
aplica-theme-engine migrate:legacy-consumer analyze --source <path>

# Convert only
aplica-theme-engine migrate:legacy-consumer convert --source <path>

# Compare only (after a conversion has already been run)
aplica-theme-engine migrate:legacy-consumer compare --source <path>
```

**Options**

| Flag | Description |
|------|-------------|
| `--source <path>` | Path to the legacy project root |
| `--force` | Overwrite an existing converted workspace (for repeated migration tests) |
| `--profile <name>` | Migration profile (auto-detected when omitted) |

**Parity meaning:**
- **Data parity** — the converted workspace reproduces the same `data/` as the original
- **Dist parity** — the converted workspace reproduces the same `dist/` as the original
- Metadata-only drift does not fail parity

Migration artifacts are written to `temp/outputs/legacy-migration/` — source fixtures remain unchanged.

> `migrate:legacy-consumer` and `legacy:migrate` are aliases.

---

## Common workflows

### First build in a new project

```bash
npm install @aplica/aplica-theme-engine
npx aplica-theme-engine init
npm run tokens:build
```

### Rebuild after changing brand colors

```bash
npm run tokens:themes   # regenerate brand + mode + surface data
npm run tokens:sync     # propagate references
npm run tokens:foundations
npm run tokens:build:all
```

Or simply:

```bash
npm run tokens:build    # full pipeline — always safe
```

### Rebuild output formats only (no color changes)

```bash
npm run tokens:build:all
```

### Validate before publishing

```bash
npx aplica-theme-engine validate:data && npm run tokens:build:all
```
