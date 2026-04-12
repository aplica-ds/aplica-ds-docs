---
title: "Guia de Configuração de Temas"
lang: pt-BR
---

# Guia de Configuração de Temas

## Premissa

No Aplica Tokens Theme Engine, **toda decisão visual começa em código**. Cada tema é definido em um arquivo de configuração (`*.config.mjs`) — não no Figma, não em JSON manual. O engine lê essa configuração e gera automaticamente todos os tokens para cada combinação de mode, surface e dimension.

Este guia cobre como criar e configurar temas e foundations do zero.

---

## Visão Geral: Temas vs Foundations

Esses dois conceitos têm responsabilidades distintas e se complementam:

| Conceito | O que define | Onde fica | O que gera |
|----------|-------------|-----------|------------|
| **Tema** | Identidade visual: cores, tipografia, gradientes | `dynamic-themes/themes/config/{nome}.config.mjs` | `data/brand/{nome}/` com paletas decompostas |
| **Foundation** | Aliases para os tokens semânticos | `dynamic-themes/themes/config/foundations/{nome}.config.mjs` | `data/foundation/{nome}/` com tokens de consumo |

Um tema pode ter múltiplas foundations, mas cada tema é vinculado a **uma foundation** no build. A foundation expõe os tokens com nomes simples (`foundation.bg.primary`, `foundation.spacing.medium`) que apontam para o Semantic do tema configurado.

---

## Estrutura do Config de Tema

O arquivo de configuração de tema tem esta estrutura:

```javascript
// dynamic-themes/themes/config/minha-marca.config.mjs
export default {
  // ─────────── OBRIGATÓRIO ───────────
  name: 'minha_marca',          // ID do tema; define o nome da pasta em data/brand/

  colors: {                      // Todas as cores hex usadas pelo tema
    brand_principal: '#E7398A',
    brand_secundaria: '#38C2D0',
    brand_terciaria: '#8F58BD',
    acao_primaria: '#C40145',
    acao_secundaria: '#1872A6',
    acao_link: '#FF0F80',
    // ... feedback e product (ver seção abaixo)
  },

  mapping: {                     // Mapeia conceitos semânticos → chaves de cores
    brand: {
      first: 'brand_principal',
      second: 'brand_secundaria',
      third: 'brand_terciaria'
    },
    interface: {
      function: {
        primary: 'acao_primaria',
        secondary: 'acao_secundaria',
        link: 'acao_link'
      },
      feedback: {
        info_default:    'feedback_info',
        info_secondary:  'feedback_info_dark',
        success_default: 'feedback_success',
        // ... warning, danger
      }
    },
    product: {
      promo_default:    'produto_promo',
      promo_secondary:  'produto_promo_alt',
      // ... cashback, premium
    }
  },

  typography: {                  // Famílias e pesos de fonte
    fontFamilies: {
      main: 'Inter',
      content: 'Inter',
      display: 'Inter',
      code: 'Fira Code'
    },
    weights: {
      main: {
        light: { normal: 300, italic: 300 },
        regular: { normal: 400, italic: 400 },
        semibold: { normal: 600, italic: 600 },
        bold: { normal: 700, italic: 700 },
        black: { normal: 900, italic: 900 }
      }
      // content, display, code têm a mesma estrutura
    }
  },

  // ─────────── OPCIONAL ───────────
  options: { /* ver seção de opções */ },
  gradients: { /* ver seção de gradientes */ }
}
```

---

## Cores e Mapeamento Semântico

A separação entre `colors` e `mapping` é deliberada:

- **`colors`** — um dicionário simples de nomes livres para valores hex. O nome é interno, pode ser qualquer string descritiva.
- **`mapping`** — conecta esses nomes livres aos **papéis semânticos** fixos do sistema.

Essa separação permite ter vários temas compartilhando os mesmos papéis semânticos com cores completamente diferentes, sem duplicar a lógica de mapeamento.

### Cores de Feedback

Cada tipo de feedback tem uma variante `default` (mais suave, para backgrounds) e `secondary` (mais saturada, para bordas e ícones):

```javascript
colors: {
  // Feedback — suave para bg, saturado para borda/ícone
  info_azul:     '#CBF6ED',   // default: suave
  info_azul_sat: '#1872A6',   // secondary: saturado
  ok_verde:      '#D7F6CB',
  ok_verde_sat:  '#86C46D',
  aviso_amber:   '#FEE6C2',
  aviso_sat:     '#FDB750',
  erro_vermelho: '#F9C8C8',
  erro_sat:      '#EE5A5A',
},

mapping: {
  interface: {
    feedback: {
      info_default:    'info_azul',
      info_secondary:  'info_azul_sat',
      success_default: 'ok_verde',
      success_secondary: 'ok_verde_sat',
      warning_default: 'aviso_amber',
      warning_secondary: 'aviso_sat',
      danger_default:  'erro_vermelho',
      danger_secondary: 'erro_sat'
    }
  }
}
```

### Cores de Product

Mesma lógica: `default` + `secondary` por item. O schema padrão inclui `promo`, `cashback` e `premium`:

```javascript
colors: {
  promo_cor: '#6BC200',
  promo_alt: '#D2FD9D',
  cashback_cor: '#FFBB00',
  cashback_alt: '#FFF94F',
  premium_cor: '#B200AF',
  premium_alt: '#EBC2DD'
},

mapping: {
  product: {
    promo_default:      'promo_cor',
    promo_secondary:    'promo_alt',
    cashback_default:   'cashback_cor',
    cashback_secondary: 'cashback_alt',
    premium_default:    'premium_cor',
    premium_secondary:  'premium_alt'
  }
}
```

> **Lembre-se do custo:** Cada item de product gera dezenas de tokens por camada por tema. Antes de adicionar um item novo, verifique se feedback ou brand existentes não resolvem o caso. Veja [01-colors.md](../03-visual-foundations/01-colors.md#product) para o racional completo.

---

## Opções de Configuração

A chave `options` controla o comportamento do engine para esse tema:

### Estratégias de texto (`txtOnStrategy`)

| Valor | Comportamento |
|-------|--------------|
| `'high-contrast'` (padrão) | Sempre preto ou branco — máximo contraste |
| `'brand-tint'` | Usa o tom da palette que passa WCAG — mantém cor de marca |
| `'custom-tint'` | Cor fixa configurada, com fallback se falhar WCAG |

```javascript
options: {
  txtOnStrategy: 'brand-tint',

  // Apenas para 'custom-tint':
  txtOnCustomTint: {
    light: '#1a1a2e',    // texto sobre superfícies claras
    dark: '#f0f0ff',     // texto sobre superfícies escuras
    fallback: 'high-contrast'  // fallback se a cor não passar WCAG
  }
}
```

### Outras opções relevantes

| Propriedade | Padrão | Descrição |
|-------------|--------|-----------|
| `darkModeChroma` | `0.85` | Fator de saturação no dark mode (0.7 = mais suave, 1.0 = igual ao light) |
| `accessibilityLevel` | `'AA'` | Nível WCAG mínimo: `'AA'` (4.5:1) ou `'AAA'` (7:1) |
| `strictValidation` | `false` | Se `true`, falha o build quando o contraste não passa |
| `includePrimitives` | `true` | Gera `_primitive_theme.json` — desabilitar reduz memória no Figma |
| `borderOffset.palette` | `10` | Distância da borda em relação ao surface (escala 10–190) |
| `borderOffset.neutrals` | `1` | Passos de distância na escala de neutrals |

---

## Sobreposições (Overrides)

Overrides permitem substituir valores gerados pelo engine em casos específicos:

```javascript
overrides: {
  // Substituir grayscale (temperatura quente)
  grayscale: {
    light: {
      surface: { '5': '#faf8f5', '10': '#f5f2ee', '140': '#1a1814' },
      txtOn: { /* ... */ },
      border: { /* ... */ }
    },
    dark: { /* mesma estrutura */ }
  },

  // Substituir neutrals de uma cor específica
  neutrals: {
    brand_principal: {
      light: { surface: { '5': '#fdf4f9' } },
      dark:  { surface: { '5': '#1a0d14' } }
    }
  }
}
```

> **Regra:** Overrides são a última alternativa após esgotar as opções semânticas padrão. Leia o guia de boas práticas antes de usar: OVERRIDE-BEST-PRACTICES.md.

---

## Gradientes

Gradientes são controlados globalmente em `themes.config.json` e podem ser customizados por tema:

```javascript
// No config do tema — gradientes customizados por cor de marca
gradients: {
  brand: {
    first: {
      angle: 135,
      stops: [
        { position: 0, colorRef: 'brand.branding.first.lowest.background' },
        { position: 1, colorRef: 'brand.branding.first.default.background' }
      ]
    },
    second: { /* ... */ },
    third: { /* ... */ }
  }
}
```

Quando omitido, o engine usa um gradiente sólido como stub. Para desabilitar gradientes no projeto inteiro, configure `global.gradients: false` no `themes.config.json`.

> **Atenção à ordem de build com gradientes:** Os gradientes só aparecem no output final quando `data/semantic/default.json` tem a seção `semantic.color.gradient` — criada pelo `sync:architecture`, não pelo `build`. Sempre rode `npm run sync:architecture` (ou `npm run build:themes`) antes do build quando gradientes estiverem habilitados.

---

## Registrar o Tema no Build

Após criar o `.config.mjs`, registre o tema no arquivo central:

```json
// dynamic-themes/themes/config/global/themes.config.json
{
  "themes": {
    "minha_marca": {
      "includePrimitives": true,
      "foundation": {
        "brand": "engine",
        "files": [
          "default.json",
          "styles/typography_styles.json",
          "styles/elevation_styles.json"
        ]
      }
    }
  }
}
```

**Regra crítica:** A chave em `themes` deve ser idêntica ao `name` definido no config do tema e ao nome da pasta gerada em `data/brand/`.

---

## Pipeline de Geração

### Pipeline completo (recomendado)

```bash
npm run build:themes
```

Executa automaticamente na ordem correta:
1. `ensure:data` — garante estrutura de `data/`
2. `dimension:generate` — gera escala dimensional
3. `themes:generate` — decompõe cores e gera `data/brand/{tema}/`
4. `sync:architecture` — propaga referências para mode, surface, semantic e foundation
5. `foundations:generate` — gera aliases Foundation
6. `build` — Style Dictionary → `dist/` (JSON, CSS, ESM, CJS, TypeScript)

### Comandos individuais úteis

| Comando | Quando usar |
|---------|-------------|
| `npm run themes:generate` | Após alterar cores ou mapeamento de um tema |
| `npm run themes:single --config=minha-marca` | Gerar apenas um tema específico |
| `npm run sync:architecture` | Após alterar o schema de arquitetura |
| `npm run foundations:generate` | Após alterar um config de foundation |
| `npm run foundations:validate data/foundation/engine/default.json` | Verificar integridade da foundation |
| `npm run build` | Apenas o build Style Dictionary (quando `data/` já está atualizado) |

### Quando rodar `sync:architecture`

O sync propaga referências entre camadas. Rode quando:
- Alterar o schema de arquitetura (adicionar/remover items de feedback ou product)
- Adicionar um novo tema e precisar de referências semânticas atualizadas
- Gradientes estão habilitados e você rodou `themes:generate`
- Após pull de mudanças que alteraram a estrutura do schema

> **Nunca edite manualmente** `data/mode/*.json`, `data/surface/*.json`, `data/semantic/default.json` ou `data/foundation/engine/default.json`. O sync sobrescreve qualquer edição manual nesses arquivos.

---

## Adicionando uma Nova Foundation

Quando o conjunto padrão de aliases não é suficiente para um consumidor específico:

1. Crie `dynamic-themes/themes/config/foundations/minha-foundation.config.mjs` (baseie-se em `engine.config.mjs`)
2. Defina `name`, `outputPath`, `structure` (seções e itens) e `references` (mapeamento para Semantic)
3. Execute `npm run foundations:generate`
4. Vincule ao tema em `themes.config.json`: `"foundation": { "brand": "minha-foundation", ... }`

---

## Referência Rápida

| Tarefa | Ação |
|--------|------|
| Criar novo tema | Adicionar `.config.mjs` em `themes/config/` + registrar em `themes.config.json` + `npm run build:themes` |
| Alterar cores de um tema | Editar o `.config.mjs` do tema + `npm run themes:generate` + `npm run build` |
| Alterar foundation | Editar `.config.mjs` em `foundations/` + `npm run foundations:generate` + `npm run build` |
| Alterar schema (feedback/product) | Editar `architecture-schema.mjs` + `npm run sync:architecture` + rebuild |
| Gradientes não aparecem no output | Rodar `npm run sync:architecture` antes do `build` |
| Verificar sem gravar | `npm run sync:architecture:test` |
| Ver schema atual | `npm run sync:architecture:schema` |

---

## Referências

- O que é o Theme Engine: [01-what-is-theme-engine.md](./01-what-is-theme-engine.md)
- Pipeline de build detalhado: [04-build-pipeline.md](./04-build-pipeline.md)
- Formatos de output: [05-output-formats.md](./05-output-formats.md)
- Referência completa do config: THEME_CONFIG_REFERENCE.md
- Boas práticas de overrides: OVERRIDE-BEST-PRACTICES.md
- Exemplo de config: aplica-joy.config.mjs
- Sistema de cores: [01-colors.md](../03-visual-foundations/01-colors.md)
- Camada Foundation: [05-foundation-layer.md](../02-token-layers/05-foundation-layer.md)
