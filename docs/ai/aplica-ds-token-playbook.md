# Playbook para assistentes de IA — Aplica DS (repositório aplica-ds-docs)

Este arquivo orienta agentes que respondem sobre **Aplica Design System**, **Aplica Tokens Theme Engine** e a **documentação publicada** neste monorepo. **Não substitui** os artigos em `apps/docs/docs/`; use-os como fonte de verdade.

---

## O que é este repositório

- **`apps/docs`**: site de documentação (Docusaurus v3). Conteúdo em **`apps/docs/docs/**/*.md`** (locale padrão **pt-BR**).
- **`apps/site`**: site institucional (Astro).
- O **código do Theme Engine** (scripts `config/`, `data/`, `dist/`) **não mora aqui**; este repo contém a **especificação e o guia** em Markdown. Explicações técnicas do pipeline devem seguir os artigos listados abaixo.

**Autoria upstream:** o conteúdo costuma ser editado em `aplica-ds-concept` e migrado para cá (ver [README.md](../../README.md) na raiz do repo). Se algo parecer desatualizado, considere que a KB de origem pode ter mudado.

**Sites públicos (complemento):** [docs.aplica.me](https://docs.aplica.me), [aplica.me](https://aplica.me). Preferir **citar arquivos deste repo** para respostas rastreáveis em PR/review.

---

## Regras para o agente

1. **Perguntas conceituais** (tokens, camadas, Theme Engine, Figma, tutoriais): use a ferramenta de leitura de arquivos para abrir os `.md` listados na [matriz tópico → arquivo](#matriz-tópico--arquivo-interno) **antes** de afirmar definições, regras ou exemplos de naming.
2. **Não inventar** namespaces, caminhos de token ou detalhes do pipeline que não apareçam na documentação local. Se não houver cobertura no repo, diga explicitamente que falta fonte aqui.
3. **Resposta:** resumo claro + **caminhos relativos à raiz do repo** (ex.: `apps/docs/docs/02-token-layers/05-foundation-layer.md`). Quando for citação de regra, inclua trecho curto do artigo.
4. **Inglês:** espelho em `apps/docs/i18n/en-US/docusaurus-plugin-content-docs/current/` com a **mesma árvore de pastas e nome de arquivo** que em `apps/docs/docs/`.

---

## Pipeline e papéis (resumo)

Arquitetura em camadas (sequencial + Dimension ortogonal) e papel do Theme Engine estão descritos em:

- [apps/docs/docs/01-design-tokens-fundamentals/01-token-architecture.md](../../apps/docs/docs/01-design-tokens-fundamentals/01-token-architecture.md)
- [apps/docs/docs/04-theme-engine/01-what-is-theme-engine.md](../../apps/docs/docs/04-theme-engine/01-what-is-theme-engine.md)

Fluxo mental: **Brand → Mode → Surface → Semantic → Foundation**, com **Dimension** alimentando Semantic/Foundation.

---

## Semantic vs Foundation (âncoras)

| Camada | Papel | Audiência típica |
|--------|--------|------------------|
| **Semantic** | Taxonomia canônica exportada; nomes longos com propósito (`semantic.color.interface…`). | Engenharia de DS / implementação de componentes. |
| **Foundation** | Aliases que apontam para Semantic; nomes curtos (`foundation.*`); composites (tipografia, sombra, gradiente) para Figma. | Times de produto / telas; redução de carga cognitiva. |

Leitura obrigatória para detalhes e exemplos:

- [apps/docs/docs/02-token-layers/04-semantic-layer.md](../../apps/docs/docs/02-token-layers/04-semantic-layer.md)
- [apps/docs/docs/02-token-layers/05-foundation-layer.md](../../apps/docs/docs/02-token-layers/05-foundation-layer.md)

Área **`semantic.color.product.*`**: semântica de produto mais flexível; ver o mesmo capítulo Semantic.

---

## Públicos e trilhas

- Trilhas oficiais (Nível 1 Product Designer, Nível 2 System Designer):  
  [apps/docs/docs/00-overview/02-learning-path.md](../../apps/docs/docs/00-overview/02-learning-path.md)
- Visão e Foundation no produto:  
  [apps/docs/docs/00-overview/01-aplica-ds-vision.md](../../apps/docs/docs/00-overview/01-aplica-ds-vision.md)
- Glossário:  
  [apps/docs/docs/00-overview/03-glossary.md](../../apps/docs/docs/00-overview/03-glossary.md)

**Pastas de tutoriais:**

- N1 (product designer): `apps/docs/docs/08-tutorials/n1-product-designer/`
- N2 (system designer): `apps/docs/docs/08-tutorials/n2-system-designer/`
- N3 (design engineer): `apps/docs/docs/08-tutorials/n3-design-engineer/`

Se o papel do usuário for desconhecido, começar pelo **N1** (Foundation + workflow + cores + dimension) e aprofundar só se pedirem.

---

## Matriz tópico → arquivo interno

Use estes caminhos a partir da **raiz do repositório** `aplica-ds-docs/`.

| Tópico | Arquivo(s) pt-BR |
|--------|-------------------|
| Arquitetura de tokens (5 camadas + Dimension) | `apps/docs/docs/01-design-tokens-fundamentals/01-token-architecture.md` |
| Camadas Brand / Mode / Surface / Dimension | `apps/docs/docs/02-token-layers/01-brand-layer.md`, `02-mode-layer.md`, `03-surface-layer.md`, `06-dimension-layer.md` |
| Semantic | `apps/docs/docs/02-token-layers/04-semantic-layer.md` |
| Foundation | `apps/docs/docs/02-token-layers/05-foundation-layer.md` |
| O que é o Theme Engine + pipeline + outputs | `apps/docs/docs/04-theme-engine/01-what-is-theme-engine.md` |
| Workflow designer / Figma | `apps/docs/docs/04-theme-engine/02-designer-workflow.md` |
| Configuração / build / formatos de saída | `apps/docs/docs/04-theme-engine/03-configuration-guide.md`, `04-build-pipeline.md`, `05-output-formats.md` |
| Fundamentos visuais (cores, tipo, espaço, opacidade, matemática) | `apps/docs/docs/03-visual-foundations/` |
| Contrato de componentes / dark mode teórico | `apps/docs/docs/05-components-theory/` |
| História / migração v1–v2 | `apps/docs/docs/06-history/` |
| Implementação e integração em plataforma | `apps/docs/docs/07-implementation/01-migration-guide.md`, `07-implementation/02-platform-integration.md` |
| Tutoriais por persona | `apps/docs/docs/08-tutorials/n1-product-designer/`, `n2-system-designer/`, `n3-design-engineer/` |

**Espelho EN:** prefixo `apps/docs/i18n/en-US/docusaurus-plugin-content-docs/current/` + mesmo sufixo de caminho (ex.: `.../current/02-token-layers/05-foundation-layer.md`).

---

## Perguntas operacionais (este monorepo)

Comandos e workspaces: ver `CLAUDE.md` na raiz e `package.json` (scripts `dev:docs`, `dev:site`, `build`).
