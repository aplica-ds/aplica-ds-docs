---
title: "Dimension — A Camada Ortogonal"
lang: pt-BR
---

# Dimension — A Camada Ortogonal

## O que é Dimension

Dimension é a camada ortogonal do Aplica DS. Ela corre em **paralelo** ao pipeline Brand → Mode → Surface e alimenta diretamente as camadas Semantic e Foundation.

Enquanto Brand, Mode e Surface controlam a **identidade visual** (cores, tipografia, contexto), Dimension controla a **densidade espacial e tipográfica** da interface.

```
Brand ──┐
Mode   ─┼─────────────────────────────┐
Surface─┘                             ▼
                               ┌──────────────┐
                               │   Semantic   │ ← onde os tokens ganham propósito
                               └──────┬───────┘
Dimension ─────────────────────┘      │
(minor / normal / major)              ▼
                               ┌──────────────┐
                               │  Foundation  │
                               └──────────────┘
```

---

## Por que existe a Dimension?

A mesma interface pode precisar de densidades diferentes dependendo do contexto de uso:

| Contexto | Densidade ideal |
|----------|----------------|
| Dashboards e interfaces densas de dados | `minor` — compacto |
| Aplicações web e mobile de uso geral | `normal` — padrão |
| Leitura, acessibilidade, mobile grande | `major` — espaçoso |

Sem Dimension, atender essas necessidades exigiria múltiplos sistemas de tokens separados ou valores hardcoded. Com Dimension, é uma troca de variante.

---

## Variantes

O sistema suporta três variantes de Dimension, cada uma com seu próprio `DefaultDesignUnit`:

| Variante | DefaultDesignUnit | Uso |
|----------|------------------|-----|
| `minor`  | 8px              | Interfaces compactas, densidade alta |
| `normal` | 16px             | Padrão — uso geral |
| `major`  | 24px             | Espaçoso — acessibilidade, leitura |

O `DefaultDesignUnit` é a âncora de toda a escala. Mudar a variante muda **todos** os valores dimensionais proporcionalmente.

---

## Escala Espacial (Sizing e Spacing)

### Constantes do sistema

| Constante | Valor (para `normal`) | Descrição |
|-----------|----------------------|-----------|
| `LayoutUnit` | 4px | Unidade base — todos os valores são múltiplos dela |
| `ScaleMultiplierFactor` | 4 | Multiplicador para derivar o DefaultDesignUnit |
| `DefaultDesignUnit` | 16px | Unidade-base de layout (1 DefaultDesignUnit = 1rem) |

### Regras de progressão

**Acima do DefaultDesignUnit:** progressão tipo Fibonacci
```
16, 28, 44, 72, 116 ... (cada passo = soma dos dois anteriores, arredondado para múltiplo de LayoutUnit)
```

**Abaixo do DefaultDesignUnit até LayoutUnit:** subtração de LayoutUnit
```
12, 8, 4 (para LayoutUnit = 4, DefaultDesignUnit = 16)
```

**Abaixo do LayoutUnit:** divisão por 2, arredondado para baixo
```
2, 1
```

**Sizing** inclui 1px e 2px (para bordas e strokes). **Spacing** começa em LayoutUnit (4px mínimo).

### Aliases semânticos de sizing

| Alias Semântico | Valor (normal) | Valor (minor) | Valor (major) |
|----------------|---------------|--------------|--------------|
| `zero`         | 0             | 0            | 0            |
| `pico`         | 1px           | 1px          | 1px          |
| `nano`         | 2px           | 2px          | 2px          |
| `micro`        | 4px           | 2px          | 6px          |
| `extraSmall`   | 8px           | 4px          | 12px         |
| `small`        | 12px          | 6px          | 18px         |
| `medium`       | 16px          | 8px          | 24px         |
| `large`        | 20px          | 10px         | 30px         |
| `extraLarge`   | 24px          | 12px         | 36px         |
| `mega`         | 28px          | 14px         | 42px         |
| `giga`         | 44px          | 22px         | 66px         |
| `tera`         | 72px          | 36px         | 108px        |
| `peta`         | 116px         | 58px         | 174px        |

> Os valores de minor e major são aproximações — os valores reais dependem da configuração exata dos params de cada variante.

---

## Escala Tipográfica

A escala tipográfica é **gerada por variant** e convive com os dados de dimensão no mesmo arquivo (`data/dimension/<variant>.json`), sob a chave `_theme_typography`.

### Tamanhos de fonte — 13 steps

| Step | Expoente | Valor (normal, ratio 1.2) |
|------|----------|--------------------------|
| `nano`       | -4 | 8px  |
| `micro`      | -3 | 10px |
| `extraSmall` | -2 | 12px |
| `small`      | -1 | 14px |
| **`medium`** | **0** | **16px** ← base |
| `large`      | +1 | 24px |
| `extraLarge` | +2 | 24px |
| `mega`       | +3 | 32px |
| `giga`       | +4 | 40px |
| `tera`       | +5 | 40px |
| `peta`       | +6 | 48px |
| `exa`        | +7 | 64px |
| `zetta`      | +8 | 72px |

**Fórmula:** `tamanho = DefaultDesignUnit × ratio^expoente`
- Acima do base: arredondado para múltiplo de `LayoutUnit`
- Abaixo do base: arredondado para cima (`Math.ceil`)

**Ratio padrão:** 1.2 (Minor Third) — configurável globalmente.

### Line-heights

Derivados automaticamente dos fontSizes via quatro densidades:

| Densidade | Ratio | Uso |
|-----------|-------|-----|
| `tight`   | ~1.2  | Headings, títulos |
| `close`   | ~1.35 | Subtítulos |
| `regular` | ~1.5  | Corpo de texto padrão |
| `wild`    | ~1.8  | Leitura longa, acessibilidade |

### Letter-spacing

Três valores fixos, independentes de variante:

| Nome | Valor | Uso |
|------|-------|-----|
| `tight`   | -0.72 | Headings grandes |
| `regular` | 0     | Padrão |
| `wild`    | +0.8  | Texto em maiúsculas, labels |

---

## Unidades de Output

Dimension é armazenado em **px** mas o output depende da plataforma:

| Formato | Unidade | Motivo |
|---------|---------|--------|
| **CSS** | `rem` | Acessibilidade — escala com a preferência de fonte do usuário (WCAG 1.4.4) |
| **JSON** | `px` | Figma e Tokens Studio trabalham com inteiros em px |
| **JS / ESM** | `px` | Precisão numérica para cálculos em JavaScript |

**Exceção:** `semantic.depth.spread` permanece em px em todos os formatos (não é um token dimensional no sentido semântico — é um número raw para `box-shadow`).

**Fórmula CSS:** `rem = px / baseFontSize` onde `baseFontSize` padrão = 16.

---

## Estrutura da escala bruta e regra de step

A escala é armazenada como um mapa chave-valor plano dentro de `data/dimension/<variant>.json`. Cada chave é um número inteiro de step; o valor é a dimensão em pixels para aquele step dado o `LayoutUnit` da variante.

**Regra de step (a partir de 2.22.4):**

| Intervalo | Step |
|-----------|------|
| 0 – 100 | Variável (0, 6, 12, 25, 50, 75, 100) |
| acima de 100 | **25** (100, 125, 150, 175, 200, 225, 250, 275 … 800) |

> **Breaking change (2.22.4):** Antes desta versão, keys acima de 100 usavam **step 5** (100, 105, 110, … 800). Os steps 105, 110, 115, … 795 deixam de existir. Consumidores que referenciem `dimension.scale.105`, `dimension.scale.110`, etc. explicitamente devem migrar para o step mais próximo da nova série.

A regra de step 25 garante que, acima de 100, todo valor da escala seja sempre múltiplo de 4px (com `LayoutUnit = 4`), eliminando valores não inteiros (17px, 18px, 19px) e colisões de keys.

**Mudança de `semantic.giga` (2.22.4):** Movido de `dimension.scale.200` (era 32px em Normal) para `dimension.scale.275` (44px em Normal), alinhado aos valores esperados da escala semântica. Consumidores que usam `semantic.giga` não são afetados; consumidores que referenciam a key bruta `dimension.scale.200` devem atualizar para `dimension.scale.275` se pretendiam `giga`.

---

## Arquivo gerado por variante

Cada variante gera um arquivo em `data/dimension/<variant>.json` com duas seções:

```json
{
  "dimension": {
    "scale": { ... },     ← escala numérica bruta (keys: 0, 25, 50, 75, 100, 125, 150, ...)
    "semantic": {
      "sizing": { ... },  ← aliases semânticos de sizing
      "spacing": { ... }  ← aliases semânticos de spacing
    }
  },
  "_theme_typography": {
    "fontSizes": { ... },      ← escala de tamanhos de fonte
    "lineHeights": { ... },    ← line-heights derivados
    "letterSpacings": { ... }  ← espaçamentos de letra
  }
}
```

No build, `_theme_typography` é mesclado com o `_typography.json` do brand (que contribui fontFamilies, fontWeights, textDecoration, textCases) para formar o conjunto completo de tokens tipográficos.

---

## Overrides e Extensibilidade

Valores de escala podem ser sobrescritos por variante via `getOverrides(variant)` em `config/global/dimension.config.mjs`.

**Regra obrigatória:** qualquer valor custom deve ser múltiplo de `LayoutUnit`.

```
value % LayoutUnit === 0 // deve ser true
```

Tokens semânticos devem sempre referenciar passos da escala (ou overrides válidos). Nunca valores que quebrem o grid.

---

## Configuração

A Dimension é configurada em `config/global/themes.config.json`:

```json
{
  "global": {
    "dimension": {
      "outputUnit": {
        "css": "rem",
        "default": "px"
      },
      "baseFontSize": 16,
      "params": {
        "minor":  { "layoutUnit": 2, "scaleMultiplierFactor": 4 },
        "normal": { "layoutUnit": 4, "scaleMultiplierFactor": 4 },
        "major":  { "layoutUnit": 6, "scaleMultiplierFactor": 4 }
      }
    },
    "typography": {
      "fontSizeScaleRatio": 1.2
    }
  }
}
```

---

## Referências

- [Token Architecture](../01-design-tokens-fundamentals/01-token-architecture.md)
- Implementação: `references/aplica-tokens-theme-engine/dynamic-themes/scripts/dimension-scale.mjs`
- Configuração: `references/aplica-tokens-theme-engine/config/global/dimension.config.mjs`
- Documentação técnica: `references/aplica-tokens-theme-engine/docs/context/dimension/`
