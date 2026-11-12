---
title: "Knowledge Guide — Conversational AI for Configuration"
lang: en
---

# Knowledge Guide — Conversational AI for Configuration

## What it is

`ai:knowledge` installs a conversational skill into every AI tool in the workspace (Claude Code, Cursor, GitHub Copilot). Once the skill is loaded, the AI assistant works as an expert guide: it reads the project's real configuration files and answers questions about architecture, configuration and workflow — instead of just executing tasks.

It is the conversational counterpart of `ai:init`: while the integration skill teaches the AI *how to generate code*, the Knowledge Guide teaches the AI *how to guide the developer*.

---

## Why it exists

Most people use AI to ask questions before they execute anything. "How do I add a new brand?" comes before "add a new brand". Without system context, the AI guesses — it uses generic variable names, invents file paths, and describes flows that do not apply to the Aplica architecture.

The Knowledge Guide fixes that: it injects the file map, the key concepts and the diagnostic patterns straight into the assistant's context, before any question is asked.

---

## Two ways to install

### Via `ai:knowledge` (standalone skill)

```bash
theme-engine ai:knowledge
```

Installs only the Knowledge Guide. Use it when the integration skills are already installed and you want to add the conversational skill separately.

### Via `ai:init` (full setup)

```bash
theme-engine ai:init
```

Installs everything: code integration skills + DESIGN.md + Knowledge Guide. Recommended on first setup or after package updates.

> `ai:knowledge`, `ai:guide` and `knowledge:init` are aliases of the same command.

---

## Installed files

| Destination | Tool | Purpose |
|-------------|------|---------|
| `.claude/skills/aplica-knowledge-guide/SKILL.md` | Claude Code | Skill activated when asking about configuration or architecture |
| `.cursor/rules/aplica-knowledge-guide.mdc` | Cursor | Rule with globs for config files (`themes.config.json`, `*.config.mjs`) |
| `.github/instructions/aplica-knowledge.instructions.md` | GitHub Copilot | Instruction loaded when working in the repository |
| `docs/context/aplica-knowledge-guide.md` | All tools | Agnostic version — load it manually into the context of any AI tool |

---

## What the assistant can answer

### Configuration

- "How do I add a new brand?"
- "How do I configure dark mode to be more saturated?"
- "What does `ghostNormalTxtOnStrategy` do?"
- "How do I override the hover color of an interaction state?"
- "Which brands are active in my workspace right now?"

### Diagnostics

- "My hover color looks the same as default — where do I look?"
- "Dark mode looks washed out / desaturated — what do I adjust?"
- "Text is unreadable on a colored surface — what do I check?"
- "Ghost elements have an unexpected text color — why?"

### Workflow and build

- "What is the correct command order for a full build?"
- "I only changed the dimension config — do I need to run the whole build?"
- "How do I see the generated tokens visually?"

### AI and contracts

- "How do I update the AI context after changing the brand colors?"
- "How do I check whether a token I renamed will break the component library?"

---

## Difference vs. `aplica-ui-integration`

| Skill | Mode | Activates when |
|-------|------|----------------|
| `aplica-ui-integration` | Execution | The user asks to generate or style UI code |
| `aplica-knowledge-guide` | Conversation | The user asks about configuration, architecture or diagnostics |

The two skills are complementary — install both via `ai:init`.

---

## What the assistant does when it receives a question

1. **Reads the workspace config files** — `themes.config.json`, `aplica-theme-engine.config.mjs`, `config/`, `data/dimension/`
2. **Answers from the real configuration** — not from generic defaults
3. **Explains the concept before suggesting the action** — teaches the why, not just the how
4. **Points to where to find more detail** — local docs in `docs/context/` or docs.aplica.me

---

## When to re-run

Re-run `ai:knowledge` (or `ai:init`) after every package update. The Knowledge Guide is versioned with the engine — new versions may expand the diagnostic patterns, add new concepts or update configuration references.

---

## Audience

| Role | What to do |
|------|-----------|
| **System Designer (N2)** | Install via `ai:init` during setup. Use the assistant to understand how to configure brands and dimensions. |
| **Design Engineer (N3)** | Install and use it for token diagnostics and build workflow guidance. |
| **Component Author (N1+)** | The Knowledge Guide is mainly for people who configure the engine — it is not needed to consume tokens. |

---

## References

- AI Skills Injection — code generation skills: [07-ai-skills-injection.md](./07-ai-skills-injection.md)
- Design.md — visual context snapshot for AI: [08-design-file-format.md](./08-design-file-format.md)
- Deploy Safety Contracts — structural token validation in CI: [09-deploy-safety-contracts.md](./09-deploy-safety-contracts.md)
- CLI Reference — all commands: [../09-engineering/05-cli-reference.md](../09-engineering/05-cli-reference.md)
