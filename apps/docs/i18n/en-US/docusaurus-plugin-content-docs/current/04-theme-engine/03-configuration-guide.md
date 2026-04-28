---
title: "Theme Configuration Guide"
lang: en
---

# Theme Configuration Guide

## Premise

In Aplica DS, **every visual decision starts in configuration**. Each brand is defined in a `.config.mjs` file — not in Figma, not in manual JSON. The engine reads this configuration and automatically generates all tokens for every combination of mode, surface, and dimension.

This guide covers how to create and configure brand themes and foundations using the `@aplica/aplica-theme-engine` package.

---

## Overview: Themes vs Foundations

These two concepts have distinct responsibilities and complement each other:

| Concept | What it defines | Where it lives | What it generates |
|---------|----------------|----------------|-------------------|
| **Theme** | Visual identity: colors, typography, gradients | `theme-engine/config/<name>.config.mjs` | `data/brand/<name>/` with decomposed palettes |
| **Foundation** | Aliases for semantic tokens | `theme-engine/config/foundations/<name>.config.mjs` | `data/foundation/<name>/` with consumption tokens |

A theme can have multiple foundations, but each theme is linked to **one foundation** in the build. The foundation exposes tokens with simple names (`foundation.bg.primary`, `foundation.spacing.medium`) that point to the configured theme's semantic layer.

---

## Theme Config Structure

Brand config files use `defineThemeEngineConfig` from the package:

```javascript
// theme-engine/config/my-brand.config.mjs
import { defineThemeEngineConfig } from '@aplica/aplica-theme-engine/config';

export default defineThemeEngineConfig({
  // ─────────── REQUIRED ───────────
  name: 'my_brand',             // Theme ID; defines the folder name in data/brand/

  colors: {                     // All hex colors used by the theme
    brand_primary:    '#E7398A',
    brand_secondary:  '#38C2D0',
    brand_tertiary:   '#8F58BD',
    action_primary:   '#C40145',
    action_secondary: '#1872A6',
    action_link:      '#FF0F80',
    // ... feedback and product (see section below)
  },

  mapping: {                    // Maps semantic concepts → color keys
    brand: {
      first:  'brand_primary',
      second: 'brand_secondary',
      third:  'brand_tertiary'
    },
    interface: {
      function: {
        primary:   'action_primary',
        secondary: 'action_secondary',
        link:      'action_link'
      },
      feedback: {
        info_default:    'feedback_info',
        info_secondary:  'feedback_info_dark',
        success_default: 'feedback_success',
        // ... warning, danger
      }
    },
    product: {
      promo_default:   'product_promo',
      promo_secondary: 'product_promo_alt',
      // ... cashback, premium
    }
  },

  typography: {                 // Font families and weights
    fontFamilies: {
      main:    'Inter',
      content: 'Inter',
      display: 'Inter',
      code:    'Fira Code'
    },
    weights: {
      main: {
        light:    { normal: 300, italic: 300 },
        regular:  { normal: 400, italic: 400 },
        semibold: { normal: 600, italic: 600 },
        bold:     { normal: 700, italic: 700 },
        black:    { normal: 900, italic: 900 }
      }
      // content, display, code follow the same structure
    }
  },

  // ─────────── OPTIONAL ───────────
  options:   { /* see options section */ },
  gradients: { /* see gradients section */ }
});
```

---

## Colors and Semantic Mapping

The separation between `colors` and `mapping` is deliberate:

- **`colors`** — a simple dictionary of free names to hex values. The name is internal and can be any descriptive string.
- **`mapping`** — connects those free names to the system's fixed **semantic roles**.

This separation allows multiple themes to share the same semantic roles with completely different colors, without duplicating the mapping logic.

### Feedback Colors

Each feedback type has a `default` variant (softer, for backgrounds) and a `secondary` variant (more saturated, for borders and icons):

```javascript
colors: {
  // Feedback — soft for bg, saturated for border/icon
  info_blue:      '#CBF6ED',   // default: soft
  info_blue_sat:  '#1872A6',   // secondary: saturated
  ok_green:       '#D7F6CB',
  ok_green_sat:   '#86C46D',
  warning_amber:  '#FEE6C2',
  warning_sat:    '#FDB750',
  error_red:      '#F9C8C8',
  error_sat:      '#EE5A5A',
},

mapping: {
  interface: {
    feedback: {
      info_default:       'info_blue',
      info_secondary:     'info_blue_sat',
      success_default:    'ok_green',
      success_secondary:  'ok_green_sat',
      warning_default:    'warning_amber',
      warning_secondary:  'warning_sat',
      danger_default:     'error_red',
      danger_secondary:   'error_sat'
    }
  }
}
```

### Product Colors

Same logic: `default` + `secondary` per item. The default schema includes `promo`, `cashback`, and `premium`:

```javascript
colors: {
  promo_color:    '#6BC200',
  promo_alt:      '#D2FD9D',
  cashback_color: '#FFBB00',
  cashback_alt:   '#FFF94F',
  premium_color:  '#B200AF',
  premium_alt:    '#EBC2DD'
},

mapping: {
  product: {
    promo_default:      'promo_color',
    promo_secondary:    'promo_alt',
    cashback_default:   'cashback_color',
    cashback_secondary: 'cashback_alt',
    premium_default:    'premium_color',
    premium_secondary:  'premium_alt'
  }
}
```

> **Remember the cost:** Each product item generates dozens of tokens per layer per theme. Before adding a new item, check whether an existing feedback or brand token can solve the case. See [01-colors.md](../03-visual-foundations/01-colors.md#product) for the full rationale.

---

## Configuration Options

The `options` key controls engine behavior for that theme:

### Text strategies (`txtOnStrategy`)

| Value | Behavior |
|-------|----------|
| `'high-contrast'` (default) | Always black or white — maximum contrast |
| `'brand-tint'` | Uses the palette tone that passes WCAG — preserves brand color |
| `'custom-tint'` | Fixed configured color, with fallback if WCAG fails |

```javascript
options: {
  txtOnStrategy: 'brand-tint',

  // Only for 'custom-tint':
  txtOnCustomTint: {
    light:    '#1a1a2e',         // text on light surfaces
    dark:     '#f0f0ff',         // text on dark surfaces
    fallback: 'high-contrast'    // fallback if the color fails WCAG
  }
}
```

### Other relevant options

| Property | Default | Description |
|----------|---------|-------------|
| `darkModeChroma` | `0.85` | Saturation factor in dark mode (0.7 = softer, 1.0 = same as light) |
| `accessibilityLevel` | `'AA'` | Minimum WCAG level: `'AA'` (4.5:1) or `'AAA'` (7:1) |
| `acceptAALevelFallback` | `true` | When targeting AAA, accept AA (4.5:1) if AAA cannot be achieved |
| `includePrimitives` | `false` | Generates `_primitive_theme.json` — disabled by default since 3.6.3; enabling adds Figma variable primitives |
| `uiTokens` | `false` | Generates `_ui.json` with component-scoped UI tokens |
| `borderOffset.palette` | `10` | Border distance from surface (scale 10–190) |
| `borderOffset.neutrals` | `1` | Distance steps on the neutrals scale |
| `txtBaseColorLevel` | workspace default | Palette level to start from for `txt` token lookup for this theme (overrides workspace `generation.colorText.txtBaseColorLevel`) |

---

## Workspace Config: generation.colorText (since 3.6.0)

The `txt` token and readable-text generation are controlled at the **workspace level** in `aplica-theme-engine.config.mjs`, not per-theme. This ensures all themes share the same text contract shape:

```javascript
import { defineThemeEngineConfig } from '@aplica/aplica-theme-engine/config';

export default defineThemeEngineConfig({
  generation: {
    colorText: {
      generateTxt: true,                  // Enable the txt property (default: false for compatibility)
      txtBaseColorLevel: 140,             // Palette level for txt lookup (starts here, climbs if needed for WCAG)
      fallbackBaseColorLevel: 160,        // Secondary fallback level
      textExposure: ['feedback'],         // Which families get foundation.txt.* flat aliases
                                          // Options: 'feedback', 'interfaceFunction', 'product'
    }
  },
  paths: {
    configDir:       './theme-engine/config',
    globalConfigDir: './theme-engine/config/global',
    foundationsDir:  './theme-engine/config/foundations',
    dataDir:         './data',
    distDir:         './dist'
  }
});
```

### textExposure values

| Value | Foundation aliases generated |
|-------|------------------------------|
| `'feedback'` | `foundation.txt.info`, `.success`, `.warning`, `.danger` (default) |
| `'interfaceFunction'` | `foundation.txt.primary`, `.secondary`, `.link` |
| `'product'` | Per-theme product items: `foundation.txt.promo`, `.cashback`, etc. |

> **Breaking change (3.6.0 → 3.6.1):** In 3.6.0, some `txt`-related options were per-theme. In 3.6.1 they moved to `generation.colorText` in the workspace config. If upgrading from 3.6.0, move `generateTxt`, `txtBaseColorLevel`, `fallbackBaseColorLevel`, and `textExposure` from individual theme configs to the workspace config.

See [07-txt-token.md](../02-token-layers/07-txt-token.md) for the full txt contract documentation.

---

## Overrides

Overrides allow replacing engine-generated values in specific cases:

```javascript
overrides: {
  // Replace grayscale (warm temperature)
  grayscale: {
    light: {
      surface: { '5': '#faf8f5', '10': '#f5f2ee', '140': '#1a1814' },
      txtOn:   { /* ... */ },
      border:  { /* ... */ }
    },
    dark: { /* same structure */ }
  },

  // Replace neutrals for a specific color
  neutrals: {
    brand_primary: {
      light: { surface: { '5': '#fdf4f9' } },
      dark:  { surface: { '5': '#1a0d14' } }
    }
  }
}
```

> **Rule:** Overrides are the last resort after exhausting the default semantic options. Validate with `theme-engine sync:architecture:test` after applying overrides to catch reference mismatches before a full build.

---

## Gradients

Gradients are controlled globally in `themes.config.json` and can be customized per theme:

```javascript
// In the theme config — gradients customized per brand color
gradients: {
  brand: {
    first: {
      angle: 135,
      stops: [
        { position: 0, colorRef: 'brand.branding.first.lowest.background' },
        { position: 1, colorRef: 'brand.branding.first.default.background' }
      ]
    },
    second: { /* ... */ },
    third:  { /* ... */ }
  }
}
```

When omitted, the engine uses a solid gradient as a stub. To disable gradients for the entire project, configure `global.gradients: false` in `themes.config.json`.

> **Build order with gradients:** Gradients only appear in the final output when `data/semantic/default.json` has the `semantic.color.gradient` section — created by `sync:architecture`. Always run `npm run tokens:build` (full pipeline) rather than `tokens:build:all` alone when gradients are enabled.

---

## Register the Theme in the Build

After creating the `.config.mjs`, register the theme in the central config file:

```json
// theme-engine/config/global/themes.config.json
{
  "themes": {
    "my_brand": {
      "includePrimitives": true,
      "foundation": {
        "brand": "engine",
        "files": [
          "default.json",
          "styles/typography_styles.json",
          "styles/elevation_styles.json"
        ]
      }
    }
  }
}
```

**Critical rule:** The key in `themes` must be identical to the `name` defined in the theme config and to the folder name generated in `data/brand/`.

---

## Generation Pipeline

### Full pipeline (recommended)

```bash
npm run tokens:build
```

Runs automatically in the correct order:
1. `ensure:data` — ensures `data/` structure exists
2. `dimension:generate` — generates dimensional scale
3. `themes:generate` — decomposes colors and generates `data/brand/<theme>/`
4. `sync:architecture` — propagates references to mode, surface, semantic, and foundation
5. `foundations:generate` — generates Foundation aliases
6. `build:all` — Style Dictionary → `dist/` (JSON, CSS, ESM, CJS, TypeScript)

### Useful individual commands

| Command | When to use |
|---------|-------------|
| `npm run tokens:themes` | After changing colors or mapping for a theme |
| `theme-engine themes:single --config=my-brand` | Generate only a specific theme |
| `npm run tokens:sync` | After changing the architecture schema |
| `npm run tokens:foundations` | After changing a foundation config |
| `npm run tokens:build:all` | Only the Style Dictionary build (when `data/` is already up to date) |
| `theme-engine validate:data` | Verify data/ integrity before building |

### When to run `sync:architecture`

The sync propagates references between layers. Run when:
- Changing the architecture schema (adding/removing feedback or product items)
- Adding a new theme and needing updated semantic references
- Gradients are enabled and you ran `themes:generate`
- After pulling changes that altered the schema structure

> **Never manually edit** `data/mode/*.json`, `data/surface/*.json`, `data/semantic/default.json`, or `data/foundation/engine/default.json`. The sync overwrites any manual edits in those files.

---

## Adding a New Foundation

When the default alias set is insufficient for a specific consumer:

1. Create `theme-engine/config/foundations/my-foundation.config.mjs` (based on `engine.config.mjs`)
2. Define `name`, `outputPath`, `structure` (sections and items), and `references` (mapping to Semantic)
3. Run `npm run tokens:foundations`
4. Link to the theme in `themes.config.json`: `"foundation": { "brand": "my-foundation", ... }`

---

## Quick Reference

| Task | Action |
|------|--------|
| Create new theme | Add `.config.mjs` in `theme-engine/config/` + register in `themes.config.json` + `npm run tokens:build` |
| Change a theme's colors | Edit the theme's `.config.mjs` + `npm run tokens:themes` + `npm run tokens:build:all` |
| Change foundation | Edit `.config.mjs` in `theme-engine/config/foundations/` + `npm run tokens:foundations` + `npm run tokens:build:all` |
| Change schema (feedback/product) | Edit schema override in `theme-engine/schemas/` + `npm run tokens:sync` + rebuild |
| Gradients don't appear in output | Run `npm run tokens:sync` before `tokens:build:all` |
| Verify without writing | `theme-engine sync:architecture:test` |
| View current schema | `theme-engine sync:architecture:schema` |

---

## References

- What is the Theme Engine: [01-what-is-theme-engine.md](./01-what-is-theme-engine.md)
- Detailed build pipeline: [04-build-pipeline.md](./04-build-pipeline.md)
- Output formats: [05-output-formats.md](./05-output-formats.md)
- Engineering quick start: [09-engineering/01-quick-start.md](../09-engineering/01-quick-start.md)
- Workspace structure: [09-engineering/02-workspace-structure.md](../09-engineering/02-workspace-structure.md)
- Full theme configuration reference: [09-engineering/03-theme-configuration.md](../09-engineering/03-theme-configuration.md)
- CLI reference: [09-engineering/05-cli-reference.md](../09-engineering/05-cli-reference.md)
- Color system: [01-colors.md](../03-visual-foundations/01-colors.md)
- Foundation layer: [05-foundation-layer.md](../02-token-layers/05-foundation-layer.md)
