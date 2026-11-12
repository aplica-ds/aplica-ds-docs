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

After installation, the CLI is available as `theme-engine` (or via `npx theme-engine`).

---

## Command groups

| Group | Purpose |
|-------|---------|
| [Build](#build-commands) | Transform `data/` into `dist/` |
| [Generate](#generate-commands) | Generate `data/` from config |
| [Architecture](#architecture-commands) | Sync token references across layers |
| [Validate](#validate-commands) | Validate the `data/` contract and audit accessibility |
| [Setup](#setup-commands) | Scaffold consumer workspace and schemas |
| [Playground](#playground-commands) | Copy reference themes and download OFL fonts |
| [Preview](#preview-commands) | Generate and serve an HTML preview of the current `dist/` |
| [AI Skills](#ai-skills-commands) | Inject AI editor integrations into consumer workspace |
| [Design.md](#designmd-commands) | Generate `DESIGN.md` (Google Stitch spec) with real brand values |
| [Contracts](#contracts-commands) | Generate and diff contract snapshots for deploy safety |
| [Migration](#migration-commands) | Migrate monolithic projects to package model |

---

## Build commands

### `build` (recommended default)

Runs the full generation + build pipeline in a single command. This is the recommended command for CI and day-to-day use.

```bash
theme-engine build
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
theme-engine build:all
```

Useful for iterating on output format changes without re-running the full generation pipeline.

---

### `build:semantic`

Builds only the Semantic layer output.

```bash
theme-engine build:semantic
```

---

### `build:foundation`

Builds only the Foundation layer output.

```bash
theme-engine build:foundation
```

---

### `build:components`

Builds only the Components layer output. Skipped with an informational message if `data/components` does not exist.

```bash
theme-engine build:components
```

---

## Generate commands

These commands produce or update `data/` from your configuration. Run them individually when you need to regenerate a specific pipeline stage.

### `themes:generate`

Decomposes all brand color configurations into the full OKLCh token palette. Writes to `data/brand/`, `data/mode/`, and `data/surface/`.

```bash
theme-engine themes:generate
```

---

### `themes:single <brand>`

Generates the token data for a single brand. Useful during brand development when you don't want to regenerate all brands.

```bash
theme-engine themes:single my-brand
```

---

### `dimension:generate`

Generates the spatial scale (spacing, sizing, border radius) for all three dimension variants (minor, normal, major). Writes to `data/dimension/`.

```bash
theme-engine dimension:generate
```

---

### `foundations:generate`

Generates Foundation token aliases from the Semantic layer. Writes to `data/foundation/`.

```bash
theme-engine foundations:generate
```

---

### `figma:generate`

Generates (or merges) the three files Tokens Studio needs to understand which token sets belong to which theme variant. Writes to `data/`.

```bash
theme-engine figma:generate
```

**Files produced:**

| File | Purpose |
|------|---------|
| `data/$themes.json` | Active theme entries imported by Tokens Studio. Preserves Figma-owned fields on merge (`id`, `$figmaStyleReferences`, variable IDs). |
| `data/$themes.engine.json.template` | Engine-owned template with the same structure and empty Figma fields. Use as a reset reference. |
| `data/$metadata.json` | Token-set load order for the active workspace. |

Use this command standalone when you added or renamed a theme, surface, or mode and want to update the Tokens Studio files without running a full build. In a full build (`theme-engine build`), this step runs automatically between `foundations:generate` and `build:all`.

> Do not delete `data/$themes.json`. If it is deleted, Figma style references stored in it are lost.

---

### `ensure:data`

Validates the `data/` directory structure and creates any missing directories. Run before generation commands when setting up a new workspace.

```bash
theme-engine ensure:data
```

---

## Architecture commands

### `sync:architecture`

Propagates token references across all layers (Brand → Mode → Surface → Semantic → Foundation). Run after `themes:generate` and before `foundations:generate`.

```bash
theme-engine sync:architecture
```

---

### `sync:architecture:test`

Runs architecture sync in test mode — reports what would change without writing to `data/`.

```bash
theme-engine sync:architecture:test
```

---

### `sync:architecture:schema`

Runs architecture sync in schema mode — validates the token structure contract.

```bash
theme-engine sync:architecture:schema
```

---

## Validate commands

### `validate:data`

Validates the current `data/` directory against:
- The active consumer generation schemas
- The data-output contract schemas
- Foundation and typography style contracts

```bash
theme-engine validate:data
```

Run this before `build:all` in CI to catch generation errors before the Style Dictionary build.

> `validate:data` and `data:validate` are aliases.

---

### `audit:accessibility`

Audits every color combination of every brand in the current workspace against the WCAG 2.1 contrast criteria. For each background/foreground pair in `dist/`, it computes the contrast ratio and classifies it as AA, AAA or FAIL.

```bash
theme-engine audit:accessibility
```

**Output:** A tabular terminal report with the contrast ratio and classification per color pair. Useful before a release to confirm that color adjustments did not introduce accessibility problems.

> Requires a generated `dist/` — run `theme-engine build` first.

---

## Setup commands

### `init`

Scaffolds a new consumer workspace. Run this once after installing the package.

```bash
theme-engine init
```

Offers three onboarding paths:
- **Load starter template** — ready-to-run workspace with one starter theme
- **Create using the wizard** — same base + generates `theme-engine/schemas/architecture.mjs` from guided answers
- **Load playground themes** — copies the 15 Aplica DS reference configurations (equivalent to `theme-engine init:playground`)

> `init` and `consumer:init` are aliases.

---

### `schemas:helper`

Interactively generates a `theme-engine/schemas/architecture.mjs` scaffold. Use this when you need to customize the token structure contract beyond what the starter template provides.

```bash
theme-engine schemas:helper
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

## Preview commands

### `preview`

Generates a static HTML view of the current `dist/` — useful for visually inspecting the generated tokens without integrating them into a component project.

```bash
# Only generate the preview
theme-engine preview

# Generate and serve locally (opens the browser)
theme-engine preview --serve

# Run a full build before generating (useful in CI)
theme-engine preview --build

# Full build + generate + serve
theme-engine preview --build --serve
```

**Flags:**

| Flag | Description |
|------|-------------|
| `--build` | Runs `theme-engine build` before generating the preview |
| `--serve` | Starts a local server to view the result in the browser after generation |

The generated file lives in `temp/preview/` in the consumer workspace.

---

## Playground commands

### `init:playground`

Copies the 15 Aplica DS reference theme configurations into the consumer workspace's config directory. Useful for exploring the engine's configuration model, inspecting how each configuration axis is exercised, or starting a project from a complete set of examples.

```bash
theme-engine init:playground
```

Copies the `config/aplica-*.config.mjs` files from the published package into `theme-engine/config/` in the consumer workspace. It does not overwrite existing files with the same name.

**Themes copied:** `aplica_blue_sky`, `aplica_sky`, `aplica_joy`, `aplica_tangerine`, `aplica_grinch`, `aplica_slate`, `aplica_forest`, `aplica_aurora`, `aplica_obsidian`, `aplica_coral`, `aplica_midnight`, `aplica_rose`, `aplica_mono`, `aplica_ember`, `aplica_electric`.

> `init:playground` and `themes:examples` are aliases.

---

### `fonts:download`

Downloads the OFL font families used by the playground themes from the canonical `google/fonts` GitHub repository into `assets/fonts/` in the consumer workspace.

```bash
theme-engine fonts:download
```

**Families downloaded (22):** Abril Fatface, Barlow, Bebas Neue, Cormorant Garamond, Courier Prime, DM Sans, DM Serif Display, Fira Code, Fira Mono, Inter, JetBrains Mono, Lato, Libre Baskerville, Lora, Montserrat, Nunito, Nunito Sans, Plus Jakarta Sans, Playfair Display, Quicksand, Rajdhani, Source Code Pro, Space Grotesk, Space Mono.

Requires internet access (github.com/google/fonts).

> `fonts:download` and `playground:fonts` are aliases.

---

## AI Skills commands

### `ai:init`

Injects AI editor integration files into the consumer workspace. Run once after installing or upgrading the package to give your AI coding assistant (Cursor, Claude Code, GitHub Copilot) structured knowledge of the token contract.

```bash
theme-engine ai:init
```

**Files injected:**

| Destination | Purpose |
|-------------|---------|
| `docs/context/token-concepts.md` | N1 reference — token concepts, the 4 color categories, dimension scale, typography |
| `docs/context/engineering-guide.md` | N3 reference — CSS variable consumption, dark mode, portal pattern, build pipeline, token contract |
| `.cursor/rules/theme-engine.mdc` | Mirror of the `theme-engine` skill for Cursor |
| `.cursor/rules/aplica-components.mdc` | Mirror of the `aplica-components` skill for Cursor |
| `.claude/skills/theme-engine/SKILL.md` | Engine expert — detects N1/N2/N3 from vocabulary, answers concepts, config keys, CLI and diagnostics |
| `.claude/skills/aplica-components/SKILL.md` | Component engineer — CSS variables, dark mode, portal pattern for headless UI, archetypes |
| `.claude/commands/` | 6 guided-workflow slash commands for Claude Code |
| `CLAUDE.md` | Workspace operating context for Claude Code (soft copy — not overwritten if it already exists) |
| `.github/instructions/theme-engine.instructions.md` | Mirror of the `theme-engine` skill for GitHub Copilot |
| `.github/instructions/aplica-components.instructions.md` | Mirror of the `aplica-components` skill for GitHub Copilot |

All files are copied from the package's versioned `templates/ai-skills/` directory. Re-running the command overwrites existing files — safe to run after every package upgrade to keep AI guidance in sync with the current token contract.

**Special `CLAUDE.md` behavior:** if the file already exists at the workspace root, the command skips it and prints an informational message. This preserves customizations made by the team. Reinstall manually only when needed.

Since version 3.15, `ai:init` also copies a static `DESIGN.md` to the workspace root. Use `theme-engine design:md` to regenerate it with your brand's real values.

Since version 3.16, `ai:init` also installs the **Knowledge Guide** in every AI tool — see [`ai:knowledge`](#aiknowledge) below.

Since version 3.19.2, `ai:init` ships **self-contained skills with embedded knowledge** (`theme-engine` and `aplica-components`) and **6 slash commands** (`.claude/commands/`) — everything resolved locally, with no external doc dependency.

> `ai:init`, `ai:setup`, `skills`, and `skills:init` are all aliases for the same command.

---

### `ai:knowledge`

Installs the conversational **Knowledge Guide** skill into the workspace's AI tools. It enables the assistant to answer configuration questions, explain the 5-layer architecture, diagnose token problems and guide workflows step by step — without executing code.

```bash
theme-engine ai:knowledge
```

**Files injected:**

| Destination | Tool |
|-------------|------|
| `.claude/skills/aplica-knowledge-guide/SKILL.md` | Claude Code |
| `.cursor/rules/aplica-knowledge-guide.mdc` | Cursor |
| `.github/instructions/aplica-knowledge.instructions.md` | GitHub Copilot |
| `docs/context/aplica-knowledge-guide.md` | All surfaces (agnostic) |

**Difference vs `ai:init`:** `ai:init` teaches the AI *how to generate code* that consumes tokens. `ai:knowledge` teaches the AI *how to guide the user* through configuration, architecture and conversational learning. Both skills coexist and complement each other.

> `ai:knowledge`, `ai:guide` and `knowledge:init` are all aliases for the same command.
>
> The Knowledge Guide is also included automatically when you run `ai:init`.

For more detail, see [Knowledge Guide](../04-theme-engine/10-knowledge-guide.md).

---

## Design.md commands

`DESIGN.md` is a design system specification file in the [Google Stitch](https://stitch.withgoogle.com/docs/design-md/overview) format: machine-readable YAML frontmatter (colors, typography, spacing, components) + a human-readable markdown body. Any AI coding tool that follows the spec (Cursor, Claude Code, GitHub Copilot, Gemini) uses this file to generate UI consistent with the system.

### `design:md`

Generates the `DESIGN.md` for the current workspace with the brand's real values — resolving tokens from `dist/json/<brand>-light-positive.json` and `data/foundation/<brand>/styles/typography_styles.json`.

```bash
# Primary brand (detected from themes.config.json)
theme-engine design:md

# A specific brand
theme-engine design:md --brand aplica_slate
```

**Files produced:**

| File | Purpose |
|------|---------|
| `DESIGN.md` | Full spec at the workspace root — use it with AI tools |
| `data/foundation/<brand>/design-md.json` | Resolved intermediate JSON (versionable, for programmatic tools) |

**Customization:** Edit `config/foundations/design-md.json` to override the default slot descriptions. The engine uses the defaults from `schemas/design-md.mjs` for any slot not overridden. When the token architecture evolves, `schemas/design-md.mjs` is updated in the same PR — the pairings always stay in sync.

**Validation:**

```bash
npx @google/design.md lint DESIGN.md
```

> `design:md`, `design-md` and `design:generate` are aliases.

---

## Contracts commands

Token contracts guarantee that Theme Engine releases do not silently break the component library. The flow is:

1. The config repository generates the contract after the build and publishes it to NPM together with `dist/`.
2. The component library diffs it in CI whenever the token package is updated.

### `contracts:generate`

Extracts a structural snapshot (token paths + types, no values) from `dist/json/<brand>-light-positive.json` and writes it to `dist/contracts/<brand>-contract.json`.

```bash
# Primary brand
theme-engine contracts:generate

# A specific brand
theme-engine contracts:generate --brand aplica_slate

# All brands
theme-engine contracts:generate --all
```

Run after `theme-engine build` and before `npm publish`. The generated file ships in the NPM package so component libraries can find it via `node_modules`.

---

### `contracts:diff`

Compares the contract committed in the component library with the installed package's contract and returns one of three states:

| State | Condition | Exit code |
|-------|-----------|-----------|
| ✅ **Green** | No structural change | `0` |
| ⚠️ **Alert** | New paths added (non-breaking) | `0` (with a warning) |
| ❌ **Error** | Paths removed or types changed (breaking) | `1` |

```bash
# Compare the local contract with the installed package's
theme-engine contracts:diff --contract ./contracts/aplica_blue_sky-contract.json

# Write a report file
theme-engine contracts:diff \
  --contract ./contracts/aplica_blue_sky-contract.json \
  --output ./contracts/diff-report.json
```

The engine locates the package contract at `node_modules/@aplica/aplica-theme-engine/dist/contracts/<brand>-contract.json`.

**GitHub Action:** Copy `templates/github-actions/contracts-check.yml` from the package into `.github/workflows/` in your component library. The workflow runs `contracts:diff` on PRs that update `package.json`.

---

## Migration commands

### `migrate:legacy-consumer`

Migrates a monolithic (pre-package) project to the consumer workspace model. Validates parity between the migrated output and the original project.

**Recommended: run the full migration in one step**

```bash
theme-engine migrate:legacy-consumer run --source <path-to-legacy-project>
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
theme-engine migrate:legacy-consumer analyze --source <path>

# Convert only
theme-engine migrate:legacy-consumer convert --source <path>

# Compare only (after a conversion has already been run)
theme-engine migrate:legacy-consumer compare --source <path>
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
npx theme-engine init
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

### Regenerate Figma scaffolding only

```bash
npm run tokens:figma
```

Use after adding or renaming a theme, surface, or mode when token values have not changed.

### Validate before publishing

```bash
npx theme-engine validate:data && npm run tokens:build:all
```
