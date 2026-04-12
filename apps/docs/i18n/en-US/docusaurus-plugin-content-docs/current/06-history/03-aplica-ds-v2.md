---
title: "Aplica DS — V2"
lang: en
---

# Aplica DS — V2

## Context

V2 is the current state of Aplica DS. It represents the synthesis of everything learned in the Alpha and V1, rewritten with two objectives that change the nature of the project:

1. **Decoupling** — the token system was completely separated from any specific product, becoming independent and reusable
2. **Open source** — the architecture began to be developed as a public good, not as an internal product

The central artifact of V2 is the **Aplica Tokens Theme Engine** — a dynamic theme generator that produces tokens for any combination of brand, mode, surface, and dimension.

---

## The Great Shift: Decoupling

The most important decision of V2 was separating the token system from the product consuming it. This created two distinct entities:

**Aplica Theme Engine** (upstream):
- Generic architecture, product-agnostic
- Generates tokens for any brand
- Documented in PT-BR and EN
- Versioned with Semantic Versioning
- Distributed as a package and as a copy

**Consumers** (downstream):
- Each product has its own copy or fork of the Theme Engine
- Customizes brand, foundation, and typography
- Consumes the generated artifacts (`dist/`)
- Receives updates via migration bundles

This model allowed the same token system to power Design Systems for different companies, without any of them needing to know about the others.

---

## V2 Innovations

### 1. Dynamic Theme Generator

Instead of defining each token manually, V2 generates themes from a minimal configuration:

```json
{
  "brand": "aplica_joy",
  "colors": {
    "first": "#E91E8C",
    "second": "#1E90FF"
  }
}
```

From this, the generator:
- Decomposes each color into 19 palette levels (via OKLCh)
- Generates 15 neutral levels with the brand's color temperature
- Calculates 5 behavioral states (normal, hover, pressed, focus, disabled)
- Guarantees WCAG contrast for all `txtOn` tokens

### 2. OKLCh Color Pipeline

The Alpha and V1 used HSL for color decomposition. V2 migrated to **OKLCh** — a perceptually uniform color space where:
- Perceived lightness is linear (L=50 is visually the exact midpoint between L=0 and L=100)
- Chroma (saturation) is separated from the Hue angle
- Interpolation between colors does not pass through gray tones in the middle

This resolves a classic problem in Dark Mode: in HSL, reducing lightness to create dark tones can produce colors with inconsistent appearance. In OKLCh, the result is predictable.

### 3. Dimension Layer

The concept of Dimension — absent in the Alpha and V1 — was incorporated as an orthogonal layer in V2. Three variants (minor/normal/major) with different DefaultDesignUnit cascade through the entire spatial and typographic scale.

This solved the problem of interface densities without duplicating tokens or creating parallel systems.

### 4. Canonical Naming Contract

V2 formalized a complete contract for token names:

```
<layer>.<category>.<group>.<subgroup>.<state>.<property>
```

With explicit rules for:
- When to use each layer
- How to name groups and subgroups
- What can never be a Semantic token (raw values without purpose)
- Rename and removal policy (breaking changes = major version)

### 5. Foundation with Composite Styles

Foundation in V2 goes beyond color and spacing aliases. It includes:

**Typography Styles** — 7 composite style categories:
| Category | Use |
|----------|-----|
| `heading`   | Hierarchical titles and headings |
| `content`   | Standard body text |
| `display`   | Highlight text, hero |
| `hierarchy` | Subtitles, sections |
| `action`    | Buttons, CTAs |
| `link`      | Links and anchors |
| `code`      | Code and monospace |

**Elevation Styles** — 7 configurable elevation levels per theme:
- `level_minus_one` to `level_six`
- Each level is a complete `box-shadow`, not just a shadow value

### 6. Dynamic Gradients

Gradients are automatically generated from brand colors:
- 3 configurable compositions (first, second, third)
- Light tone → dark tone transition with preserved chroma
- Configuration of degrees, steps, and composites in the global config

### 7. Migration Bundle System

To ensure that projects consuming the Theme Engine can update safely, V2 introduced versioned **migration bundles**:

```
bundles/from-2.24.0-to-2.25.0/
├── APPLY_INSTRUCTIONS.md   ← step-by-step migration guide
└── MANIFEST.txt            ← list of changed files
```

### 8. Complete Multi-Platform Outputs

| Format | Use |
|--------|-----|
| CSS custom properties | Web — `:root`, `[data-theme]` |
| JSON | Figma, Tokens Studio |
| ESM (.mjs) | Modern JavaScript |
| CJS (.js) | Node.js, legacy bundlers |
| TypeScript (.d.ts) | Type safety |

---

## Current version: 2.25.0

Recent milestones:
- **2.25.0** — CSS output in `rem` (accessibility, WCAG 1.4.4)
- **2.24.0** — Distinct `focus` token separate from `active` (breaking change)
- **2.22.0** — Typographic scale of 13 sizes (nano → zetta)
- **2.19.0** — Elevation configurable per theme
- **2.18.0** — Config and schemas centralized at the project root

---

## What Comes Next (roadmap)

| Area | Status |
|------|--------|
| Component library (React/Vue) | Planned |
| Flutter support (Dart classes) | Planned |
| Public npm package | Planned |
| Documentation site | Planned |
| Automatic WCAG validation in build | Planned |
| Decomposition method selection (LCH/OKLCH/Linear) | Planned |

---

## Reference Files

- Implementation: `references/aplica-tokens-theme-engine/`
- Full changelog: `references/aplica-tokens-theme-engine/CHANGELOG.md`
- Technical documentation (EN): `references/aplica-tokens-theme-engine/docs/en/`
- Technical documentation (PT-BR): `references/aplica-tokens-theme-engine/docs/pt-br/`
- Confluence extraction: `node scripts/extract-confluence-xml.mjs --ds aplica-ds`
