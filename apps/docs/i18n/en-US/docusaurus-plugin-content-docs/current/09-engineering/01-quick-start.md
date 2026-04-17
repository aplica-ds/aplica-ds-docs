---
title: "Quick Start — Install, Configure, Build"
lang: en
---

# Quick Start — Install, Configure, Build

This guide takes you from zero to a working token build in under 10 minutes. You will install the Aplica Theme Engine package, scaffold a consumer workspace, and produce your first `dist/` output.

---

## Prerequisites

- **Node.js** ≥ 18.0.0
- A package manager: npm, yarn, or pnpm
- An existing project, or a new folder

---

## Step 1 — Install the package

```bash
npm install @aplica/aplica-theme-engine
```

The package installs the engine, its CLI, and all generation logic. Your project owns the configuration; the package owns the mechanics.

---

## Step 2 — Scaffold the consumer workspace

Run the init command in your project root:

```bash
npx aplica-theme-engine init
```

The CLI offers two onboarding paths:

| Option | What it does | When to use |
|--------|-------------|-------------|
| **Load starter template** | Creates a ready-to-run workspace with one starter theme and package default schemas | First project, fastest start |
| **Create using the wizard** | Same workspace base + generates a `theme-engine/schemas/architecture.mjs` from guided answers | When you need a custom token structure |

For a first project, **choose the starter template**.

> **What gets created:**
>
> ```
> your-project/
>   aplica-theme-engine.config.mjs   ← workspace entrypoint
>   theme-engine/
>     config/
>       global/
>         themes.config.json           ← brand list, mode settings
>         dimension.config.mjs         ← spacing and size scales
>       foundations/
>         engine.config.mjs            ← foundation typography and elevation
>       starter-brand.config.mjs       ← starter brand colors and typography
>     transformers.config.mjs          ← build output configuration
> ```
>
> `data/` and `dist/` are generated on first build — they are not created by `init`.

---

## Step 3 — Add scripts to `package.json`

```json
{
  "scripts": {
    "tokens:build":       "aplica-theme-engine build",
    "tokens:build:all":   "aplica-theme-engine build:all",
    "tokens:themes":      "aplica-theme-engine themes:generate",
    "tokens:dimension":   "aplica-theme-engine dimension:generate",
    "tokens:sync":        "aplica-theme-engine sync:architecture",
    "tokens:foundations": "aplica-theme-engine foundations:generate"
  }
}
```

The default command for day-to-day use is `tokens:build`. The others are for inspecting or rebuilding individual pipeline stages.

---

## Step 4 — Run your first build

```bash
npm run tokens:build
```

This runs the full generation + build pipeline in sequence:

```
ensure:data         → validates / creates data/ structure
themes:generate     → decomposes brand colors into OKLCh palettes
dimension:generate  → generates spatial scale (minor / normal / major)
sync:architecture   → propagates token references across layers
foundations:generate → generates Foundation token aliases from Semantic
build:all           → transforms data/ into dist/ via Style Dictionary
```

A successful build exits with code `0` and produces:

```
data/
  brand/<brand-name>/    ← generated brand token data
  mode/                  ← light / dark modulation
  surface/               ← positive / negative context
  dimension/             ← spacing and sizing per variant
  semantic/              ← purpose-driven tokens
  foundation/            ← simplified aliases for product teams

dist/
  json/                  ← token values as JSON (for Figma, Tokens Studio)
  css/                   ← CSS custom properties in rem (for Web)
  esm/                   ← ES Modules in px (for modern JS)
  js/                    ← CommonJS in px (for Node.js / legacy bundlers)
  assets/fonts/          ← font files (if font copy is enabled)
```

---

## Step 5 — Consume the output

The `dist/` directory is what your application, component library, or Figma plugin consumes. The engine and the configuration that drives it stay in your project — they are not what consumers import.

**Web — CSS custom properties:**

```css
/* Import in your global stylesheet */
@import '@your-scope/tokens/dist/css/foundation/engine/foundation.css';

.button-primary {
  background: var(--foundation-bg-brand-default);
  color: var(--foundation-txt-on-brand-default);
}
```

**JavaScript / TypeScript:**

```ts
import tokens from '@your-scope/tokens/dist/esm/foundation/engine/foundation.mjs';

const primaryBg = tokens.foundation.bg.brand.default;
```

**Figma / Tokens Studio:** Point Tokens Studio at `dist/json/` and sync.

---

## Normal warnings

These messages appear in every build and are not errors:

- **AAA accessibility warning** — a palette level does not reach AAA contrast. The build continues with AA fallback. Review the brand color after the build if AAA compliance is required.
- **No font assets directory found** — font copy is enabled but `assets/fonts/` does not exist. No fonts are copied; all other outputs are still generated.
- **Components build skipped** — no component data exists yet. This is expected when you only use Semantic and Foundation outputs.

---

## Next steps

| Goal | Article |
|------|---------|
| Understand the workspace file structure | [02-workspace-structure.md](./02-workspace-structure.md) |
| Customize brand colors, typography, and modes | [03-theme-configuration.md](./03-theme-configuration.md) |
| Control which platforms and formats are built | [04-transformers-configuration.md](./04-transformers-configuration.md) |
| See all CLI commands | [05-cli-reference.md](./05-cli-reference.md) |
| Integrate builds into CI/CD | [06-build-and-ci.md](./06-build-and-ci.md) |
| Troubleshoot build errors | [07-troubleshooting.md](./07-troubleshooting.md) |
