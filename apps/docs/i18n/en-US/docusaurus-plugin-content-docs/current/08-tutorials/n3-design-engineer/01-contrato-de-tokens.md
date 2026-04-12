---
level: n3
id: N3-01
title: "The token contract — what the engine guarantees"
prerequisites: []
duration: "12 min"
lang: en
---

# N3-01 · The Token Contract

## Context

You are about to build a component — or review one that already exists. Before writing the first line of CSS, there is a more important question than "which token is right?": **what can I trust will remain stable?**

The token contract defines exactly that. It says what the engine guarantees, what it can change without notice, and what you should never do in a component's code. Ignoring this contract is the most common cause of components that break silently after an engine update.

---

## Concept

### The three consumer layers

From the perspective of someone writing components, the engine exposes three namespaces:

```
semantic.*    — The canonical layer. Always use this.
foundation.*  — Aliases for Semantic. Use when the shortcut already exists.
component.*   — Component-specific tokens (when available).
```

Everything below that — `brand.*`, `mode.*`, `surface.*` — are **internal layers**. They are not part of the public contract. Referencing an internal layer is like calling a private API: it may work today and break tomorrow without notice.

### The golden rule

```
Always use Semantic.
Use Foundation when a suitable alias already exists.
Never reference brand.*, mode.*, or surface.* in components.
```

### What Semantic guarantees

Any path that appears in `dist/` is part of the public contract. If the token is in the build, the engine guarantees it will only change with a major version bump.

```
semantic.color.interface.function.primary.normal.background
↓ in CSS
--semantic-color-interface-function-primary-normal-background
```

This path has been published. It will exist in the next minor version. If it needs to be renamed or removed, that is a **breaking change** — major version, CHANGELOG entry, deprecation period.

### What is NOT guaranteed

- Paths you invent (`--semantic-color-my-custom-color`)
- References to internal layers (`brand.*`)
- Hardcoded values that "match" a token (`#C40145` instead of `var(--semantic-...)`)

---

## Guided example

### Right vs wrong — three scenarios

**Scenario 1: Hardcoded color**

```css
/* ❌ WRONG — does not respond to theming, dark mode, multi-brand */
.badge { background: #D7F6CB; }

/* ✅ RIGHT — the value changes automatically with the theme */
.badge { background: var(--semantic-color-interface-feedback-success-default-normal-background); }
```

**Scenario 2: Reference to internal layer**

```css
/* ❌ WRONG — brand.* is an internal layer, not part of the contract */
.hero { background: var(--brand-branding-first-100-background); }

/* ✅ RIGHT — Semantic encapsulates the brand + mode + surface logic */
.hero { background: var(--semantic-color-brand-branding-first-default-background); }
```

**Scenario 3: Invented token in product CSS**

```css
/* ❌ WRONG — creates a namespace that conflicts with future builds */
:root { --semantic-color-my-color: #C40145; }
.btn  { background: var(--semantic-color-my-color); }

/* ✅ RIGHT — use only paths that exist in dist/ */
.btn  { background: var(--semantic-color-interface-function-primary-normal-background); }
```

### How to verify that a token exists in the build

Before using a token, confirm it is in the output:

```bash
# Check existence in CSS
grep "semantic-color-interface-function-primary" dist/css/*.css | head -3

# Check the semantic JSON structure
cat dist/json/aplica_joy-light-positive-semantic.json | python -m json.tool | grep -A2 "primary"
```

If the token does not appear in `dist/`, it does not exist in the contract — do not use it.

---

## Now you try

Given the CSS below, identify the problems and fix them:

```css
/* Component: Alert card */
.card-alert {
  background: #FEE6C2;                          /* hardcoded color */
  color: #1a1a1a;                               /* hardcoded color */
  border-left: 4px solid var(--warning-color);  /* invented token */
  padding: 16px;                                /* hardcoded value */
}

.card-alert__title {
  color: var(--brand-text-title);               /* internal layer */
  font-size: 14px;                              /* hardcoded value */
}
```

**Expected result after correction:**

```css
.card-alert {
  background: var(--semantic-color-interface-feedback-warning-default-normal-background);
  color:      var(--semantic-color-interface-feedback-warning-default-normal-txt-on);
  border-left: 4px solid var(--semantic-color-interface-feedback-warning-secondary-normal-border);
  padding:    var(--semantic-dimension-spacing-small);
}

.card-alert__title {
  color:     var(--semantic-color-text-title);
  font-size: var(--semantic-typography-font-sizes-extra-small);
}
```

> **Tip:** Whenever you see a hex or a loose number in component CSS, ask: "which token represents this intent?"

---

## Checkpoint

By the end of this tutorial you should know:

- [ ] Why to use `semantic.*` and not `brand.*` or `mode.*` in components
- [ ] When Foundation is appropriate (shortcut to Semantic when the alias exists)
- [ ] How to verify that a token path exists in the build before using it
- [ ] Why hardcoded hex breaks theming, dark mode, and multi-brand
- [ ] What a breaking change means in the engine context (token rename or removal = major version)

---

## Next step

[N3-02 · Building a component — variants, states, and sizes](./02-construindo-um-componente.md)

You know which tokens to use and that the contract is stable. Now let's build a complete component — with all variants and all states mapped to correct tokens.

---

## References

- Full token contract: [01-component-token-contract.md](../../05-components-theory/01-component-token-contract.md)
- Taxonomy and naming contract: canonical-taxonomy-and-naming-contract.md
- Output formats (where dist/ lives): [05-output-formats.md](../../04-theme-engine/05-output-formats.md)
