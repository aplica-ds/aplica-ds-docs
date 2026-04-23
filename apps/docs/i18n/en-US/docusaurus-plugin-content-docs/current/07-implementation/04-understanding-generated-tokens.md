---
title: "Understanding Generated Tokens"
lang: en
---

# Understanding Generated Tokens

## Audience

This article is for developers who **ran the engine** — either `npm run tokens:build` completed successfully, or they have a fresh `dist/` folder — and want to understand what was generated, how to navigate it, and which tokens to use where.

---

## What the Engine Generated

After a successful `tokens:build`, two directories exist in your project:

### `data/` — intermediate pipeline data

Never use this directly. It is the engine's working state between pipeline stages:

```
data/
├── brand/<brand>/        ← Decomposed color palettes per brand
├── mode/                 ← Light/dark luminosity modulation
├── surface/              ← Positive/negative surface context
├── dimension/            ← Spatial and typographic scale
├── semantic/             ← Purpose-driven token definitions
└── foundation/<name>/    ← Foundation alias definitions
```

`data/` files are **generated**. Any manual edit is overwritten on the next build.

### `dist/` — output for consumers

This is what you import in your applications:

```
dist/
├── json/
│   ├── <brand>-light-positive-semantic.json
│   ├── <brand>-light-positive-foundation.json
│   ├── <brand>-dark-positive-semantic.json
│   └── ...
├── css/
│   ├── semantic/<brand>-light-positive.css
│   └── foundation/<brand>/foundation.css
├── esm/
│   ├── <brand>-light-positive-semantic.mjs
│   └── foundation/<brand>/foundation.mjs
├── js/
│   ├── <brand>-light-positive-semantic.js
│   └── foundation/<brand>/foundation.cjs
└── dts/
    └── ...
```

---

## File Naming Convention

Output files follow the pattern: `{brand}-{mode}-{surface}-{layer}.{ext}`

| Segment | Values | Meaning |
|---------|--------|---------|
| `brand` | your brand name | The configured brand (e.g., `aplica_joy`) |
| `mode` | `light`, `dark` | Luminosity context |
| `surface` | `positive`, `negative` | Surface polarity (positive = standard, negative = inverted) |
| `layer` | `semantic`, `foundation` | Which token layer (omitted in CSS, both layers in one file) |

Example: `aplica_joy-dark-positive-semantic.mjs` — Aplica Joy brand, dark mode, positive surface, semantic layer, ESM format.

---

## Two Token Layers: When to Use Each

### Semantic (`semantic.*`)

Purpose-driven tokens that encode **what a token is for**. Every token name describes its role in the UI — not its visual value.

```
semantic.color.interface.function.primary.normal.background
         │      │         │        │       │      └─ property
         │      │         │        │       └─ intensity (lowest/normal/highest)
         │      │         │        └─ color category (function, feedback, brand, text...)
         │      │         └─ semantic group (interface, ambient, gradient...)
         │      └─ type (color, dimension, typography, border, depth...)
         └─ namespace
```

**Use Semantic when:**
- Building design system components (buttons, inputs, cards)
- You need a specific token that Foundation doesn't expose
- You need the full set of variants (lowest/normal/highest intensities)

### Foundation (`foundation.*`)

Simplified aliases that point to Semantic tokens. Foundation names are intentionally short and descriptive for product teams.

```
foundation.bg.primary          → semantic.color.interface.function.primary.normal.background
foundation.txt.body            → semantic.color.text.body.default
foundation.spacing.medium      → semantic.dimension.spacing.medium
```

**Use Foundation when:**
- Building product features (screens, flows, content)
- You want shorter names with less cognitive overhead
- The token you need has a Foundation alias

**Rule:** Foundation is a shortcut to Semantic, not a replacement. If a Foundation alias doesn't exist for your use case, use Semantic directly.

---

## Token Naming Conventions

### CSS custom property naming

The dot separator in token paths becomes a hyphen in CSS:

```
semantic.color.interface.function.primary.normal.background
→ --semantic-color-interface-function-primary-normal-background

foundation.bg.primary
→ --foundation-bg-primary
```

### camelCase in JavaScript

ESM/CJS objects use camelCase for multi-word segments:

```javascript
// Token path: semantic.color.interface.function.primary.normal.background
semantic.color.interface.function.primary.normal.background

// Token path: foundation.bg.primary
foundation.bg.primary
```

---

## Navigating the Semantic Layer

### Color categories

| Category | Path | Contains |
|----------|------|----------|
| Interface function | `semantic.color.interface.function.*` | Primary, secondary, link actions |
| Interface feedback | `semantic.color.interface.feedback.*` | Info, success, warning, danger |
| Branding | `semantic.color.brand.*` | Brand first, second, third |
| Text | `semantic.color.text.*` | Body, heading, muted, disabled |
| Ambient | `semantic.color.ambient.*` | Background, overlay colors |
| Product | `semantic.color.product.*` | Promo, cashback, premium |

### Color properties per token

Each color token exposes four properties (since 3.6.0 — was three before):

| Property | Description |
|----------|-------------|
| `background` | Fill color (surfaces, badges, buttons) |
| `txtOn` | Text/icon color that passes WCAG on `background` |
| `border` | Border color at adequate contrast from the surface |
| `txt` | Readable text color on canvas — for content flow, not on colored backgrounds. See [07-txt-token](../02-token-layers/07-txt-token.md). |

Example: `semantic.color.interface.function.primary.normal.background` → `#C40145`

### Intensity levels

Most color groups expose three intensity levels:

| Level | Description |
|-------|-------------|
| `lowest` | Subtle — tinted backgrounds, badges |
| `normal` | Standard — primary button, main action |
| `highest` | Emphasis — hover states, prominent borders |

### Dimension tokens

```
semantic.dimension.spacing.nano    → 4px
semantic.dimension.spacing.micro   → 8px
semantic.dimension.spacing.small   → 12px
semantic.dimension.spacing.medium  → 32px
semantic.dimension.spacing.large   → 48px
```

---

## How Many Files Were Generated

With the default configuration (1 brand × 2 modes × 2 surfaces × 2 layers):

| Format | Files per build |
|--------|----------------|
| JSON | 1 brand × 2 modes × 2 surfaces × 2 layers = 4 files |
| CSS | 1 combined file per variant = 4 files |
| ESM | Same as JSON = 4 files |
| CJS | Same as JSON = 4 files |
| TypeScript | Same as JSON = 4 files |

Add more brands to the config and the count scales automatically: 3 brands × 2 × 2 × 2 = 24 JSON files.

---

## Which File to Import

| Use case | Import |
|----------|--------|
| Style a web app (vanilla CSS or any framework) | `dist/css/semantic/<brand>-light-positive.css` |
| Read colors/dimensions in JavaScript | `dist/esm/<brand>-light-positive-semantic.mjs` |
| Load Foundation aliases (simplified) | `dist/esm/foundation/<brand>/foundation.mjs` |
| Pass tokens to Figma / Tokens Studio | `dist/json/<brand>-light-positive-semantic.json` |
| Node.js script (CommonJS) | `dist/js/<brand>-light-positive-semantic.js` |

Import only the variant you need — you do not need to load all files.

---

## Verifying the Output

After `tokens:build`, verify your `dist/` is complete:

```bash
# List generated CSS files
ls dist/css/semantic/

# Spot-check a token value
grep 'foundation-bg-primary' dist/css/semantic/aplica_joy-light-positive.css

# Validate data/ before building (catches schema mismatches early)
aplica-theme-engine validate:data
```

---

## References

- Consuming tokens: [03-consuming-dist-tokens.md](./03-consuming-dist-tokens.md)
- Output formats: [04-theme-engine/05-output-formats.md](../04-theme-engine/05-output-formats.md)
- Semantic layer concept: [02-token-layers/04-semantic-layer.md](../02-token-layers/04-semantic-layer.md)
- Foundation layer concept: [02-token-layers/05-foundation-layer.md](../02-token-layers/05-foundation-layer.md)
- Token architecture (5 layers): [01-design-tokens-fundamentals/01-token-architecture.md](../01-design-tokens-fundamentals/01-token-architecture.md)
