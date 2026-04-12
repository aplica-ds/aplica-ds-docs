---
level: n3
id: N3-02
title: "Building a component — variants, states, and sizes"
prerequisites: ["N3-01"]
duration: "15 min"
lang: en
---

# N3-02 · Building a Component

## Context

You have mastered the token contract. Now the challenge is practical: given a component with multiple variants, multiple states, and multiple sizes, how do you find the right token for each combination without guessing?

The engine is not arbitrary. The Semantic structure was designed so that the question "which token do I use here?" always has a predictable answer. This tutorial teaches the model — once you internalize it, any component follows the same pattern.

---

## Concept

### The three-dimensional model

Every interactive component lives at the intersection of three axes:

```
semantic.color.interface.function.{variant}.{state}.{property}
```

| Axis | Values |
|------|--------|
| **Variant** | `primary`, `secondary`, `link`, `active`, `disabled` |
| **State** | `normal`, `action`, `active` |
| **Property** | `background`, `txtOn`, `border` |

For feedback components, the model is slightly different:

```
semantic.color.interface.feedback.{type}.{variant}.{state}.{property}
```

| Axis | Values |
|------|--------|
| **Type** | `info`, `success`, `warning`, `danger` |
| **Variant** | `default` (soft, for backgrounds), `secondary` (saturated, for borders/icons) |
| **State** | `normal`, `action`, `active` |

### Mapping states to CSS

| Token state | Trigger in CSS/HTML |
|-------------|---------------------|
| `normal` | No pseudo-class — resting state |
| `action` | `:hover`, `:focus-visible` |
| `active` | `:active`, `[aria-pressed="true"]`, `[aria-selected="true"]` |
| `disabled` | `:disabled`, `[aria-disabled="true"]` — only has `normal`, never responds to hover |

---

## Guided example

### Part 1 — Complete Button

Building a Button with three variants × four states × three properties each:

```css
/* ── Base ── */
.btn {
  display:         inline-flex;
  align-items:     center;
  justify-content: center;
  border:          1px solid transparent;
  cursor:          pointer;
  font-family:     var(--semantic-typography-font-families-main);
  transition:      background 120ms ease, color 120ms ease, border-color 120ms ease;
}

/* ── Primary ── */
.btn--primary {
  background:   var(--semantic-color-interface-function-primary-normal-background);
  color:        var(--semantic-color-interface-function-primary-normal-txt-on);
  border-color: var(--semantic-color-interface-function-primary-normal-border);
}
.btn--primary:hover,
.btn--primary:focus-visible {
  background:   var(--semantic-color-interface-function-primary-action-background);
  color:        var(--semantic-color-interface-function-primary-action-txt-on);
  border-color: var(--semantic-color-interface-function-primary-action-border);
}
.btn--primary:active,
.btn--primary[aria-pressed="true"] {
  background:   var(--semantic-color-interface-function-primary-active-background);
  color:        var(--semantic-color-interface-function-primary-active-txt-on);
  border-color: var(--semantic-color-interface-function-primary-active-border);
}

/* ── Secondary ── */
.btn--secondary {
  background:   var(--semantic-color-interface-function-secondary-normal-background);
  color:        var(--semantic-color-interface-function-secondary-normal-txt-on);
  border-color: var(--semantic-color-interface-function-secondary-normal-border);
}
.btn--secondary:hover,
.btn--secondary:focus-visible {
  background:   var(--semantic-color-interface-function-secondary-action-background);
  color:        var(--semantic-color-interface-function-secondary-action-txt-on);
  border-color: var(--semantic-color-interface-function-secondary-action-border);
}
.btn--secondary:active {
  background:   var(--semantic-color-interface-function-secondary-active-background);
}

/* ── Link ── */
.btn--link {
  background:   transparent;
  color:        var(--semantic-color-interface-function-link-normal-txt-on);
  border-color: transparent;
}
.btn--link:hover,
.btn--link:focus-visible {
  background: var(--semantic-color-interface-function-link-action-background);
  color:      var(--semantic-color-interface-function-link-action-txt-on);
}
.btn--link:active {
  background: var(--semantic-color-interface-function-link-active-background);
}

/* ── Disabled — same appearance for all variants ── */
.btn:disabled,
.btn[aria-disabled="true"] {
  background:   var(--semantic-color-interface-function-disabled-normal-background);
  color:        var(--semantic-color-interface-function-disabled-normal-txt-on);
  border-color: var(--semantic-color-interface-function-disabled-normal-border);
  cursor:       not-allowed;
  pointer-events: none;
}
```

### Part 2 — Sizes via dimensional scale

```css
/* ── Small ── */
.btn--sm {
  padding:       var(--semantic-dimension-spacing-micro) var(--semantic-dimension-spacing-extra-small);
  height:        var(--semantic-dimension-sizing-medium);
  font-size:     var(--semantic-typography-font-sizes-extra-small);
  border-radius: var(--semantic-border-radii-extra-small);
}

/* ── Medium (default) ── */
.btn--md {
  padding:       var(--semantic-dimension-spacing-extra-small) var(--semantic-dimension-spacing-small);
  height:        var(--semantic-dimension-sizing-large);
  font-size:     var(--semantic-typography-font-sizes-small);
  border-radius: var(--semantic-border-radii-small);
}

/* ── Large ── */
.btn--lg {
  padding:       var(--semantic-dimension-spacing-small) var(--semantic-dimension-spacing-medium);
  height:        var(--semantic-dimension-sizing-extra-large);
  font-size:     var(--semantic-typography-font-sizes-medium);
  border-radius: var(--semantic-border-radii-medium);
}
```

### Part 3 — Focus ring (mandatory accessibility)

Keyboard focus must be visible. Use the `action` border of the corresponding role as the outline:

```css
/* Focus ring — applies to all interactive elements */
:focus-visible {
  outline:        2px solid var(--semantic-color-interface-function-primary-action-border);
  outline-offset: 2px;
}

/* For feedback elements (e.g., clickable alert) */
.alert:focus-visible {
  outline-color: var(--semantic-color-interface-feedback-info-secondary-normal-border);
}
```

### Part 4 — Input with validation states

```css
/* ── Base ── */
.input {
  background:    var(--semantic-color-brand-ambient-contrast-deep-positive-background);
  color:         var(--semantic-color-text-body);
  border:        1px solid var(--semantic-color-brand-ambient-neutral-mid-border);
  border-radius: var(--semantic-border-radii-extra-small);
  padding:       var(--semantic-dimension-spacing-extra-small) var(--semantic-dimension-spacing-small);
  font-size:     var(--semantic-typography-font-sizes-small);
  width:         100%;
}

/* ── Focus ── */
.input:focus-visible {
  border-color: var(--semantic-color-interface-function-primary-action-border);
  outline:      none;
}

/* ── Error ── */
.input--error      { border-color: var(--semantic-color-interface-feedback-danger-secondary-normal-border); }
.input__error-msg  { color: var(--semantic-color-text-danger_default); font-size: var(--semantic-typography-font-sizes-extra-small); }

/* ── Success ── */
.input--success    { border-color: var(--semantic-color-interface-feedback-success-secondary-normal-border); }

/* ── Disabled ── */
.input:disabled {
  background:   var(--semantic-color-interface-function-disabled-normal-background);
  color:        var(--semantic-color-interface-function-disabled-normal-txt-on);
  border-color: var(--semantic-color-interface-function-disabled-normal-border);
  cursor:       not-allowed;
}
```

---

## Now you try

Build a **Badge** component with the following specs:

| Variant | Semantic source | Use |
|---------|----------------|-----|
| `info` | `feedback.info.default.normal` | Informational badges |
| `success` | `feedback.success.default.normal` | Confirmation, positive |
| `warning` | `feedback.warning.default.normal` | Caution |
| `danger` | `feedback.danger.default.normal` | Error, critical |
| `brand` | `brand.branding.first.default` | Brand highlight |

**Requirements:**
- Each variant uses `background` + `txtOn` from the same token (guaranteed pair)
- Border uses the `secondary` variant of the corresponding feedback type
- `brand` uses `border` from the same branding token
- `padding` and `border-radius` via dimensional tokens

**Expected result (example for `info`):**

```css
.badge--info {
  background:   var(--semantic-color-interface-feedback-info-default-normal-background);
  color:        var(--semantic-color-interface-feedback-info-default-normal-txt-on);
  border:       1px solid var(--semantic-color-interface-feedback-info-secondary-normal-border);
  padding:      var(--semantic-dimension-spacing-micro) var(--semantic-dimension-spacing-extra-small);
  border-radius: var(--semantic-border-radii-circular);
  font-size:    var(--semantic-typography-font-sizes-extra-small);
}
```

---

## Checkpoint

By the end of this tutorial you should know:

- [ ] Use the `{variant}.{state}.{property}` model to find any interface token
- [ ] Map token states to CSS pseudo-classes correctly
- [ ] Use dimensions and typography via tokens instead of hardcoded values
- [ ] Implement an accessible focus ring using the `action` border token
- [ ] Always use the `background` + `txtOn` pair from the same token — never mix
- [ ] For feedback: `default` for backgrounds, `secondary` for borders and icons

---

## Next step

[N3-03 · Dark mode by design](./03-dark-mode-por-construcao.md)

You built a correct component. But does it work in dark mode? Spoiler: if you used only Semantic tokens, the answer is yes — and you will understand exactly why.

---

## References

- Full reference of variants and states: [02-component-variants.md](../../05-components-theory/02-component-variants.md)
- Dimension scale: [03-spacing-sizing.md](../../03-visual-foundations/03-spacing-sizing.md)
- Opacity system: [05-opacity.md](../../03-visual-foundations/05-opacity.md)
