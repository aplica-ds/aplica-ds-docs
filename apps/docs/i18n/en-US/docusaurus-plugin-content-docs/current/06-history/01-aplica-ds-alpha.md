---
title: "Aplica DS — Alpha"
lang: en
---

# Aplica DS — Alpha

## Context

The Alpha version of Aplica DS represents the formation phase of the concepts that would come to define the entire architecture. It was not yet an autonomous Design System with its own identity — it was a set of ideas about how to structure tokens and themes in a scalable and semantic way, developed in parallel with other Design System work.

This phase answered a central question: **how to guarantee visual consistency across distinct products, of distinct brands, without duplicating effort?**

---

## The Problem That Motivated the Alpha

Traditional Design Systems solve consistency within a single product. But when you operate multiple products, or when the same product needs multiple brands, the model breaks:

- **Token duplication:** each product has its own set of colors, spacing, and typography, with different names for the same things.
- **Cascading maintenance:** a brand color change requires manual updates across dozens of files.
- **Semantic inconsistency:** what one team calls "primary color" is what another calls "action color" — without control, without a contract.
- **Dark mode as an afterthought:** a flat token structure does not support color modes natively — it is a patch, not an architecture.

---

## The First Ideas — What the Alpha Defined

### 1. Tokens with purpose, not appearance

The first and most enduring decision: tokens are named by **semantic role**, never by appearance.

```
❌ color-orange-500
✅ color.interface.function.primary.normal.background
```

This seems trivial, but has deep implications: a semantic token survives a visual identity change. When the brand switches from orange to blue, the `primary.background` token simply receives a new value — the components do not change.

### 2. Separation of responsibilities into layers

The Alpha established that a theme is the result of composing independent dimensions:
- **Who is the brand?** — Brand
- **Light or dark?** — Mode
- **On which surface?** — Surface

This separation allowed the same component to work in any combination without knowing anything about the underlying visual identity.

### 3. Color decomposition

One of the most important discoveries of the Alpha: a single brand color can be algorithmically decomposed into a complete palette — it does not need to be defined manually color by color.

The decomposition generates:
- **Tonal palette** (lightness and saturation variations)
- **Neutrals** derived from the main color (not generic grays, but neutrals with color temperature related to the brand)
- **Behavioral states** (hover, pressed, disabled) calculated automatically

This drastically reduced the work of creating themes and eliminated manual inconsistencies.

### 4. Accessibility as an algorithm

Instead of validating contrast manually, the Alpha defined that the system should automatically calculate `txtOn` tokens (text on color) guaranteeing at minimum WCAG AA.

Black or white — the decision belongs to the algorithm, not the designer.

---

## What Was Left Out in the Alpha

- There was no automated dynamic generation — themes were semi-manual.
- There was no concept of Dimension (scale densities).
- Nomenclature was still being explored — the canonical contract came later.
- There was no formal documentation of the rules — it was tacit knowledge.

---

## The Alpha's Legacy for Aplica DS

Everything built afterward — V1, V2, and the Aplica Theme Engine — derives from the decisions made in the Alpha:

| Alpha decision | Where it lives today |
|---------------|---------------------|
| Semantic tokens by role | Semantic layer — `data/semantic/default.json` |
| Brand × Mode × Surface separation | `data/` structure and build pipeline |
| Color decomposition into palette | Dynamic Theme Generator |
| Calculated accessibility | OKLCh pipeline |
| Naming contract | `docs/context/tokens/canonical-taxonomy-and-naming-contract.md` |

---

## Available Documentation

The Confluence content from this phase is being extracted and organized in `06-history/_extracted/aplica-ds-alpha/`.

To extract: `node scripts/extract-confluence-xml.mjs --ds apollion-ds`

Reference pages identified from this phase:
- Colors: Decomposition, Behavioral Decomposition, Layout Decomposition
- Colors: Accessibility, Contrast Colors, Brand Colors, Function Colors
- Technical Documentation — Tokens: Typography, Colors, Depth, Spacing, Borders
- Visual Language (VL): Typography, Depth, Borders, Forms
- Token Grouping, Style Units, Configuration JSON
