---
id: learning-path
title: "Learning Paths — Learning Spiral"
description: "How to navigate Aplica DS documentation based on your role. Three levels of depth: Product Designer, System Designer, Design Engineer."
lang: en
---

# Learning Paths — Learning Spiral

To ensure Aplica DS is both scalable and understandable, we use the **Learning Spiral** methodology. Knowledge is not delivered all at once in its full technical complexity — it is layered in depths that respect each professional's role in the ecosystem.

---

## How to use this documentation

Depending on your role, you should start from different paths.

### Level 1 — Product Designers (Users)
**Focus:** Speed, consistency, and practical application.

If you build screens, flows, and prototypes, your goal is to understand **how to use** tokens to ensure that what you design in Figma is perfectly implemented.

**Start here:**
1. [The Foundation layer](../02-token-layers/05-foundation-layer.md) — The simplified tokens for day-to-day use.
2. [Designer workflow](../04-theme-engine/02-designer-workflow.md) — How to sync Figma with the engine.
3. [Semantic colors](../03-visual-foundations/01-colors.md) — Understanding the purpose of colors (Feedback, Brand, and Product).
4. [Spacing and sizing](../03-visual-foundations/03-spacing-sizing.md) — Using the `minor/normal/major` scale.

**Or start with the tutorials:**
→ [N1-01 · What are design tokens](../08-tutorials/N1-01.md)

---

### Level 2 — System Designers (Architects)
**Focus:** Systems engineering, governance, and maintenance.

If you are responsible for creating new themes, maintaining the component library, or evolving the technical rationale of the DS, your goal is to understand the **why** behind decisions and how the **engine** works.

**Start here:**
1. [Token architecture](../01-design-tokens-fundamentals/01-token-architecture.md) — The 5-layer pipeline in depth.
2. [What is the Theme Engine](../04-theme-engine/01-what-is-theme-engine.md) — The technical rationale of the generator.
3. [Mathematics and algorithms](../03-visual-foundations/06-mathematics-and-algorithms.md) — OKLCh and scale rationals.
4. [Override philosophy](../00-overview/01-aplica-ds-vision.md#override-philosophy) — How to evolve the system without breaking it.

**Or start with the tutorials:**
→ [N2-01 · The five-layer mental model](../08-tutorials/n2-system-designer/01-modelo-mental-5-camadas.md)

---

### Level 3 — Design Engineers (Builders)
**Focus:** Implementation, integration, and contribution.

If you write the code that consumes tokens — components, integrations, platform-specific builds — your goal is to understand the **token contract**, the build pipeline, and how to integrate the output into any stack.

**Start here:**
1. [Component token contract](../05-components-theory/01-component-token-contract.md) — What the engine guarantees and what you can depend on.
2. [Build pipeline](../04-theme-engine/04-build-pipeline.md) — The full path from config to `dist/`.
3. [Platform integration](../07-implementation/02-platform-integration.md) — React, Vue, CSS-only, React Native.
4. [Component variants and states](../05-components-theory/02-component-variants.md) — Mapping every variant × state × property to the correct token.

**Or start with the tutorials:**
→ [N3-01 · The token contract](../08-tutorials/n3-design-engineer/01-contrato-de-tokens.md)

---

## The spiral cycle

The Learning Spiral encourages a Product Designer to, over time, go deeper into Level 2 topics if they want to contribute to the system. Likewise, a System Designer should always ensure their technical decisions result in a simplified Level 1 experience for the rest of the team.

> **Start simple.** If you are new to the system, focus on mastering Level 1. The complexity of Level 2 exists to protect the simplicity of Level 1.

---

## Quick reference: where to start by question

| Your question | Where to go |
|--------------|-------------|
| "Which token do I use for this button?" | N1-02 · Color vocabulary |
| "Why is dark mode automatic?" | N1-06 · Dark mode |
| "How do I sync tokens to Figma?" | N1-04 · Tokens in Figma |
| "Why can't I just use the Brand color directly?" | N2-01 · Five-layer model |
| "How do I create a new theme from scratch?" | N2-04 · Theme anatomy |
| "What is a breaking change in this system?" | N3-01 · Token contract |
| "How do I set up tokens in a React project?" | N3-05 · Integrating tokens |
| "How do I add a new brand to the engine?" | N3-06 · Adding a new brand |
