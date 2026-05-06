---
level: n2
id: N2-07
title: "Color output decision guide"
prerequisites: ["N2-04", "N2-05"]
duration: "reference"
lang: en
---

# N2-07 · Color output decision guide

## Context

The theme config exposes roughly a dozen options that change how the engine generates color tokens. Some change what tokens exist (structure). Some change what values those tokens carry (behavior). Some must match across every theme in the workspace; others are free to diverge.

This document is a reference, not a tutorial. Come here when you are deciding — not when you are learning. Each section names one decision, explains the signal that tells you which path to take, and states the rule.

> **Prerequisite mental model:** You know what a quadrant is (`light-positive`, `light-negative`, `dark-positive`, `dark-negative`) and what the five output layers are. If not, review N2-04 first.

---

## What kind of option is this?

Before the nine decisions, one classification that matters:

| Kind | What it controls | Safe to differ across themes? |
|------|-----------------|-------------------------------|
| **Structure** | Which token paths exist in the output | Usually **no** — shared layers break if themes diverge |
| **Behavior** | What values tokens carry | Usually **yes** — each theme owns its own values |
| **Engineer-only** | Integration format, output files | Not a designer decision |

Structure options require coordination across the whole workspace. Behavior options are per-theme decisions you make for each brand independently.

---

## Decision 1 — Should ghost surfaces be generated?

**What ghost is:** A ghost surface is a translucent interaction state — typically a very low-opacity tinted background used for hover/active states on transparent or icon-only buttons. Ghost is the secondary variant alongside solid.

**Signal table:**

| Signal | Decision |
|--------|----------|
| The product uses icon buttons, chip filters, or toolbar actions that hover with a tinted background | Enable ghost (`surfaces.ghost.enabled: true`) |
| All interactive elements use filled buttons only — no translucent hover states | Disable ghost |
| The component library has "ghost" or "subtle" button variants | Enable ghost |
| The design tokens will be consumed by a component library you don't control | Enable ghost — safer to have it and not use it |

**Rule:** Enable ghost by default. Disable only when the component library is fully solid-only and keeping ghost tokens would confuse consumers.

```javascript
options: {
  interaction: {
    surfaces: {
      ghost: { enabled: true }   // default; set false only for solid-only systems
    }
  }
}
```

---

## Decision 2 — System-scale or dilution?

**What it controls:** How interaction states (`action`, `active`, `focus`) are derived from the base color.

- **`system-scale`** — uses fixed palette levels. The base color sits at level 100; hover might be level 80, active level 120. Predictable, explicit, used by all pre-3.9.0 themes.
- **`dilution`** — moves the color toward a target (canvas or anchor) by a factor. The base color is the reference point; factors pull it closer or farther from the destination.

**Signal table:**

| Signal | Method |
|--------|--------|
| The theme is existing; no visual change is requested | `system-scale` — don't touch what works |
| The brand uses a very dark or very saturated base color that produces ugly steps at fixed palette levels | `dilution` — the factor-based approach adapts proportionally |
| The product needs dark-mode interaction states to feel native (darken on dark, lighten on light) without per-mode overrides | `dilution` + `target: 'canvas'` |
| The team wants the hover color to remain chromatic — no graying out in hover/active | `dilution` + `target: 'anchor'` |
| The workspace has multiple brands and uniformity across brand interactions is required | `system-scale` — palette levels are explicit and easy to audit |

> **Workspace-wide constraint:** All themes in the workspace must use the same `method`. Mixing `system-scale` and `dilution` corrupts the shared semantic layer. Coordinate this decision before any config is written.

```javascript
options: {
  interaction: {
    decomposition: {
      method: 'dilution'  // or 'system-scale' — must match all themes in workspace
    }
  }
}
```

---

## Decision 3 — Which dilution target?

_Applies only when `method: 'dilution'` is set._

**What it controls:** Where interaction states move toward as they dilute away from the base color.

- **`'canvas'`** — states move toward the resolved canvas for the active quadrant. Lightens on light backgrounds, darkens on dark backgrounds. No manual dark-mode override needed.
- **`'anchor'`** — states move toward a configurable color anchor. States stay within the same hue family instead of drifting toward gray or white.

**Signal table:**

| Signal | Target |
|--------|--------|
| Hover states look washed out or grayscale and the brand team complains | `anchor` with `source: 'palette'` — keeps the hue family |
| The product has a very neutral or gray brand color where canvas-drift is acceptable | `canvas` — simplest, no anchor configuration needed |
| The brand has a custom accent color that all interactive states should echo | `anchor` with `source: 'hex'` and the accent in `anchor.hex` |
| Interaction states should reference another token in the system (e.g., a secondary brand color) | `anchor` with `source: 'token'` |
| Dark mode should automatically feel right without manual per-mode decisions | `canvas` — states adapt to the resolved canvas for each quadrant |

**Anchor canvas-awareness:** When using `target: 'anchor'`, the anchor can still respond to light/dark context. `anchor.canvasAware: true` with a `anchor.canvasMix` value between 0 and 1 lets the anchor lighten on light canvases and darken on dark canvases while maintaining its hue.

| `canvasMix` | Effect |
|-------------|--------|
| `0.0` | Anchor color is fixed regardless of canvas |
| `0.2` | Subtle canvas response — hue stays strong, slight lightness shift |
| `0.5` | Balanced — hue visible, clear adaptation to canvas |
| `1.0` | Full canvas response — equivalent to `target: 'canvas'` |

```javascript
// Anchor: brand palette family, canvas-aware
decomposition: {
  method: 'dilution',
  target: 'anchor',
  anchor: {
    source: 'palette',
    canvasAware: true,
    canvasMix: 0.2
  }
}
```

---

## Decision 4 — Should function and feedback use different rules?

**What it controls:** Whether the `interface.function` group (primary buttons, links, interactive controls) and the `interface.feedback` group (error, warning, success, info states) share the same decomposition config or have independent rules.

**Signal table:**

| Signal | Decision |
|--------|----------|
| The product has vibrant, chromatic primary buttons but flat, desaturated error states | Different rules — configure independently via `groups` |
| All interactive colors follow the same visual language | Shared rules — keep a single theme-level decomposition config |
| Function needs anchor-aware dilution (keeps brand hue) but feedback should follow canvas (neutral states) | Different rules |
| System designer is new to this config and wants to minimize complexity | Keep shared rules for now — add per-group later if needed |

When function and feedback need different rules, declare each group independently. Each group inherits the theme-level config and overrides only what it changes:

```javascript
options: {
  interaction: {
    decomposition: { method: 'system-scale' }, // theme default (feedback inherits this)
    groups: {
      function: {
        decomposition: {
          method: 'dilution',
          target: 'anchor',
          anchor: { source: 'palette', canvasAware: true, canvasMix: 0.2 }
        },
        surfaces: {
          solid: { levels: { action: 1.2, active: 0.8, focus: 0.3 } }
        }
      }
      // feedback inherits theme-level system-scale
    }
  }
}
```

---

## Decision 5 — Should feedback invert with surface polarity?

**What it controls:** Whether error, warning, success, and info colors are mirrored across quadrant polarity (`modeResolution`).

- **`'quadrant'` (default):** The `dark-positive` surface is the inverse of `light-positive`. The negative surface always shows the contrast-inverted version of the positive surface in the same mode. This is the standard quadrant-aware behavior.
- **`'mode'`:** Positive and negative surfaces are identical within the same mode. An error badge looks the same whether it is placed on a positive or negative surface — no polarity inversion.

**Signal table:**

| Signal | `modeResolution` |
|--------|-----------------|
| Error states must look identical everywhere — the red must not shift between card backgrounds | `'mode'` |
| The design system uses negative surfaces as contextual backgrounds (e.g., sidebars, drawers) and feedback must adapt to each | `'quadrant'` |
| The product has anchor-aware dilution configured — hue shifts matter across quadrants | `'quadrant'` — keep quadrant-aware behavior |
| Feedback is purely informational (status chips, form validation) and must be perceptually stable | `'mode'` |
| The design system has rich dark-mode support with distinct positive/negative surface treatments | `'quadrant'` |

> `modeResolution` can also be set per group. If only feedback needs mode-aware behavior while function stays quadrant-aware: `options.interaction.groups.feedback.decomposition.modeResolution: 'mode'`.

```javascript
options: {
  interaction: {
    decomposition: {
      method: 'dilution',
      modeResolution: 'mode'  // 'quadrant' is the default
    }
  }
}
```

---

## Decision 6 — Should the primary button adapt to the active quadrant?

**What it controls:** Whether the `normal` state of interaction surfaces and the `default` state of product surfaces are fixed at the authored base color or shift based on the active quadrant (`baseAdaptation`).

By default, `normal` and `default` are always the hex you authored — `#C40145` in `light-positive`, `dark-positive`, `light-negative`, and `dark-negative`. With `baseAdaptation: true`, the engine adjusts lightness within OKLCh for each quadrant while preserving hue and chroma.

**Only two token families are affected:** `interface.function.*.normal.background` and `product.*.default.background`. All other states and all text/border values are unchanged.

**Signal table:**

| Signal | `baseAdaptation` |
|--------|-----------------|
| The primary button is nearly invisible in `dark-negative` because the brand color is too close to the dark canvas | `true` |
| The brand explicitly wants expressive, contextual base surfaces that shift with the environment | `true` |
| The brand logo color and the primary button must always match exactly | `false` |
| The product is financial, institutional, or regulatory — brand color is a fixed reference | `false` |
| The team uses the `normal.background` value as a color anchor in other components | `false` |
| No legibility problems are observed in any quadrant | `false` — don't adapt what works |

```javascript
options: {
  baseAdaptation: true  // per-theme — other themes in the workspace are unaffected
}
```

---

## Decision 7 — How should text appear over brand-colored surfaces?

**What it controls:** The strategy used to pick a `txtOn` color (readable text) when placed on a colored background.

| Strategy | Behavior |
|----------|----------|
| `'high-contrast'` (default) | Always pure white or black — highest contrast, WCAG AA guaranteed |
| `'brand-tint'` | Uses the palette tone that passes WCAG — keeps brand color in the text |
| `'custom-tint'` | A fixed authored color with a WCAG fallback |

**Signal table:**

| Signal | Strategy |
|--------|----------|
| The product is a dense information interface (data tables, dashboards, financial UI) | `'high-contrast'` |
| The brand has strong personality and wants text on buttons to feel "in the palette" rather than black/white | `'brand-tint'` |
| The design system has a specific neutral color for text on brand surfaces — it's not black or white | `'custom-tint'` |
| Accessibility is the primary constraint — no compromise on contrast | `'high-contrast'` |
| A light brand color (yellow, lime) produces near-invisible white text by default | `'high-contrast'` resolves this automatically; `'brand-tint'` may select dark palette text |

```javascript
options: {
  txtOnStrategy: 'brand-tint'  // per-theme
}
```

---

## Decision 8 — What is the accessibility floor?

**What it controls:** The minimum WCAG contrast ratio the engine enforces when selecting text colors.

| Level | Ratio | Use case |
|-------|-------|----------|
| `'AA'` (default) | 4.5:1 | Standard for almost all products |
| `'AAA'` | 7:1 | Government, healthcare, and accessibility-first products |

**Signal table:**

| Signal | Level |
|--------|-------|
| The product has no explicit accessibility mandate beyond standard compliance | `'AA'` |
| The product is a public service, healthcare application, or has users with visual impairment as primary audience | `'AAA'` |
| The brand palette has very saturated mid-range hues that fail AAA frequently | `'AA'` — AAA will over-constrain color selection |
| Legal or compliance requirements specify WCAG AAA | `'AAA'` with `acceptAALevelFallback: true` to allow graceful degradation |

```javascript
options: {
  accessibilityLevel: 'AA',       // default
  acceptAALevelFallback: true     // relevant only when 'AAA': accepts AA if AAA is impossible
}
```

---

## Decision 9 — How saturated should dark mode be?

**What it controls:** A chroma multiplier applied during the OKLCh pipeline for dark-mode surfaces. Lower values produce softer, less saturated colors in dark mode.

| `darkModeChroma` | Effect |
|-----------------|--------|
| `1.0` | Full saturation — same chroma as light mode |
| `0.85` (default) | 15% less saturated — comfortable for most products |
| `0.7` | Noticeably softer — better for long screen time, editorial, reading-focused UIs |
| `0.5` | Significantly muted — high-end, editorial, or minimalist dark themes |

**Signal table:**

| Signal | Value |
|--------|-------|
| The dark mode feels neon or aggressive — users or the brand team report it | Reduce toward `0.7` |
| The product is used for long sessions (coding tools, editorial, communication apps) | Reduce toward `0.7–0.8` |
| The dark mode needs to feel as vibrant as light mode (gaming, entertainment, expressive brand) | Keep at `1.0` or close |
| No specific feedback — default behavior looks correct | Keep at `0.85` |

```javascript
options: {
  darkModeChroma: 0.75  // per-theme
}
```

---

## Options that are engineer-only

Do not configure these without an engineer on the decision. They affect file output format and integration contracts, not visual behavior.

| Option | What it does | Who decides |
|--------|-------------|-------------|
| `options.includePrimitives` | Generates raw palette JSON (`_primitive_theme.json`) for direct Figma Variables use | Engineer — depends on whether Figma uses Variables directly or Tokens Studio |
| `generation.colorText.generateTxt` | Master toggle for `txt` (readable text) token generation | Engineer — workspace-wide, affects all consumers |
| `generation.colorText.textExposure` | Which color families get foundation-level `txt.*` flat aliases | Engineer + designer together — affects what text tokens component authors use |
| `options.uiTokens` | Generates component-scoped UI token output | Engineer — integration format |
| `generation.colorText.txtBaseColorLevel` | Starting palette level for readable text lookup | Engineer — affects algorithm, not visual outcome directly |

---

## Quick reference

| Decision | Option | Default | Per-theme? |
|----------|--------|---------|-----------|
| Ghost surfaces | `surfaces.ghost.enabled` | `true` | Yes |
| Decomposition method | `decomposition.method` | `system-scale` | **No — workspace** |
| Dilution target | `decomposition.target` | `canvas` | Yes |
| Anchor source | `decomposition.anchor.source` | — | Yes |
| Per-group rules | `groups.{function\|feedback}.*` | inherited | Yes |
| Feedback polarity | `decomposition.modeResolution` | `quadrant` | Yes |
| Base surface adaptation | `baseAdaptation` | `false` | Yes |
| Text on brand color | `txtOnStrategy` | `high-contrast` | Yes |
| Accessibility floor | `accessibilityLevel` | `AA` | Yes |
| Dark mode saturation | `darkModeChroma` | `0.85` | Yes |

---

## Checkpoint

After working through this guide for a new theme, you should be able to answer:

- [ ] Ghost enabled or disabled — and why?
- [ ] Which decomposition method — and is the whole workspace aligned?
- [ ] If dilution: canvas or anchor — and which anchor source?
- [ ] Function and feedback share rules or diverge — and why?
- [ ] Feedback polarity behavior — quadrant or mode?
- [ ] Base surfaces adapt to quadrant or stay fixed?
- [ ] Text on brand surfaces — high-contrast, brand-tint, or custom?
- [ ] Accessibility floor — AA or AAA?
- [ ] Dark mode saturation — default or adjusted?

If you can answer all nine, the config captures the visual intentions of the theme completely.
