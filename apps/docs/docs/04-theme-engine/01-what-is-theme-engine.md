---
title: "O que é o Aplica Tokens Theme Engine"
lang: pt-BR
---

# O que é o Aplica Tokens Theme Engine

## Definição

O **Aplica Tokens Theme Engine** é o sistema de geração dinâmica de Design Tokens do Aplica DS. Funciona como uma **fábrica de temas**: dado um conjunto de configurações (cores de marca, tipografia, dimensões), o engine produz automaticamente todos os tokens semânticos e de fundação para cada combinação possível de brand × mode × surface × dimension.

É open-source, construído sobre **Style Dictionary** e compatível com **Tokens Studio**, e age como a única fonte de verdade para design tokens — garantindo que Web, Mobile e Figma interpretem os mesmos tokens da mesma forma.

---

## Por que ele existe

O problema que o engine resolve é **escala com coerência**.

Sem um engine centralizado, cada novo tema — ou qualquer mudança de cor — exige atualização manual em dezenas de arquivos. Com 4 brands × 2 modos × 2 superfícies × 3 dimensões = **48 variantes de tema**, a manutenção manual é inviável.

O engine resolve isso com uma inversão de responsabilidade:

```
SEM engine:
Designer define cor → Desenvolvedor copia para CSS → Repete para cada variante

COM engine:
System Designer configura color em *.config.mjs → Engine gera todas as variantes → 
Consumidores usam o output (dist/)
```

**Benefícios diretos:**
- Adicionar 1 brand gera automaticamente todas as 12 variantes (modos × superfícies × dimensões)
- Mudança de cor em um lugar propaga para todos os outputs e plataformas
- Acessibilidade (WCAG) calculada automaticamente — não é um checklist manual
- O contrato de naming garante que Web, Mobile e Figma sejam sempre consistentes

---

## O Pipeline em Execução

O engine executa o pipeline de 5 camadas do Aplica DS de forma sequencial:

```
config/*.config.mjs
        │
        ▼
[ color-decomposer.mjs ]      ← Decompõe cores em paletas OKLCh (19+15+6 níveis)
[ typography-generator.mjs ]  ← Gera escala tipográfica e line-heights
[ dimension-scale.mjs ]       ← Gera escala espacial por variante (minor/normal/major)
        │
        ▼
data/brand/<theme>/           ← Camada 1: tokens de marca (cores, tipografia, gradientes)
data/mode/<light|dark>.json  ← Camada 2: modulação por luminosidade
data/surface/<pos|neg>.json  ← Camada 3: contexto de superfície
data/dimension/<variant>.json ← Camada ortogonal: escala espacial e tipográfica
        │
        ▼ sync-architecture.mjs (propaga referências entre camadas)
        │
data/semantic/default.json    ← Camada 4: tokens com propósito
data/foundation/<name>/       ← Camada 5: aliases simplificados
        │
        ▼ Style Dictionary (build)
        │
dist/
├── json/                     ← JSON com px (Figma, Tokens Studio)
├── css/                      ← CSS custom properties com rem (Web)
├── esm/                      ← ES Modules com px (JavaScript)
├── cjs/                      ← CommonJS com px (Node.js)
└── dts/                      ← TypeScript declarations
```

**Regra crítica:** Os arquivos em `data/` são **gerados** — nunca edite manualmente. Toda alteração começa no `config/` ou nos scripts do engine.

---

## O que o Engine entrega

### Tokens

| Categoria | Namespace | Exemplo |
|-----------|-----------|---------|
| Cores | `semantic.color.*` | `semantic.color.interface.function.primary.normal.background` |
| Tipografia | `semantic.typography.*` | `semantic.typography.fontSizes.medium` |
| Espaçamento | `semantic.dimension.spacing.*` | `semantic.dimension.spacing.large` |
| Bordas | `semantic.border.*` | `semantic.border.radius.medium` |
| Elevação | `semantic.depth.*` | `semantic.depth.level_two` |
| Opacidade | `semantic.opacity.*` | `semantic.opacity.subtle` |
| Foundation | `foundation.*` | `foundation.bg.primary`, `foundation.text.body` |

### Formatos de output

| Formato | Diretório | Unidades | Para quem |
|---------|-----------|----------|-----------|
| JSON | `dist/json/` | `px` | Figma, Tokens Studio |
| CSS | `dist/css/` | `rem` | Web (CSS custom properties) |
| ESM | `dist/esm/` | `px` | JavaScript moderno |
| CJS | `dist/cjs/` | `px` | Node.js / bundlers legados |
| TypeScript | `dist/dts/` | — | Type-safe consumption |

### Contrato de naming

O engine produz um **contrato canônico de nomenclatura** que garante que todos os consumidores interpretem os tokens da mesma forma:

- **`semantic.*`** — Sempre use para estilização. É a camada canônica exposta para componentes.
- **`foundation.*`** — Use quando um alias adequado existe. Não substitui o Semantic como fonte de verdade.
- **`component.*`** — Tokens escopados a componentes específicos (quando presentes no build).

**Nunca use diretamente:** `theme.*`, `brand.*`, `mode.*`, `surface.*` — essas são camadas internas.

---

## Para quem

| Perfil | O que consome | Ponto de entrada |
|--------|--------------|-----------------|
| **System Designer** | Configura o engine | `config/*.config.mjs` |
| **Engenheiro front-end** | CSS custom properties, JSON, ESM | `dist/` |
| **Product Designer (Figma)** | Tokens Studio → Figma Variables | JSON exportado |
| **Biblioteca de componentes** | `semantic.*` e `foundation.*` | `dist/json/` ou pacote npm |
| **Plataforma Mobile** | JSON ou ESM | `dist/json/` |

O engine **não** impõe framework. React, Vue, Flutter, CSS-only — todos são consumidores válidos do mesmo output.

---

## O que o engine NÃO faz

- **Não implementa componentes.** Botões, inputs, modais — isso fica na biblioteca de componentes do consumidor.
- **Não define comportamento.** Hover states, animações, lógica de UI — o engine apenas produz os tokens que esses comportamentos usam.
- **Não substitui um Design System completo.** É a **fundação** sobre a qual um DS completo é construído.
- **Não deve ser rodado pelo consumidor.** Consumidores usam o `dist/` gerado; apenas quem contribui para o engine precisa rodar os scripts de geração.

---

## Versionamento e Contrato

O engine segue **Semantic Versioning**:
- **Patch:** Correções que não afetam tokens existentes
- **Minor:** Novos tokens adicionados (retrocompatível)
- **Major:** Tokens renomeados ou removidos — breaking change; documentado em CHANGELOG

Renomear ou remover um token é tratado como breaking change porque quebra o código de todos os consumidores que usam aquele token.

---

## Referências

- Workflow do designer: [02-designer-workflow.md](./02-designer-workflow.md)
- Guia de configuração: [03-configuration-guide.md](./03-configuration-guide.md)
- Arquitetura de tokens (5 camadas): [01-token-architecture.md](../01-design-tokens-fundamentals/01-token-architecture.md)
- Contrato de naming canônico: [canonical-taxonomy-and-naming-contract.md](../../references/aplica-tokens-theme-engine/docs/context/tokens/canonical-taxonomy-and-naming-contract.md)
- Fluxo Surface → Mode → Theme: [SURFACE-MODE-THEME-FLOW.md](../../references/aplica-tokens-theme-engine/docs/context/SURFACE-MODE-THEME-FLOW.md)
- Visão do engine (referência): [WHAT_IS_THEME_ENGINE.md](../../references/aplica-tokens-theme-engine/docs/context/WHAT_IS_THEME_ENGINE.md)
