---
title: "Foundation Styles"
lang: en
---

# Foundation Styles

## What they are

Foundation Styles are pre-composed CSS class definitions generated from the Aplica Tokens Theme Engine. Unlike atomic tokens (individual CSS custom properties), Foundation Styles bundle several token references into a single, semantically named class.

The engine produces two style files per foundation brand:

| File | Contents |
|------|----------|
| `data/foundation/{brand}/styles/typography_styles.json` | Composite typography definitions (font-family, weight, size, line-height, letter-spacing, text-transform, text-decoration) |
| `data/foundation/{brand}/styles/elevation_styles.json` | Composite box-shadow definitions per elevation level |

These JSON files are then compiled into CSS classes by the Style Dictionary build step:

| CSS output | Location |
|------------|----------|
| `dist/css/foundation/{brand}/typography.css` | Typography utility classes |
| `dist/css/foundation/{brand}/elevation.css` | Elevation utility classes |

---

## Why composite styles instead of atomic tokens

Atomic tokens are flexible but require assembling multiple properties at the point of use. Every component that needs a heading style must reference font-family, weight, size, line-height, letter-spacing, text-transform, and text-decoration individually. This creates:

- Repetition at the component level
- Risk of inconsistency when properties are assembled incorrectly
- Difficulty for AI code generators, which must reason about individual tokens and compose them correctly each time

Foundation Styles encode the correct combination once. A component applies a single class; the style definition is the contract.

This is also the preferred consumption pattern for the AI UI Integration Program: AI agents are instructed to prefer `typography.css` classes over assembling individual token references.

---

## Typography class naming

Typography classes follow this pattern:

```
.typography-{foundation}-{category}-{variant}
```

Examples:

```css
.typography-theme_engine-heading-title_1 { ... }
.typography-theme_engine-heading-title_2 { ... }
.typography-theme_engine-action-strong-tight-medium { ... }
.typography-theme_engine-body-regular-loose-medium { ... }
```

Each class sets all typography properties using semantic token references:

```css
.typography-theme_engine-heading-title_1 {
  font-family:     var(--semantic-typography-fontFamilies-main);
  font-weight:     var(--semantic-typography-fontWeights-main-semibold-normal);
  font-size:       var(--semantic-typography-fontSizes-medium);
  line-height:     var(--semantic-typography-lineHeights-close-medium);
  letter-spacing:  var(--semantic-typography-letterSpacings-regular);
  text-transform:  var(--semantic-typography-textCase-uppercase);
  text-decoration: var(--semantic-typography-textDecoration-default);
}
```

The CSS custom properties inside the class are resolved at runtime from the active theme file — switching themes by changing `data-theme` updates both atomic tokens and the values these classes reference.

---

## Elevation class naming

Elevation classes are named by level:

```css
.elevation-level_minus_one { box-shadow: ... }
.elevation-level_zero      { box-shadow: ... }
.elevation-level_one       { box-shadow: ... }
.elevation-level_two       { box-shadow: ... }
.elevation-level_three     { box-shadow: ... }
.elevation-level_four      { box-shadow: ... }
.elevation-level_five      { box-shadow: ... }
```

Each class composes depth spread and opacity tokens:

```css
.elevation-level_two {
  box-shadow:
    var(--semantic-dimension-sizing-zero)
    var(--semantic-dimension-sizing-nano)
    var(--semantic-dimension-sizing-large)
    calc(0px + var(--semantic-depth-spread-next))
    var(--semantic-opacity-color-grayscale-superTransparent);
}
```

Elevation is defined per foundation brand (not per theme), so all themes sharing a foundation use the same elevation class definitions. The shadow color and spread values resolve dynamically from the theme's semantic tokens.

---

## How to load Foundation Styles

Import both the active theme file and the foundation style sheets:

```html
<!-- 1. Active theme (resolves all --semantic-* and --foundation-* variables) -->
<link rel="stylesheet" href="/dist/css/aplica_joy-light-positive.css" />

<!-- 2. Foundation styles (class definitions that reference the above variables) -->
<link rel="stylesheet" href="/dist/css/foundation/engine/typography.css" />
<link rel="stylesheet" href="/dist/css/foundation/engine/elevation.css" />
```

The order matters: the theme file must load first so the custom properties exist when the class definitions are parsed.

Then apply classes directly in markup:

```html
<h1 class="typography-theme_engine-heading-title_1">Page title</h1>

<div class="elevation-level_two" style="padding: 1.5rem; border-radius: 0.5rem;">
  Card content
</div>
```

---

## Generation trigger

Foundation Styles are generated as part of the `foundations:generate` step, which runs automatically during a full build:

```bash
aplica-theme-engine build
```

To regenerate only foundation data (including styles) without a full build:

```bash
aplica-theme-engine foundations:generate
```

---

## Relation to the AI UI Integration Program

The AI UI Integration Program designates Foundation Styles as the **preferred consumption path** for AI-generated UI code. When an AI agent builds a component using Aplica tokens, it should:

1. Apply a `typography-*` class for text styling — not assemble individual font tokens.
2. Apply an `elevation-*` class for shadows — not compose raw box-shadow values from depth tokens.
3. Use `--foundation-*` or `--semantic-*` custom properties for color, spacing, and other atomic values.

This preference exists because Foundation Styles encode validated, authored compositions. An AI that composes atomic tokens independently may produce syntactically correct but semantically incorrect combinations (e.g., wrong line-height scale for a given font size).

---

## References

- Build pipeline: [04-build-pipeline.md](./04-build-pipeline.md)
- Output formats: [05-output-formats.md](./05-output-formats.md)
- AI Skills Injection: [07-ai-skills-injection.md](./07-ai-skills-injection.md)
