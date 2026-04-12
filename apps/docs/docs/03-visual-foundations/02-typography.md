---
title: "Sistema Tipográfico do Aplica DS"
lang: pt-BR
---

# Sistema Tipográfico do Aplica DS

## Premissa

No Aplica DS, a tipografia não é tratada apenas como estética, mas como um sistema matemático e hierárquico construído para garantir legibilidade, consistência espacial e ritmo vertical. 

Enquanto a Brand define *qual* fonte será usada (família tipográfica, pesos disponíveis), o sistema tipográfico define as **escalas**, **entrelinhas** e a **semântica** de uso (como um agrupamento de propriedades que forma a *Tipografia Semântica*).

---

## Escala de Tamanhos (Font Sizes)

A escala tipográfica evoluiu na V2 para cobrir casos de uso mais amplos (de micro interfaces a dashboards hero), totalizando **13 tamanhos**.

O sistema é baseado em uma escala musical (**Major Third, razão \~1.2**), arredondada para gerar valores pares ou inteiros amigáveis ao grid, garantindo progressão perceptível entre os níveis.

| Tamanho (Token) | Valor base em `normal` | Racional na Escala |
|-----------------|------------------------|--------------------|
| `nano`          | 8px                    | Base mínima p/ badges |
| `micro`         | 10px                   | Textos de suporte mínimos |
| `extraSmall`    | 12px                   | Metadados / Labels menores |
| `small`         | 14px                   | Texto secundário |
| **`medium`**    | **16px**               | **Base size (1rem)** |
| `large`         | 20px                   | Texto de destaque médio |
| `extraLarge`    | 24px                   | Títulos de seção (H4) |
| `mega`          | 28px                   | Subtítulos fortes (H3) |
| `giga`          | 36px                   | Títulos de página (H2) |
| `tera`          | 40px                   | Hero block (H1) |
| `peta`          | 48px                   | Títulos de impacto |
| `exa`           | 60px                   | Display secundário |
| `zetta`         | 72px                   | Display principal superdimensionado |

*Nota estrutural:* Estes valores de pixels são a âncora da dimensão `normal`. O sistema é capaz de converter esses valores em `rem` no build para web, baseando-se no root (`16px`).

---

## Entrelinhas (Line Heights)

Para manter o ritmo vertical exato (Vertical Rhythm) na Web e Mobile, todas as entrelinhas são strictamente travadas (locked) ao **Grid de 4px**. 

A V2 substituiu as antigas entrelinhas "mágicas" por um algoritmo previsível baseado em multiplicadores (factors) aplicados ao `fontSize` associado.

### Multiplicadores Semânticos

| Token de Line Height | Fator | Semântica e Uso |
|----------------------|-------|-----------------|
| `tight`              | **1.0x** (100%) | Elementos de UI isolados (botões, badges, links, inputs). Altura = Tamanho da fonte, o preenchimento fica a encargo do *padding* do componente. |
| `close`              | **1.2x** (120%) | Títulos (Heading/Display). Textos curtos de alto impacto onde um espaçamento largo causaria dispersão ocular. |
| `regular`            | **1.4x** (140%) | Textos de corpo (Body). Parágrafos longos, focado totalmente em conforto de leitura. |
| `wild`               | **1.8x** (180%) | Textos institucionais e citações onde o *white-space* atua como elemento estético agressivo. |

### Algoritmo de Derivação e Arredondamento

A entrelinha é sempre um múltiplo de `4px`. Se o cálculo gerar um valor que não é redondo, o sistema sempre **arredonda para cima** (*round up* / `ceil`) até o próximo múltiplo de 4. 

```javascript
// A regra matemática do Engine:
lineHeight = Math.ceil((fontSize * multiplier) / 4) * 4;
```

**Exemplo prático de derivação (`giga` = 36px):**
- `tight` = `36 * 1.0` = **36px** (já é múltiplo de 4)
- `close` = `36 * 1.2` = 43.2 → teto para **44px**
- `regular` = `36 * 1.4` = 50.4 → teto para **52px**
- `wild` = `36 * 1.8` = 64.8 → teto para **68px**

Garantir múltiplos de 4 no `lineHeight` impede o desvio (shift) dos layouts e alinhamentos em grade invisível, eliminando pixels fracionados (`sub-pixels`) nas interfaces renderizadas.

---

## Tipografia Semântica (Styles)

Em interfaces, raramente consumimos tokens tipográficos isolados (como "dar a fonte 16px, o peso Regular e o line-height 140%"). Componentes e plataformas consomem *agrupamentos*.

O Aplica Theme Engine exporta **Typography Styles** (no Figma: Text Styles / na Web: classes CSS utilitárias). Esses estilos casam `fontFamily`, `fontSize`, `fontWeight`, `lineHeight` e `letterSpacing` numa hierarquia clara.

### Categorias de Estilos

| Categoria | Papel | Exemplos de Estilos exportados |
|-----------|-------|--------------------------------|
| **Heading** | Títulos hierárquicos em estrutura de página (H1-H6) e destaques de cards. Usa line-height `close` (120%). | `title_1` a `title_5` ; `highlight_1` a `highlight_5` |
| **Display** | Textos gigantes, extravagantes para hero-sections e banners. Pesos fortes. Usa `zetta` ou `exa`. | `display_1` a `display_3` |
| **Content** | Textos de parágrafos, leitura, listas e labels. Foco no `medium` (16px) e line-height `regular` (140%). | `body_large`, `body`, `body_small`, `label`, `quote` |
| **Action** | Textos clicáveis restritos. Elementos de UI como botões, abas, links e chips. Usa `tight` e pesos bold/semibold. | `action.strong.small`, `link.medium` |
| **Code** | Textos em monospaced para interfaces técnicas e desenvolvimento. | `code.small`, `code.medium` |

Ao restringir engenheiros e designers ao uso desses **Estilos (Styles)**, o Design System esconde a complexidade matemática descrita acima. Se alguém tenta centralizar um botão usando `title_1`, a interface quebra pela ausência ou excesso de line-height – o sistema natural e algoritmicamente força a semântica correta.

---

## Histórico: Da V1 para V2

A maior mudança entre a versão legada (Alpha / V1) e a V2 foi a automação matemática. 

Na V1, o sistema propunha **11 tamanhos**, com entrelinhas fixadas e "ajustadas no olho" ou documentadas numa tabela solta (onde designers tinham de mapear `Nano 10 + Tight 1.0 = 12`).

A V2 expandiu os pontos nas extremidades (introduzindo os gigantes `exa` e `zetta`, e o minúsculo `nano` caindo para 8px) para comportar Data Viz e Marketing, chegando a **13 tamanhos**. Além disso, todos os cálculos passaram para o processamento em Node no Style Dictionary (`theme-engine`), forçando matematicamente a fidelidade ao Grid Base 4 em todos os outputs e plataformas nativas, resolvendo problemas crônicos de quebra de grid no desenvolvimento Android e Web.

---

## Referências

- Script de geração: typography-generator.mjs
- Escala derivada por Dimension: typography-scale-from-dimension.mjs
- Spec técnica: TYPOGRAPHY-SPEC.md
- Detalhe da escala: 02-typography-scale.md
- Line heights: 03-line-height-scale.md
- Matemática e algoritmos: [06-mathematics-and-algorithms.md](./06-mathematics-and-algorithms.md)
- Camada Dimension: [06-dimension-layer.md](../02-token-layers/06-dimension-layer.md)
