---
title: "Formatos de Output"
lang: pt-BR
---

# Formatos de Output

## Premissa

O Aplica Tokens Theme Engine gera os mesmos tokens em múltiplos formatos para atender consumidores com necessidades distintas. Cada formato tem suas unidades, convenções de naming e casos de uso específicos. A escolha certa do formato poupa trabalho de integração.

---

## Onde os arquivos são gerados

```
dist/
├── json/                          ← JSON estruturado (Figma, Tokens Studio)
│   ├── aplica_joy-light-positive-semantic.json
│   ├── aplica_joy-light-positive-foundation.json
│   ├── aplica_joy-dark-positive-semantic.json
│   └── ...  (1 arquivo por combinação brand × mode × surface × tipo)
├── css/                           ← CSS custom properties (Web)
│   ├── aplica_joy-light-positive.css
│   └── ...
│   └── foundation/                ← Classes CSS de Foundation Styles
│       └── {brand}/
│           ├── typography.css     ← Classes compostas de tipografia
│           └── elevation.css      ← Classes compostas de elevação
├── esm/                           ← ES Modules (JavaScript moderno)
│   ├── aplica_joy-light-positive-semantic.mjs
│   └── ...
├── js/                            ← CommonJS (Node.js, bundlers legados)
│   ├── aplica_joy-light-positive-semantic.js
│   └── ...
└── dts/                           ← TypeScript declarations
    ├── aplica_joy-light-positive-semantic.d.ts
    └── ...
```

O nome de cada arquivo de tokens segue o padrão: `{brand}-{mode}-{surface}-{tipo}.{ext}`

Foundation Styles seguem: `dist/css/foundation/{brand}/typography.css` e `elevation.css`

---

## Formato JSON — para Figma e Tokens Studio

**Unidade:** `px` em todos os valores dimensionais  
**Uso:** Consumo direto pelo Figma via Tokens Studio, sistemas que precisam de valores numéricos

```json
{
  "semantic": {
    "color": {
      "interface": {
        "function": {
          "primary": {
            "normal": {
              "background": { "$value": "#C40145", "$type": "color" },
              "txtOn":       { "$value": "#ffffff", "$type": "color" },
              "border":      { "$value": "#9c0136", "$type": "color" },
              "txt":         { "$value": "#7a0128", "$type": "color" }
            }
          }
        }
      }
    },
    "dimension": {
      "spacing": {
        "medium": { "$value": "32px", "$type": "spacing" }
      }
    }
  }
}
```

O JSON mantém a estrutura hierárquica completa (`semantic.color.interface...`). Foundation é um arquivo separado com aliases que apontam para o Semantic:

```json
{
  "foundation": {
    "bg": {
      "primary": { "$value": "{semantic.color.interface.function.primary.normal.background}", "$type": "color" }
    }
  }
}
```

---

## Output JSON tipado — `jsonTyped` (desde 3.7.0)

**Uso:** Tooling que precisa de metadata estruturada por token além do valor resolvido — geração AI-assistida de componentes, code generators, design linters

`jsonTyped` é a primeira plataforma de output com metadata configurável. Onde o `json` padrão emite `{ "$value": ..., "$type": ... }`, o `jsonTyped` emite objetos com campos nomeados que você controla: `type`, `value`, `description` e `path`.

### Estrutura do output

```json
{
  "semantic": {
    "color": {
      "interface": {
        "function": {
          "primary": {
            "normal": {
              "background": {
                "type":        "color",
                "value":       "#C40145",
                "description": "Primary action background — normal intensity",
                "path":        "semantic.color.interface.function.primary.normal.background"
              }
            }
          }
        }
      }
    }
  }
}
```

### Como ativar

Adicione `jsonTyped` à lista `platforms` da camada e inclua `formatOptions.jsonTyped` em `transformers.config.mjs`:

```js
export default defineTransformersConfig({
  layers: {
    semantic: { enabled: true, platforms: ['json', 'jsonTyped', 'css', 'esm'] },
    // ...
  },
  formatOptions: {
    jsonTyped: {
      type:        'type',
      value:       'value',
      description: 'description', // omitir esta chave exclui description do output
      path:        'path',
    }
  }
});
```

### `json` vs `jsonTyped`

| | `json` | `jsonTyped` |
|---|---|---|
| Campo de valor | `$value` | configurável (padrão: `value`) |
| Campo de tipo | `$type` | configurável (padrão: `type`) |
| Descrição | não emitido | configurável (omitir chave para excluir) |
| Caminho | não emitido | configurável (padrão: `path`) |
| Backward compatible | — | sim — contrato `json` existente não muda |

`jsonTyped` é aditivo: consumidores `json` existentes não são afetados. Habilite ambas as plataformas na mesma camada se precisar das duas.

Veja [`formatOptions.jsonTyped`](../09-engineering/04-transformers-configuration.md) para a referência completa de campos.

### Formato de cor para Dart / Flutter (desde 3.24.0, opt-in)

Por padrão o `jsonTyped` emite as cores exatamente como o pipeline resolve (um hex possivelmente encurtado, tipo `#fb00`, ou `rgba(...)`), o que não é um formato estável para parsers Dart / Flutter. `formatOptions.jsonTyped.colorFormat` normaliza **todas** as cores resolvidas em `dist/json-typed/` para um único formato:

| `colorFormat` | Exemplo (`#265ed9` a 50%) |
|---------------|---------------------------|
| _(não definido, padrão)_ | valor exatamente como resolvido hoje |
| `hex8` (recomendado p/ Dart) | `#265ed980` - sempre `#RRGGBBAA`, minúsculo |
| `rgb` | `rgba(38, 94, 217, 0.5)` |
| `argb` | `0x80265ED9` - literal Flutter `Color(0xAARRGGBB)` |
| `components` | `{ "r": 38, "g": 94, "b": 217, "a": 0.5 }` |
| `dtcg` | `{ "colorSpace": "srgb", "components": [0.149, 0.3686, 0.851], "alpha": 0.5, "hex": "#265ed9" }` |

```js
formatOptions: { jsonTyped: { colorFormat: 'hex8' } }
```

Só o `jsonTyped` é afetado. CSS e todas as outras plataformas mantêm o output padrão.

### Formatos de valor para Dart / Flutter (desde 3.25.0, opt-in)

Além das cores, o `value` padrão do `jsonTyped` não é uma primitiva por `type`: dimensões são strings (`"12px"`), e gradientes são tokens `type: "color"` com uma string `linear-gradient(...)` que um parser de cor não consegue ler. Mais duas chaves de `formatOptions.jsonTyped` resolvem isso:

| Opção | Padrão (não definida) | Valor | Efeito |
|-------|-----------------------|-------|--------|
| `dimensionFormat` | dimensões continuam strings (`"12px"`) | `'number'` | `spacing`, `sizing`, `borderRadius`, `borderWidth` e `dimension` viram números (`12`, `0.05`). Só `px` e `em` são convertidos; aliases (`{spacing.base}`) e outras unidades ficam como escritos |
| `gradientFormat` | `type: color` com string `linear-gradient(...)` | `'structured'` | `type` vira `gradient` e `value` vira `{ "angle": 180, "stops": [{ "color": "#a8c8f4ff", "position": 0 }, ...] }`. O ângulo é em graus CSS; posições são frações 0-1 (`stops` do Flutter); as cores dos stops seguem `colorFormat` |

```js
formatOptions: {
  jsonTyped: {
    colorFormat: 'hex8',
    dimensionFormat: 'number',
    gradientFormat: 'structured'
  }
}
```

- **`letterSpacing` não é convertido.** O engine o escreve como número sem unidade (Tokens Studio / Figma leem como px) enquanto o build acrescenta `em`, então a unidade é indefinida e um número puro esconderia isso. Ele continua string, tipo `"-0.72em"`; trate qualquer valor diferente de zero como não resolvido até existir um modo de unidade explícita. Isso foi definido na 3.25.0 antes de a opção ser lançada, então nenhum consumidor é afetado.
- Tudo que o formatador não consegue interpretar (um alias, um gradiente não suportado) volta intacto, então nenhuma informação se perde. Valores desconhecidos fazem o `theme-engine build` falhar.
- Tokens compostos de foundation (`typography`, `boxShadow`) são objetos e não são normalizados por essas opções.
- As duas opções são opt-in: sem elas o `dist/json-typed/` é idêntico byte a byte ao das versões anteriores. CSS, `json`, JS/ESM e o contrato de tokens nunca mudam por causa delas.

---

## Formato CSS — para Web

**Unidade:** `rem` em tokens dimensionais (tamanhos, espaçamentos, raios, tipografia)  
**Exceções em `px`:** tokens com `$type: "number"` (ex.: `semantic.depth.spread`)  
**Uso:** Aplicação web via CSS custom properties

### Conversão px → rem

```
rem = px / baseFontSize (padrão: 16)
```

| Token semântico | Valor fonte (px) | CSS output (rem) |
|----------------|-----------------|-----------------|
| `dimension.spacing.medium` | `32px` | `2rem` |
| `dimension.spacing.nano` | `4px` | `0.25rem` |
| `typography.fontSizes.medium` | `16px` | `1rem` |
| `border.radius.medium` | `8px` | `0.5rem` |
| `depth.spread.level_two` | `-2` | `-2` (permanece número) |

**Por que rem?** Dimensões em `rem` respeitam a preferência de tamanho de fonte do usuário no navegador. Se o usuário configurar o root para 20px, todos os espaçamentos e tamanhos escalam proporcionalmente — acessibilidade por construção.

### Estrutura das variáveis CSS

```css
/* aplica_joy-light-positive.css */
:root,
[data-theme="aplica_joy-light-positive"] {

  /* Semantic — cores */
  --semantic-color-interface-function-primary-normal-background: #C40145;
  --semantic-color-interface-function-primary-normal-txt-on:     #ffffff;
  --semantic-color-interface-feedback-success-default-background: #D7F6CB;

  /* Semantic — dimensões (rem) */
  --semantic-dimension-spacing-medium:  2rem;
  --semantic-dimension-spacing-small:   1.5rem;
  --semantic-typography-font-sizes-medium: 1rem;
  --semantic-border-radius-medium:      0.5rem;

  /* Semantic — elevação (px, não converte) */
  --semantic-depth-spread-level-two: -2;

  /* Foundation — aliases */
  --foundation-bg-primary:     var(--semantic-color-interface-function-primary-normal-background);
  --foundation-text-body:      var(--semantic-color-text-body-default);
  --foundation-spacing-medium: var(--semantic-dimension-spacing-medium);
}
```

### Troca de tema em runtime

A troca de tema via CSS é feita por seletor de atributo:

```html
<!-- Tema padrão: aplica_joy light positive -->
<html data-theme="aplica_joy-light-positive">

<!-- Trocar para dark -->
<html data-theme="aplica_joy-dark-positive">
```

```javascript
document.documentElement.setAttribute('data-theme', 'aplica_joy-dark-positive');
```

Nenhum JavaScript adicional é necessário — a mudança de atributo ativa o CSS correspondente.

---

## Formato ESM — para JavaScript moderno

**Unidade:** `px` (valores numéricos, sem conversão)  
**Uso:** Aplicações React, Vue, bundlers modernos (Vite, esbuild, Rollup)

```javascript
// aplica_joy-light-positive-semantic.mjs
export const semantic = {
  color: {
    interface: {
      function: {
        primary: {
          normal: {
            background: '#C40145',
            txtOn: '#ffffff',
            border: '#9c0136'
          }
        }
      }
    }
  },
  dimension: {
    spacing: {
      medium: '32px',
      small: '24px'
    }
  }
};
```

**Modo aliases vs modo raw:**

- **Aliases (padrão):** Foundation expõe referências ao Semantic (`foundation.bg.primary` → `{semantic.color.*}`)
- **Raw:** Todos os tokens resolvidos para valores finais — útil para consumidores que não suportam referências W3C

O engine gera tokens alias por padrão. A resolução de valores finais acontece durante o build do Style Dictionary (`tokens:build:all`), então o output ESM que você consome em `dist/` sempre contém valores resolvidos.

---

## Formato CJS — para Node.js e bundlers legados

**Unidade:** `px`  
**Diretório:** `dist/js/`  
**Uso:** Node.js, Webpack, projetos que não suportam ESM nativo

```javascript
// aplica_joy-light-positive-semantic.js
const semantic = {
  color: { /* ... mesma estrutura do ESM */ }
};

module.exports = { semantic };
```

---

## Formato TypeScript — para type-safety

**Uso:** Projetos TypeScript que querem autocompletar e checagem de tipos ao acessar tokens

```typescript
// aplica_joy-light-positive-semantic.d.ts
export declare const semantic: {
  color: {
    interface: {
      function: {
        primary: {
          normal: {
            background: string;
            txtOn: string;
            border: string;
          };
        };
      };
    };
  };
  dimension: {
    spacing: {
      medium: string;
      small: string;
      // ...
    };
  };
};
```

Uso com autocompletar:

```typescript
import { semantic } from './dist/esm/aplica_joy-light-positive-semantic.mjs';

const color = semantic.color.interface.function.primary.normal.background; // #C40145
```

---

## Regra de consumo: qual camada usar

| Cenário | Camada recomendada | Exemplo |
|---------|-------------------|---------|
| Estilizar qualquer componente | **Semantic** | `var(--semantic-color-interface-function-primary-normal-background)` |
| Alias simples já existe | **Foundation** (quando disponível) | `var(--foundation-bg-primary)` |
| Cálculo em JavaScript | **ESM/CJS** com Semantic | `tokens.semantic.dimension.spacing.medium` |
| Configurar tokens no Figma | **JSON** via Tokens Studio | arquivo `*-semantic.json` |
| Nunca usar diretamente | `brand.*`, `mode.*`, `surface.*` | Camadas internas — não fazem parte do contrato |

A Foundation é um atalho para o Semantic — não o substitui como fonte de verdade. Se um alias Foundation não existe para o caso de uso, use o Semantic diretamente.

---

## Naming das variáveis CSS

O ponto (`.`) dos caminhos de token é convertido para hífen (`-`) no CSS:

```
semantic.color.interface.function.primary.normal.background
↓
--semantic-color-interface-function-primary-normal-background
```

```
foundation.bg.primary
↓
--foundation-bg-primary
```

---

## Tabela de comparação por formato

| Formato | Unidade | Estrutura | Referências | Uso principal |
|---------|---------|-----------|-------------|--------------|
| **JSON** | `px` | Nested com `$value`/`$type` | Mantidas (`{semantic.*}`) | Figma, Tokens Studio |
| **jsonTyped** | `px` | Nested objects com campos nomeados | Resolvidas | Tooling, geração AI-assistida |
| **CSS** | `rem` (dimensões) | Flat `--var-name: value` | Resolvidas | Web — `:root` ou `[data-theme]` |
| **ESM** | `px` | Nested JS object | Aliases (padrão) ou raw | React, Vue, Vite |
| **CJS** | `px` | Nested JS object | Aliases (padrão) ou raw | Node.js, Webpack |
| **TypeScript** | — | Declarações de tipo | — | Autocompletar, checagem de tipos |

---

## Configuração de unidades

Para reverter o CSS para `px` (ex.: ambientes sem suporte a rem):

```json
// theme-engine/config/global/themes.config.json
{
  "global": {
    "dimension": {
      "outputUnit": {
        "css": "px",
        "default": "px"
      }
    }
  }
}
```

Para usar uma base diferente de `16px` (ex.: estratégia 62.5% com `10px` root):

```json
{
  "global": {
    "dimension": {
      "baseFontSize": 10
    }
  }
}
```

---

## Foundation Styles — output de classes CSS compostas

Além das CSS custom properties por token, o engine gera arquivos de classes CSS compostas em `dist/css/foundation/{brand}/`. Esses arquivos são gerados a partir dos dados de Foundation Styles (`data/foundation/{brand}/styles/typography_styles.json` e `elevation_styles.json`) durante o step `foundations:generate`.

### Classes de tipografia

```css
/* dist/css/foundation/engine/typography.css */
.typography-engine-heading-title_1 {
  font-family:     var(--semantic-typography-fontFamilies-main);
  font-weight:     var(--semantic-typography-fontWeights-main-semibold-normal);
  font-size:       var(--semantic-typography-fontSizes-medium);
  line-height:     var(--semantic-typography-lineHeights-close-medium);
  letter-spacing:  var(--semantic-typography-letterSpacings-regular);
  text-transform:  var(--semantic-typography-textCase-uppercase);
  text-decoration: var(--semantic-typography-textDecoration-default);
}

.typography-engine-action-strong-tight-medium { ... }
.typography-engine-body-regular-loose-medium { ... }
```

### Classes de elevação

```css
/* dist/css/foundation/engine/elevation.css */
.elevation-level_zero      { box-shadow: ... }
.elevation-level_one       { box-shadow: ... }
.elevation-level_two       { box-shadow: ... }
.elevation-level_three     { box-shadow: ... }
.elevation-level_four      { box-shadow: ... }
.elevation-level_five      { box-shadow: ... }
```

Cada classe compõe tokens semânticos de depth, spread e opacidade. Os valores resolvem a partir do tema ativo em runtime — a troca de tema os atualiza automaticamente.

### Ordem de carregamento

```html
<!-- Arquivo de tema deve carregar primeiro (fornece as --semantic-* custom properties) -->
<link rel="stylesheet" href="/dist/css/aplica_joy-light-positive.css" />

<!-- Foundation Styles consomem as custom properties definidas acima -->
<link rel="stylesheet" href="/dist/css/foundation/engine/typography.css" />
<link rel="stylesheet" href="/dist/css/foundation/engine/elevation.css" />
```

Veja [06-foundation-styles.md](./06-foundation-styles.md) para o guia completo sobre Foundation Styles.

---

## Referências

- Pipeline de build: [04-build-pipeline.md](./04-build-pipeline.md)
- Workflow do designer (Figma): [02-designer-workflow.md](./02-designer-workflow.md)
- Consumindo tokens de dist/: [07-implementation/03-consuming-dist-tokens.md](../07-implementation/03-consuming-dist-tokens.md)
- Configuração de transformers (diretórios de output): [09-engineering/04-transformers-configuration.md](../09-engineering/04-transformers-configuration.md)
