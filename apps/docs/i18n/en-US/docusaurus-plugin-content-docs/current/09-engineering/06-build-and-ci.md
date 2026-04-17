---
title: "Build and CI/CD Integration"
lang: en
---

# Build and CI/CD Integration

This article covers the recommended `package.json` scripts, build strategies for different team workflows, and how to integrate token generation into a CI/CD pipeline.

---

## Recommended `package.json` scripts

```json
{
  "scripts": {
    "tokens:build":       "aplica-theme-engine build",
    "tokens:build:all":   "aplica-theme-engine build:all",
    "tokens:themes":      "aplica-theme-engine themes:generate",
    "tokens:dimension":   "aplica-theme-engine dimension:generate",
    "tokens:sync":        "aplica-theme-engine sync:architecture",
    "tokens:foundations": "aplica-theme-engine foundations:generate",
    "tokens:validate":    "aplica-theme-engine validate:data"
  }
}
```

Use `tokens:build` for all normal use. The others are useful during brand authoring or debugging.

---

## Build strategies

### Strategy A — Full regeneration (recommended for CI)

Run the full pipeline on every CI trigger. Guarantees that `dist/` always reflects the current configuration.

```bash
npm run tokens:build
```

Simple, reliable, and idempotent. The full pipeline completes in a few seconds for most projects.

### Strategy B — Incremental (local development)

When only the output format changed (no color or typography changes), skip data generation and only re-run the Style Dictionary transform:

```bash
npm run tokens:build:all
```

When brand colors changed:

```bash
npm run tokens:themes && npm run tokens:sync && npm run tokens:foundations && npm run tokens:build:all
```

### Strategy C — Validate, then build (pre-publish)

Validate the generated data before building. Catches schema violations before the Style Dictionary step.

```bash
npm run tokens:validate && npm run tokens:build:all
```

---

## CI/CD integration

### GitHub Actions — full pipeline

```yaml
name: Build design tokens

on:
  push:
    branches: [main]
    paths:
      - 'theme-engine/**'
      - 'aplica-theme-engine.config.mjs'

jobs:
  tokens:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Generate and build tokens
        run: npm run tokens:build

      - name: Validate output
        run: npm run tokens:validate

      # Optional: publish dist/ as a package artifact
      - uses: actions/upload-artifact@v4
        with:
          name: token-dist
          path: dist/
```

### GitHub Actions — publish token package

If your project publishes `dist/` as a separate npm package:

```yaml
      - name: Build tokens
        run: npm run tokens:build

      - name: Publish token package
        run: npm publish --access public
        working-directory: ./packages/tokens
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Committing `data/` and `dist/`

| Approach | When to use |
|----------|-------------|
| **Don't commit either** | CI regenerates both. Cleanest approach for teams with reliable CI. |
| **Commit `dist/` only** | When downstream consumers pull from the repo directly (not a published package). Regenerate in CI on each push. |
| **Commit both** | When you want reproducible snapshots for auditing or review. Add generation to a pre-commit hook. |

### Pre-commit hook (commit both)

Install [Husky](https://typicode.github.io/husky/) and add:

```bash
# .husky/pre-commit
npm run tokens:build
git add data/ dist/
```

This ensures `data/` and `dist/` are always in sync with the configuration at commit time.

---

## `.gitignore` recommendations

```gitignore
# Token build outputs — regenerate in CI
/data/
/dist/
```

Or, if committing `dist/`:

```gitignore
# Token source data — regenerate in CI
/data/

# dist/ is committed — do not ignore
```

---

## Windows environments

The CLI works on Windows without additional configuration. If you encounter path resolution issues on Windows, see [07-troubleshooting.md](./07-troubleshooting.md).

---

## Version pinning

Pin the engine version in `package.json` to control when breaking changes affect your build:

```json
{
  "dependencies": {
    "@aplica/aplica-theme-engine": "3.3.1"
  }
}
```

Use a patch-range (`~3.3.0`) for automatic patch updates only. Avoid `^` (caret) ranges if token naming contract stability is critical for your consumers.

---

## Troubleshooting failed CI builds

1. **`No consumer workspace config was found`** — `aplica-theme-engine.config.mjs` is missing or not in the project root. Ensure the file is committed.
2. **`validate:data` fails** — generation schema mismatch. Run `tokens:build` locally and commit the updated `data/`.
3. **Build exits non-zero with no error message** — check Node.js version (requires ≥ 18.0.0).
4. **Fonts not copied** — `assets/fonts/` directory does not exist. Create it or set `copyFonts: false` in `transformers.config.mjs`.

For more, see [07-troubleshooting.md](./07-troubleshooting.md).
