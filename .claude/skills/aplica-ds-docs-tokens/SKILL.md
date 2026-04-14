---
name: aplica-ds-docs-tokens
description: >-
  Explains the Aplica DS design token system, Aplica Tokens Theme Engine, Semantic
  vs Foundation layers, learning paths (product designer, system designer, design
  engineer), Docusaurus documentation under apps/docs/docs, Figma and Tokens Studio
  workflow, OKLCh, modes, surfaces, and dimension scales. Use when the user asks
  about Aplica DS, aplica-ds-docs, design tokens, theme engine, semantic tokens,
  foundation tokens, token architecture, documentation navigation, tutorials n1
  n2 n3, or how designers or engineers should consume this repo.
---

# Aplica DS assistant guide (aplica-ds-docs)

## Before answering

1. Identify the **audience** (product designer, system designer, design engineer, or general). If unknown, follow the playbook recommendation (start from Level 1).
2. **Read** [`docs/ai/aplica-ds-token-playbook.md`](../../../docs/ai/aplica-ds-token-playbook.md) from the repository root (guide + topic-to-file matrix).
3. For any **conceptual** or **token naming** claim, **read** the relevant articles under `apps/docs/docs/` listed in the playbook for that topic. Do not invent namespaces or pipeline details.
4. If the user asks for **English**, read the mirror under `apps/docs/i18n/en-US/docusaurus-plugin-content-docs/current/` using the same relative folder/file path.
5. **Always answer in the user language.** If the user writes in Portuguese, answer in pt-BR.

## Response structure

- Direct summary.
- Paths **relative to the repo root** for the source `.md` files used (e.g. `apps/docs/docs/02-token-layers/05-foundation-layer.md`).
- Include a short quote only when referencing a **canonical definition or rule**.
- If the information is not present in local docs, state that explicitly.

## Monorepo operations

Commands (`pnpm dev:docs`, `dev:site`, `build`) live at the root in [`CLAUDE.md`](../../../CLAUDE.md) and [`package.json`](../../../package.json); do not duplicate long command lists here.
