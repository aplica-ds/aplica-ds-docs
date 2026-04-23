---
title: "Configuração de Tema"
lang: pt-br
---

# Configuração de Tema

A configuração de tema fica em `theme-engine/config/`. Esses arquivos definem o que o engine gera — cores de marca, tipografia, modos e escalas de espaçamento. O engine os lê; seu projeto os versiona.

---

## Mapa de arquivos

| Arquivo | Controla |
|---------|---------|
| `global/themes.config.json` | Lista de marcas, modos, superfícies, gradientes, escala de dimensão, escala tipográfica |
| `global/dimension.config.mjs` | Algoritmo de escala espacial (espaçamento, tamanho, border radius) |
| `foundations/engine.config.mjs` | Estilos de tipografia e elevação da camada Foundation |
| `<nome-da-marca>.config.mjs` | Cores primitivas, tipografia e opções por marca |

Todos os nomes de marca declarados em `themes.config.json` precisam ter um arquivo `<nome>.config.mjs` correspondente.

---

## `themes.config.json` — configurações globais

### Configuração mínima

```json
{
  "themes": {
    "minha-marca": {
      "foundation": {
        "brand": "engine",
        "files": [
          "default.json",
          "styles/typography_styles.json",
          "styles/elevation_styles.json"
        ]
      }
    }
  },
  "global": {
    "modes": ["light", "dark"],
    "surfaces": ["positive", "negative"],
    "gradients": false
  }
}
```

### `themes` — configurações por marca

Cada chave em `themes` é um ID de marca. O ID deve corresponder ao campo `name` no arquivo de config da marca correspondente e ao nome do arquivo sem extensão.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `foundation.brand` | string | Identificador de marca para o Foundation (geralmente `"engine"`) |
| `foundation.files` | string[] | Arquivos de Foundation a incluir no build |
| `includePrimitives` | boolean | Inclui `_primitive_theme.json` nos dados gerados. Use `false` para melhor performance no Figma. |

### `global` — configurações do workspace

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `modes` | `["light"]` / `["light", "dark"]` | Quais modos de luminosidade gerar |
| `surfaces` | `["positive"]` / `["positive", "negative"]` | Quais contextos de superfície gerar |
| `gradients` | boolean | Gerar tokens de gradiente |

### Escala tipográfica (opcional)

```json
{
  "global": {
    "typography": {
      "fontSizeScaleRatio": 1.2,
      "fontSizeScale": ["nano", "micro", "extraSmall", "small", "medium", "large", "extraLarge", "mega"]
    }
  }
}
```

- **`fontSizeScaleRatio`** — razão de escala musical para o crescimento do tamanho de fonte. Valores comuns: `1.125` (Major Second), `1.2` (Minor Third), `1.25` (Major Third), `1.333` (Perfect Fourth).
- **`fontSizeScale`** — lista ordenada de chaves de tamanho. O engine mapeia cada chave para um passo da escala.

---

## `<nome-da-marca>.config.mjs` — configuração por marca

Um arquivo por marca. Define os valores primitivos que o engine decompõe no conjunto completo de tokens.

### Exemplo mínimo

```js
export default {
  name: 'minha-marca',

  colors: {
    // Paleta de marca
    primaria:      '#3B82F6',
    clara:         '#EFF6FF',
    escura:        '#1E3A8A',

    // Cores de função de interface
    acao:          '#2563EB',
    acao_escura:   '#1D4ED8',
    link:          '#60A5FA',

    // Cores de feedback
    info_azul:            '#0EA5E9',
    info_azul_escuro:     '#0284C7',
    sucesso_verde:        '#22C55E',
    sucesso_verde_escuro: '#16A34A',
    aviso_laranja:        '#F59E0B',
    aviso_laranja_escuro: '#D97706',
    perigo_vermelho:      '#EF4444',
    perigo_vermelho_escuro:'#DC2626',
  },

  mapping: {
    brand: {
      first:  'primaria',
      second: 'clara',
      third:  'escura'
    },
    interface: {
      function: {
        primary:   'acao',
        secondary: 'acao_escura',
        link:      'link'
      },
      feedback: {
        info_default:         'info_azul',
        info_secondary:       'info_azul_escuro',
        success_default:      'sucesso_verde',
        success_secondary:    'sucesso_verde_escuro',
        warning_default:      'aviso_laranja',
        warning_secondary:    'aviso_laranja_escuro',
        danger_default:       'perigo_vermelho',
        danger_secondary:     'perigo_vermelho_escuro'
      }
    }
  },

  typography: {
    fontFamilies: {
      main:    'Inter',
      content: 'Inter',
      display: 'DM Sans',
      code:    'JetBrains Mono'
    }
  },

  options: {
    txtOnStrategy:         'brand-tint',
    accessibilityLevel:    'AAA',
    acceptAALevelFallback: true,
    darkModeChroma:        0.85,
    includePrimitives:     false,
    uiTokens:              false,
  }
};
```

### `colors` — valores de cor primitivos

Defina cores hexadecimais nomeadas aqui. São os valores brutos de paleta que o engine usa como entrada para a decomposição OKLCh. Eles não são expostos diretamente como tokens.

- **Cores de marca** — os três âncoras da paleta de marca (`first`, `second`, `third`)
- **Cores de função de interface** — ação primária, ação secundária e link
- **Cores de feedback** — info, sucesso, aviso e perigo; cada um com variante `default` e `secondary`

### `mapping` — atribuição de papel semântico

Mapeia as cores nomeadas para seus papéis semânticos. O engine usa esse mapeamento para gerar os conjuntos completos de tokens Semantic e Foundation.

| Chave | Papel |
|-------|-------|
| `brand.first` | Cor primária da marca — CTAs, superfícies principais, destaque de marca |
| `brand.second` | Cor secundária da marca — superfícies de apoio |
| `brand.third` | Cor terciária da marca — destaques escuros, texto em fundos de marca |
| `interface.function.primary` | Cor de ação primária — botões, estados ativos |
| `interface.function.secondary` | Cor de ação secundária — botões secundários |
| `interface.function.link` | Cor de link |
| `interface.feedback.*` | Info / sucesso / aviso / perigo, cada um com default + secondary |

### `typography` — famílias tipográficas

```js
typography: {
  fontFamilies: {
    main:    'Inter',           // texto de corpo, labels de UI
    content: 'Inter',           // conteúdo longo (pode ser diferente de main)
    display: 'DM Sans',         // títulos, texto de display
    code:    'JetBrains Mono'   // blocos de código, monoespaçado
  }
}
```

Os arquivos de fonte precisam estar em `assets/fonts/` se você ativar `copyFonts` na config de transformers.

### `options` — comportamento de geração

| Opção | Padrão | Descrição |
|-------|--------|-----------|
| `txtOnStrategy` | `'brand-tint'` | Como o texto-sobre-cor é calculado. `'brand-tint'` usa a cor de paleta mais próxima que passa. `'high-contrast'` sempre usa preto ou branco puro. |
| `txtBaseColorLevel` | `140` | Nível de paleta usado como ponto de partida para geração da cor `txt` (desde 3.6.0). Valores menores = texto mais claro. |
| `accessibilityLevel` | `'AAA'` | Alvo WCAG. `'AAA'` = proporção 7:1, `'AA'` = proporção 4.5:1. |
| `acceptAALevelFallback` | `true` | Quando `true`, o engine aceita automaticamente AA quando AAA falha em vez de bloquear. |
| `darkModeChroma` | `0.85` | Fator de saturação para a paleta dark mode. `1.0` = mesma saturação que light. `0.85` = 15% mais suave. |
| `includePrimitives` | `false` | Se deve gerar `_primitive_theme.json`. Defina `true` para uso no Figma; `false` reduz o tamanho do arquivo Figma. |
| `uiTokens` | `false` | Gerar arquivo de token `_ui.json`. |

### Gradientes (opcional)

Se `gradients: true` em `themes.config.json`, adicione cores de gradiente na config da marca:

```js
gradientColors: {
  first:  { lowest: '#bfdbfe', default: '#3B82F6', highest: '#1E3A8A' },
  second: { lowest: '#eff6ff', default: '#DBEAFE', highest: '#93c5fd' },
  third:  { lowest: '#1e40af', default: '#1E3A8A', highest: '#172554' }
}
```

---

## Workspace config — `aplica-theme-engine.config.mjs`

O comportamento de geração em nível de workspace fica em `aplica-theme-engine.config.mjs` na raiz do projeto, separado das configs por marca.

### `generation.colorText` (desde 3.6.0)

Controla a geração do token `txt` — a quarta propriedade no contrato de cor (`background / txtOn / border / txt`):

```javascript
import { defineThemeEngineConfig } from '@aplica/aplica-theme-engine/config';

export default defineThemeEngineConfig({
  generation: {
    colorText: {
      generateTxt: true,
      txtBaseColorLevel: 140,
      fallbackBaseColorLevel: 160,
      textExposure: ['feedback'],
    }
  },
  paths: { /* seus paths existentes */ }
});
```

| Campo | Padrão | Descrição |
|-------|--------|-----------|
| `generateTxt` | `false` | Ativa geração de `txt` em todas as camadas de cor |
| `txtBaseColorLevel` | `140` | Nível de paleta para começar a procurar uma cor `txt` acessível |
| `fallbackBaseColorLevel` | `160` | Nível de fallback quando `txtBaseColorLevel` não passa no contraste |
| `textExposure` | `['feedback']` | Quais famílias recebem aliases planos `foundation.txt.*`. Adicione `'interfaceFunction'` ou `'product'` conforme necessário |

> `txtBaseColorLevel` também pode ser sobrescrito por marca em `options.txtBaseColorLevel`.

Veja o [guia de configuração](../04-theme-engine/03-configuration-guide.pt-br.md) e o [token txt](../02-token-layers/07-txt-token.md) para o contrato completo.

---

## Convenção de nomenclatura

Nomes de arquivos de config de marca e o campo `name` precisam usar o mesmo formato de identificador que em `themes.config.json`:

```
themes.config.json → "minha-marca"
config/minha-marca.config.mjs → name: 'minha-marca'
```

Underscores e hífens são ambos válidos, mas precisam ser consistentes nas três referências.

---

## Após mudar a configuração

Execute o pipeline completo para propagar as mudanças:

```bash
npm run tokens:build
```

Ou passo a passo se quiser inspecionar o output intermediário:

```bash
npm run tokens:themes      # reprocessar cores
npm run tokens:dimension   # se a config de dimensão mudou
npm run tokens:sync        # propagar referências
npm run tokens:foundations # reconstruir aliases de foundation
npm run tokens:build:all   # transformar para dist/
```
