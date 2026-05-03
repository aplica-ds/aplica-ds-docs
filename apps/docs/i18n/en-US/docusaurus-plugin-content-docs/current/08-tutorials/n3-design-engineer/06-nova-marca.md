---
level: n3
id: N3-06
title: "Adding a new brand to the engine"
prerequisites: ["N2-04", "N3-04"]
duration: "20 min"
lang: en
---

# N3-06 · Adding a New Brand to the Engine

## Context

Everything you have learned converges in this tutorial. You will create a complete theme — from brief to CSS in the browser — without skipping steps.

The exercise uses a fictional brand: **Verdana** — a green credit platform for small businesses. Identity: institutional, responsible, sustainable. Palette: green as the action color, amber as the secondary highlight.

---

## What you will build

By the end of this tutorial you will have:

1. `verdana.config.mjs` — complete theme config
2. Theme registered in `themes.config.json`
3. Build executed successfully — tokens in `dist/`
4. Tokens verified in the CSS output
5. Figma synchronization described

---

## Step 1 — Create the config file

Create the file at:

```
dynamic-themes/themes/config/verdana.config.mjs
```

**Build in stages, not all at once.** The sections below go from minimum viable to fully configured. Each stage already generates valid tokens — add the next only when the current one builds cleanly.

### 1.0 — Minimal config (generates valid tokens immediately)

Start here. This is the least a config needs to produce a complete build:

```javascript
export default {
  name: 'verdana',

  colors: {
    brand_green:  '#16A34A',
    brand_stone:  '#57534E',
    brand_amber:  '#D97706',
    action_primary:   '#15803D',
    action_secondary: '#78350F',
    action_link:      '#166534',
    info_light: '#DBEAFE', info_sat: '#1D4ED8',
    ok_light:   '#DCFCE7', ok_sat:   '#15803D',
    warning_light: '#FEF3C7', warning_sat: '#B45309',
    error_light:   '#FEE2E2', error_sat:   '#DC2626',
  },

  mapping: {
    brand: { first: 'brand_green', second: 'brand_stone', third: 'brand_amber' },
    interface: {
      function: { primary: 'action_primary', secondary: 'action_secondary', link: 'action_link' },
      feedback: {
        info_default: 'info_light', info_secondary: 'info_sat',
        success_default: 'ok_light', success_secondary: 'ok_sat',
        warning_default: 'warning_light', warning_secondary: 'warning_sat',
        danger_default: 'error_light', danger_secondary: 'error_sat',
      }
    }
  },

  typography: {
    fontFamilies: { main: 'Inter', content: 'Inter', display: 'DM Sans', code: 'JetBrains Mono' },
    weights: {
      main: {
        regular: { normal: 400, italic: 400 }, semibold: { normal: 600, italic: 600 },
        bold: { normal: 700, italic: 700 }
      },
      display: { regular: { normal: 400, italic: 400 }, bold: { normal: 700, italic: 700 } },
      code: { regular: { normal: 400, italic: 400 } }
    }
  }
}
```

Run `npm run build:themes` now. If it passes, this theme is already fully functional across all four quadrants (light-positive, light-negative, dark-positive, dark-negative). Everything after this is refinement.

### 1.1 — Extend with product colors

Add the product-specific colors to the `colors` block and wire them in `mapping`. Only add what the brand actually needs — Verdana has one justified product concept: the "Green Credit" badge.

```javascript
export default {
  name: 'verdana',

  colors: {
    // ── Brand ──────────────────────────────────────────
    brand_green:  '#16A34A',
    brand_stone:  '#57534E',
    brand_amber:  '#D97706',

    // ── Interface Function ─────────────────────────────
    action_primary:   '#15803D',
    action_secondary: '#78350F',
    action_link:      '#166534',

    // ── Feedback ──────────────────────────────────────
    // default: soft tone (for banner/badge backgrounds)
    // secondary: saturated tone (for icons, borders, text)
    info_light:    '#DBEAFE',
    info_sat:      '#1D4ED8',
    ok_light:      '#DCFCE7',
    ok_sat:        '#15803D',   // reuses brand_green — intentional
    warning_light: '#FEF3C7',
    warning_sat:   '#B45309',
    error_light:   '#FEE2E2',
    error_sat:     '#DC2626',

    // ── Product ───────────────────────────────────────
    eco_green:  '#166534',   // "Green Credit" badge
    eco_light:  '#DCFCE7',   // soft version
  },

  mapping: {
    brand: {
      first:  'brand_green',
      second: 'brand_stone',
      third:  'brand_amber'
    },
    interface: {
      function: {
        primary:   'action_primary',
        secondary: 'action_secondary',
        link:      'action_link'
      },
      feedback: {
        info_default:      'info_light',
        info_secondary:    'info_sat',
        success_default:   'ok_light',
        success_secondary: 'ok_sat',
        warning_default:   'warning_light',
        warning_secondary: 'warning_sat',
        danger_default:    'error_light',
        danger_secondary:  'error_sat'
      }
    },
    product: {
      eco_default:   'eco_green',
      eco_secondary: 'eco_light'
    }
  },

  typography: {
    fontFamilies: {
      main:    'Inter',
      content: 'Inter',
      display: 'DM Sans',
      code:    'JetBrains Mono'
    },
    weights: {
      main: {
        light:    { normal: 300, italic: 300 },
        regular:  { normal: 400, italic: 400 },
        semibold: { normal: 600, italic: 600 },
        bold:     { normal: 700, italic: 700 },
        black:    { normal: 900, italic: 900 }
      },
      content: {
        regular:  { normal: 400, italic: 400 },
        semibold: { normal: 600, italic: 600 },
        bold:     { normal: 700, italic: 700 }
      },
      display: {
        regular: { normal: 400, italic: 400 },
        bold:    { normal: 700, italic: 700 },
        black:   { normal: 900, italic: 900 }
      },
      code: {
        regular: { normal: 400, italic: 400 },
        bold:    { normal: 700, italic: 700 }
      }
    }
  }
}
```

Run `npm run build:themes` again. The product tokens (`product-eco-*`) should now appear in `dist/`.

**Design note:** `ok_sat` reuses `brand_green` (`#15803D`) — intentional. The success green and the brand green are the same color; creating an artificial distinction would be wrong.

### 1.2 — Add basic options

Once the build is clean, add `options` to tune rendering behavior:

```javascript
  options: {
    txtOnStrategy:      'high-contrast',  // institutional — trust over expressiveness
    darkModeChroma:      0.80,            // slightly softer than default (0.85)
    accessibilityLevel: 'AA',
  }
```

**Why `high-contrast`?** A credit platform for small businesses — trust and legibility take precedence over chromatic expressiveness. `brand-tint` could reduce contrast on dark green backgrounds.

### 1.3 — Advanced options (workspace-wide)

These options affect the shared architecture layers (`mode/`, `surface/`, `semantic/`). **Every theme in the workspace must agree** — changing one theme alone breaks the system.

```javascript
  options: {
    txtOnStrategy:      'high-contrast',
    darkModeChroma:      0.80,
    accessibilityLevel: 'AA',

    // Interaction decomposition — omit to keep the default (system-scale)
    // Only add if the whole workspace is switching to dilution or ghost surfaces.
    // interaction: {
    //   decomposition: { method: 'dilution', target: 'canvas' },
    //   legacyStructure: false,
    // },

    // Quadrant-aware base adaptation (since 3.13.4)
    // Makes interaction.normal and product.default surfaces respond to
    // light/dark + positive/negative. Requires all themes to opt in together.
    // baseAdaptation: true,
  }
```

Verdana ships with both commented out — the defaults (`system-scale`, `legacyStructure: true`, no `baseAdaptation`) are correct for most workspaces. Uncomment only when the whole workspace is ready to migrate.

See [03-configuration-guide.md](../../04-theme-engine/03-configuration-guide.md#interaction-decomposition-since-390) for the full contract on workspace-wide options.

---

## Step 2 — Register the theme

Open `dynamic-themes/themes/config/global/themes.config.json` and add the entry:

```json
{
  "themes": {
    "verdana": {
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

**Checklist before proceeding:**

- [ ] The key `"verdana"` is identical to the `name` in the `.config.mjs`
- [ ] The `.config.mjs` file is in `themes/config/` (not in a subfolder)
- [ ] No trailing commas in JSON (causes silent errors in some parsers)

---

## Step 3 — Run the build

```bash
npm run build:themes
```

The command runs the six stages in sequence. Expected output at the last line of each stage:

```
[ensure:data]          ✓ Directories verified
[dimension:generate]   ✓ Dimension scale generated (normal)
[themes:generate]      ✓ verdana: palette decomposed (7 colors × 19 levels)
[sync:architecture]    ✓ Mode, surface, semantic, foundation synced
[foundations:generate] ✓ engine foundation styles generated
[build:all]            ✓ Style Dictionary: 8 themes written to dist/
```

If you are adding the theme to a project that already has other themes, the theme count in the build increases — this is expected. Each theme generates 4 variants (light-positive, light-negative, dark-positive, dark-negative).

### What to check if it fails

**"Config not found: verdana"** → The `name` in `.config.mjs` does not match the key in `themes.config.json`.

**"Reference not found: {theme.color.light...}"** → The `mapping` has a key that does not exist in `colors`. Check for typos.

**"Missing required mapping key: interface.feedback.danger_default"** → The schema requires all feedbacks. Confirm that all 8 pairs (4 types × default/secondary) are present in the `mapping`.

---

## Step 4 — Preview the output visually

Before checking raw token values, use the preview command to confirm all four Verdana variants look correct:

```bash
theme-engine preview --build --serve
```

Open `http://localhost:<port>` (the CLI prints the URL). You should see:

- **light-positive / light-negative / dark-positive / dark-negative** — four tabs or sections
- Colors: `background`, `border`, `txtOn`, and `txt` for every semantic family at every state
- Typography: foundation classes applied to sample text
- Elevation: card surfaces per elevation level

**What to check for Verdana specifically:**

| Check | What to look for |
|-------|-----------------|
| `interface.function.primary.normal.background` | The green `#15803D` tone — not oversaturated in dark mode |
| `txtOn` on dark surfaces | White (expected — `high-contrast` strategy) |
| `txt` ambient | Accessible green-tinted text on the canvas background |
| `product.eco.*` | Green badge surfaces with correct `txtOn` |

If anything looks wrong, fix the config and re-run `theme-engine preview --build`.

---

## Step 5 — Verify tokens in the output

After the build, Verdana's tokens are at:

```
dist/
├── css/
│   ├── verdana-light-positive.css
│   ├── verdana-light-negative.css
│   ├── verdana-dark-positive.css
│   └── verdana-dark-negative.css
├── json/
│   └── verdana-light-positive.json  (+ 3 variants)
├── esm/
│   └── verdana-light-positive.mjs   (+ 3 variants)
└── dts/
    └── verdana.d.ts
```

### Verifying specific tokens

Confirm that the primary color token is correct:

```bash
grep "function-primary-normal-background" dist/css/verdana-light-positive.css
```

Expected result:
```css
--semantic-color-interface-function-primary-normal-background: 0.5164rem ...;
```

The `rem` value is the conversion of hex `#15803D` processed by the OKLCh pipeline. It may differ by 1–2 digits from the declared hex — this is expected (see [N2-02](../n2-system-designer/02-pipeline-oklch.md)).

Confirm the product item:

```bash
grep "product-eco" dist/css/verdana-light-positive.css
```

You should see 30 variables per theme variant (surface × intensity × property).

Confirm dark mode (inversion):

```bash
grep "function-primary-normal-background" dist/css/verdana-dark-positive.css
```

The value should differ from light — the lightness level was inverted.

---

## Step 6 — Sync with Figma

### 5.1 — Load the tokens

In Figma with **Tokens Studio** installed:

1. Open the plugin → **Settings** → **Add New Storage**
2. Select **Local/URL** and point to `dist/json/verdana-light-positive.json`
3. Repeat for the other 3 variants (or configure the plugin to load multiple sets)

### 5.2 — Create the variables

In the Tokens Studio plugin:
1. **Sets** tab → select all Verdana theme sets
2. Click the **Figma Variables** icon
3. **Create/Update Variables**

The plugin creates variable collections separated by layer. Semantic variables go into one collection, Foundation into another. Light/Dark modes become modes of the same collection.

### 5.3 — Verify

Create a test frame in Figma:
- A rectangle with fill `semantic.color.interface.function.primary.normal.background`
- A text over it with fill `semantic.color.interface.function.primary.normal.txtOn`

Switch the mode to Dark — both should change automatically to the dark equivalent. If the text disappears or contrast seems incorrect, the background/txtOn pair may be broken — review the applied tokens.

---

## Step 7 — Custom foundation (when necessary)

The Verdana theme uses the default foundation (`engine`). This is correct for most cases.

When to create a custom foundation:
- The product team uses different alias names (`bg.card` instead of `bg.primary`)
- The product has its own semantic concepts not covered by the default foundation
- The team wants a specific alias layer for one product without affecting others

To create one:

```
dynamic-themes/themes/config/foundations/verdana.config.mjs
```

Basic structure:

```javascript
export default {
  name: 'verdana',
  outputPath: 'data/foundation/verdana',
  structure: {
    bg: {
      card:   { ref: 'semantic.color.interface.brand.ambient.first.lowest.background' },
      action: { ref: 'semantic.color.interface.function.primary.normal.background' },
      // ...
    }
  }
}
```

Then link in `themes.config.json`:

```json
"verdana": {
  "foundation": {
    "brand": "verdana",   // ← points to the custom foundation
    ...
  }
}
```

And regenerate:

```bash
npm run foundations:generate
npm run build:all
```

---

## Checkpoint

By the end of this tutorial you should know:

- [ ] Start from the minimal config (1.0) and verify the build passes before adding complexity
- [ ] Write the `colors` block with the `default` (soft) and `secondary` (saturated) distinction for feedback
- [ ] Add product colors and wire them in `mapping` (stage 1.1)
- [ ] Add basic `options` — `txtOnStrategy`, `darkModeChroma`, `accessibilityLevel` (stage 1.2)
- [ ] Understand why `options.interaction` and `baseAdaptation` are workspace-wide contracts (stage 1.3)
- [ ] Connect `colors` to `mapping` without key errors
- [ ] Register the theme in `themes.config.json` with the correct key
- [ ] Run `npm run build:themes` and interpret the output
- [ ] Use `theme-engine preview` (Detailed and Summary views) to visually validate all four variants
- [ ] Verify tokens in the generated CSS with `grep`
- [ ] Describe the synchronization process with Figma via Tokens Studio
- [ ] Decide when to create a custom foundation vs using `engine`

---

## Next step

You have completed N3. You know how to build conforming components, integrate tokens on any platform, and add new brands to the engine from scratch.

The next level is **large-scale governance**: multiple teams consuming the same system, update cycles, breaking changes, and migration strategies. Those topics are covered in:

- [Migration guide](../../07-implementation/01-migration-guide.md)
- [Override best practices](../../../references/aplica-tokens-theme-engine/docs/context/dynamic-themes-reference/OVERRIDE-BEST-PRACTICES.md)
- [Canonical naming contract](../../../references/aplica-tokens-theme-engine/docs/context/tokens/canonical-taxonomy-and-naming-contract.md)

---

## References

- Full configuration guide: [03-configuration-guide.md](../../04-theme-engine/03-configuration-guide.md)
- Detailed build pipeline: [04-build-pipeline.md](../../04-theme-engine/04-build-pipeline.md)
- Theme anatomy (N2): [N2-04 · Anatomy of a theme](../n2-system-designer/04-anatomia-de-um-tema.md)
- Understanding the pipeline (N3): [N3-04 · Understanding the build pipeline](./04-pipeline-de-build.md)
- Figma sync workflow: [02-designer-workflow.md](../../04-theme-engine/02-designer-workflow.md)
