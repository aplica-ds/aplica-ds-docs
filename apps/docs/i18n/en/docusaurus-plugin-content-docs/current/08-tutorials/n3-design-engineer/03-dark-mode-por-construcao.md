---
level: n3
id: N3-03
title: "Dark mode by design"
prerequisites: ["N3-02"]
duration: "12 min"
lang: en
---

# N3-03 · Dark Mode by Design

## Context

Most dark mode systems require double the work: you write the light styles, then duplicate them with `@media (prefers-color-scheme: dark)` or a class selector, and keep both versions in sync forever.

In Aplica DS, dark mode is a property of the token system — not of the component's CSS. If the component uses only Semantic tokens, it works in dark mode without any extra lines of CSS. This tutorial explains the mechanism and shows how to diagnose the cases where that does not happen.

---

## Concept

### The inversion mechanism

Every palette has 19 levels (10–190). In light mode, 10 is the lightest and 190 the darkest. In dark mode, the scale is inverted mathematically:

```
dark[level] = light[200 - level]

dark[10]  = light[190]   ← dark starts with the darkest tone
dark[100] = light[100]   ← the base color does not change
dark[190] = light[10]    ← dark ends with the lightest tone
```

When you switch `data-theme="aplica_joy-dark-positive"`, the CSS resolves the same variables — but the values are already the dark mode ones, calculated at build time.

### What this means in practice

A component using `var(--semantic-color-interface-function-primary-normal-background)` automatically receives:
- In light: the lightness level corresponding to light mode
- In dark: the inverted level, with slightly reduced chroma (default: 85%)

**Zero extra CSS. Zero extra maintenance.**

### When this does NOT happen

Automatic dark mode breaks when the component contains any of these patterns:

| Anti-pattern | Why it breaks |
|-------------|---------------|
| Hardcoded hex (`#C40145`) | The value does not change with the theme |
| `@media (prefers-color-scheme: dark)` with manual values | Duplicates logic the system already resolves — and creates divergence |
| Reference to internal layer (`var(--brand-*)`) | The internal layer is not exposed for theme switching |
| Local CSS variable with hex (`--my-color: #fff`) | The local variable is not updated by theme switching |
| SVG with `fill` or `stroke` in hex | The attribute does not inherit the theme |

---

## Guided example

### Diagnosis: component that breaks in dark mode

```css
/* Product card — broken version */
.product-card {
  background: #ffffff;              /* ❌ does not change with theme */
  border:     1px solid #e0e0e0;   /* ❌ does not change with theme */
  color:      #1a1a1a;             /* ❌ does not change with theme */
}

.product-card__badge {
  background: #6BC200;             /* ❌ hardcoded */
  color:      #ffffff;             /* ❌ hardcoded */
}

@media (prefers-color-scheme: dark) {
  .product-card {
    background: #1a1a1a;           /* ❌ duplicates manual logic */
    color:      #ffffff;
  }
}
```

### Corrected version

```css
/* Product card — correct version */
.product-card {
  background: var(--semantic-color-brand-ambient-contrast-deep-positive-background);
  border:     1px solid var(--semantic-color-brand-ambient-neutral-low-border);
  color:      var(--semantic-color-text-body);
  border-radius: var(--semantic-border-radii-medium);
  padding:    var(--semantic-dimension-spacing-medium);
}

/* Dark mode works automatically — no @media needed */

.product-card__badge {
  background: var(--semantic-color-product-promo-default-default-background);
  color:      var(--semantic-color-product-promo-default-default-txt-on);
  padding:    var(--semantic-dimension-spacing-micro) var(--semantic-dimension-spacing-extra-small);
  border-radius: var(--semantic-border-radii-circular);
}
```

### Icons and SVGs

SVGs with hardcoded `fill` do not inherit the theme. The solution is `currentColor`:

```css
/* ❌ WRONG — fixed color in SVG */
.icon path { fill: #1a1a1a; }

/* ✅ RIGHT — inherits the parent text color */
.icon { color: currentColor; }
.icon path { fill: currentColor; }

/* For icon with semantic color independent of parent text */
.icon--brand { color: var(--semantic-color-brand-branding-first-default-background); }
```

### Theme switching and system preference

```javascript
// System preference — sets the initial theme
function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    return;
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute(
    'data-theme',
    `aplica_joy-${prefersDark ? 'dark' : 'light'}-positive`
  );
}

// React to real-time changes
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute(
        'data-theme',
        `aplica_joy-${e.matches ? 'dark' : 'light'}-positive`
      );
    }
  });
```

---

## Now you try

Analyze the component below and list **all problems** that cause dark mode to break. Then write the corrected version.

```css
/* Alert component — find the problems */
.alert {
  background: #EBF4FF;
  border-left: 3px solid #3B82F6;
  padding: 12px 16px;
  border-radius: 4px;
}

.alert__title {
  color: #1E3A5F;
  font-weight: 600;
  font-size: 14px;
}

.alert__body {
  color: #374151;
  font-size: 14px;
}

.alert__icon {
  fill: #3B82F6;
  width: 16px;
  height: 16px;
}

@media (prefers-color-scheme: dark) {
  .alert         { background: #1a2744; }
  .alert__title  { color: #93C5FD; }
  .alert__body   { color: #D1D5DB; }
  .alert__icon   { fill: #93C5FD; }
}
```

**Problems to identify:** 7 in total.

**Expected result (corrected version):**

```css
.alert {
  background:   var(--semantic-color-interface-feedback-info-default-normal-background);
  border-left:  3px solid var(--semantic-color-interface-feedback-info-secondary-normal-border);
  padding:      var(--semantic-dimension-spacing-extra-small) var(--semantic-dimension-spacing-small);
  border-radius: var(--semantic-border-radii-extra-small);
}

.alert__title {
  color:       var(--semantic-color-text-title);
  font-weight: var(--semantic-typography-font-weights-main-semibold-normal);
  font-size:   var(--semantic-typography-font-sizes-extra-small);
}

.alert__body {
  color:     var(--semantic-color-text-body);
  font-size: var(--semantic-typography-font-sizes-extra-small);
}

.alert__icon {
  color:  var(--semantic-color-interface-feedback-info-secondary-normal-background);
  fill:   currentColor;
  width:  var(--semantic-dimension-sizing-extra-small);
  height: var(--semantic-dimension-sizing-extra-small);
}

/* @media removed — dark mode works automatically via data-theme */
```

---

## Dark mode checklist for a component

Before publishing any component, verify:

- [ ] No hardcoded hex in CSS
- [ ] No `@media prefers-color-scheme` with manual color values
- [ ] SVGs use `currentColor` or tokens — no `fill`/`stroke` in hex
- [ ] `background` + `txtOn` pair from the same token on all colored surfaces
- [ ] Dimensions and typography via tokens (no loose `px` values)
- [ ] Shadows use opacity tokens or composed Foundation styles
- [ ] Tested in all 4 contexts: light/positive, dark/positive, light/negative, dark/negative

---

## Checkpoint

By the end of this tutorial you should know:

- [ ] Why dark mode is automatic when Semantic tokens are used
- [ ] Identify the 5 anti-patterns that break dark mode
- [ ] Fix a legacy component that uses hardcoded hex and `@media`
- [ ] Make SVGs respect the theme via `currentColor`
- [ ] Implement theme switching with system preference and `localStorage` persistence

---

## Next step

[N3-04 · Understanding the build pipeline](./04-pipeline-de-build.md)

You know how to build correct components. To complete the cycle, you need to understand what happens behind the scenes: how a change in the theme config propagates to the CSS the browser receives.

---

## References

- Dark mode patterns: [03-dark-mode-patterns.md](../../05-components-theory/03-dark-mode-patterns.md)
- Color system and scale inversion: [01-colors.md](../../03-visual-foundations/01-colors.md#dark-mode)
- Runtime theme switching: [05-output-formats.md](../../04-theme-engine/05-output-formats.md#runtime-theme-switching)
