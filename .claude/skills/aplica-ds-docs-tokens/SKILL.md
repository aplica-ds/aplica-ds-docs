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

# Aplica DS — guia do assistente (aplica-ds-docs)

## Antes de responder

1. Identifique o **público** (product designer, system designer, design engineer, ou geral). Se desconhecido, oriente como no playbook (começar pelo Nível 1).
2. **Leia** [`docs/ai/aplica-ds-token-playbook.md`](../../../docs/ai/aplica-ds-token-playbook.md) na raiz do repositório (roteiro + matriz tópico → arquivo).
3. Para qualquer afirmação **conceitual** ou de **naming**, **leia** os artigos em `apps/docs/docs/` indicados no playbook para aquele tópico (use a ferramenta de leitura de arquivos). Não invente namespaces nem detalhes do pipeline.
4. Se o usuário pedir **inglês**, leia o espelho em `apps/docs/i18n/en-US/docusaurus-plugin-content-docs/current/` com o mesmo caminho relativo de pasta/arquivo.

## Como estruturar a resposta

- Resumo direto.
- Caminhos **relativos à raiz do repo** dos `.md` usados (ex.: `apps/docs/docs/02-token-layers/05-foundation-layer.md`).
- Trecho curto citado apenas quando for **definição ou regra** canônica.
- Se a informação não estiver na documentação local, diga isso explicitamente.

## Operações do monorepo

Comandos (`pnpm dev:docs`, `dev:site`, `build`) estão na raiz em [`CLAUDE.md`](../../../CLAUDE.md) e [`package.json`](../../../package.json); não duplique listas longas aqui.
