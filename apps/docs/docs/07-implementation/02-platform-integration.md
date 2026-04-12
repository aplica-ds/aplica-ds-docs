---
title: "Integração por Plataforma"
lang: pt-BR
---

# Integração por Plataforma

## Premissa

O Aplica Tokens Theme Engine gera tokens em múltiplos formatos (`dist/css/`, `dist/esm/`, `dist/cjs/`, `dist/json/`, `dist/dts/`). Cada plataforma consome um formato diferente. Este guia mostra o padrão de integração para cada ambiente.

---

## CSS-Only (qualquer stack)

O formato mais simples — carregue os arquivos CSS gerados e use as custom properties diretamente.

### Instalação

```bash
# Copiar dist/css/ para seu projeto, ou consumir do pacote
# npm install @aplica/tokens  (quando publicado como pacote)
```

### Carregamento

```html
<!-- Carregar o tema padrão -->
<link rel="stylesheet" href="/tokens/aplica_joy-light-positive.css">

<!-- Carregar múltiplos temas (todos disponíveis para troca em runtime) -->
<link rel="stylesheet" href="/tokens/aplica_joy-light-positive.css">
<link rel="stylesheet" href="/tokens/aplica_joy-dark-positive.css">

<!-- Definir o tema ativo no elemento raiz -->
<html data-theme="aplica_joy-light-positive">
```

### Troca de tema

```javascript
// Trocar para dark mode
document.documentElement.setAttribute('data-theme', 'aplica_joy-dark-positive');

// Com preferência do sistema
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute(
  'data-theme',
  `aplica_joy-${prefersDark ? 'dark' : 'light'}-positive`
);
```

### Uso nos estilos

```css
.btn-primary {
  background: var(--semantic-color-interface-function-primary-normal-background);
  color:      var(--semantic-color-interface-function-primary-normal-txt-on);
  padding:    var(--semantic-dimension-spacing-extra-small) var(--semantic-dimension-spacing-small);
  border-radius: var(--semantic-border-radii-small);
}

/* Sem CSS extra — dark mode funciona automaticamente via data-theme */
```

---

## React / Vite / Next.js

### Instalação e carregamento do CSS

```typescript
// main.tsx ou _app.tsx (Next.js)
// Importar o CSS do tema padrão
import '@aplica/tokens/css/aplica_joy-light-positive.css';
import '@aplica/tokens/css/aplica_joy-dark-positive.css';
```

```tsx
// _app.tsx (Next.js) ou main.tsx (Vite)
// Definir o tema no elemento raiz na carga inicial
useEffect(() => {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved ?? (prefersDark ? 'aplica_joy-dark-positive' : 'aplica_joy-light-positive');
  document.documentElement.setAttribute('data-theme', theme);
}, []);
```

### Componentes com CSS Modules

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

### Hook para troca de tema

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

const BRAND = 'aplica_joy'; // configurar por projeto

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

### Acesso a tokens via ESM (cálculos em JavaScript)

Quando você precisar usar tokens em lógica JavaScript — animações, cálculos de layout, bibliotecas de canvas:

```typescript
// Importar tokens como módulo ES
import { semantic } from '@aplica/tokens/esm/aplica_joy-light-positive-semantic.mjs';

// Usar em cálculo
const spacing = parseInt(semantic.dimension.spacing.medium); // 32 (em px)
const doubleSpacing = `${spacing * 2}px`; // '64px'

// Passar para uma biblioteca de animação
gsap.to('.element', {
  duration: 0.3,
  padding: semantic.dimension.spacing.small // '24px'
});
```

### TypeScript — autocompletar com as declarations

```typescript
// tsconfig.json — incluir as declarações geradas
{
  "compilerOptions": {
    "paths": {
      "@aplica/tokens/*": ["./node_modules/@aplica/tokens/dist/*"]
    }
  }
}
```

```typescript
// Acesso com tipos e autocompletar
import { semantic } from '@aplica/tokens/dts/aplica_joy-light-positive-semantic';

// TypeScript sabe que background é string
const color: string = semantic.color.interface.function.primary.normal.background;
```

---

## Vue 3 / Nuxt

O padrão é idêntico ao React no que diz respeito a tokens — CSS custom properties funcionam da mesma forma.

### Carregamento

```typescript
// main.ts
import '@aplica/tokens/css/aplica_joy-light-positive.css';
import '@aplica/tokens/css/aplica_joy-dark-positive.css';
```

### Composable para tema

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

### Componente Vue com scoped styles

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

Para SSR, scripts de build ou CLI tools que precisam ler valores de tokens:

```javascript
// CommonJS
const { semantic } = require('@aplica/tokens/cjs/aplica_joy-light-positive-semantic.js');

console.log(semantic.color.interface.function.primary.normal.background); // '#C40145'
console.log(semantic.dimension.spacing.medium); // '32px'
```

```typescript
// ESM (Node.js 18+, com "type": "module" no package.json)
import { semantic } from '@aplica/tokens/esm/aplica_joy-light-positive-semantic.mjs';
```

### Geração dinâmica de CSS no servidor

```javascript
// Gerar CSS com tokens para injeção no HTML (SSR)
const { semantic } = require('@aplica/tokens/cjs/aplica_joy-light-positive-semantic.js');
const { foundation } = require('@aplica/tokens/cjs/aplica_joy-foundation.js');

function generateInlineCSS() {
  // O dist/css/ já contém isso pronto — prefira servir o arquivo estático
  // Esta abordagem só faz sentido se precisar de transformação dinâmica
  return `
    :root {
      --primary-bg: ${semantic.color.interface.function.primary.normal.background};
      --body-text: ${semantic.color.text.body};
    }
  `;
}
```

> **Na maioria dos casos, servir `dist/css/` como arquivos estáticos é mais eficiente que gerar CSS no servidor.** O build do engine já gerou o CSS otimizado.

---

## Mobile — React Native

React Native não usa CSS custom properties. Os tokens de valor (ESM/CJS em `px`) são a forma de integração.

```typescript
// tokens/aplica-joy-light.ts
import { semantic } from '@aplica/tokens/esm/aplica_joy-light-positive-semantic.mjs';

// Converter px strings para números para React Native
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

**Dark mode no React Native:** importe o conjunto de tokens do tema dark e troque o objeto de tokens via context quando o modo mudar. Como não há CSS custom properties, a troca de tema requer re-render dos componentes afetados.

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

## Checklist de Integração

### Web (CSS + qualquer framework)

- [ ] Arquivos `dist/css/*.css` carregados (todos os temas necessários)
- [ ] `data-theme` definido no elemento raiz na carga
- [ ] Lógica de preferência do sistema (`prefers-color-scheme`) implementada
- [ ] Preferência do usuário persistida (`localStorage`)
- [ ] Nenhum hex hardcoded nos estilos de componente
- [ ] Variáveis CSS resolvem corretamente (inspecionar no DevTools)

### JavaScript / TypeScript

- [ ] Imports ESM ou CJS apontando para o tema correto
- [ ] `dist/dts/*.d.ts` incluído no `tsconfig` (para autocompletar)
- [ ] Valores `px` convertidos para number antes de passar ao React Native

### Build / CI

- [ ] CSS dos tokens incluído no bundle de produção
- [ ] Arquivos de tema carregados antes do primeiro render (sem flash)
- [ ] Tree shaking funcionando (apenas temas usados no bundle final)

---

## Referências

- Formatos de output em detalhe: [05-output-formats.md](../04-theme-engine/05-output-formats.md)
- Troca de tema e dark mode: [03-dark-mode-patterns.md](../05-components-theory/03-dark-mode-patterns.md)
- Guia de configuração do engine: [03-configuration-guide.md](../04-theme-engine/03-configuration-guide.md)
- Contrato de tokens (o que usar em componentes): [01-component-token-contract.md](../05-components-theory/01-component-token-contract.md)
- Guia de migração: [01-migration-guide.md](./01-migration-guide.md)
