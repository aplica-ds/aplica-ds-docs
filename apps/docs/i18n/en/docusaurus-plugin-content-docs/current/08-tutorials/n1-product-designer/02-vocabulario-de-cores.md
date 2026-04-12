---
level: n1
id: N1-02
title: "The color vocabulary — Semantic and Foundation"
prerequisites: ["N1-01"]
duration: "12 min"
lang: en
---

# N1-02 · The color vocabulary

## Context

You already understand that tokens name intentions. Now the practical challenge: the system has dozens of color tokens. How do you find the right one without reading the entire documentation before every decision?

The answer is vocabulary. Just as a language has nouns, verbs, and adjectives — the token system has categories. When you learn the categories, 90% of decisions become obvious.

---

## Concept

### The four color categories

Every color token in the system belongs to one of these four categories. Learning the purpose of each is the main cognitive shortcut the system offers.

---

#### 1. Brand — brand identity

**Purpose:** For elements that communicate the brand's visual identity. Hero areas, institutional highlights, strong branding elements.

**Key question:** "Is this element here to communicate who the brand is?"

| Token (simplified) | When to use |
|-------------------|------------|
| `brand.branding.first.default` | Main brand color — brand CTA, hero |
| `brand.branding.second.default` | Second brand color — secondary highlights |
| `brand.branding.first.lowest` | Very subtle version of the color — background of a quiet section |
| `brand.branding.first.high` | Dark version of the color — emphasis text on light background |

**Example:** The hero area of a landing page with the brand gradient. The institutional banner. The app icon.

---

#### 2. Interface Function — actions and controls

**Purpose:** For elements the user interacts with — buttons, links, toggles, checkboxes. Anything the user can click, tap, or activate.

**Key question:** "Will the user interact with this element?"

| Token (simplified) | When to use |
|-------------------|------------|
| `interface.function.primary.normal` | Primary button — the most important action on screen |
| `interface.function.secondary.normal` | Secondary button — supporting action |
| `interface.function.link.normal` | Links and text-based actions |
| `interface.function.active.normal` | Active tab, selected item |
| `interface.function.disabled.normal` | Unavailable control |

Each role has three states: `normal` (default), `action` (hover/pressed), `active` (selected). The system defines all three automatically.

**Example:** The "Continue" button on a form. The "See more" link. The settings toggle. The selected tab in a navigation.

---

#### 3. Interface Feedback — system messages

**Purpose:** To communicate the result of a system action — alerts, error messages, confirmations, warnings. It is not about aesthetics — it is about functional communication.

**Key question:** "Is this element communicating something that happened in the system?"

| Type | When to use |
|------|------------|
| `feedback.info.default` | Informational messages, tips, contextual help |
| `feedback.success.default` | Confirmation of a successful action |
| `feedback.warning.default` | Alerts, situations that deserve attention |
| `feedback.danger.default` | Errors, destructive actions, critical situations |

Each type has two variants:
- `default` — subtle version, for alert and banner backgrounds
- `secondary` — saturated version, for borders and icons (more prominent)

**Example:** Banner "Registration successful!" (success). Toast "Warning: session expiring in 5 minutes" (warning). Message "Incorrect password" below a field (danger).

---

#### 4. Foundation — the simplified vocabulary

**Purpose:** Cognitive shortcuts for the most commonly used tokens day-to-day. Instead of writing out the full Semantic path, you use a short alias.

**Key question:** "Is there a simpler name for what I need?"

| Foundation | Resolves to (full Semantic) |
|-----------|----------------------------|
| `foundation.bg.primary` | Main interface background |
| `foundation.bg.weak` | Subtle background, lightly contrasted canvas |
| `foundation.bg.brand.first.primary` | Background with brand color (low intensity) |
| `foundation.txt.title` | Text color for headings |
| `foundation.txt.body` | Text color for body copy |
| `foundation.txt.muted` | Secondary/disabled text color |
| `foundation.bg.disabled` | Background for disabled elements |

**Usage rule:** If a Foundation alias covers your case, use it. If it doesn't (the case is too specific), use the Semantic token directly.

> **Foundation does not replace Semantic — it is a shortcut for the most common cases.** A library component always uses the full Semantic. A designer building a screen can use Foundation for speed.

---

### How to decide which category to use

```
Does the element have an interaction function (button, link, toggle)?
    └─ YES → Interface Function

Is the element communicating a system result (alert, error, success)?
    └─ YES → Interface Feedback

Is the element communicating brand identity?
    └─ YES → Brand

Do I need a simple shortcut for a common background, text, or border?
    └─ YES → Foundation (if the alias exists)
```

If none of the categories above clearly fits — you are probably trying to create a custom product token. That is possible, but it has a cost. Talk to the DS team first.

---

## Guided example

### Building a notification card

Imagine a card that reads: "Your order has been approved!"

**Color decisions for each element:**

| Card element | Category | Token |
|-------------|----------|-------|
| Card background | Foundation | `foundation.bg.weak` (subtle, non-distracting) |
| Checkmark icon | Feedback | `interface.feedback.success.secondary.normal.background` (saturated green) |
| Main text | Foundation | `foundation.txt.body` |
| Date text (subtle) | Foundation | `foundation.txt.muted` |
| "View order" button | Interface Function | `interface.function.primary.normal.*` |
| Card border | Feedback | `interface.feedback.success.secondary.normal.border` |

Result: a card consistent with the system's vocabulary, that works in any theme, with automatic dark mode.

---

## Try it yourself

Given the layout below, identify the correct category for each element:

> **Screen:** Deletion confirmation modal
> - Alert icon (orange triangle)
> - Title: "Delete this item?"
> - Text: "This action cannot be undone."
> - "Cancel" button
> - "Delete" button (destructive action)
> - Modal background

**Expected result:**

| Element | Category | Reason |
|---------|----------|--------|
| Alert icon | Feedback (warning.secondary) | Communicates a situation that deserves attention |
| Title | Foundation (txt.title) | Primary hierarchy text |
| Descriptive text | Foundation (txt.body) | Standard body copy |
| "Cancel" button | Interface Function (secondary) | Supporting action, not the primary one |
| "Delete" button | Interface Function (danger via feedback) | Destructive action |
| Modal background | Foundation (bg.primary) | Main interface canvas |

---

## Checkpoint

By the end of this tutorial you should know:

- [ ] The four color categories and the purpose of each
- [ ] The key question that leads to the right category: "Does the user interact? Is it feedback? Is it brand?"
- [ ] The difference between Foundation (shortcut) and Semantic (source of truth)
- [ ] When to use `default` vs `secondary` in feedback tokens
- [ ] How to map the elements of a screen to the correct categories

---

## Next step

[N1-05 · Accessibility by design](./05-acessibilidade-por-construcao.md)

You have the vocabulary. Before learning how to apply it in Figma, there is a fundamental rule that makes every color decision automatically accessible — and it is much simpler than it sounds.

---

## References

- Full color system: [01-colors.md](../../03-visual-foundations/01-colors.md)
- Foundation layer: [05-foundation-layer.md](../../02-token-layers/05-foundation-layer.md)
- Semantic layer: [04-semantic-layer.md](../../02-token-layers/04-semantic-layer.md)
