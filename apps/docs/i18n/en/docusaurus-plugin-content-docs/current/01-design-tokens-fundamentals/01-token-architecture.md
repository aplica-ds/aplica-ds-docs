---
title: "Aplica DS Token Architecture"
lang: en
---

# Aplica DS Token Architecture

## Overview

Aplica DS organizes Design Tokens into **5 sequential layers + 1 orthogonal layer (Dimension)**.

The 5 sequential layers form a transformation pipeline: each layer receives the tokens from the previous one and adds its own semantics. The Dimension layer runs in parallel — it does not depend on brand, mode, or surface, but feeds directly into the Semantic and Foundation layers.

---

## The 5-Layer Pipeline

```
Brand ──┐
Mode   ─┼──────────────────────────────────── → Semantic → Foundation
Surface─┘                              ▲
                                       │
Dimension ─────────────────────────────┘
(minor / normal / major)
```

### Build flow

At build time, the pipeline merges:
1. `data/brand/<theme>/` — brand colors, gradients, and typography
2. `data/mode/<mode>.json` — color modulation for light or dark
3. `data/surface/<surface>.json` — positive or negative context
4. `data/dimension/<variant>.json` — spatial and typographic scale
5. `data/semantic/default.json` — references all of the above and creates purpose-driven tokens
6. `data/foundation/<foundation>/` — simplified aliases for component consumption

The output is one file per combination: e.g., `aplica_joy-light-positive.css` (with `normal` scale implied).

---

## Layer 1 — Brand

**What it defines:** The brand's visual identity. Primary color palette, product colors, feedback colors, typography configuration (families, weights), gradients, and brand-specific grayscale.

**Characteristics:**
- Each brand is generated dynamically by the Theme Engine from a base color
- Generation decomposes the color into 19 palette levels + 15 neutral levels + 5 behavioral states
- Multiple brands can coexist in the same system

**Tokens generated per brand (examples):**
```
brand.color.palette.<level>          → e.g.: brand.color.palette.500
brand.color.neutrals.<level>         → e.g.: brand.color.neutrals.300
brand.color.behavior.<state>         → e.g.: brand.color.behavior.hover
brand.typography.fontFamilies.main   → e.g.: "Inter"
brand.typography.fontWeights.regular → e.g.: 400
brand.color.gradient.first           → primary gradient color
```

**Color types in a brand:**
| Group | Purpose |
|-------|---------|
| `feedback` | info, success, warning, danger (with secondary variant) |
| `product` | promo, cashback, premium (extensible) |
| `brand` | first, second, third (and more, if configured) |
| `interface.function` | primary, secondary, link, disabled |

---

## Layer 2 — Mode

**What it defines:** Color modulation for luminosity context — light or dark.

**Values:** `light` · `dark`

**How it works:** Mode does not redefine the brand's colors — it defines **how the semantic layer interprets** the brand's palette values. In dark mode, the palette levels used for backgrounds and text are inverted, preserving minimum accessibility contrast.

**Properties controlled by Mode:**
- Which palette levels are used as background vs. foreground
- Configurable chroma (saturation) reduction for dark mode
- Border behavior in dark mode (lighter tone than the surface)

```
mode/light.json → defines reference rules for light mode
mode/dark.json  → defines reference rules for dark mode
```

---

## Layer 3 — Surface

**What it defines:** The context of the surface on which elements are rendered.

**Values:** `positive` · `negative`

**Analogy:** Think of positive as the UI's "normal background," and negative as an inverted contrast state or dark background within the same mode. In light mode, positive is the white/light background; negative is a colored background (a highlighted section, a card with brand color, etc.).

**Impact:** Primarily affects the main surface's background color tokens and the text tokens on top of it (`txtOn`), ensuring contrast is always valid.

---

## Orthogonal Layer — Dimension

**What it defines:** The system's spatial and typographic scale. Operates independently of brand, mode, and surface.

**Variants:** `minor` · `normal` · `major`

### Why Dimension is orthogonal

Dimension does not change visual identity — it changes **interface density**. The same brand, in the same mode, on the same surface, can exist at three different densities without any change to color or typography.

```
aplica_joy-light-positive-minor   → compact (dense interfaces, dashboards)
aplica_joy-light-positive-normal  → standard (general use)
aplica_joy-light-positive-major   → spacious (accessibility, reading, mobile)
```

### What Dimension controls

**Spatial scale (sizing/spacing):**
- Uses `LayoutUnit` (4px) and `DefaultDesignUnit` (16px for normal) as base
- Progresses with a Fibonacci sequence above the DefaultDesignUnit
- Descends by subtracting LayoutUnit below the DefaultDesignUnit
- Each variant has its own DefaultDesignUnit:

| Variant | DefaultDesignUnit | Key `medium` | Key `micro` | Key `giga` |
|---------|------------------|-------------|------------|-----------|
| minor   | 8px              | 8px         | 2px        | ~22px     |
| normal  | 16px             | 16px        | 4px        | 44px      |
| major   | 24px             | 24px        | 6px        | ~66px     |

**Typographic scale (fontSizes/lineHeights):**
- 13 sizes: nano → micro → extraSmall → small → medium → large → extraLarge → mega → giga → tera → peta → exa → zetta
- `medium` is always exponent 0 (= the variant's DefaultDesignUnit)
- Default ratio: 1.2 (Minor Third), configurable
- lineHeights derived automatically from fontSizes via ratios (Tight, Close, Regular, Wild)

**Output units:**
| Format | Unit | Reason |
|--------|------|--------|
| CSS | `rem` | Accessibility (scales with user preference) |
| JSON | `px` | Figma and Tokens Studio expect integer px values |
| JS / ESM | `px` | Numeric precision for JavaScript consumers |

For more details, see [06-dimension-layer.md](../02-token-layers/06-dimension-layer.md).

---

## The Source of Decisions: The Configuration File

Although tokens are visualized and consumed in Figma or in final code, the "genesis" of the system — where design intent is formalized — happens in the **Theme Configuration File** (`*.config.mjs`).

Inverting the traditional Design System flow (Design → Code), in Aplica DS structural definitions are born before any drawing:

1. **System definition:** The System Designer decides the brand hue, Fibonacci scale proportions, and the required product colors.
2. **Code registration:** Those decisions are written into `config.mjs`.
3. **Algorithmic authority:** The Theme Engine reads that file and generates thousands of tokens, automatically guaranteeing contrast (WCAG) and optical harmony.

This ensures system governance is **centralized and version-controlled**. Any change to the system's vision is made in a single place and propagated to all consumers (Design/Figma and Engineering) simultaneously.

---

## Layer 4 — Semantic

**What it defines:** Tokens with clear purpose, referencing values from the previous layers (Brand + Mode + Surface + Dimension).

**This is the layer exposed to components.** A component must never reference Brand, Mode, Surface, or Dimension tokens directly — always Semantic or Foundation.

**Semantic token structure:**
```
semantic.color.interface.function.primary.normal.background
semantic.color.interface.function.primary.normal.txtOn
semantic.color.feedback.success.default.background
semantic.color.brand.first.default.surface
semantic.dimension.sizing.medium
semantic.dimension.spacing.large
semantic.typography.fontSizes.medium
semantic.depth.level_one
semantic.border.radius.medium
```

**Naming convention:**
`semantic.<category>.<group>.<state>.<property>`

The semantics are **unique per Brand+Mode+Surface+Dimension combination**, but the naming schema is constant — what changes are the resolved values.

---

## Layer 5 — Foundation

**What it defines:** A **cognitive load reduction** layer designed for product teams — designers and engineers who build screens, not the system itself.

**Purpose:** Someone building a screen does not need to understand the full semantic taxonomy. They don't need to know that a primary button background is called `semantic.color.interface.function.primary.normal.background`. They need to know it's `foundation.bg.primary` — and that it works. Foundation delivers exactly the subset needed to build UIs at speed: backgrounds, text colors, borders, spacings, and pre-composed styles.

**What Foundation eliminates:**
- The need to know the full Semantic taxonomy
- The decision of which palette level to use — the decision has already been made
- The risk of inconsistency — a Foundation token always points to the correct Semantic token
- Context cognitive load — fewer names, less structure, less room for error

```
foundation.bg.primary     → semantic.color.interface.function.primary.normal.background
foundation.text.body      → semantic.color.text.body.default
foundation.spacing.medium → semantic.dimension.spacing.medium
```

**Foundation is not a technical simplification — it is a product decision.** The complexity exists in Semantic; Foundation is the interface that hides that complexity from those who do not need to see it.

Foundation also delivers **ready-to-use composite styles**:
- **Typography styles** — classes with fontFamily + fontSize + fontWeight + lineHeight + letterSpacing already combined (e.g., `.typography-heading-title_1`)
- **Elevation styles** — shadow classes by level, configurable per theme (e.g., `.elevation-level_two`)

---

## Layer Summary Table

| Layer | Question it answers | Example |
|-------|---------------------|---------|
| **Brand** | Who is the brand? | Primary color, font family, gradient |
| **Mode** | Light or dark? | Palette inversion, chroma reduction |
| **Surface** | What is the background? | Positive (normal) or negative (inverted) |
| **Dimension** | What is the density? | Compact, normal, or spacious |
| **Semantic** | What is the purpose? | `interface.function.primary.normal.background` |
| **Foundation** | What do I need to build this screen? | `bg.primary`, `text.body`, `spacing.medium` — without needing to know Semantic |

---

## Possible combinations

```
N_brands × 2 modes × 2 surfaces × 3 dimensions = N × 12 variants

With 4 brands:
4 × 2 × 2 × 3 = 48 theme variants
```

Each variant is an independent CSS (and JSON/ESM/CJS) file, generated automatically by the Theme Engine from the configurations.

---

## References

- [Brand Layer](../02-token-layers/01-brand-layer.md)
- [Mode Layer](../02-token-layers/02-mode-layer.md)
- [Surface Layer](../02-token-layers/03-surface-layer.md)
- [Dimension Layer](../02-token-layers/06-dimension-layer.md)
- [Semantic Layer](../02-token-layers/04-semantic-layer.md)
- [Foundation Layer](../02-token-layers/05-foundation-layer.md)
- [Theme Engine](../04-theme-engine/01-what-is-theme-engine.md)
