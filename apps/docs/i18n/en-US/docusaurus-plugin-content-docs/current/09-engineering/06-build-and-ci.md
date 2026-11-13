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
    "tokens:build":       "theme-engine build",
    "tokens:build:all":   "theme-engine build:all",
    "tokens:themes":      "theme-engine themes:generate",
    "tokens:dimension":   "theme-engine dimension:generate",
    "tokens:sync":        "theme-engine sync:architecture",
    "tokens:foundations": "theme-engine foundations:generate",
    "tokens:figma":       "theme-engine figma:generate",
    "tokens:validate":    "theme-engine validate:data"
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

### Strategy D — Test gate before building themes (v3.20+)

Since v3.20, the `build:themes` script runs `test:theme-engine` automatically before any generation. If any test fails, the build does not proceed.

```bash
npm run build:themes   # test → generate; aborts if tests fail
```

For the full gate before cutting a release, use `prerelease:check` — it aggregates `test:theme-engine`, `test:override-validation` and `test:quick`:

```bash
npm run prerelease:check
```

The four test suites covered by `test:theme-engine`:

| Script | Coverage | Tests |
|--------|----------|-------|
| `test:interaction-overrides` | All override paths (`background`, `txtOnly`, `color`, `border`, validation) | 9 |
| `test:config-matrix` | 15 real `aplica-*` configs × solid/ghost × light/dark × function/feedback × WCAG AA | 120 |
| `test:txtOn-strategies` | `high-contrast`, `brand-tint`, `custom-tint`, `accessibilityLevel` AA/AAA, error validation | 14 |
| `test:decomposition-variants` | `system-scale`, dilution direction/target/anchor, `modeResolution`, ghost integer/dilution, negative surface, ambient-neutral fallback | 17 |

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

## Verifying an upgrade (since 3.25.1)

There are two different checks. Do not mix them up.

**1. Your workspace — did my tokens change?** Run these in your own workspace after upgrading the package:

```bash
theme-engine build
theme-engine contracts:diff --contract ./contracts/<brand>-contract.json   # exits 1 on removed or retyped token paths
theme-engine validate:data
theme-engine audit:accessibility
```

Generate the contract with `theme-engine contracts:generate` **before** upgrading and commit it, so `contracts:diff` has something to compare with. See [Deploy Safety Contracts](../04-theme-engine/09-deploy-safety-contracts.md).

**2. The engine itself — the packaged opacity contract.** The package ships the engine's own backward-compatibility gate for opacity:

```bash
node node_modules/@aplica/aplica-theme-engine/utils/test-opacity-contract.mjs
```

- It checks the **installed engine**, not your workspace: it builds the packaged `fixtures/consumer-workspace` in a temporary folder and compares the result with the frozen `fixtures/opacity-baseline`.
- It takes a few minutes and writes only to the system temp folder.
- It needs both fixture folders, which ship since **3.25.1** (3.25.0 and earlier do not include them; the script stops with a message saying what is missing).
- Never run it with `--update-baseline` in a consumer project: that option rewrites the baseline and is reserved for the package maintainers.

The other `utils/test-*.mjs` scripts are maintainer scripts for the package repository, not checks for consumer workspaces.

---

## Troubleshooting failed CI builds

1. **`No consumer workspace config was found`** — `aplica-theme-engine.config.mjs` is missing or not in the project root. Ensure the file is committed.
2. **`validate:data` fails** — generation schema mismatch. Run `tokens:build` locally and commit the updated `data/`.
3. **Build exits non-zero with no error message** — check Node.js version (requires ≥ 18.0.0).
4. **Fonts not copied** — `assets/fonts/` directory does not exist. Create it or set `copyFonts: false` in `transformers.config.mjs`.

For more, see [07-troubleshooting.md](./07-troubleshooting.md).
