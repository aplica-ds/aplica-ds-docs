---
title: "Aplica DS — V1"
lang: en
---

# Aplica DS — V1

## Context

V1 was the maturation of the Alpha concepts into a concrete implementation, used in production on a real product. This phase represented the transition from concept to reality: the models needed to be validated, trade-offs became evident, and documentation began to be formalized.

The pressure of a product with real users, multiple engineering teams, and an accelerated release process forced refinements that the Alpha had not anticipated.

---

## What Changed from the Alpha

### From exploration to contract

In the Alpha, conventions were implicit — understood by the team, but not written down. In V1, the first formal contracts appeared:

- **Figma naming standard** — how to name files, frames, and components so that the token structure makes visual sense in Figma
- **Usage documentation** — how to consume tokens in practice, with examples by platform
- **Component creation process** — a defined workflow for creating new components without breaking semantic consistency

### Depth (Elevation) deepened

The depth system (elevation/shadows) gained its own structure:
- Semantic Z-Index tokens (not arbitrary numeric values)
- `box-shadow` system by elevation level
- Concept of "depth elements" — what creates perception of depth beyond shadow (border, surface color, opacity)

### Opacity as a token

Opacity began to be treated as a semantic token — not as a hardcoded percentage value, but with a defined purpose (disabled, overlay, ghost).

### Semantically structured borders

Borders gained semantic structure: border radius, thickness, and border color as independent tokens with purpose aliases.

### Systematized typography

The typographic scale was formally documented:
- Relationship between fontSizes, lineHeights, and letterSpacings
- Composite typographic styles (heading, body, label, code…)
- Figma usage documentation (typographic class × semantic token)

---

## The "Engineering Summary" Concept

An innovation in V1 was creating "Engineering Summary" documents for each visual foundation — a format that translated design decisions into implementation language:

- Engineering Summary: Borders - Layout
- Engineering Summary: Opacity
- Engineering Summary: Depth
- Engineering Summary: Typography and Fonts

These documents served as a bridge between design and engineering, reducing the interpretation gap between what was designed and what was implemented.

---

## What Was Left to Resolve

V1 revealed limitations that would generate V2:

### 1. Coupling between tokens and product
The implementation was too tightly coupled to the specific product — tokens carried product decisions that should have belonged to the brand. Separating the two without breaking the existing implementation would be the central challenge of V2.

### 2. Scalability for multiple brands
Supporting a second brand was possible, but labor-intensive — it required manual duplication of many tokens. The dynamic generator did not yet exist.

### 3. Absence of the Dimension concept
The system had a single sizing/spacing scale. The need to support compact and spacious interfaces on the same base pointed toward what would become the Dimension layer.

### 4. Still-incomplete documentation
Knowledge was divided between Confluence (concept) and code (implementation). The gap between the two sources generated inconsistencies and made onboarding new members difficult.

---

## V1 Decisions That Survived

| Decision | Status |
|---------|--------|
| Engineering Summaries per foundation | Evolved into formal technical documentation in EN/PT-BR |
| Figma naming standard | Evolved into the canonical taxonomy contract |
| Composite typographic styles | Foundation typography styles (7 categories in V2) |
| Elevation system by level | Foundation elevation styles, configurable per theme in V2 |
| Component creation process | Formalized in `05-components-theory/` |

---

## Available Documentation

The Confluence content from this phase is being extracted and organized in `06-history/_extracted/aplica-ds-v1/`.

To extract: `node scripts/extract-confluence-xml.mjs --ds zeta-ds`

Reference pages identified from this phase:
- Usage Documentation
- Foundations / Design Tokens / Styleguide
- Colors, Depth, Typography
- Engineering Summaries (Borders, Opacity, Depth, Typography)
- Components: definition, types, organization, creation process, architecture
- What are attributes?
- Figma naming standard
