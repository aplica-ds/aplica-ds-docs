---
title: "Dimension — The Orthogonal Layer"
lang: en
---

# Dimension — The Orthogonal Layer

## What is Dimension

Dimension is the orthogonal layer of Aplica DS. It runs **in parallel** to the Brand → Mode → Surface pipeline and feeds directly into the Semantic and Foundation layers.

While Brand, Mode, and Surface control **visual identity** (colors, typography, context), Dimension controls the **spatial and typographic density** of the interface.

```
Brand ──┐
Mode   ─┼─────────────────────────────┐
Surface─┘                             ▼
                               ┌──────────────┐
                               │   Semantic   │ ← where tokens gain purpose
                               └──────┬───────┘
Dimension ─────────────────────┘      │
(minor / normal / major)              ▼
                               ┌──────────────┐
                               │  Foundation  │
                               └──────────────┘
```

---

## Why does Dimension exist?

The same interface may need different densities depending on the use context:

| Context | Ideal density |
|---------|--------------|
| Dashboards and dense data interfaces | `minor` — compact |
| General web and mobile applications | `normal` — standard |
| Reading, accessibility, large mobile | `major` — spacious |

Without Dimension, meeting these needs would require multiple separate token systems or hardcoded values. With Dimension, it is a variant switch.

---

## Variants

The system supports three Dimension variants, each with its own `DefaultDesignUnit`:

| Variant | DefaultDesignUnit | Use |
|---------|------------------|-----|
| `minor`  | 8px              | Compact interfaces, high density |
| `normal` | 16px             | Standard — general use |
| `major`  | 24px             | Spacious — accessibility, reading |

The `DefaultDesignUnit` is the anchor for the entire scale. Changing the variant changes **all** dimensional values proportionally.

---

## Spatial Scale (Sizing and Spacing)

### System constants

| Constant | Value (for `normal`) | Description |
|----------|---------------------|-------------|
| `LayoutUnit` | 4px | Base unit — all values are multiples of it |
| `ScaleMultiplierFactor` | 4 | Multiplier to derive the DefaultDesignUnit |
| `DefaultDesignUnit` | 16px | Base layout unit (1 DefaultDesignUnit = 1rem) |

### Progression rules

**Above DefaultDesignUnit:** Fibonacci-type progression
```
16, 28, 44, 72, 116 ... (each step = sum of the previous two, rounded to a LayoutUnit multiple)
```

**Below DefaultDesignUnit down to LayoutUnit:** LayoutUnit subtraction
```
12, 8, 4 (for LayoutUnit = 4, DefaultDesignUnit = 16)
```

**Below LayoutUnit:** divide by 2, rounded down
```
2, 1
```

**Sizing** includes 1px and 2px (for borders and strokes). **Spacing** starts at LayoutUnit (4px minimum).

### Semantic sizing aliases

| Semantic alias | Value (normal) | Value (minor) | Value (major) |
|----------------|---------------|--------------|--------------|
| `zero`         | 0             | 0            | 0            |
| `pico`         | 1px           | 1px          | 1px          |
| `nano`         | 2px           | 2px          | 2px          |
| `micro`        | 4px           | 2px          | 6px          |
| `extraSmall`   | 8px           | 4px          | 12px         |
| `small`        | 12px          | 6px          | 18px         |
| `medium`       | 16px          | 8px          | 24px         |
| `large`        | 20px          | 10px         | 30px         |
| `extraLarge`   | 24px          | 12px         | 36px         |
| `mega`         | 28px          | 14px         | 42px         |
| `giga`         | 44px          | 22px         | 66px         |
| `tera`         | 72px          | 36px         | 108px        |
| `peta`         | 116px         | 58px         | 174px        |

> Minor and major values are approximations — exact values depend on the specific params configuration for each variant.

---

## Typographic Scale

The typographic scale is **generated per variant** and coexists with the dimension data in the same file (`data/dimension/<variant>.json`), under the `_theme_typography` key.

### Font sizes — 13 steps

| Step | Exponent | Value (normal, ratio 1.2) |
|------|----------|--------------------------|
| `nano`       | -4 | 8px  |
| `micro`      | -3 | 10px |
| `extraSmall` | -2 | 12px |
| `small`      | -1 | 14px |
| **`medium`** | **0** | **16px** ← base |
| `large`      | +1 | 24px |
| `extraLarge` | +2 | 24px |
| `mega`       | +3 | 32px |
| `giga`       | +4 | 40px |
| `tera`       | +5 | 40px |
| `peta`       | +6 | 48px |
| `exa`        | +7 | 64px |
| `zetta`      | +8 | 72px |

**Formula:** `size = DefaultDesignUnit × ratio^exponent`
- Above base: rounded to a multiple of `LayoutUnit`
- Below base: rounded up (`Math.ceil`)

**Default ratio:** 1.2 (Minor Third) — globally configurable.

### Line heights

Derived automatically from fontSizes via four densities:

| Density | Ratio | Use |
|---------|-------|-----|
| `tight`   | ~1.2  | Headings, titles |
| `close`   | ~1.35 | Subtitles |
| `regular` | ~1.5  | Standard body text |
| `wild`    | ~1.8  | Long-form reading, accessibility |

### Letter spacing

Three fixed values, independent of variant:

| Name | Value | Use |
|------|-------|-----|
| `tight`   | -0.72 | Large headings |
| `regular` | 0     | Default |
| `wild`    | +0.8  | All-caps text, labels |

---

## Output Units

Dimension is stored in **px** but the output depends on the platform:

| Format | Unit | Reason |
|--------|------|--------|
| **CSS** | `rem` | Accessibility — scales with the user's font preference (WCAG 1.4.4) |
| **JSON** | `px` | Figma and Tokens Studio work with integer px values |
| **JS / ESM** | `px` | Numeric precision for JavaScript calculations |

**Exception:** `semantic.depth.spread` remains in px across all formats (it is not a dimensional token in the semantic sense — it is a raw number for `box-shadow`).

**CSS formula:** `rem = px / baseFontSize` where `baseFontSize` default = 16.

---

## File generated per variant

Each variant generates a file in `data/dimension/<variant>.json` with two sections:

```json
{
  "dimension": {
    "scale": { ... },     ← raw numerical scale (keys: 0, 25, 50, 75, 100, ...)
    "semantic": {
      "sizing": { ... },  ← semantic sizing aliases
      "spacing": { ... }  ← semantic spacing aliases
    }
  },
  "_theme_typography": {
    "fontSizes": { ... },      ← font size scale
    "lineHeights": { ... },    ← derived line heights
    "letterSpacings": { ... }  ← letter spacings
  }
}
```

At build time, `_theme_typography` is merged with the brand's `_typography.json` (which contributes fontFamilies, fontWeights, textDecoration, textCases) to form the complete set of typographic tokens.

---

## Overrides and Extensibility

Scale values can be overridden per variant via `getOverrides(variant)` in `config/global/dimension.config.mjs`.

**Mandatory rule:** any custom value must be a multiple of `LayoutUnit`.

```
value % LayoutUnit === 0 // must be true
```

Semantic tokens must always reference steps from the scale (or valid overrides). Never values that break the grid.

---

## Configuration

Dimension is configured in `config/global/themes.config.json`:

```json
{
  "global": {
    "dimension": {
      "outputUnit": {
        "css": "rem",
        "default": "px"
      },
      "baseFontSize": 16,
      "params": {
        "minor":  { "layoutUnit": 2, "scaleMultiplierFactor": 4 },
        "normal": { "layoutUnit": 4, "scaleMultiplierFactor": 4 },
        "major":  { "layoutUnit": 6, "scaleMultiplierFactor": 4 }
      }
    },
    "typography": {
      "fontSizeScaleRatio": 1.2
    }
  }
}
```

---

## References

- [Token Architecture](../01-design-tokens-fundamentals/01-token-architecture.md)
- Implementation: `references/aplica-tokens-theme-engine/dynamic-themes/scripts/dimension-scale.mjs`
- Configuration: `references/aplica-tokens-theme-engine/config/global/dimension.config.mjs`
- Technical documentation: `references/aplica-tokens-theme-engine/docs/context/dimension/`
