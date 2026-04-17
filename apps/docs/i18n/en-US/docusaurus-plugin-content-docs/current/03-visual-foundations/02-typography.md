---
title: "Aplica DS Typography System"
lang: en
---

# Aplica DS Typography System

## Premise

In Aplica DS, typography is not treated merely as aesthetics, but as a mathematical and hierarchical system built to ensure readability, spatial consistency, and vertical rhythm.

While Brand defines *which* font will be used (font family, available weights), the typography system defines the **scales**, **line heights**, and the **semantic usage** (as a grouping of properties that forms *Semantic Typography*).

---

## Font Size Scale

The typographic scale evolved in V2 to cover broader use cases (from micro interfaces to hero dashboards), totaling **13 sizes**.

The system is based on a musical scale (**Major Third, ratio ~1.2**), rounded to produce even or grid-friendly integer values, ensuring a perceptible progression between levels.

| Size (Token) | Base value in `normal` | Scale rationale |
|--------------|------------------------|-----------------|
| `nano`          | 8px  | Minimum base for badges |
| `micro`         | 10px | Minimal support texts |
| `extraSmall`    | 12px | Metadata / smaller labels |
| `small`         | 14px | Secondary text |
| **`medium`**    | **16px** | **Base size (1rem)** |
| `large`         | 20px | Medium highlight text |
| `extraLarge`    | 24px | Section titles (H4) |
| `mega`          | 28px | Strong subtitles (H3) |
| `giga`          | 36px | Page titles (H2) |
| `tera`          | 40px | Hero block (H1) |
| `peta`          | 48px | Impact titles |
| `exa`           | 60px | Secondary display |
| `zetta`         | 72px | Oversized primary display |

*Structural note:* These pixel values are the anchor for the `normal` dimension. The system can convert these values to `rem` during the web build, based on the root (`16px`).

---

## Line Heights

To maintain exact vertical rhythm (Vertical Rhythm) on Web and Mobile, all line heights are strictly locked to the **4px grid**.

V2 replaced the old "magic" line heights with a predictable algorithm based on multipliers (factors) applied to the associated `fontSize`.

### Semantic Multipliers

| Line Height Token | Factor | Semantics and Use |
|------------------|--------|-------------------|
| `tight`  | **1.0x** (100%) | Isolated UI elements (buttons, badges, links, inputs). Height = font size, padding is handled by the component's *padding*. |
| `close`  | **1.2x** (120%) | Titles (Heading/Display). Short high-impact texts where wide spacing would cause eye dispersion. |
| `regular` | **1.4x** (140%) | Body texts (Body). Long paragraphs, entirely focused on reading comfort. |
| `wild`   | **1.8x** (180%) | Institutional texts and quotes where *white-space* acts as an aggressive aesthetic element. |

### Derivation and Rounding Algorithm

Line height is always a multiple of `4px`. If the calculation produces a non-round value, the system always **rounds up** (`ceil`) to the next multiple of 4.

```javascript
// The Engine's mathematical rule:
lineHeight = Math.ceil((fontSize * multiplier) / 4) * 4;
```

**Practical derivation example (`giga` = 36px):**
- `tight` = `36 * 1.0` = **36px** (already a multiple of 4)
- `close` = `36 * 1.2` = 43.2 → rounds up to **44px**
- `regular` = `36 * 1.4` = 50.4 → rounds up to **52px**
- `wild` = `36 * 1.8` = 64.8 → rounds up to **68px**

Ensuring multiples of 4 in `lineHeight` prevents layout shift and invisible grid misalignment, eliminating fractional pixels (`sub-pixels`) in rendered interfaces.

---

## Semantic Typography (Styles)

In interfaces, we rarely consume typographic tokens in isolation (such as "give the font 16px, Regular weight, and 140% line-height"). Components and platforms consume *groupings*.

The Aplica Theme Engine exports **Typography Styles** (in Figma: Text Styles / on the Web: CSS utility classes). These styles combine `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, and `letterSpacing` into a clear hierarchy.

### Style Categories

| Category | Role | Exported style examples |
|----------|------|------------------------|
| **Heading** | Hierarchical titles in page structure (H1–H6) and card highlights. Uses `close` line-height (120%). | `title_1` to `title_5`; `highlight_1` to `highlight_5` |
| **Display** | Giant, extravagant texts for hero sections and banners. Strong weights. Uses `zetta` or `exa`. | `display_1` to `display_3` |
| **Content** | Paragraph, reading, list, and label texts. Focus on `medium` (16px) and `regular` line-height (140%). | `body_large`, `body`, `body_small`, `label`, `quote` |
| **Action** | Restricted clickable texts. UI elements such as buttons, tabs, links, and chips. Uses `tight` and bold/semibold weights. | `action.strong.small`, `link.medium` |
| **Code** | Monospaced texts for technical interfaces and development. | `code.small`, `code.medium` |

By restricting engineers and designers to using these **Styles**, the Design System hides the mathematical complexity described above. If someone tries to center a button using `title_1`, the interface breaks due to absence or excess of line-height — the system naturally and algorithmically enforces the correct semantics.

---

## History: From V1 to V2

The biggest change between the legacy version (Alpha / V1) and V2 was mathematical automation.

In V1, the system proposed **11 sizes**, with line heights fixed and "adjusted by eye" or documented in a loose table (where designers had to map `Nano 10 + Tight 1.0 = 12`).

V2 expanded points at the extremes (introducing the giant `exa` and `zetta`, and the tiny `nano` dropping to 8px) to accommodate Data Viz and Marketing, reaching **13 sizes**. Furthermore, all calculations moved to Node processing in Style Dictionary (`theme-engine`), mathematically enforcing Base-4 Grid fidelity across all outputs and native platforms, resolving chronic grid-breaking issues in Android and Web development.

---

## References

- Generation script: [typography-generator.mjs](../../references/aplica-tokens-theme-engine/dynamic-themes/scripts/typography-generator.mjs)
- Dimension-derived scale: [typography-scale-from-dimension.mjs](../../references/aplica-tokens-theme-engine/dynamic-themes/scripts/typography-scale-from-dimension.mjs)
- Technical spec: [TYPOGRAPHY-SPEC.md](../../references/aplica-tokens-theme-engine/docs/context/dynamic-themes-reference/TYPOGRAPHY-SPEC.md)
- Scale detail: [02-typography-scale.md](../../references/aplica-tokens-theme-engine/docs/context/dimension/02-typography-scale.md)
- Line heights: [03-line-height-scale.md](../../references/aplica-tokens-theme-engine/docs/context/dimension/03-line-height-scale.md)
- Mathematics and algorithms: [06-mathematics-and-algorithms.md](./06-mathematics-and-algorithms.md)
- Dimension layer: [06-dimension-layer.md](../02-token-layers/06-dimension-layer.md)
