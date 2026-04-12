---
title: "Build Pipeline"
lang: en
---

# Build Pipeline

## Premise

The Aplica Tokens Theme Engine build pipeline transforms configurations into consumable tokens for all platforms. It is a process in two major stages: **data generation** (config → `data/`) and **output transformation** (Style Dictionary: `data/` → `dist/`).

Understanding the pipeline is essential for those who maintain themes, add new colors, or need to diagnose why a token is not appearing in the output.

---

## Flow Overview

```
config/*.config.mjs
        │
        ▼
[ Stage 1: Data Generation ]
        │
        ├─ themes:generate    → data/brand/{theme}/
        ├─ dimension:generate → data/dimension/normal.json
        ├─ sync:architecture  → data/mode/, data/surface/, data/semantic/, data/foundation/
        └─ foundations:generate → data/foundation/{name}/styles/
        │
        ▼
[ data/ ] ← NEVER edit manually
        │
        ▼
[ Stage 2: Style Dictionary Build ]
        │
        npm run build
        │
        ▼
[ dist/ ]
  ├── json/      ← JSON with px (Figma, Tokens Studio)
  ├── css/       ← CSS custom properties with rem
  ├── esm/       ← ES Modules with px
  ├── cjs/       ← CommonJS with px
  └── dts/       ← TypeScript declarations
```

---

## Stage 1 — Data Generation

### `themes:generate` — Color Decomposition

The main script for the data stage. For each `*.config.mjs` in `dynamic-themes/themes/config/`:

1. Reads `colors` and `mapping` from the config
2. For each declared color, calls `ColorDecomposer` which:
   - Converts hex → OKLCh
   - Interpolates lightness to 19 palette levels (10–190)
   - Generates 15 neutral levels (5–140) with chroma reduced to 10%
   - Calculates `txtOn` (WCAG AA/AAA) and `border` for each level
   - Inverts the scale for dark mode (level N → level 200-N)
3. Generates `_typography.json` via `TypographyGenerator`
4. Generates `_borders.json` with references to the dimensional scale

**Files produced per theme in `data/brand/{theme}/`:**

| File | Contents |
|------|----------|
| `_primitive_theme.json` | Raw decomposed palettes (palette + neutrals + behavior per color) |
| `_grayscale.json` | Fixed grayscale scale (15 levels, customizable via override) |
| `_brand.json` | Semantic mapping: `theme.color.light.*` and `theme.color.dark.*` |
| `_typography.json` | Typography tokens (families, weights, sizes, line-heights) |
| `_borders.json` | Border radius with references to the dimensional scale |
| `_ui.json` | Component UI tokens (only when `options.uiTokens: true`) |

### `sync:architecture` — Reference Propagation

The most critical and least obvious script in the pipeline. Reads the **architecture schema** and propagates the correct references to all intermediate layers.

**What it writes (overwriting any manual edits):**

| File | What is propagated |
|------|--------------------|
| `data/mode/light.json` | Refs from `theme.color.light.*` for feedback, function, ambient |
| `data/mode/dark.json` | Refs from `theme.color.dark.*` with scale inversion |
| `data/surface/positive.json` | Refs from mode for positive context |
| `data/surface/negative.json` | Refs from mode with inverted scale (photographic negative) |
| `data/semantic/default.json` | Complete semantic tokens referencing surface |
| `data/foundation/engine/default.json` | Foundation aliases referencing semantic |

**Fundamental rule:** `data/mode/`, `data/surface/`, `data/semantic/`, and `data/foundation/engine/` are **generated files**. Any manual edit is overwritten on the next sync execution.

#### How surface and mode relate

```
data/surface/positive.json
        │ references
        ▼
data/mode/light.json  ←─── (or dark.json, depending on the bundle)
        │ references
        ▼
data/brand/{theme}/_brand.json
```

The surface does not know whether it is light or dark — it references the mode. The mode selects which brand file to use. The light/dark choice happens at build time, when `$themes.json` defines which combination of files is merged.

### `foundations:generate` — Foundation Styles

Generates the composed style files — typography styles and elevation styles — which are not primitive tokens, but pre-composed CSS classes directly consumable in Figma and code:

```
data/foundation/{name}/
├── default.json                ← alias tokens (foundation.bg.primary → semantic.color.*)
└── styles/
    ├── typography_styles.json  ← composed typographic styles (.typography-heading-title_1)
    └── elevation_styles.json   ← shadow classes per level (.elevation-level_two)
```

---

## Stage 2 — Style Dictionary Build

Style Dictionary v5 reads `data/` and the `$themes.json` configuration file, resolves all references (`{semantic.color.brand.first.default.background}`), applies platform transformations, and writes the files to `dist/`.

### The `$themes.json` file

Defines which combinations of token files are merged to generate each theme variant:

```json
{
  "aplica_joy-light-positive": {
    "selectedTokenSets": {
      "brand/aplica_joy/_brand":       "enabled",
      "brand/aplica_joy/_typography":  "enabled",
      "brand/aplica_joy/_grayscale":   "enabled",
      "brand/aplica_joy/_borders":     "enabled",
      "mode/light":                    "enabled",
      "surface/positive":              "enabled",
      "semantic/default":              "enabled",
      "foundation/engine/default":     "enabled",
      "dimension/normal":              "source"
    }
  },
  "aplica_joy-dark-positive": { /* same structure, mode/dark */ }
}
```

Each entry in `$themes.json` = one output file in `dist/`. This file is **generated by the themes pipeline** — do not edit manually.

### Reference Resolution

Style Dictionary traverses all chained references and resolves them to final values:

```
foundation.bg.primary
  → {semantic.color.interface.function.primary.normal.background}
    → {surface.interface.positive.function.primary.normal.background}
      → {mode.interface.positive.function.primary.normal.background}
        → {theme.color.light.interface.positive.function.primary.normal.background}
          → #C40145  (final value for aplica_joy light)
```

### Platform Transformations

Each platform applies specific transformations before writing:

| Platform | Main transformation | Output unit |
|----------|--------------------|-----------:|
| `json` | Resolves references, maintains nested structure | `px` |
| `css` | Generates `--semantic-*` and `--foundation-*`, converts dimensions | `rem` |
| `esm` | Generates ES module with exported object | `px` |
| `cjs` | Generates CommonJS module | `px` |
| `dts` | Generates TypeScript declarations | — |

**Important exception:** Tokens with `$type: "number"` (e.g., `semantic.depth.spread`) are **never** converted to rem — they remain in px on all platforms. See [05-output-formats.md](./05-output-formats.md) for the full list of exceptions.

---

## The Architecture Schema

The schema (`dynamic-themes/themes/schemas/architecture-schema.mjs`) is the **single source of truth for token structure**. It defines:

- Which feedback types exist (`info`, `success`, `warning`, `danger`)
- Which variants each feedback has (`default`, `secondary`)
- Which product items exist (`promo`, `cashback`, `premium`)
- Which intensity levels the semantic layer exposes (`lowest`, `default`, `highest`)

When the schema changes (e.g., adding a new feedback), `sync:architecture` propagates that change to all layers. Themes that do not declare the new color in `mapping` will receive a warning during the build.

```bash
# View current schema
npm run sync:architecture:schema

# Verify impact without writing
npm run sync:architecture:test
```

---

## Full Pipeline vs Incremental

### Full pipeline — use after clone or broad changes

```bash
npm run build:themes
```

Runs in order:
1. `ensure:data` — creates necessary directories in `data/`
2. `dimension:generate` — generates dimensional scale
3. `themes:generate` — decomposes colors for all themes
4. `sync:architecture` — propagates references between layers
5. `foundations:generate` — generates foundation styles
6. `build` — Style Dictionary → `dist/`

### Incremental builds — use for targeted changes

| Change | Required commands |
|--------|-------------------|
| Change a theme's color | `themes:generate` → `build` |
| Change dimensional scale | `dimension:generate` → `build` |
| Change schema (add feedback/product) | `sync:architecture` → `themes:generate` → `build` |
| Change foundation | `foundations:generate` → `build` |
| Rebuild only (data/ intact) | `build` |

### The gradients trap

Gradients require special attention to order:

```
themes:generate  → generates _brand.json WITH gradient
       ↓
sync:architecture → propagates gradient up to semantic.color.gradient
       ↓
build            → emits CSS gradient variables
```

If `sync:architecture` does not run after `themes:generate`, the `semantic.color.gradient` section does not exist and `build` warns (without failing) and omits gradients from the output. Solution: always use `build:themes` or run sync manually before the build.

---

## Build Validation

The pipeline includes automatic checks:

- **Broken references:** If a token references another that does not exist, the build fails with a resolution error
- **WCAG contrast:** If `options.strictValidation: true`, surface/txtOn pairs that do not pass the configured level (AA or AAA) fail the build
- **Schema structure:** `sync:architecture:test` validates whether theme configs align with the schema without writing anything

---

## Common Problem Diagnostics

| Symptom | Likely cause | Solution |
|---------|-------------|---------|
| Gradient doesn't appear in CSS | `sync:architecture` did not run after `themes:generate` | `npm run sync:architecture` + `npm run build` |
| New token doesn't appear in dist/ | Theme not registered in `themes.config.json` | Add entry to the global config `themes` |
| Color different from expected | Override in `overrides.*` overwriting the generated value | Check whether an override is configured for that color |
| Build fails with "reference not found" | `data/` out of sync with configs | `npm run build:themes` (full rebuild) |
| txtOn is black/white when brand color was expected | `txtOnStrategy: 'high-contrast'` is the default | Change to `'brand-tint'` in the theme options |

---

## References

- Configuration guide: [03-configuration-guide.md](./03-configuration-guide.md)
- Output formats in detail: [05-output-formats.md](./05-output-formats.md)
- Surface → Mode → Theme flow: [SURFACE-MODE-THEME-FLOW.md](../../references/aplica-tokens-theme-engine/docs/context/SURFACE-MODE-THEME-FLOW.md)
- Architecture schema: `references/aplica-tokens-theme-engine/dynamic-themes/themes/schemas/architecture-schema.mjs`
- Color decomposition script: [color-decomposer.mjs](../../references/aplica-tokens-theme-engine/dynamic-themes/scripts/color-decomposer.mjs)
- Sync script: `references/aplica-tokens-theme-engine/dynamic-themes/scripts/sync-architecture.mjs`
- Dynamic themes (reference): [DYNAMIC_THEMES.md](../../references/aplica-tokens-theme-engine/docs/context/DYNAMIC_THEMES.md)
- Mathematics and algorithms: [06-mathematics-and-algorithms.md](../03-visual-foundations/06-mathematics-and-algorithms.md)
