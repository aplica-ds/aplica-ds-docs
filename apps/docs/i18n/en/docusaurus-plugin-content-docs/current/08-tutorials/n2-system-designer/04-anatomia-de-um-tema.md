---
level: n2
id: N2-04
title: "Anatomy of a theme — reading and writing a config"
prerequisites: ["N2-03"]
duration: "15 min"
lang: en
---

# N2-04 · Anatomy of a Theme

## Context

You understand the Config-First paradigm — the design decision starts in the config, not in Figma. Now it is time to open the actual file and understand each section.

This tutorial is an annotated reading of a `*.config.mjs`. By the end, you will know how to create the basic structure of a new theme from scratch, without consulting documentation for every field.

---

## Concept

### The config file is where everything begins

Each theme exists as a single JavaScript file at:

```
dynamic-themes/themes/config/{theme-name}.config.mjs
```

The engine reads this file and automatically generates the five layers (Brand, Mode, Surface, Semantic, Foundation) for all combinations of mode (light/dark) and surface (positive/negative).

The config has five main sections — three required, two optional:

| Section | Required | What it defines |
|---------|----------|----------------|
| `name` | Required | The theme's unique identifier |
| `colors` | Required | The color dictionary (free names → hex) |
| `mapping` | Required | The connection between free names and semantic roles |
| `typography` | Required | Font families and available weights |
| `options` | Optional | Engine behavior for this theme |
| `overrides` | Optional | Targeted replacements for generated values |
| `gradients` | Optional | Brand gradient definitions |

---

## Annotated reading

### Section 1 — `name`

```javascript
export default {
  name: 'aplica_joy',
```

`name` is the theme's unique identifier in the system. It defines:
- The folder name generated in `data/brand/{name}/`
- The key used in `themes.config.json`
- The CSS selector: `[data-theme="aplica_joy-light-positive"]`

**Rule:** Use underscores, not hyphens. Lowercase letters. No spaces. The name must be stable — changing it later is equivalent to creating a new theme.

---

### Section 2 — `colors`

```javascript
  colors: {
    brand_primary:   '#E7398A',
    brand_secondary: '#38C2D0',
    brand_tertiary:  '#8F58BD',

    action_primary:   '#C40145',
    action_secondary: '#1872A6',
    action_link:      '#FF0F80',

    feedback_info:         '#CBF6ED',
    feedback_info_sat:     '#1872A6',
    feedback_success:      '#D7F6CB',
    feedback_success_sat:  '#86C46D',
    feedback_warning:      '#FEE6C2',
    feedback_warning_sat:  '#FDB750',
    feedback_danger:       '#F9C8C8',
    feedback_danger_sat:   '#EE5A5A',

    product_promo:     '#6BC200',
    product_promo_alt: '#D2FD9D',
    product_cashback:  '#FFBB00',
  },
```

`colors` is a **free dictionary**. The names are yours — they follow no engine convention. `action_primary`, `primary_action`, `btnPrimary` would be equivalent.

What matters here is the **quality of the declared colors**, not the names. Each hex will be decomposed by the OKLCh pipeline into 19 palette levels + 15 neutrals. The right choice: declare the "pure" brand color — not a light or dark shade of it.

**Recommended organization pattern:** Group colors in commented blocks (brand, interface, feedback, product). Well-organized configs are much easier to maintain after 6 months.

---

### Section 3 — `mapping`

```javascript
  mapping: {
    brand: {
      first:  'brand_primary',
      second: 'brand_secondary',
      third:  'brand_tertiary'
    },
    interface: {
      function: {
        primary:   'action_primary',
        secondary: 'action_secondary',
        link:      'action_link'
      },
      feedback: {
        info_default:       'feedback_info',
        info_secondary:     'feedback_info_sat',
        success_default:    'feedback_success',
        success_secondary:  'feedback_success_sat',
        warning_default:    'feedback_warning',
        warning_secondary:  'feedback_warning_sat',
        danger_default:     'feedback_danger',
        danger_secondary:   'feedback_danger_sat',
      }
    },
    product: {
      promo_default:    'product_promo',
      promo_secondary:  'product_promo_alt',
      cashback_default: 'product_cashback',
    }
  },
```

`mapping` is the **bridge** between the free names in `colors` and the system's fixed semantic roles.

The left side (`brand.first`, `interface.function.primary`) is fixed — defined by the architecture schema. The right side (`'brand_primary'`, `'action_primary'`) is the name you chose in `colors`.

**The separation exists for a reason:** Different brands can use the same semantic structure with completely different colors. The schema guarantees that `interface.function.primary` exists in all themes — the mapping guarantees that in each theme it points to the correct color.

**Feedback: `default` vs `secondary`**

Each feedback role has two variants:
- `default` — soft tone, for backgrounds and low-saturation areas
- `secondary` — saturated tone, for borders, icons, and text

The correct practice: for `feedback.info`, `default` is typically the light blue (used as the background for informational banners) and `secondary` is the saturated blue (used in icons and borders).

---

### Section 4 — `typography`

```javascript
  typography: {
    fontFamilies: {
      main:    'Inter',
      content: 'Inter',
      display: 'Inter',
      code:    'Fira Code'
    },
    weights: {
      main: {
        light:    { normal: 300, italic: 300 },
        regular:  { normal: 400, italic: 400 },
        semibold: { normal: 600, italic: 600 },
        bold:     { normal: 700, italic: 700 },
        black:    { normal: 900, italic: 900 }
      }
      // content, display, code: same structure
    }
  },
```

`fontFamilies` defines the system's four typographic families:

| Family | Role | When they differ |
|--------|------|-----------------|
| `main` | Default font — UI, labels, buttons | Almost always |
| `content` | Font for long-running body text | Editorial brands may use serif |
| `display` | Font for headings and heroes | Brands with strong personality use display fonts |
| `code` | Monospace font for code | Always different — `Fira Code`, `JetBrains Mono` |

When all four point to the same family (like `'Inter'` above), the system uses a uniform font. When they differ, the engine generates distinct CSS variables for each family — the product designer can apply typography without worrying about which font goes where.

`weights` declares the available weights. The engine uses these weights when generating composed typography styles (Heading, Display, Content, Action). If a weight is not declared, styles that depend on it use the closest available.

---

### Section 5 — `options` (optional)

```javascript
  options: {
    txtOnStrategy: 'brand-tint',
    darkModeChroma: 0.85,
    accessibilityLevel: 'AA',
  },
```

`options` controls how the engine behaves during generation.

**`txtOnStrategy`** — how the engine chooses the text color over colored backgrounds:

| Strategy | Behavior | When to use |
|----------|----------|------------|
| `'high-contrast'` (default) | Always pure black or white | High-density interfaces, financial products |
| `'brand-tint'` | Palette tone that passes WCAG | Expressive brands that want to maintain color presence |
| `'custom-tint'` | Fixed color configured by the designer | Very specific cases with mandatory fallback |

**`darkModeChroma`** — how saturated colors are in dark mode:
- `0.85` (default) — 15% less saturated than light
- `0.7` — softer, for interfaces with long screen time
- `1.0` — same saturation as light (rarely desirable)

**`accessibilityLevel`** — the minimum WCAG level guaranteed by the engine:
- `'AA'` (default) — 4.5:1 contrast — sufficient for most products
- `'AAA'` — 7:1 contrast — more restrictive, reduces the number of available combinations

---

### Section 6 — `overrides` (optional)

```javascript
  overrides: {
    grayscale: {
      light: {
        surface: {
          '5':   '#faf9f7',
          '10':  '#f5f3f0',
          '140': '#1f1d1a'
        }
      }
    }
  },
```

Overrides replace engine-generated values in specific cases. Only two points accept overrides: `grayscale` and `neutrals`.

This section should be the rarest in the config. If it is growing, it is a signal that the color declared in `colors` may not be the right one — or that expectations need adjusting.

Remember the mandatory cycle before any override: **Study → Test → Document** (see [N2-06](./06-overrides-responsaveis.md)).

---

### Section 7 — `gradients` (optional)

```javascript
  gradients: {
    brand: {
      first: {
        angle: 135,
        stops: [
          { position: 0, colorRef: 'brand.branding.first.lowest.background' },
          { position: 1, colorRef: 'brand.branding.first.default.background' }
        ]
      }
    }
  }
```

`gradients` defines brand gradients. The `colorRef` values point to Brand layer tokens — not to hex directly. This ensures the gradient adapts to dark mode.

**Build warning:** Gradients only appear in the final output when `data/semantic/default.json` has the `semantic.color.gradient` section — created by `sync:architecture`. If gradients appear missing in CSS, run `npm run sync:architecture` before the build.

---

### Registering the theme

Creating the `.config.mjs` is not enough. The theme must be registered in:

```json
// dynamic-themes/themes/config/global/themes.config.json
{
  "themes": {
    "aplica_joy": {
      "includePrimitives": true,
      "foundation": {
        "brand": "engine",
        "files": [
          "default.json",
          "styles/typography_styles.json",
          "styles/elevation_styles.json"
        ]
      }
    }
  }
}
```

**Critical rule:** The key `"aplica_joy"` must be identical to the `name` in the `.config.mjs` and to the folder name generated in `data/brand/`. Any divergence causes silent errors in the build.

---

## Guided example

### Reading a config for the first time

Given an unfamiliar config, the reading order that gives the fastest overview:

**1. `name`** — what is the theme? Check that it matches the folder in `data/brand/`.

**2. `mapping`** — how many product colors exist? Every product item in the mapping is cost. Assess whether the number is justified.

**3. `colors`** — do the feedback colors have `default` (soft) and `secondary` (saturated) for each type? If `danger_default` looks too saturated, it may be mapped incorrectly.

**4. `options`** — which `txtOnStrategy` is active? If `brand-tint` and the brand is financial, question whether it is the right choice.

**5. `overrides`** — is there anything here? If so, check whether there is documentation (a comment or CHANGELOG entry). Undocumented overrides are technical debt.

---

## Now you try

A music streaming company wants its theme in the system. You receive the brief:

> **Brand:** Vibra  
> **Primary action color:** `#7C3AED` (vibrant purple)  
> **Secondary action color:** `#10B981` (electric green)  
> **Feedback:** standard colors (blue/green/amber/red)  
> **Typography:** `'Poppins'` for everything, except code (`'JetBrains Mono'`)  
> **Identity:** expressive, youthful — maintaining brand color in text is important  
> **Hero gradient:** from light purple to vibrant purple, 135°

Write (from memory, without the file open) the `.config.mjs` structure with:
1. Correct `name`
2. `colors` with the essential colors
3. `mapping` of the action colors and at least one feedback (success)
4. `typography` with the correct families
5. `options` with the right text strategy for the brand identity

**Expected result:**

```javascript
export default {
  name: 'vibra',

  colors: {
    purple_primary:  '#7C3AED',
    green_secondary: '#10B981',

    feedback_success:     '#D1FAE5',   // soft, for bg
    feedback_success_sat: '#10B981',   // saturated, for icon/border
    // ... other feedbacks
  },

  mapping: {
    brand: {
      first:  'purple_primary',
      second: 'green_secondary',
    },
    interface: {
      function: {
        primary:   'purple_primary',
        secondary: 'green_secondary',
      },
      feedback: {
        success_default:   'feedback_success',
        success_secondary: 'feedback_success_sat',
        // ...
      }
    }
  },

  typography: {
    fontFamilies: {
      main:    'Poppins',
      content: 'Poppins',
      display: 'Poppins',
      code:    'JetBrains Mono'
    },
    // weights: standard structure with available Poppins weights
  },

  options: {
    txtOnStrategy: 'brand-tint', // expressive identity — keep color in text
  },

  gradients: {
    brand: {
      first: {
        angle: 135,
        stops: [
          { position: 0, colorRef: 'brand.branding.first.lowest.background' },
          { position: 1, colorRef: 'brand.branding.first.default.background' }
        ]
      }
    }
  }
}
```

Key points in the result: `brand-tint` as text strategy (explicit in the identity); no product items (none were needed in the brief); the secondary action color maps to the same green as `brand.second` — this is correct and efficient.

---

## Checkpoint

By the end of this tutorial you should know:

- [ ] The 7 config sections and what each one is for
- [ ] The distinction between `colors` (free dictionary) and `mapping` (fixed semantic roles)
- [ ] The `default` + `secondary` pattern for feedback colors
- [ ] The three `txtOnStrategy` options and when to use each
- [ ] Why `overrides` should be the rarest section in the config
- [ ] How to register the theme in `themes.config.json` and the name consistency rule
- [ ] The gradients trap and when to run `sync:architecture`

---

## Next step

[N2-05 · Product colors — responsible growth](./05-cores-de-produto.md)

You know how to write a complete config. The next step is to understand its most dangerous section: product colors. Why does each item in `mapping.product` cost much more than it seems?

---

## References

- Full configuration guide: [03-configuration-guide.md](../../04-theme-engine/03-configuration-guide.md)
- The Config-First paradigm: [N2-03 · The Config-First paradigm](./03-paradigma-config-first.md)
- Responsible overrides: [N2-06 · Responsible overrides](./06-overrides-responsaveis.md)
- Real config example: [aplica-joy.config.mjs](../../../references/aplica-tokens-theme-engine/config/aplica-joy.config.mjs)
