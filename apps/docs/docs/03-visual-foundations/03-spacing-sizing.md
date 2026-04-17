---
title: "Spacing & Sizing (Dimension)"
lang: pt-BR
---

# Spacing & Sizing (Dimension)

O sistema de **Espaçamento e Dimensionamento** (Dimension) do Aplica DS V2 foi reestruturado para fornecer uma fundação robusta focada no **Grid de 4px**. Esse sistema atua como a espinha dorsal de layouts, paddings, margins e dimensionamento de componentes, evoluindo a lógica de "Fibonacci Adaptada" do legado (Alpha e V1) para um modelo altamente preditivo e acessível.

A camada de Dimension é consumida diretamente pelas camadas *Foundation* e *Semantic*, garantindo que qualquer espaço ou tamanho no produto seja matematicamente coerente.

---

## 1. O Grid de 4 Pontos (4pt)

A regra de ouro de toda a construção de UI no Aplica DS V2 é baseada no multiplicador de **4 pontos (4pt)**.
Toda e qualquer dimensão e espaçamento em componentes estruturais (com raríssimas exceções em detalhamentos micro, como bordas de `1pt` ou espaçamentos muito restritos de `2pt`) devem ser múltiplos de 4.

> **Importante: Pontos vs Pixels vs REM e EM**
> No design e na estrutura matemática subjacente, o framework pensa e executa seus cálculos **sempre em pontos (`pt`)**. O "pixel" (`px`) é encarado unicamente como uma possibilidade de *output* visual (mais atrelado a réguas do UI Toolkit, como Figma). 
> Quando o Theme Engine efetua o build voltado a sistemas e plataformas reais (ex: Web CSS), essas variáveis dinâmicas sofrem parsing direto para equivalências como **`rem` ou `em`** (assumindo nativamente que `16pt = 1rem`), reforçando todo o compliance com WCAG e garantindo escalabilidade de tela nas mãos dos desenvolvedores.

Este princípio unifica tipografia (com line-heights matematicamente cravados na mesma malha), iconografia e grid de layout em uma única teia dimensional, reduzindo drasticamente erros de alinhamento numérico.

---

## 2. A Estrutura de Escala (`dimension.scale`)

Enquanto a V1 utilizava nomes como "extraSmall" diretamente, a V2 consolida seu *primitive layer* como numérico gerado através de **algoritmos matemáticos do Theme Engine**. O sistema utiliza abstrações percentuais (chaves/keys) baseadas em um coeficiente multiplicador.

### Fórmulas e Algoritmo (Theme Engine)
O motor dinâmico gera a escala computacionalmente a partir das seguintes constantes essenciais (cujos lógicos foram originados nos estudos da V1):
- **`LayoutUnit`**: `4` (A unidade base real do grid).
- **`ScaleMultiplierFactor`**: `4` (Fator multiplicador do grid).
- **`DefaultDesignUnit`**: `16` (`LayoutUnit × ScaleMultiplierFactor`). Representa a **Unidade de Design Padrão** (`1rem` na raiz estrutural e ponto de partida).

Para calcular a medida matemática da primitiva de escala, o algoritmo utiliza a seguinte fórmula para cada "chave" (key) numérica:
> **`value_pt = round((key / 100) × DefaultDesignUnit)`**

Isso significa que a chave primitiva `100` resulta exatamente em **`16pt`** (`(100/100) * 16`). A chave `200` resulta em **`32pt`** (`(200/100) * 16`), sendo compiladas e convertidas para os outputs finais suportados pela plataforma-alvo (como suporte principal de conversão para `rem` e `em` no web) no momento da construção (build). Isso garante **escalabilidade granular e programática**. É o que permite injetar dinamicamente novas densidades na plataforma (apenas mexendo no `LayoutUnit`)! As primitivas finais alimentam, então, os Aliases (Camada Semântica).

### Tabela de Dimension Primitives

| Scale | Value (px) | Descrição / Uso Primário                                 |
|-------|------------|----------------------------------------------------------|
| **0**     | `0px`  | Resets de margem e padding.                              |
| **25**    | `4px`  | Gaps muito curtos, grids de layout denso.                |
| **50**    | `8px`  | Paddings ultra-compactos, separação de pares lógicos.    |
| **75**    | `12px` | Paddings compactos, border-radius leve, gaps em cards.   |
| **100**   | `16px` | **Base Unit**. Padding padrão compacto.                  |
| **125**   | `20px` | Respiro base plus, comum em modais compactas.            |
| **150**   | `24px` | Padding confortável para componentes médios e inputs.    |
| **175**   | `28px` | Paddings para cards médios.                              |
| **200**   | `32px` | Gap padrão entre componentes/grupos primários.           |
| **225**   | `36px` | Padding confortável em componentes largos.               |
| **250**   | `40px` | Áreas de respiro generosas (Generous Padding).           |
| **275**   | `44px` | Break layout, entre Large e XL.                          |
| **300**   | `48px` | Gaps maiores em seções de cards e componentes macro.       |
| **350**   | `56px` | XL spacing, padding substancial, grids de painéis.       |
| **400**   | `64px` | 2XL spacing, espaçamentos grandes em conteineres macro.  |
| **450**   | `72px` | 2XL-medium.                                              |
| **500**   | `80px` | 3XL, hero sections.                                      |
| **550**   | `88px` | Touch Target mínimo focado em acessibilidade WCAG Macro. |
| **600**   | `96px` | Seções muito grandes de respiro.                         |
| **700**   | `112px`| 4XL, padding modular em views full.                      |
| **800**   | `128px`| 5XL, enormes containers, páginas mestre.                 |
| **900**   | `144px`| 6XL, seções herói.                                       |
| **1000**  | `160px`| 7XL, max paddings.                                       |
| **1200**  | `192px`| 8XL, divisão master de layout.                           |
| **1400**  | `224px`| 9XL.                                                     |
| **1450**  | `232px`| 9XL-large.                                               |
| **1600**  | `256px`| 10XL, espaçamento absoluto máximo.                       |

---

## 3. Aliases Semânticos (`dimension.semantic`)

Para a engenharia e consumo de propriedades CSS e Componentes Diários, a notação primitiva numérica e sua alta quantidade geram alta carga cognitiva. Portanto, o sistema de design promove os seguintes "Camisetas" ou "Alias" em inglês, resgatando as qualidades da V1 com correções nos pesos.

**Nota técnica:** `pico` foge da regra de 4px por ser exclusivo de propriedades micro como bordas e demarcadores muito finos (`1px`). Todos os outros herdam posições da escala.

| Alias Name      | Token Resolution                     | Value (px) | Application & Context                                                                 |
|-----------------|--------------------------------------|------------|-----------------------------------------------------------------------------------------|
| **zero**        | `{dimension.scale.0}`                | `0px`      | Reseta layout, margens e padronizações estáticas.                                     |
| **pico**        | *Hard Value*                         | `1px`      | Ajustes "pixel-perfect", gaps minúsculos, bordos sutis.                               |
| **nano**        | `{dimension.scale.25}`               | `4px`      | Espaçamentos de ícones próximos a texto, ou itens super unidos.                       |
| **micro**       | `{dimension.scale.50}`               | `8px`      | Paddings de labels, componentes compactos, gap de itens inter-relacionados.           |
| **extraSmall**  | `{dimension.scale.100}`              | `16px`     | **Base Unit**. Padding interno de form fields e botões.                               |
| **small**       | `{dimension.scale.150}`              | `24px`     | Gaps de blocos moderados, form fields e padding de cartões confortáveis.              |
| **medium**      | `{dimension.scale.200}`              | `32px`     | Espaçamento padrão macro entre elementos isolados na página ou em seções.             |
| **large**       | `{dimension.scale.250}`              | `40px`     | Margem lateral ou espaçamento maior entre conteineres semânticos (Layout Break).      |
| **extraLarge**  | `{dimension.scale.300}`              | `48px`     | Substancial gap vertical entre grandes áreas do produto.                              |
| **mega**        | `{dimension.scale.350}`              | `56px`     | Divisões drásticas, modais vastas, paddings amplos.                                   |
| **giga**        | `{dimension.scale.550}`              | `88px`     | Dimensão *Touch Target* mínima otimizada para ações principais (Acessibilidade WCAG). |
| **tera**        | `{dimension.scale.900}`              | `144px`    | Enormes separadores, divisões de página mestre ou *hero banners*.                     |
| **peta**        | `{dimension.scale.1450}`             | `232px`    | Fim de rolagem, áreas vazias imensas e layout blocks em monitores ultrawide.          |

---

## 4. Evolução em relação ao Legado (Aplica DS Alpha e V1)

1. **Abolição do pseudo-Fibonacci solto na Primitiva:** Na V1, a estrutura global crescia somando os valores em progressão "Fibonacci-like" baseada no Grid de 4pt (`16, 28, 44, 72...`). Na V2, o *Theme Engine* passou a gerar a escala sob uma função linear proporcional (`key / 100 * 16`), o que extingue os saltos irregulares difíceis de se acostumar. A lógica anterior e escalas descendentes (como `DescendingScaleInferior`) da V1 influenciam os tokens semânticos e não mais as primitivas de escala, trazendo matemática determinística e "guessing" fácil para quem codifica.
2. **Separação Algorítmica Primitiva vs Lógico:** Ao gerar computacionalmente a numeração via motor e mapear os *aliases* da Camada Semântica por cima dessa escala gerada, a arquitetura permite injeção de novas escalas (como `dense`, `comfortable` ou Mobile vs Desktop) ajustando somente a base matemática no arquivo config, sem precisarmos reescrever nomes de tokens no CSS da aplicação.
3. **Múltiplos de 4pt Strict:** O sistema na V1 sofria em certas somas (Ex: 28 + 16 = 44). Agora, por garantir passos alinhados ao Grid de 4pt na Primitiva global, e por focar nos aliases em múltiplos perfeitos (8, 16, 24, 32, 40, 48...), a malha de design fica previsível, permitindo o alinhamento de blocos de `UI` calhando perfeitamente com os outputs em conversores fluidos (ex: `rem` e `em`) e grids de desenvolvimento como utilitários Tailwind CSS.

---

## Dicas Rápidas de Adoção (Guidelines)

- Evite ao máximo aplicar paddings em números quebrados, ou primitivos menores soltos da escala Semântica (`micro, extraSmall, small`, etc).
- Use `pico` exlusivamente para borders. É um Anti-Pattern usar `pico` (1px) como espaçamento entre dois componentes, pois gerará embaçamento num grid de subpixels em algumas renderizações de monitor.
- Prefira saltos de 1 nível de alias para diferenciar a hierarquia espacial: Se você usar `small` para espaçamento entre botões, use `medium` para isolar a "row" de botões do restante da página. Isso criará Agrupamento pela "Lei de Proximidade" do Design visual.

---

## Referências

- Script de geração da escala: [dimension-scale.mjs](../../references/aplica-tokens-theme-engine/dynamic-themes/scripts/dimension-scale.mjs)
- Spec técnica de saída de unidades: [05-output-units.md](../../references/aplica-tokens-theme-engine/docs/context/dimension/05-output-units.md)
- Visão geral da Dimension: [00-overview.md](../../references/aplica-tokens-theme-engine/docs/context/dimension/00-overview.md)
- Sistema espacial detalhado: [01-spatial-system.md](../../references/aplica-tokens-theme-engine/docs/context/dimension/01-spatial-system.md)
- Camada Dimension (conceito): [06-dimension-layer.md](../02-token-layers/06-dimension-layer.md)
- Matemática e algoritmos: [06-mathematics-and-algorithms.md](./06-mathematics-and-algorithms.md)
