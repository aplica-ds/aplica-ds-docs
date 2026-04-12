---
level: n3
id: N3-05
title: "Integrando tokens no seu projeto"
prerequisites: ["N3-04"]
duration: "15 min"
lang: pt-BR
---

# N3-05 · Integrando tokens no seu projeto

## Contexto

O `dist/` existe. Tokens gerados, CSS com variáveis corretas, módulos JS disponíveis. Agora você precisa conectar tudo isso ao projeto onde os componentes vão viver.

Este tutorial cobre os três cenários mais comuns — CSS-only, React/Next.js, e Vue — e um padrão de troca de tema que funciona com preferência do sistema e persistência de usuário.

---

## Conceito

### Qual formato usar

| Ambiente | Formato | Arquivo |
|----------|---------|---------|
| Web (qualquer stack) | CSS | `dist/css/{tema}.css` |
| React, Vue, Vite | CSS + ESM | CSS para estilos; ESM para JS |
| Node.js, SSR | CJS | `dist/cjs/{tema}-semantic.js` |
| TypeScript | DTS | `dist/dts/{tema}-semantic.d.ts` |
| React Native | ESM | `dist/esm/{tema}-semantic.mjs` |

A regra: **CSS para componentes visuais, ESM/CJS apenas para lógica que precisa de valores em JavaScript** (animações, cálculos, canvas).

---

## Exemplo guiado

### Parte 1 — CSS-only

O caso mais simples: carregar o CSS e usar custom properties diretamente.

```html
<!-- index.html -->
<link rel="stylesheet" href="/tokens/aplica_joy-light-positive.css">
<link rel="stylesheet" href="/tokens/aplica_joy-dark-positive.css">

<html data-theme="aplica_joy-light-positive">
```

```javascript
// Troca de tema — sem framework
document.documentElement.setAttribute('data-theme', 'aplica_joy-dark-positive');
```

```css
/* Seus componentes — funcionam em light e dark sem nenhuma lógica extra */
.btn {
  background: var(--semantic-color-interface-function-primary-normal-background);
  color:      var(--semantic-color-interface-function-primary-normal-txt-on);
}
```

### Parte 2 — React / Next.js / Vite

**Carregamento do CSS:**

```typescript
// _app.tsx (Next.js) ou main.tsx (Vite)
import '@aplica/tokens/css/aplica_joy-light-positive.css';
import '@aplica/tokens/css/aplica_joy-dark-positive.css';
```

**Hook de tema com preferência do sistema e persistência:**

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

  // Inicialização: localStorage > preferência do sistema
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

  // Reagir a mudança do SO (apenas se o usuário não escolheu manualmente)
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

**Uso em componente:**

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

**Tokens em JavaScript (quando necessário):**

```typescript
// Para animações, canvas ou cálculos que precisam do valor numérico
import { semantic } from '@aplica/tokens/esm/aplica_joy-light-positive-semantic.mjs';

// Usar diretamente (valores em px como string)
const spacing = semantic.dimension.spacing.medium; // '32px'

// Converter para número
const spacingPx = parseFloat(semantic.dimension.spacing.medium); // 32
```

### Parte 3 — Vue 3 / Nuxt

**Composable de tema:**

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
    const savedMode    = localStorage.getItem('theme-mode');
    const prefersDark  = window.matchMedia('(prefers-color-scheme: dark)').matches;
    mode.value    = (savedMode as 'light' | 'dark') ?? (prefersDark ? 'dark' : 'light');
    surface.value = (localStorage.getItem('theme-surface') as 'positive' | 'negative') ?? 'positive';
    applyTheme();
  });

  return {
    mode,
    surface,
    setMode:    (m: 'light' | 'dark')       => { mode.value    = m; applyTheme(); },
    setSurface: (s: 'positive' | 'negative') => { surface.value = s; applyTheme(); },
  };
}
```

**Componente Vue com scoped styles:**

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

## Agora você tenta

Dado o contexto abaixo, implemente a solução:

> Um projeto Next.js com dois temas disponíveis (`aplica_joy-light-positive` e `aplica_joy-dark-positive`). O app deve:
> 1. Iniciar com a preferência do sistema operacional
> 2. Persistir a escolha manual do usuário em `localStorage`
> 3. Atualizar automaticamente se o SO mudar (apenas quando não há escolha manual)
> 4. Expor um componente `<ThemeSwitcher>` que mostre o modo atual e permita alternar

**Resultado esperado:** O hook `useTheme` da Parte 2 já resolve os itens 1–3. Para o item 4:

```tsx
// components/ThemeSwitcher.tsx
import { useTheme } from '../hooks/useTheme';

export function ThemeSwitcher() {
  const { mode, setMode } = useTheme();
  return (
    <button
      aria-label={`Ativar modo ${mode === 'light' ? 'escuro' : 'claro'}`}
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
      style={{
        background: 'var(--semantic-color-interface-function-secondary-normal-background)',
        color:      'var(--semantic-color-interface-function-secondary-normal-txt-on)',
        border:     '1px solid var(--semantic-color-interface-function-secondary-normal-border)',
        borderRadius: 'var(--semantic-border-radii-small)',
        padding:    'var(--semantic-dimension-spacing-micro) var(--semantic-dimension-spacing-extra-small)',
      }}
    >
      {mode === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
```

---

## Checklist de integração

### Web (qualquer framework)
- [ ] Arquivos `dist/css/*.css` carregados (todos os temas necessários)
- [ ] `data-theme` definido no elemento raiz antes do primeiro render
- [ ] Preferência do sistema implementada via `prefers-color-scheme`
- [ ] Escolha manual persistida em `localStorage`
- [ ] Nenhum hex hardcoded nos estilos dos componentes

### JavaScript / TypeScript
- [ ] Imports ESM ou CJS apontando para o tema correto
- [ ] `dist/dts/*.d.ts` incluído no `tsconfig` para autocompletar
- [ ] Valores `px` convertidos para `number` antes de usar no React Native

---

## Checkpoint

Ao fim deste tutorial você deve saber:

- [ ] Qual formato de token usar em cada ambiente (CSS, ESM, CJS, DTS)
- [ ] Carregar e aplicar o CSS de tema em React, Vue e CSS-only
- [ ] Implementar troca de tema com hierarquia: `localStorage` > preferência do SO > padrão
- [ ] Acessar valores de tokens em JavaScript quando necessário (ESM)
- [ ] Usar TypeScript declarations para autocompletar

---

## Próximo passo

[N3-06 · Adicionando uma nova marca ao engine](./06-nova-marca.md)

Você sabe construir e integrar. O próximo passo é o ciclo completo: criar uma nova marca do zero, do config ao Figma.

---

## Referências

- Guia completo por plataforma: [02-platform-integration.md](../../07-implementation/02-platform-integration.md)
- Formatos de output: [05-output-formats.md](../../04-theme-engine/05-output-formats.md)
- Padrões de dark mode: [03-dark-mode-patterns.md](../../05-components-theory/03-dark-mode-patterns.md)
