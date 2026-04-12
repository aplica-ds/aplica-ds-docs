---
level: n3
id: N3-05
title: "Integrating tokens into your project"
prerequisites: ["N3-04"]
duration: "15 min"
lang: en
---

# N3-05 · Integrating Tokens into Your Project

## Context

`dist/` exists. Tokens generated, CSS with correct variables, JS modules available. Now you need to connect all of this to the project where the components will live.

This tutorial covers the three most common scenarios — CSS-only, React/Next.js, and Vue — plus a theme switching pattern that works with system preference and user persistence.

---

## Concept

### Which format to use

| Environment | Format | File |
|-------------|--------|------|
| Web (any stack) | CSS | `dist/css/{theme}.css` |
| React, Vue, Vite | CSS + ESM | CSS for styles; ESM for JS |
| Node.js, SSR | CJS | `dist/cjs/{theme}-semantic.js` |
| TypeScript | DTS | `dist/dts/{theme}-semantic.d.ts` |
| React Native | ESM | `dist/esm/{theme}-semantic.mjs` |

The rule: **CSS for visual components, ESM/CJS only for logic that needs values in JavaScript** (animations, calculations, canvas).

---

## Guided example

### Part 1 — CSS-only

The simplest case: load the CSS and use custom properties directly.

```html
<!-- index.html -->
<link rel="stylesheet" href="/tokens/aplica_joy-light-positive.css">
<link rel="stylesheet" href="/tokens/aplica_joy-dark-positive.css">

<html data-theme="aplica_joy-light-positive">
```

```javascript
// Theme switching — no framework
document.documentElement.setAttribute('data-theme', 'aplica_joy-dark-positive');
```

```css
/* Your components — work in light and dark without any extra logic */
.btn {
  background: var(--semantic-color-interface-function-primary-normal-background);
  color:      var(--semantic-color-interface-function-primary-normal-txt-on);
}
```

### Part 2 — React / Next.js / Vite

**Loading CSS:**

```typescript
// _app.tsx (Next.js) or main.tsx (Vite)
import '@aplica/tokens/css/aplica_joy-light-positive.css';
import '@aplica/tokens/css/aplica_joy-dark-positive.css';
```

**Theme hook with system preference and persistence:**

```typescript
// hooks/useTheme.ts
import { useState, useEffect, useCallback } from 'react';

type Mode    = 'light' | 'dark';
type Surface = 'positive' | 'negative';
const BRAND  = 'aplica_joy';

export function useTheme() {
  const [mode, setModeState]       = useState<Mode>('light');
  const [surface, setSurfaceState] = useState<Surface>('positive');

  const applyTheme = useCallback((m: Mode, s: Surface) => {
    document.documentElement.setAttribute('data-theme', `${BRAND}-${m}-${s}`);
    localStorage.setItem('theme-mode',    m);
    localStorage.setItem('theme-surface', s);
  }, []);

  // Initialization: localStorage > system preference
  useEffect(() => {
    const savedMode    = localStorage.getItem('theme-mode')    as Mode    | null;
    const savedSurface = localStorage.getItem('theme-surface') as Surface | null;
    const prefersDark  = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const m = savedMode    ?? (prefersDark ? 'dark' : 'light');
    const s = savedSurface ?? 'positive';

    setModeState(m);
    setSurfaceState(s);
    applyTheme(m, s);
  }, [applyTheme]);

  // React to OS changes (only if the user has not chosen manually)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme-mode')) {
        const m = e.matches ? 'dark' : 'light';
        setModeState(m);
        applyTheme(m, surface);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [surface, applyTheme]);

  return {
    mode,
    surface,
    themeKey: `${BRAND}-${mode}-${surface}`,
    setMode:    (m: Mode)    => { setModeState(m);    applyTheme(m, surface); },
    setSurface: (s: Surface) => { setSurfaceState(s); applyTheme(mode, s); },
  };
}
```

**Usage in component:**

```tsx
// components/ThemeToggle.tsx
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  return (
    <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
      {mode === 'light' ? 'Dark mode' : 'Light mode'}
    </button>
  );
}
```

**Tokens in JavaScript (when necessary):**

```typescript
// For animations, canvas, or calculations that need the numeric value
import { semantic } from '@aplica/tokens/esm/aplica_joy-light-positive-semantic.mjs';

// Use directly (values in px as string)
const spacing = semantic.dimension.spacing.medium; // '32px'

// Convert to number
const spacingPx = parseFloat(semantic.dimension.spacing.medium); // 32
```

### Part 3 — Vue 3 / Nuxt

**Theme composable:**

```typescript
// composables/useTheme.ts
import { ref, onMounted } from 'vue';

const BRAND = 'aplica_joy';

export function useTheme() {
  const mode    = ref<'light' | 'dark'>('light');
  const surface = ref<'positive' | 'negative'>('positive');

  function applyTheme() {
    document.documentElement.setAttribute(
      'data-theme',
      `${BRAND}-${mode.value}-${surface.value}`
    );
    localStorage.setItem('theme-mode',    mode.value);
    localStorage.setItem('theme-surface', surface.value);
  }

  onMounted(() => {
    const savedMode   = localStorage.getItem('theme-mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    mode.value    = (savedMode as 'light' | 'dark') ?? (prefersDark ? 'dark' : 'light');
    surface.value = (localStorage.getItem('theme-surface') as 'positive' | 'negative') ?? 'positive';
    applyTheme();
  });

  return {
    mode,
    surface,
    setMode:    (m: 'light' | 'dark')        => { mode.value    = m; applyTheme(); },
    setSurface: (s: 'positive' | 'negative') => { surface.value = s; applyTheme(); },
  };
}
```

**Vue component with scoped styles:**

```vue
<template>
  <button :class="[$style.btn, $style[variant]]" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{ variant?: 'primary' | 'secondary'; disabled?: boolean }>();
</script>

<style module>
.btn       { border-radius: var(--semantic-border-radii-small); cursor: pointer; }
.primary   { background: var(--semantic-color-interface-function-primary-normal-background);
             color:      var(--semantic-color-interface-function-primary-normal-txt-on); }
.primary:hover { background: var(--semantic-color-interface-function-primary-action-background); }
.secondary { background: var(--semantic-color-interface-function-secondary-normal-background);
             color:      var(--semantic-color-interface-function-secondary-normal-txt-on); }
</style>
```

---

## Now you try

Given the context below, implement the solution:

> A Next.js project with two available themes (`aplica_joy-light-positive` and `aplica_joy-dark-positive`). The app must:
> 1. Start with the operating system preference
> 2. Persist the user's manual choice in `localStorage`
> 3. Update automatically if the OS changes (only when there is no manual choice)
> 4. Expose a `<ThemeSwitcher>` component that shows the current mode and allows toggling

**Expected result:** The `useTheme` hook from Part 2 already solves items 1–3. For item 4:

```tsx
// components/ThemeSwitcher.tsx
import { useTheme } from '../hooks/useTheme';

export function ThemeSwitcher() {
  const { mode, setMode } = useTheme();
  return (
    <button
      aria-label={`Activate ${mode === 'light' ? 'dark' : 'light'} mode`}
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
      style={{
        background:   'var(--semantic-color-interface-function-secondary-normal-background)',
        color:        'var(--semantic-color-interface-function-secondary-normal-txt-on)',
        border:       '1px solid var(--semantic-color-interface-function-secondary-normal-border)',
        borderRadius: 'var(--semantic-border-radii-small)',
        padding:      'var(--semantic-dimension-spacing-micro) var(--semantic-dimension-spacing-extra-small)',
      }}
    >
      {mode === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
```

---

## Integration checklist

### Web (any framework)
- [ ] `dist/css/*.css` files loaded (all necessary themes)
- [ ] `data-theme` set on the root element before the first render
- [ ] System preference implemented via `prefers-color-scheme`
- [ ] Manual choice persisted in `localStorage`
- [ ] No hardcoded hex in component styles

### JavaScript / TypeScript
- [ ] ESM or CJS imports pointing to the correct theme
- [ ] `dist/dts/*.d.ts` included in `tsconfig` for autocomplete
- [ ] `px` values converted to `number` before using in React Native

---

## Checkpoint

By the end of this tutorial you should know:

- [ ] Which token format to use in each environment (CSS, ESM, CJS, DTS)
- [ ] Load and apply the theme CSS in React, Vue, and CSS-only
- [ ] Implement theme switching with hierarchy: `localStorage` > OS preference > default
- [ ] Access token values in JavaScript when necessary (ESM)
- [ ] Use TypeScript declarations for autocomplete

---

## Next step

[N3-06 · Adding a new brand to the engine](./06-nova-marca.md)

You know how to build and integrate. The next step is the complete cycle: creating a new brand from scratch, from config to Figma.

---

## References

- Full platform guide: [02-platform-integration.md](../../07-implementation/02-platform-integration.md)
- Output formats: [05-output-formats.md](../../04-theme-engine/05-output-formats.md)
- Dark mode patterns: [03-dark-mode-patterns.md](../../05-components-theory/03-dark-mode-patterns.md)
