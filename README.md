# aplica-ds-docs

Public-facing sites for **Aplica DS** — the open-source design token system with a 5-layer architecture, dynamic theme generation, and multi-platform support.

This monorepo contains two products:

| App | Tech | URL | Description |
|-----|------|-----|-------------|
| `apps/site` | Astro | `aplica.design` | Institutional/marketing site |
| `apps/docs` | Docusaurus v3 | `docs.aplica.design` | Full documentation (pt-BR + en) |

---

## What is Aplica DS?

Aplica DS is a design token system built around a **5-layer sequential architecture** plus one orthogonal layer:

```
Brand → Mode → Surface → Semantic → Foundation
                                  ↑
                             Dimension (orthogonal: minor / normal / major)
```

The **Aplica Tokens Theme Engine** takes a single `*.config.mjs` file and produces:
- CSS Custom Properties
- JSON, ESM, CJS tokens
- TypeScript declarations
- Dark mode by design (OKLCh pipeline — no manual overrides needed)

---

## Repository structure

```
aplica-ds-docs/
├── apps/
│   ├── site/                 ← Astro marketing site
│   │   └── src/
│   │       ├── layouts/      ← Base.astro
│   │       ├── components/   ← Nav.astro, Footer.astro
│   │       └── pages/        ← index, como-funciona, para-quem, sobre, changelog
│   │           └── en/       ← English versions
│   └── docs/                 ← Docusaurus v3 documentation
│       ├── docs/             ← pt-BR content (default locale)
│       │   ├── 00-overview/
│       │   ├── 01-design-tokens-fundamentals/
│       │   ├── 02-token-layers/
│       │   ├── 03-visual-foundations/
│       │   ├── 04-theme-engine/
│       │   ├── 05-components-theory/
│       │   ├── 06-history/
│       │   ├── 07-implementation/
│       │   └── 08-tutorials/
│       │       ├── n1-product-designer/   (6 tutorials)
│       │       ├── n2-system-designer/    (6 tutorials)
│       │       └── n3-design-engineer/    (6 tutorials)
│       ├── i18n/
│       │   └── en/
│       │       └── docusaurus-plugin-content-docs/current/
│       │           └── ...   ← English content (mirrors docs/)
│       ├── docusaurus.config.ts
│       └── sidebars.ts
├── packages/                 ← Shared packages (future)
│   └── ui/
├── package.json              ← pnpm workspaces root
└── pnpm-workspace.yaml
```

**Documentation content:** 48 articles × 2 languages (pt-BR + en) = 96 files.  
Content is sourced from [`aplica-ds-concept`](../aplica-ds-concept) and migrated via `scripts/migrate-to-docusaurus.py`.

---

## Getting started

### Prerequisites

- Node.js ≥ 18
- npm or pnpm ≥ 8

### Running the docs site

```bash
cd apps/docs
npm install
npm start                       # pt-BR (default) at localhost:3000
npm start -- --locale en        # English at localhost:3000
```

### Running the marketing site

```bash
cd apps/site
npm install
npm run dev                     # localhost:4321
```

### Building both

```bash
# From repo root (requires pnpm)
pnpm install
pnpm build
```

---

## Content workflow

The documentation content lives in the `aplica-ds-concept` repository (the authoring source). This repo contains the **published output** — content migrated into the Docusaurus i18n structure.

### To update content after editing the source KB

```bash
# In aplica-ds-concept/
python scripts/migrate-to-docusaurus.py
```

The script:
1. Copies `knowledge-base/**/*.pt-BR.md` → `apps/docs/docs/**/*.md`
2. Copies `knowledge-base/**/*.en.md` → `apps/docs/i18n/en/.../**/*.md`
3. Cleans internal link references (removes `.pt-BR` / `.en` suffixes)
4. Is idempotent — safe to re-run

### Adding a new article

1. Write the article in `aplica-ds-concept/knowledge-base/` following the naming convention: `{number}-{slug}.pt-BR.md`
2. Translate to `{number}-{slug}.en.md`
3. Run `migrate-to-docusaurus.py`
4. Commit both repos

### File naming convention

```
{section}/
├── {number}-{slug}.pt-BR.md   ← source (authored here)
└── {number}-{slug}.en.md      ← translation
```

Numbers (`01-`, `02-`…) define reading order within each section. Sections are numbered `00-` through `08-`.

---

## i18n

Default locale: **pt-BR**. Available locales: `pt-BR`, `en`.

- pt-BR content: `apps/docs/docs/`
- English content: `apps/docs/i18n/en/docusaurus-plugin-content-docs/current/`
- Sidebar category labels in English: `apps/docs/i18n/en/docusaurus-plugin-content-docs/current.json` *(to be created)*

To add a new locale, extend `docusaurus.config.ts → i18n.locales` and create the corresponding `i18n/{locale}/` folder.

---

## Search

Search is configured via **Algolia DocSearch** (free for open-source projects).

To activate:
1. Apply at [docsearch.algolia.com](https://docsearch.algolia.com)
2. Once approved, uncomment the `algolia` block in `apps/docs/docusaurus.config.ts` and fill in `appId`, `apiKey`, and `indexName`

Until then, Docusaurus uses local search (Lunr) automatically.

---

## Deploy

Both apps deploy independently via Vercel (or Netlify).

| App | Build command | Output dir | Root dir |
|-----|---------------|------------|----------|
| `apps/site` | `npm run build` | `dist/` | `apps/site` |
| `apps/docs` | `npm run build` | `build/` | `apps/docs` |

Docusaurus multi-locale build:
```bash
npm run build   # builds all locales into build/
```

---

## Tutorial learning tracks

The docs include 18 tutorials across three progressive tracks:

| Track | Audience | Tutorials | Est. time |
|-------|----------|-----------|-----------|
| **N1 · Product Designer** | Uses the system in Figma | 6 | ~3h |
| **N2 · System Designer** | Configures and extends the system | 6 | ~4h |
| **N3 · Design Engineer** | Builds components and integrates tokens | 6 | ~5h |

Prerequisites: N2 requires N1 · N3 requires N2.

---

## Contributing

Contributions are welcome. Please read the guidelines below before opening a PR.

### What belongs in this repo

- Fixes to the migrated documentation (typos, broken links, formatting)
- Improvements to `apps/site` pages
- Improvements to `apps/docs` configuration (sidebars, theme, plugins)
- New locale support

### What belongs in `aplica-ds-concept`

- New articles or tutorial content
- Translations
- Structural changes to the knowledge base

### Workflow

1. Fork this repository
2. Create a branch: `git checkout -b fix/typo-in-semantic-layer`
3. Make your changes
4. Run `npm run build` in the affected app to verify no build errors
5. Open a pull request

---

## License

MIT — see [LICENSE](./LICENSE).

---

## Related repositories

| Repository | Description |
|-----------|-------------|
| `aplica-ds-concept` | Authoring source — knowledge base, scripts, roadmaps |
| `aplica-tokens-theme-engine` | The token generator engine (public, universal version) |