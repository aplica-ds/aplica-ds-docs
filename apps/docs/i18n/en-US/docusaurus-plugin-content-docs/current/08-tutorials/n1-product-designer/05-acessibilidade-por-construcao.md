---
level: n1
id: N1-05
title: "Accessibility by design"
prerequisites: ["N1-02"]
duration: "8 min"
lang: en
---

# N1-05 · Accessibility by design

## Context

Checking contrast manually is tedious and error-prone. You pick a color, open the contrast checker, check the ratio, adjust, check again — for every combination of background and text.

In Aplica DS, that check is not needed for the vast majority of cases. The system calculated the contrast for you. This tutorial explains the one rule you need to follow to make it work.

---

## Concept

### The background + txtOn pair

Every color token that represents a surface comes with two companion tokens:
- **`background`** — the surface's background color
- **`txtOn`** — the text color that guarantees adequate contrast on that background
- **`border`** — the border color derived from that surface

The system automatically calculated which text color passes WCAG AA level (minimum contrast ratio of 4.5:1) on that specific background. You do not need to check — the math has already been done.

**The rule:** Always use the `txtOn` from the same token as the `background`.

```
semantic.color.interface.function.primary.normal.background  →  button background
semantic.color.interface.function.primary.normal.txtOn       →  text on that background
                                          ↑ same chain
```

### What never to do

**Mixing tokens from different families:**

```
❌ background from: interface.function.primary.normal
   txtOn from:      interface.function.secondary.normal
   (contrast is not guaranteed — these two families were not calculated together)

✅ background from: interface.function.primary.normal
   txtOn from:      interface.function.primary.normal
   (same token — contrast guaranteed by the system)
```

**Placing Foundation text on top of a different Semantic background:**

```
❌ background: semantic.color.brand.branding.first.default.background (brand color)
   text:       foundation.txt.body (calculated for neutral backgrounds)
   (nobody guaranteed that body text has contrast on that brand background)

✅ background: semantic.color.brand.branding.first.default.background
   text:       semantic.color.brand.branding.first.default.txtOn
   (system guaranteed contrast for this specific pair)
```

### What about plain text tokens — `semantic.color.text.*`?

Plain text tokens (`text.title`, `text.body`, `text.muted`, `text.label`) were calculated for use on the system's neutral backgrounds — `ambient.contrast.base` and `ambient.contrast.deep`. They are safe on the interface's default canvas.

If you place `text.body` on top of a brand color background, contrast is not guaranteed. Use the `txtOn` for that brand background instead.

---

## Guided example

### Success alert — accessible assembly

A banner that reads "Settings saved successfully."

| Element | Correct token | Why |
|---------|--------------|-----|
| Banner background | `feedback.success.default.normal.background` | Subtle success background |
| Main text | `feedback.success.default.normal.txtOn` | Contrast guaranteed on that background |
| Check icon | `feedback.success.secondary.normal.background` | Saturated green, visible |
| Left border | `feedback.success.secondary.normal.border` | Visual border emphasis |

**Common mistakes that look fine but do not guarantee accessibility:**

| ❌ Wrong | Why it's not safe |
|---------|------------------|
| Background `success.default` + text `text.body` | `text.body` was calculated for neutral backgrounds, not green |
| Background `success.default` + text `success.secondary.txtOn` | Different tokens — contrast not calculated together |
| Icon in hex `#22C55E` | Fixed value that won't change in dark mode |

### Disabled button — two correct patterns

When a control is disabled, you have two options:

**Option A — Disabled token** (preferred for individual buttons and controls):
```
background: interface.function.disabled.normal.background
txtOn:      interface.function.disabled.normal.txtOn
```
Contrast between this background and this text is guaranteed — the user can read the disabled button label.

**Option B — Opacity** (for entire disabled sections):
Reducing the opacity of a whole region via `semantic.opacity.raw.translucid` (50%). Works for large blocks, but **should not be used on small text** — readability may be compromised depending on the background.

---

## Try it yourself

Given the component below, identify which color combinations are accessible and which are not:

> **Component:** Product card with a promotion badge

| Element | Color used | Accessible? |
|---------|-----------|-------------|
| Card background | `brand.ambient.contrast.base.positive.background` | — |
| Product title | `text.title` | — |
| Description | `text.body` | — |
| "PROMO" badge — background | `product.promo.default.default.background` | — |
| "PROMO" badge — text | `text.body` | — |
| Highlighted price | `brand.branding.first.default.background` (brand color used as colored text) | — |

**Expected result:**

| Element | Accessible? | Fix |
|---------|------------|-----|
| Background + title | Yes | `text.title` was calculated for neutral backgrounds |
| Background + description | Yes | `text.body` was calculated for neutral backgrounds |
| Badge background + `text.body` | No | Use `product.promo.default.default.txtOn` |
| Price with brand color as text | Depends | Use `semantic.color.text.promo` (calculated for text use) |

---

## Checkpoint

By the end of this tutorial you should know:

- [ ] What the `background` + `txtOn` pair is and why it exists
- [ ] The rule: always use `txtOn` from the same token as the `background`
- [ ] Why `text.body` is not safe on all backgrounds
- [ ] When to use the `disabled` token vs opacity
- [ ] How to identify color combinations that break the contrast contract

---

## Next step

[N1-06 · Dark mode without effort](./06-dark-mode-sem-esforco.md)

You use the correct tokens, contrast is guaranteed. Now: what happens when the user activates dark mode? (Spoiler: nothing you need to do.)

---

## References

- Token contract and the bg+txtOn pair: [01-component-token-contract.md](../../05-components-theory/01-component-token-contract.md#the-background--txton-pair)
- Color system and accessibility: [01-colors.md](../../03-visual-foundations/01-colors.md)
- Opacity system: [05-opacity.md](../../03-visual-foundations/05-opacity.md)
