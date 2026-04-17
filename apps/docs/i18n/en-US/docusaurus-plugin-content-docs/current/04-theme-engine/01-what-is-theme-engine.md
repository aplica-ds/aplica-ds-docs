---
title: "What Is the Aplica Tokens Theme Engine"
lang: en
---

# What Is the Aplica Tokens Theme Engine

## Definition

The **Aplica Tokens Theme Engine** is the design token generation system for Aplica DS. It works as a **theme factory**: given a configuration (brand colors, typography, dimensions), the engine automatically produces all semantic and foundation tokens for every combination of brand × mode × surface × dimension.

It is distributed as an **NPM package** (`@aplica/aplica-theme-engine`), built on **Style Dictionary**, and compatible with **Tokens Studio**. It acts as the single source of truth for design tokens — ensuring that Web, Mobile, and Figma interpret the same tokens in the same way.

---

## Why It Exists

The problem the engine solves is **scale with coherence**.

Without a centralized engine, every new theme — or any color change — requires manual updates across dozens of files. With 4 brands × 2 modes × 2 surfaces × 3 dimensions = **48 theme variants**, manual maintenance is unviable.

The engine inverts that responsibility:

```
WITHOUT engine:
Designer defines color → Developer copies to CSS → Repeat for each variant

WITH engine:
System Designer configures *.config.mjs → Engine generates all variants →
Consumers import from dist/
```

**Direct benefits:**
- Adding 1 brand automatically generates all 12 variants (modes × surfaces × dimensions)
- Color change in one place propagates to all outputs and all platforms
- Accessibility (WCAG) calculated automatically — not a manual checklist
- The naming contract ensures Web, Mobile, and Figma are always consistent

---

## The Package Model

The engine ships as a single NPM package that your project installs. Your project owns the configuration; the package owns the generation and build logic.

```
Your project                          @aplica/aplica-theme-engine
─────────────────────────────────     ──────────────────────────────
theme-engine/config/  ──────────→     Color decomposition engine
  my-brand.config.mjs                 OKLCh palette generation
  global/themes.config.json           Architecture sync
                                      Style Dictionary transforms
data/  ←────────────────────────      CLI commands
dist/  ←────────────────────────
```

**You own:** configuration, generated data, generated outputs.
**Package owns:** generation logic, build orchestration, schemas, CLI.

This means:
- Each project has its own independently versioned token set
- The engine updates without requiring changes to your configuration
- Multiple projects can share the same engine but produce different outputs

---

## The Generation Pipeline

The engine executes the Aplica DS 5-layer pipeline sequentially:

```
theme-engine/config/
  my-brand.config.mjs
  global/themes.config.json
          │
          ▼
[ Color decomposition ]   ← Decomposes brand colors into OKLCh palettes (19+15+6 levels)
[ Typography generation ] ← Generates type scale and line-heights
[ Dimension scale ]       ← Generates spatial scale per variant (minor/normal/major)
          │
          ▼
data/brand/<brand>/        ← Layer 1: brand tokens (colors, typography, gradients)
data/mode/<light|dark>.json ← Layer 2: luminosity modulation
data/surface/<pos|neg>.json ← Layer 3: surface context
data/dimension/<variant>.json ← Orthogonal layer: spatial and typographic scale
          │
          ▼ sync:architecture (propagates references across layers)
          │
data/semantic/default.json  ← Layer 4: purpose-driven tokens
data/foundation/<name>/     ← Layer 5: simplified aliases
          │
          ▼ Style Dictionary (build)
          │
dist/
├── json/    ← JSON with px (Figma, Tokens Studio)
├── css/     ← CSS custom properties with rem (Web)
├── esm/     ← ES Modules with px (JavaScript)
├── js/      ← CommonJS with px (Node.js)
└── dts/     ← TypeScript declarations
```

**Critical rule:** Files in `data/` are **generated** — never edit them manually. Every change starts in `theme-engine/config/`.

---

## What the Engine Delivers

### Token layers

| Layer | Namespace | Role |
|-------|-----------|------|
| Brand | `brand.*` | Primitive values — internal only |
| Mode | `mode.*` | Light/dark modulation — internal only |
| Surface | `surface.*` | Surface context — internal only |
| Semantic | `semantic.*` | Purpose-driven tokens — use in components |
| Foundation | `foundation.*` | Simplified aliases — use in product teams |

**Consumers should use `semantic.*` and `foundation.*` only.** Brand, Mode, and Surface are internal pipeline layers.

### Output formats

| Format | Directory | Units | For whom |
|--------|-----------|-------|----------|
| JSON | `dist/json/` | `px` | Figma, Tokens Studio |
| CSS | `dist/css/` | `rem` | Web (CSS custom properties) |
| ESM | `dist/esm/` | `px` | Modern JavaScript |
| CJS | `dist/js/` | `px` | Node.js / legacy bundlers |
| TypeScript | `dist/dts/` | — | Type-safe consumption |

---

## For Whom

| Profile | What they do |
|---------|-------------|
| **System Designer (N2)** | Configures brand colors, typography, and modes in `*.config.mjs`. Runs `tokens:build`. |
| **Design Engineer (N3)** | Installs the package, scaffolds the workspace, maintains the build pipeline. |
| **Front-end engineer** | Imports from `dist/` (CSS vars, ESM, JSON). Never runs the engine. |
| **Product Designer (N1)** | Works in Figma using the published token JSON. Never touches the engine. |

The engine does **not** impose a framework. React, Vue, Flutter, CSS-only — all consume the same `dist/` output.

---

## What the Engine Does NOT Do

- **Does not implement components.** Buttons, inputs, modals — those belong to the consumer's component library.
- **Does not define behavior.** Hover states, animations, UI logic — the engine only produces the tokens those behaviors use.
- **Does not replace a complete Design System.** It is the token foundation on top of which a complete DS is built.

---

## Versioning and Contract

The engine follows **Semantic Versioning**:
- **Patch:** Bug fixes that do not affect existing tokens or config contracts
- **Minor:** New tokens or new config options (backward-compatible)
- **Major:** Tokens renamed or removed, or config contract changes — documented in CHANGELOG

Renaming or removing a token is a breaking change because it breaks every consumer that references that token by name.

---

## References

- Engineering setup: [09-engineering/01-quick-start.md](../09-engineering/01-quick-start.md)
- Configuration guide: [03-configuration-guide.md](./03-configuration-guide.md)
- Token architecture (5 layers): [01-token-architecture.md](../01-design-tokens-fundamentals/01-token-architecture.md)
- Designer workflow: [02-designer-workflow.md](./02-designer-workflow.md)
