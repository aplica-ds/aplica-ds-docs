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
| `docs/context/aplica-ui-integration.md` | All AI surfaces | Agnostic integration guide: token consumption workflow, hard rules, and archetype mapping |
| `.cursor/rules/aplica-ui-integration.mdc` | Cursor | Rule file that activates when editing UI files (`*.js`, `*.jsx`, `*.ts`, `*.tsx`, `*.css`, `*.html`, `*.vue`, `*.svelte`) |
| `.claude/skills/aplica-ui-integration/SKILL.md` | Claude Code | Skill triggered when the user asks to build or style UI components |
| `.github/instructions/aplica-ui.instructions.md` | GitHub Copilot | Instruction file loaded by Copilot when working in the repository |

All files are versioned inside the package at `templates/ai-skills/`. The command copies them verbatim into the consumer workspace.

---

## What the injected guidance covers

The integration files instruct the AI assistant to:

1. **Read `docs/context/aplica-ui-integration.md` before writing any UI or styling code** — this is the single source of truth for the consumer's token contract.
2. **Inspect compiled outputs in `dist/`** to confirm exact variable names before referencing them.
3. **Use semantic tokens as the default component layer** — never reference Brand, Mode, or Surface tokens directly.
4. **Prefer Foundation Styles classes over assembling atomic tokens:**
   - Apply `typography-*` classes for all text styling (not individual font-size, font-weight, line-height)
   - Apply `elevation-*` classes for shadows (not raw box-shadow values)
5. **Never hardcode token-owned values** (`px` dimensions, `hex` colors, `rgba()`, raw box-shadows).
6. **Never guess token names** — always verify from compiled outputs.

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

- CLI reference (full command list): [../09-engineering/05-cli-reference.md](../09-engineering/05-cli-reference.md)
- Foundation Styles (preferred consumption path): [06-foundation-styles.md](./06-foundation-styles.md)
- AI UI Integration Program: [../05-components-theory/04-ai-ui-integration.md](../05-components-theory/04-ai-ui-integration.md)
