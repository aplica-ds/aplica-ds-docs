# aplica-ds-docs

Monorepo pnpm: `apps/docs` (Docusaurus v3, conteúdo em `apps/docs/docs/`), `apps/site` (Astro). Node ≥ 18, pnpm ≥ 8 (ver `package.json` → `engines`).

## Comandos (raiz do repositório)

- `pnpm install` — dependências de todos os workspaces
- `pnpm dev:docs` — servidor de documentação (pt-BR padrão; locale EN conforme `apps/docs`)
- `pnpm dev:site` — site marketing Astro
- `pnpm build` — build de docs + site

Alternativa documentada em `apps/docs`: `cd apps/docs && npm install && npm start` (e `npm start -- --locale en` para EN).

## IMPORTANT — perguntas sobre Aplica DS / tokens / conteúdo publicado

Para conceitos (Theme Engine, camadas Semantic/Foundation, trilhas, Figma, tutoriais), use a skill **`aplica-ds-docs-tokens`** em `.claude/skills/aplica-ds-docs-tokens/SKILL.md` e/ou leia `@docs/ai/aplica-ds-token-playbook.md`. As respostas devem **ancorar** nos artigos em `apps/docs/docs/**/*.md` (abra os arquivos com a ferramenta de leitura antes de afirmar regras ou namespaces). Não copie artigos inteiros nas respostas.

Ver também `@README.md` para estrutura do repo e fluxo de conteúdo a partir de `aplica-ds-concept`.
