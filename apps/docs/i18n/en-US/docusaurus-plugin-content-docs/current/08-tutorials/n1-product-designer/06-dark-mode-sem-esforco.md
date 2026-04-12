---
level: n1
id: N1-06
title: "Dark mode without effort"
prerequisites: ["N1-02", "N1-05"]
duration: "8 min"
lang: en
---

# N1-06 · Dark mode without effort

## Context

Dark mode is usually treated as a separate project: you design the light version, finish it, and then start all over again for dark — manually choosing each alternate color, re-checking every contrast ratio, hoping the two versions don't diverge over time.

In Aplica DS, dark mode is not a separate project. It is a mathematical property of the system. When you use the correct tokens, dark mode already exists — you just need to know where to check.

---

## Concept

### What happens when the theme changes

Imagine the token `interface.function.primary.normal.background` has a value in the light theme: a vibrant blue. In the dark theme, that same token has a different value — a softer blue, calculated to work on a dark background.

When the user activates dark mode, what changes is the **active theme**. The tokens stay the same. The values behind them change automatically.

You, as a designer, do not need to create two versions of the component. The system handles it.

### What "correct" means in Figma

In Figma, an element is correctly configured for dark mode when:
- Its fill color is bound to a **Semantic or Foundation token** — not a loose hexadecimal
- When switching the token library to the dark theme, the element changes color automatically

If an element has a fixed hex in the fill, it does not respond to the theme switch. That is the signal something needs to be fixed.

### The second dimension: negative surface

Beyond dark mode (dark background), the system has another dimension: the **negative surface**.

The positive surface is the normal interface. The negative surface is like a "photographic negative" — the color scales are inverted within the same mode. You can have:

| Combination | When to use |
|-------------|-------------|
| Light + Positive | Default interface (most common) |
| Light + Negative | Inverted section within a light page — highlight banners |
| Dark + Positive | Default dark mode |
| Dark + Negative | Rarely used |

The negative surface is useful for creating immediate visual contrast in a section without switching to dark mode. In Figma, each combination is a separate theme in the library.

---

## Guided example

### Checking a component in Figma

To confirm that a component is ready for dark mode, follow these steps:

**Step 1:** Select the component in Figma.

**Step 2:** Inspect every fill, stroke, and text. All should display a token name (e.g., `semantic/color/interface/function/primary/normal/background`), not a hexadecimal.

**Step 3:** Switch the token library to the dark variant (e.g., `aplica_joy-dark-positive`). The component should change colors.

**Step 4:** Confirm that the visual relationships hold: the button still looks like a button, the alert still looks like an alert, the text is still readable.

### What to fix when it doesn't work

If an element did not change when switching themes, the cause is almost always one of these:

| Symptom | Cause | Fix |
|---------|-------|-----|
| Fill stays on the same hex | Fixed hex applied directly | Replace with the correct token |
| System text became unreadable | Body text token used on colored background | Use `txtOn` from the same token as the background |
| Icon stays the same color | Icon with hardcoded color | Use `currentColor` or the correct token |
| Shadow disappeared or became heavy | Shadow with fixed hex color | Use the Foundation elevation styles |

---

## Try it yourself

Open one of your design files. Pick a component you created recently.

1. How many fills, strokes, or texts use direct hexadecimals instead of tokens?
2. If you switched the library to the dark theme right now, what would break?

If there are hexadecimals, try to identify which token category would be correct for each one using the vocabulary from N1-02:

- Is it a user action → Interface Function
- Is it system feedback → Interface Feedback
- Is it brand identity → Brand
- Is it a neutral background or text → Foundation

---

## Dark mode checklist for designers

Before handing off a design, verify:

- [ ] All fills, strokes, and text colors use tokens (not hexadecimals)
- [ ] Text on colored surfaces uses the `txtOn` from the same token as the background
- [ ] No element has its color chosen "manually" with dark mode in mind
- [ ] The design was verified with the dark theme library active
- [ ] Icons and illustrations have treatment for both modes

---

## Checkpoint

By the end of this tutorial you should know:

- [ ] Why dark mode is automatic when correct tokens are used
- [ ] How to verify in Figma whether a component is ready for dark mode
- [ ] What negative surface is and when it is useful
- [ ] How to identify and fix the 4 most common problems that break dark mode in design

---

## Next step

[N1-04 · Tokens in Figma — day-to-day workflow](./04-tokens-no-figma.md)

You have the vocabulary, you understand accessibility and dark mode. Now let's close the loop: how Figma stays in sync with the system, and what the correct flow is for applying tokens to a new component.

*(This tutorial includes screenshots and will be published shortly.)*

---

## References

- Dark mode patterns in code: [03-dark-mode-patterns.md](../../05-components-theory/03-dark-mode-patterns.md)
- Color system and inversion: [01-colors.md](../../03-visual-foundations/01-colors.md#dark-mode)
- Designer workflow in Figma: [02-designer-workflow.md](../../04-theme-engine/02-designer-workflow.md)
