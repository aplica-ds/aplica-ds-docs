---
title: "What Is the Aplica Tokens Theme Engine"
lang: en
---

# What Is the Aplica Tokens Theme Engine

## Definition

The **Aplica Tokens Theme Engine** is the dynamic Design Token generation system for Aplica DS. It works as a **theme factory**: given a set of configurations (brand colors, typography, dimensions), the engine automatically produces all semantic and foundation tokens for every possible combination of brand × mode × surface × dimension.

It is open-source, built on **Style Dictionary**, compatible with **Tokens Studio**, and acts as the single source of truth for design tokens — ensuring that Web, Mobile, and Figma interpret the same tokens in the same way.

---

## Why It Exists

The problem the engine solves is **scale with coherence**.

Without a centralized engine, every new theme — or any color change — requires manual updates across dozens of files. With 4 brands × 2 modes × 2 surfaces × 3 dimensions = **48 theme variants**, manual maintenance is unviable.

The engine solves this through an inversion of responsibility:

```
WITHOUT engine:
Designer defines color → Developer copies to CSS → Repeat for each variant

WITH engine:
System Designer configures color in *.config.mjs → Engine generates all variants →
Consumers use the output (dist/)
```

**Direct benefits:**
- Adding 1 brand automatically generates all 12 variants (modes × surfaces × dimensions)
- Color change in one place propagates to all outputs and platforms
- Accessibility (WCAG) calculated automatically — not a manual checklist
- The naming contract ensures Web, Mobile, and Figma are always consistent

---

## The Pipeline in Execution

The engine executes the Aplica DS 5-layer pipeline sequentially:

```
config/*.config.mjs
        │
        ▼
[ color-decomposer.mjs ]      ← Decomposes colors into OKLCh palettes (19+15+6 levels)
[ typography-generator.mjs ]  ← Generates typographic scale and line-heights
[ dimension-scale.mjs ]       ← Generates spatial scale per variant (minor/normal/major)
        │
        ▼
data/brand/<theme>/           ← Layer 1: brand tokens (colors, typography, gradients)
data/mode/<light|dark>.json  ← Layer 2: luminosity modulation
data/surface/<pos|neg>.json  ← Layer 3: surface context
data/dimension/<variant>.json ← Orthogonal layer: spatial and typographic scale
        │
        ▼ sync-architecture.mjs (propagates references across layers)
        │
data/semantic/default.json    ← Layer 4: purpose-driven tokens
data/foundation/<name>/       ← Layer 5: simplified aliases
        │
        ▼ Style Dictionary (build)
        │
dist/
├── json/                     ← JSON with px (Figma, Tokens Studio)
├── css/                      ← CSS custom properties with rem (Web)
├── esm/                      ← ES Modules with px (JavaScript)
├── cjs/                      ← CommonJS with px (Node.js)
└── dts/                      ← TypeScript declarations
```

**Critical rule:** Files in `data/` are **generated** — never edit them manually. Every change starts in `config/` or in the engine scripts.

---

## What the Engine Delivers

### Tokens

| Category | Namespace | Example |
|----------|-----------|---------|
| Colors | `semantic.color.*` | `semantic.color.interface.function.primary.normal.background` |
| Typography | `semantic.typography.*` | `semantic.typography.fontSizes.medium` |
| Spacing | `semantic.dimension.spacing.*` | `semantic.dimension.spacing.large` |
| Borders | `semantic.border.*` | `semantic.border.radius.medium` |
| Elevation | `semantic.depth.*` | `semantic.depth.level_two` |
| Opacity | `semantic.opacity.*` | `semantic.opacity.subtle` |
| Foundation | `foundation.*` | `foundation.bg.primary`, `foundation.text.body` |

### Output formats

| Format | Directory | Units | For whom |
|--------|-----------|-------|----------|
| JSON | `dist/json/` | `px` | Figma, Tokens Studio |
| CSS | `dist/css/` | `rem` | Web (CSS custom properties) |
| ESM | `dist/esm/` | `px` | Modern JavaScript |
| CJS | `dist/cjs/` | `px` | Node.js / legacy bundlers |
| TypeScript | `dist/dts/` | — | Type-safe consumption |

### Naming contract

The engine produces a **canonical naming contract** that ensures all consumers interpret tokens in the same way:

- **`semantic.*`** — Always use for styling. This is the canonical layer exposed to components.
- **`foundation.*`** — Use when a suitable alias exists. Does not replace Semantic as the source of truth.
- **`component.*`** — Tokens scoped to specific components (when present in the build).

**Never use directly:** `theme.*`, `brand.*`, `mode.*`, `surface.*` — these are internal layers.

---

## For Whom

| Profile | What they consume | Entry point |
|---------|------------------|-------------|
| **System Designer** | Configures the engine | `config/*.config.mjs` |
| **Front-end engineer** | CSS custom properties, JSON, ESM | `dist/` |
| **Product Designer (Figma)** | Tokens Studio → Figma Variables | Exported JSON |
| **Component library** | `semantic.*` and `foundation.*` | `dist/json/` or npm package |
| **Mobile platform** | JSON or ESM | `dist/json/` |

The engine **does not** impose a framework. React, Vue, Flutter, CSS-only — all are valid consumers of the same output.

---

## What the Engine Does NOT Do

- **Does not implement components.** Buttons, inputs, modals — that belongs to the consumer's component library.
- **Does not define behavior.** Hover states, animations, UI logic — the engine only produces the tokens those behaviors use.
- **Does not replace a complete Design System.** It is the **foundation** on top of which a complete DS is built.
- **Should not be run by the consumer.** Consumers use the generated `dist/`; only contributors to the engine need to run the generation scripts.

---

## Versioning and Contract

The engine follows **Semantic Versioning**:
- **Patch:** Fixes that do not affect existing tokens
- **Minor:** New tokens added (backward-compatible)
- **Major:** Tokens renamed or removed — breaking change; documented in CHANGELOG

Renaming or removing a token is treated as a breaking change because it breaks the code of every consumer that uses that token.

---

## References

- Designer workflow: [02-designer-workflow.md](./02-designer-workflow.md)
- Configuration guide: [03-configuration-guide.md](./03-configuration-guide.md)
- Token architecture (5 layers): [01-token-architecture.md](../01-design-tokens-fundamentals/01-token-architecture.md)
- Canonical naming contract: [canonical-taxonomy-and-naming-contract.md](../../references/aplica-tokens-theme-engine/docs/context/tokens/canonical-taxonomy-and-naming-contract.md)
- Surface → Mode → Theme flow: [SURFACE-MODE-THEME-FLOW.md](../../references/aplica-tokens-theme-engine/docs/context/SURFACE-MODE-THEME-FLOW.md)
- Engine vision (reference): [WHAT_IS_THEME_ENGINE.md](../../references/aplica-tokens-theme-engine/docs/context/WHAT_IS_THEME_ENGINE.md)
