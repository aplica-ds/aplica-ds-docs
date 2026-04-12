---
title: "Mode Layer"
lang: en
---

# Mode Layer

> **Documentation date:** 2026-04-10
> **Focus:** Evolution and structure of Mode tokens (Light/Dark) in Aplica DS.

## 1. Overview and Current Definition

The **Mode Layer** is the second architectural stage of the *Aplica Theme Engine*. Its sole responsibility is to take the raw palette extracted from the *Brand Layer* and subject it to the display context or visual accessibility requirements.

Although the most common use is **Light Mode** and **Dark Mode**, the concept of *Mode* in the *Aplica Design* architecture is broader than just "light or dark." It represents the *visual context*. This means other display modes focused on accessibility live in this layer, for example:
- **High Contrast**: Where colors are readjusted for maximum contrast.
- **Colorblind**: Where the palette adjusts to compensate for color vision deficiencies (color blindness, etc.).

This layer maintains exactly the same base structure for all themes, ensuring components do not need refactoring to support multiple contexts: instead, the *engine* dynamically manipulates how the *Brand* palette indices should be rendered in that specific mode.

### Core features in the Theme Engine:
- **Automatic chroma (saturation) reduction**: The Theme Engine has a `darkModeChroma` configurator (e.g., `0.85` by default), which understands that dark backgrounds need less saturated colors to be viewed comfortably without straining the eyes.
- **Tonal curve inversion**: Dark mode mathematically maps the brand's 10–190 palette, pulling "darker" or desaturated versions in places where the light theme would use vibrant tones.

## 2. Evolution Mapping and Historical Context

*Synthesizing the challenges of implementing a dark theme in Alpha and V1 phases.*

In the earliest phases (Alpha and V1), introducing dark mode was a conceptual design challenge. As seen in the legacy documentation (e.g., color categories in detail — *Contrast / Deep*), it was recommended that *designs using dark-mode structures be based on a blend between the brand and the deepest neutral tones*.

**The legacy pain points:**
- Teams managed *Light Mode* and *Dark Mode* as duplicates in both code and Figma. Every new brand color required a manual recalculation to create its ideal "less saturated" dark version.
- The "primary" color in dark mode should not numerically be the same as the light mode for visual accessibility reasons, generating inconsistencies when this was not done mathematically and scalably.

## 3. Consolidated Technical Decisions

When establishing the **Mode Layer** in V2 through the new Theme Engine, the following approaches were formalized:

1. **Mandatory separation of responsibilities:**
   If a "Primary Button" element needs to visually switch between light and dark, this is defined neither in the component layer nor in the Brand layer. It is the *Mode Layer* that intercepts the variable (e.g., `theme.color.brand.first`) and generates the `light` and `dark` mirrors.

2. **Globally adjustable chroma (saturation):**
   To resolve the visual discomfort caused by very bright colors on black backgrounds (typical of incorrect Dark Mode conversions), every token in the `dark` mode passes through a chroma rewrite filter (e.g., `darkModeChroma: 0.85` causes colors to natively lose 15% of saturation while maintaining identical hues).

3. **Dark mode as a point of view, not an additional color:**
   Dark Mode is not a "new brand color" being registered. The Theme Engine simply looks at the same primitive palette already registered in the tool and creates the reverse allocations.

## 4. Canonical Rules / Constraints

- **Single Source of Truth:** Engineers must never declare colors in hexadecimal directly if the component needs to natively support Dark Mode; always consume from *Semantic* (or *Foundation*), which already carries the resolved mode under the hood.
- **Contrast Check:** The Mode Layer handles maintaining the contrast ratio rule end-to-end. The desaturation (chroma) choices are designed not to violate WCAG with respect to typography readability (*txtOn*).
