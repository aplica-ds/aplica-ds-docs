---
title: "Output Formats"
lang: en
---

# Output Formats

## Premise

The Aplica Tokens Theme Engine generates the same tokens in multiple formats to serve consumers with different needs. Each format has its own units, naming conventions, and specific use cases. Choosing the right format saves integration work.

---

## Where the files are generated

```
dist/
├── json/                          ← Structured JSON (Figma, Tokens Studio)
│   ├── aplica_joy-light-positive-semantic.json
│   ├── aplica_joy-light-positive-foundation.json
│   ├── aplica_joy-dark-positive-semantic.json
│   └── ...  (1 file per brand × mode × surface × type combination)
├── css/                           ← CSS custom properties (Web)
│   ├── aplica_joy-light-positive.css
│   └── ...
├── esm/                           ← ES Modules (modern JavaScript)
│   ├── aplica_joy-light-positive-semantic.mjs
│   └── ...
├── cjs/                           ← CommonJS (Node.js, legacy bundlers)
│   ├── aplica_joy-light-positive-semantic.js
│   └── ...
└── dts/                           ← TypeScript declarations
    ├── aplica_joy-light-positive-semantic.d.ts
    └── ...
```

Each file name follows the pattern: `{brand}-{mode}-{surface}-{type}.{ext}`

---

## JSON Format — for Figma and Tokens Studio

**Unit:** `px` for all dimensional values  
**Use:** Direct consumption by Figma via Tokens Studio, systems that need numeric values

```json
{
  "semantic": {
    "color": {
      "interface": {
        "function": {
          "primary": {
            "normal": {
              "background": { "$value": "#C40145", "$type": "color" },
              "txtOn":       { "$value": "#ffffff", "$type": "color" },
              "border":      { "$value": "#9c0136", "$type": "color" }
            }
          }
        }
      }
    },
    "dimension": {
      "spacing": {
        "medium": { "$value": "32px", "$type": "spacing" }
      }
    }
  }
}
```

The JSON maintains the full hierarchical structure (`semantic.color.interface...`). Foundation is a separate file with aliases pointing to Semantic:

```json
{
  "foundation": {
    "bg": {
      "primary": { "$value": "{semantic.color.interface.function.primary.normal.background}", "$type": "color" }
    }
  }
}
```

---

## CSS Format — for Web

**Unit:** `rem` for dimensional tokens (sizes, spacings, radii, typography)  
**Exceptions in `px`:** tokens with `$type: "number"` (e.g., `semantic.depth.spread`)  
**Use:** Web application via CSS custom properties

### px → rem conversion

```
rem = px / baseFontSize (default: 16)
```

| Semantic token | Source value (px) | CSS output (rem) |
|----------------|-------------------|-----------------|
| `dimension.spacing.medium` | `32px` | `2rem` |
| `dimension.spacing.nano` | `4px` | `0.25rem` |
| `typography.fontSizes.medium` | `16px` | `1rem` |
| `border.radius.medium` | `8px` | `0.5rem` |
| `depth.spread.level_two` | `-2` | `-2` (remains a number) |

**Why rem?** Dimensions in `rem` respect the user's font size preference in the browser. If the user sets the root to 20px, all spacings and sizes scale proportionally — accessibility by design.

### CSS variable structure

```css
/* aplica_joy-light-positive.css */
:root,
[data-theme="aplica_joy-light-positive"] {

  /* Semantic — colors */
  --semantic-color-interface-function-primary-normal-background: #C40145;
  --semantic-color-interface-function-primary-normal-txt-on:     #ffffff;
  --semantic-color-interface-feedback-success-default-background: #D7F6CB;

  /* Semantic — dimensions (rem) */
  --semantic-dimension-spacing-medium:     2rem;
  --semantic-dimension-spacing-small:      1.5rem;
  --semantic-typography-font-sizes-medium: 1rem;
  --semantic-border-radius-medium:         0.5rem;

  /* Semantic — elevation (px, not converted) */
  --semantic-depth-spread-level-two: -2;

  /* Foundation — aliases */
  --foundation-bg-primary:     var(--semantic-color-interface-function-primary-normal-background);
  --foundation-text-body:      var(--semantic-color-text-body-default);
  --foundation-spacing-medium: var(--semantic-dimension-spacing-medium);
}
```

### Runtime theme switching

Theme switching via CSS is done by attribute selector:

```html
<!-- Default theme: aplica_joy light positive -->
<html data-theme="aplica_joy-light-positive">

<!-- Switch to dark -->
<html data-theme="aplica_joy-dark-positive">
```

```javascript
document.documentElement.setAttribute('data-theme', 'aplica_joy-dark-positive');
```

No additional JavaScript is needed — the attribute change activates the corresponding CSS.

---

## ESM Format — for modern JavaScript

**Unit:** `px` (numeric values, no conversion)  
**Use:** React, Vue applications, modern bundlers (Vite, esbuild, Rollup)

```javascript
// aplica_joy-light-positive-semantic.mjs
export const semantic = {
  color: {
    interface: {
      function: {
        primary: {
          normal: {
            background: '#C40145',
            txtOn:      '#ffffff',
            border:     '#9c0136'
          }
        }
      }
    }
  },
  dimension: {
    spacing: {
      medium: '32px',
      small:  '24px'
    }
  }
};
```

**Aliases mode vs raw mode:**

- **Aliases (default):** Foundation exposes references to Semantic (`foundation.bg.primary` → `{semantic.color.*}`)
- **Raw:** All tokens resolved to final values — useful for consumers that do not support W3C references

```bash
# Build in raw mode (all final values, no references)
node dynamic-themes/scripts/generate-all-themes.mjs --mode=raw
```

---

## CJS Format — for Node.js and legacy bundlers

**Unit:** `px`  
**Use:** Node.js, Webpack, projects that do not support native ESM

```javascript
// aplica_joy-light-positive-semantic.js
const semantic = {
  color: { /* ... same structure as ESM */ }
};

module.exports = { semantic };
```

---

## TypeScript Format — for type safety

**Use:** TypeScript projects that want autocomplete and type checking when accessing tokens

```typescript
// aplica_joy-light-positive-semantic.d.ts
export declare const semantic: {
  color: {
    interface: {
      function: {
        primary: {
          normal: {
            background: string;
            txtOn:      string;
            border:     string;
          };
        };
      };
    };
  };
  dimension: {
    spacing: {
      medium: string;
      small:  string;
      // ...
    };
  };
};
```

Usage with autocomplete:

```typescript
import { semantic } from '@aplica/tokens/semantic/aplica_joy-light-positive-semantic';

const color = semantic.color.interface.function.primary.normal.background; // #C40145
```

---

## Consumption rule: which layer to use

| Scenario | Recommended layer | Example |
|----------|------------------|---------|
| Style any component | **Semantic** | `var(--semantic-color-interface-function-primary-normal-background)` |
| Simple alias already exists | **Foundation** (when available) | `var(--foundation-bg-primary)` |
| Calculation in JavaScript | **ESM/CJS** with Semantic | `tokens.semantic.dimension.spacing.medium` |
| Configure tokens in Figma | **JSON** via Tokens Studio | `*-semantic.json` file |
| Never use directly | `brand.*`, `mode.*`, `surface.*` | Internal layers — not part of the contract |

Foundation is a shortcut to Semantic — it does not replace it as the source of truth. If a Foundation alias does not exist for the use case, use Semantic directly.

---

## CSS variable naming

The dot (`.`) in token paths is converted to a hyphen (`-`) in CSS:

```
semantic.color.interface.function.primary.normal.background
↓
--semantic-color-interface-function-primary-normal-background
```

```
foundation.bg.primary
↓
--foundation-bg-primary
```

---

## Format comparison table

| Format | Unit | Structure | References | Main use |
|--------|------|-----------|------------|----------|
| **JSON** | `px` | Nested with `$value`/`$type` | Maintained (`{semantic.*}`) | Figma, Tokens Studio |
| **CSS** | `rem` (dimensions) | Flat `--var-name: value` | Resolved | Web — `:root` or `[data-theme]` |
| **ESM** | `px` | Nested JS object | Aliases (default) or raw | React, Vue, Vite |
| **CJS** | `px` | Nested JS object | Aliases (default) or raw | Node.js, Webpack |
| **TypeScript** | — | Type declarations | — | Autocomplete, type checking |

---

## Unit configuration

To revert CSS to `px` (e.g., environments without rem support):

```json
// config/global/themes.config.json
{
  "global": {
    "dimension": {
      "outputUnit": {
        "css":     "px",
        "default": "px"
      }
    }
  }
}
```

To use a different base than `16px` (e.g., 62.5% strategy with `10px` root):

```json
{
  "global": {
    "dimension": {
      "baseFontSize": 10
    }
  }
}
```

---

## References

- Build pipeline: [04-build-pipeline.md](./04-build-pipeline.md)
- Output units in detail: [05-output-units.md](../../references/aplica-tokens-theme-engine/docs/context/dimension/05-output-units.md)
- Token usage in components: [token-usage-for-components-and-figma.md](../../references/aplica-tokens-theme-engine/docs/context/tokens/token-usage-for-components-and-figma.md)
- Naming contract: [canonical-taxonomy-and-naming-contract.md](../../references/aplica-tokens-theme-engine/docs/context/tokens/canonical-taxonomy-and-naming-contract.md)
- Designer workflow (Figma): [02-designer-workflow.md](./02-designer-workflow.md)
