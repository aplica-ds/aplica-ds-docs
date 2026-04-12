---
title: "Platform Integration"
lang: en
---

# Platform Integration

## Premise

The Aplica Tokens Theme Engine generates tokens in multiple formats (`dist/css/`, `dist/esm/`, `dist/cjs/`, `dist/json/`, `dist/dts/`). Each platform consumes a different format. This guide shows the integration pattern for each environment.

---

## CSS-Only (any stack)

The simplest case — load the generated CSS files and use custom properties directly.

### Installation

```bash
# Copy dist/css/ to your project, or consume from the package
# npm install @aplica/tokens  (when published as a package)
```

### Loading

```html
<!-- Load the default theme -->
<link rel="stylesheet" href="/tokens/aplica_joy-light-positive.css">

<!-- Load multiple themes (all available for runtime switching) -->
<link rel="stylesheet" href="/tokens/aplica_joy-light-positive.css">
<link rel="stylesheet" href="/tokens/aplica_joy-dark-positive.css">

<!-- Set the active theme on the root element -->
<html data-theme="aplica_joy-light-positive">
```

### Theme switching

```javascript
// Switch to dark mode
document.documentElement.setAttribute('data-theme', 'aplica_joy-dark-positive');

// With system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute(
  'data-theme',
  `aplica_joy-${prefersDark ? 'dark' : 'light'}-positive`
);
```

### Usage in styles

```css
.btn-primary {
  background: var(--semantic-color-interface-function-primary-normal-background);
  color:      var(--semantic-color-interface-function-primary-normal-txt-on);
  padding:    var(--semantic-dimension-spacing-extra-small) var(--semantic-dimension-spacing-small);
  border-radius: var(--semantic-border-radii-small);
}

/* No extra CSS needed — dark mode works automatically via data-theme */
```

---

## React / Vite / Next.js

### Installation and CSS loading

```typescript
// main.tsx or _app.tsx (Next.js)
// Import the default theme CSS
import '@aplica/tokens/css/aplica_joy-light-positive.css';
import '@aplica/tokens/css/aplica_joy-dark-positive.css';
```

```tsx
// _app.tsx (Next.js) or main.tsx (Vite)
// Set the theme on the root element at initial load
useEffect(() => {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved ?? (prefersDark ? 'aplica_joy-dark-positive' : 'aplica_joy-light-positive');
  document.documentElement.setAttribute('data-theme', theme);
}, []);
```

### Components with CSS Modules

```tsx
// Button.module.css
.root {
  background: var(--semantic-color-interface-function-primary-normal-background);
  color:      var(--semantic-color-interface-function-primary-normal-txt-on);
  border-radius: var(--semantic-border-radii-small);
  padding: var(--semantic-dimension-spacing-extra-small) var(--semantic-dimension-spacing-small);
  font-size: var(--semantic-typography-font-sizes-small);
  border: 1px solid var(--semantic-color-interface-function-primary-normal-border);
  cursor: pointer;
}

.root:hover {
  background: var(--semantic-color-interface-function-primary-action-background);
}

.root:active {
  background: var(--semantic-color-interface-function-primary-active-background);
}

.root:disabled {
  background: var(--semantic-color-interface-function-disabled-normal-background);
  color:      var(--semantic-color-interface-function-disabled-normal-txt-on);
  cursor: not-allowed;
}
```

```tsx
// Button.tsx
import styles from './Button.module.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({ variant = 'primary', children, disabled, onClick }: ButtonProps) {
  return (
    <button
      className={styles[variant]}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Theme switching hook

```tsx
// hooks/useTheme.ts
import { useState, useEffect, useCallback } from 'react';

type Mode = 'light' | 'dark';
type Surface = 'positive' | 'negative';

interface UseThemeReturn {
  mode: Mode;
  surface: Surface;
  setMode: (mode: Mode) => void;
  setSurface: (surface: Surface) => void;
  themeKey: string;
}

const BRAND = 'aplica_joy'; // configure per project

export function useTheme(): UseThemeReturn {
  const [mode, setModeState] = useState<Mode>('light');
  const [surface, setSurfaceState] = useState<Surface>('positive');

  const applyTheme = useCallback((m: Mode, s: Surface) => {
    const key = `${BRAND}-${m}-${s}`;
    document.documentElement.setAttribute('data-theme', key);
    localStorage.setItem('theme-mode', m);
    localStorage.setItem('theme-surface', s);
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as Mode | null;
    const savedSurface = localStorage.getItem('theme-surface') as Surface | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialMode = savedMode ?? (prefersDark ? 'dark' : 'light');
    const initialSurface = savedSurface ?? 'positive';

    setModeState(initialMode);
    setSurfaceState(initialSurface);
    applyTheme(initialMode, initialSurface);
  }, [applyTheme]);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    applyTheme(m, surface);
  }, [surface, applyTheme]);

  const setSurface = useCallback((s: Surface) => {
    setSurfaceState(s);
    applyTheme(mode, s);
  }, [mode, applyTheme]);

  return {
    mode,
    surface,
    setMode,
    setSurface,
    themeKey: `${BRAND}-${mode}-${surface}`,
  };
}
```

### Accessing tokens via ESM (JavaScript calculations)

When you need to use tokens in JavaScript logic — animations, layout calculations, canvas libraries:

```typescript
// Import tokens as an ES module
import { semantic } from '@aplica/tokens/esm/aplica_joy-light-positive-semantic.mjs';

// Use in calculation
const spacing = parseInt(semantic.dimension.spacing.medium); // 32 (in px)
const doubleSpacing = `${spacing * 2}px`; // '64px'

// Pass to an animation library
gsap.to('.element', {
  duration: 0.3,
  padding: semantic.dimension.spacing.small // '24px'
});
```

### TypeScript — autocomplete with declarations

```typescript
// tsconfig.json — include the generated declarations
{
  "compilerOptions": {
    "paths": {
      "@aplica/tokens/*": ["./node_modules/@aplica/tokens/dist/*"]
    }
  }
}
```

```typescript
// Typed access with autocomplete
import { semantic } from '@aplica/tokens/dts/aplica_joy-light-positive-semantic';

// TypeScript knows background is a string
const color: string = semantic.color.interface.function.primary.normal.background;
```

---

## Vue 3 / Nuxt

The pattern is identical to React with respect to tokens — CSS custom properties work the same way.

### Loading

```typescript
// main.ts
import '@aplica/tokens/css/aplica_joy-light-positive.css';
import '@aplica/tokens/css/aplica_joy-dark-positive.css';
```

### Theme composable

```typescript
// composables/useTheme.ts
import { ref, computed, onMounted } from 'vue';

const BRAND = 'aplica_joy';

export function useTheme() {
  const mode = ref<'light' | 'dark'>('light');
  const surface = ref<'positive' | 'negative'>('positive');

  const themeKey = computed(() => `${BRAND}-${mode.value}-${surface.value}`);

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', themeKey.value);
    localStorage.setItem('theme-mode', mode.value);
    localStorage.setItem('theme-surface', surface.value);
  }

  function setMode(m: 'light' | 'dark') {
    mode.value = m;
    applyTheme();
  }

  function setSurface(s: 'positive' | 'negative') {
    surface.value = s;
    applyTheme();
  }

  onMounted(() => {
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    mode.value = savedMode ?? (prefersDark ? 'dark' : 'light');
    surface.value = (localStorage.getItem('theme-surface') as 'positive' | 'negative') ?? 'positive';
    applyTheme();
  });

  return { mode, surface, themeKey, setMode, setSurface };
}
```

### Vue component with scoped styles

```vue
<template>
  <button :class="[$style.btn, $style[variant]]" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}>();
</script>

<style module>
.btn {
  border-radius: var(--semantic-border-radii-small);
  padding: var(--semantic-dimension-spacing-extra-small) var(--semantic-dimension-spacing-small);
  font-size: var(--semantic-typography-font-sizes-small);
  cursor: pointer;
}

.primary {
  background: var(--semantic-color-interface-function-primary-normal-background);
  color:      var(--semantic-color-interface-function-primary-normal-txt-on);
}

.primary:hover {
  background: var(--semantic-color-interface-function-primary-action-background);
}

.secondary {
  background: var(--semantic-color-interface-function-secondary-normal-background);
  color:      var(--semantic-color-interface-function-secondary-normal-txt-on);
}
</style>
```

---

## Node.js / Server-Side

For SSR, build scripts, or CLI tools that need to read token values:

```javascript
// CommonJS
const { semantic } = require('@aplica/tokens/cjs/aplica_joy-light-positive-semantic.js');

console.log(semantic.color.interface.function.primary.normal.background); // '#C40145'
console.log(semantic.dimension.spacing.medium); // '32px'
```

```typescript
// ESM (Node.js 18+, with "type": "module" in package.json)
import { semantic } from '@aplica/tokens/esm/aplica_joy-light-positive-semantic.mjs';
```

### Dynamic CSS generation on the server

```javascript
// Generate CSS with tokens for HTML injection (SSR)
const { semantic } = require('@aplica/tokens/cjs/aplica_joy-light-positive-semantic.js');
const { foundation } = require('@aplica/tokens/cjs/aplica_joy-foundation.js');

function generateInlineCSS() {
  // dist/css/ already contains this ready-made — prefer serving the static file
  // This approach only makes sense if you need dynamic transformation
  return `
    :root {
      --primary-bg: ${semantic.color.interface.function.primary.normal.background};
      --body-text: ${semantic.color.text.body};
    }
  `;
}
```

> **In most cases, serving `dist/css/` as static files is more efficient than generating CSS on the server.** The engine build has already generated the optimized CSS.

---

## Mobile — React Native

React Native does not use CSS custom properties. Value tokens (ESM/CJS in `px`) are the integration form.

```typescript
// tokens/aplica-joy-light.ts
import { semantic } from '@aplica/tokens/esm/aplica_joy-light-positive-semantic.mjs';

// Convert px strings to numbers for React Native
function px(value: string): number {
  return parseFloat(value); // '32px' → 32
}

export const tokens = {
  colors: {
    primary: semantic.color.interface.function.primary.normal.background,
    primaryText: semantic.color.interface.function.primary.normal.txtOn,
    textBody: semantic.color.text.body,
    successBg: semantic.color.interface.feedback.success.default.normal.background,
  },
  spacing: {
    xs:  px(semantic.dimension.spacing.extraSmall),  // 8
    sm:  px(semantic.dimension.spacing.small),       // 12
    md:  px(semantic.dimension.spacing.medium),      // 16
    lg:  px(semantic.dimension.spacing.large),       // 20
    xl:  px(semantic.dimension.spacing.extraLarge),  // 24
  },
  radius: {
    sm: px(semantic.border.radii.small),
    md: px(semantic.border.radii.medium),
    circular: 9999,
  },
  typography: {
    fontFamily: semantic.typography.fontFamilies.main, // 'Inter'
    sizeBody:   px(semantic.typography.fontSizes.medium), // 16
    sizeSmall:  px(semantic.typography.fontSizes.small),  // 12
  },
};
```

```tsx
// Button.tsx (React Native)
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { tokens } from '../tokens/aplica-joy-light';

const styles = StyleSheet.create({
  button: {
    backgroundColor: tokens.colors.primary,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.sm,
  },
  label: {
    color: tokens.colors.primaryText,
    fontFamily: tokens.typography.fontFamily,
    fontSize: tokens.typography.sizeBody,
  },
});

export function Button({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}
```

**Dark mode in React Native:** import the dark theme token set and swap the tokens object via context when the mode changes. Since there are no CSS custom properties, theme switching requires re-rendering affected components.

```typescript
// contexts/ThemeContext.tsx (React Native)
import { createContext, useContext, useState } from 'react';
import { lightTokens } from '../tokens/aplica-joy-light';
import { darkTokens } from '../tokens/aplica-joy-dark';

const ThemeContext = createContext(lightTokens);

export function ThemeProvider({ children }) {
  const [tokens, setTokens] = useState(lightTokens);

  function toggleTheme() {
    setTokens(prev => prev === lightTokens ? darkTokens : lightTokens);
  }

  return (
    <ThemeContext.Provider value={{ tokens, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTokens = () => useContext(ThemeContext).tokens;
```

---

## Integration Checklist

### Web (CSS + any framework)

- [ ] `dist/css/*.css` files loaded (all necessary themes)
- [ ] `data-theme` set on the root element at load time
- [ ] System preference logic (`prefers-color-scheme`) implemented
- [ ] User preference persisted (`localStorage`)
- [ ] No hardcoded hex in component styles
- [ ] CSS variables resolve correctly (inspect in DevTools)

### JavaScript / TypeScript

- [ ] ESM or CJS imports pointing to the correct theme
- [ ] `dist/dts/*.d.ts` included in `tsconfig` (for autocomplete)
- [ ] `px` values converted to number before passing to React Native

### Build / CI

- [ ] Token CSS included in the production bundle
- [ ] Theme files loaded before first render (no flash)
- [ ] Tree shaking working (only used themes in the final bundle)

---

## References

- Output formats in detail: [05-output-formats.md](../04-theme-engine/05-output-formats.md)
- Theme switching and dark mode: [03-dark-mode-patterns.md](../05-components-theory/03-dark-mode-patterns.md)
- Engine configuration guide: [03-configuration-guide.md](../04-theme-engine/03-configuration-guide.md)
- Token contract (what to use in components): [01-component-token-contract.md](../05-components-theory/01-component-token-contract.md)
- Migration guide: [01-migration-guide.md](./01-migration-guide.md)
