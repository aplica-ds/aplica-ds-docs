---
title: "Slash Commands"
lang: en
---

# Slash Commands

## What they are

After running `theme-engine ai:init`, Claude Code in any consumer workspace gets 6 guided-workflow slash commands. Each command wraps a complete journey — from first orientation to building components — and reads the workspace's real files before answering.

The commands are installed in `.claude/commands/` at the root of the consumer workspace.

---

## The 6 commands

### `/getting-started` — Journey 1: First orientation

**Audience:** anyone who just installed or configured the workspace.

The command reads `docs/context/token-concepts.md` (concepts and architecture), then reads the workspace's real config files (`themes.config.json`, `aplica-theme-engine.config.mjs`) and answers with:

1. **What exists** — configured brands, config paths, `dist/` status.
2. **What is missing** — if there is no config, it recommends `theme-engine init`; if there is config but `dist/` is empty, it recommends `theme-engine build`.
3. **A concrete next step** — a single CLI command with the reasoning.
4. **Available AI commands** — lists the 6 slash commands so the user knows what they can ask for.

> The command never invents brand names or token paths. It only reports what it read.

---

### `/configure-visual` — Journey 2: Visual result

**Audience:** a System Designer who wants a specific visual result (darker hover, more saturated dark mode, readable text on a colored surface).

The command maps the visual intent to the right `config key` using `docs/context/token-concepts.md` as the reference, reads the relevant brand's config file, and proposes the exact change — file, key path and value.

---

### `/engineering-integration` — Journey 3: Code integration

**Audience:** a component or frontend engineer who needs to consume tokens in real code.

Covers:
- How to import and use CSS custom properties from `dist/css/`
- How to reference the token JSON from `dist/json/`
- Per-platform consumption (React, Vue, Svelte, plain CSS)
- Hard rule: never hardcode values that belong to tokens

---

### `/debug` — Journey 4: Diagnostics

**Audience:** anyone who saw something wrong in the generated tokens.

Usage: `/debug hover color too similar to default`

The command:
1. Reads the diagnostics section of `docs/context/token-concepts.md`.
2. Reads the config files and outputs relevant to the problem category.
3. Diagnoses from the real data — not from assumptions.
4. Proposes **one change at a time**, with a verification step.

**Categories covered:**

| Problem | Config key investigated |
|---------|------------------------|
| Hover too similar to the default state | `interaction.dilution` |
| Washed-out dark mode | `options.darkModeChroma` |
| Unreadable text on a colored surface | `options.txtOnStrategy`, `generation.colorText` |
| Unexpected color on a ghost element | `options.ghostNormalTxtOnStrategy` |
| Build does not update after a config change | `themes.config.json`, `aplica-theme-engine.config.mjs` |
| Figma out of sync | `data/$themes.json`, `data/$metadata.json` |

---

### `/explain-semantic <topic>` — Journey 5: Education

**Audience:** anyone who wants to understand a concept — not just fix a problem.

Examples:
- `/explain-semantic modeResolution`
- `/explain-semantic dilution`
- `/explain-semantic txtOnStrategy`
- `/explain-semantic brand layer`

The command reads `docs/context/token-concepts.md` and the relevant sources before explaining. It includes the path of the file it used in the answer.

---

### `/build-component` — Journey 6: Component construction

**Audience:** an engineer about to write component code with Aplica tokens.

The command reads `docs/context/engineering-guide.md` (token consumption patterns for UI) and `dist/json/<brand>-light-positive.json` (the real generated variable names) before writing any code. It never hardcodes values — it uses CSS variables from `dist/css/` exclusively.

---

## Local knowledge sources

The 6 commands operate on the workspace's real files and read two reference docs installed by `ai:init`:

**`docs/context/token-concepts.md`** — N1/N2 reference, used by the concept and diagnostic commands:
- What a token is and the anatomy of a semantic path
- The 4 color categories with a decision tree
- The dimension scale (nano → tera) and densities
- Typography categories

**`docs/context/engineering-guide.md`** — N3 reference, used by the implementation commands:
- Consuming CSS variables from `dist/css/`
- Dark mode implementation
- Portal pattern for headless UI (Radix/Base UI)
- Build pipeline and token contract guarantees

No command depends on an external document — everything is resolved locally.

---

## How to reinstall after a package update

Slash commands are versioned with the package. After updating `@aplica/aplica-theme-engine`, re-run:

```bash
theme-engine ai:init
```

The files in `.claude/commands/` are overwritten with the updated version. The `CLAUDE.md` at the workspace root is **not overwritten** — if it already exists, the command skips it and prints an informational message.

---

## References

- AI Skills Injection — overview and installed files: [07-ai-skills-injection.md](./07-ai-skills-injection.md)
- Knowledge Guide — complementary conversational skill: [10-knowledge-guide.md](./10-knowledge-guide.md)
- CLI Reference: [../09-engineering/05-cli-reference.md](../09-engineering/05-cli-reference.md)
