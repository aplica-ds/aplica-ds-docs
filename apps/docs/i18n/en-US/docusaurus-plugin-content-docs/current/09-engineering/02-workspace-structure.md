---
title: "Consumer Workspace Structure"
lang: en
---

# Consumer Workspace Structure

The Aplica Theme Engine follows a **core + consumer** model. The package owns the generation engine; your project owns the configuration, the generated data, and the final build output.

This article explains every file and directory in the consumer workspace.

---

## Full structure

```
your-project/
  aplica-theme-engine.config.mjs     ← workspace entrypoint (required)
  package.json
  theme-engine/
    config/
      global/
        themes.config.json            ← brand list and global settings
        dimension.config.mjs          ← spacing and sizing scales
      foundations/
        engine.config.mjs             ← foundation typography and elevation
      my-brand.config.mjs             ← per-brand colors and typography
    schemas/                          ← optional: consumer schema overrides
      architecture.mjs
    transformers.config.mjs           ← build output configuration
  data/                               ← generated (do not edit manually)
  dist/                               ← generated (do not edit manually)
```

---

## `aplica-theme-engine.config.mjs`

The workspace entrypoint. Tells the engine where to find your configuration, where to write generated data, and where to write final outputs.

```js
import { defineThemeEngineConfig } from '@aplica/aplica-theme-engine/config';

export default defineThemeEngineConfig({
  transformersConfigFile: './theme-engine/transformers.config.mjs',
  paths: {
    configDir:       './theme-engine/config',
    globalConfigDir: './theme-engine/config/global',
    foundationsDir:  './theme-engine/config/foundations',
    schemasDir:      './theme-engine/schemas',  // optional
    dataDir:         './data',
    distDir:         './dist'
  }
});
```

**Rules:**
- All paths must stay inside the project root. The engine refuses to write outside the workspace.
- `schemasDir` is optional. Omitting it means the package's default schemas are used.
- A `aplica-theme-engine.config.json` file or a `package.json#aplicaThemeEngine` key also work as fallbacks, but the `.mjs` form is preferred.

---

## `theme-engine/config/global/themes.config.json`

Declares all brands and their global build settings.

```json
{
  "brands": ["my-brand"],
  "modes": ["light", "dark"],
  "generateGradients": true
}
```

- **`brands`** — list of brand names. Each name must match a `<name>.config.mjs` file in `config/`.
- **`modes`** — which luminosity modes to generate. Accepts `"light"`, `"dark"`, or both.
- **`generateGradients`** — whether the engine builds gradient tokens for this workspace.

---

## `theme-engine/config/global/dimension.config.mjs`

Controls the spatial scale (spacing, sizing, border radius). The engine generates three scale variants — `minor`, `normal`, and `major` — from this single definition.

See [03-theme-configuration.md](./03-theme-configuration.md) for the full shape of this file.

---

## `theme-engine/config/foundations/engine.config.mjs`

Defines the typography and elevation tokens that appear in the Foundation layer. These are the tokens product teams use directly (e.g., `foundation.txt.title`, `foundation.bg.primary`).

---

## `my-brand.config.mjs`

One file per brand. Defines the primitive values the engine uses to generate the full token set:

- Primary, secondary, and accent colors
- Feedback colors (info, success, warning, danger)
- Typography families and weights
- Gradient definitions (if enabled)

The filename must match the brand ID declared in `themes.config.json`.

See [03-theme-configuration.md](./03-theme-configuration.md) for an annotated example.

---

## `theme-engine/transformers.config.mjs`

Controls how the engine transforms `data/` into `dist/`. Defines which layers to build, which platforms to output, and where each output goes.

```js
import { defineTransformersConfig } from '@aplica/aplica-theme-engine/transformers/config';

export default defineTransformersConfig({
  layers: {
    semantic:    { enabled: true,  platforms: ['json', 'esm', 'js', 'css'] },
    foundation:  { enabled: true,  platforms: ['json', 'esm', 'js', 'css'] },
    components:  { enabled: false, platforms: ['json'] }
  },
  output: {
    directories: {
      json: './dist/json',
      js:   './dist/js',
      esm:  './dist/esm',
      css:  './dist/css/semantic'
    },
    namespaces: {
      foundation: {
        json: './dist/json/foundation',
        js:   './dist/js/foundation',
        esm:  './dist/esm/foundation',
        css:  './dist/css/foundation'
      }
    }
  },
  assets: {
    copyFonts:             true,
    generateFontsManifest: true
  }
});
```

See [04-transformers-configuration.md](./04-transformers-configuration.md) for the full API reference.

---

## `theme-engine/schemas/` (optional)

Consumer-owned schema overrides. Place here only the schemas you need to customize. The engine resolves consumer schemas first and falls back to package defaults for anything not overridden.

Typical overrides:

| File | What it controls |
|------|-----------------|
| `architecture.mjs` | Full token structure contract |
| `typography-styles.mjs` | Typography token shape |
| `foundation-styles.mjs` | Foundation token shape |
| `typography-scale.mjs` | Type scale algorithm |

To generate a starting scaffold interactively:

```bash
npx aplica-theme-engine schemas:helper
```

---

## `data/` — generated, do not edit

The engine writes the raw token data here after generation. Think of `data/` as an intermediate representation — it is the source for the Style Dictionary build, not for human editors.

```
data/
  brand/<brand-name>/   ← colors, typography, gradients per brand
  mode/                 ← light.json, dark.json
  surface/              ← positive.json, negative.json
  dimension/            ← minor.json, normal.json, major.json
  semantic/             ← default.json (purpose-driven token map)
  foundation/           ← <foundation-name>/ (aliased tokens)
```

**Never edit files in `data/` directly.** Edits are overwritten on the next generation run. All changes start in `theme-engine/config/`.

---

## `dist/` — generated, do not edit

The final consumable output. This is what applications, component libraries, and Figma plugins import.

```
dist/
  json/                           ← token values as JSON (px)
    foundation/<brand>/
      foundation.json
  esm/                            ← ES Module exports (px)
    foundation/<brand>/
      foundation.mjs
  js/                             ← CommonJS exports (px)
    foundation/<brand>/
      foundation.cjs
  css/                            ← CSS custom properties (rem)
    semantic/
    foundation/<brand>/
      foundation.css
      typography.css
      elevation.css
  assets/fonts/                   ← font files (if font copy is enabled)
```

Foundation outputs follow a stable naming contract so downstream consumers can rely on predictable import paths across engine versions.

---

## Ownership summary

| Directory / File | Owned by | Versioned by |
|-----------------|----------|-------------|
| `aplica-theme-engine.config.mjs` | Consumer | Consumer repo |
| `theme-engine/config/` | Consumer | Consumer repo |
| `theme-engine/schemas/` | Consumer (optional) | Consumer repo |
| `theme-engine/transformers.config.mjs` | Consumer | Consumer repo |
| `data/` | Engine (generated) | Do not commit¹ |
| `dist/` | Engine (generated) | Do not commit¹ |
| Generation & build logic | Package | `@aplica/aplica-theme-engine` |

¹ Whether to commit `data/` and `dist/` depends on your workflow. Teams that publish a token package from CI typically commit neither and let CI regenerate them. Teams that want reproducible snapshots may commit `dist/` only.
