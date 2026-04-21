---
title: "Entendendo os Tokens Gerados"
lang: pt-BR
---

# Entendendo os Tokens Gerados

## Público

Este artigo é para desenvolvedores que **rodaram o engine** — seja `npm run tokens:build` concluiu com sucesso, ou eles têm uma pasta `dist/` nova — e querem entender o que foi gerado, como navegar e quais tokens usar em cada caso.

---

## O que o engine gerou

Após um `tokens:build` bem-sucedido, dois diretórios existem no seu projeto:

### `data/` — dados intermediários do pipeline

Nunca use isso diretamente. É o estado de trabalho do engine entre as etapas do pipeline:

```
data/
├── brand/<marca>/        ← Paletas de cores decompostas por marca
├── mode/                 ← Modulação de luminosidade light/dark
├── surface/              ← Contexto de surface positiva/negativa
├── dimension/            ← Escala espacial e tipográfica
├── semantic/             ← Definições de tokens com propósito
└── foundation/<nome>/    ← Definições de aliases Foundation
```

Arquivos em `data/` são **gerados**. Qualquer edição manual é sobrescrita na próxima build.

### `dist/` — output para consumidores

É isso que você importa nas suas aplicações:

```
dist/
├── json/
│   ├── <marca>-light-positive-semantic.json
│   ├── <marca>-light-positive-foundation.json
│   ├── <marca>-dark-positive-semantic.json
│   └── ...
├── css/
│   ├── semantic/<marca>-light-positive.css
│   └── foundation/<marca>/foundation.css
├── esm/
│   ├── <marca>-light-positive-semantic.mjs
│   └── foundation/<marca>/foundation.mjs
├── js/
│   ├── <marca>-light-positive-semantic.js
│   └── foundation/<marca>/foundation.cjs
└── dts/
    └── ...
```

---

## Convenção de nomenclatura dos arquivos

Os arquivos de output seguem o padrão: `{marca}-{mode}-{surface}-{camada}.{ext}`

| Segmento | Valores | Significado |
|----------|---------|-------------|
| `marca` | nome da sua marca | A marca configurada (ex.: `aplica_joy`) |
| `mode` | `light`, `dark` | Contexto de luminosidade |
| `surface` | `positive`, `negative` | Polaridade de surface (positive = padrão, negative = invertida) |
| `camada` | `semantic`, `foundation` | Qual camada de token (omitido no CSS, ambas as camadas em um arquivo) |

Exemplo: `aplica_joy-dark-positive-semantic.mjs` — brand Aplica Joy, dark mode, surface positiva, camada semântica, formato ESM.

---

## Duas camadas de token: quando usar cada uma

### Semantic (`semantic.*`)

Tokens com propósito que codificam **para que serve um token**. Cada nome de token descreve seu papel na UI — não seu valor visual.

```
semantic.color.interface.function.primary.normal.background
         │      │         │        │       │      └─ propriedade
         │      │         │        │       └─ intensidade (lowest/normal/highest)
         │      │         │        └─ categoria de cor (function, feedback, brand, text...)
         │      │         └─ grupo semântico (interface, ambient, gradient...)
         │      └─ tipo (color, dimension, typography, border, depth...)
         └─ namespace
```

**Use Semantic quando:**
- Estiver construindo componentes do design system (botões, inputs, cards)
- Precisar de um token específico que Foundation não expõe
- Precisar do conjunto completo de variantes (intensidades lowest/normal/highest)

### Foundation (`foundation.*`)

Aliases simplificados que apontam para tokens Semantic. Os nomes Foundation são intencionalmente curtos e descritivos para times de produto.

```
foundation.bg.primary          → semantic.color.interface.function.primary.normal.background
foundation.txt.body            → semantic.color.text.body.default
foundation.spacing.medium      → semantic.dimension.spacing.medium
```

**Use Foundation quando:**
- Estiver construindo funcionalidades de produto (telas, fluxos, conteúdo)
- Quiser nomes mais curtos com menos carga cognitiva
- O token que precisa tem um alias Foundation

**Regra:** Foundation é um atalho para Semantic, não o substitui como fonte de verdade. Se não existe um alias Foundation para o seu caso, use Semantic diretamente.

---

## Convenções de nomenclatura de tokens

### Nomenclatura de CSS custom properties

O separador ponto nos caminhos de token vira hífen no CSS:

```
semantic.color.interface.function.primary.normal.background
→ --semantic-color-interface-function-primary-normal-background

foundation.bg.primary
→ --foundation-bg-primary
```

### camelCase em JavaScript

Objetos ESM/CJS usam camelCase para segmentos com múltiplas palavras:

```javascript
// Caminho do token: semantic.color.interface.function.primary.normal.background
semantic.color.interface.function.primary.normal.background

// Caminho do token: foundation.bg.primary
foundation.bg.primary
```

---

## Navegando pela camada Semantic

### Categorias de cor

| Categoria | Caminho | Contém |
|-----------|---------|--------|
| Função de interface | `semantic.color.interface.function.*` | Ações primária, secundária, link |
| Feedback de interface | `semantic.color.interface.feedback.*` | Info, success, warning, danger |
| Branding | `semantic.color.brand.*` | Brand first, second, third |
| Texto | `semantic.color.text.*` | Body, heading, muted, disabled |
| Ambient | `semantic.color.ambient.*` | Cores de background, overlay |
| Product | `semantic.color.product.*` | Promo, cashback, premium |

### Propriedades de cor por token

Cada token de cor expõe três propriedades:

| Propriedade | Descrição |
|-------------|-----------|
| `background` | Cor de preenchimento (surfaces, badges, botões) |
| `txtOn` | Cor de texto/ícone que passa WCAG sobre `background` |
| `border` | Cor de borda com contraste adequado em relação à surface |

Exemplo: `semantic.color.interface.function.primary.normal.background` → `#C40145`

### Níveis de intensidade

A maioria dos grupos de cor expõe três níveis de intensidade:

| Nível | Descrição |
|-------|-----------|
| `lowest` | Sutil — backgrounds tingidos, badges |
| `normal` | Padrão — botão primário, ação principal |
| `highest` | Ênfase — estados hover, bordas em destaque |

### Tokens de dimensão

```
semantic.dimension.spacing.nano    → 4px
semantic.dimension.spacing.micro   → 8px
semantic.dimension.spacing.small   → 12px
semantic.dimension.spacing.medium  → 32px
semantic.dimension.spacing.large   → 48px
```

---

## Quantos arquivos foram gerados

Com a configuração padrão (1 marca × 2 modes × 2 surfaces × 2 camadas):

| Formato | Arquivos por build |
|---------|-------------------|
| JSON | 1 marca × 2 modes × 2 surfaces × 2 camadas = 4 arquivos |
| CSS | 1 arquivo combinado por variante = 4 arquivos |
| ESM | Mesmo que JSON = 4 arquivos |
| CJS | Mesmo que JSON = 4 arquivos |
| TypeScript | Mesmo que JSON = 4 arquivos |

Adicione mais marcas na configuração e a contagem escala automaticamente: 3 marcas × 2 × 2 × 2 = 24 arquivos JSON.

---

## Qual arquivo importar

| Caso de uso | Import |
|-------------|--------|
| Estilizar uma app web (CSS puro ou qualquer framework) | `dist/css/semantic/<marca>-light-positive.css` |
| Ler cores/dimensões em JavaScript | `dist/esm/<marca>-light-positive-semantic.mjs` |
| Carregar aliases Foundation (simplificados) | `dist/esm/foundation/<marca>/foundation.mjs` |
| Passar tokens para Figma / Tokens Studio | `dist/json/<marca>-light-positive-semantic.json` |
| Script Node.js (CommonJS) | `dist/js/<marca>-light-positive-semantic.js` |

Importe apenas a variante que precisar — não é necessário carregar todos os arquivos.

---

## Verificando o output

Após `tokens:build`, verifique se o `dist/` está completo:

```bash
# Listar arquivos CSS gerados
ls dist/css/semantic/

# Verificar um valor de token pontualmente
grep 'foundation-bg-primary' dist/css/semantic/aplica_joy-light-positive.css

# Validar data/ antes do build (detecta incompatibilidades de schema cedo)
aplica-theme-engine validate:data
```

---

## Referências

- Consumindo tokens: [03-consuming-dist-tokens.pt-br.md](./03-consuming-dist-tokens.pt-br.md)
- Formatos de output: [04-theme-engine/05-output-formats.pt-br.md](../04-theme-engine/05-output-formats.pt-br.md)
- Conceito da camada Semantic: [02-token-layers/04-semantic-layer.pt-br.md](../02-token-layers/04-semantic-layer.pt-br.md)
- Conceito da camada Foundation: [02-token-layers/05-foundation-layer.pt-br.md](../02-token-layers/05-foundation-layer.pt-br.md)
- Arquitetura de tokens (5 camadas): [01-design-tokens-fundamentals/01-token-architecture.pt-br.md](../01-design-tokens-fundamentals/01-token-architecture.pt-br.md)
