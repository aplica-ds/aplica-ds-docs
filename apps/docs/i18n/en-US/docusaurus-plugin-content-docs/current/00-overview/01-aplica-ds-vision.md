---
id: aplica-ds-vision
title: "Aplica Design System — Vision"
description: "What Aplica DS is, what it delivers, and the principles behind its architecture."
lang: en
---

# Aplica Design System — Vision

## What is Aplica DS

**Aplica DS** is an open source Design System, agnostic to component libraries, built around a semantic Design Token architecture.

It is not a component library. It is a **visual language specification** structured in tokens — the layer that gives coherence to any component, on any platform, for any brand.

---

## Core principle: Tokens First

Aplica DS starts from a simple premise: **every visual decision should be a purposeful token**.

This means:
- No hardcoded values in components.
- Every color, spacing, font, or depth value exists in the token structure with a semantic reason.
- The same semantic token can resolve to different values depending on brand, mode, surface, or dimension — without the component needing to know any of that.

---

## Who it's for

| Profile | How they use Aplica DS |
|---------|----------------------|
| **Designers** | Token structure in Figma (via Tokens Studio), style semantics, theme system |
| **Front-end Engineers** | CSS custom properties, JSON/ESM/CJS for consumption in React, Vue, Angular, Flutter |
| **Design System teams** | Reusable foundation for building proprietary DSes with their own identity |
| **Open source projects** | Starting point for multi-brand DSes without reinventing the token architecture |

---

## What Aplica DS delivers

### Semantic tokens
Purpose-driven tokens: `semantic.color.interface.function.primary.normal.background` — not a color, but the role of a color in a specific context.

### Foundation tokens
A **cognitive load reduction** layer for product teams. Those building screens don't need to understand the full semantic system — Foundation delivers the necessary subset with simple, direct names: backgrounds, text colors, borders, spacings, and pre-composed typographic styles. Fewer decisions, more speed, less context to carry.

### Theme Engine
A dynamic theme generator that produces all variants automatically from configuration. Given 1 brand, it generates: light/dark × positive/negative × minor/normal/major = 12 or more variants.

### Multi-platform outputs
- **CSS** — custom properties (`:root`, `data-theme`)
- **JSON** — compatible with Figma and Tokens Studio
- **ESM / CJS** — JavaScript modules
- **TypeScript** — type declarations

---

## What Aplica DS is NOT

- Not a component library.
- Not opinionated about framework (React, Vue, Flutter — all are valid consumers).
- Does not define component behavior — only the tokens a component uses.
- Does not replace a complete Design System — it is the **foundation** on top of which a complete DS is built.

---

## Override philosophy

Aplica DS is an **intentional structure that accelerates and scales** Design System development. All embedded decisions — from the dimension scale to color decomposition — are deliberate and interdependent.

However, with intent and effort, **all of these rules can be overridden**. It is possible to change color values, adjust typography scales, manipulate opacity curves, or reconfigure depth to give your Design System its own identity. We call this an **override**.

> **Override is allowed — but it carries responsibility.**
> Any override must be:
> 1. **Studied** — Understand which logic is being changed and which dependencies will be affected (e.g., changing `darkModeChroma` impacts all palettes in Dark mode)
> 2. **Tested** — Validate that outputs still pass minimum accessibility requirements (WCAG AA) and that scales maintain visual coherence
> 3. **Documented** — Explicitly record what was changed, why, and which tradeoffs were accepted
>
> Undocumented or untested overrides are the primary source of Design System degradation over time.

The Theme Engine supports overrides at multiple levels:
- **Configuration** (`*.config.mjs`): Scale adjustments, chroma, opacityScale, elevation
- **Data** (`data/brand/*.json`): Product colors, custom palettes
- **Foundation** (`data/foundation/*.json`): Completely free product aliases

---

## Design principles

### 1. Semantics over aesthetics
Tokens are named by **role**, not appearance. `color.feedback.success` instead of `color.green`. This ensures the semantics survive color changes.

### 2. Separation of concerns
Each layer has a single responsibility. Brand does not mix with Mode. Dimension does not depend on Brand. The separation is structural, not conventional.

### 3. Exponential scalability
Adding 1 brand automatically generates all mode, surface, and dimension variants. 4 brands × 2 modes × 2 surfaces × 3 dimensions = 48 variants from a single configuration.

### 4. Calculated accessibility
The color pipeline automatically calculates contrast (WCAG AA/AAA) for `txtOn` tokens. Accessibility is not a checklist — it is part of the algorithm.

### 5. Consistency by contract
The canonical naming contract ensures that any consumer — Web, Mobile, Figma — interprets tokens the same way. There is no ambiguity in the semantics.

---

## High-level architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    APLICA DS                                │
│                                                             │
│   Brand ──┐                                                 │
│   Mode  ──┼──────────────────────┐                          │
│   Surface─┘                      ▼                          │
│                          ┌──────────────┐                   │
│                          │   Semantic   │                   │
│   Dimension ─────────────┤   (tokens    │                   │
│   (minor/normal/major)   │  with purpose│                   │
│                          └──────┬───────┘                   │
│                                 │                           │
│                          ┌──────▼───────┐                   │
│                          │  Foundation  │                   │
│                          │  (cognitive  │                   │
│                          │load reduction│                   │
│                          │  for teams)  │                   │
│                          └──────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

For the complete layer architecture, see [01-token-architecture.md](../01-design-tokens-fundamentals/01-token-architecture.md).

---

## Three Knowledge Domains

Aplica DS knowledge is organized across three domains, each serving a distinct audience:

| Domain | Audience | Core question |
|--------|----------|---------------|
| **Racional** | Everyone | Why does this architecture exist? How does it work? |
| **Consumo** | Devs using tokens | Which tokens do I use, and how do I import them? |
| **Engenharia** | Devs running the engine | How do I install, configure, and build? |

The engineering domain is covered in [Engineering Quick Start](../09-engineering/01-quick-start.md). The consumption domain is in [Implementation Guide](../07-implementation/01-migration-guide.md). The conceptual foundation is in sections 01–04.

---

## Current status

Aplica DS is in active production, with the **Aplica Tokens Theme Engine** published as an NPM package (`@aplica/aplica-theme-engine`).

| Component | Status |
|-----------|--------|
| Token architecture (5+1 layers) | Stable, documented |
| Theme Engine NPM package (`@aplica/aplica-theme-engine`) | Production |
| OKLCh color pipeline | Production |
| Dimension system (minor/normal/major) | Production |
| Scalable typography system | Production |
| Dynamic gradients | Production |
| Engineering documentation (Domain 3) | Complete |
| Component library | Planned |
| Documentation site | In progress |
