---
title: "Mapeamento: Racionais Matemáticos Alpha/V1 → Aplica Theme Engine (V2)"
lang: pt-BR
---

# Mapeamento: Racionais Matemáticos Alpha/V1 → Aplica Theme Engine (V2)

> Este documento mapeia os racionais matemáticos e pseudo-códigos desenvolvidos no Alpha e na V1 para sua correspondência na estrutura atual do Aplica Theme Engine. Identifica o que foi preservado (com renomeação), o que foi evoluído, e o que ainda precisa ser formalizado.

---

## 0. Linha Evolutiva de Cores (Alpha → V1 → V2)

Esta é a seção mais importante do mapeamento — a decomposição de cores é onde o sistema mais evoluiu.

### Alpha (2020-2022) — Decomposição manual por Darken/Lighten

A decomposição de cores no Alpha era **manual e algoritmicamente simples**, baseada em operações de escurecimento/clareamento sobre a cor base.

**Dois tipos de decomposição:**

#### Decomposição Comportamental (5 estados)

| Estado Alpha | Operação | Correspondente V2 |
|-------------|---------|------------------|
| `Darkest` | cor base → darkest (textos, fundos escuros) | `behavior.darkest` (palette.170) |
| `Action` | +6 escalas para dark | `behavior.action` (palette.120 = hover) |
| `Default` | cor base pura | `behavior.normal` (palette.100) |
| `Active` | +6 escalas para light | `behavior.pressed` (palette.140) |
| `Lightest` | +9 escalas para light (fundo claro) | `behavior.lightest` (palette.10) |

> **Nota:** Na V1 `Active` era o estado de clique. Na V2.24, `active` foi renomeado para `pressed`, e `focus` ganhou token próprio (palette.50).

#### Decomposição de Layout (Neutros)

| Passo Alpha | Operação | Correspondente V2 |
|------------|---------|------------------|
| `Base to Neutral` | cor primária escurecida 50% | `neutrals` — chroma reduzida via OKLCh |
| `Highest Contrast` | Base to Neutral escurecida 25% | `neutrals.140` (mais escuro) |
| 17 níveis de `neutral.170` → `contrast.deep.light` | Interpolação linear | 15 níveis `neutrals.5` → `neutrals.140` |
| `Neutral 5` (intermediário) | 1 passo de `neutral.10` para claro | `neutrals.5` |

**Método de interpolação Alpha:** `darken()`/`lighten()` em HSL — simples mas impreciso perceptualmente.

#### Regra de Acessibilidade Alpha

```
1. Testar fonte vs. fundo com "Color Darkest"
2. Falhou? → testar "Contrast Dark Deep" (#000000)
3. Falhou? → testar "Color Lightest"
4. Falhou? → testar "Contrast Light Deep" (#ffffff)
Mínimo obrigatório: WCAG AA (4.5:1 para texto normal)
```

---

### V1 (2022-2023) — Taxonomia formalizada, ainda manual

A V1 não mudou o algoritmo de cores, mas **formalizou a taxonomia**:

| Categoria V1 | Subgrupos V1 | Token V1 |
|-------------|-------------|---------|
| Cores de Marca | Cor principal | `color.primary` |
| Cores de Ambiente | Neutras, Contraste, Escala de Cinza | `color.tone.neutral.*`, `color.ambient.grayscale.*` |
| Cores de Interação | Function (Primary/Secondary/Link), Feedback (Info/Success/Warning/Danger) | `color.interaction.function.*`, `color.interaction.feedback.*` |
| Cores de Texto | Base (Positive/Negative), Feedback | `color.text.*` |

---

### V2 (2023-presente) — Pipeline OKLCh automatizado

O V2 substituiu as operações manuais de darken/lighten pelo pipeline **OKLCh** — um espaço de cor perceptualmente uniforme:

| Aspecto | Alpha/V1 | V2 |
|---------|---------|-----|
| **Espaço de cor** | HSL (darken/lighten) | OKLCh (Luminosity, Chroma, Hue separados) |
| **Paleta** | 5 estados manuais | 19 níveis automáticos (10–190) |
| **Neutros** | 17 níveis via darken da primária | 15 níveis via OKLCh (chroma × 0.1) |
| **Grayscale** | Via escala de cinza da marca | Arquivo separado, valores fixos customizáveis |
| **Acessibilidade** | Regra manual sequencial | Automática — algoritmo WCAG calcula `txtOn` |
| **Dark mode** | Manual | Inversão automática: `dark.surface[L] = light.surface[200-L]` |
| **Variantes de txtOn** | 1 regra (darkest/lightest) | 3 estratégias: `high-contrast`, `brand-tint`, `custom-tint` |

**Por que OKLCh é superior ao HSL:**
- Em HSL, interpolar de laranja para azul passa por verdes indistinguíveis
- Em OKLCh, `L` (Lightness) é perceptualmente linear: `L=0.5` é visualmente o meio-ponto exato
- Reduzir `C` (Chroma) cria neutros com temperatura de cor preservada — não cinza puro
- Garantia de que `L=0.98` é "quase branco" e `L=0.05` é "quase preto" em qualquer matiz

**Referência V2:** `docs/context/dynamic-themes-reference/COLOR-DECOMPOSITION-SPEC.md`

---

---

## 1. Sistema de Tamanhos e Espaçamento (Dimension)

### V1 — Variáveis originais (PT-BR)

| Variável V1 | Tipo | Valor | Correspondente V2 |
|------------|------|-------|--------------------|
| `UnidadeLayout` | Number | `4` | `LayoutUnit` |
| `FatorMultiplicadorEscala` | Number | `4` | `ScaleMultiplierFactor` |
| `UnidadePadraoDesign` | Number | `LayoutUnit × FatorMultiplicadorEscala = 16` | `DefaultDesignUnit` |
| `niveisEscala` | Number | `4` | `scaleLevels` |
| `EscalaFibonacci` / `EscalaCres` | Array | `[16, 28, 44, 72, 116]` | `FibonacciScale` |
| `EscalaDesc` | Array | `[4, 8, 12]` | `DescendingScale` |
| `EscalaDescInferior` | Array | `[1, 2]` | `DescendingScaleInferior` |
| `Tamanho[]` | Array | `0.01 + EscalaDescInferior + EscalaDesc + EscalaCres` | `Size[]` |
| `Espacamento[]` | Array | `0 + EscalaDesc + EscalaCres` | `Spacing[]` |

**Regras preservadas integralmente:**
- Inicia em `UnidadePadraoDesign` (16dp)
- Acima: progressão Fibonacci (soma dos dois anteriores, múltiplos de `UnidadeLayout`)
- Entre `UnidadeLayout` e `UnidadePadraoDesign`: subtração de `UnidadeLayout`
- Abaixo de `UnidadeLayout`: divisão por 2, arredondado para baixo
- Espaçamento mínimo = `UnidadeLayout` (4dp); tamanho mínimo = 1dp

### O que evoluiu na V2

1. **Variantes por densidade** — a V1 tinha uma escala única. A V2 introduziu `minor`/`normal`/`major` cada uma com seu próprio `DefaultDesignUnit`, tornando a escala paramétrica.

2. **Aliases semânticos por variante** — na V1 os aliases eram fixos. Na V2 cada variante pode ter `semanticByVariant` distintos.

3. **Tipografia integrada** — na V2 fontSizes e lineHeights são gerados no mesmo arquivo de dimension (`_theme_typography` key), acoplando escala espacial e tipográfica.

### Arquivo de referência no V2
- Documentação: `references/aplica-tokens-theme-engine/docs/context/dimension/01-spatial-system.md`
- Implementação: `references/aplica-tokens-theme-engine/dynamic-themes/scripts/dimension-scale.mjs`
- Config: `references/aplica-tokens-theme-engine/config/global/dimension.config.mjs`

---

## 2. Sistema de Opacidade

### V1 — Variáveis originais

| Variável V1 | Tipo | Valor |
|------------|------|-------|
| `TRANSPARENT` | Constant | `0%` |
| `TRANSLUCID` | Constant | `50%` |
| `OPAQUE` | Constant | `100%` |
| `LEVEL_SHORTCUT` (LS) | Constant | `2` (número de níveis intermediários) |
| `VARIATION_SHORTCUT` (VS) | Constant | `10%` (variação por grau) |
| `QUARTER` | Boolean | `true` (se cria valores intermediários) |
| `LsLoop` | Derived | `LS / 2` (subtrator para loop) |
| `levelsUpOpacity[]` | Array | Loop somando de TRANSPARENT → TRANSLUCID |
| `levelsDownOpacity[]` | Array | Loop subtraindo de OPAQUE → TRANSLUCID |
| `levelsOpacity[]` | Array | Usado quando LS > 8 (divisão total / LS) |

**Lógica do algoritmo V1:**
- Se `LS ≤ 8`: cria `VS = 10%` por grau, gera arrays de cima e de baixo
- Se `LS > 8`: `VS = 100% / LS`, gera array único
- `QUARTER = true`: cria valores intermediários (25%, 75%)

### Status no V2

**Não formalizado como racional matemático.** O `data/semantic/default.json` tem `semantic.opacity.*` mas sem documentação do algoritmo gerador. A escala atual é:

```
semantic.opacity.intense   → 0.80
semantic.opacity.medium    → 0.50  (= TRANSLUCID)
semantic.opacity.light     → 0.30
semantic.opacity.subtle    → 0.10
```

### O que adaptar para o V2

Criar `docs/context/opacity-system.md` com:
1. As três constantes fundacionais (TRANSPARENT / TRANSLUCID / OPAQUE) como âncoras semânticas
2. A lógica de geração algorítmica (LS, VS, QUARTER) como referência para expandir a escala
3. Mapeamento entre a lógica V1 e os tokens atuais de `semantic.opacity.*`
4. **Proposta**: tornar a escala de opacidade gerável via config (como Dimension), não hardcoded

**Arquivo a criar:** `references/aplica-tokens-theme-engine/docs/context/OPACITY_SYSTEM.md`

---

## 3. Sistema de Profundidade (Depth / Elevation)

### V1 — Estrutura de elementos

A V1 definiu profundidade como composição de 5 elementos primitivos:

| Elemento | Token V1 | Semântica |
|---------|---------|-----------|
| **Position** | `depth.elements.position.outter / inner` | Sombra externa (elevação) ou interna (recorte) |
| **Distance** | `depth.elements.distance.<sizing-alias>` | Tamanho da sombra nos eixos X e Y |
| **Intensity** | `depth.elements.intensity.low/medium/high` | Blur da sombra (0.05, 0.15, 0.30) |
| **Proximity** | `depth.elements.proximity.distant/medium/close/flat` | Spread da sombra (-8, -4, -2, 0) |
| **Luminosity** | `depth.elements.luminosity.shadow.*/light.*` | Cor da sombra ou luz |

**Níveis de elevação V1:**

| Nível | Token V1 | Uso semântico |
|-------|---------|--------------|
| Level -1 | `depth.level.oneMinus` | Formulários/inputs (profundidade interna) |
| Level 0 | `depth.level.zero` | Base sem elevação (reset) |
| Level 1 | `depth.level.one` | Pressed/interação |
| Level 2 | `depth.level.two` | Cards/buttons padrão |
| Level 3 | `depth.level.three` | Navigation |
| Level 4 | `depth.level.four` | Dropdowns |
| Level 5 | `depth.level.five` | Pickers, tooltips |
| Level 6 | `depth.level.six` | Modals |

### Status no V2

**Parcialmente implementado.** A V2 tem os níveis (`level_minus_one` a `level_six`) e eles são configuráveis por tema via `elevation` no config. Mas **o racional dos 5 elementos primitivos não está documentado** — o que existe é apenas a configuração de `boxShadow` por nível.

### O que adaptar para o V2

1. **Documentar os 5 elementos** como a semântica de construção de sombras — não precisam ser tokens expostos, mas devem existir como guia de configuração de `elevation` por tema.

2. **Mapear os níveis** da V1 para os da V2:
   - V1: `depth.level.oneMinus` → V2: `semantic.depth.level_minus_one`
   - V1: `depth.level.zero` → V2: `semantic.depth.level_zero`
   - V1: `depth.level.one` → V2: `semantic.depth.level_one`
   - (e assim por diante)

3. **Criar guia de configuração de elevation** explicando como os 5 elementos se traduzem em valores de `box-shadow` CSS ao configurar `elevation` no `*.config.mjs` de um tema.

**Arquivo a criar:** `references/aplica-tokens-theme-engine/docs/context/DEPTH_ELEVATION_GUIDE.md`

---

## 4. Sistema de Cores — Taxonomia Conceitual

### V1 — Categorias (PT-BR)

A V1 organizava cores em 4 grandes grupos:

| Grupo V1 | Subgrupos V1 | Correspondente V2 |
|----------|-------------|-------------------|
| **Cores de Marca** (Brand) | Cor principal da marca | `brand.color.*` |
| **Cores de Ambiente** (Environment/Ambient) | Neutras, Contraste, Escala de Cinza | `brand.color.neutrals.*`, `brand.color.grayscale.*` |
| **Cores de Interação** (Interaction) | Function (Primary, Secondary, Link), Feedback (Info, Success, Warning, Danger) | `semantic.color.interface.function.*`, `semantic.color.feedback.*` |
| **Cores de Texto** (Text) | Base (Positive/Negative), Feedback | `semantic.color.text.*` |

**Decomposição de Interação V1 (5 estados):**

| Estado V1 | Semântica V1 | Estado V2 |
|----------|-------------|----------|
| Darkest | Texto dentro/fora, alguns fundos | `txtOn.*` |
| Action | Mouse over — elemento clicável | `hover` |
| Default | Estado padrão | `normal` |
| Active | Clique / tap | `pressed` (V2.24: `active` = pressed) |
| Lightest | Texto claro, alguns fundos | `background` levels |

**Regras de acessibilidade V1:**
1. Testar fonte vs. fundo com `Darkest`
2. Falhou → testar com cor de Contraste Profundo mais escura (`Deep Dark`)
3. Falhou → testar com `Lightest`
4. Falhou → testar com Contraste Profundo mais clara (`Deep Light`)

### Status no V2

**Implementado e evoluído.** O pipeline OKLCh decompõe automaticamente. Os 5 estados da V1 mapeiam para os estados semânticos da V2. A regra de acessibilidade está automatizada (cálculo WCAG automático de `txtOn`).

### O que adaptar

Criar um documento histórico/conceitual em `docs/context/color-taxonomy-rationale.md` que explique a taxonomia conceitual (Brand vs. Ambient vs. Interaction vs. Text) com a terminologia em PT-BR como contexto histórico, e mostre o mapeamento para a nomenclatura atual.

---

## 5. Sistema de Tipografia Semântica

### V1 — Agrupadores tipográficos

A V1 definiu agrupadores semânticos de tipografia:

| Agrupador V1 | Descrição |
|-------------|-----------|
| Títulos | Hierarquia de cabeçalhos |
| Chamadas | Display/hero text |
| Conteúdo em bloco | Corpo de texto |

### Status no V2

**Evoluído significativamente.** A V2 tem 7 categorias formais:
`heading`, `content`, `display`, `hierarchy`, `action`, `link`, `code`

### O que adaptar

Documentar a correspondência entre os agrupadores V1 e as 7 categorias V2 em `docs/context/typography-categories-rationale.md`.

---

## Resumo: Ações por prioridade

| Prioridade | Ação | Destino |
|-----------|------|---------|
| **Alta** | Criar `OPACITY_SYSTEM.md` — único racional sem documentação | `docs/context/OPACITY_SYSTEM.md` |
| **Alta** | Criar `DEPTH_ELEVATION_GUIDE.md` — 5 elementos não documentados | `docs/context/DEPTH_ELEVATION_GUIDE.md` |
| **Média** | Criar `color-taxonomy-rationale.md` — pontes históricas | `docs/context/color-taxonomy-rationale.md` |
| **Baixa** | Adicionar variáveis PT-BR ao `01-spatial-system.md` como referência histórica | `docs/context/dimension/01-spatial-system.md` |
| **Baixa** | Criar `typography-categories-rationale.md` | `docs/context/typography-categories-rationale.md` |

---

## Arquivos fonte no knowledge base

Todos os documentos V1 extraídos estão em:
`knowledge-base/06-history/_extracted/aplica-ds-v1/`

Arquivos de referência primários para adaptação:
- `191-resumo-engenharia-tamanhos-e-espaçamento-(read-for-review).md` → Sizing/Spacing
- `172-resumo-engenharia-opacidade-(to-review).md` → Opacity
- `186-resumo-engenharia-profundidade-(for-review).md` + `260-tokens-profundidade-(for-review).md` → Depth
- `050-cores-[review].md` + `064-cores-categorias-em-detalhe.md` → Color taxonomy
- `085..089-detalhes-para-agrupadores-de-tipografia-semântica-*.md` → Typography categories
