---
level: n3
id: N3-03
title: "Dark mode por construção"
prerequisites: ["N3-02"]
duration: "12 min"
lang: pt-BR
---

# N3-03 · Dark mode por construção

## Contexto

A maioria dos sistemas de dark mode exige trabalho dobrado: você escreve os estilos light, depois duplica com `@media (prefers-color-scheme: dark)` ou um seletor de classe, e mantém as duas versões em sincronia para sempre.

No Aplica DS, dark mode é uma propriedade do sistema de tokens — não do CSS do componente. Se o componente usa apenas tokens Semantic, ele funciona em dark mode sem nenhuma linha de CSS extra. Este tutorial explica o mecanismo e mostra como diagnosticar os casos onde isso não acontece.

---

## Conceito

### O mecanismo de inversão

Cada paleta tem 19 níveis (10–190). Em light mode, 10 é o mais claro e 190 o mais escuro. Em dark mode, a escala é invertida matematicamente:

```
dark[level] = light[200 - level]

dark[10]  = light[190]   ← dark começa pelo tom mais escuro
dark[100] = light[100]   ← a cor base não muda
dark[190] = light[10]    ← dark termina pelo tom mais claro
```

Quando você troca `data-theme="aplica_joy-dark-positive"`, o CSS resolve as mesmas variáveis — mas os valores já são os do dark mode, calculados em build time.

### O que isso significa na prática

Um componente que usa `var(--semantic-color-interface-function-primary-normal-background)` recebe automaticamente:
- Em light: o nível de luminosidade correspondente ao modo claro
- Em dark: o nível invertido, com croma levemente reduzido (padrão: 85%)

**Zero CSS extra. Zero manutenção extra.**

### Quando isso NÃO acontece

O dark mode automático quebra quando o componente contém qualquer um destes padrões:

| Anti-pattern | Por quê quebra |
|-------------|----------------|
| Hex hardcoded (`#C40145`) | O valor não muda com o tema |
| `@media (prefers-color-scheme: dark)` com valores manuais | Duplica lógica que o sistema já resolve — e cria divergência |
| Referência a camada interna (`var(--brand-*)`) | A camada interna não é exposta para troca de tema |
| Variável CSS local com hex (`--minha-cor: #fff`) | A variável local não é atualizada pela troca de tema |
| SVG com `fill` ou `stroke` em hex | O atributo não herda o tema |

---

## Exemplo guiado

### Diagnóstico: componente que quebra em dark mode

```css
/* Card de produto — versão quebrada */
.product-card {
  background: #ffffff;              /* ❌ não muda com o tema */
  border:     1px solid #e0e0e0;   /* ❌ não muda com o tema */
  color:      #1a1a1a;             /* ❌ não muda com o tema */
}

.product-card__badge {
  background: #6BC200;             /* ❌ hardcoded */
  color:      #ffffff;             /* ❌ hardcoded */
}

@media (prefers-color-scheme: dark) {
  .product-card {
    background: #1a1a1a;           /* ❌ duplica lógica manual */
    color:      #ffffff;
  }
}
```

### Versão corrigida

```css
/* Card de produto — versão correta */
.product-card {
  background: var(--semantic-color-brand-ambient-contrast-deep-positive-background);
  border:     1px solid var(--semantic-color-brand-ambient-neutral-low-border);
  color:      var(--semantic-color-text-body);
  border-radius: var(--semantic-border-radii-medium);
  padding:    var(--semantic-dimension-spacing-medium);
}

/* Dark mode funciona automaticamente — não precisa de @media */

.product-card__badge {
  background: var(--semantic-color-product-promo-default-default-background);
  color:      var(--semantic-color-product-promo-default-default-txt-on);
  padding:    var(--semantic-dimension-spacing-micro) var(--semantic-dimension-spacing-extra-small);
  border-radius: var(--semantic-border-radii-circular);
}
```

### Ícones e SVGs

SVGs com `fill` hardcoded não herdam o tema. A solução é `currentColor`:

```css
/* ❌ ERRADO — cor fixa no SVG */
.icon path { fill: #1a1a1a; }

/* ✅ CERTO — herda a cor do texto pai */
.icon { color: currentColor; }
.icon path { fill: currentColor; }

/* Para ícone com cor semântica independente do texto pai */
.icon--brand { color: var(--semantic-color-brand-branding-first-default-background); }
```

### Troca de tema e preferência do sistema

```javascript
// Preferência do sistema — define o tema inicial
function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    return;
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute(
    'data-theme',
    `aplica_joy-${prefersDark ? 'dark' : 'light'}-positive`
  );
}

// Reagir a mudanças em tempo real
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute(
        'data-theme',
        `aplica_joy-${e.matches ? 'dark' : 'light'}-positive`
      );
    }
  });
```

---

## Agora você tenta

Analise o componente abaixo e liste **todos os problemas** que fazem o dark mode quebrar. Depois escreva a versão corrigida.

```css
/* Alert component — encontre os problemas */
.alert {
  background: #EBF4FF;
  border-left: 3px solid #3B82F6;
  padding: 12px 16px;
  border-radius: 4px;
}

.alert__title {
  color: #1E3A5F;
  font-weight: 600;
  font-size: 14px;
}

.alert__body {
  color: #374151;
  font-size: 14px;
}

.alert__icon {
  fill: #3B82F6;
  width: 16px;
  height: 16px;
}

@media (prefers-color-scheme: dark) {
  .alert         { background: #1a2744; }
  .alert__title  { color: #93C5FD; }
  .alert__body   { color: #D1D5DB; }
  .alert__icon   { fill: #93C5FD; }
}
```

**Problemas a identificar:** 7 no total.

**Resultado esperado (versão corrigida):**

```css
.alert {
  background:   var(--semantic-color-interface-feedback-info-default-normal-background);
  border-left:  3px solid var(--semantic-color-interface-feedback-info-secondary-normal-border);
  padding:      var(--semantic-dimension-spacing-extra-small) var(--semantic-dimension-spacing-small);
  border-radius: var(--semantic-border-radii-extra-small);
}

.alert__title {
  color:       var(--semantic-color-text-title);
  font-weight: var(--semantic-typography-font-weights-main-semibold-normal);
  font-size:   var(--semantic-typography-font-sizes-extra-small);
}

.alert__body {
  color:     var(--semantic-color-text-body);
  font-size: var(--semantic-typography-font-sizes-extra-small);
}

.alert__icon {
  color:  var(--semantic-color-interface-feedback-info-secondary-normal-background);
  fill:   currentColor;
  width:  var(--semantic-dimension-sizing-extra-small);
  height: var(--semantic-dimension-sizing-extra-small);
}

/* @media removida — dark mode funciona automaticamente via data-theme */
```

---

## Checklist de dark mode para um componente

Antes de publicar qualquer componente, verifique:

- [ ] Nenhum hex hardcoded no CSS
- [ ] Nenhuma `@media prefers-color-scheme` com valores manuais de cor
- [ ] SVGs usam `currentColor` ou tokens — sem `fill`/`stroke` em hex
- [ ] Par `background` + `txtOn` do mesmo token em todas as superfícies coloridas
- [ ] Dimensões e tipografia via tokens (sem `px` soltos)
- [ ] Shadows usam tokens de opacidade ou estilos compostos da Foundation
- [ ] Testado nos 4 contextos: light/positive, dark/positive, light/negative, dark/negative

---

## Checkpoint

Ao fim deste tutorial você deve saber:

- [ ] Por que dark mode é automático quando tokens Semantic são usados
- [ ] Identificar os 5 anti-patterns que quebram o dark mode
- [ ] Corrigir um componente legado que usa hex hardcoded e `@media`
- [ ] Fazer SVGs respeitarem o tema via `currentColor`
- [ ] Implementar troca de tema com preferência do sistema e persistência em `localStorage`

---

## Próximo passo

[N3-04 · Entendendo o pipeline de build](./04-pipeline-de-build.md)

Você sabe construir componentes corretos. Para completar o ciclo, você precisa entender o que acontece nos bastidores: como uma mudança no config do tema se propaga até o CSS que o browser recebe.

---

## Referências

- Padrões de dark mode: [03-dark-mode-patterns.md](../../05-components-theory/03-dark-mode-patterns.md)
- Sistema de cores e inversão de escala: [01-colors.md](../../03-visual-foundations/01-colors.md#dark-mode)
- Troca de tema em runtime: [05-output-formats.md](../../04-theme-engine/05-output-formats.md#troca-de-tema-em-runtime)
