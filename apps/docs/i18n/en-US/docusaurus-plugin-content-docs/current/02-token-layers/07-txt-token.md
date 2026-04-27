---
title: "The txt Token — Expanded Color Contract"
lang: en
---

# The txt Token — Expanded Color Contract

> **Introduced in:** 3.6.0  
> **Type:** Breaking change — expands the color property contract from 3 to 4 parts

## Overview

Until version 3.5.x, every color block in the Aplica Token System exposed **three properties**:

| Property | Meaning |
|----------|---------|
| `background` | Surface color of the element |
| `txtOn` | Readable text on that colored background (WCAG-guaranteed) |
| `border` | Border color derived from the surface |

Version 3.6.0 added a **fourth property**:

| Property | Meaning |
|----------|---------|
| `txt` | Readable text in a content context — on canvas, not on a colored surface |

The distinction is critical:
- **`txtOn`** answers: *"What color should text be if placed on top of this element's own colored background?"*
- **`txt`** answers: *"What color should text be when placed in a content flow on the current canvas, referencing this element's color family?"*

A concrete example: a success feedback banner has a green `background`. `txtOn` is white (to read on green). `txt` is a dark green tone — the color a paragraph of success-related text would use when the canvas itself is white.

---

## Where txt Appears

`txt` propagates through all color layers that the engine generates:

| Layer | Path pattern |
|-------|-------------|
| Brand | `semantic.color.brand.branding.first.default.txt` |
| Interface function | `semantic.color.interface.function.primary.normal.txt` |
| Interface feedback | `semantic.color.interface.feedback.info_default.normal.txt` |
| Product | `semantic.color.product.promo.default.default.txt` |
| Grayscale | `semantic.color.brand.ambient.neutral.default.txt` |

---

## Foundation Flat Aliases

The foundation layer exposes simplified `txt` aliases for the most common cases:

```
foundation.txt.info      → readable text for info/informational contexts
foundation.txt.primary   → readable text for primary brand contexts
foundation.txt.promo     → readable text for promotional contexts
```

These are **flat** (first-level only). Deeper product and interface-function aliases are controlled by the `textExposure` option.

---

## Text States

`txt` participates in the same behavioral state model as the rest of the color contract:

| State | Meaning |
|-------|---------|
| `txt.normal` | Default text color |
| `txt.action` | Text on hover — slightly more prominent |
| `txt.active` | Text in pressed/selected state — darker |
| `txt.focus` | Text during keyboard focus |

Example path: `semantic.color.interface.function.primary.normal.txt` vs `semantic.color.interface.function.primary.action.txt`.

---

## Configuration

### Workspace-level (aplica-theme-engine.config.mjs)

The `txt` generation is controlled at workspace level, not per-theme. This ensures all themes in a workspace share the same text contract:

```javascript
import { defineThemeEngineConfig } from '@aplica/aplica-theme-engine/config';

export default defineThemeEngineConfig({
  generation: {
    colorText: {
      generateTxt: true,                          // Enable the txt property (default: false for compat)
      txtBaseColorLevel: 140,                     // Starting palette level for txt lookup
      fallbackBaseColorLevel: 160,                // Fallback level if base fails WCAG
      textExposure: ['feedback'],                 // Which families get foundation.txt.* aliases
                                                  // Options: 'feedback', 'interfaceFunction', 'product'
    }
  },
  // ... rest of config
});
```

### Per-theme override (theme config)

Individual themes can override the starting level:

```javascript
export default defineThemeEngineConfig({
  name: 'my_brand',
  options: {
    txtBaseColorLevel: 120,   // This theme uses a lighter txt base than the workspace default
  },
  // ...
});
```

### textExposure options

| Value | Foundation aliases generated |
|-------|------------------------------|
| `'feedback'` | `foundation.txt.info`, `foundation.txt.success`, `foundation.txt.warning`, `foundation.txt.danger` (default) |
| `'interfaceFunction'` | `foundation.txt.primary`, `foundation.txt.secondary`, `foundation.txt.link` |
| `'product'` | `foundation.txt.promo`, `foundation.txt.cashback`, `foundation.txt.premium`, etc. |

Default is `['feedback']` only. The smaller the exposure, the smaller the generated foundation output.

---

## Accessibility Contract

The engine validates `txt` against the ambient background — specifically `theme.color.{mode}.brand.ambient.contrast.base.positive.background`. It climbs palette levels from `txtBaseColorLevel` until finding one that passes the configured WCAG level (AA by default). If none passes, it falls back to black.

This means `txt` is always accessible, but it is **not** necessarily the darkest color — it is the nearest accessible tone from the scale, which keeps it visually coherent with the theme's color family.

---

## Breaking Changes (3.6.0)

**Text aliases no longer source from `surface.*`**

Before 3.6.0, readable text aliases (e.g., `foundation.txt.info`) were approximated by reusing `surface.*` color values. This caused them to be contextually incorrect when the canvas was not white.

As of 3.6.0:
- All `txt` properties are generated from the palette directly
- `foundation.txt.*` flat aliases resolve from `txt.normal`
- `foundation` readable-text surface defaults to `feedback` only

**What to review after upgrading to 3.6.x:**
- If your components use `foundation.txt.*` aliases, verify that colors match expectations in both light and dark mode
- If you used `surface.*` values as text color references, migrate to `semantic.color.*.txt.normal`
- Check that `generateTxt` is set to `true` in your workspace config if you need the new contract

---

## Relationship to includePrimitives

As of 3.6.3, the workspace scaffolded by `theme-engine init` defaults to `includePrimitives: false`. The `txt` property is **not** a primitive — it is a generated semantic property and is always included regardless of this setting.

---

## See Also

- [Semantic Layer](./04-semantic-layer.md) — full semantic color contract
- [Configuration Guide](../04-theme-engine/03-configuration-guide.md) — workspace and theme config options
- [Foundation Layer](./05-foundation-layer.md) — foundation aliases
