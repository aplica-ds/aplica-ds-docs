# aplica-ds-docs

pnpm monorepo: `apps/docs` (Docusaurus v3, content in `apps/docs/docs/`) and `apps/site` (Astro). Node >= 18 and pnpm >= 8 (see `package.json` -> `engines`).

## Commands (repo root)

- `pnpm install` - install dependencies for all workspaces
- `pnpm dev:docs` - docs dev server (pt-BR default; English locale available)
- `pnpm dev:site` - Astro marketing site
- `pnpm build` - build docs + site

Alternative in `apps/docs`: `cd apps/docs && npm install && npm start` (use `npm start -- --locale en` for English docs).

## IMPORTANT — Aplica DS / tokens / published content

For conceptual topics (Theme Engine, Semantic/Foundation layers, learning paths, Figma, tutorials), use skill **`aplica-ds-docs-tokens`** in `.claude/skills/aplica-ds-docs-tokens/SKILL.md` and/or read `@docs/ai/aplica-ds-token-playbook.md`.

Responses must be anchored in `apps/docs/docs/**/*.md` (read source files before stating rules or namespaces). Do not paste whole articles in responses.

## Language and multilingual references

- Always answer in the user's language.
- If the user writes in Portuguese, answer in pt-BR.
- If the user asks in English (or requests EN), use the i18n mirror under `apps/docs/i18n/en-US/docusaurus-plugin-content-docs/current/` with the same relative path when relevant.

## Ignore policy for versioning changes

Before proposing or changing `.gitignore`, ask whether files should be shared or local-only.

- Shared team assets (skills, rules, docs) should stay versioned.
- Local/personal artifacts should go under `.cursor/local/` or `.claude/local/` (ignored by git).

See also `@README.md` for repository structure and `aplica-ds-concept` content flow.
