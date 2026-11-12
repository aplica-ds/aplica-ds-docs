---
title: "AI Skills Injection"
lang: en
---

# AI Skills Injection

## What it is

The `ai:init` command copies a set of versioned editor integration files from the engine package into the consumer workspace. These files teach AI coding assistants — Cursor, Claude Code, and GitHub Copilot — how to correctly consume Aplica design tokens when generating or modifying UI code.

Without these files, an AI assistant has no knowledge of the token contract: it may guess variable names, hardcode values, or compose tokens incorrectly.

---

## Running the command

```bash
npx theme-engine ai:init
```

> `ai:init`, `ai:setup`, `skills`, and `skills:init` are all aliases for the same command.

Run once after installation. Re-run after every package upgrade to keep the injected guidance in sync with the current token contract.

---

## Files injected

| Destination | Tool | Purpose |
|-------------|------|---------|
| `docs/context/token-concepts.md` | All AI surfaces | N1 reference — what a token is, anatomy of the semantic path, the 4 color categories with a decision tree, dimension scale, densities, typography categories |
| `docs/context/engineering-guide.md` | All AI surfaces | N3 reference — CSS variable consumption, dark mode implementation, portal pattern for headless UI, build pipeline, token contract guarantees |
| `.cursor/rules/theme-engine.mdc` | Cursor | Mirror of the `theme-engine` skill — engine expert with N1/N2/N3 level detection |
| `.cursor/rules/aplica-components.mdc` | Cursor | Mirror of the `aplica-components` skill — component patterns with Aplica tokens |
| `.claude/skills/theme-engine/SKILL.md` | Claude Code | Engine expert — detects N1/N2/N3 from vocabulary and answers at the right depth; contains token concepts, color vocabulary, every config key, diagnostics and CLI reference |
| `.claude/skills/aplica-components/SKILL.md` | Claude Code | Component engineer — real CSS variable patterns, dark mode, portal pattern for headless UI (Radix/Base UI), typography/elevation, archetype checklist |
| `.claude/commands/` | Claude Code | 6 guided-workflow slash commands (see below) |
| `CLAUDE.md` | Claude Code | Workspace operating context — copied once, not overwritten if it already exists |
| `.github/instructions/theme-engine.instructions.md` | GitHub Copilot | Mirror of the `theme-engine` skill for Copilot |
| `.github/instructions/aplica-components.instructions.md` | GitHub Copilot | Mirror of the `aplica-components` skill for Copilot |

All files are versioned inside the package at `templates/ai-skills/`. The command copies them verbatim into the consumer workspace.

Since version 3.15, `ai:init` also copies a static `DESIGN.md` to the workspace root — a snapshot of resolved values for the reference brand (colors, typography, spacing, components) in the Google Stitch format. AI tools compatible with the spec use this file automatically. To generate it with your own brand's real values, use [`theme-engine design:md`](./08-design-file-format.md).

Since version 3.16, `ai:init` also installs the **Knowledge Guide** in every AI tool. To install only the conversational skill, use [`theme-engine ai:knowledge`](./10-knowledge-guide.md).

Since version 3.19.2, `ai:init` ships **self-contained skills with embedded knowledge** and **6 slash commands** for Claude Code — see the section below.

---

## AI skills system architecture (v3.19.2)

Since version 3.19.2 the system runs on **self-contained skills** — the knowledge is embedded in the skills, not in an external central document. No skill depends on a network call or an optional file to work.

**Before (v3.19.1):** a central SSOT playbook (`theme-engine-playbook.md`) + thin wrappers that delegated to it.

**Now (v3.19.2+):** two specialized skills with embedded knowledge, complemented by two local reference docs segmented by audience.

```
.claude/skills/theme-engine/SKILL.md
    → Engine expert: architecture, config keys, CLI, diagnostics
    → Detects N1 (designer) / N2 (system designer) / N3 (engineer) from vocabulary
    → Reads docs/context/token-concepts.md for depth when needed

.claude/skills/aplica-components/SKILL.md
    → Component engineer: CSS variables, dark mode, portal pattern, archetypes
    → Reads docs/context/engineering-guide.md for implementation reference

docs/context/token-concepts.md       ← N1: concepts, color, dimension, typography
docs/context/engineering-guide.md    ← N3: consumption, dark mode, portal, build, contract
```

**Core principle:** everything is resolved locally. The assistants work offline, in private repos and without extra configuration. The AI detects the user's level from their vocabulary and answers at the right depth without asking for explicit identification.

Mirrors for Cursor (`.mdc`) and GitHub Copilot (`.instructions.md`) follow the same model — one skill per specialty.

---

## Slash commands (Claude Code)

After `ai:init`, Claude Code in any consumer workspace gets 6 guided-workflow slash commands:

| Command | Journey | Audience |
|---------|---------|----------|
| `/getting-started` | First orientation — understand the workspace state and the next step | Anyone |
| `/configure-visual` | Map a visual result to the right config key | System Designer |
| `/engineering-integration` | CSS variables, JSON tokens, per-platform consumption | Engineer |
| `/debug` | Diagnose color, contrast or dark mode problems | Anyone |
| `/explain-semantic <topic>` | Understand a config concept or semantic group | Anyone |
| `/build-component` | Build a UI component with the correct Aplica tokens | Engineer |

All commands operate on the workspace's real files — they never invent token names or file paths. Concept commands read `docs/context/token-concepts.md`; implementation commands read `docs/context/engineering-guide.md`.

For more detail on each journey, see [Slash Commands](./11-slash-commands.md).

---

## What the injected guidance covers

The integration files instruct the AI assistant to:

1. **Read `docs/context/token-concepts.md` for token concepts and vocabulary** — color categories, semantic path anatomy, dimension scale, typography.
2. **Read `docs/context/engineering-guide.md` before writing any UI or styling code** — CSS variable consumption patterns, dark mode, portal pattern.
3. **Inspect compiled outputs in `dist/`** to confirm exact variable names before referencing them.
4. **Use semantic tokens as the default component layer** — never reference Brand, Mode, or Surface tokens directly.
5. **Prefer Foundation Styles classes over assembling atomic tokens:**
   - Apply `typography-*` classes for all text styling (not individual font-size, font-weight, line-height)
   - Apply `elevation-*` classes for shadows (not raw box-shadow values)
6. **Never hardcode token-owned values** (`px` dimensions, `hex` colors, `rgba()`, raw box-shadows).
7. **Never guess token names** — always verify from compiled outputs.

---

## When to re-run

Re-run `ai:init` whenever you upgrade the `@aplica/aplica-theme-engine` package. The injected files are versioned with the engine: a new version may add archetype guidance, update consumption rules, or extend coverage to new components. Running the command again overwrites the existing files.

---

## Audience

| Role | Relevance |
|------|-----------|
| System Designer (N2) | Run `ai:init` when setting up a new consumer workspace |
| Design Engineer (N3) | Run `ai:init` after package upgrades; extend the injected files if needed for project-specific rules |
| Component Author (N1+) | Benefits from the injected guidance automatically when the AI assistant activates the skill |

---

## References

- Slash Commands — guided workflow journeys: [11-slash-commands.md](./11-slash-commands.md)
- CLI reference (full command list): [../09-engineering/05-cli-reference.md](../09-engineering/05-cli-reference.md)
- Foundation Styles (preferred consumption path): [06-foundation-styles.md](./06-foundation-styles.md)
- AI UI Integration Program: [../05-components-theory/04-ai-ui-integration.md](../05-components-theory/04-ai-ui-integration.md)
- Design.md — resolved value context for AI tools: [08-design-file-format.md](./08-design-file-format.md)
- Knowledge Guide — conversational skill for configuration and diagnostics: [10-knowledge-guide.md](./10-knowledge-guide.md)
