---
level: n3
id: N3-04
title: "Understanding the build pipeline"
prerequisites: ["N3-01"]
duration: "12 min"
lang: en
---

# N3-04 · Understanding the Build Pipeline

## Context

You changed the primary color of a theme. Ran the build. But the color in the CSS did not change. Why?

Or: the gradient exists in the config but does not appear in the output. What was forgotten?

Understanding the build pipeline is not optional for a Design Engineer — it is what separates "works on my machine" from "I know exactly what needs to run and in what order."

---

## Concept

### Two stages, one order

The pipeline has two sequential stages. The second only works correctly if the first was executed properly.

```
[Stage 1 — Data Generation]
config/*.config.mjs
        │
        ├─ themes:generate    → data/brand/{theme}/
        ├─ dimension:generate → data/dimension/normal.json
        ├─ sync:architecture  → data/mode/, data/surface/, data/semantic/, data/foundation/
        ├─ foundations:generate → data/foundation/{name}/styles/
        └─ figma:generate     → data/$themes.json, data/$metadata.json

[Stage 2 — Style Dictionary]
data/  →  npm run build:all  →  dist/
                                 ├── css/
                                 ├── json/
                                 ├── esm/
                                 ├── cjs/
                                 └── dts/
```

The `data/` folder is intermediary — **never edit files in `data/` manually**. Any manual edit is overwritten on the next pipeline execution.

### The command that does everything

```bash
npm run build:themes
```

Runs in the correct order: `ensure:data` → `themes:generate` → `dimension:generate` → `sync:architecture` → `foundations:generate` → `figma:generate` → `build:all`.

Use this command after cloning the repository, after changing configs, or when you are not sure what is out of date.

### When to run an incremental build

| Change | Required commands |
|--------|-------------------|
| Change a theme's color | `themes:generate` → `build:all` |
| Change dimensional scale | `dimension:generate` → `build:all` |
| Change schema (feedback/product) | `sync:architecture` → `themes:generate` → `build:all` |
| Change foundation | `foundations:generate` → `build:all` |
| Add / rename a theme, surface, or mode | `figma:generate` |
| `data/` already up to date, just recreate dist/ | `build:all` |

---

## Guided example

### The role of `sync:architecture`

This is the most misunderstood command in the pipeline. It reads the architecture schema and propagates references to all intermediate layers. Without it, the `mode/`, `surface/`, `semantic/`, and `foundation/engine/` layers fall out of sync with the schema.

**When it is mandatory:**

```bash
# Added a new product item to the schema
# → sync propagates the new category to mode/, surface/, semantic/
npm run sync:architecture
npm run themes:generate
npm run build

# Added gradients to a theme's config
# → without sync, semantic.color.gradient does not exist, gradient is omitted
npm run sync:architecture
npm run build
```

**How to test without writing:**

```bash
# Verifies whether the schema and theme configs are aligned
npm run sync:architecture:test

# Displays the current schema
npm run sync:architecture:schema
```

### The gradients trap

This is the most common problem with gradients:

```bash
# You did this:
npm run themes:generate
npm run build

# The gradient does not appear in CSS. Why?
# sync:architecture did not run → semantic.color.gradient does not exist
# Style Dictionary does not find the section → silently omits it

# Solution:
npm run sync:architecture
npm run build
```

`build:themes` already includes `sync:architecture` in the correct order. If you used individual commands, this is the order that never fails:

```
themes:generate → sync:architecture → build
```

---

## Now you try

Given the scenario below, write the correct command sequence:

> You added `promo_extended` as a new Product item in the architecture schema. Then you modified the `brand_primary` color in an existing theme's config. Finally, you want to recreate just the `dist/` without changing `data/`.

**Correct sequence:**

```bash
# 1. New item in schema → sync propagates to mode/surface/semantic
npm run sync:architecture

# 2. Color changed in config → themes:generate decomposes and writes data/brand/
npm run themes:generate

# 3. Recreate dist/ with updated data
npm run build
```

> If you were unsure about the order, the safe command is always `npm run build:themes` — it resolves everything.

---

## Diagnosing the 5 most common problems

| Symptom | Likely cause | Solution |
|---------|-------------|---------|
| Gradient does not appear in CSS | `sync:architecture` did not run after `themes:generate` | `npm run sync:architecture` → `npm run build:all` |
| New token does not appear in `dist/` | Theme not registered in `themes.config.json` | Add entry to the global themes file |
| Color different from expected | Override in `overrides.*` overwriting the generated value | Check overrides in the theme config |
| Build fails with "reference not found" | `data/` out of sync with configs | `npm run build:themes` (full rebuild) |
| `txtOn` is black/white when brand color was expected | `txtOnStrategy: 'high-contrast'` is the default | Change to `'brand-tint'` in the theme options |
| New theme not visible in Tokens Studio | `figma:generate` did not run after adding the theme | `npm run figma:generate` or `npm run build:themes` |

---

## Validating the output visually — `theme-engine preview` (since 3.9.0)

After the build, use the preview command to inspect every generated theme combination in the browser before syncing to Figma or integrating into a project:

```bash
# Use the current dist/ output
theme-engine preview

# Rebuild first, then preview
theme-engine preview --build

# Rebuild, preview, and serve via a local static server with live reload (since 3.11.0)
theme-engine preview --build --serve
```

Since **3.11.0**, `--serve` keeps the browser in sync automatically — every time you run `npm run themes:generate && npm run build:all` in another terminal, the tab reloads without intervention.

The preview renders all four variants (light-positive, light-negative, dark-positive, dark-negative) for every theme in the workspace. Switch between **Detailed** (full card explorer, default) and **Summary** (compact table with contrast ratios — since 3.13.0) using the View dropdown. For each variant, it shows:

- `background`, `border`, `txtOn`, and `txt` for all semantic families and states
- Foundation typography classes applied to sample text
- Elevation classes as raised card surfaces

**Add to the diagnostics table:**

| Symptom | Likely cause | Solution |
|---------|-------------|---------|
| `txtOn` visually wrong in the browser but build passes | Token resolved against wrong canvas | `theme-engine preview` to inspect the composited result |
| Ghost surface appears invisible | `ghost.normal.background` is transparent — correct behavior | Open `theme-engine preview` to verify contrast against the composited canvas |

---

## Checkpoint

By the end of this tutorial you should know:

- [ ] The two pipeline stages and the order that never fails
- [ ] What `sync:architecture` does and when it is mandatory
- [ ] The difference between `build:themes` (full) and incremental commands
- [ ] Why never to edit `data/` manually
- [ ] Diagnose the 5 most common problems by symptom
- [ ] Use `theme-engine preview` to visually validate generated token output

---

## Next step

[N3-05 · Integrating tokens into your project](./05-integrando-tokens.md)

The build generated `dist/`. Now how do you connect that output to your React, Vue, Next.js, or CSS-only project?

---

## References

- Pipeline in full detail: [04-build-pipeline.md](../../04-theme-engine/04-build-pipeline.md)
- Output formats: [05-output-formats.md](../../04-theme-engine/05-output-formats.md)
- Configuration guide: [03-configuration-guide.md](../../04-theme-engine/03-configuration-guide.md)
