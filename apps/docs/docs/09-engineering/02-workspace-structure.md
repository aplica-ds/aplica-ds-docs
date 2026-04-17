---
title: "Estrutura do Workspace de Consumidor"
lang: pt-br
---

# Estrutura do Workspace de Consumidor

O Aplica Theme Engine segue um modelo **core + consumidor**. O pacote é dono do engine de geração; seu projeto é dono da configuração, dos dados gerados e do output final de build.

Este artigo explica cada arquivo e diretório do workspace de consumidor.

---

## Estrutura completa

```
seu-projeto/
  aplica-theme-engine.config.mjs     ← ponto de entrada do workspace (obrigatório)
  package.json
  theme-engine/
    config/
      global/
        themes.config.json            ← lista de marcas e configurações globais
        dimension.config.mjs          ← escalas de espaçamento e tamanho
      foundations/
        engine.config.mjs             ← tipografia e elevação do Foundation
      minha-marca.config.mjs          ← cores e tipografia por marca
    schemas/                          ← opcional: sobrescritas de schema do consumidor
      architecture.mjs
    transformers.config.mjs           ← configuração de saída de build
  data/                               ← gerado (não editar manualmente)
  dist/                               ← gerado (não editar manualmente)
```

---

## `aplica-theme-engine.config.mjs`

O ponto de entrada do workspace. Informa ao engine onde encontrar sua configuração, onde gravar os dados gerados e onde gravar os outputs finais.

```js
import { defineThemeEngineConfig } from '@aplica/aplica-theme-engine/config';

export default defineThemeEngineConfig({
  transformersConfigFile: './theme-engine/transformers.config.mjs',
  paths: {
    configDir:       './theme-engine/config',
    globalConfigDir: './theme-engine/config/global',
    foundationsDir:  './theme-engine/config/foundations',
    schemasDir:      './theme-engine/schemas',  // opcional
    dataDir:         './data',
    distDir:         './dist'
  }
});
```

**Regras:**
- Todos os caminhos devem ficar dentro da raiz do projeto. O engine se recusa a gravar fora do workspace.
- `schemasDir` é opcional. Omiti-lo significa usar os schemas padrão do pacote.
- Um arquivo `aplica-theme-engine.config.json` ou uma chave `package.json#aplicaThemeEngine` também funcionam como fallbacks, mas a forma `.mjs` é preferida.

---

## `theme-engine/config/global/themes.config.json`

Declara todas as marcas e suas configurações globais de build.

```json
{
  "brands": ["minha-marca"],
  "modes": ["light", "dark"],
  "generateGradients": true
}
```

- **`brands`** — lista de nomes de marca. Cada nome deve corresponder a um arquivo `<nome>.config.mjs` em `config/`.
- **`modes`** — quais modos de luminosidade gerar. Aceita `"light"`, `"dark"` ou ambos.
- **`generateGradients`** — se o engine deve construir tokens de gradiente para este workspace.

---

## `theme-engine/config/global/dimension.config.mjs`

Controla a escala espacial (espaçamento, tamanho, border radius). O engine gera três variantes de escala — `minor`, `normal` e `major` — a partir desta definição única.

Veja [03-theme-configuration.md](./03-theme-configuration.md) para o formato completo deste arquivo.

---

## `theme-engine/config/foundations/engine.config.mjs`

Define os tokens de tipografia e elevação que aparecem na camada Foundation. São os tokens que times de produto usam diretamente (ex: `foundation.txt.title`, `foundation.bg.primary`).

---

## `minha-marca.config.mjs`

Um arquivo por marca. Define os valores primitivos que o engine usa para gerar o conjunto completo de tokens:

- Cores primárias, secundárias e de destaque
- Cores de feedback (info, success, warning, danger)
- Famílias e pesos tipográficos
- Definições de gradiente (se ativado)

O nome do arquivo deve corresponder ao ID de marca declarado em `themes.config.json`.

Veja [03-theme-configuration.md](./03-theme-configuration.md) para um exemplo anotado.

---

## `theme-engine/transformers.config.mjs`

Controla como o engine transforma `data/` em `dist/`. Define quais camadas construir, quais plataformas gerar e onde cada output vai.

```js
import { defineTransformersConfig } from '@aplica/aplica-theme-engine/transformers/config';

export default defineTransformersConfig({
  layers: {
    semantic:    { enabled: true,  platforms: ['json', 'esm', 'js', 'css'] },
    foundation:  { enabled: true,  platforms: ['json', 'esm', 'js', 'css'] },
    components:  { enabled: false, platforms: ['json'] }
  },
  output: {
    directories: {
      json: './dist/json',
      js:   './dist/js',
      esm:  './dist/esm',
      css:  './dist/css/semantic'
    },
    namespaces: {
      foundation: {
        json: './dist/json/foundation',
        js:   './dist/js/foundation',
        esm:  './dist/esm/foundation',
        css:  './dist/css/foundation'
      }
    }
  },
  assets: {
    copyFonts:             true,
    generateFontsManifest: true
  }
});
```

Veja [04-transformers-configuration.md](./04-transformers-configuration.md) para a referência completa da API.

---

## `theme-engine/schemas/` (opcional)

Sobrescritas de schema do consumidor. Coloque aqui apenas os schemas que você precisa personalizar. O engine resolve os schemas do consumidor primeiro e volta para os padrões do pacote para tudo que não foi sobrescrito.

Sobrescritas típicas:

| Arquivo | O que controla |
|---------|---------------|
| `architecture.mjs` | Contrato completo de estrutura de tokens |
| `typography-styles.mjs` | Formato dos tokens de tipografia |
| `foundation-styles.mjs` | Formato dos tokens de Foundation |
| `typography-scale.mjs` | Algoritmo de escala tipográfica |

Para gerar um scaffold inicial de forma interativa:

```bash
npx aplica-theme-engine schemas:helper
```

---

## `data/` — gerado, não editar

O engine grava os dados brutos de tokens aqui após a geração. Pense em `data/` como uma representação intermediária — é a fonte para o build do Style Dictionary, não para editores humanos.

```
data/
  brand/<nome-da-marca>/  ← cores, tipografia, gradientes por marca
  mode/                   ← light.json, dark.json
  surface/                ← positive.json, negative.json
  dimension/              ← minor.json, normal.json, major.json
  semantic/               ← default.json (mapa de tokens com propósito)
  foundation/             ← <nome-do-foundation>/ (tokens com aliases)
```

**Nunca edite arquivos em `data/` diretamente.** Edições são sobrescritas na próxima rodada de geração. Todas as mudanças começam em `theme-engine/config/`.

---

## `dist/` — gerado, não editar

O output final consumível. É o que aplicações, bibliotecas de componentes e plugins do Figma importam.

```
dist/
  json/                           ← valores de tokens em JSON (px)
    foundation/<marca>/
      foundation.json
  esm/                            ← exports ES Module (px)
    foundation/<marca>/
      foundation.mjs
  js/                             ← exports CommonJS (px)
    foundation/<marca>/
      foundation.cjs
  css/                            ← CSS custom properties (rem)
    semantic/
    foundation/<marca>/
      foundation.css
      typography.css
      elevation.css
  assets/fonts/                   ← arquivos de fonte (se cópia de fontes ativa)
```

Os outputs de Foundation seguem um contrato de nomenclatura estável para que consumidores downstream possam depender de caminhos de import previsíveis entre versões do engine.

---

## Resumo de propriedade

| Diretório / Arquivo | Dono | Versionado por |
|--------------------|------|---------------|
| `aplica-theme-engine.config.mjs` | Consumidor | Repositório do consumidor |
| `theme-engine/config/` | Consumidor | Repositório do consumidor |
| `theme-engine/schemas/` | Consumidor (opcional) | Repositório do consumidor |
| `theme-engine/transformers.config.mjs` | Consumidor | Repositório do consumidor |
| `data/` | Engine (gerado) | Não commitar¹ |
| `dist/` | Engine (gerado) | Não commitar¹ |
| Lógica de geração e build | Pacote | `@aplica/aplica-theme-engine` |

¹ Se commitar `data/` e `dist/` depende do seu workflow. Times que publicam um pacote de tokens via CI tipicamente não commitam nenhum dos dois e deixam o CI regerar. Times que querem snapshots reproduzíveis podem commitar apenas `dist/`.
