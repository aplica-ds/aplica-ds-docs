---
title: "Surface Layer"
lang: en
---

# Surface Layer

> **Documentation date:** 2026-04-10
> **Focus:** Surface context, Positive/Negative, and inversion calculations in Aplica DS.

## 1. Overview and Current Definition

The **Surface Layer** is the third processing stage of the *Aplica Theme Engine*. After the palette has received its pigment in the *Brand* layer and its contextual visual contrast in the *Mode* layer, it is evaluated according to the area and relief of the screen where it is being applied: **Surface Context**.

Surfaces are areas that group and elevate components (e.g., the screen background, the Modal background, the Dialog background, or a highlight Card background). There are two macro-surfaces in the system:
- **Positive Surface (Positive)**: The majority default surface, with its expected flow (e.g., lighter components on a white/neutral light screen background).
- **Negative Surface (Negative)**: A high-impact inverted surface (e.g., a large Card or Header with a deep color where the internal buttons and text need to be rebuilt so they do not disappear into the dark).

### The Mathematical Inversion Logic
The Theme Engine automates component behavior when they enter a surface of opposite contrast (Negative). The Surface layer instructs the inversion of the brand palette's primitive *nomenclatures*:
- The original `lowest` tone (the lightest) behaves as `highest` (the darkest).
- The `lower` tone becomes `higher`.
- `low` becomes `high`.
- The `default` tone — the core of the identity — remains `default`.

## 2. Evolution Mapping and Historical Context

In the legacy files from Aplica Alpha and V1, there was no robust and automated mathematical concept of "surfaces." In that version, when a designer needed a "Primary Button" on top of a "Main Background" and the same button inside a "Dark Hero Banner," they would end up creating (and hardcoding in the frontend) dozens of new manual tokens (`btn-primary-on-dark`), overloading the structure with color exceptions.

The cognitive load for developers and designers doubled with every variation that depended on an inverted surface, especially when crossing those pre-existing variables with the lack of official standardized Dark Mode support at the time.

## 3. Consolidated Technical Decisions

With the arrival of the Theme Engine V2, the implementation structurally resolves this burden through the native `Surface` concept:

1. **Adding suffixes to builds (-positive, -negative):**
   The theme compiler distributes finalized composite palettes. For example, the same brand (*Corporate Theme*) generates `corporate-light-positive`, `corporate-light-negative`, and the respective `dark` versions.

2. **Perfect contrast quality in `txtOn`:**
   This way, the engine's built-in calculation ensures that when applying the color `semantic.color.action.primary` inside the inverted card, the developer does not need to create a fake `.tertiary` color. By switching the provider of that frontend block to the "negative" logical package, the Surface engine reacts by injecting an inverted `txtOn` while maintaining full WCAG contrast consistency without the developer having to intervene.

## 4. Canonical Rules / Constraints

- **Everything is Positive by default:** The entire design system starts from the visual premise of the positive surface. The exception applies strictly when there is a programmed inversion with large visual breathing room (such as banners, dark institutional sections, deep footers).
- **The Mode/Surface relationship:** It is important to note that *Surface Negative* is **NOT** *Dark Mode*. You can use an application perfectly set to Light Mode that displays an inverted dark Header — this mechanic is purely Surface Negative. Conversely, components can exist on a *Positive Surface* within an experience immersed in the global *Dark Mode*. The layers resolve the orthogonal role between device/system preference and the screen's visual hierarchy separately.
