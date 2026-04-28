---
title: "Foundation Layer"
lang: en
---

# Foundation Layer

> _The Foundation Layer is also called the **Consumer Layer** in public-facing communication — it provides simplified aliases optimized for product teams with lower cognitive overhead._

> **Documentation date:** 2026-04-10
> **Focus:** Cognitive load reduction, alias mapping, and use in the Product scope.

## 1. Overview and Current Definition

The **Foundation Layer** is the final exposure stage in the *Aplica Theme Engine*'s base taxonomy. It acts strictly as an **alias** layer (short, friendly nicknames) that references tokens from the *Semantic* layer.

Its goal is not to add or create new colors mathematically, but to provide a simplified, user-friendly "API" for product teams to assemble flows or screens with minimal cognitive overhead.

While the base architecture (Brand through Semantic) follows a mandatory and highly granular shared schema, *Foundation* has a **free structure** adaptable to each theme.

## 2. The Thinking Behind "Cognitive Load"

The primary concept that led to the birth of Foundation in the V2 architecture directly attacks one of the historically documented main complaints:

**The Design System Engineering vs. Product Engineering Paradox**
1. The root Design System developer, building an agnostic button for 45 different brands, needs surgical precision of context. For them, a hyper-detailed instruction like `semantic.color.brand.branding.first.default.background` is necessary, because the button needs to read the exact levels in its interaction sub-systems.
2. However, **Product Teams** only consume buttons and stack them into screens. If the developer (or designer of the final product UI) only needs to paint their new corporate app's header with the company's base color, forcing them to memorize/write the enormous *Semantic* path causes paralysis, typing errors, and a steep learning curve. For them, `foundation.bg.primary` is enough.

### Consumption Rule:
- **DS area (Design System):** Consumes 100% via *Semantic* when creating components.
- **Product area:** Consumes primarily *Foundation* `foundation.*` in day-to-day screens and customizations; falling back to *Semantic* only when a complex detail has not been simply abstracted in the alias.

## 3. Consolidated Technical Decisions (Theme Engine)

### 3.1 Hybrid Generation
The *Aplica Theme Engine* compiles Foundation based on the premises that themes declare in local `.config.mjs` files. To generate the shorter paths, it accepts two parallel ways of working:

- **Direct mapping:**
  Allows freely plugging in aliases for specific Semantic tokens:
  ```json
  "bg": {
     "primary": "{semantic.color.brand.ambient.contrast.deep.light.background}",
     "brand_low": "{semantic.color.brand.branding.first.lowest.background}"
  }
  ```

- **Structure-based mapping:**
  If there is standardization, the configuration passes placeholders (`{item}`, `{variant}`, etc.) reducing path repetition for larger blocks, such as Feedback.

### 3.2 What does it deliver? What does it omit?

*Foundation* **delivers** ease. It builds succinct CSS Properties (e.g., `--foundation-bg-primary`) that hide the real semantic complexity behind them.

*Foundation* **omits** internal details of the `brand.*`, `mode.*`, and `surface.*` layers. It also intentionally omits excessive variations of atomic components (where `component.*` would make sense or should remain isolated in DS manipulation).

## 4. Canonical Rules / Constraints

- **Does not replace Semantic as the source of truth:** *Foundation* never stores a hardcoded HEX. It is a mirror.
- **Assumed flexibility:** Different themes can, if desired, have slightly divergent Foundation trees according to the library that consumes them. The engine compiles while validating that Foundation keys actually point to a live key mapped in Semantic (*Validation Reports* generated automatically at each engine build), ensuring strict relationship consistency.

## 5. Composite Tokens (Styles in Figma)

A fundamental aspect of the Foundation layer is that it also houses **Composite Tokens**. These tokens are essential in bridging the gap between code and visual design tools (like Figma), as they represent groupings of values that are simple in isolation but form something more complex together.

We call *Composite Tokens* the groupings that use one or more tokens to create an invocable set, converting directly into **Styles in Figma**.

Currently, we handle the following composites:
- **Typography Styles:** Group properties such as `fontFamily`, `fontWeight`, `lineHeight`, and `fontSize`.
- **Depth (Shadows):** Group `x`, `y`, `blur`, `spread`, and `color` to invoke shadows (`box-shadow` in CSS / *Drop Shadow* effect in Figma).
- **Gradients:** Group color transition definitions and direction.

Although we can expand this concept in the future to encompass other effects (such as complex animations or macro state transitions), the current focus is on base visual styles (typography, depth, and gradients) to give autonomy to designers who consume these libraries daily, while maintaining the direct link to the code's Theme Engine.
