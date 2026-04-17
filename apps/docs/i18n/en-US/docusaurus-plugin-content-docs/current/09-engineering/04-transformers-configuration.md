---
title: "Transformers Configuration"
lang: en
---

# Transformers Configuration

The transformers configuration controls how the engine converts `data/` into `dist/`. It defines which token layers to build, which output platforms to generate, and where each output file goes.

This configuration lives in `theme-engine/transformers.config.mjs`.

---

## Full reference

```js
import { defineTransformersConfig } from '@aplica/aplica-theme-engine/transformers/config';

export default defineTransformersConfig({

  // ── Layers ─────────────────────────────────────────────────────────────
  layers: {
    semantic: {
      enabled:   true,
      platforms: ['json', 'esm', 'js', 'css']
    },
    foundation: {
      enabled:   true,
      platforms: ['json', 'esm', 'js', 'css']
    },
    components: {
      enabled:   false,
      platforms: ['json']
    }
  },

  // ── Output directories ────────────────────────────────────────────────
  output: {
    directories: {
      json:    './dist/json',
      js:      './dist/js',
      esm:     './dist/esm',
      dts:     './dist/js',      // TypeScript declarations alongside CJS
      dtsESM:  './dist/esm',     // TypeScript declarations alongside ESM
      css:     './dist/css/semantic',
      scss:    './dist/scss'     // optional
    },
    namespaces: {
      semantic: {
        css: './dist/css/semantic'
      },
      foundation: {
        json: './dist/json/foundation',
        js:   './dist/js/foundation',
        esm:  './dist/esm/foundation',
        css:  './dist/css/foundation'
      },
      components: {
        json:    './dist/json/components',
        js:      './dist/js/components',
        esm:     './dist/esm/components',
        css:     './dist/css/components',
        dts:     './dist/json/components',
        dtsESM:  './dist/json/components'
      }
    }
  },

  // ── Asset handling ────────────────────────────────────────────────────
  assets: {
    copyFonts:             true,
    generateFontsManifest: true
  }

});
```

---

## `layers`

Controls which token layers are built and in which formats.

### `layers.semantic`

The Semantic layer contains all purpose-driven tokens (`semantic.color.*`, `semantic.typography.*`, `semantic.dimension.*`, etc.). This is the canonical layer for component styling.

| Field | Type | Description |
|-------|------|-------------|
| `enabled` | boolean | Whether to build this layer |
| `platforms` | string[] | Which output formats to generate |

### `layers.foundation`

The Foundation layer contains simplified aliases for product teams (`foundation.bg.*`, `foundation.txt.*`, `foundation.spacing.*`). Always built alongside Semantic.

### `layers.components`

An optional layer for component-scoped tokens. Skip if your project only uses Semantic and Foundation.

**Note:** `build:components` exits cleanly with an informational message when no component data exists.

---

## `output.directories`

Sets the root output path for each platform. All paths must stay inside the project root.

| Key | Default | Description |
|-----|---------|-------------|
| `json` | `./dist/json` | JSON token files (px values, for Figma and Tokens Studio) |
| `js` | `./dist/js` | CommonJS modules (px values, for Node.js and legacy bundlers) |
| `esm` | `./dist/esm` | ES Modules (px values, for modern JavaScript) |
| `dts` | `./dist/js` | TypeScript type declarations co-located with CJS |
| `dtsESM` | `./dist/esm` | TypeScript type declarations co-located with ESM |
| `css` | `./dist/css/semantic` | CSS custom properties (rem values, for Web) |
| `scss` | `./dist/scss` | SCSS variables (optional) |

---

## `output.namespaces`

Overrides the output path for specific layers. The Foundation layer always uses a stable sub-path to guarantee predictable import contracts.

**Foundation output contract (stable across engine versions):**

```
dist/json/foundation/<brand>/foundation.json
dist/js/foundation/<brand>/foundation.cjs
dist/esm/foundation/<brand>/foundation.mjs
dist/css/foundation/<brand>/foundation.css
dist/css/foundation/<brand>/typography.css
dist/css/foundation/<brand>/elevation.css
```

These paths are intentionally stable — downstream consumers can rely on them not changing between minor engine versions.

---

## `assets`

| Field | Default | Description |
|-------|---------|-------------|
| `copyFonts` | `true` | Copy font files from `assets/fonts/` to `dist/assets/fonts/` |
| `generateFontsManifest` | `true` | Generate a `fonts-manifest.json` listing all font files |

If `copyFonts` is `true` but `assets/fonts/` does not exist, the build warns and continues. No fonts are copied; all other outputs are generated normally.

---

## Common configurations

### Web-only project (CSS + JSON)

```js
layers: {
  semantic:   { enabled: true, platforms: ['css', 'json'] },
  foundation: { enabled: true, platforms: ['css', 'json'] },
  components: { enabled: false, platforms: [] }
},
assets: { copyFonts: false, generateFontsManifest: false }
```

### Multi-platform project (Web + Mobile + Figma)

```js
layers: {
  semantic:   { enabled: true, platforms: ['json', 'esm', 'js', 'css'] },
  foundation: { enabled: true, platforms: ['json', 'esm', 'js', 'css'] },
  components: { enabled: false, platforms: ['json'] }
}
```

### Publishing a token package to npm

```js
layers: {
  semantic:   { enabled: true,  platforms: ['json', 'esm', 'js', 'css'] },
  foundation: { enabled: true,  platforms: ['json', 'esm', 'js', 'css'] },
  components: { enabled: false, platforms: ['json'] }
},
output: {
  directories: {
    json: './dist/json',
    js:   './dist/js',
    esm:  './dist/esm',
    dts:  './dist/js',
    css:  './dist/css/semantic'
  }
},
assets: { copyFonts: true, generateFontsManifest: true }
```

Add a `"files"` array to your `package.json` to control what gets published:

```json
{
  "files": ["dist/", "package.json", "README.md"],
  "exports": {
    "./foundation/css": "./dist/css/foundation/engine/foundation.css",
    "./foundation/json": "./dist/json/foundation/engine/foundation.json",
    "./foundation/esm": "./dist/esm/foundation/engine/foundation.mjs"
  }
}
```

---

## Validation

If the transformers config is missing or malformed, `build:all` fails fast with a descriptive error. The engine does not fall back silently to defaults when an explicit config file is present but invalid.

When no config file exists at all, the engine falls back to its internal defaults — useful for quick testing but not recommended for production.
