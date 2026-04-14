# AI assistant playbook — Aplica DS (`aplica-ds-docs` repository)

This file guides agents that answer questions about **Aplica Design System**, the **Aplica Tokens Theme Engine**, and the **published documentation** in this monorepo. It does **not** replace the source articles in `apps/docs/docs/`; treat those as the source of truth.

---

## What this repository is

- **`apps/docs`**: documentation site (Docusaurus v3). Content lives in **`apps/docs/docs/**/*.md`** (default locale: **pt-BR**).
- **`apps/site`**: institutional/marketing site (Astro).
- The **Theme Engine implementation code** (`config/`, `data/`, `dist/`) is **not hosted here**; this repository contains the Markdown **specification and guidance**. Technical pipeline explanations should follow the articles listed below.

**Upstream authoring:** content is often authored in `aplica-ds-concept` and migrated here (see [README.md](../../README.md) at repo root). If something looks outdated, the upstream KB may have changed.

**Public sites (complementary):** [docs.aplica.me](https://docs.aplica.me), [aplica.me](https://aplica.me). Prefer citing files in this repository for traceable answers in PR/review workflows.

---

## Agent rules

1. For **conceptual questions** (tokens, layers, Theme Engine, Figma, tutorials), read the relevant `.md` files from the [topic -> file matrix](#topic---internal-file-matrix) **before** asserting definitions, rules, or naming examples.
2. Do **not invent** namespaces, token paths, or pipeline details that are not present in local docs. If the repository does not cover the point, say so explicitly.
3. Response format: concise summary + **repo-relative paths** (for example `apps/docs/docs/02-token-layers/05-foundation-layer.md`). Include a short quote only for canonical rules.
4. **English mirror:** use `apps/docs/i18n/en-US/docusaurus-plugin-content-docs/current/` with the **same folder/file path** as `apps/docs/docs/`.

---

## Pipeline and roles (summary)

Layered architecture (sequential + orthogonal Dimension) and Theme Engine role are documented in:

- [apps/docs/docs/01-design-tokens-fundamentals/01-token-architecture.md](../../apps/docs/docs/01-design-tokens-fundamentals/01-token-architecture.md)
- [apps/docs/docs/04-theme-engine/01-what-is-theme-engine.md](../../apps/docs/docs/04-theme-engine/01-what-is-theme-engine.md)

Mental flow: **Brand -> Mode -> Surface -> Semantic -> Foundation**, with **Dimension** feeding Semantic/Foundation.

---

## Semantic vs Foundation (anchors)

| Layer | Purpose | Typical audience |
|-------|---------|------------------|
| **Semantic** | Canonical exported taxonomy; long purpose-driven names (`semantic.color.interface...`). | DS engineering / component implementation. |
| **Foundation** | Aliases that point to Semantic; shorter names (`foundation.*`); composites (typography, shadow, gradient) for Figma usage. | Product teams / screen building; cognitive-load reduction. |

Required reading for details and examples:

- [apps/docs/docs/02-token-layers/04-semantic-layer.md](../../apps/docs/docs/02-token-layers/04-semantic-layer.md)
- [apps/docs/docs/02-token-layers/05-foundation-layer.md](../../apps/docs/docs/02-token-layers/05-foundation-layer.md)

For **`semantic.color.product.*`** (flexible product semantics), refer to the Semantic chapter above.

---

## Audiences and learning paths

- Official paths (Level 1 Product Designer, Level 2 System Designer):  
  [apps/docs/docs/00-overview/02-learning-path.md](../../apps/docs/docs/00-overview/02-learning-path.md)
- Vision and Foundation-for-product context:  
  [apps/docs/docs/00-overview/01-aplica-ds-vision.md](../../apps/docs/docs/00-overview/01-aplica-ds-vision.md)
- Glossary:  
  [apps/docs/docs/00-overview/03-glossary.md](../../apps/docs/docs/00-overview/03-glossary.md)

**Tutorial directories:**

- N1 (product designer): `apps/docs/docs/08-tutorials/n1-product-designer/`
- N2 (system designer): `apps/docs/docs/08-tutorials/n2-system-designer/`
- N3 (design engineer): `apps/docs/docs/08-tutorials/n3-design-engineer/`

If user role is unknown, start with **N1** (Foundation + workflow + colors + dimension), then deepen as requested.

---

## Topic -> internal file matrix

Use these paths from repository root (`aplica-ds-docs/`).

| Topic | pt-BR source file(s) |
|------|-----------------------|
| Token architecture (5 layers + Dimension) | `apps/docs/docs/01-design-tokens-fundamentals/01-token-architecture.md` |
| Brand / Mode / Surface / Dimension layers | `apps/docs/docs/02-token-layers/01-brand-layer.md`, `02-mode-layer.md`, `03-surface-layer.md`, `06-dimension-layer.md` |
| Semantic | `apps/docs/docs/02-token-layers/04-semantic-layer.md` |
| Foundation | `apps/docs/docs/02-token-layers/05-foundation-layer.md` |
| Theme Engine definition + pipeline + outputs | `apps/docs/docs/04-theme-engine/01-what-is-theme-engine.md` |
| Designer / Figma workflow | `apps/docs/docs/04-theme-engine/02-designer-workflow.md` |
| Configuration / build / output formats | `apps/docs/docs/04-theme-engine/03-configuration-guide.md`, `04-build-pipeline.md`, `05-output-formats.md` |
| Visual foundations (color, type, spacing, opacity, math) | `apps/docs/docs/03-visual-foundations/` |
| Component contract / dark mode theory | `apps/docs/docs/05-components-theory/` |
| History / v1-v2 migration rationale | `apps/docs/docs/06-history/` |
| Platform implementation and integration | `apps/docs/docs/07-implementation/01-migration-guide.md`, `07-implementation/02-platform-integration.md` |
| Tutorials by persona | `apps/docs/docs/08-tutorials/n1-product-designer/`, `n2-system-designer/`, `n3-design-engineer/` |

**EN mirror rule:** prefix with `apps/docs/i18n/en-US/docusaurus-plugin-content-docs/current/` and keep the same suffix path (for example `.../current/02-token-layers/05-foundation-layer.md`).

---

## Operational questions (this monorepo)

For commands and workspace operations, see root `CLAUDE.md` and `package.json` scripts (`dev:docs`, `dev:site`, `build`).
