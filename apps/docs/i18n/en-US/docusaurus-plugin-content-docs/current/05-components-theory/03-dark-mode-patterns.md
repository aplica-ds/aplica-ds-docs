---
title: "Dark Mode Patterns"
lang: en
---

# Dark Mode Patterns

## Premise

In Aplica DS, dark mode is not a second manually designed palette — it is a mathematical property of the color system. The engine generates light and dark as symmetric inversions of the same OKLCh scale. For those building components, this has a fundamental implication:

**If the component uses Semantic tokens, dark mode works without any extra CSS.**

This document explains the inversion mechanism, what the system does automatically, what requires manual attention, and the anti-patterns to avoid.

---

## How Dark Mode Works in the System

### Scale Inversion

Each color palette has 19 levels (10–190). In light mode, level 10 is the lightest and 190 is the darkest. In dark mode, the scale is inverted:

```
dark[level] = light[200 - level]

Examples:
  dark[10]  = light[190]  ← dark starts with the darkest tone
  dark[100] = light[100]  ← the base color (level 100) remains identical
  dark[190] = light[10]   ← dark ends with the lightest tone
```

Level 100 is the only one that does not change — it is the color declared in the theme config.

### Chroma Reduction

In addition to the lightness inversion, dark mode slightly reduces color saturation. The default multiplier is `darkModeChroma: 0.85` — 15% less saturated than light mode.

**Why:** Very vibrant colors on dark backgrounds cause visual fatigue and halation (perceptual chromatic aberration). Chroma reduction preserves brand identity while improving readability in low-light environments.

The multiplier is configurable per theme:

```javascript
// In the theme's *.config.mjs
options: {
  darkModeChroma: 0.75  // softer than the default
  // darkModeChroma: 1.0  // identical to light mode (not recommended)
}
```

### Borders in Dark Mode

In light mode, borders are generated with darker tones than the surface. In dark mode, the direction reverses — borders are lighter than the surface. The offset is maintained by the engine so that visibility is equivalent in both modes.

---

## What the System Does Automatically

When the theme is switched via the `data-theme` attribute, CSS resolves automatically:

| Element | Automatic behavior |
|---------|-------------------|
| All Semantic colors | Assume the new theme values |
| Interface background | Inverts lightness via scale inversion |
| txtOn (text on surface) | Recalculated to maintain WCAG contrast |
| Borders | Direction inverted, maintaining visibility |
| Opacity | Unchanged — raw values are the same |
| Dimensions, spacing, typography | Unchanged — orthogonal to color mode |

### What this means for components

A component using only Semantic tokens requires no dark mode logic whatsoever:

```css
/* This CSS works in both light AND dark mode without modification */
.card {
  background:    var(--semantic-color-brand-ambient-contrast-base-positive-background);
  color:         var(--semantic-color-text-body);
  border:        1px solid var(--semantic-color-brand-ambient-neutral-low-border);
  border-radius: var(--semantic-border-radii-medium);
  padding:       var(--semantic-dimension-spacing-medium);
}

.card__title {
  color: var(--semantic-color-text-title);
}

.card__cta {
  background: var(--semantic-color-interface-function-primary-normal-background);
  color:      var(--semantic-color-interface-function-primary-normal-txt-on);
}
```

Switching the theme in HTML is sufficient:

```html
<!-- Light mode -->
<html data-theme="aplica_joy-light-positive">

<!-- Dark mode -->
<html data-theme="aplica_joy-dark-positive">
```

```javascript
// Switch to dark mode — no additional logic needed
document.documentElement.setAttribute('data-theme', 'aplica_joy-dark-positive');
```

---

## Theme Switching with System Preference

To respect the user's OS preference, use `prefers-color-scheme` only to set the initial attribute — never to manually override tokens:

```javascript
// Detect OS preference and set initial theme
function applySystemTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = prefersDark ? 'aplica_joy-dark-positive' : 'aplica_joy-light-positive';
  document.documentElement.setAttribute('data-theme', theme);
}

// Apply on load
applySystemTheme();

// React to real-time changes
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', applySystemTheme);
```

If the user can choose the theme manually (UI toggle), persist their preference over the system preference:

```javascript
function applyTheme(mode) {
  const theme = `aplica_joy-${mode}-positive`;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('preferred-theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('preferred-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else {
    applySystemTheme();
  }
}
```

---

## Surface Negative — The Second Dimension

In addition to dark mode (lightness dimension), the system has the **negative surface** — an orthogonal inversion analogous to dark mode, but operating within the same mode:

```
light + positive  → light background, colors on the normal scale
light + negative  → light background with inverted scale (like a "photographic negative")
dark  + positive  → dark background, standard dark scale
dark  + negative  → dark background with additional inversion (rare)
```

The negative surface is useful for inverted banners, highlight sections, or elements that need immediate contrast without switching to dark mode:

```html
<section data-theme="aplica_joy-light-negative">
  <!-- This block uses the surface inversion even within a light page -->
</section>
```

The Semantic tokens are the same — only the resolved values change, because the Brand → Mode → Surface pipeline selects the `surface/negative.json` file.

---

## Icons and SVGs in Dark Mode

Icons using `currentColor` automatically inherit the color from the parent text token:

```css
/* The icon assumes the text color — works in both modes */
.icon {
  color: currentColor; /* default for inline SVG */
}

/* Button with icon — icon inherits the button's txt-on */
.btn-primary {
  color: var(--semantic-color-interface-function-primary-normal-txt-on);
}
.btn-primary .icon {
  /* currentColor = button's txt-on automatically */
}
```

For icons that need a color independent of the parent text:

```css
.icon--brand {
  color: var(--semantic-color-brand-branding-first-default-background);
}

.icon--muted {
  color: var(--semantic-color-text-muted);
}
```

**Avoid SVGs with hardcoded `fill` or `stroke` in hex** — they do not respond to dark mode.

---

## Images and Media

The engine does not control images — they are the component's responsibility. Recommended patterns:

### Legibility overlay

Use opacity tokens to guarantee text legibility over images in both modes:

```css
.hero {
  position: relative;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  /* Dark overlay for light text over image */
  background: var(--semantic-opacity-color-grayscale-super-translucid);
}

.hero__title {
  /* Text always over the overlay — contrast guaranteed */
  color: var(--semantic-color-brand-ambient-contrast-deep-positive-background);
}
```

### Images that adapt to the mode

For illustrations or images with both light and dark versions, use `picture` with media query:

```html
<picture>
  <source 
    srcset="illustration-dark.svg" 
    media="(prefers-color-scheme: dark)" />
  <img src="illustration-light.svg" alt="..." />
</picture>
```

Or via CSS when the theme is controlled by an attribute:

```css
[data-theme*="-light-"] .illustration--dark { display: none; }
[data-theme*="-dark-"] .illustration--light { display: none; }
```

---

## Shadows and Elevation in Dark Mode

In light mode, shadows are dark over a light background. In dark mode, near-pure shadows are visually "heavy" — they lose impact on dark backgrounds because the contrast is lower.

The engine handles this via depth tokens and Foundation composite elevation styles. The styles already have the correct values for each mode.

If you need a manual shadow, use reduced opacity in dark mode:

```css
.card {
  /* Light mode: visible dark shadow */
  box-shadow:
    0 var(--semantic-depth-spread-near)px
    var(--semantic-depth-spread-distant)px
    var(--semantic-opacity-color-grayscale-semi-translucid);
}

/* Dark mode: shadow with less opacity to not "smother" the component */
[data-theme*="-dark-"] .card {
  box-shadow:
    0 var(--semantic-depth-spread-near)px
    var(--semantic-depth-spread-distant)px
    var(--semantic-opacity-color-grayscale-super-transparent);
}
```

When possible, prefer Foundation composite elevation styles — they already encapsulate this adjustment.

---

## Anti-Patterns

### Hardcoded hex in components

```css
/* WRONG — does not respond to dark mode */
.badge {
  background: #D7F6CB;
  color: #1a1a1a;
}

/* CORRECT */
.badge {
  background: var(--semantic-color-interface-feedback-success-default-normal-background);
  color:      var(--semantic-color-interface-feedback-success-default-normal-txt-on);
}
```

### @media prefers-color-scheme with manual values

```css
/* WRONG — duplicates logic the system already resolves */
.card {
  background: #ffffff;
  color: #1a1a1a;
}

@media (prefers-color-scheme: dark) {
  .card {
    background: #1a1a1a;
    color: #ffffff;
  }
}

/* CORRECT — the token resolves both cases */
.card {
  background: var(--semantic-color-brand-ambient-contrast-deep-positive-background);
  color:      var(--semantic-color-text-body);
}
```

### Mixing internal layer tokens for "manual adjustment"

```css
/* WRONG — brand.* is an internal layer, does not respond correctly to dark mode */
.btn {
  background: var(--brand-branding-first-100-background);
}

/* CORRECT — Semantic already encapsulates the mode logic */
.btn {
  background: var(--semantic-color-interface-function-primary-normal-background);
}
```

### Creating custom CSS variables with hex for "convenience"

```css
/* WRONG — the local variable does not change with the theme */
:root {
  --my-primary-color: #C40145;
}

.btn { background: var(--my-primary-color); }

/* CORRECT — reference the canonical token */
.btn { background: var(--semantic-color-interface-function-primary-normal-background); }
```

---

## Dark Mode Checklist for Components

Before publishing a new component or variant, verify:

1. **No hardcoded hex** in the component's CSS
2. **No `@media prefers-color-scheme`** with manual color values
3. **SVGs use `currentColor`** or Semantic tokens — no fixed `fill`/`stroke` in hex
4. **Background + txtOn pair** from the same token on all colored surfaces
5. **Images with overlay** use an opacity token, not a hardcoded color
6. **Shadows use** Foundation elevation styles or `semantic.opacity` tokens
7. **Test all 4 base themes:** light/positive, dark/positive, light/negative, dark/negative

---

## References

- Scale inversion mechanism: [01-colors.md](../03-visual-foundations/01-colors.md#dark-mode)
- OKLCh pipeline: [06-mathematics-and-algorithms.md](../03-visual-foundations/06-mathematics-and-algorithms.md)
- Token contract: [01-component-token-contract.md](./01-component-token-contract.md)
- Variants and states: [02-component-variants.md](./02-component-variants.md)
- Output formats and theme switching: [05-output-formats.md](../04-theme-engine/05-output-formats.md)
- Opacity system: [05-opacity.md](../03-visual-foundations/05-opacity.md)
- Depth and elevation: [04-depth-elevation.md](../03-visual-foundations/04-depth-elevation.md)
- darkModeChroma configuration: [03-configuration-guide.md](../04-theme-engine/03-configuration-guide.md)
