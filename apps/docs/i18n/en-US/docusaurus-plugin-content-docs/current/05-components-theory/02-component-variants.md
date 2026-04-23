---
title: "Component Variants and States"
lang: en
---

# Component Variants and States

## Premise

Every component exists in multiple **variants** (primary, secondary, ghost…) and multiple **states** (normal, hover, active, focus, disabled). The token system treats variants and states as independent, predictable dimensions — not as ad hoc combinations.

This document shows how to map each variant × state combination to the correct token, and how to apply that pattern to any component in the DS.

---

## The Model: Variant × State × Property

The interface token structure follows a three-axis pattern:

```
semantic.color.interface.function.{variant}.{state}.{property}
```

| Axis | Available values |
|------|-----------------|
| **Variant** | `primary`, `secondary`, `link`, `active`, `disabled` |
| **State** | `normal`, `action`, `active` (`disabled` only has `normal`) |
| **Property** | `background`, `txtOn`, `border`, `txt` (since 3.6.0) |

These three axes form the **functional token grid**. For any combination of variant and state, the corresponding token already exists in the build.

---

## States — CSS Mapping

| Token state | CSS trigger |
|------------|------------|
| `normal` | Default state — no pseudo-class |
| `action` | `:hover`, `:focus-visible` (during visual interaction feedback) |
| `active` | `:active` (pressed), `[aria-selected="true"]`, `[aria-pressed="true"]` |

The `disabled` state is a special case: it only has `normal` and never responds to `:hover` or `:active`.

---

## Function Variants — Buttons and Controls

### Token table by variant

| Variant | When to use |
|---------|------------|
| `primary` | Main CTA — the most important action on the screen |
| `secondary` | Supporting action — complements the primary |
| `link` | Text action — low prominence, navigational |
| `active` | Currently selected control (toggle, active tab) |
| `disabled` | Control not available for interaction |

### Example: Button with all states

```css
/* ── Primary Button ── */
.btn-primary {
  background: var(--semantic-color-interface-function-primary-normal-background);
  color:      var(--semantic-color-interface-function-primary-normal-txt-on);
  border:     1px solid var(--semantic-color-interface-function-primary-normal-border);
}

.btn-primary:hover,
.btn-primary:focus-visible {
  background: var(--semantic-color-interface-function-primary-action-background);
  color:      var(--semantic-color-interface-function-primary-action-txt-on);
  border:     1px solid var(--semantic-color-interface-function-primary-action-border);
}

.btn-primary:active,
.btn-primary[aria-pressed="true"] {
  background: var(--semantic-color-interface-function-primary-active-background);
  color:      var(--semantic-color-interface-function-primary-active-txt-on);
  border:     1px solid var(--semantic-color-interface-function-primary-active-border);
}

/* ── Disabled Button ── */
.btn-primary:disabled,
.btn-primary[aria-disabled="true"] {
  background: var(--semantic-color-interface-function-disabled-normal-background);
  color:      var(--semantic-color-interface-function-disabled-normal-txt-on);
  border:     1px solid var(--semantic-color-interface-function-disabled-normal-border);
  cursor: not-allowed;
}
```

### Example: Secondary Button

```css
.btn-secondary {
  background: var(--semantic-color-interface-function-secondary-normal-background);
  color:      var(--semantic-color-interface-function-secondary-normal-txt-on);
  border:     1px solid var(--semantic-color-interface-function-secondary-normal-border);
}

.btn-secondary:hover {
  background: var(--semantic-color-interface-function-secondary-action-background);
}

.btn-secondary:active {
  background: var(--semantic-color-interface-function-secondary-active-background);
}
```

---

## Feedback Variants — Alerts, Banners, Toasts

Feedback components follow the `{type}.{variant}.{state}` pattern:

```
semantic.color.interface.feedback.{type}.{variant}.{state}.{property}
```

| Segment | Values |
|---------|--------|
| `{type}` | `info`, `success`, `warning`, `danger` |
| `{variant}` | `default` (soft, for backgrounds), `secondary` (saturated, for borders and icons) |
| `{state}` | `normal`, `action`, `active` |

### Example: Alert with all types

```css
/* Generic alert */
.alert {
  padding: var(--semantic-dimension-spacing-small);
  border-radius: var(--semantic-border-radii-small);
  border-left: 4px solid;
}

/* Info */
.alert--info {
  background:   var(--semantic-color-interface-feedback-info-default-normal-background);
  color:        var(--semantic-color-interface-feedback-info-default-normal-txt-on);
  border-color: var(--semantic-color-interface-feedback-info-secondary-normal-border);
}

/* Success */
.alert--success {
  background:   var(--semantic-color-interface-feedback-success-default-normal-background);
  color:        var(--semantic-color-interface-feedback-success-default-normal-txt-on);
  border-color: var(--semantic-color-interface-feedback-success-secondary-normal-border);
}

/* Warning */
.alert--warning {
  background:   var(--semantic-color-interface-feedback-warning-default-normal-background);
  color:        var(--semantic-color-interface-feedback-warning-default-normal-txt-on);
  border-color: var(--semantic-color-interface-feedback-warning-secondary-normal-border);
}

/* Danger */
.alert--danger {
  background:   var(--semantic-color-interface-feedback-danger-default-normal-background);
  color:        var(--semantic-color-interface-feedback-danger-default-normal-txt-on);
  border-color: var(--semantic-color-interface-feedback-danger-secondary-normal-border);
}
```

**Rule:** always use `default` for the background and `secondary` for border and icon — this combination guarantees visual hierarchy and adequate contrast.

---

## Input Variants — Validation States

Inputs have a validation state that overlaps with the interactive state:

```css
/* Input — normal state */
.input {
  background: var(--semantic-color-brand-ambient-contrast-deep-positive-background);
  color:      var(--semantic-color-text-body);
  border:     1px solid var(--semantic-color-brand-ambient-neutral-mid-border);
  border-radius: var(--semantic-border-radii-extra-small);
  padding: var(--semantic-dimension-spacing-extra-small) var(--semantic-dimension-spacing-small);
}

/* Input — focus */
.input:focus-visible {
  border-color: var(--semantic-color-interface-function-primary-action-border);
  outline: none;
}

/* Input — error */
.input--error {
  border-color: var(--semantic-color-interface-feedback-danger-secondary-normal-border);
}

/* Error message below the input */
.input__error-msg {
  color: var(--semantic-color-text-danger_default);
  font-size: var(--semantic-typography-font-sizes-extra-small);
}

/* Input — success */
.input--success {
  border-color: var(--semantic-color-interface-feedback-success-secondary-normal-border);
}

/* Input — disabled */
.input:disabled {
  background: var(--semantic-color-interface-function-disabled-normal-background);
  color:      var(--semantic-color-interface-function-disabled-normal-txt-on);
  border-color: var(--semantic-color-interface-function-disabled-normal-border);
  cursor: not-allowed;
}
```

---

## Intensity Variants — Brand Components

For components that express brand identity (badges, chips, brand tags), use the intensity levels from `brand.branding`:

```
semantic.color.brand.branding.{role}.{intensity}.{property}
```

| Intensity | Visual | Typical use |
|-----------|--------|-------------|
| `lowest` | Very subtle | Chip background, tag in dense context |
| `low` | Soft | Secondary badge background |
| `default` | Brand standard | CTA, hero button, main element |
| `high` | Saturated/dark | Emphasis text on light background |
| `highest` | Maximum | Rare — very high prominence element |

```css
/* Brand chip — soft */
.chip--brand {
  background: var(--semantic-color-brand-branding-first-lowest-background);
  color:      var(--semantic-color-brand-branding-first-lowest-txt-on);
  border:     1px solid var(--semantic-color-brand-branding-first-low-border);
}

/* Brand badge — highlighted */
.badge--brand {
  background: var(--semantic-color-brand-branding-first-default-background);
  color:      var(--semantic-color-brand-branding-first-default-txt-on);
}
```

---

## Size Variants — Dimension Scale

Size variants (small, medium, large) of a component map to the semantic dimension scale. The most common convention:

| Component size | Internal spacing | Height sizing |
|---------------|-----------------|---------------|
| `xs` | `micro` | `extraSmall` |
| `sm` | `extraSmall` | `small` |
| `md` | `small` | `medium` |
| `lg` | `medium` | `large` |
| `xl` | `large` | `extraLarge` |

```css
/* Medium button (default) */
.btn--md {
  padding:     var(--semantic-dimension-spacing-extra-small) var(--semantic-dimension-spacing-small);
  height:      var(--semantic-dimension-sizing-large);
  font-size:   var(--semantic-typography-font-sizes-small);
  border-radius: var(--semantic-border-radii-small);
}

/* Small button */
.btn--sm {
  padding:     var(--semantic-dimension-spacing-micro) var(--semantic-dimension-spacing-extra-small);
  height:      var(--semantic-dimension-sizing-medium);
  font-size:   var(--semantic-typography-font-sizes-extra-small);
  border-radius: var(--semantic-border-radii-extra-small);
}

/* Large button */
.btn--lg {
  padding:     var(--semantic-dimension-spacing-small) var(--semantic-dimension-spacing-medium);
  height:      var(--semantic-dimension-sizing-extra-large);
  font-size:   var(--semantic-typography-font-sizes-medium);
  border-radius: var(--semantic-border-radii-medium);
}
```

---

## The Disabled State — Two Patterns

There are two valid ways to implement the disabled state; the choice depends on the component type.

### Pattern 1 — Disabled token (preferred for buttons and controls)

Use the `interface.function.disabled` tokens — they guarantee correct contrast over the current background:

```css
.btn:disabled {
  background: var(--semantic-color-interface-function-disabled-normal-background);
  color:      var(--semantic-color-interface-function-disabled-normal-txt-on);
  border-color: var(--semantic-color-interface-function-disabled-normal-border);
}
```

### Pattern 2 — Opacity (for content and entire regions)

When an entire section is disabled and it does not make sense to swap each individual token:

```css
.section--disabled {
  opacity: calc(var(--semantic-opacity-raw-translucid) / 100); /* 50% */
  pointer-events: none;
}
```

> **Caution:** Opacity alone does not guarantee sufficient contrast over all backgrounds. Use carefully on small text. For individual controls, always prefer Pattern 1.

---

## Focus Ring — Accessibility by Token

The focus ring is a mandatory accessibility element (WCAG 2.4.7). Use the `action` variant border of the corresponding role:

```css
/* Generic focus ring */
:focus-visible {
  outline: 2px solid var(--semantic-color-interface-function-primary-action-border);
  outline-offset: 2px;
}

/* Focus on feedback element (e.g., clickable alert) */
.alert:focus-visible {
  outline-color: var(--semantic-color-interface-feedback-info-secondary-normal-border);
}
```

---

## Product Variants — Badges and Seals

Product signaling components (promo badges, cashback seals, tier indicators) use `semantic.color.product.*`:

```css
/* Promotion badge */
.badge--promo {
  background: var(--semantic-color-product-promo-default-default-background);
  color:      var(--semantic-color-product-promo-default-default-txt-on);
  border:     1px solid var(--semantic-color-product-promo-default-default-border);
}

/* Subtle promo variant (lower prominence) */
.badge--promo-subtle {
  background: var(--semantic-color-product-promo-default-lowest-background);
  color:      var(--semantic-color-product-promo-default-lowest-txt-on);
}

/* Cashback badge */
.badge--cashback {
  background: var(--semantic-color-product-cashback-default-default-background);
  color:      var(--semantic-color-product-cashback-default-default-txt-on);
}
```

---

## Reference Component — Complete Map (Button)

The table below shows the complete token mapping for a Button component with 3 variants and 4 states:

| Variant | State | Background | Text | Border |
|---------|-------|-----------|------|--------|
| **primary** | normal | `function.primary.normal.background` | `function.primary.normal.txtOn` | `function.primary.normal.border` |
| **primary** | hover | `function.primary.action.background` | `function.primary.action.txtOn` | `function.primary.action.border` |
| **primary** | pressed | `function.primary.active.background` | `function.primary.active.txtOn` | `function.primary.active.border` |
| **primary** | disabled | `function.disabled.normal.background` | `function.disabled.normal.txtOn` | `function.disabled.normal.border` |
| **secondary** | normal | `function.secondary.normal.background` | `function.secondary.normal.txtOn` | `function.secondary.normal.border` |
| **secondary** | hover | `function.secondary.action.background` | `function.secondary.action.txtOn` | `function.secondary.action.border` |
| **secondary** | pressed | `function.secondary.active.background` | `function.secondary.active.txtOn` | `function.secondary.active.border` |
| **secondary** | disabled | `function.disabled.normal.background` | `function.disabled.normal.txtOn` | `function.disabled.normal.border` |
| **link** | normal | transparent | `function.link.normal.txtOn` | none |
| **link** | hover | `function.link.action.background` | `function.link.action.txtOn` | none |
| **link** | pressed | `function.link.active.background` | `function.link.active.txtOn` | none |
| **link** | disabled | `function.disabled.normal.background` | `function.disabled.normal.txtOn` | `function.disabled.normal.border` |

All paths above are prefixed with `semantic.color.interface.`.

---

## References

- Token contract: [01-component-token-contract.md](./01-component-token-contract.md)
- Dark mode patterns: [03-dark-mode-patterns.md](./03-dark-mode-patterns.md)
- Semantic layer: [04-semantic-layer.md](../02-token-layers/04-semantic-layer.md)
- Color system: [01-colors.md](../03-visual-foundations/01-colors.md)
- Dimension system: [03-spacing-sizing.md](../03-visual-foundations/03-spacing-sizing.md)
- Opacity: [05-opacity.md](../03-visual-foundations/05-opacity.md)
- Semantic tokens (source): [default.json](../../references/aplica-tokens-theme-engine/data/semantic/default.json)
