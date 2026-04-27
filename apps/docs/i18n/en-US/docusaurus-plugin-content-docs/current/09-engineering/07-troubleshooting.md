---
title: "Troubleshooting"
lang: en
---

# Troubleshooting

This article covers common errors and how to resolve them, organized by the stage where they appear.

---

## Setup errors

### `No consumer workspace config was found`

**When it appears:** Running any build or generation command before `init`.

**Cause:** The engine cannot find `aplica-theme-engine.config.mjs` in the project root.

**Fix:**
```bash
npx theme-engine init
```

Or create `aplica-theme-engine.config.mjs` manually. See [01-quick-start.md](./01-quick-start.md).

---

### `aplica-theme-engine` command not found

**Cause:** The package is not installed, or the `.bin` directory is not in `PATH`.

**Fix:**
```bash
# Install the package
npm install @aplica/aplica-theme-engine

# Use npx if the binary is not in PATH
npx theme-engine init
```

---

### CLI produces no output on Windows

**Cause:** PowerShell sometimes suppresses output from Node.js processes started via `npx`.

**Fixes:**
1. Run with `node` directly:
   ```powershell
   node .\node_modules\@aplica-ds\aplica-theme-engine\index.mjs init
   ```
2. Switch to Command Prompt (`cmd.exe`) and retry.
3. Ensure Node.js ≥ 18.0.0 is installed (`node -v`).

---

## Generation errors

### `AAA accessibility warning`

**When it appears:** During `themes:generate`.

**Cause:** One or more palette levels do not meet AAA contrast ratio (7:1).

**This is a warning, not a failure.** The build continues with AA fallback (4.5:1).

**Options:**
- **Accept AA fallback** (default) — set `acceptAALevelFallback: true` in the brand config. The engine continues automatically.
- **Change the brand color** — adjust the color in `*.config.mjs` until AAA passes.
- **Switch to AA target** — set `accessibilityLevel: 'AA'` in the brand config to use 4.5:1 as the target.

---

### `No font assets directory found`

**When it appears:** During `build:all`, when `copyFonts: true` in `transformers.config.mjs`.

**Cause:** `assets/fonts/` directory does not exist in the project root.

**This is a warning, not a failure.** All other outputs are still generated.

**Fix:** Either create the `assets/fonts/` directory and add font files, or disable font copying:
```js
// theme-engine/transformers.config.mjs
assets: {
  copyFonts: false,
  generateFontsManifest: false
}
```

---

### `Gradients not propagated`

**When it appears:** During `sync:architecture`, when gradients are enabled.

**Cause:** `themes:generate` has not been run yet, so brand gradient data does not exist.

**Fix:** Always run `themes:generate` before `sync:architecture`, or use the full pipeline:
```bash
npm run tokens:build
```

---

## Build errors

### `validate:data` exits non-zero

**When it appears:** When running `theme-engine validate:data`.

**Cause:** The generated `data/` does not match the expected schema contract. Common causes:
- Brand config changed but `themes:generate` was not re-run
- Schema overrides in `theme-engine/schemas/` are out of sync with `data/`

**Fix:**
```bash
# Regenerate data from scratch
npm run tokens:build
```

---

### Style Dictionary build fails with `could not resolve reference`

**When it appears:** During `build:all`.

**Cause:** A token in `data/` references another token that does not exist. Usually caused by running `build:all` after a partial `themes:generate` that did not complete.

**Fix:**
```bash
# Full regeneration — regenerates data/ from config before building
npm run tokens:build
```

---

### `output paths must stay inside the consumer workspace root`

**Cause:** A path in `aplica-theme-engine.config.mjs` or `transformers.config.mjs` points outside the project root. The engine refuses to write outside the workspace as a safety measure.

**Fix:** Ensure all `paths.*` and `output.directories.*` values resolve to paths inside your project directory. Use relative paths starting with `./`.

---

## Windows-specific issues

### Path errors with backslashes

**Cause:** Windows uses `\` as the path separator but some tools expect `/`.

**Fix:** Always use forward slashes in config files, even on Windows:
```js
// Correct
paths: {
  configDir: './theme-engine/config'
}

// Will cause issues on some systems
paths: {
  configDir: '.\\theme-engine\\config'
}
```

---

### CLI exits silently in CI (Windows runner)

**Cause:** The Windows `npx` wrapper can suppress stderr output from ESM scripts.

**Fix:** Call Node.js directly in CI scripts:
```yaml
# GitHub Actions — Windows runner
- name: Build tokens
  run: node ./node_modules/@aplica/aplica-theme-engine/index.mjs build
```

---

### Permission denied writing to `dist/`

**Cause:** A previous build process or antivirus software locked files in `dist/`.

**Fix:**
1. Delete `dist/` and `data/` manually.
2. Re-run `npm run tokens:build`.

---

## Diagnosing unknown errors

### Check Node.js version

```bash
node -v
# Must be v18.0.0 or higher
```

### Check workspace resolution

The CLI prints its resolved paths on startup:

```
aplica-theme-engine
Package root:   /path/to/node_modules/@aplica/aplica-theme-engine
Workspace root: /path/to/your-project
Command:        build
```

Verify that `Workspace root` points to your project and not to the package's own directory. If they match, the engine is running in self-referential mode (inside the package itself), which means the workspace config was not found.

### Clean rebuild

Delete generated directories and rebuild from scratch:

```bash
rm -rf data/ dist/
npm run tokens:build
```

---

## Getting help

If none of the above resolves the issue:
1. Note the exact error message and the command that produced it.
2. Note your Node.js version, OS, and shell (PowerShell / bash / cmd).
3. Note the contents of `aplica-theme-engine.config.mjs` (without any sensitive color values).
4. Open an issue in the project repository with this information.
