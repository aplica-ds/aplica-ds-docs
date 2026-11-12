---
title: "Design.md — Context for AI Tools"
lang: en
---

# Design.md — Context for AI Tools

## What it is

`DESIGN.md` is a design system specification file in the **Google Stitch** format: machine-readable YAML frontmatter + human-readable markdown body. Any AI tool that follows the spec — Cursor, Claude Code, GitHub Copilot, Gemini, v0 — uses this file to generate UI code consistent with the design system without guessing palettes, sizes, or spacing.

It is the visual equivalent of `AGENTS.md`: while `aplica-ui-integration.md` teaches *how* to consume tokens, `DESIGN.md` declares *what* the resolved values are — hex colors, type families, spacing scales, border radii.

---

## Why it exists

The skills injected by `ai:init` teach *consumption rules*: never hardcode values, always verify in `dist/`, prefer Foundation Styles. But an AI tool that lacks access to the project's `dist/` files — or is in an editor without a context plugin — cannot verify real values.

`DESIGN.md` solves this: it is a **resolved snapshot** of the active brand that any tool can read without dependency on a build system or plugin. Placing the file at the repository root makes the design system context available to every assistant that accesses the project.

---

## What the file contains

The YAML frontmatter defines four value sections:

```yaml
colors:
  primary: "#265ed9"        # brand.branding.first.default.background
  secondary: "#fecb01"
  surface: "#f6f3f5"
  on-surface: "#000000"     # WCAG-validated against surface
  error: "#f53232"

typography:
  h1: { fontFamily: "Roboto", fontSize: "36px", fontWeight: 700, lineHeight: "44px" }
  body-md: { fontFamily: "Roboto", fontSize: "16px", fontWeight: 400, lineHeight: "24px" }

spacing:
  sm: "12px"   md: "16px"   lg: "20px"   xl: "24px"

rounded:
  sm: "8px"    md: "12px"   lg: "16px"   full: "1000px"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.md}"
```

The markdown body explains each slot using canonical Aplica nomenclature, making it understandable to both humans and AI agents.

---

## Token mapping: Aplica → Design.md slots

The schema (`schemas/design-md.mjs`) maps each Design.md generic slot to the exact Aplica token path. This pairing is the reason generated values are always structurally correct:

| Design.md slot | Aplica token source | Category |
|----------------|--------------------|-|
| `colors.primary` | `color.brand.branding.first.default.background` | Color |
| `colors.surface` | `color.brand.ambient.contrast.base.positive.background` | Color |
| `colors.error` | `color.interface.feedback.solid.danger.default.normal.background` | Color |
| `typography.h1` | `hierarchy.headline_1` (from `typography_styles.json`) | Typography |
| `typography.body-md` | `content.body` (from `typography_styles.json`) | Typography |
| `spacing.md` | `dimension.spacing.medium` | Dimension |
| `rounded.md` | `border.radii.small` (12px) | Dimension |

---

## Two ways to get the file

### 1. Static template — via `ai:init` (initial setup)

```bash
theme-engine ai:init
```

Copies a pre-built `DESIGN.md` with reference brand values (`aplica_blue_sky`) to the workspace root. Use as a starting point before running a full brand build.

### 2. Dynamic generation — via `design:md` (with real values)

```bash
# Primary brand (detected from themes.config.json)
theme-engine design:md

# Specific brand
theme-engine design:md --brand my-brand
```

Resolves real values from the brand's generated files and writes:

| File | Purpose |
|------|---------|
| `DESIGN.md` | Spec at workspace root — use with AI tools |
| `data/foundation/<brand>/design-md.json` | Resolved intermediate JSON — versionable, useful for programmatic tooling |

> Run `design:md` whenever you change brand colors or after `theme-engine build`.

---

## Customizing slot descriptions

The engine generates default descriptions for each slot from `schemas/design-md.mjs`. To override a description — for instance, to add brand personality context or usage restrictions — edit `config/foundations/design-md.json`:

```json
{
  "overview": "Health and wellness design system. Accessibility first, coral/teal palette.",
  "colors": {
    "primary": { "$description": "Brand anchor coral — never use on pure white backgrounds." }
  }
}
```

Only declare the slots you want to customize. The engine uses schema defaults for everything else.

---

## Schema pairing

`DESIGN.md` is paired with `schemas/design-md.mjs`, which lives alongside `architecture.mjs` and `typography-styles.mjs`. When the token architecture evolves — a new color slot, a new type category — `schemas/design-md.mjs` is updated in the same PR. This ensures:

- Auto-generated descriptions always cover all current slots
- `config/foundations/design-md.json` never has broken slots (the schema validates)
- No contract change passes without updating the AI context

---

## Validation

```bash
npx @google/design.md lint DESIGN.md
```

The Google Stitch CLI checks that the file is valid: parseable YAML, token references resolve within the same frontmatter, required sections present.

---

## Deploy Safety Contracts — a complementary feature

Since v3.15, the engine also ships **deploy safety contracts** — structural snapshots of the token path set (not values). Where `DESIGN.md` tells AI tools *what your tokens look like*, contracts tell CI *whether your token structure broke*:

```bash
# In the theme engine config repo — after build
theme-engine contracts:generate

# In the component library — in CI, after installing a new package version
theme-engine contracts:diff --contract ./contracts/aplica_blue_sky-contract.json
```

Results: **Green** (no structural changes) / **Alert** (new paths added) / **Error** (paths removed — exit code 1, CI blocks).

A ready-to-use GitHub Action template ships at `templates/github-actions/contracts-check.yml`.

---

## Audience

| Role | What to do |
|------|-----------|
| **System Designer (N2)** | Run `design:md` after configuring a new brand. Edit `config/foundations/design-md.json` to add brand context and personality. |
| **Design Engineer (N3)** | Commit `DESIGN.md` to the repository. Regenerate after each `theme-engine build`. Set up CI to run `contracts:generate` on every release. |
| **Component Author (N1+)** | Benefits from `DESIGN.md` indirectly — AI tools read it automatically. |

---

## References

- CLI reference — `design:md`, `contracts:generate`, `contracts:diff`: [CLI Reference](../09-engineering/05-cli-reference.md)
- AI Skills Injection — consumption guidance injected into tools: [07-ai-skills-injection.md](./07-ai-skills-injection.md)
- Foundation Styles — preferred consumption path for components: [06-foundation-styles.md](./06-foundation-styles.md)
