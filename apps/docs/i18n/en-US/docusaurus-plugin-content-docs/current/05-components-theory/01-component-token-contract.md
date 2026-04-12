---
title: "component-token-contract"
lang: en
---

# Token Contract for Components

## Premise

When a system engineer builds a component — or when a product engineer customizes a screen — they need to know exactly which tokens to use, where they come from, and what the engine guarantees will never change without notice. This document defines that **contract**: the canonical rules governing token consumption in components and UIs.

The contract has two dimensions:
- **Which tokens to use** (Semantic vs Foundation, when and why)
- **What the engine guarantees** (reserved namespaces, breaking changes, versioning)

---

## The Fundamental Rule

```
Always use Semantic.
Use Foundation when a suitable alias exists.
Never use Brand, Mode, or Surface directly.
```

| Layer | Consumption in components | Why |
|-------|--------------------------|-----|
| **Semantic** | Always — it is the canonical exposed layer | Expresses purpose, not internal value. All tokens are calculated, tested, and WCAG-guaranteed |
| **Foundation** | When a suitable alias already exists | Cognitive shortcut for product teams. Does NOT replace Semantic as the source of truth |
| `brand.*`, `mode.*`, `surface.*` | **Prohibited** in component code | Internal layers — any reference to them breaks with architecture changes |

### Why Semantic, not Foundation?

Foundation is a cognitive load-reduction layer — it exists for product teams building screens, not for those building the components themselves. A component using `foundation.bg.primary` apparently works, but depends on the current theme having that alias defined. If the alias does not exist or changes, the component breaks silently.

Semantic is the stable contract. A Foundation alias is optional and convenient — never mandatory.

---

## Who Consumes What

| Profile | Primary layer | Fallback |
|---------|--------------|---------|
| **DS Engineer** (builds base components) | Semantic — always, no exceptions | — |
| **Product Engineer** (assembles screens with components) | Foundation — when the alias exists | Semantic when the alias does not cover the case |
| **Designer** (in Figma via Tokens Studio) | Semantic — for components; Foundation — for layouts | — |
| **AI / Code Connect** | Semantic identified by `semantic.*` | Foundation identified by `foundation.*` |

---

## How to Identify Tokens

The path prefix identifies the layer:

| Prefix | Layer | Example |
|--------|-------|---------|
| `semantic.*` | Semantic — canonical layer | `semantic.color.interface.function.primary.normal.background` |
| `foundation.*` | Foundation — alias for Semantic | `foundation.bg.primary` |
| `component.*` | Component — component-specific tokens (when available) | `component.button.primary.background` |
| `brand.*`, `mode.*`, `surface.*` | Internal layers — **never use** | — |

In CSS, the same prefixes are used with hyphens:

```css
/* Semantic */
var(--semantic-color-interface-function-primary-normal-background)

/* Foundation */
var(--foundation-bg-primary)
```

---

## Semantic Token Map by Category

### Brand Colors — `semantic.color.brand`

#### Branding (`semantic.color.brand.branding`)

Primary brand identity. Use in hero areas, brand CTAs, and highlights.

**Structure:** `semantic.color.brand.branding.{role}.{intensity}.{property}`

| Segment | Values |
|---------|--------|
| `{role}` | `first`, `second`, `third` |
| `{intensity}` | `lowest`, `low`, `default`, `high`, `highest` |
| `{property}` | `background`, `txtOn`, `border` |

```css
/* Brand hero button, normal state */
background: var(--semantic-color-brand-branding-first-default-background);
color:      var(--semantic-color-brand-branding-first-default-txt-on);
border:     var(--semantic-color-brand-branding-first-default-border);
```

#### Ambient (`semantic.color.brand.ambient`)

Base canvas, neutrals, and grayscale. Use in layout, surfaces, and text hierarchy — not in colorful emphasis.

**Structure:**

| Subgroup | Keys | Typical use |
|----------|------|-------------|
| `contrast.base` | `positive`, `negative` | Main canvas, surface contrast |
| `contrast.deep` | `positive`, `negative` | Absolute light and dark |
| `neutral` | `lowest` → `highest` (7 levels) | Elevated panels, secondary surfaces |
| `grayscale` | `lowest` → `highest` (7 levels) | Fixed grayscale independent of brand |

```css
/* Main canvas background */
background: var(--semantic-color-brand-ambient-contrast-deep-positive-background);

/* Elevated panel */
background: var(--semantic-color-brand-ambient-neutral-low-background);
```

---

### Interactive Controls — `semantic.color.interface.function`

Buttons, links, controls, and interactive elements.

**Structure:** `semantic.color.interface.function.{role}.{state}.{property}`

| `{role}` | Use |
|----------|-----|
| `primary` | Main CTA |
| `secondary` | Secondary action |
| `link` | Links and text actions |
| `active` | Active or selected UI |
| `disabled` | Disabled controls (only has `normal` state) |

| `{state}` | Maps to |
|----------|---------|
| `normal` | Default / resting state |
| `action` | Hover or pressed |
| `active` | Active / selected |

```css
/* Primary button — normal */
background: var(--semantic-color-interface-function-primary-normal-background);
color:      var(--semantic-color-interface-function-primary-normal-txt-on);
border:     var(--semantic-color-interface-function-primary-normal-border);

/* Primary button — hover */
background: var(--semantic-color-interface-function-primary-action-background);

/* Disabled button */
background: var(--semantic-color-interface-function-disabled-normal-background);
color:      var(--semantic-color-interface-function-disabled-normal-txt-on);
```

---

### System Feedback — `semantic.color.interface.feedback`

Alerts, badges, and system messages: info, success, warning, danger.

**Structure:** `semantic.color.interface.feedback.{type}.{variant}.{state}.{property}`

| `{type}` | Meaning |
|---------|---------|
| `info` | Informational / neutral |
| `success` | Confirmation / success |
| `warning` | Attention / alert |
| `danger` | Error / destructive action |

| `{variant}` | Use |
|------------|-----|
| `default` | Soft background — alert surfaces |
| `secondary` | More saturated variant — borders and icons |

```css
/* Success alert */
background: var(--semantic-color-interface-feedback-success-default-normal-background);
color:      var(--semantic-color-interface-feedback-success-default-normal-txt-on);
border:     var(--semantic-color-interface-feedback-success-secondary-normal-border);
```

> **Accessibility rule:** Always use `background` and `txtOn` from the same token. The pair guarantees WCAG contrast. Never combine a background from one level with a txtOn from another.

---

### Text Colors — `semantic.color.text`

Simplified text tokens — flat, without intensity, purpose only.

| Token | Use |
|-------|-----|
| `semantic.color.text.title` | Titles and primary UI text |
| `semantic.color.text.body` | Body text — main content |
| `semantic.color.text.highlight` | Highlighted or emphasized text |
| `semantic.color.text.muted` | Secondary or disabled text |
| `semantic.color.text.label` | Form labels and captions |
| `semantic.color.text.info_default` | Informational feedback text |
| `semantic.color.text.success_default` | Success feedback text |
| `semantic.color.text.warning_default` | Warning text |
| `semantic.color.text.danger_default` | Error text |

```css
h1 { color: var(--semantic-color-text-title); }
p  { color: var(--semantic-color-text-body); }
label { color: var(--semantic-color-text-label); }
```

---

### Product Colors — `semantic.color.product`

Product-specific colors — promotions, cashback, tiers, categorizations. The **only open area** of Semantic where product teams can declare custom categories.

**Structure:** `semantic.color.product.{item}.{variant}.{intensity}.{property}`

| Segment | Values |
|---------|--------|
| `{item}` | `promo`, `cashback`, `premium` — or any free name defined in the config |
| `{variant}` | `default`, `secondary` |
| `{intensity}` | `lowest`, `low`, `default`, `high`, `highest` |
| `{property}` | `background`, `txtOn`, `border` |

Plain text tokens also available at `semantic.color.text.{item}` and `semantic.color.text.{item}_secondary`.

> [!CAUTION]
> **Exponential cost.** Each new item in `product` generates at minimum 30 tokens that propagate through all layers and all themes. In a system with 4 themes, a single item represents +120 tokens. Before adding, ask: _"Can this be resolved with existing feedback or brand tokens?"_ See [04-semantic-layer.md](../02-token-layers/04-semantic-layer.md) for the full rationale.

---

### Gradients — `semantic.color.gradient`

Configuration and steps for brand gradients.

| Group | Tokens |
|-------|--------|
| `gradient.config.degrees` | `horizontal`, `vertical`, `toBottom`, `diagonalLeft`, `diagonalRight`, `diagonalBrand`, `diagonalBrandAlt` |
| `gradient.config.steps` | 0, 10, 20, … 100 (stops in %) |
| `gradient.config.colors` | `first.lowest`, `first.default`, etc. |

Gradients are configured in the theme file (`*.config.mjs`) and only appear in the output if `sync:architecture` runs after `themes:generate`. See [04-build-pipeline.md](../04-theme-engine/04-build-pipeline.md#the-gradients-trap).

---

### Opacity — `semantic.opacity`

Transparency for overlays, disabled states, and glass effects.

| Subgroup | Keys | Use |
|----------|------|-----|
| `opacity.raw` | `transparent` (0), `superTransparent` (10), `semiTranslucid` (20), `translucid` (50), `superTranslucid` (80), `semiOpaque` (90), `opaque` (100) | Numeric value to apply to any color |
| `opacity.color.grayscale` | Same keys | Dark color with opacity already applied |
| `opacity.color.light` | Same keys | Light color with opacity already applied |

```css
/* Modal overlay */
background: var(--semantic-opacity-color-grayscale-super-translucid);

/* Disabled state via opacity */
opacity: calc(var(--semantic-opacity-raw-semi-translucid) / 100);
```

---

### Typography — `semantic.typography`

**Structure:**

| Group | Relevant tokens |
|-------|----------------|
| `fontFamilies` | `main`, `content`, `display`, `code` |
| `fontWeights` | By family × weight × style (normal/italic) |
| `fontSizes` | `extraSmall` → `peta` (scale of 13 sizes) |
| `lineHeights` | `tight`, `close`, `regular` × size |
| `letterSpacings`, `paragraphSpacing`, `textCase`, `textDecoration` | Typographic complements |

Foundation composite styles (`heading`, `content`, `display`, `hierarchy`, `action`, `link`, `code`) consume these tokens and are the preferred form for product teams. In the DS, access `semantic.typography` directly for granular control.

---

### Dimension — `semantic.dimension`

Spacing and sizing for layout, padding, margin, gap, and component dimensions.

| Group | Token scale |
|-------|------------|
| `sizing` | `zero`, `pico`, `nano`, `micro`, `extraSmall`, `small`, `medium`, `large`, `extraLarge`, `mega`, `giga`, `tera`, `peta` |
| `spacing` | Same scale (minimum: `micro`) |

`medium` in the `normal` variant corresponds to 16px (1 LayoutUnit). Use `sizing` for component height, icon, and border thickness; `spacing` for padding, margin, and gap.

---

### Border — `semantic.border`

| Group | Tokens | Use |
|-------|--------|-----|
| `width` | `none`, `small`, `medium`, `large`, `extraLarge` | Outline thickness, dividers, focus rings |
| `radii` | `straight`, `micro`, `extraSmall`, `small`, `medium`, `large`, `extraLarge`, `mega`, `circular` | Border radius by component |

```css
/* Card with medium radius */
border-radius: var(--semantic-border-radii-medium);
border-width:  var(--semantic-border-width-small);
```

---

### Depth — `semantic.depth`

Shadow spread for elevation.

| Token | Value | Use |
|-------|-------|-----|
| `depth.spread.close` | 0 | No elevation |
| `depth.spread.next` | -2 | Minimum elevation |
| `depth.spread.near` | -4 | Cards and panels |
| `depth.spread.distant` | -8 | Dropdowns |
| `depth.spread.far` | -12 | Modals and dialogs |

Higher magnitude = more elevation. Foundation composite elevation styles (`elevation.level_one` → `elevation.level_five`) are the preferred form for product teams.

---

## The Background + txtOn Pair

Every colored surface in the system has two complementary tokens: `background` and `txtOn`. The `txtOn` is automatically calculated by the engine to guarantee WCAG AA contrast (or AAA, depending on the theme config).

**Invariable rule:** Always use the `txtOn` from the same token as the `background`.

```css
/* CORRECT — pair from the same token */
.badge-success {
  background: var(--semantic-color-interface-feedback-success-default-normal-background);
  color:      var(--semantic-color-interface-feedback-success-default-normal-txt-on);
}

/* WRONG — mixing different tokens */
.badge-success {
  background: var(--semantic-color-interface-feedback-success-default-normal-background);
  color:      var(--semantic-color-text-body); /* ← contrast not guaranteed */
}
```

---

## Forbidden Patterns

| Forbidden pattern | Why | What to use instead |
|------------------|-----|---------------------|
| `var(--theme-color-*)` | Internal layer | `var(--semantic-color-*)` |
| `var(--brand-*)`, `var(--mode-*)`, `var(--surface-*)` | Internal layers | `var(--semantic-color-*)` |
| Inventing `--semantic-color-my-color` in product CSS | Violates the contract — may conflict with future builds | Use only paths that exist in `dist/` |
| Hardcoded hex `#C40145` in component CSS | Loses automatic theming, dark mode, and multi-brand | `var(--semantic-color-interface-function-primary-normal-background)` |
| `semantic.color.interface.feedback.info_default.background` with `semantic.color.text.body` overlaid | Contrast not guaranteed | Use the `background` + `txtOn` pair from the same token |

---

## Versioning Contract

### What is guaranteed

The engine guarantees that published paths in `dist/` (e.g., `--semantic-color-interface-function-primary-normal-background`) will not change without a major version bump. Any path that appears in the build is part of the public contract.

### What is a breaking change

- **Renaming** a token path (`semantic.color.interface.oldName` → `semantic.color.interface.newName`) — **major version**
- **Removing** a token path — **major version**
- **Adding** a new path — minor version (does not break existing consumers)

### Deprecation

When a token needs to be renamed, the engine may opt for a deprecation window: the old path remains in the build marked as deprecated in `$description`, with the new path indicated. Removal happens in the next major version.

Changes are documented in the engine's `CHANGELOG.md`, which specifies: old path, new path, removal version.

---

## References

- Semantic layer in detail: [04-semantic-layer.md](../02-token-layers/04-semantic-layer.md)
- Foundation layer: [05-foundation-layer.md](../02-token-layers/05-foundation-layer.md)
- Canonical taxonomy and naming: canonical-taxonomy-and-naming-contract.md
- Token usage for components and Figma: token-usage-for-components-and-figma.md
- Output formats and CSS variables: [05-output-formats.md](../04-theme-engine/05-output-formats.md)
- Component variants and states: [02-component-variants.md](./02-component-variants.md)
- Dark mode patterns: [03-dark-mode-patterns.md](./03-dark-mode-patterns.md)
- Dimension scale: [03-spacing-sizing.md](../03-visual-foundations/03-spacing-sizing.md)
- Color system: [01-colors.md](../03-visual-foundations/01-colors.md)
