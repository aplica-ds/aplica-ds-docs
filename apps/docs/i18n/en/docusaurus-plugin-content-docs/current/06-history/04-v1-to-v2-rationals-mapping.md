---
title: "Mapping: Mathematical Rationales Alpha/V1 → Aplica Theme Engine (V2)"
lang: en
---

# Mapping: Mathematical Rationales Alpha/V1 → Aplica Theme Engine (V2)

> This document maps the mathematical rationales and pseudo-code developed in the Alpha and V1 to their correspondence in the current Aplica Theme Engine structure. It identifies what was preserved (with renaming), what was evolved, and what still needs to be formalized.

---

## 0. Color Evolution Line (Alpha → V1 → V2)

This is the most important section of the mapping — color decomposition is where the system evolved the most.

### Alpha (2020–2022) — Manual decomposition via Darken/Lighten

Color decomposition in the Alpha was **manual and algorithmically simple**, based on darkening/lightening operations on the base color.

**Two types of decomposition:**

#### Behavioral Decomposition (5 states)

| Alpha state | Operation | V2 equivalent |
|------------|---------|--------------|
| `Darkest` | base color → darkest (texts, dark backgrounds) | `behavior.darkest` (palette.170) |
| `Action` | +6 scales toward dark | `behavior.action` (palette.120 = hover) |
| `Default` | pure base color | `behavior.normal` (palette.100) |
| `Active` | +6 scales toward light | `behavior.pressed` (palette.140) |
| `Lightest` | +9 scales toward light (light background) | `behavior.lightest` (palette.10) |

> **Note:** In V1, `Active` was the click state. In V2.24, `active` was renamed to `pressed`, and `focus` gained its own token (palette.50).

#### Layout Decomposition (Neutrals)

| Alpha step | Operation | V2 equivalent |
|-----------|---------|--------------|
| `Base to Neutral` | primary color darkened 50% | `neutrals` — chroma reduced via OKLCh |
| `Highest Contrast` | Base to Neutral darkened 25% | `neutrals.140` (darkest) |
| 17 levels of `neutral.170` → `contrast.deep.light` | Linear interpolation | 15 levels `neutrals.5` → `neutrals.140` |
| `Neutral 5` (intermediate) | 1 step from `neutral.10` toward light | `neutrals.5` |

**Alpha interpolation method:** `darken()`/`lighten()` in HSL — simple but perceptually imprecise.

#### Alpha Accessibility Rule

```
1. Test font vs. background with "Color Darkest"
2. Failed? → test "Contrast Dark Deep" (#000000)
3. Failed? → test "Color Lightest"
4. Failed? → test "Contrast Light Deep" (#ffffff)
Minimum required: WCAG AA (4.5:1 for normal text)
```

---

### V1 (2022–2023) — Formalized taxonomy, still manual

V1 did not change the color algorithm, but **formalized the taxonomy**:

| V1 category | V1 subgroups | V2 token |
|------------|-------------|---------|
| Brand Colors | Main brand color | `color.primary` |
| Ambient Colors | Neutrals, Contrast, Grayscale | `color.tone.neutral.*`, `color.ambient.grayscale.*` |
| Interaction Colors | Function (Primary/Secondary/Link), Feedback (Info/Success/Warning/Danger) | `color.interaction.function.*`, `color.interaction.feedback.*` |
| Text Colors | Base (Positive/Negative), Feedback | `color.text.*` |

---

### V2 (2023–present) — Automated OKLCh pipeline

V2 replaced the manual darken/lighten operations with the **OKLCh** pipeline — a perceptually uniform color space:

| Aspect | Alpha/V1 | V2 |
|--------|---------|-----|
| **Color space** | HSL (darken/lighten) | OKLCh (Luminosity, Chroma, Hue separated) |
| **Palette** | 5 manual states | 19 automatic levels (10–190) |
| **Neutrals** | 17 levels via darkening of primary | 15 levels via OKLCh (chroma × 0.1) |
| **Grayscale** | Via brand grayscale scale | Separate file, fixed customizable values |
| **Accessibility** | Sequential manual rule | Automatic — WCAG algorithm calculates `txtOn` |
| **Dark mode** | Manual | Automatic inversion: `dark.surface[L] = light.surface[200-L]` |
| **txtOn variants** | 1 rule (darkest/lightest) | 3 strategies: `high-contrast`, `brand-tint`, `custom-tint` |

**Why OKLCh is superior to HSL:**
- In HSL, interpolating from orange to blue passes through indistinguishable greens
- In OKLCh, `L` (Lightness) is perceptually linear: `L=0.5` is visually the exact midpoint
- Reducing `C` (Chroma) creates neutrals with preserved color temperature — not pure gray
- Guarantee that `L=0.98` is "near white" and `L=0.05` is "near black" at any hue

**V2 reference:** `docs/context/dynamic-themes-reference/COLOR-DECOMPOSITION-SPEC.md`

---

## 1. Size and Spacing System (Dimension)

### V1 — Original variables

| V1 variable | Type | Value | V2 equivalent |
|------------|------|-------|--------------|
| `LayoutUnit` | Number | `4` | `LayoutUnit` |
| `ScaleMultiplierFactor` | Number | `4` | `ScaleMultiplierFactor` |
| `DefaultDesignUnit` | Number | `LayoutUnit × ScaleMultiplierFactor = 16` | `DefaultDesignUnit` |
| `scaleLevels` | Number | `4` | `scaleLevels` |
| `FibonacciScale` | Array | `[16, 28, 44, 72, 116]` | `FibonacciScale` |
| `DescendingScale` | Array | `[4, 8, 12]` | `DescendingScale` |
| `DescendingScaleInferior` | Array | `[1, 2]` | `DescendingScaleInferior` |
| `Size[]` | Array | `0.01 + DescendingScaleInferior + DescendingScale + FibonacciScale` | `Size[]` |
| `Spacing[]` | Array | `0 + DescendingScale + FibonacciScale` | `Spacing[]` |

**Rules preserved intact:**
- Starts at `DefaultDesignUnit` (16dp)
- Above: Fibonacci progression (sum of previous two, multiples of `LayoutUnit`)
- Between `LayoutUnit` and `DefaultDesignUnit`: subtraction of `LayoutUnit`
- Below `LayoutUnit`: divide by 2, rounded down
- Minimum spacing = `LayoutUnit` (4dp); minimum size = 1dp

### What evolved in V2

1. **Density variants** — V1 had a single scale. V2 introduced `minor`/`normal`/`major`, each with its own `DefaultDesignUnit`, making the scale parametric.

2. **Semantic aliases per variant** — in V1, aliases were fixed. In V2, each variant can have distinct `semanticByVariant`.

3. **Integrated typography** — in V2, fontSizes and lineHeights are generated in the same dimension file (`_theme_typography` key), coupling spatial and typographic scale.

### V2 reference files
- Documentation: `references/aplica-tokens-theme-engine/docs/context/dimension/01-spatial-system.md`
- Implementation: `references/aplica-tokens-theme-engine/dynamic-themes/scripts/dimension-scale.mjs`
- Config: `references/aplica-tokens-theme-engine/config/global/dimension.config.mjs`

---

## 2. Opacity System

### V1 — Original variables

| V1 variable | Type | Value |
|------------|------|-------|
| `TRANSPARENT` | Constant | `0%` |
| `TRANSLUCID` | Constant | `50%` |
| `OPAQUE` | Constant | `100%` |
| `LEVEL_SHORTCUT` (LS) | Constant | `2` (number of intermediate levels) |
| `VARIATION_SHORTCUT` (VS) | Constant | `10%` (variation per degree) |
| `QUARTER` | Boolean | `true` (if intermediate values are created) |
| `LsLoop` | Derived | `LS / 2` (subtractor for loop) |
| `levelsUpOpacity[]` | Array | Loop adding from TRANSPARENT → TRANSLUCID |
| `levelsDownOpacity[]` | Array | Loop subtracting from OPAQUE → TRANSLUCID |
| `levelsOpacity[]` | Array | Used when LS > 8 (total / LS division) |

**V1 algorithm logic:**
- If `LS ≤ 8`: creates `VS = 10%` per degree, generates arrays from above and below
- If `LS > 8`: `VS = 100% / LS`, generates a single array
- `QUARTER = true`: creates intermediate values (25%, 75%)

### Status in V2

**Not formalized as a mathematical rationale.** `data/semantic/default.json` has `semantic.opacity.*` but without documentation of the generating algorithm. The current scale is:

```
semantic.opacity.intense   → 0.80
semantic.opacity.medium    → 0.50  (= TRANSLUCID)
semantic.opacity.light     → 0.30
semantic.opacity.subtle    → 0.10
```

### What to adapt for V2

Create `docs/context/opacity-system.md` with:
1. The three foundational constants (TRANSPARENT / TRANSLUCID / OPAQUE) as semantic anchors
2. The algorithmic generation logic (LS, VS, QUARTER) as a reference for expanding the scale
3. Mapping between the V1 logic and current `semantic.opacity.*` tokens
4. **Proposal**: make the opacity scale configurable via config (like Dimension), not hardcoded

**File to create:** `references/aplica-tokens-theme-engine/docs/context/OPACITY_SYSTEM.md`

---

## 3. Depth System (Depth / Elevation)

### V1 — Element structure

V1 defined depth as a composition of 5 primitive elements:

| Element | V1 token | Semantics |
|---------|---------|-----------|
| **Position** | `depth.elements.position.outter / inner` | External shadow (elevation) or internal (inset) |
| **Distance** | `depth.elements.distance.<sizing-alias>` | Shadow size on X and Y axes |
| **Intensity** | `depth.elements.intensity.low/medium/high` | Shadow blur (0.05, 0.15, 0.30) |
| **Proximity** | `depth.elements.proximity.distant/medium/close/flat` | Shadow spread (-8, -4, -2, 0) |
| **Luminosity** | `depth.elements.luminosity.shadow.*/light.*` | Shadow or light color |

**V1 elevation levels:**

| Level | V1 token | Semantic use |
|-------|---------|-------------|
| Level -1 | `depth.level.oneMinus` | Forms/inputs (internal depth) |
| Level 0 | `depth.level.zero` | No elevation (reset) |
| Level 1 | `depth.level.one` | Pressed/interaction |
| Level 2 | `depth.level.two` | Cards/default buttons |
| Level 3 | `depth.level.three` | Navigation |
| Level 4 | `depth.level.four` | Dropdowns |
| Level 5 | `depth.level.five` | Pickers, tooltips |
| Level 6 | `depth.level.six` | Modals |

### Status in V2

**Partially implemented.** V2 has the levels (`level_minus_one` to `level_six`) and they are configurable per theme via `elevation` in the config. But **the rationale of the 5 primitive elements is not documented** — what exists is only the `boxShadow` configuration per level.

### What to adapt for V2

1. **Document the 5 elements** as the semantics of shadow construction — they do not need to be exposed tokens, but should exist as a guide for configuring `elevation` per theme.

2. **Map the levels** from V1 to V2:
   - V1: `depth.level.oneMinus` → V2: `semantic.depth.level_minus_one`
   - V1: `depth.level.zero` → V2: `semantic.depth.level_zero`
   - V1: `depth.level.one` → V2: `semantic.depth.level_one`
   - (and so on)

3. **Create an elevation configuration guide** explaining how the 5 elements translate into CSS `box-shadow` values when configuring `elevation` in a theme's `*.config.mjs`.

**File to create:** `references/aplica-tokens-theme-engine/docs/context/DEPTH_ELEVATION_GUIDE.md`

---

## 4. Color System — Conceptual Taxonomy

### V1 — Categories

V1 organized colors into 4 major groups:

| V1 group | V1 subgroups | V2 equivalent |
|---------|-------------|--------------|
| **Brand Colors** | Main brand color | `brand.color.*` |
| **Ambient Colors** | Neutrals, Contrast, Grayscale | `brand.color.neutrals.*`, `brand.color.grayscale.*` |
| **Interaction Colors** | Function (Primary, Secondary, Link), Feedback (Info, Success, Warning, Danger) | `semantic.color.interface.function.*`, `semantic.color.feedback.*` |
| **Text Colors** | Base (Positive/Negative), Feedback | `semantic.color.text.*` |

**V1 Interaction decomposition (5 states):**

| V1 state | V1 semantics | V2 state |
|---------|-------------|---------|
| Darkest | Text inside/outside, some backgrounds | `txtOn.*` |
| Action | Mouse over — clickable element | `hover` |
| Default | Default state | `normal` |
| Active | Click / tap | `pressed` (V2.24: `active` = pressed) |
| Lightest | Light text, some backgrounds | `background` levels |

**V1 accessibility rules:**
1. Test font vs. background with `Darkest`
2. Failed → test with darkest Deep Contrast color (`Deep Dark`)
3. Failed → test with `Lightest`
4. Failed → test with lightest Deep Contrast color (`Deep Light`)

### Status in V2

**Implemented and evolved.** The OKLCh pipeline decomposes automatically. The 5 V1 states map to V2 semantic states. The accessibility rule is automated (automatic WCAG calculation of `txtOn`).

### What to adapt

Create a historical/conceptual document at `docs/context/color-taxonomy-rationale.md` that explains the conceptual taxonomy (Brand vs. Ambient vs. Interaction vs. Text) and shows the mapping to current nomenclature.

---

## 5. Semantic Typography System

### V1 — Typographic groupings

V1 defined semantic typographic groupers:

| V1 grouper | Description |
|-----------|------------|
| Titles | Heading hierarchy |
| Callouts | Display/hero text |
| Block content | Body text |

### Status in V2

**Significantly evolved.** V2 has 7 formal categories:
`heading`, `content`, `display`, `hierarchy`, `action`, `link`, `code`

### What to adapt

Document the correspondence between V1 groupers and the 7 V2 categories in `docs/context/typography-categories-rationale.md`.

---

## Summary: Actions by Priority

| Priority | Action | Destination |
|---------|------|---------|
| **High** | Create `OPACITY_SYSTEM.md` — only rationale without documentation | `docs/context/OPACITY_SYSTEM.md` |
| **High** | Create `DEPTH_ELEVATION_GUIDE.md` — 5 elements undocumented | `docs/context/DEPTH_ELEVATION_GUIDE.md` |
| **Medium** | Create `color-taxonomy-rationale.md` — historical bridges | `docs/context/color-taxonomy-rationale.md` |
| **Low** | Add V1 variables to `01-spatial-system.md` as historical reference | `docs/context/dimension/01-spatial-system.md` |
| **Low** | Create `typography-categories-rationale.md` | `docs/context/typography-categories-rationale.md` |

---

## Source Files in the Knowledge Base

All extracted V1 documents are in:
`knowledge-base/06-history/_extracted/aplica-ds-v1/`

Primary reference files for adaptation:
- `191-engineering-summary-sizes-and-spacing.md` → Sizing/Spacing
- `172-engineering-summary-05-opacity.md` → Opacity
- `186-engineering-summary-depth.md` + `260-depth-tokens.md` → Depth
- `050-01-colors.md` + `064-color-categories-in-detail.md` → Color taxonomy
- `085..089-semantic-typography-groupers.md` → Typography categories
