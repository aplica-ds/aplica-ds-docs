---
title: "Arquitetura de Tokens do Aplica DS"
lang: pt-BR
---

# Arquitetura de Tokens do Aplica DS

## Visão Geral

O Aplica DS organiza Design Tokens em **5 camadas sequenciais + 1 camada ortogonal (Dimension)**.

As 5 camadas sequenciais formam um pipeline de transformação: cada camada recebe os tokens da anterior e adiciona sua própria semântica. A camada Dimension corre em paralelo — ela não depende de brand, mode ou surface, mas alimenta diretamente as camadas Semantic e Foundation.

---

## O Pipeline de 5 Camadas

```
Brand ──┐
Mode   ─┼──────────────────────────────────── → Semantic → Foundation
Surface─┘                              ▲
                                       │
Dimension ─────────────────────────────┘
(minor / normal / major)
```

### Fluxo de build

No momento do build, o pipeline mescla:
1. `data/brand/<theme>/` — cores, gradientes, tipografia da marca
2. `data/mode/<mode>.json` — modulação de cor para light ou dark
3. `data/surface/<surface>.json` — contexto positivo ou negativo
4. `data/dimension/<variant>.json` — escala espacial e tipográfica
5. `data/semantic/default.json` — referencia todos os anteriores e cria os tokens com propósito
6. `data/foundation/<foundation>/` — aliases simplificados para consumo em componentes

O output é um arquivo por combinação: ex. `aplica_joy-light-positive.css` (com escala `normal` implícita).

---

## Camada 1 — Brand

**O que define:** A identidade visual da marca. Paleta de cores primária, cores de produto, cores de feedback, configuração de tipografia (famílias, pesos), gradientes e grayscale próprio.

**Características:**
- Cada brand é gerado dinamicamente pelo Theme Engine a partir de uma cor base
- A geração decompõe a cor em 19 níveis de paleta + 15 níveis de neutros + 5 estados comportamentais
- Multiple brands podem coexistir no mesmo sistema

**Tokens gerados por brand (exemplos):**
```
brand.color.palette.<level>          → ex: brand.color.palette.500
brand.color.neutrals.<level>         → ex: brand.color.neutrals.300
brand.color.behavior.<state>         → ex: brand.color.behavior.hover
brand.typography.fontFamilies.main   → ex: "Inter"
brand.typography.fontWeights.regular → ex: 400
brand.color.gradient.first           → cor do gradiente primário
```

**Tipos de cor em um brand:**
| Grupo | Propósito |
|-------|-----------|
| `feedback` | info, success, warning, danger (com variante secondary) |
| `product` | promo, cashback, premium (extensível) |
| `brand` | first, second, third (e mais, se configurado) |
| `interface.function` | primary, secondary, link, disabled |

---

## Camada 2 — Mode

**O que define:** A modulação de cor para contexto de luminosidade — claro ou escuro.

**Valores:** `light` · `dark`

**Como funciona:** O Mode não redefine as cores do brand — ele define **como o semantic layer interpreta** os valores de paleta do brand. Em dark mode, os níveis de paleta usados para backgrounds e textos são invertidos, mantendo o constraste mínimo de acessibilidade.

**Propriedades controladas pelo Mode:**
- Quais níveis de paleta são usados como background vs foreground
- Redução de saturação (chroma) configurável para dark mode
- Comportamento de bordas em dark (tom mais claro que o surface)

```
mode/light.json → define regras de referência para modo claro
mode/dark.json  → define regras de referência para modo escuro
```

---

## Camada 3 — Surface

**O que define:** O contexto da superfície sobre a qual os elementos são renderizados.

**Valores:** `positive` · `negative`

**Analogia:** Pense em positive como o "fundo normal" da UI, e negative como um estado de contraste invertido ou de fundo escuro dentro do mesmo modo. Em light mode, positive é o fundo branco/claro; negative é um fundo com cor (uma seção destacada, um card com cor de brand, etc.).

**Impacto:** Afeta principalmente os tokens de cor de background da superfície principal e os tokens de texto sobre ela (`txtOn`), garantindo que o contraste seja sempre válido.

---

## Camada Ortogonal — Dimension

**O que define:** A escala espacial e tipográfica do sistema. Opera independentemente de brand, mode e surface.

**Variantes:** `minor` · `normal` · `major`

### Por que Dimension é ortogonal?

Dimension não muda a identidade visual — muda a **densidade da interface**. A mesma marca, no mesmo modo, na mesma superfície, pode existir em três densidades diferentes sem qualquer mudança de cor ou tipografia.

```
aplica_joy-light-positive-minor   → compacto (interfaces densas, dashboards)
aplica_joy-light-positive-normal  → padrão (uso geral)
aplica_joy-light-positive-major   → espaçoso (acessibilidade, leitura, mobile)
```

### O que Dimension controla

**Escala espacial (sizing/spacing):**
- Usa `LayoutUnit` (4px) e `DefaultDesignUnit` (16px para normal) como base
- Progride com sequência Fibonacci acima do DefaultDesignUnit
- Desce subtraindo LayoutUnit abaixo do DefaultDesignUnit
- Cada variante tem seu próprio DefaultDesignUnit:

| Variante | DefaultDesignUnit | Key `medium` | Key `micro` | Key `giga` |
|----------|------------------|-------------|------------|-----------|
| minor    | 8px              | 8px         | 2px        | 22px aprox|
| normal   | 16px             | 16px        | 4px        | 44px      |
| major    | 24px             | 24px        | 6px        | 66px aprox|

**Escala tipográfica (fontSizes/lineHeights):**
- 13 tamanhos: nano → micro → extraSmall → small → medium → large → extraLarge → mega → giga → tera → peta → exa → zetta
- `medium` é sempre o expoente 0 (= DefaultDesignUnit do variant)
- Ratio padrão: 1.2 (Minor Third), configurável
- lineHeights derivados automaticamente dos fontSizes via razões (Tight, Close, Regular, Wild)

**Unidades de output:**
| Formato | Unidade | Motivo |
|---------|---------|--------|
| CSS | `rem` | Acessibilidade (escala com preferência do usuário) |
| JSON | `px` | Figma e Tokens Studio esperam inteiros em px |
| JS / ESM | `px` | Precisão numérica para consumidores JavaScript |

Para mais detalhes, veja [06-dimension-layer.md](../02-token-layers/06-dimension-layer.md).

---

## A Gênese da Decisão: O Arquivo de Configuração

Embora os tokens sejam visualizados e consumidos no Figma ou no código final, a "Gênese" do sistema — onde a intenção do design é formalizada — ocorre no **Arquivo de Configuração do Tema** (`*.config.mjs`).

Invertendo o fluxo tradicional de Design Systems (Design → Código), no Aplica DS as definições estruturais nascem antes de qualquer desenho:

1.  **Definição do Sistema:** O System Designer decide a matiz da marca, as proporções da escala Fibonacci, e as cores de produto necessárias.
2.  **Registro no Código:** Essas decisões são escritas no `config.mjs`.
3.  **Autoridade Algorítmica:** O Theme Engine lê esse arquivo e gera milhares de tokens garantindo contraste (WCAG) e harmonia óptica automaticamente.

Isso garante que a governança do sistema seja **centralizada e versionável**. Qualquer mudança na visão do sistema é feita em um único ponto e propagada para todos os consumidores (Design/Figma e Engenharia) simultaneamente.

---

## Camada 4 — Semantic

**O que define:** Tokens com propósito claro, que referenciam os valores das camadas anteriores (Brand + Mode + Surface + Dimension).

**É a camada exposta para componentes.** Um componente nunca deve referenciar tokens de Brand, Mode, Surface ou Dimension diretamente — sempre Semantic ou Foundation.

**Estrutura dos tokens semânticos:**
```
semantic.color.interface.function.primary.normal.background
semantic.color.interface.function.primary.normal.txtOn
semantic.color.feedback.success.default.background
semantic.color.brand.first.default.surface
semantic.dimension.sizing.medium
semantic.dimension.spacing.large
semantic.typography.fontSizes.medium
semantic.depth.level_one
semantic.border.radius.medium
```

**Nomenclatura:**
`semantic.<categoria>.<grupo>.<estado>.<propriedade>`

A semântica é **única por combinação Brand+Mode+Surface+Dimension**, mas o esquema de nomes é constante — o que muda são os valores resolvidos.

---

## Camada 5 — Foundation

**O que define:** Uma camada de **redução de carga cognitiva** projetada para times de produto — designers e engenheiros que constroem telas, não o sistema.

**Propósito:** Quem constrói uma tela não precisa entender toda a taxonomia semântica. Não precisa saber que uma cor de fundo de botão primário se chama `semantic.color.interface.function.primary.normal.background`. Precisa saber que é `foundation.bg.primary` — e que funciona. Foundation entrega exatamente o subconjunto necessário para construir UIs com velocidade: backgrounds, cores de texto, bordas, espaçamentos e estilos pré-compostos.

**O que Foundation elimina:**
- A necessidade de conhecer a taxonomia completa do Semantic
- A decisão de qual nível de paleta usar — a decisão já foi tomada
- O risco de inconsistência — o token Foundation aponta sempre para o Semantic correto
- Carga cognitiva de contexto — menos nomes, menos estrutura, menos margem para erro

```
foundation.bg.primary     → semantic.color.interface.function.primary.normal.background
foundation.text.body      → semantic.color.text.body.default
foundation.spacing.medium → semantic.dimension.spacing.medium
```

**Foundation não é uma simplificação técnica — é uma decisão de produto.** A complexidade existe no Semantic; Foundation é a interface que esconde essa complexidade de quem não precisa vê-la.

Foundation também entrega **estilos compostos prontos para uso**:
- **Typography styles** — classes com fontFamily + fontSize + fontWeight + lineHeight + letterSpacing já combinados (ex: `.typography-heading-title_1`)
- **Elevation styles** — classes de sombra por nível, configuráveis por tema (ex: `.elevation-level_two`)

---

## Tabela Resumo das Camadas

| Camada | Pergunta que responde | Exemplo |
|--------|----------------------|---------|
| **Brand** | Quem é a marca? | Cor primária, família tipográfica, gradiente |
| **Mode** | Claro ou escuro? | Inversão de paleta, redução de saturação |
| **Surface** | Qual o fundo? | Positivo (normal) ou negativo (invertido) |
| **Dimension** | Qual a densidade? | Compacto, normal ou espaçoso |
| **Semantic** | Qual o propósito? | `interface.function.primary.normal.background` |
| **Foundation** | O que preciso para construir esta tela? | `bg.primary`, `text.body`, `spacing.medium` — sem precisar conhecer o Semantic |

---

## Combinações possíveis

```
N_brands × 2 modos × 2 superfícies × 3 dimensões = N × 12 variantes

Com 4 brands:
4 × 2 × 2 × 3 = 48 variantes de tema
```

Cada variante é um arquivo CSS (e JSON/ESM/CJS) independente, gerado automaticamente pelo Theme Engine a partir das configurações.

---

## Referências

- [Brand Layer](../02-token-layers/01-brand-layer.md)
- [Mode Layer](../02-token-layers/02-mode-layer.md)
- [Surface Layer](../02-token-layers/03-surface-layer.md)
- [Dimension Layer](../02-token-layers/06-dimension-layer.md)
- [Semantic Layer](../02-token-layers/04-semantic-layer.md)
- [Foundation Layer](../02-token-layers/05-foundation-layer.md)
- [Theme Engine](../04-theme-engine/01-what-is-theme-engine.md)
