---
level: n2
id: N2-01
title: "The 5-Layer Mental Model"
prerequisites: ["N1 complete"]
duration: "15 min"
lang: en
---

# N2-01 · The 5-Layer Mental Model

## Context

In N1, you learned to use the system as a consumer. Now the question shifts: why was the system built this way?

Understanding the layers is not a theoretical exercise. It is what lets you make architecture decisions with confidence — knowing where each type of decision lives, why certain rules exist, and what happens when you try to work around them.

---

## Concept

### The paint metaphor

Think of a painter mixing paints. They start with pure pigments — raw colors, with no context. The blue pigment is not "button" or "error" — it is just blue.

From the pigment, they create a working palette for a specific canvas: depending on whether they are painting in daylight or candlelight, the same paints become cooler or warmer. And depending on the support — a normal positive canvas or a photographic negative — the relationships between colors invert.

Only at the end, when applying the paint, does the blue become "the scene's sky" or "the character's shadow" — it gains a **purpose**.

The token system works in exactly the same way. Five layers, each with a clear responsibility.

---

### The five layers

```
Brand  →  Mode  →  Surface  →  Semantic  →  Foundation
```

---

#### Layer 1 — Brand (the pigment)

**What it does:** Stores the pure visual identity of each brand. Declared colors are decomposed into 19 lightness levels and 15 neutral levels — the complete palette from a single hex.

**Who decides:** The branding team or the theme configurator (via `*.config.mjs`).

**What it contains:**
- Decomposed palettes of each brand color (primary, secondary, tertiary)
- Neutrals derived from each color (with reduced saturation)
- Typography configurations (font families, weights)
- Brand gradient tokens

**What it does NOT do:** Knows nothing about interface, dark mode, or surface. It is raw material.

**Consumption rule:** Components never use Brand layer tokens directly. You will never see `var(--brand-branding-first-100-background)` in a correct component.

---

#### Layer 2 — Mode (the ambient light)

**What it does:** Applies the light context — light or dark. In light mode, palette level 10 is the lightest. In dark mode, the scale inverts mathematically: level 10 becomes the equivalent of level 190 from light.

**Who decides:** The engine, based on the architecture schema.

**What it contains:**
- References to Brand tokens with the correct scale for each mode
- The palette inversion logic for dark mode
- Dark mode saturation reduction (default: 15% less vibrant)

**What it does NOT do:** Knows nothing about buttons, cards, or alerts. It only knows light/dark.

---

#### Layer 3 — Surface (the support)

**What it does:** Applies the surface context — positive (normal) or negative (inverted). Like the photographic concept of a negative: on the negative surface, what was light becomes dark and vice versa, within the same mode.

**Who decides:** The engine, based on the architecture schema.

**What it contains:**
- References to Mode with or without additional inversion
- Positive: the standard interface
- Negative: useful for inverted sections, contrast banners, premium elements

**What it does NOT do:** Knows nothing about interface. It is support context.

---

#### Layer 4 — Semantic (the purpose)

**What it does:** This is the layer where pigments gain intent. `semantic.color.interface.function.primary.normal.background` is not "blue" — it is "the background of the primary action element in its resting state." The purpose is in the name.

**Who decides:** The architecture schema + the DS team. New tokens only enter via schema changes (and with awareness of the cost).

**What it contains:**
- The full interface taxonomy (function, feedback, brand branding, brand ambient)
- Product colors (customizable per project, but with exponential cost)
- Typography, dimension, border, opacity, and depth tokens
- Plain text tokens (`text.title`, `text.body`, etc.)

**What it is:** **The canonical layer exposed for consumption.** Components use Semantic.

**Consumption rule:** Every library component always uses Semantic. No exceptions.

---

#### Layer 5 — Foundation (the product vocabulary)

**What it does:** A collection of aliases — short names that point to Semantic tokens. `foundation.bg.primary` is a shortcut to a long Semantic path. The value is not in Foundation — it only points to Semantic.

**Who decides:** The DS team (for the engine's default Foundation) or the product team (for consumer-specific custom foundations).

**What it contains:**
- Background aliases (`bg.primary`, `bg.weak`, `bg.brand.*`, `bg.feedback.*`)
- Text aliases (`txt.title`, `txt.body`, `txt.muted`)
- Border aliases (`border.primary`, `border.feedback.*`)
- Composed typography styles (`heading`, `body`, `display`)
- Composed elevation styles (ready-made shadows per level)

**What it is NOT:** Foundation does not replace Semantic as the source of truth. If you apply an incorrect Foundation alias, Semantic is still what counts.

---

### The orthogonal layer — Dimension

Beyond the 5 sequential layers, there is a layer that runs in parallel: **Dimension**.

It does not follow the Brand → Mode → Surface chain. It feeds Semantic and Foundation directly with the spacing and typography scale. Dimension has three variants:

| Variant | DefaultDesignUnit | Use |
|---------|-------------------|-----|
| `minor` | 8px | Compact interfaces |
| `normal` | 16px | The default scale |
| `major` | 24px | Spacious interfaces |

Every dimensional token (`spacing.medium`, `sizing.large`) is defined as a multiple of the active variant's DefaultDesignUnit.

---

## Guided example

### Tracing a color from config to component

Consider the primary color of a hypothetical brand: `#C40145` (red).

```
1. Brand layer
   _brand.json: "theme.color.light.interface.positive.function.primary.normal.background"
   → #C40145 (calculated by the engine via OKLCh)

2. Mode layer (light.json)
   "mode.interface.positive.function.primary.normal.background"
   → references Brand light

3. Surface layer (positive.json)
   "surface.interface.positive.function.primary.normal.background"
   → references Mode

4. Semantic layer (default.json)
   "semantic.color.interface.function.primary.normal.background"
   → references Surface

5. Foundation layer (default.json)
   (no Foundation alias for this specific token — goes directly from Semantic)

6. Component (CSS)
   background: var(--semantic-color-interface-function-primary-normal-background)
   → #C40145
```

Six references, one chain. If you change `#C40145` to `#D01050` in the config, the entire chain is automatically regenerated.

---

## Now you try

Given the scenario below, identify which layer the decision should be made in:

1. The product team wants to change the border radius of all buttons to 4px
2. A new product wants to use red as its primary color instead of blue
3. Design wants a top banner to use color inversion (like a photographic negative)
4. A `feedback.warning` token with higher intensity is needed for critical alerts
5. The product team wants a `bg.hero` shortcut that resolves to the brand hero background

**Expected result:**

| Decision | Layer | Justification |
|----------|-------|---------------|
| Change border radius | **Semantic / Dimension** | `semantic.border.radii.*` — global theme |
| Change primary color | **Brand** (via config) | Brand identity color |
| Negative banner | **Surface** (negative) | Surface context, not a color change |
| New warning intensity | **Semantic** (via schema) | New feedback level in the schema |
| `bg.hero` alias | **Foundation** | Shortcut alias pointing to Semantic |

---

## Checkpoint

By the end of this tutorial you should know:

- [ ] What each of the 5 layers does and why it exists
- [ ] Why components never use Brand, Mode, or Surface directly
- [ ] The difference between Semantic (purpose) and Foundation (shortcut)
- [ ] What the Dimension layer is and why it is orthogonal
- [ ] Mentally trace the path of a color from config to component

---

## Next step

[N2-02 · How a color becomes a token — the OKLCh pipeline](./02-pipeline-oklch.md)

You understand the structure. The next step is to understand the process: what happens between declaring a color in the config and having the 34 tokens derived from it available in Figma?

---

## References

- Token architecture: [01-token-architecture.md](../../01-design-tokens-fundamentals/01-token-architecture.md)
- Brand layer: [01-brand-layer.md](../../02-token-layers/01-brand-layer.md)
- Mode layer: [02-mode-layer.md](../../02-token-layers/02-mode-layer.md)
- Surface layer: [03-surface-layer.md](../../02-token-layers/03-surface-layer.md)
- Semantic layer: [04-semantic-layer.md](../../02-token-layers/04-semantic-layer.md)
- Foundation layer: [05-foundation-layer.md](../../02-token-layers/05-foundation-layer.md)
