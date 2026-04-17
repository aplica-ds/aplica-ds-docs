---
title: "Consuming Tokens from dist/"
lang: en
---

# Consuming Tokens from dist/

## Audience

This article is for developers who **receive a `dist/` folder** — either from a colleague who ran the engine, a CI/CD artifact, or a published npm package — and need to integrate those tokens into an application. You do not need to install `@aplica/aplica-theme-engine` or run any engine commands.

---

## What You Get

The `dist/` folder contains the same tokens in multiple formats, all referencing the same underlying values:

```
dist/
├── json/        ← JSON with px values (Figma, Tokens Studio, universal)
├── css/         ← CSS custom properties with rem (Web)
├── esm/         ← ES Modules with px (React, Vue, modern bundlers)
├── js/          ← CommonJS with px (Node.js, legacy bundlers)
└── dts/         ← TypeScript declarations (type safety)
```

Each file is named after a theme variant: `{brand}-{mode}-{surface}.{ext}`

Examples:
- `aplica_joy-light-positive.css` — Aplica Joy brand, light mode, positive surface
- `aplica_joy-dark-positive-semantic.json` — same brand, dark mode, semantic layer

Pick the format that matches your platform and import only the variant you need.

---

## Two Token Layers

Every `dist/` contains two layers. Use **Foundation** for everyday product work; use **Semantic** when Foundation doesn't have what you need.

| Layer | Namespace | Token names | When to use |
|-------|-----------|-------------|-------------|
| **Foundation** | `foundation.*` | Short aliases: `foundation.bg.primary`, `foundation.txt.body` | Most product components |
| **Semantic** | `semantic.*` | Full names: `semantic.color.interface.function.primary.normal.background` | When a Foundation alias doesn't exist |

Never use `brand.*`, `mode.*`, or `surface.*` — those are internal pipeline layers, not part of the public contract.

---

## CSS (Web)

### Import the theme stylesheet

```html
<!-- Option 1: link tag -->
<link rel="stylesheet" href="./dist/css/aplica_joy-light-positive.css">
```

```javascript
// Option 2: bundler import (Vite, Webpack, etc.)
import './dist/css/aplica_joy-light-positive.css';
```

### Use the CSS variables

```css
.button-primary {
  background-color: var(--foundation-bg-primary);
  color:            var(--foundation-txt-on-primary);
  padding:          var(--foundation-spacing-medium);
  border-radius:    var(--foundation-radius-medium);
}

/* Or with Semantic when Foundation doesn't cover the case */
.custom-element {
  border-color: var(--semantic-color-interface-function-primary-normal-border);
}
```

### Runtime theme switching

CSS themes are activated by a `data-theme` attribute — no JavaScript required beyond setting the attribute:

```javascript
// Switch to dark mode
document.documentElement.setAttribute('data-theme', 'aplica_joy-dark-positive');

// Switch brand
document.documentElement.setAttribute('data-theme', 'my_brand-light-positive');
```

Load all the theme stylesheets your app supports and switch between them by changing the attribute:

```html
<link rel="stylesheet" href="./dist/css/aplica_joy-light-positive.css">
<link rel="stylesheet" href="./dist/css/aplica_joy-dark-positive.css">
<link rel="stylesheet" href="./dist/css/my_brand-light-positive.css">
```

---

## ESM — React, Vue, Vite

### Import tokens as JavaScript objects

```javascript
// Semantic layer
import { semantic } from './dist/esm/aplica_joy-light-positive-semantic.mjs';

// Foundation layer
import { foundation } from './dist/esm/foundation/engine/foundation.mjs';
```

### React component example

```jsx
import { foundation } from '../dist/esm/foundation/engine/foundation.mjs';

export function Button({ children }) {
  return (
    <button
      style={{
        backgroundColor: foundation.bg.primary,
        color:           foundation.txt.onPrimary,
        padding:         foundation.spacing.medium,
        borderRadius:    foundation.radius.medium,
      }}
    >
      {children}
    </button>
  );
}
```

### TypeScript with autocomplete

```typescript
import type { Foundation } from './dist/dts/foundation/engine/foundation.d.ts';
import { foundation } from './dist/esm/foundation/engine/foundation.mjs';

const bg: string = foundation.bg.primary;
```

---

## Next.js

### Global styles (App Router)

```typescript
// app/layout.tsx
import '../dist/css/aplica_joy-light-positive.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="aplica_joy-light-positive">
      <body>{children}</body>
    </html>
  );
}
```

### Server components

CSS variables work in server components — no client-side JavaScript needed for styling.

### Dynamic theme switching (client component)

```tsx
'use client';
import { useState } from 'react';

export function ThemeSwitcher() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggle = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', `aplica_joy-${next}-positive`);
    setMode(next);
  };

  return <button onClick={toggle}>Toggle {mode === 'light' ? 'Dark' : 'Light'}</button>;
}
```

---

## React Native

React Native does not support CSS custom properties. Use the JSON or ESM format and apply values via `StyleSheet.create`:

```javascript
import { foundation } from '../dist/esm/foundation/engine/foundation.mjs';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    backgroundColor: foundation.bg.primary,
    paddingHorizontal: parseInt(foundation.spacing.medium, 10),
    borderRadius:      parseInt(foundation.radius.medium, 10),
  },
  buttonText: {
    color: foundation.txt.onPrimary,
  },
});
```

> **Unit note:** ESM values include the `px` suffix (`'32px'`). Parse with `parseInt(value, 10)` or `parseFloat(value)` when passing to React Native style props that expect numbers.

---

## Flutter / Dart

Use the JSON format to load tokens in Flutter:

```dart
import 'dart:convert';
import 'package:flutter/services.dart';

Future<Map<String, dynamic>> loadTokens() async {
  final jsonStr = await rootBundle.loadString(
    'assets/tokens/aplica_joy-light-positive-foundation.json'
  );
  return json.decode(jsonStr) as Map<String, dynamic>;
}
```

Add the JSON file to your `pubspec.yaml` assets:

```yaml
flutter:
  assets:
    - assets/tokens/aplica_joy-light-positive-foundation.json
```

---

## Vanilla CSS (no bundler)

Link the CSS directly. All variables are scoped to `:root` and `[data-theme]`:

```html
<!DOCTYPE html>
<html data-theme="aplica_joy-light-positive">
<head>
  <link rel="stylesheet" href="dist/css/aplica_joy-light-positive.css">
  <style>
    body {
      background: var(--foundation-bg-page);
      color:      var(--foundation-txt-body);
      font-family: var(--foundation-font-main);
    }
  </style>
</head>
</html>
```

---

## Foundation Token Catalog

The Foundation layer provides the aliases most product components need. Common tokens:

| Token | Purpose |
|-------|---------|
| `foundation.bg.primary` | Primary action background |
| `foundation.bg.secondary` | Secondary action background |
| `foundation.bg.page` | Page/canvas background |
| `foundation.bg.surface` | Card/panel surface |
| `foundation.txt.body` | Body text color |
| `foundation.txt.heading` | Heading text color |
| `foundation.txt.onPrimary` | Text on primary background |
| `foundation.txt.muted` | Subdued/secondary text |
| `foundation.txt.link` | Link text color |
| `foundation.spacing.nano` | 4px equivalent |
| `foundation.spacing.small` | 12–16px equivalent |
| `foundation.spacing.medium` | 24–32px equivalent |
| `foundation.spacing.large` | 48px equivalent |
| `foundation.radius.small` | Small border radius |
| `foundation.radius.medium` | Standard border radius |
| `foundation.radius.pill` | Full pill/rounded radius |
| `foundation.font.main` | Primary font family |
| `foundation.font.display` | Display/heading font |

When a Foundation alias doesn't exist for your use case, go directly to Semantic: `semantic.color.interface.function.primary.normal.background`.

---

## References

- Output formats explained: [04-theme-engine/05-output-formats.md](../04-theme-engine/05-output-formats.md)
- Understanding generated tokens: [04-understanding-generated-tokens.md](./04-understanding-generated-tokens.md)
- Foundation layer (concept): [02-token-layers/05-foundation-layer.md](../02-token-layers/05-foundation-layer.md)
- Semantic layer (concept): [02-token-layers/04-semantic-layer.md](../02-token-layers/04-semantic-layer.md)
