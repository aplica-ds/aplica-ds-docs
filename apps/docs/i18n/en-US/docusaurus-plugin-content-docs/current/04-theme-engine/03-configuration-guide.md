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
| `includePrimitives` | `false` | Generates `_primitive_theme.json` with the raw decomposed palette (all 19 levels × all declared colors). Enable when your Figma file uses Figma Variables directly — not via Tokens Studio — and needs access to primitive palette values. Disabled by default since 3.6.3 because most workflows only need the semantic and foundation layers. |
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

## Workspace synchronization checklist

Before publishing or deploying multiple themes, verify that all workspace-wide settings are consistent. Some options affect the shared architecture layers (`mode/`, `surface/`, `semantic/`) — a single divergent theme corrupts the output for all consumers.

| Setting | Scope | Rule |
|---------|-------|------|
| `options.interaction.legacyStructure` | **Workspace-wide** | Must be identical across all themes. Controls whether shared layers emit `solid`/`ghost` groups. |
| `options.interaction.decomposition.method` | **Workspace-wide** | Must be identical. Mixing `system-scale` and `dilution` across themes breaks the semantic layer. |
| `generation.colorText.*` | **Workspace-wide** | Configured once in `aplica-theme-engine.config.mjs`, not per theme. |
| `options.baseAdaptation` | **Per-theme** | Can differ between themes. Affects only that theme's `normal`/`default` surfaces. |
| `options.txtOnStrategy` | **Per-theme** | Can differ between themes. |
| `options.darkModeChroma` | **Per-theme** | Can differ between themes. |
| `options.accessibilityLevel` | **Per-theme** | Can differ between themes. |

**Quick check before deploying:**

```bash
# Confirm all themes declare the same legacyStructure value
grep -r "legacyStructure" theme-engine/config/

# Confirm all themes declare the same decomposition method
grep -r "method:" theme-engine/config/

# Validate schema alignment across all themes without writing
npm run sync:architecture:test
```

---

## Interaction Decomposition (since 3.9.0)

By default, `interface.function` and `interface.feedback` generate interaction states (`normal`, `action`, `active`, `focus`) using the engine's palette-level logic. Version 3.9.0 introduces authored control over how those states are derived.

### Decomposition method

Configure `options.interaction.decomposition.method` inside the theme config:

| Value | Behavior |
|-------|----------|
| `'system-scale'` (default) | Legacy behavior, now explicitly named. Palette levels drive state colors (e.g., `active: 120`). All existing themes use this. |
| `'dilution'` | New. State colors move toward white or black from the base color without rotating hue. Factors drive intensity (e.g., `active: 0.8`, `action: 1.2`). Values above `1.0` invert direction. |

**When to use each method:**

| Scenario | Method | Target | Why |
|----------|--------|--------|-----|
| Existing themes, no visual change needed | `system-scale` | — | Fully backward-compatible; palette levels are predictable and explicit |
| Buttons that adapt naturally to light/dark context | `dilution` + `target: 'canvas'` | — | States dilute toward white on light canvases and black on dark canvases — no manual dark-mode override needed |
| Brand color must stay chromatic in hover/active states | `dilution` + `target: 'anchor'` | `source: 'palette'` | Keeps interaction states within the same hue family rather than drifting to gray |
| Custom accent color for interaction states across all surfaces | `dilution` + `target: 'anchor'` | `source: 'hex'` | Pins the dilution destination to a specific color regardless of theme |
| Interaction states that reference another generated token | `dilution` + `target: 'anchor'` | `source: 'token'` | Links states to a living token — updates automatically when the referenced color changes |
| `function` and `feedback` need different rules | Any method per group | — | Use `options.interaction.groups` to configure each independently (since 3.12.0) |

```javascript
options: {
  interaction: {
    decomposition: {
      method: 'dilution',
      // direction: 'high'  // 'high' = move darker (default); 'low' = move lighter
    },
    surfaces: {
      solid: {
        levels: {
          // dilution: factors (1.0 = base color, <1.0 = less diluted, >1.0 = inverts direction)
          action: 1.2,
          active: 0.8,
          focus:  0.3,
        }
      },
      ghost: {
        enabled: true,
        levels: {
          // ghost backgrounds use palette levels, even in dilution mode
          action: 40,
          active: 60,
          focus:  20,
        }
      }
    }
  }
}
```

`normal` always stays on the authored base color — no override is needed or expected.

### Backward compatibility

- Themes with no `interaction` config generate exactly as before — `system-scale` is the implicit default.
- Legacy `options.interfaceFunctionPaletteLevels` still works and is mapped internally to `options.interaction.surfaces.solid.levels`.
- Existing token structures for `background`, `txtOn`, `border`, and `txt` remain unchanged.

### Dilution targets (since 3.9.0 / 3.13.1)

When using `method: 'dilution'`, the `target` property controls which destination the states dilute toward:

| Value | Behavior |
|-------|----------|
| `'canvas'` (default for dilution) | Moves toward the resolved canvas for the active quadrant — lightens on light canvases, darkens on dark canvases. `fallback` controls behavior when no canvas is resolvable. |
| `'anchor'` (since 3.13.1) | Moves toward a configurable chromatic anchor. States shift in hue toward the anchor rather than toward white/black. |

#### Canvas-aware dilution (since 3.9.0)

```javascript
options: {
  interaction: {
    decomposition: {
      method: 'dilution',
      target: 'canvas',            // default when method is 'dilution'
      fallback: 'ambient-neutral', // 'legacy' | 'ambient-neutral'
    }
  }
}
```

#### Anchor-aware dilution (since 3.13.1–3.13.3)

```javascript
options: {
  interaction: {
    decomposition: {
      method: 'dilution',
      target: 'anchor',
      anchor: {
        source: 'palette',    // 'palette' | 'hex' | 'token'
        // hex: '#7C3AED',   // required when source: 'hex'
        // token: 'brand.branding.first.default.background', // required when source: 'token'
        canvasAware: true,    // anchor lightens on light canvases, darkens on dark canvases
        canvasMix:   0.2      // 0.0–1.0 — how strongly the anchor responds to the canvas
      }
    }
  }
}
```

| `anchor.source` | Description |
|----------------|-------------|
| `'palette'` | Current brand palette family — stays within the same color family |
| `'hex'` | Fixed chromatic destination declared in `anchor.hex` |
| `'token'` | Another generated token scale declared in `anchor.token` |

`anchor.canvasAware` + `anchor.canvasMix` let the anchor retain its authored hue while still lightening on light and darkening on dark canvases. Use `target: 'anchor'` for brighter or more chromatic secondary states that must remain systemic without manual overrides.

> The `target` / `anchor` config applies per-theme, per-surface, and per-group — any branch that uses `method: 'dilution'` can independently configure its target.

---

### Per-group configuration (since 3.12.0)

When `function` and `feedback` need different decomposition behavior, declare them under `options.interaction.groups`:

```javascript
options: {
  interaction: {
    decomposition: { method: 'system-scale' }, // theme default
    groups: {
      function: {
        decomposition: { method: 'dilution' }, // override for function only
        surfaces: {
          solid: {
            levels: { action: 1.2, active: 0.8, focus: 0.3 }
          }
        }
      },
      feedback: {
        // inherits theme default (system-scale)
        surfaces: {
          solid: {
            levels: { action: 80, active: 120, focus: 50 }
          }
        }
      }
    }
  }
}
```

Resolution order: theme default → surface-level → group-level → group-surface-level (each layer overrides the previous).

> **`groups.{function|feedback}.levels` is not supported.** Declare state values in `groups.{function|feedback}.surfaces.solid.levels` or `.ghost.levels` instead.

### Workspace consistency rule

All themes in the same workspace **must agree** on `options.interaction.legacyStructure`:

```javascript
options: {
  interaction: {
    legacyStructure: false,  // must be identical across all themes in the workspace
  }
}
```

| Value | Public output shape |
|-------|---------------------|
| `true` (default) | Previous public shape — `function` and `feedback` groups as before |
| `false` | Explicit `solid` and `ghost` groups generated across `brand`, `mode`, `surface`, and `semantic` |

> **Mixed workspaces break.** `mode`, `surface`, and `semantic` are shared layers — if some themes have `legacyStructure: false` and others do not, those shared layers become inconsistent. Set this flag identically in all theme configs.

### Quadrant-aware base adaptation (since 3.13.4)

**Background — what is a quadrant?** Each theme generates four variants determined by two independent axes: light vs dark mode, and positive vs negative surface context. The four combinations are `light-positive`, `light-negative`, `dark-positive`, `dark-negative`. Together they are called the active **quadrant**.

By default, interaction `normal` surfaces and product `default` surfaces are **fixed** at the authored base color regardless of the active quadrant. This means a primary button looks identical in `light-positive` and `dark-positive` — the designer's authored hex is the stable reference in all four contexts.

Opt in to quadrant adaptation per theme:

```javascript
options: {
  baseAdaptation: true  // interaction normal + product default respond to the active quadrant
}
```

**Concrete effect:** given a theme with `action_primary: '#C40145'`:

| Quadrant | `baseAdaptation: false` (default) | `baseAdaptation: true` |
|----------|-----------------------------------|------------------------|
| light-positive | `#C40145` | `#C40145` (unchanged — light-positive is the baseline) |
| light-negative | `#C40145` | slightly lighter shade |
| dark-positive | `#C40145` | adapted dark shade |
| dark-negative | `#C40145` | darkest adapted shade |

The adaptation adjusts lightness within OKLCh while preserving hue and chroma — the color family stays the same.

**Tokens affected:** only `interface.function.*.normal.background` and `product.*.default.background` families. All other states (`action`, `active`, `focus`) and all `txtOn`/`border`/`txt` values are unaffected.

**When to use:**
- The primary button is hard to see in `dark-negative` because its authored color is too close to the canvas
- The brand explicitly wants base surfaces to shift with context (expressive brands, high visual dynamism)

**When not to use:**
- Financial or institutional products where the brand color must remain a fixed, recognizable reference
- When `normal` is used as a color-matching anchor in the UI (e.g., the button matches the brand logo)

> **Per-theme, not workspace-wide.** Unlike `legacyStructure`, `baseAdaptation` is independent per theme — themes in the same workspace can mix `true` and `false` freely without corrupting shared layers.

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
