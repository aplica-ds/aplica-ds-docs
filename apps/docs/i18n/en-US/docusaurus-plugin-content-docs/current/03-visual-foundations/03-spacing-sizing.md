---
title: "Spacing & Sizing (Dimension)"
lang: en
---

# Spacing & Sizing (Dimension)

The **Spacing & Sizing** (Dimension) system of Aplica DS V2 was restructured to provide a robust foundation focused on the **4px Grid**. This system acts as the backbone of layouts, paddings, margins, and component sizing, evolving the legacy (Alpha and V1) "Adapted Fibonacci" logic to a highly predictive and accessible model.

The Dimension layer is consumed directly by the *Foundation* and *Semantic* layers, ensuring that any space or size in the product is mathematically coherent.

---

## 1. The 4-Point Grid (4pt)

The golden rule of all UI construction in Aplica DS V2 is based on the **4-point (4pt) multiplier**.
Every dimension and spacing in structural components (with very rare exceptions for micro details, such as `1pt` borders or highly constrained `2pt` spacings) must be multiples of 4.

> **Important: Points vs Pixels vs REM and EM**
> In design and in the underlying mathematical structure, the framework thinks and executes its calculations **always in points (`pt`)**. The "pixel" (`px`) is viewed solely as a visual *output* possibility (more tied to UI Toolkit rulers, like Figma).
> When the Theme Engine performs the build targeting real systems and platforms (e.g., Web CSS), these dynamic variables are parsed directly to equivalents such as **`rem` or `em`** (natively assuming `16pt = 1rem`), reinforcing all WCAG compliance and guaranteeing screen scalability in the hands of developers.

This principle unifies typography (with line heights mathematically locked to the same grid), iconography, and layout grid into a single dimensional web, drastically reducing numerical alignment errors.

---

## 2. Scale Structure (`dimension.scale`)

While V1 used names like "extraSmall" directly, V2 consolidates its *primitive layer* as numerically generated through **Theme Engine mathematical algorithms**. The system uses percentage abstractions (keys) based on a multiplier coefficient.

### Formulas and Algorithm (Theme Engine)
The dynamic engine generates the scale computationally from the following essential constants (whose rationale originated in V1 studies):
- **`LayoutUnit`**: `4` (The real base unit of the grid).
- **`ScaleMultiplierFactor`**: `4` (Grid multiplier factor).
- **`DefaultDesignUnit`**: `16` (`LayoutUnit × ScaleMultiplierFactor`). Represents the **Default Design Unit** (`1rem` at the structural root and starting point).

To calculate the mathematical value of the scale primitive, the algorithm uses the following formula for each numeric "key":
> **`value_pt = round((key / 100) × DefaultDesignUnit)`**

This means the primitive key `100` results in exactly **`16pt`** (`(100/100) * 16`). The key `200` results in **`32pt`** (`(200/100) * 16`), compiled and converted to the final outputs supported by the target platform (with primary conversion support to `rem` and `em` on the web) at build time. This ensures **granular and programmatic scalability** — it is what allows dynamically injecting new densities into the platform (simply by adjusting the `LayoutUnit`)! The final primitives then feed the Aliases (Semantic Layer).

### Dimension Primitives Table

| Scale | Value (px) | Description / Primary Use |
|-------|------------|---------------------------|
| **0**     | `0px`   | Margin and padding resets. |
| **25**    | `4px`   | Very short gaps, dense layout grids. |
| **50**    | `8px`   | Ultra-compact paddings, separation of logical pairs. |
| **75**    | `12px`  | Compact paddings, light border-radius, card gaps. |
| **100**   | `16px`  | **Base Unit**. Standard compact padding. |
| **125**   | `20px`  | Base-plus breathing room, common in compact modals. |
| **150**   | `24px`  | Comfortable padding for medium components and inputs. |
| **175**   | `28px`  | Paddings for medium cards. |
| **200**   | `32px`  | Standard gap between primary components/groups. |
| **225**   | `36px`  | Comfortable padding in wide components. |
| **250**   | `40px`  | Generous padding areas. |
| **275**   | `44px`  | Layout break, between Large and XL. |
| **300**   | `48px`  | Larger gaps in card sections and macro components. |
| **350**   | `56px`  | XL spacing, substantial padding, panel grids. |
| **400**   | `64px`  | 2XL spacing, large spacings in macro containers. |
| **450**   | `72px`  | 2XL-medium. |
| **500**   | `80px`  | 3XL, hero sections. |
| **550**   | `88px`  | Minimum touch target focused on WCAG Macro accessibility. |
| **600**   | `96px`  | Very large breathing sections. |
| **700**   | `112px` | 4XL, modular padding in full views. |
| **800**   | `128px` | 5XL, large containers, master pages. |
| **900**   | `144px` | 6XL, hero sections. |
| **1000**  | `160px` | 7XL, max paddings. |
| **1200**  | `192px` | 8XL, master layout division. |
| **1400**  | `224px` | 9XL. |
| **1450**  | `232px` | 9XL-large. |
| **1600**  | `256px` | 10XL, absolute maximum spacing. |

---

## 3. Semantic Aliases (`dimension.semantic`)

For engineering and daily CSS property and component consumption, the numeric primitive notation with its high volume generates high cognitive load. Therefore, the design system promotes the following "t-shirt size" Aliases, recovering V1 qualities with weight corrections.

**Technical note:** `pico` breaks the 4px rule because it is exclusive to micro properties such as borders and very thin demarcators (`1px`). All others inherit positions from the scale.

| Alias Name      | Token Resolution                     | Value (px) | Application & Context |
|-----------------|--------------------------------------|------------|------------------------|
| **zero**        | `{dimension.scale.0}`                | `0px`      | Layout resets, margins, static standardizations. |
| **pico**        | *Hard Value*                         | `1px`      | "Pixel-perfect" adjustments, tiny gaps, subtle borders. |
| **nano**        | `{dimension.scale.25}`               | `4px`      | Icon-to-text spacings, or super tight items. |
| **micro**       | `{dimension.scale.50}`               | `8px`      | Label paddings, compact components, inter-related item gaps. |
| **extraSmall**  | `{dimension.scale.100}`              | `16px`     | **Base Unit**. Internal padding for form fields and buttons. |
| **small**       | `{dimension.scale.150}`              | `24px`     | Moderate block gaps, form fields, and comfortable card padding. |
| **medium**      | `{dimension.scale.200}`              | `32px`     | Standard macro spacing between isolated elements on the page or in sections. |
| **large**       | `{dimension.scale.250}`              | `40px`     | Side margin or larger spacing between semantic containers (Layout Break). |
| **extraLarge**  | `{dimension.scale.300}`              | `48px`     | Substantial vertical gap between large product areas. |
| **mega**        | `{dimension.scale.350}`              | `56px`     | Drastic divisions, wide modals, ample paddings. |
| **giga**        | `{dimension.scale.550}`              | `88px`     | Minimum *Touch Target* dimension optimized for primary actions (WCAG Accessibility). |
| **tera**        | `{dimension.scale.900}`              | `144px`    | Large separators, master page divisions, or *hero banners*. |
| **peta**        | `{dimension.scale.1450}`             | `232px`    | End of scroll, immense empty areas, and layout blocks on ultrawide monitors. |

---

## 4. Evolution from Legacy (Aplica DS Alpha and V1)

1. **Abolition of loose pseudo-Fibonacci in the Primitive:** In V1, the global structure grew by summing values in a "Fibonacci-like" progression based on the 4pt grid (`16, 28, 44, 72...`). In V2, the *Theme Engine* began generating the scale under a proportional linear function (`key / 100 * 16`), eliminating the irregular jumps that were hard to internalize. The previous logic and descending scales (like V1's `DescendingScaleInferior`) now influence semantic tokens, not scale primitives, bringing deterministic mathematics and easy "guessing" for those writing code.
2. **Algorithmic separation of Primitive vs Logic:** By computationally generating the numbering via engine and mapping *aliases* from the Semantic Layer on top of this generated scale, the architecture allows injecting new scales (such as `dense`, `comfortable`, or Mobile vs Desktop) by only adjusting the mathematical base in the config file, without needing to rewrite token names in application CSS.
3. **Strict 4pt Multiples:** The V1 system struggled with certain sums (e.g., 28 + 16 = 44). Now, by ensuring steps aligned to the 4pt grid in the global Primitive, and by focusing aliases on perfect multiples (8, 16, 24, 32, 40, 48...), the design grid becomes predictable, enabling UI block alignment to perfectly match outputs in fluid converters (e.g., `rem` and `em`) and development grids like Tailwind CSS utilities.

---

## Quick Adoption Tips (Guidelines)

- Avoid as much as possible applying paddings in non-round numbers, or loose smaller primitives from the Semantic scale (`micro, extraSmall, small`, etc.).
- Use `pico` exclusively for borders. It is an Anti-Pattern to use `pico` (1px) as spacing between two components, as it will cause blurring in a subpixel grid in some monitor renders.
- Prefer 1-level alias jumps to differentiate spatial hierarchy: If you use `small` for spacing between buttons, use `medium` to isolate the button "row" from the rest of the page. This creates grouping through the "Law of Proximity" in visual design.

---

## References

- Scale generation script: dimension-scale.mjs
- Unit output technical spec: 05-output-units.md
- Dimension overview: 00-overview.md
- Detailed spatial system: 01-spatial-system.md
- Dimension layer (concept): [06-dimension-layer.md](../02-token-layers/06-dimension-layer.md)
- Mathematics and algorithms: [06-mathematics-and-algorithms.md](./06-mathematics-and-algorithms.md)
