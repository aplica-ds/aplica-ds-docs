---
level: n1
id: N1-03
title: "Spacing and typography — the dimensional scale"
prerequisites: ["N1-01"]
duration: "10 min"
lang: en
---

# N1-03 · Spacing and typography — the dimensional scale

## Context

You are building a card. The padding looks right at 18px, but the designer next to you used 20px. The developer put 16px. Everyone went by eye — and now the product feels slightly inconsistent in every area. No one made a mistake. But the result feels wrong.

This tutorial explains how the system solves that problem once and for all, and why "inventing a spacing number" is the typographic equivalent of picking a hex value outside the palette.

---

## Concept

### The 4-point grid

Every spacing and dimension value in Aplica DS is a multiple of 4. This is not a preference — it is a structural rule.

Why 4? Because most screens render at multiples of 2 (retina) or 4 (layout grids). An 18px spacing on a retina screen produces an invisible fractional pixel — the layout feels "slightly off" even to someone who cannot say why.

With the 4pt grid, you can add any combination of values and the result stays aligned. The layout is predictable. The code is predictable. The alignment between Figma and implementation is exact.

### Sizes have names — they are not loose numbers

Instead of memorizing "the button padding is 16px," the system offers names with meaning:

| Name | Size | When to use |
|------|------|-------------|
| `nano` | 4px | Minimum gap between icon and text, visual separator |
| `micro` | 8px | Label padding, gap between very close items |
| `extraSmall` | 16px | Internal padding of buttons and form fields |
| `small` | 24px | Padding for moderate cards, gap between close blocks |
| `medium` | 32px | Standard spacing between elements on the page |
| `large` | 40px | Generous separation between related sections |
| `extraLarge` | 48px | Division between large product areas |
| `mega` | 56px | Drastic division, wide modals |
| `giga` | 88px | Minimum touch target (large buttons, accessibility) |
| `tera` | 144px | Hero sections, full-page separations |

**The practical rule:** To create visual hierarchy, go up one level. If the buttons in a section use `small` internally, the margin separating that section from the next should use `medium` or `large`. The level difference creates the perception of grouping — the eye understands what belongs together.

### Three densities: compact, normal, and spacious

The system provides three global scale variants:

| Variant | Character | Typical use |
|---------|-----------|-------------|
| **minor** | Compact | Dashboards, tools, dense interfaces with lots of information |
| **normal** | Balanced | The default scale — apps, marketing, general interfaces |
| **major** | Spacious | Editorial content, long-form reading, high-impact landing pages |

You do not change token names to switch density — the entire system recalibrates. A `small` in `minor` will have a different size than a `small` in `major`, but it is still "the small spacing." The meaning is portable.

---

### Typography: styles, not loose sizes

The same principle applies to typography. The system does not offer "36px Bold" directly — it offers **composite styles** that already include size, weight, line height, and font family together.

This matters because a wrong line height breaks the page's vertical rhythm as silently as an 18px spacing. The system resolves this for you.

#### The five style categories

**Heading — Titles**
For page titles, section headings, and card highlights. The line height is proportional, designed so that multiple lines sit well together without crowding.

Examples: `title_1` (largest, H1), `title_2` (H2), `title_3` (H3), `title_4` (H4), `title_5` (smallest, H5/H6)

---

**Display — Maximum impact**
For hero sections, banners, and high-impact headlines. Large sizes, strong weights. Do not use in page body — it breaks the hierarchy.

Examples: `display_1`, `display_2`, `display_3`

---

**Content — Reading**
For paragraphs, descriptions, lists, and labels. The line height is generous — designed for comfort in long texts.

Examples: `body_large`, `body`, `body_small`, `label`, `quote`

---

**Action — Clickable**
For text inside interactive controls: buttons, tabs, links, chips. The line height is compact (the space around the text comes from the component's padding, not the line height).

Examples: `action.strong.small`, `action.regular.medium`, `link.medium`

---

**Code — Technical**
For code snippets, configuration keys, technical data. Uses a monospaced font.

Examples: `code.small`, `code.medium`

---

### The rule against mixing

Each category was designed for its context. Using `title_1` inside a button will produce an enormous line height and the component will break visually. Using `body` as a section title will produce a lack of hierarchy.

**If you are unsure which style to use, the question is:** "Is this text for reading, for hierarchy, for action, or for impact?" The answer points directly to the right category.

---

## Guided example

### Building a notification card

Let's map the spacing and typography tokens of a simple card:

```
┌─────────────────────────────────┐
│  Payment reminder               │  ← title: title_5
│  Your bill is due in 2 days.    │  ← body: body_small
│  [View bill]                    │  ← button: action.strong.small
└─────────────────────────────────┘
```

| Element | Spacing token | Typography token |
|---------|--------------|-----------------|
| Card internal padding | `small` (24px) | — |
| Space between title and body | `nano` (4px) | — |
| Space between body and button | `micro` (8px) | — |
| Title text | — | `title_5` |
| Body text | — | `body_small` |
| Button text | — | `action.strong.small` |

Result: a card that looks correct in any theme, at any scale, in light or dark mode — without inventing a single numeric value.

---

## Try it yourself

You are designing a deletion confirmation modal:

```
┌─────────────────────────────────────┐
│  Delete account?                    │  ← large title
│                                     │
│  This action cannot be undone.      │  ← warning body text
│  All your data will be              │
│  permanently removed.               │
│                                     │
│        [Cancel]  [Delete]           │  ← two buttons
└─────────────────────────────────────┘
```

Map the spacing and typography tokens for:
1. The modal's internal padding
2. The space between the title and the warning text
3. The space between the warning text and the buttons
4. The typographic style of the title
5. The typographic style of the warning text
6. The typographic style of the buttons

**Expected result:**

| Element | Suggested token | Rationale |
|---------|----------------|-----------|
| Modal padding | `medium` (32px) | Modal is a highlighted container — generous breathing room |
| Space title → text | `small` (24px) | Close relationship (same context) but with clear separation |
| Space text → buttons | `medium` (32px) | Action separation — visual hierarchy between information and decision |
| Title style | `title_3` or `title_4` | Section heading, not a full-page title |
| Warning style | `body` | Reading text, paragraph |
| Button style | `action.strong.small` | Interactive control, compact line height |

---

## Checkpoint

By the end of this tutorial you should know:

- [ ] Why all spacings are multiples of 4 (and what happens when they are not)
- [ ] The spacing scale names: nano → micro → extraSmall → small → medium → large
- [ ] The difference between the three densities (minor / normal / major) and when each is used
- [ ] The five typographic categories: Heading, Display, Content, Action, Code
- [ ] The rule against mixing categories — each style was made for its context
- [ ] How to map a component's tokens without inventing any value

---

## Next step

[N1-05 · Accessibility by design](./05-acessibilidade-por-construcao.md)

You already know how to use color, spacing, and typography tokens. The next step is understanding why using the right tokens is not just about consistency — it is what ensures your interface is accessible to all users.

---

## References

- Spacing scale: [03-spacing-sizing.md](../../03-visual-foundations/03-spacing-sizing.md)
- Typography system: [02-typography.md](../../03-visual-foundations/02-typography.md)
- Dimension layer: [06-dimension-layer.md](../../02-token-layers/06-dimension-layer.md)
