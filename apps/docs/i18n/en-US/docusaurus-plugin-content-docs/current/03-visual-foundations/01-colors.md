---
title: "Aplica DS Color System"
lang: en
---

# Aplica DS Color System

## Premise

Colors in a Design System are a complete subsystem — not aesthetics, but structure. Every color decision has a semantic reason: it exists because it represents a role in the interface, not because it looks good.

Aplica DS starts from a simple principle: **no hardcoded colors. Every color is a token with purpose.** The same semantic token can assume different values depending on brand, mode, and surface — without the component consuming it needing to know any of that.

---

## Color Taxonomy

The system organizes colors into groups with distinct responsibilities. Each group answers a different question.

### Brand Colors

> "Who is the brand?"

Colors that carry visual identity. Each brand defines up to three primary colors:

| Token | Semantics |
|-------|-----------|
| `brand.first` | Main brand color |
| `brand.second` | Secondary color |
| `brand.third` | Tertiary color |

These colors form the basis for all brand gradients and influence the generation of neutral colors (neutrals).

### Interface — Function

> "What is the action hierarchy?"

Colors that signal interactive actions in components:

| Token | Semantics |
|-------|-----------|
| `interface.function.primary` | Primary action — highlight button, CTA |
| `interface.function.secondary` | Secondary action — can coexist with multiple elements at the same level |
| `interface.function.link` | Anchors, buttons that look like links |

The distinction between Brand and Function is fundamental: Brand communicates identity; Function communicates interactivity. An element with a Brand color is not necessarily clickable. An element with a Function color always is.

### Interface — Feedback

> "What is the system responding to?"

| Token | Semantics |
|-------|-----------|
| `interface.feedback.info` | Neutral notifications, information without positive/negative bias |
| `interface.feedback.success` | Completed action, positive reinforcement |
| `interface.feedback.warning` | Attention needed, without blocking use |
| `interface.feedback.danger` | Error, block, destructive action |

Each feedback type has a `default` variant (softer) and `secondary` (more saturated). This allows using the soft variant for backgrounds and the saturated one for borders or icons in the same component.

**Note on "Danger" vs "Error":** The name `danger` is intentional. Beyond errors, this color is used for potentially destructive actions (e.g., "Delete account") — where there is no error, but there is real risk.

### Product

> "What is the product context?"

Colors for business needs that do not fit into the universal interface vocabulary. Some products need entirely their own visual languages — food temperature indicators, promotional badges, cashback signaling, premium subscription tiers, risk indicators, seller badges — and the **Product** category exists for exactly that.

> [!IMPORTANT]
> **Product is born in the config, before any layer.** Understanding this origin is essential for designers to maintain intent from the beginning of work on a visual system. Every product color starts as a deliberate hex hue decision, explicitly registered.

#### Origin: The config is the source of truth

Everything starts in the theme configuration file (`*.config.mjs`). Product colors are declared in two steps:

**Step 1 — Hue declaration** (`colors`):
```js
colors: {
  // ... (brand, action, feedback)
  
  // Product: each item has default + alternative variant (_alt)
  product_promo:        '#6BC200',   // main promo hue
  product_promo_alt:    '#D2FD9D',   // alternative/secondary hue
  product_cashback:     '#FFBB00',
  product_cashback_alt: '#FFF94F',
  product_premium:      '#B200AF',
  product_premium_alt:  '#EBC2DD'
}
```

**Step 2 — Semantic mapping** (`mapping.product`):
```js
mapping: {
  product: {
    promo_default:     'product_promo',      // → default variant
    promo_secondary:   'product_promo_alt',   // → alternative variant
    cashback_default:  'product_cashback',
    cashback_secondary:'product_cashback_alt',
    premium_default:   'product_premium',
    premium_secondary: 'product_premium_alt'
  }
}
```

This mapping connects the free name (`product_promo`) to the semantic role (`promo_default`). From here, the engine does all the work automatically.

#### Pipeline: from hex hue to consumable token

Each product color goes through exactly the same pipeline as Brand and Interface:

```
┌─────────────────────────────────────────────────────────────────────┐
│  CONFIG (*.config.mjs)                                              │
│  colors.product_promo = '#6BC200'                                   │
│  mapping.product.promo_default = 'product_promo'                    │
│                                                                     │
│  ▼ color-decomposer.mjs                                            │
│  OKLCh decomposition → 19 levels × (surface, txtOn, border)        │
│  + 15 neutral levels × (surface, txtOn, border)                     │
│  + 6 behavior aliases                                               │
│                                                                     │
│  ▼ Brand Layer (_brand.json)                                        │
│  brand.color.product.positive.promo_default.{lowest→highest}       │
│  brand.color.product.negative.promo_default.{lowest→highest}       │
│                                                                     │
│  ▼ Mode Layer (light.json / dark.json)                              │
│  mode.color.product.promo_default.{lowest→highest}                 │
│  (light = positive, dark = inverted + chroma × 0.85)               │
│                                                                     │
│  ▼ Surface Layer (positive.json / negative.json)                    │
│  surface.color.product.promo.default.{lowest→highest}.{bg/txtOn/b} │
│                                                                     │
│  ▼ Semantic Layer (default.json)                                    │
│  semantic.color.product.promo.default.{lowest→highest}.{bg/txtOn/b}│
└─────────────────────────────────────────────────────────────────────┘
```

Each item produces **5 intensities** (`lowest`, `low`, `default`, `high`, `highest`) × **3 properties** (`background`, `txtOn`, `border`) = **15 tokens** per variant. With `default` + `secondary`, that is **30 tokens per Product item**.

> [!CAUTION]
> **The cost of each color is exponential. Less is more.**
>
> Each Product item is not "just one color" — it is an **exponential cascade**:
>
> | Action | Tokens generated |
> |--------|-----------------|
> | 1 item (2 variants) | **30 tokens** in the Semantic layer |
> | × 4 layers (Brand, Mode, Surface, Semantic) | **~120 tokens** per theme |
> | × N themes (e.g., 4 brands) | **~480 tokens** in total system |
>
> The 3 default items (`promo`, `cashback`, `premium`) already represent **~360 tokens per theme**. Each additional item accelerates growth.
>
> **More tokens = more chaos:** performance loss (larger CSS/native files, slower builds), increased complexity (more decisions for designers, more properties for engineers), and entropy (underutilized tokens create confusion and technical debt).
>
> Before adding a new Product item, ask:
> 1. _Can this need be solved with Feedback (info/success/warning/danger)?_
> 2. _Can it be solved with an existing Brand variant?_
> 3. _Do more than 2 components actually need this color?_
>
> If any answer is yes, **do not create a Product item.**

#### Default items provided by the Theme Engine

| Item | Default variant | Secondary variant | Typical use |
|------|----------------|-------------------|-------------|
| `promo` | `product_promo` | `product_promo_alt` | Promotions, discounts, offer badges |
| `cashback` | `product_cashback` | `product_cashback_alt` | Financial return, rewards |
| `premium` | `product_premium` | `product_premium_alt` | Tiers, subscriptions, special status |

> [!WARNING]
> **Items are extensible, but at a cost.** To add a new item, simply declare it in `colors` and `mapping.product` in the theme config. The pipeline will automatically create the entire palette. But read the warning above — each new item propagates dozens of tokens across all layers and all themes. Document the justification and validate that the need cannot be met with existing tokens.

#### Product text tokens

Beyond the functional trio (`background`/`txtOn`/`border`), the system generates dedicated text tokens for pure content contexts — where the text is colored but there is no associated background surface:

```
semantic.color.text.promo            → standalone promotional text
semantic.color.text.promo_secondary  → secondary variant
semantic.color.text.cashback         → cashback text
semantic.color.text.premium          → premium tier text
```

#### Difference between Product and Feedback

| | Interface — Feedback | Product |
|---|---|---|
| **Scope** | Universal (every UI needs info/success/warning/danger) | Business-specific (not every UI needs promo) |
| **Schema** | Rigid — fixed in the engine, not extensible | Open — new items via config |
| **Intent** | Communicate system action results | Communicate product domain context |
| **Example** | "Password saved successfully" (success) | "20% cashback on this purchase" (cashback) |

### Ambient — Grayscale

> "Do I need depth without color interference?"

Fixed scale of 15 levels (5–140) with pure neutral values (no hue).

The decision to limit Grayscale usage strictly to structural elements (finishes, borders, lines) and shadows (depth) is not arbitrary. It is strongly grounded in **accessibility (A11y)** and industry best practices:

1. **Borders and dividers (WCAG 1.4.11 - Non-text Contrast & WCAG 1.4.1 - Use of Color):**
   - The architectural backbone of a UI (its boundaries, inputs, and data separators) must be infallible. Pure grays ensure that **luminance** (the critical variable for contrast) is perfectly predictable on any monitor, making it easier to meet the required `3:1` ratio.
   - Per rule 1.4.1, color must not be the only visual means of conveying information. By building the product "skeleton" in Grayscale, we ensure it works through pure contrast alone. This reserves and isolates the use of vivid colors and colored "Neutrals" only for highlighting hierarchy, surface areas, and semantic states (active, focus, error). If everything is colored, the brain experiences *Cognitive Overload*.

2. **Shadows and depth (Box-shadows):**
   - Although "colored shadows" enhance *soft/glassmorphism* designs on the web, in high-density systems like Aplica DS they introduce mathematical uncertainty in contrast calculations. Overlaying a colored translucent shadow on other interface backgrounds affects not just luminosity, but also the resulting color matrix (hue shift/achromatic degradation), making it impossible to algorithmically guarantee predictable contrast (WCAG).
   - Using exclusively Grayscale (such as `#1a1a1a` with controlled opacity) acts purely as a luminance subtraction from underlying pixels. This faithfully simulates real physical shading (occlusion) free from noise, creating clean layers (elevation) while keeping contrast calculable and safe for the interface.

*(Note: Grayscale is not generated algorithmically — values are fixed per theme and can be overridden via configuration).*

| Level | Value (default) | Typical use |
|-------|----------------|-------------|
| 5 | `#f7f7f7` | Near white — card background |
| 50 | `#aaaaaa` | Mid tone — neutral borders |
| 100 | `#555555` | Dark-mid tone — secondary text |
| 140 | `#1a1a1a` | Near black — primary text in dark |

### Ambient — Neutrals

> "Do I need depth with brand temperature?"

Scale of 15 levels generated from the brand's base color, but with chroma (color intensity) significantly reduced to **10%** of the original. The result is near-neutral tones with a slight chromatic temperature — creating coherence between the environment and the brand identity without drawing attention to themselves.

Neutrals are used primarily for section backgrounds, card surfaces, and UI states, enveloping the product.

> [!NOTE]
> **Why aren't Neutrals simply "Grays"? (The common confusion)**
> It is very common for design teams to ask: *"Why can't I use a gray from the Grayscale palette for this background? Why isn't gray the system's 'Neutral'?"*
>
> The answer is in **Optical Harmony**.
> - **Grayscale (Pure Gray):** It is the mathematical absence of color. When you place a button with the brand's vibrant color (e.g., Blue) on a pure gray background, the colors don't speak to each other. Pure gray tends to look "dead," "dirty," or drag the palette toward a faded appearance when paired with vivid colors.
> - **Neutrals (Tempered tone):** These are what we call "Colored Grays." In Aplica DS, Neutrals inject 10% of your brand's hue. If the brand is Blue, the Neutral will be a very slightly bluish gray. This makes backgrounds, borders, and surfaces speak naturally with the product's brand, creating a harmonious, *premium*, and alive interface, even in the "empty" areas of the screen.
>
> The golden rule: **Use Neutrals to draw the interface and surfaces. Use Grayscale only when color is forbidden (e.g., real shadows, strict content dividers, or pure text-supports).**

---

## Color Decomposition

Given a base hex color, the Theme Engine automatically decomposes it into three scales:

### Palette — 19 Levels (10–190)

The primary scale. Each level has three calculated values:
- **surface** — the fill color at that level
- **txtOn** — the accessible text color on top of that surface
- **border** — the border color at that level

**Luminosity interpolation (OKLCh):**

```
Level 10   → L ≈ 0.98  (near white)
Level 100  → L = baseL (exact original color)
Level 190  → L ≈ 0.05  (near black)

Above 100: linear interpolation from baseL to 0.98
Below 100: linear interpolation from baseL to 0.05
```

Level 100 is always the color declared in the config — without OKLCh round-trip, preserving exactly the configured value.

**Border:** derived from the surface by a configurable offset (default: +10 levels). In light mode, the border is a darker shadow; in dark mode, lighter.

### Neutrals — 15 Levels (5–140)

Desaturated scale. Same structure (surface/txtOn/border), but with chroma multiplied by **0.1** — keeping only 10% of the original saturation.

```
Level 5    → L ≈ 0.98  (near white with temperature)
Level 140  → L ≈ 0.05  (near black with temperature)
```

Neutrals support an alternative base color via `override.baseColor` — allowing neutral temperature to be independent of the primary color.

### Behavior — 6 Semantic Levels

Aliases over the palette, with names corresponding to interaction states:

| Name | Palette reference | Use |
|------|------------------|-----|
| `lightest` | palette.10 | Softest state — hover on sensitive areas |
| `active` | palette.50 | Keyboard focus, highlight |
| `normal` | palette.100 | Default resting state |
| `action` | palette.120 | Mouse hover |
| `pressed` | palette.140 | Click/tap, active state |
| `darkest` | palette.170 | Maximum emphasis — rarely used |

Behavior generates no new calculations — it is a semantic mapping over the existing palette.

---

## txtOn Strategies

`txtOn` is the text token that guarantees readability on any surface. The system supports three configurable strategies per theme:

### 1. `high-contrast` (conservative default)

Always black (`#000000`) or white (`#ffffff`) — whichever has greater contrast with the surface. Result: maximum contrast, no color nuance.

**When to use:** Systems where accessibility is the absolute priority; high-criticality interfaces.

### 2. `brand-tint`

Searches within the palette itself for the nearest level that passes WCAG AA (4.5:1). For light surfaces, searches dark tones of the palette; for dark surfaces, light tones.

**Result:** Text that maintains the brand's chromatic tone — more visually coherent, accessible.

**When to use:** When visual identity matters and the brand has sufficiently saturated colors.

### 3. `custom-tint`

Accepts a fixed color for light and another for dark. If the configured color does not pass WCAG, falls back to `high-contrast` or `brand-tint` as the declared fallback.

**When to use:** When the brand guideline specifies exactly which text color to use, such as on specific brand surfaces.

**Accessibility level configuration:** The system supports `AA` (4.5:1 — default) or `AAA` (7:1). `colorContrastDecompose` (`startDark`/`startLight`) controls which extreme the algorithm tries first.

---

## Dark Mode

In dark mode, the system does not redefine colors — it inverts the palette:

```
surface_dark[level] = surface_light[200 - level]

That is:
  dark[10]  = light[190]  → dark mode has the darkest tone at the lowest level
  dark[100] = light[100]  → the base color stays (level 100 does not change)
  dark[190] = light[10]   → dark mode has the lightest tone at the highest level
```

**Chroma reduction:** Dark mode applies a saturation multiplier (`darkModeChroma`, default: `0.85` = 15% less saturated). Very vibrant colors in light mode become slightly softer in dark — reducing eye fatigue without losing identity.

**Borders in dark mode:** Borders are generated in the opposite direction (lighter than the surface, not darker) to maintain visibility on dark backgrounds.

---

## Grayscale in Production

Grayscale has a separate file (`_grayscale.json`) because:
1. Its values are fixed (not algorithmically calculated)
2. Each theme can override the values via `overrides.grayscale`
3. Separate generation allows customization without affecting the brand color pipeline

Themes with warm temperatures can have a slightly warm grayscale (`#faf8f5` instead of `#f7f7f7`). Minimalist themes can use a cooler scale.

---

## Tokens Generated Per Color

For each color alias in the config (e.g., `joy_pink`, `action_magenta`), the engine generates:

```
brand.color.palette.<level>.surface      → 19 values
brand.color.palette.<level>.txtOn        → 19 values
brand.color.palette.<level>.border       → 19 values

brand.color.neutrals.<level>.surface     → 15 values
brand.color.neutrals.<level>.txtOn       → 15 values
brand.color.neutrals.<level>.border      → 15 values

brand.color.behavior.<state>.surface     → 6 values
brand.color.behavior.<state>.txtOn       → 6 values
brand.color.behavior.<state>.border      → 6 values
```

A typical theme with ~20 base colors generates approximately **1,200 primitive color tokens** before semantic mapping.

---

## Minimum Colors for a Theme

| Group | Aliases | Count |
|-------|---------|-------|
| brand | first, second, third | 3 |
| interface.function | primary, secondary, link | 3 |
| interface.feedback | info, success, warning, danger (default + secondary each) | 8 |
| product | promo, cashback, premium (default + secondary each) | 6 |
| **Total (default template)** | | **20** |

Grayscale is separate and not included in this count. The **product group is extensible** — themes can declare more or fewer items as needed; the 3 items above are the reference template, not a strict minimum.

---

## Accessibility as Algorithm

Accessibility is not a checklist — it is part of the generation process. For each surface/txtOn pair generated:

1. The system calculates the contrast ratio via relative luminance (WCAG)
2. If the pair fails at the configured level (AA or AAA), the fallback mechanism is triggered
3. Failures can be accepted interactively (CLI mode) or in strict mode (build fails)

The `verify-aa-compliance.mjs` script can be run independently for auditing any theme combination.

---

## Color System Evolution

| Phase | Approach | Limitation |
|-------|----------|------------|
| **Alpha** | Manual palette, HSL darken/lighten | No perceptual consistency; distorted tones at high saturations |
| **V1** | Documented algorithm, formalized scale | Still HSL; clear rationale but manual implementation |
| **Current V2** | OKLCh with luminosity interpolation | Real perceptual consistency; algorithmic dark mode; automatic txtOn with WCAG |

The shift to OKLCh was the largest technical break between V1 and V2. In OKLCh space:
- Brightness perception is linear (L=0.5 actually looks "half bright" to the human eye)
- Hue stays stable during tints and shades (blue does not turn purple when lightened)
- Chroma can be reduced independently without hue distortion

---

## References

- Decomposition script: color-decomposer.mjs
- Technical spec: COLOR-DECOMPOSITION-SPEC.md
- Config example: aplica-joy.config.mjs
- Contrast verification: verify-aa-compliance.mjs
- Alpha→V2 mapping: [04-v1-to-v2-rationals-mapping.md](../06-history/04-v1-to-v2-rationals-mapping.md)
