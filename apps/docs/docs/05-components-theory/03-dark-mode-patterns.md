---
title: "Padrões de Dark Mode"
lang: pt-BR
---

# Padrões de Dark Mode

## Premissa

No Aplica DS, o dark mode não é uma segunda paleta projetada manualmente — é uma propriedade matemática do sistema de cores. O engine gera light e dark como inversões simétricas da mesma escala OKLCh. Do ponto de vista de quem constrói componentes, isso tem uma implicação fundamental:

**Se o componente usa tokens Semantic, o dark mode funciona sem nenhum CSS extra.**

Este documento explica o mecanismo de inversão, o que o sistema faz automaticamente, o que requer atenção manual e os anti-patterns a evitar.

---

## Como o Dark Mode Funciona no Sistema

### Inversão de Escala

Cada paleta de cor tem 19 níveis (10–190). Em light mode, o nível 10 é o mais claro e o 190 é o mais escuro. Em dark mode, a escala é invertida:

```
dark[level] = light[200 - level]

Exemplos:
  dark[10]  = light[190]  ← dark começa pelo tom mais escuro
  dark[100] = light[100]  ← a cor base (nível 100) permanece idêntica
  dark[190] = light[10]   ← dark termina pelo tom mais claro
```

O nível 100 é o único que não muda — ele é a cor declarada no config do tema.

### Redução de Croma

Além da inversão de luminosidade, o dark mode reduz levemente a saturação das cores. O multiplicador padrão é `darkModeChroma: 0.85` — 15% menos saturado que o light mode.

**Por quê:** Cores muito vibrantes em fundos escuros causam fadiga visual e halação (chromatic aberration perceptual). A redução de croma preserva a identidade da marca enquanto melhora a legibilidade em ambientes com pouca luz.

O multiplicador é configurável por tema:

```javascript
// No *.config.mjs do tema
options: {
  darkModeChroma: 0.75  // mais suave que o padrão
  // darkModeChroma: 1.0  // idêntico ao light mode (não recomendado)
}
```

### Borders em Dark Mode

Em light mode, bordas são geradas com tons mais escuros que a superfície. Em dark mode, a direção se inverte — bordas são mais claras que a superfície. O offset é mantido pelo engine para que a visibilidade seja equivalente em ambos os modos.

---

## O que o Sistema Faz Automaticamente

Quando o tema é trocado via atributo `data-theme`, o CSS resolve automaticamente:

| Elemento | Comportamento automático |
|----------|--------------------------|
| Todas as cores Semantic | Assumem os valores do novo tema |
| Background de interface | Inverte luminosidade via inversão de escala |
| txtOn (texto sobre superfície) | Recalculado para manter contraste WCAG |
| Bordas | Direção invertida, mantendo visibilidade |
| Opacidade | Inalterada — os raw values são os mesmos |
| Dimensões, espaçamento, tipografia | Inalterados — ortogonais ao modo de cor |

### O que isso significa para componentes

Um componente que usa apenas tokens Semantic não precisa de nenhuma lógica de dark mode:

```css
/* Este CSS funciona em light E dark mode sem modificação */
.card {
  background:    var(--semantic-color-brand-ambient-contrast-base-positive-background);
  color:         var(--semantic-color-text-body);
  border:        1px solid var(--semantic-color-brand-ambient-neutral-low-border);
  border-radius: var(--semantic-border-radii-medium);
  padding:       var(--semantic-dimension-spacing-medium);
}

.card__title {
  color: var(--semantic-color-text-title);
}

.card__cta {
  background: var(--semantic-color-interface-function-primary-normal-background);
  color:      var(--semantic-color-interface-function-primary-normal-txt-on);
}
```

A troca de tema no HTML é suficiente:

```html
<!-- Light mode -->
<html data-theme="aplica_joy-light-positive">

<!-- Dark mode -->
<html data-theme="aplica_joy-dark-positive">
```

```javascript
// Trocar para dark mode — sem lógica adicional necessária
document.documentElement.setAttribute('data-theme', 'aplica_joy-dark-positive');
```

---

## Troca de Tema com Preferência do Sistema

Para respeitar a preferência do usuário no sistema operacional, use `prefers-color-scheme` apenas para definir o atributo inicial — nunca para sobrescrever tokens manualmente:

```javascript
// Detectar preferência do SO e definir tema inicial
function applySystemTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = prefersDark ? 'aplica_joy-dark-positive' : 'aplica_joy-light-positive';
  document.documentElement.setAttribute('data-theme', theme);
}

// Aplicar na carga
applySystemTheme();

// Reagir a mudanças em tempo real
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', applySystemTheme);
```

Se o usuário pode escolher o tema manualmente (toggle na UI), persista a preferência dele sobre a preferência do sistema:

```javascript
function applyTheme(mode) {
  const theme = `aplica_joy-${mode}-positive`;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('preferred-theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('preferred-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else {
    applySystemTheme();
  }
}
```

---

## Surface Negativa — A Segunda Dimensão

Além do dark mode (dimensão de luminosidade), o sistema tem a **surface negativa** — uma inversão ortogonal análoga ao dark mode, mas que funciona dentro do mesmo modo:

```
light + positive  → fundo claro, cores na escala normal
light + negative  → fundo claro com escala invertida (como "negativo fotográfico")
dark  + positive  → fundo escuro, escala dark padrão
dark  + negative  → fundo escuro com inversão adicional (raro)
```

A surface negativa é útil para banners invertidos, seções de destaque ou elementos que precisam de contraste imediato sem trocar para dark mode:

```html
<section data-theme="aplica_joy-light-negative">
  <!-- Este bloco usa a inversão da surface mesmo dentro de uma página light -->
</section>
```

Os tokens Semantic são os mesmos — apenas os valores resolvidos mudam, porque o pipeline Brand → Mode → Surface seleciona o arquivo `surface/negative.json`.

---

## Ícones e SVGs em Dark Mode

Ícones que usam `currentColor` herdam automaticamente a cor do token de texto pai:

```css
/* O ícone assume a cor do texto — funciona em ambos os modos */
.icon {
  color: currentColor; /* padrão para SVG inline */
}

/* Botão com ícone — ícone herda txt-on do botão */
.btn-primary {
  color: var(--semantic-color-interface-function-primary-normal-txt-on);
}
.btn-primary .icon {
  /* currentColor = txt-on do botão automaticamente */
}
```

Para ícones que precisam de cor independente do texto pai:

```css
.icon--brand {
  color: var(--semantic-color-brand-branding-first-default-background);
}

.icon--muted {
  color: var(--semantic-color-text-muted);
}
```

**Evite SVGs com fill ou stroke hardcoded em hex** — eles não respondem ao dark mode.

---

## Imagens e Mídia

O engine não controla imagens — elas são responsabilidade do componente. Padrões recomendados:

### Overlay de legibilidade

Use tokens de opacidade para garantir legibilidade de texto sobre imagens em ambos os modos:

```css
.hero {
  position: relative;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  /* Overlay escuro para texto claro sobre imagem */
  background: var(--semantic-opacity-color-grayscale-super-translucid);
}

.hero__title {
  /* Texto sempre sobre o overlay — contraste garantido */
  color: var(--semantic-color-brand-ambient-contrast-deep-positive-background);
}
```

### Imagens que se adaptam ao modo

Para illustrations ou imagens que têm versão light e dark, use `picture` com media query:

```html
<picture>
  <source 
    srcset="illustration-dark.svg" 
    media="(prefers-color-scheme: dark)" />
  <img src="illustration-light.svg" alt="..." />
</picture>
```

Ou via CSS com `content-visibility` quando o tema é controlado por atributo:

```css
[data-theme*="-light-"] .illustration--dark { display: none; }
[data-theme*="-dark-"] .illustration--light { display: none; }
```

---

## Shadows e Elevação em Dark Mode

Em light mode, sombras são escuras sobre fundo claro. Em dark mode, sombras quase puras são visualmente "pesadas" — elas perdem impacto em fundos escuros porque o contraste é menor.

O engine lida com isso via tokens de depth e os estilos compostos de elevação da Foundation. Os estilos já têm os valores corretos para cada modo.

Se você precisar de shadow manual, use opacity reduzida em dark mode:

```css
.card {
  /* Light mode: sombra escura visível */
  box-shadow:
    0 var(--semantic-depth-spread-near)px
    var(--semantic-depth-spread-distant)px
    var(--semantic-opacity-color-grayscale-semi-translucid);
}

/* Dark mode: sombra com menos opacidade para não "sufocar" o componente */
[data-theme*="-dark-"] .card {
  box-shadow:
    0 var(--semantic-depth-spread-near)px
    var(--semantic-depth-spread-distant)px
    var(--semantic-opacity-color-grayscale-super-transparent);
}
```

Quando possível, prefira os estilos de elevação compostos da Foundation — eles já encapsulam esse ajuste.

---

## Anti-Patterns

### Hardcoded hex em componentes

```css
/* ERRADO — não responde ao dark mode */
.badge {
  background: #D7F6CB;
  color: #1a1a1a;
}

/* CERTO */
.badge {
  background: var(--semantic-color-interface-feedback-success-default-normal-background);
  color:      var(--semantic-color-interface-feedback-success-default-normal-txt-on);
}
```

### @media prefers-color-scheme com valores manuais

```css
/* ERRADO — duplica lógica que o sistema já resolve */
.card {
  background: #ffffff;
  color: #1a1a1a;
}

@media (prefers-color-scheme: dark) {
  .card {
    background: #1a1a1a;
    color: #ffffff;
  }
}

/* CERTO — o token resolve ambos os casos */
.card {
  background: var(--semantic-color-brand-ambient-contrast-deep-positive-background);
  color:      var(--semantic-color-text-body);
}
```

### Misturar tokens de camadas internas para "ajuste manual"

```css
/* ERRADO — brand.* é camada interna, não responde corretamente ao dark mode */
.btn {
  background: var(--brand-branding-first-100-background);
}

/* CERTO — Semantic já encapsula a lógica de modo */
.btn {
  background: var(--semantic-color-interface-function-primary-normal-background);
}
```

### Criar variáveis CSS customizadas com hex para "conveniência"

```css
/* ERRADO — a variável local não muda com o tema */
:root {
  --minha-cor-primaria: #C40145;
}

.btn { background: var(--minha-cor-primaria); }

/* CERTO — referenciar o token canônico */
.btn { background: var(--semantic-color-interface-function-primary-normal-background); }
```

---

## Checklist de Dark Mode para Componentes

Antes de publicar um novo componente ou variante, verifique:

1. **Nenhum hex hardcoded** no CSS do componente
2. **Nenhuma `@media prefers-color-scheme`** com valores manuais de cor
3. **SVGs usam `currentColor`** ou tokens Semantic — sem `fill`/`stroke` fixo em hex
4. **Par background + txtOn** do mesmo token em todas as superfícies coloridas
5. **Imagens com overlay** usam token de opacidade, não cor hardcoded
6. **Sombras usam** os estilos de elevação da Foundation ou tokens `semantic.opacity`
7. **Testar os 4 temas básicos:** light/positive, dark/positive, light/negative, dark/negative

---

## Referências

- Mecanismo de inversão de escala: [01-colors.md](../03-visual-foundations/01-colors.md#dark-mode)
- Pipeline OKLCh: [06-mathematics-and-algorithms.md](../03-visual-foundations/06-mathematics-and-algorithms.md)
- Contrato de tokens: [01-component-token-contract.md](./01-component-token-contract.md)
- Variantes e estados: [02-component-variants.md](./02-component-variants.md)
- Formatos de output e troca de tema: [05-output-formats.md](../04-theme-engine/05-output-formats.md#troca-de-tema-em-runtime)
- Sistema de opacidade: [05-opacity.md](../03-visual-foundations/05-opacity.md)
- Depth e elevação: [04-depth-elevation.md](../03-visual-foundations/04-depth-elevation.md)
- Configuração de darkModeChroma: [03-configuration-guide.md](../04-theme-engine/03-configuration-guide.md#outras-opções-relevantes)
