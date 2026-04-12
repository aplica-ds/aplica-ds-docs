---
title: "Brand Layer"
lang: en
---

# Brand Layer

> **Documentation date:** 2026-04-10
> **Focus:** Evolution and structure of Brand Tokens in Aplica DS.

## 1. Overview and Current Definition

The **Brand Layer** is the fundamental foundation of the Aplica Theme Engine architecture. This is where the brand's pure visual identity is declared — its colors and fonts — from which all subsequent palettes are derived.

According to the current definitions in the theme engine (such as `data/brand/theme_engine/_brand.json`), the Brand Layer generates a primitized palette of primary brand colors with hierarchical roles:

- **First**: The most important conceptual primary color.
- **Second**: The brand's secondary color.
- **Third**: Tertiary color.
- **Fourth**: Optional, for more diverse palettes.
- **Ambient / Grayscale / Feedback / Product**: Complementary mappings defined and originated in the brand, which form the action, product, and notification colors.

For each hue defined by the brand, the token engine generates (at the primitive level) a progressive sequence (e.g., from 100 to 1900, or 1 to 19 scales), resulting in 7 semantic intensity levels: `lowest`, `lower`, `low`, `default`, `high`, `higher`, and `highest`. At each intensity, the system automatically delivers the background token (`background`), the ideal border color (`border`), and the corresponding contrast color for typography (`txtOn`).

## 2. Evolution Mapping and Historical Context

*Where we came from and how this concept took shape.*

In **Aplica V1**, there was significant discussion around color categorization. As seen in the historical notes (`064-cores-categorias-em-detalhe.md`), V1 divided and explained colors as:
- **Brand**: Colors that dictated the primary and secondary "tone" of the brand.
- **Ambient**: Base, Deep, Neutral, Grayscale.
- **Interaction**: Function (primary, secondary, link) and Feedback (info, success, warning, danger).
- **Text**: Interface colors purely for readability.

**The main pain point of V1 and Alpha:** The documentation mixed *brand identity* with *color use*. If a color was called "Primary Button," it drastically limited the Theme Engine when rendering another brand (multi-branding) where the button needed to behave differently.

In **V2**, things changed profoundly with the initial adoption of the **Aplica Theme Engine**. The structure was separated into atomic layers:
The first layer, **Brand**, now **has no opinion about light/dark context or usage context** — it simply declares the raw base palettes for each brand (e.g., Brand A, Brand B, etc.). Light/dark mode variation is now handled cleanly in the *Mode Layer*.

## 3. Consolidated Technical Decisions

Upon reviewing the current implementation in `references/aplica-tokens-theme-engine`, the following architecture decisions were documented:

1. **Abolition of direct 700/800 nomenclature in public aliases:**
   Exposing primitive numeric levels (10 to 1900) was determined to create code coupling and confusion in dark mode scenarios. The Theme Engine exposes a nominal hierarchy of 7 levels (`lowest` to `highest`), based on usage weight relative to the background, making transitions between themes or inverted surfaces predictable.

2. **Automatic contrast calculation (txtOn):**
   The `txtOn` included in each token solves a persistent pain point from the V1 phase: ensuring designers and developers always find the perfect text color on any brand color with accessibility compliance (AA and AAA).

3. **Function colors move to the Action and Semantic categories:**
   While "Primary" or "Success" originate in the *Brand Color Foundation* (brand options), their mutation logic (hover, active, focus) does not live in isolation without the Theme Engine orchestrating them according to mode and scale.

## 4. Canonical Rules / Constraints

The following guidelines ensure the long-term health of the Theme Engine architecture:

- **Access:** Raw variables from the *Brand* layer must not be used directly to build screens or components. They are the raw material consumed exclusively by the **Semantic** layer (for DS engineering and component building). For product teams that build screens and consume ready-made components, the **Foundation** layer is used (focused on cognitive load reduction).
- **Zero Light Bias:** Raw *Brand* layer components do not have a native "Dark" state; they are processed when entering the *Mode Layer*.
- **Flexible Primitive Structure:** It is acceptable for some brands not to use a `fourth` configuration. The Theme Engine handles the absence gracefully, concentrating functions in `first` and `second`.
