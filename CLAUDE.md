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

## Privacy & Compliance

### Mandatory rules when adding or modifying tracking, analytics, or third-party scripts

1. **Never add third-party scripts without a consent gate.** Any script that sends data to external servers must be loaded conditionally via `localStorage['aplica-consent']` check. GA4 is the only analytics service in use — any new service requires the same treatment.

2. **New data processors** → update the Privacy Policy at `apps/site/src/pages/privacy.astro` (PT-BR) and `apps/site/src/pages/en/privacy.astro` (EN), specifically section 4 (processors) and section 5 (retention).

3. **New pages in the Astro site** → always use `Base.astro` as the layout. `CookieConsent.astro` is injected automatically by `Base.astro` — do not add it manually to individual pages.

4. **Forms that collect personal data** → any form collecting name, email, or other personal data requires: (a) a privacy policy link adjacent to the form, and (b) the data processor documented in the privacy policy.

5. **Google Fonts** → already served via CDN (Google receives IPs). If adding new fonts, prefer self-hosting. If using CDN, document the processor in the privacy policy.

### Existing compliance artifacts

| Artifact | Purpose |
|----------|---------|
| `apps/site/src/components/CookieConsent.astro` | Cookie consent banner (Astro site) |
| `apps/docs/src/clientModules/cookieConsent.js` | Cookie consent banner (Docusaurus docs) |
| `apps/site/src/pages/privacy.astro` | Privacy Policy — PT-BR |
| `apps/site/src/pages/en/privacy.astro` | Privacy Policy — EN |

Consent key: `localStorage['aplica-consent']` → `{ analytics: boolean, ts: ISO-string, v: "1" }`  
Contact for data requests: privacy@aplica.me
