---
title: "Designer Workflow (Figma Sync)"
lang: en
---

# Designer Workflow (Figma Sync)

This document describes the workflow for designers using **Aplica DS** to build interfaces in Figma. The system uses a **"Config-First"** approach, where technical and semantic decisions are centralized in code and synchronized with design tools.

---

## The Config-First Paradigm

Unlike traditional design systems where the designer creates styles in Figma and developers "copy" them, in Aplica DS:
1. **Intent is born in Config:** System Designers define brand colors, densities (Dimension), and semantics in the `*.config.mjs` file.
2. **The Engine generates the Contract:** The Theme Engine processes the configurations and generates JSON files (W3C standard).
3. **Figma Consumes:** The Product Designer imports those JSONs into Figma to access up-to-date tokens and variables.

---

## Step-by-Step Workflow

### 1. Preparation (System Designer / Dev)
The person responsible for the engine runs the build command to generate output artifacts:
```bash
npm run build
```
This generates JSON files in the `dist/` or `tokens/` folder, organized by theme (e.g., `aplica_joy-light-positive.json`).

### 2. Import into Figma (Product Designer)
The designer uses the **Tokens Studio for Figma** plugin to read those files:
1. Open **Tokens Studio** in Figma.
2. Go to **Settings** → **Add New Storage** (or use local file/URL loading depending on available automation).
3. Load the JSON file for the desired theme.

### 3. Variable Synchronization
Once the tokens have been loaded by the plugin:
1. Go to the **Sets** tab and select the required token sets.
2. Click the **Style Variables** icon (Figma Variables) in the plugin.
3. Select **Create/Update Variables**.
4. The plugin will automatically map the tokens from the JSON to Figma's native Variables, creating collections according to the 5-layer architecture.

### 4. Applying and Switching Themes
With variables synchronized, the designer can:
- Apply colors, spacings, and radii directly to components through Figma's Variables panel.
- Switch between modes (Light/Dark) or Brands by changing the native Figma **Mode** on the section or page.

---

## Governance and Errors

> [!CAUTION]
> **Never create semantic variables directly in Figma.**
> If the plugin cannot find a token in the JSON that you need, **do not create it manually in Figma**. This generates technical debt and breaks the synchronization contract. The need must be brought to the System Designer to be included in the original configuration file.

### When to request a change in Config?
- Need for a new **Product** color (e.g., badge for a new promotion).
- Adjustment to the **Typography** or **Dimension** scale.
- Change to the main **Brand** hue.

> [!IMPORTANT]
> Remember the **Cost Alert** when requesting new product colors. Each item adds dozens of tokens to the system. Always verify whether an existing Feedback token or Brand variant can solve the problem.

---

## Summary of Responsibilities

| Action | Who performs it | Tool |
| :--- | :--- | :--- |
| Define colors and scale | System Designer | `*.config.mjs` |
| Generate token JSON | Engineer / Engine | Terminal / Scripts |
| Sync Figma | Product Designer | Tokens Studio Plugin |
| Build screens | Product Designer | Figma Variables |

---

## References

- What is the Theme Engine: [01-what-is-theme-engine.md](./01-what-is-theme-engine.md)
- Configuration guide: [03-configuration-guide.md](./03-configuration-guide.md)
- Foundation layer (why Figma consumes Foundation): [05-foundation-layer.md](../02-token-layers/05-foundation-layer.md)
- Naming contract: canonical-taxonomy-and-naming-contract.md
- Token usage in components and Figma: token-usage-for-components-and-figma.md
