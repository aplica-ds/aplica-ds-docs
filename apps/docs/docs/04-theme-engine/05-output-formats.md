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

O nome de cada arquivo segue o padrão: `{brand}-{mode}-{surface}-{tipo}.{ext}`

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
              "border":      { "$value": "#9c0136", "$type": "color" }
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

## Referências

- Pipeline de build: [04-build-pipeline.md](./04-build-pipeline.md)
- Workflow do designer (Figma): [02-designer-workflow.md](./02-designer-workflow.md)
- Consumindo tokens de dist/: [07-implementation/03-consuming-dist-tokens.md](../07-implementation/03-consuming-dist-tokens.md)
- Configuração de transformers (diretórios de output): [09-engineering/04-transformers-configuration.md](../09-engineering/04-transformers-configuration.md)
