---
title: "Configuração de Transformers"
lang: pt-br
---

# Configuração de Transformers

A configuração de transformers controla como o engine converte `data/` em `dist/`. Ela define quais camadas de token construir, quais plataformas de output gerar e onde cada arquivo de output vai.

Essa configuração fica em `theme-engine/transformers.config.mjs`.

---

## Referência completa

```js
import { defineTransformersConfig } from '@aplica/aplica-theme-engine/transformers/config';

export default defineTransformersConfig({

  // ── Camadas ────────────────────────────────────────────────────────────
  layers: {
    semantic: {
      enabled:   true,
      platforms: ['json', 'esm', 'js', 'css']
    },
    foundation: {
      enabled:   true,
      platforms: ['json', 'esm', 'js', 'css']
    },
    components: {
      enabled:   false,
      platforms: ['json']
    }
  },

  // ── Diretórios de output ──────────────────────────────────────────────
  output: {
    directories: {
      json:    './dist/json',
      js:      './dist/js',
      esm:     './dist/esm',
      dts:     './dist/js',      // declarations TypeScript junto com CJS
      dtsESM:  './dist/esm',     // declarations TypeScript junto com ESM
      css:     './dist/css/semantic',
      scss:    './dist/scss'     // opcional
    },
    namespaces: {
      semantic: {
        css: './dist/css/semantic'
      },
      foundation: {
        json: './dist/json/foundation',
        js:   './dist/js/foundation',
        esm:  './dist/esm/foundation',
        css:  './dist/css/foundation'
      },
      components: {
        json:    './dist/json/components',
        js:      './dist/js/components',
        esm:     './dist/esm/components',
        css:     './dist/css/components',
        dts:     './dist/json/components',
        dtsESM:  './dist/json/components'
      }
    }
  },

  // ── Assets ────────────────────────────────────────────────────────────
  assets: {
    copyFonts:             true,
    generateFontsManifest: true
  }

});
```

---

## `layers`

Controla quais camadas de token são construídas e em quais formatos.

### `layers.semantic`

A camada Semantic contém todos os tokens com propósito definido (`semantic.color.*`, `semantic.typography.*`, `semantic.dimension.*`, etc.). É a camada canônica para estilização de componentes.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `enabled` | boolean | Se deve construir esta camada |
| `platforms` | string[] | Quais formatos de output gerar |

### `layers.foundation`

A camada Foundation contém aliases simplificados para times de produto (`foundation.bg.*`, `foundation.txt.*`, `foundation.spacing.*`). Sempre construída junto com a Semantic.

### `layers.components`

Uma camada opcional para tokens com escopo de componente. Ignore se seu projeto só usa outputs Semantic e Foundation.

**Nota:** `build:components` termina de forma limpa com mensagem informativa quando nenhum dado de componente existe.

---

## `output.directories`

Define o caminho de output raiz para cada plataforma. Todos os caminhos devem ficar dentro da raiz do projeto.

| Chave | Padrão | Descrição |
|-------|--------|-----------|
| `json` | `./dist/json` | Arquivos de token JSON (valores em px, para Figma e Tokens Studio) |
| `js` | `./dist/js` | Módulos CommonJS (valores em px, para Node.js e bundlers legados) |
| `esm` | `./dist/esm` | ES Modules (valores em px, para JavaScript moderno) |
| `dts` | `./dist/js` | Declarações TypeScript co-localizadas com CJS |
| `dtsESM` | `./dist/esm` | Declarações TypeScript co-localizadas com ESM |
| `css` | `./dist/css/semantic` | CSS custom properties (valores em rem, para Web) |
| `scss` | `./dist/scss` | Variáveis SCSS (opcional) |

---

## `output.namespaces`

Sobrescreve o caminho de output para camadas específicas. A camada Foundation sempre usa um sub-caminho estável para garantir contratos de import previsíveis.

**Contrato de output do Foundation (estável entre versões do engine):**

```
dist/json/foundation/<marca>/foundation.json
dist/js/foundation/<marca>/foundation.cjs
dist/esm/foundation/<marca>/foundation.mjs
dist/css/foundation/<marca>/foundation.css
dist/css/foundation/<marca>/typography.css
dist/css/foundation/<marca>/elevation.css
```

Esses caminhos são intencionalmente estáveis — consumidores downstream podem contar com eles não mudando entre versões menores do engine.

---

## `assets`

| Campo | Padrão | Descrição |
|-------|--------|-----------|
| `copyFonts` | `true` | Copiar arquivos de fonte de `assets/fonts/` para `dist/assets/fonts/` |
| `generateFontsManifest` | `true` | Gerar um `fonts-manifest.json` listando todos os arquivos de fonte |

Se `copyFonts` for `true` mas `assets/fonts/` não existir, o build avisa e continua. Nenhuma fonte é copiada; todos os outros outputs são gerados normalmente.

---

## Configurações comuns

### Projeto apenas para Web (CSS + JSON)

```js
layers: {
  semantic:   { enabled: true, platforms: ['css', 'json'] },
  foundation: { enabled: true, platforms: ['css', 'json'] },
  components: { enabled: false, platforms: [] }
},
assets: { copyFonts: false, generateFontsManifest: false }
```

### Projeto multi-plataforma (Web + Mobile + Figma)

```js
layers: {
  semantic:   { enabled: true, platforms: ['json', 'esm', 'js', 'css'] },
  foundation: { enabled: true, platforms: ['json', 'esm', 'js', 'css'] },
  components: { enabled: false, platforms: ['json'] }
}
```

### Publicando um pacote de tokens no npm

```js
layers: {
  semantic:   { enabled: true,  platforms: ['json', 'esm', 'js', 'css'] },
  foundation: { enabled: true,  platforms: ['json', 'esm', 'js', 'css'] },
  components: { enabled: false, platforms: ['json'] }
},
output: {
  directories: {
    json: './dist/json',
    js:   './dist/js',
    esm:  './dist/esm',
    dts:  './dist/js',
    css:  './dist/css/semantic'
  }
},
assets: { copyFonts: true, generateFontsManifest: true }
```

Adicione um array `"files"` ao seu `package.json` para controlar o que é publicado:

```json
{
  "files": ["dist/", "package.json", "README.md"],
  "exports": {
    "./foundation/css":  "./dist/css/foundation/engine/foundation.css",
    "./foundation/json": "./dist/json/foundation/engine/foundation.json",
    "./foundation/esm":  "./dist/esm/foundation/engine/foundation.mjs"
  }
}
```

---

## Validação

Se a config de transformers estiver ausente ou malformada, `build:all` falha rapidamente com um erro descritivo. O engine não faz fallback silencioso para padrões quando um arquivo de config explícito está presente mas inválido.

Quando nenhum arquivo de config existe, o engine usa seus padrões internos — útil para testes rápidos, mas não recomendado para produção.
