---
level: n1
id: N1-01
title: "What are design tokens and why do they exist"
prerequisites: []
duration: "8 min"
lang: en
---

# N1-01 · What are design tokens and why do they exist

## Context

Before you start using Aplica DS, there is a question every designer asks sooner or later: "Why can't I just grab the brand color and apply it directly?"

The short answer is: you can. But then what happens when the brand changes? When the client wants a dark mode? When the same component needs to work across four different products?

Tokens exist to solve exactly that problem — and understanding the problem makes the system much easier to use.

---

## Concept

### The problem: brand color doesn't exist in the singular

Imagine you are designing a primary button. You pick the brand blue — let's say `#2563EB`. All good.

Now the mobile team needs the same button. They copy `#2563EB`. The web team copied it too. The email marketing team uses it as well. Three products, three teams, one hex value repeated across hundreds of files and components.

Weeks later, the client decides to change the blue to `#1D4ED8`.

You already know what happens.

### The solution: a name with intent

Instead of copying the value, you create a **name that describes the purpose**:

```
"background color of the primary button in its default state"
```

That name — the token — is what components use. The value behind it (`#2563EB`) lives in a single place: the design system. When the client changes the blue, you update the system once. Every component across every product, on every platform, updates automatically.

### A token is not just a color

Tokens work for any style decision:

| What you decided | Without tokens | With tokens |
|-----------------|---------------|-------------|
| Primary button background | `#2563EB` in 47 places | `semantic.color.interface.function.primary.normal.background` in 1 place |
| Spacing between sections | `24px` in 83 places | `semantic.dimension.spacing.medium` in 1 place |
| Card border radius | `8px` in 31 places | `semantic.border.radii.medium` in 1 place |
| Heading font | `"Inter", 700, 24px` in 65 places | `semantic.typography.fontSizes.large` in 1 place |

The logic is always the same: **name the intent, centralize the value**.

### What you gain by using tokens

**Multi-brand without rework.** Product A's primary button has Product A's color. Product B's primary button has Product B's color. The same component, the same token — different values resolved by the system.

**Automatic dark mode.** When the `primary button background` token is defined, the system already knows which value to use in dark mode. You don't need to create a dark version of the component — it already exists.

**Built-in accessibility.** The system automatically calculates whether text on top of that color has sufficient contrast. You don't need to check manually.

**Real consistency.** Two designers on two different teams, using the same token, always arrive at the same visual result — even if they have never spoken to each other.

---

## Guided example

### How a token works in practice

Consider this button:

```
Appearance: blue background, white text, dark blue border
State: default (the user is not interacting with it)
```

In the token system, this is described as:

```
semantic.color.interface.function.primary.normal.background  → blue background
semantic.color.interface.function.primary.normal.txtOn       → white text
semantic.color.interface.function.primary.normal.border      → dark blue border
```

Each part of the name has a meaning:
- `semantic` — it is a purpose token (not a raw palette value)
- `color` — it is a color decision
- `interface.function` — it is a UI element with a function
- `primary` — it is the primary role (the most important CTA)
- `normal` — it is the default state
- `background` — it is the specific property

When the user hovers over the button, a different state kicks in:

```
semantic.color.interface.function.primary.action.background  → slightly darker blue background
```

You don't need to decide "how much darker" — the system already calculated that.

---

## Try it yourself

Look at any component in your current project. Identify:

1. What is its main background color?
2. What is the text color on top of that background?
3. Does this component have a hover or pressed state? How does the color change?

Now try to describe each of those decisions in words, without using a hex value:

- "Background of component X in its default state"
- "Text on top of the background of component X"
- "Background of component X when the user interacts with it"

If you managed to describe it that way, you are already thinking in tokens.

---

## Checkpoint

By the end of this tutorial you should know:

- [ ] Why copying hex values directly creates maintenance problems
- [ ] What a token is: a name that describes an intent, not a value
- [ ] Why dark mode, multi-brand, and accessibility are easier with tokens
- [ ] The basic structure of a token name (`semantic.color.interface.function...`)

---

## Next step

[N1-02 · The color vocabulary](./02-vocabulario-de-cores.md)

Now that you understand what tokens are, the next step is learning the vocabulary: which color categories exist, what each one is for, and how to find the right token for each situation in Figma.

---

## References

- Aplica DS vision and philosophy: [01-aplica-ds-vision.md](../../00-overview/01-aplica-ds-vision.md)
- Token architecture (technical depth): [01-token-architecture.md](../../01-design-tokens-fundamentals/01-token-architecture.md)
