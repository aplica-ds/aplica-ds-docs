---
title: "Theme Configuration"
lang: en
---

# Theme Configuration

Theme configuration lives in `theme-engine/config/`. These files define what the engine generates — brand colors, typography, modes, and spacing scales. The engine reads them; your project versions them.

---

## File map

| File | Controls |
|------|---------|
| `global/themes.config.json` | Brand list, modes, surfaces, gradients, dimension scale, typography scale |
| `global/dimension.config.mjs` | Spatial scale algorithm (spacing, sizing, border radius) |
| `foundations/engine.config.mjs` | Foundation layer typography and elevation styles |
| `<brand-name>.config.mjs` | Per-brand primitive colors, typography, and options |

All brand names declared in `themes.config.json` must have a corresponding `<name>.config.mjs` file.

---

## `themes.config.json` — global settings

### Minimal setup

```json
{
  "themes": {
    "my-brand": {
      "foundation": {
        "brand": "engine",
        "files": [
          "default.json",
          "styles/typography_styles.json",
          "styles/elevation_styles.json"
        ]
      }
    }
  },
  "global": {
    "modes": ["light", "dark"],
    "surfaces": ["positive", "negative"],
    "gradients": false
  }
}
```

### `themes` — per-brand settings

Each key under `themes` is a brand ID. The ID must match the `name` field in the corresponding brand config file and the filename without extension.

| Field | Type | Description |
|-------|------|-------------|
| `foundation.brand` | string | Foundation brand identifier (usually `"engine"`) |
| `foundation.files` | string[] | Foundation files to include in the build |
| `includePrimitives` | boolean | Include `_primitive_theme.json` in generated data. Set `false` for Figma performance. |

### `global` — workspace-wide settings

| Field | Type | Description |
|-------|------|-------------|
| `modes` | `["light"]` / `["light", "dark"]` | Which luminosity modes to generate |
| `surfaces` | `["positive"]` / `["positive", "negative"]` | Which surface contexts to generate |
| `gradients` | boolean | Generate gradient tokens |

### Typography scale (optional)

```json
{
  "global": {
    "typography": {
      "fontSizeScaleRatio": 1.2,
      "fontSizeScale": ["nano", "micro", "extraSmall", "small", "medium", "large", "extraLarge", "mega"]
    }
  }
}
```

- **`fontSizeScaleRatio`** — musical scale ratio for font size growth. Common values: `1.125` (Major Second), `1.2` (Minor Third), `1.25` (Major Third), `1.333` (Perfect Fourth).
- **`fontSizeScale`** — ordered list of size keys. The engine maps each key to a scale step.

---

## `<brand-name>.config.mjs` — per-brand configuration

One file per brand. Defines the primitive values the engine decomposes into the full token set.

### Minimal example

```js
export default {
  name: 'my-brand',

  colors: {
    // Brand palette
    primary:     '#3B82F6',
    light:       '#EFF6FF',
    dark:        '#1E3A8A',

    // Interface function colors
    action:      '#2563EB',
    action_dark:  '#1D4ED8',
    link:        '#60A5FA',

    // Feedback colors
    info_blue:         '#0EA5E9',
    info_blue_dark:    '#0284C7',
    success_green:     '#22C55E',
    success_green_dark:'#16A34A',
    warning_orange:    '#F59E0B',
    warning_orange_dark:'#D97706',
    danger_red:        '#EF4444',
    danger_red_dark:   '#DC2626',
  },

  mapping: {
    brand: {
      first:  'primary',
      second: 'light',
      third:  'dark'
    },
    interface: {
      function: {
        primary:   'action',
        secondary: 'action_dark',
        link:      'link'
      },
      feedback: {
        info_default:       'info_blue',
        info_secondary:     'info_blue_dark',
        success_default:    'success_green',
        success_secondary:  'success_green_dark',
        warning_default:    'warning_orange',
        warning_secondary:  'warning_orange_dark',
        danger_default:     'danger_red',
        danger_secondary:   'danger_red_dark'
      }
    }
  },

  typography: {
    fontFamilies: {
      main:    'Inter',
      content: 'Inter',
      display: 'DM Sans',
      code:    'JetBrains Mono'
    }
  },

  options: {
    txtOnStrategy:        'brand-tint',
    accessibilityLevel:   'AAA',
    acceptAALevelFallback: true,
    darkModeChroma:       0.85,
    includePrimitives:    false,
    uiTokens:             false,
  }
};
```

### `colors` — primitive color values

Define named hex colors here. These are the raw palette values used by the engine as input to OKLCh decomposition. They are not directly exposed as tokens.

- **Brand colors** — the three brand palette anchors (`first`, `second`, `third`)
- **Interface function colors** — primary action, secondary action, and link colors
- **Feedback colors** — info, success, warning, and danger; each has a `default` and `secondary` variant

### `mapping` — semantic role assignment

Maps the named colors to their semantic roles. The engine uses this mapping to generate the full Semantic and Foundation token sets.

| Key | Role |
|-----|------|
| `brand.first` | Primary brand color — CTAs, key surfaces, brand highlight |
| `brand.second` | Secondary brand color — supporting surfaces |
| `brand.third` | Tertiary brand color — dark accents, text on brand backgrounds |
| `interface.function.primary` | Primary action color — buttons, active states |
| `interface.function.secondary` | Secondary action color — secondary buttons |
| `interface.function.link` | Link color |
| `interface.feedback.*` | Info / success / warning / danger, each default + secondary |

### `typography` — font families

```js
typography: {
  fontFamilies: {
    main:    'Inter',       // body text, UI labels
    content: 'Inter',       // long-form content (can differ from main)
    display: 'DM Sans',     // headings, display text
    code:    'JetBrains Mono'  // code blocks, monospace
  }
}
```

Font files must be present in `assets/fonts/` if you enable `copyFonts` in the transformers config.

### `options` — generation behavior

| Option | Default | Description |
|--------|---------|-------------|
| `txtOnStrategy` | `'brand-tint'` | How text-on-color is calculated. `'brand-tint'` uses the closest passing palette color. `'high-contrast'` always uses pure black or white. |
| `txtBaseColorLevel` | `140` | Palette level used as starting point for `txt` color generation (since 3.6.0). Lower = lighter text. |
| `accessibilityLevel` | `'AAA'` | WCAG target. `'AAA'` = 7:1 ratio, `'AA'` = 4.5:1 ratio. |
| `acceptAALevelFallback` | `true` | When `true`, the engine automatically accepts AA when AAA fails instead of blocking. |
| `darkModeChroma` | `0.85` | Saturation factor for dark mode palette. `1.0` = same saturation as light. `0.85` = 15% more muted. |
| `includePrimitives` | `false` | Whether to generate `_primitive_theme.json`. Set `true` for Figma use; `false` reduces Figma file size. |
| `uiTokens` | `false` | Generate `_ui.json` token file. |

### Gradients (optional)

If `gradients: true` in `themes.config.json`, add gradient colors to the brand config:

```js
gradientColors: {
  first:  { lowest: '#bfdbfe', default: '#3B82F6', highest: '#1E3A8A' },
  second: { lowest: '#eff6ff', default: '#DBEAFE', highest: '#93c5fd' },
  third:  { lowest: '#1e40af', default: '#1E3A8A', highest: '#172554' }
}
```

---

## Workspace config — `aplica-theme-engine.config.mjs`

Workspace-level generation behavior lives in `aplica-theme-engine.config.mjs` at the project root, separate from per-brand configs.

### `generation.colorText` (since 3.6.0)

Controls `txt` token generation — the fourth property in the color contract (`background / txtOn / border / txt`):

```javascript
import { defineThemeEngineConfig } from '@aplica/aplica-theme-engine/config';

export default defineThemeEngineConfig({
  generation: {
    colorText: {
      generateTxt: true,
      txtBaseColorLevel: 140,
      fallbackBaseColorLevel: 160,
      textExposure: ['feedback'],
    }
  },
  paths: { /* your existing paths */ }
});
```

| Field | Default | Description |
|-------|---------|-------------|
| `generateTxt` | `false` | Enable `txt` generation across all color layers |
| `txtBaseColorLevel` | `140` | Palette level to start looking for an accessible `txt` color |
| `fallbackBaseColorLevel` | `160` | Level to fall back to when `txtBaseColorLevel` does not pass contrast |
| `textExposure` | `['feedback']` | Which families get `foundation.txt.*` flat aliases. Add `'interfaceFunction'` or `'product'` as needed |

> `txtBaseColorLevel` can also be overridden per brand in `options.txtBaseColorLevel`.

See [configuration guide](../04-theme-engine/03-configuration-guide.md) and [txt token](../02-token-layers/07-txt-token.md) for the full contract.

---

## Naming convention

Brand config filenames and the `name` field must use the same identifier format as in `themes.config.json`:

```
themes.config.json → "my-brand"
config/my-brand.config.mjs → name: 'my-brand'
```

Underscores and hyphens are both valid but must be consistent across all three references.

---

## After changing configuration

Run the full pipeline to propagate changes:

```bash
npm run tokens:build
```

Or step-by-step if you want to inspect intermediate output:

```bash
npm run tokens:themes      # reprocess colors
npm run tokens:dimension   # if dimension config changed
npm run tokens:sync        # propagate references
npm run tokens:foundations # rebuild foundation aliases
npm run tokens:build:all   # transform to dist/
```
