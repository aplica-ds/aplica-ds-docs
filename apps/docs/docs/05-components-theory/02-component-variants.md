---
title: "Variantes e Estados de Componentes"
lang: pt-BR
---

# Variantes e Estados de Componentes

## Premissa

Cada componente existe em múltiplas **variantes** (primary, secondary, ghost…) e múltiplos **estados** (normal, hover, active, focus, disabled). O sistema de tokens trata variantes e estados como dimensões independentes e previsíveis — não como combinações ad hoc.

Este documento mostra como mapear cada combinação de variante × estado para o token correto, e como aplicar esse padrão a qualquer componente do DS.

---

## O Modelo: Variante × Estado × Propriedade

A estrutura de tokens de interface segue um padrão de três eixos:

```
semantic.color.interface.function.{variante}.{estado}.{propriedade}
```

| Eixo | Valores disponíveis |
|------|---------------------|
| **Variante** | `primary`, `secondary`, `link`, `active`, `disabled` |
| **Estado** | `normal`, `action`, `active` (`disabled` só tem `normal`) |
| **Propriedade** | `background`, `txtOn`, `border`, `txt` (desde 3.6.0) |

Esses três eixos formam a **grade de tokens funcionais**. Para qualquer combinação de variante e estado, o token correspondente já existe no build.

---

## Estados — Mapeamento para CSS

| Estado do token | Trigger no CSS |
|----------------|---------------|
| `normal` | Estado padrão — sem pseudo-classe |
| `action` | `:hover`, `:focus-visible` (durante o feedback visual de interação) |
| `active` | `:active` (pressed), `[aria-selected="true"]`, `[aria-pressed="true"]` |

O estado `disabled` é um caso especial: só existe `normal` e nunca responde a `:hover` ou `:active`.

---

## Variantes de Função — Botões e Controles

### Tabela de tokens por variante

| Variante | Quando usar |
|---------|-------------|
| `primary` | CTA principal — a ação mais importante da tela |
| `secondary` | Ação de suporte — complementa o primário |
| `link` | Ação textual — baixa proeminência, navegacional |
| `active` | Controle atualmente selecionado (toggle, tab ativa) |
| `disabled` | Controle não disponível para interação |

### Exemplo: Botão com todos os estados

```css
/* ── Botão Primary ── */
.btn-primary {
  background: var(--semantic-color-interface-function-primary-normal-background);
  color:      var(--semantic-color-interface-function-primary-normal-txt-on);
  border:     1px solid var(--semantic-color-interface-function-primary-normal-border);
}

.btn-primary:hover,
.btn-primary:focus-visible {
  background: var(--semantic-color-interface-function-primary-action-background);
  color:      var(--semantic-color-interface-function-primary-action-txt-on);
  border:     1px solid var(--semantic-color-interface-function-primary-action-border);
}

.btn-primary:active,
.btn-primary[aria-pressed="true"] {
  background: var(--semantic-color-interface-function-primary-active-background);
  color:      var(--semantic-color-interface-function-primary-active-txt-on);
  border:     1px solid var(--semantic-color-interface-function-primary-active-border);
}

/* ── Botão Disabled ── */
.btn-primary:disabled,
.btn-primary[aria-disabled="true"] {
  background: var(--semantic-color-interface-function-disabled-normal-background);
  color:      var(--semantic-color-interface-function-disabled-normal-txt-on);
  border:     1px solid var(--semantic-color-interface-function-disabled-normal-border);
  cursor: not-allowed;
}
```

### Exemplo: Botão Secondary

```css
.btn-secondary {
  background: var(--semantic-color-interface-function-secondary-normal-background);
  color:      var(--semantic-color-interface-function-secondary-normal-txt-on);
  border:     1px solid var(--semantic-color-interface-function-secondary-normal-border);
}

.btn-secondary:hover {
  background: var(--semantic-color-interface-function-secondary-action-background);
}

.btn-secondary:active {
  background: var(--semantic-color-interface-function-secondary-active-background);
}
```

---

## Variantes de Feedback — Alerts, Banners, Toasts

Componentes de feedback seguem o padrão `{tipo}.{variante}.{estado}`:

```
semantic.color.interface.feedback.{tipo}.{variante}.{estado}.{propriedade}
```

| Segmento | Valores |
|----------|---------|
| `{tipo}` | `info`, `success`, `warning`, `danger` |
| `{variante}` | `default` (suave, para backgrounds), `secondary` (saturada, para bordas e ícones) |
| `{estado}` | `normal`, `action`, `active` |

### Exemplo: Alert com todos os tipos

```css
/* Alert genérico */
.alert {
  padding: var(--semantic-dimension-spacing-small);
  border-radius: var(--semantic-border-radii-small);
  border-left: 4px solid;
}

/* Info */
.alert--info {
  background:   var(--semantic-color-interface-feedback-info-default-normal-background);
  color:        var(--semantic-color-interface-feedback-info-default-normal-txt-on);
  border-color: var(--semantic-color-interface-feedback-info-secondary-normal-border);
}

/* Success */
.alert--success {
  background:   var(--semantic-color-interface-feedback-success-default-normal-background);
  color:        var(--semantic-color-interface-feedback-success-default-normal-txt-on);
  border-color: var(--semantic-color-interface-feedback-success-secondary-normal-border);
}

/* Warning */
.alert--warning {
  background:   var(--semantic-color-interface-feedback-warning-default-normal-background);
  color:        var(--semantic-color-interface-feedback-warning-default-normal-txt-on);
  border-color: var(--semantic-color-interface-feedback-warning-secondary-normal-border);
}

/* Danger */
.alert--danger {
  background:   var(--semantic-color-interface-feedback-danger-default-normal-background);
  color:        var(--semantic-color-interface-feedback-danger-default-normal-txt-on);
  border-color: var(--semantic-color-interface-feedback-danger-secondary-normal-border);
}
```

**Regra:** sempre use `default` para o fundo e `secondary` para borda e ícone — essa combinação garante hierarquia visual e contraste adequado.

---

## Variantes de Input — Estados de Validação

Inputs têm um estado de validação que se sobrepõe ao estado interativo:

```css
/* Input — estado normal */
.input {
  background: var(--semantic-color-brand-ambient-contrast-deep-positive-background);
  color:      var(--semantic-color-text-body);
  border:     1px solid var(--semantic-color-brand-ambient-neutral-mid-border);
  border-radius: var(--semantic-border-radii-extra-small);
  padding: var(--semantic-dimension-spacing-extra-small) var(--semantic-dimension-spacing-small);
}

/* Input — focus */
.input:focus-visible {
  border-color: var(--semantic-color-interface-function-primary-action-border);
  outline: none;
}

/* Input — erro */
.input--error {
  border-color: var(--semantic-color-interface-feedback-danger-secondary-normal-border);
}

/* Mensagem de erro abaixo do input */
.input__error-msg {
  color: var(--semantic-color-text-danger_default);
  font-size: var(--semantic-typography-font-sizes-extra-small);
}

/* Input — sucesso */
.input--success {
  border-color: var(--semantic-color-interface-feedback-success-secondary-normal-border);
}

/* Input — desabilitado */
.input:disabled {
  background: var(--semantic-color-interface-function-disabled-normal-background);
  color:      var(--semantic-color-interface-function-disabled-normal-txt-on);
  border-color: var(--semantic-color-interface-function-disabled-normal-border);
  cursor: not-allowed;
}
```

---

## Variantes de Intensidade — Componentes de Marca

Para componentes que expressam a identidade de marca (badges, chips, tags de marca), use os níveis de intensidade do `brand.branding`:

```
semantic.color.brand.branding.{papel}.{intensidade}.{propriedade}
```

| Intensidade | Visual | Uso típico |
|-------------|--------|-----------|
| `lowest` | Muito sutil | Background de chip, tag em contexto denso |
| `low` | Suave | Background de badge secundário |
| `default` | Padrão da marca | CTA, botão hero, elemento principal |
| `high` | Saturado/escuro | Texto de ênfase sobre fundo claro |
| `highest` | Máximo | Raro — elemento de altíssima proeminência |

```css
/* Chip de marca — suave */
.chip--brand {
  background: var(--semantic-color-brand-branding-first-lowest-background);
  color:      var(--semantic-color-brand-branding-first-lowest-txt-on);
  border:     1px solid var(--semantic-color-brand-branding-first-low-border);
}

/* Badge de marca — destaque */
.badge--brand {
  background: var(--semantic-color-brand-branding-first-default-background);
  color:      var(--semantic-color-brand-branding-first-default-txt-on);
}
```

---

## Variantes de Tamanho — Dimensão por Escala

Variantes de tamanho (small, medium, large) de um componente mapeiam para a escala de dimensão semântica. A convenção mais comum:

| Tamanho do componente | Spacing interno | Sizing de altura |
|----------------------|----------------|-----------------|
| `xs` | `micro` | `extraSmall` |
| `sm` | `extraSmall` | `small` |
| `md` | `small` | `medium` |
| `lg` | `medium` | `large` |
| `xl` | `large` | `extraLarge` |

```css
/* Botão medium (padrão) */
.btn--md {
  padding:     var(--semantic-dimension-spacing-extra-small) var(--semantic-dimension-spacing-small);
  height:      var(--semantic-dimension-sizing-large);
  font-size:   var(--semantic-typography-font-sizes-small);
  border-radius: var(--semantic-border-radii-small);
}

/* Botão small */
.btn--sm {
  padding:     var(--semantic-dimension-spacing-micro) var(--semantic-dimension-spacing-extra-small);
  height:      var(--semantic-dimension-sizing-medium);
  font-size:   var(--semantic-typography-font-sizes-extra-small);
  border-radius: var(--semantic-border-radii-extra-small);
}

/* Botão large */
.btn--lg {
  padding:     var(--semantic-dimension-spacing-small) var(--semantic-dimension-spacing-medium);
  height:      var(--semantic-dimension-sizing-extra-large);
  font-size:   var(--semantic-typography-font-sizes-medium);
  border-radius: var(--semantic-border-radii-medium);
}
```

---

## O Estado Disabled — Dois Padrões

Há duas formas válidas de implementar o estado disabled; a escolha depende do tipo de componente.

### Padrão 1 — Token de disabled (preferido para botões e controles)

Use os tokens `interface.function.disabled` — eles garantem o contraste correto sobre o background atual:

```css
.btn:disabled {
  background: var(--semantic-color-interface-function-disabled-normal-background);
  color:      var(--semantic-color-interface-function-disabled-normal-txt-on);
  border-color: var(--semantic-color-interface-function-disabled-normal-border);
}
```

### Padrão 2 — Opacidade (para conteúdo e regiões inteiras)

Quando uma seção inteira está desabilitada e não faz sentido trocar cada token individual:

```css
.section--disabled {
  opacity: calc(var(--semantic-opacity-raw-translucid) / 100); /* 50% */
  pointer-events: none;
}
```

> **Atenção:** Opacidade sozinha não garante contraste suficiente sobre todos os fundos. Use com cuidado em texto pequeno. Para controles individuais, sempre prefira o Padrão 1.

---

## Focus Ring — Acessibilidade por Token

O anel de foco é um elemento de acessibilidade obrigatório (WCAG 2.4.7). Use a borda da variante `action` do papel correspondente:

```css
/* Focus ring genérico */
:focus-visible {
  outline: 2px solid var(--semantic-color-interface-function-primary-action-border);
  outline-offset: 2px;
}

/* Focus em elemento de feedback (ex: alerta clicável) */
.alert:focus-visible {
  outline-color: var(--semantic-color-interface-feedback-info-secondary-normal-border);
}
```

---

## Variantes de Produto — Badges e Selos

Componentes de sinalização de produto (badges de promo, selos de cashback, indicadores de tier) usam `semantic.color.product.*`:

```css
/* Badge de promoção */
.badge--promo {
  background: var(--semantic-color-product-promo-default-default-background);
  color:      var(--semantic-color-product-promo-default-default-txt-on);
  border:     1px solid var(--semantic-color-product-promo-default-default-border);
}

/* Variante sutil de promo (menor proeminência) */
.badge--promo-subtle {
  background: var(--semantic-color-product-promo-default-lowest-background);
  color:      var(--semantic-color-product-promo-default-lowest-txt-on);
}

/* Badge de cashback */
.badge--cashback {
  background: var(--semantic-color-product-cashback-default-default-background);
  color:      var(--semantic-color-product-cashback-default-default-txt-on);
}
```

---

## Componente de Referência — Mapa Completo (Button)

A tabela abaixo mostra o mapeamento completo de tokens para um componente Button com 3 variantes e 4 estados:

| Variante | Estado | Background | Text | Border |
|---------|--------|-----------|------|--------|
| **primary** | normal | `function.primary.normal.background` | `function.primary.normal.txtOn` | `function.primary.normal.border` |
| **primary** | hover | `function.primary.action.background` | `function.primary.action.txtOn` | `function.primary.action.border` |
| **primary** | pressed | `function.primary.active.background` | `function.primary.active.txtOn` | `function.primary.active.border` |
| **primary** | disabled | `function.disabled.normal.background` | `function.disabled.normal.txtOn` | `function.disabled.normal.border` |
| **secondary** | normal | `function.secondary.normal.background` | `function.secondary.normal.txtOn` | `function.secondary.normal.border` |
| **secondary** | hover | `function.secondary.action.background` | `function.secondary.action.txtOn` | `function.secondary.action.border` |
| **secondary** | pressed | `function.secondary.active.background` | `function.secondary.active.txtOn` | `function.secondary.active.border` |
| **secondary** | disabled | `function.disabled.normal.background` | `function.disabled.normal.txtOn` | `function.disabled.normal.border` |
| **link** | normal | transparente | `function.link.normal.txtOn` | none |
| **link** | hover | `function.link.action.background` | `function.link.action.txtOn` | none |
| **link** | pressed | `function.link.active.background` | `function.link.active.txtOn` | none |
| **link** | disabled | `function.disabled.normal.background` | `function.disabled.normal.txtOn` | `function.disabled.normal.border` |

Todos os caminhos acima são prefixados com `semantic.color.interface.`.

---

## Referências

- Contrato de tokens: [01-component-token-contract.md](./01-component-token-contract.md)
- Padrões de dark mode: [03-dark-mode-patterns.md](./03-dark-mode-patterns.md)
- Camada Semantic: [04-semantic-layer.md](../02-token-layers/04-semantic-layer.md)
- Sistema de cores: [01-colors.md](../03-visual-foundations/01-colors.md)
- Sistema de dimensão: [03-spacing-sizing.md](../03-visual-foundations/03-spacing-sizing.md)
- Opacidade: [05-opacity.md](../03-visual-foundations/05-opacity.md)
- Tokens semânticos (fonte): [default.json](../../references/aplica-tokens-theme-engine/data/semantic/default.json)
