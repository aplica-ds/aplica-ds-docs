---
level: n3
id: N3-02
title: "Construindo um componente — variantes, estados e tamanhos"
prerequisites: ["N3-01"]
duration: "15 min"
lang: pt-BR
---

# N3-02 · Construindo um componente

## Contexto

Você domina o contrato de tokens. Agora o desafio é prático: dado um componente com múltiplas variantes, múltiplos estados e múltiplos tamanhos, como encontrar o token certo para cada combinação sem precisar adivinhar?

O engine não é arbitrário. A estrutura do Semantic foi projetada para que a pergunta "qual token uso aqui?" tenha sempre uma resposta previsível. Este tutorial ensina o modelo — depois que você o internalizar, qualquer componente segue o mesmo padrão.

---

## Conceito

### O modelo tridimensional

Todo componente interativo vive na interseção de três eixos:

```
semantic.color.interface.function.{variante}.{estado}.{propriedade}
```

| Eixo | Valores |
|------|---------|
| **Variante** | `primary`, `secondary`, `link`, `active`, `disabled` |
| **Estado** | `normal`, `action`, `active` |
| **Propriedade** | `background`, `txtOn`, `border`, `txt` (desde 3.6.0 — para texto de conteúdo sobre canvas) |

Para componentes de feedback, o modelo é ligeiramente diferente:

```
semantic.color.interface.feedback.{tipo}.{variante}.{estado}.{propriedade}
```

| Eixo | Valores |
|------|---------|
| **Tipo** | `info`, `success`, `warning`, `danger` |
| **Variante** | `default` (suave, para backgrounds), `secondary` (saturada, para bordas/ícones) |
| **Estado** | `normal`, `action`, `active` |

### Mapeamento de estados para CSS

| Estado do token | Trigger no CSS/HTML |
|----------------|---------------------|
| `normal` | Sem pseudo-classe — estado de repouso |
| `action` | `:hover`, `:focus-visible` |
| `active` | `:active`, `[aria-pressed="true"]`, `[aria-selected="true"]` |
| `disabled` | `:disabled`, `[aria-disabled="true"]` — só tem `normal`, nunca responde a hover |

---

## Exemplo guiado

### Parte 1 — Button completo

Construindo um Button com três variantes × quatro estados × três propriedades cada:

```css
/* ── Base ── */
.btn {
  display:         inline-flex;
  align-items:     center;
  justify-content: center;
  border:          1px solid transparent;
  cursor:          pointer;
  font-family:     var(--semantic-typography-font-families-main);
  transition:      background 120ms ease, color 120ms ease, border-color 120ms ease;
}

/* ── Primary ── */
.btn--primary {
  background:   var(--semantic-color-interface-function-primary-normal-background);
  color:        var(--semantic-color-interface-function-primary-normal-txt-on);
  border-color: var(--semantic-color-interface-function-primary-normal-border);
}
.btn--primary:hover,
.btn--primary:focus-visible {
  background:   var(--semantic-color-interface-function-primary-action-background);
  color:        var(--semantic-color-interface-function-primary-action-txt-on);
  border-color: var(--semantic-color-interface-function-primary-action-border);
}
.btn--primary:active,
.btn--primary[aria-pressed="true"] {
  background:   var(--semantic-color-interface-function-primary-active-background);
  color:        var(--semantic-color-interface-function-primary-active-txt-on);
  border-color: var(--semantic-color-interface-function-primary-active-border);
}

/* ── Secondary ── */
.btn--secondary {
  background:   var(--semantic-color-interface-function-secondary-normal-background);
  color:        var(--semantic-color-interface-function-secondary-normal-txt-on);
  border-color: var(--semantic-color-interface-function-secondary-normal-border);
}
.btn--secondary:hover,
.btn--secondary:focus-visible {
  background:   var(--semantic-color-interface-function-secondary-action-background);
  color:        var(--semantic-color-interface-function-secondary-action-txt-on);
  border-color: var(--semantic-color-interface-function-secondary-action-border);
}
.btn--secondary:active {
  background:   var(--semantic-color-interface-function-secondary-active-background);
}

/* ── Link ── */
.btn--link {
  background:   transparent;
  color:        var(--semantic-color-interface-function-link-normal-txt-on);
  border-color: transparent;
}
.btn--link:hover,
.btn--link:focus-visible {
  background:   var(--semantic-color-interface-function-link-action-background);
  color:        var(--semantic-color-interface-function-link-action-txt-on);
}
.btn--link:active {
  background:   var(--semantic-color-interface-function-link-active-background);
}

/* ── Disabled — mesma aparência para todas as variantes ── */
.btn:disabled,
.btn[aria-disabled="true"] {
  background:   var(--semantic-color-interface-function-disabled-normal-background);
  color:        var(--semantic-color-interface-function-disabled-normal-txt-on);
  border-color: var(--semantic-color-interface-function-disabled-normal-border);
  cursor:       not-allowed;
  pointer-events: none;
}
```

### Parte 2 — Tamanhos via escala dimensional

```css
/* ── Small ── */
.btn--sm {
  padding:       var(--semantic-dimension-spacing-micro) var(--semantic-dimension-spacing-extra-small);
  height:        var(--semantic-dimension-sizing-medium);
  font-size:     var(--semantic-typography-font-sizes-extra-small);
  border-radius: var(--semantic-border-radii-extra-small);
}

/* ── Medium (padrão) ── */
.btn--md {
  padding:       var(--semantic-dimension-spacing-extra-small) var(--semantic-dimension-spacing-small);
  height:        var(--semantic-dimension-sizing-large);
  font-size:     var(--semantic-typography-font-sizes-small);
  border-radius: var(--semantic-border-radii-small);
}

/* ── Large ── */
.btn--lg {
  padding:       var(--semantic-dimension-spacing-small) var(--semantic-dimension-spacing-medium);
  height:        var(--semantic-dimension-sizing-extra-large);
  font-size:     var(--semantic-typography-font-sizes-medium);
  border-radius: var(--semantic-border-radii-medium);
}
```

### Parte 3 — Focus ring (acessibilidade obrigatória)

O foco do teclado precisa ser visível. Use a borda `action` do papel correspondente como outline:

```css
/* Focus ring — aplica a todos os elementos interativos */
:focus-visible {
  outline:        2px solid var(--semantic-color-interface-function-primary-action-border);
  outline-offset: 2px;
}

/* Para elementos de feedback (ex: alerta clicável) */
.alert:focus-visible {
  outline-color: var(--semantic-color-interface-feedback-info-secondary-normal-border);
}
```

### Parte 4 — Input com estados de validação

```css
/* ── Base ── */
.input {
  background:    var(--semantic-color-brand-ambient-contrast-deep-positive-background);
  color:         var(--semantic-color-text-body);
  border:        1px solid var(--semantic-color-brand-ambient-neutral-mid-border);
  border-radius: var(--semantic-border-radii-extra-small);
  padding:       var(--semantic-dimension-spacing-extra-small) var(--semantic-dimension-spacing-small);
  font-size:     var(--semantic-typography-font-sizes-small);
  width:         100%;
}

/* ── Focus ── */
.input:focus-visible {
  border-color: var(--semantic-color-interface-function-primary-action-border);
  outline:      none;
}

/* ── Erro ── */
.input--error        { border-color: var(--semantic-color-interface-feedback-danger-secondary-normal-border); }
.input__error-msg    { color: var(--semantic-color-text-danger_default); font-size: var(--semantic-typography-font-sizes-extra-small); }

/* ── Sucesso ── */
.input--success      { border-color: var(--semantic-color-interface-feedback-success-secondary-normal-border); }

/* ── Disabled ── */
.input:disabled {
  background:   var(--semantic-color-interface-function-disabled-normal-background);
  color:        var(--semantic-color-interface-function-disabled-normal-txt-on);
  border-color: var(--semantic-color-interface-function-disabled-normal-border);
  cursor:       not-allowed;
}
```

---

## Agora você tenta

Construa um componente **Badge** com as seguintes especificações:

| Variante | Fonte semântica | Uso |
|----------|----------------|-----|
| `info` | `feedback.info.default.normal` | Badges informativos |
| `success` | `feedback.success.default.normal` | Confirmação, positivo |
| `warning` | `feedback.warning.default.normal` | Atenção |
| `danger` | `feedback.danger.default.normal` | Erro, crítico |
| `brand` | `brand.branding.first.default` | Destaque de marca |

**Requisitos:**
- Cada variante usa `background` + `txtOn` do mesmo token (par garantido)
- Borda usa a variante `secondary` do tipo de feedback correspondente
- `brand` usa `border` do mesmo token de branding
- `padding` e `border-radius` via tokens dimensionais

**Resultado esperado (exemplo para `info`):**

```css
.badge--info {
  background:   var(--semantic-color-interface-feedback-info-default-normal-background);
  color:        var(--semantic-color-interface-feedback-info-default-normal-txt-on);
  border:       1px solid var(--semantic-color-interface-feedback-info-secondary-normal-border);
  padding:      var(--semantic-dimension-spacing-micro) var(--semantic-dimension-spacing-extra-small);
  border-radius: var(--semantic-border-radii-circular);
  font-size:    var(--semantic-typography-font-sizes-extra-small);
}
```

---

## Checkpoint

Ao fim deste tutorial você deve saber:

- [ ] Usar o modelo `{variante}.{estado}.{propriedade}` para encontrar qualquer token de interface
- [ ] Mapear os estados do token para pseudo-classes CSS corretamente
- [ ] Usar dimensões e tipografia via tokens em vez de valores hardcoded
- [ ] Implementar focus ring acessível usando o token de borda `action`
- [ ] Sempre usar o par `background` + `txtOn` do mesmo token — nunca misturar
- [ ] Para feedback: `default` para backgrounds, `secondary` para bordas e ícones

---

## Próximo passo

[N3-03 · Dark mode por construção](./03-dark-mode-por-construcao.md)

Você construiu um componente correto. Mas ele funciona em dark mode? Spoiler: se você usou apenas tokens Semantic, a resposta é sim — e você vai entender exatamente por quê.

---

## Referências

- Referência completa de variantes e estados: [02-component-variants.md](../../05-components-theory/02-component-variants.md)
- Escala de dimensões: [03-spacing-sizing.md](../../03-visual-foundations/03-spacing-sizing.md)
- Sistema de opacidade: [05-opacity.md](../../03-visual-foundations/05-opacity.md)
