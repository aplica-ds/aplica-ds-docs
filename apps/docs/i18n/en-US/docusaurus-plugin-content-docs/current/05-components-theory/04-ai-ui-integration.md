---
title: "AI UI Integration Program"
lang: en
---

# AI UI Integration Program

## What it is

The AI UI Integration Program is the formal contract governing how AI agents consume Aplica design tokens when generating, styling, or reviewing UI components. It defines the rules, layer hierarchy, component archetypes, and validation requirements that make AI-generated component code trustworthy.

The program was introduced in version 3.5.x as the engine added structured support for AI editor integrations (`ai:init`), Foundation Styles, and a set of validated component archetypes.

---

## Core principle: generated outputs are the law

An AI agent must never guess:

- token values
- token variable names
- naming patterns
- output formats
- CSS variable prefixes

Before writing any UI or styling code, the agent must inspect the compiled outputs available in the active consumer workspace:

```
dist/                                              ← resolved token values in all formats
data/semantic/default.json                         ← semantic layer source
data/foundation/{brand}/styles/typography_styles.json
data/foundation/{brand}/styles/elevation_styles.json
```

---

## Layer consumption rule

| Layer | When to use |
|-------|------------|
| **Semantic** | Default for all component styling. Expresses intent. Survives theme changes correctly. |
| **Foundation Styles** | Preferred for typography and elevation — use generated CSS classes over assembling atomic tokens. |
| **Foundation tokens** | When a clear alias already exists and improves readability without changing intent. |
| **Brand / Mode / Surface** | Never use directly in component code. |

### Why Foundation Styles are preferred over atomic composition

Typography involves seven properties. Elevation involves multiple shadow parameters. An agent that assembles these from individual semantic tokens may produce syntactically valid but semantically incorrect combinations — for example, pairing a `large` font size with a `close` line-height that is authored for `medium`. Foundation Styles encode the validated composition once.

**Apply `typography-*` classes** for all text styling. Never decompose font-family, size, weight, line-height, and letter-spacing individually.

**Apply `elevation-*` classes** for shadows. Never hardcode `box-shadow` values.

---

## Component archetypes

The program defines canonical decision models for seven component types:

| Archetype | Status |
|-----------|--------|
| Button | Active |
| Dialog | Active |
| Input | Active |
| Badge | In validation |
| Select | In validation |
| Card | In validation |
| Tabs | In validation |

An archetype is not a library-specific implementation. It is a reusable reasoning model: given a component type, how should an agent think through its token decisions?

Every component must be decomposed into these decision areas:

- **Surface** — background color by semantic role and state
- **Content** — text and icon colors
- **Border** — color, width, and radius (never hardcoded)
- **Focus** — keyboard focus ring from `interface.focus.*` tokens
- **Disabled** — opacity or color variation, not custom values
- **Feedback** — success, warning, danger states via `interface.feedback.*`
- **Spacing** — from confirmed semantic dimension aliases only
- **Typography** — via Foundation Styles classes or sanctioned semantic token paths
- **Elevation** — via Foundation Styles classes or semantic elevation tokens

---

## Hard rules

The following rules are absolute across all component work:

1. **Never hardcode token-owned values.** No raw `px`, `hex`, `rgba()`, or `box-shadow` unless explicitly requested by the operator.
2. **Never guess token names.** Always read the compiled output first.
3. **Prefer sanctioned generated styles.** `typography.css` and `elevation.css` classes before atomic composition.
4. **Use Semantic as the default layer.** Brand, Mode, and Surface tokens are internal — not for component consumption.
5. **Never silently change generators, schemas, or generated `data/`.** Any change to engine behavior requires operator approval.

---

## Color and interaction rule

When choosing colors, reason by semantic intent — not by visual memory:

1. What is the component role? (action, neutral, feedback, ambient)
2. What state is being styled? (default, hover, focus, active, disabled)
3. Which semantic branch carries that intent?

Token families for component color:

- `interface.function.*` — primary, secondary, ghost interactive controls
- `interface.feedback.*` — success, warning, danger, information states
- `brand.ambient.*` — decorative brand presence (not for interactive controls)
- `color.text.*` — typography colors

Do not reduce the problem to "pick a blue" or "pick a gray."

---

## Portal rule for headless UI libraries

Libraries like Base UI, Radix Primitives, and Floating UI render certain components (Dialog, Tooltip, Dropdown, Popover) via a **portal** — attached to `document.body`, outside the React app root. CSS custom properties do not cascade upward, so if the theme class is applied only to the app root, portal-rendered components receive no token values.

**Required:** apply the theme class (e.g., `aplica_joy-light-positive`) to `document.body`:

```typescript
// main.tsx / _app.tsx / entry point
document.body.classList.add('aplica_joy-light-positive');
```

This must be treated as a validation requirement for Dialog, Tooltip, Dropdown, Popover, and Menu components.

---

## Validation requirement

A consumption rule is not operationally trustworthy until it has been validated in a real sandbox implementation. The program uses two sandboxes:

| Sandbox | Role |
|---------|------|
| `test-sandbox/` (Base UI) | Primary training sandbox — canonical archetype examples |
| Radix Primitives | Parity sandbox — verifies the contract is not coupled to Base UI |

Validation checks for each archetype:

- No hardcoded token-owned values
- Correct theme propagation (including portals)
- Correct interaction states (hover, focus, active, disabled)
- Correct layer usage (Semantic, then Foundation Styles)
- Correct output format usage (CSS vars, ESM, etc.)

---

## Consuming the program

The AI UI Integration Program reaches consumer workspaces via the `ai:init` command, which injects four files:

- `docs/context/aplica-ui-integration.md` — the baseline integration guide for any AI surface
- `.cursor/rules/aplica-ui-integration.mdc` — Cursor rule
- `.claude/skills/aplica-ui-integration/SKILL.md` — Claude Code skill
- `.github/instructions/aplica-ui.instructions.md` — GitHub Copilot instructions

These files are updated with each engine release. Re-running `ai:init` after an upgrade keeps the guidance current.

---

## Boundary: what this program does not authorize

The AI UI Integration Program governs documentation, sandbox implementations, skills, templates, and code review. It does **not** authorize:

- Changes to generated token descriptions
- Changes to generation schemas
- Changes to engine scripts
- Changes to generated `data/` outputs
- Changes to output contracts

Any change to engine behavior must be proposed and approved by the operator separately.

---

## References

- AI Skills Injection (how the program reaches consumer workspaces): [../04-theme-engine/07-ai-skills-injection.md](../04-theme-engine/07-ai-skills-injection.md)
- Foundation Styles (preferred consumption surface): [../04-theme-engine/06-foundation-styles.md](../04-theme-engine/06-foundation-styles.md)
- Component token contract: [01-component-token-contract.md](./01-component-token-contract.md)
