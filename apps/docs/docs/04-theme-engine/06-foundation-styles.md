---
title: "Foundation Styles"
lang: pt-br
---

# Foundation Styles

## O que são

Foundation Styles são definições de classes CSS pré-compostas geradas pelo Aplica Tokens Theme Engine. Diferentemente de tokens atômicos (propriedades CSS individuais), Foundation Styles agrupam várias referências de tokens em uma única classe com nome semântico.

O engine produz dois arquivos de estilos por foundation brand:

| Arquivo | Conteúdo |
|---------|---------|
| `data/foundation/{brand}/styles/typography_styles.json` | Definições compostas de tipografia (font-family, weight, size, line-height, letter-spacing, text-transform, text-decoration) |
| `data/foundation/{brand}/styles/elevation_styles.json` | Definições compostas de box-shadow por nível de elevação |

Esses arquivos JSON são compilados em classes CSS pelo step de build do Style Dictionary:

| Output CSS | Localização |
|------------|------------|
| `dist/css/foundation/{brand}/typography.css` | Classes utilitárias de tipografia |
| `dist/css/foundation/{brand}/elevation.css` | Classes utilitárias de elevação |

---

## Por que estilos compostos e não tokens atômicos

Tokens atômicos são flexíveis, mas exigem que múltiplas propriedades sejam montadas no ponto de uso. Cada componente que precisa de um estilo de heading deve referenciar individualmente font-family, weight, size, line-height, letter-spacing, text-transform e text-decoration. Isso cria:

- Repetição no nível de componente
- Risco de inconsistência quando as propriedades são montadas incorretamente
- Dificuldade para geradores de código com IA, que precisam raciocinar sobre tokens individuais e compô-los corretamente a cada vez

Foundation Styles codificam a combinação correta uma vez. Um componente aplica uma única classe; a definição de estilo é o contrato.

Este também é o padrão de consumo preferido pelo AI UI Integration Program: agentes de IA são instruídos a preferir classes de `typography.css` em vez de montar referências individuais de tokens.

---

## Nomenclatura de classes de tipografia

Classes de tipografia seguem este padrão:

```
.typography-{foundation}-{category}-{variant}
```

Exemplos:

```css
.typography-theme_engine-heading-title_1 { ... }
.typography-theme_engine-heading-title_2 { ... }
.typography-theme_engine-action-strong-tight-medium { ... }
.typography-theme_engine-body-regular-loose-medium { ... }
```

Cada classe define todas as propriedades tipográficas usando referências a tokens semânticos:

```css
.typography-theme_engine-heading-title_1 {
  font-family:     var(--semantic-typography-fontFamilies-main);
  font-weight:     var(--semantic-typography-fontWeights-main-semibold-normal);
  font-size:       var(--semantic-typography-fontSizes-medium);
  line-height:     var(--semantic-typography-lineHeights-close-medium);
  letter-spacing:  var(--semantic-typography-letterSpacings-regular);
  text-transform:  var(--semantic-typography-textCase-uppercase);
  text-decoration: var(--semantic-typography-textDecoration-default);
}
```

As propriedades customizadas CSS dentro da classe são resolvidas em runtime a partir do arquivo de tema ativo — trocar temas alterando `data-theme` atualiza tanto os tokens atômicos quanto os valores que essas classes referenciam.

---

## Nomenclatura de classes de elevação

Classes de elevação são nomeadas por nível:

```css
.elevation-level_minus_one { box-shadow: ... }
.elevation-level_zero      { box-shadow: ... }
.elevation-level_one       { box-shadow: ... }
.elevation-level_two       { box-shadow: ... }
.elevation-level_three     { box-shadow: ... }
.elevation-level_four      { box-shadow: ... }
.elevation-level_five      { box-shadow: ... }
```

Cada classe compõe tokens de depth spread e opacidade:

```css
.elevation-level_two {
  box-shadow:
    var(--semantic-dimension-sizing-zero)
    var(--semantic-dimension-sizing-nano)
    var(--semantic-dimension-sizing-large)
    calc(0px + var(--semantic-depth-spread-next))
    var(--semantic-opacity-color-grayscale-superTransparent);
}
```

Elevação é definida por foundation brand (não por tema), então todos os temas que compartilham uma foundation usam as mesmas definições de classes de elevação. Os valores de cor e spread da sombra resolvem dinamicamente a partir dos tokens semânticos do tema.

---

## Como carregar Foundation Styles

Importe tanto o arquivo de tema ativo quanto as folhas de estilo de foundation:

```html
<!-- 1. Tema ativo (resolve todas as variáveis --semantic-* e --foundation-*) -->
<link rel="stylesheet" href="/dist/css/aplica_joy-light-positive.css" />

<!-- 2. Foundation styles (definições de classes que referenciam as variáveis acima) -->
<link rel="stylesheet" href="/dist/css/foundation/engine/typography.css" />
<link rel="stylesheet" href="/dist/css/foundation/engine/elevation.css" />
```

A ordem importa: o arquivo de tema deve ser carregado primeiro para que as propriedades customizadas existam quando as definições de classes forem interpretadas.

Em seguida, aplique as classes diretamente no markup:

```html
<h1 class="typography-theme_engine-heading-title_1">Título da página</h1>

<div class="elevation-level_two" style="padding: 1.5rem; border-radius: 0.5rem;">
  Conteúdo do card
</div>
```

---

## Quando a geração é acionada

Foundation Styles são geradas como parte do step `foundations:generate`, que roda automaticamente durante um build completo:

```bash
theme-engine build
```

Para regenerar apenas os dados de foundation (incluindo estilos) sem um build completo:

```bash
theme-engine foundations:generate
```

---

## Relação com o AI UI Integration Program

O AI UI Integration Program designa Foundation Styles como o **caminho de consumo preferido** para código de UI gerado por IA. Quando um agente de IA constrói um componente usando tokens Aplica, ele deve:

1. Aplicar uma classe `typography-*` para estilização de texto — não montar tokens de fonte individuais.
2. Aplicar uma classe `elevation-*` para sombras — não compor valores brutos de box-shadow a partir de tokens de depth.
3. Usar propriedades customizadas `--foundation-*` ou `--semantic-*` para cor, espaçamento e outros valores atômicos.

Essa preferência existe porque Foundation Styles codificam composições validadas e autorais. Uma IA que compõe tokens atômicos de forma independente pode produzir combinações sintaticamente corretas mas semanticamente incorretas (por exemplo, escala de line-height errada para um dado tamanho de fonte).

---

## Aliases foundation.txt (desde 3.6.0)

Além das classes de typography e elevation, a camada foundation expõe **aliases de cor de texto legível** sob `foundation.txt.*`. São aliases planos — um token por conceito semântico — que fornecem a cor de texto correta, legível sobre canvas, para cada família de cor.

```
foundation.txt.info      → var(--foundation-txt-info)
foundation.txt.success   → var(--foundation-txt-success)
foundation.txt.warning   → var(--foundation-txt-warning)
foundation.txt.danger    → var(--foundation-txt-danger)
foundation.txt.primary   → var(--foundation-txt-primary)   (se textExposure incluir 'interfaceFunction')
foundation.txt.promo     → var(--foundation-txt-promo)     (se textExposure incluir 'product')
```

Esses aliases são distintos dos tokens `txtOn` (texto sobre fundos coloridos). Os aliases `foundation.txt.*` são para **texto em fluxo de conteúdo sobre canvas** — parágrafos, labels e headings que carregam a cor semântica de uma família sem estarem sobre uma superfície colorida.

Quais famílias são expostas é controlado por `generation.colorText.textExposure` no workspace config. O padrão é `['feedback']` apenas. Veja [07-txt-token.md](../02-token-layers/07-txt-token.md) para o contrato completo.

---

## Referências

- Pipeline de build: [04-build-pipeline.md](./04-build-pipeline.md)
- Formatos de output: [05-output-formats.md](./05-output-formats.md)
- AI Skills Injection: [07-ai-skills-injection.md](./07-ai-skills-injection.md)
- Contrato do token txt: [../02-token-layers/07-txt-token.md](../02-token-layers/07-txt-token.md)
