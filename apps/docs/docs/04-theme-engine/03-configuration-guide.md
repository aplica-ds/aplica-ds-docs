---
title: "Guia de Configuração de Temas"
lang: pt-BR
---

# Guia de Configuração de Temas

## Premissa

No Aplica DS, **toda decisão visual começa em configuração**. Cada marca é definida em um arquivo `.config.mjs` — não no Figma, não em JSON manual. O engine lê essa configuração e gera automaticamente todos os tokens para cada combinação de mode, surface e dimension.

Este guia cobre como criar e configurar temas de marca e foundations usando o pacote `@aplica/aplica-theme-engine`.

---

## Visão Geral: Temas vs Foundations

Esses dois conceitos têm responsabilidades distintas e se complementam:

| Conceito | O que define | Onde fica | O que gera |
|----------|-------------|-----------|------------|
| **Tema** | Identidade visual: cores, tipografia, gradientes | `theme-engine/config/<nome>.config.mjs` | `data/brand/<nome>/` com paletas decompostas |
| **Foundation** | Aliases para os tokens semânticos | `theme-engine/config/foundations/<nome>.config.mjs` | `data/foundation/<nome>/` com tokens de consumo |

Um tema pode ter múltiplas foundations, mas cada tema é vinculado a **uma foundation** no build. A foundation expõe os tokens com nomes simples (`foundation.bg.primary`, `foundation.spacing.medium`) que apontam para a camada semântica do tema configurado.

---

## Estrutura do Config de Tema

Os arquivos de config de marca usam `defineThemeEngineConfig` do pacote:

```javascript
// theme-engine/config/minha-marca.config.mjs
import { defineThemeEngineConfig } from '@aplica/aplica-theme-engine/config';

export default defineThemeEngineConfig({
  // ─────────── OBRIGATÓRIO ───────────
  name: 'minha_marca',          // ID do tema; define o nome da pasta em data/brand/

  colors: {                      // Todas as cores hex usadas pelo tema
    brand_principal:  '#E7398A',
    brand_secundaria: '#38C2D0',
    brand_terciaria:  '#8F58BD',
    acao_primaria:    '#C40145',
    acao_secundaria:  '#1872A6',
    acao_link:        '#FF0F80',
    // ... feedback e product (ver seção abaixo)
  },

  mapping: {                     // Mapeia conceitos semânticos → chaves de cores
    brand: {
      first:  'brand_principal',
      second: 'brand_secundaria',
      third:  'brand_terciaria'
    },
    interface: {
      function: {
        primary:   'acao_primaria',
        secondary: 'acao_secundaria',
        link:      'acao_link'
      },
      feedback: {
        info_default:    'feedback_info',
        info_secondary:  'feedback_info_dark',
        success_default: 'feedback_success',
        // ... warning, danger
      }
    },
    product: {
      promo_default:   'produto_promo',
      promo_secondary: 'produto_promo_alt',
      // ... cashback, premium
    }
  },

  typography: {                  // Famílias e pesos de fonte
    fontFamilies: {
      main:    'Inter',
      content: 'Inter',
      display: 'Inter',
      code:    'Fira Code'
    },
    weights: {
      main: {
        light:    { normal: 300, italic: 300 },
        regular:  { normal: 400, italic: 400 },
        semibold: { normal: 600, italic: 600 },
        bold:     { normal: 700, italic: 700 },
        black:    { normal: 900, italic: 900 }
      }
      // content, display, code têm a mesma estrutura
    }
  },

  // ─────────── OPCIONAL ───────────
  options:   { /* ver seção de opções */ },
  gradients: { /* ver seção de gradientes */ }
});
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
      info_default:      'info_azul',
      info_secondary:    'info_azul_sat',
      success_default:   'ok_verde',
      success_secondary: 'ok_verde_sat',
      warning_default:   'aviso_amber',
      warning_secondary: 'aviso_sat',
      danger_default:    'erro_vermelho',
      danger_secondary:  'erro_sat'
    }
  }
}
```

### Cores de Product

Mesma lógica: `default` + `secondary` por item. O schema padrão inclui `promo`, `cashback` e `premium`:

```javascript
colors: {
  promo_cor:    '#6BC200',
  promo_alt:    '#D2FD9D',
  cashback_cor: '#FFBB00',
  cashback_alt: '#FFF94F',
  premium_cor:  '#B200AF',
  premium_alt:  '#EBC2DD'
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

> **Lembre-se do custo:** Cada item de product gera dezenas de tokens por camada por tema. Antes de adicionar um item novo, verifique se feedback ou brand existentes não resolvem o caso. Veja [01-colors.pt-br.md](../03-visual-foundations/01-colors.pt-br.md#product) para o racional completo.

---

## Opções de Configuração

A chave `options` controla o comportamento do engine para esse tema:

### Estratégias de texto (`txtOnStrategy`)

| Valor | Comportamento |
|-------|--------------|
| `'high-contrast'` (padrão) | Sempre preto ou branco — máximo contraste |
| `'brand-tint'` | Usa o tom da paleta que passa WCAG — mantém cor de marca |
| `'custom-tint'` | Cor fixa configurada, com fallback se falhar WCAG |

```javascript
options: {
  txtOnStrategy: 'brand-tint',

  // Apenas para 'custom-tint':
  txtOnCustomTint: {
    light:    '#1a1a2e',         // texto sobre superfícies claras
    dark:     '#f0f0ff',         // texto sobre superfícies escuras
    fallback: 'high-contrast'    // fallback se a cor não passar WCAG
  }
}
```

### Outras opções relevantes

| Propriedade | Padrão | Descrição |
|-------------|--------|-----------|
| `darkModeChroma` | `0.85` | Fator de saturação no dark mode (0.7 = mais suave, 1.0 = igual ao light) |
| `accessibilityLevel` | `'AA'` | Nível WCAG mínimo: `'AA'` (4.5:1) ou `'AAA'` (7:1) |
| `acceptAALevelFallback` | `true` | Ao visar AAA, aceita AA (4.5:1) se AAA não puder ser atingido |
| `includePrimitives` | `false` | Gera `_primitive_theme.json` — desabilitado por padrão desde 3.6.3; habilitando adiciona variáveis primitivas do Figma |
| `uiTokens` | `false` | Gera `_ui.json` com tokens UI com escopo de componente |
| `borderOffset.palette` | `10` | Distância da borda em relação ao surface (escala 10–190) |
| `borderOffset.neutrals` | `1` | Passos de distância na escala de neutrals |
| `txtBaseColorLevel` | padrão do workspace | Nível de paleta inicial para busca do token `txt` neste tema (sobrescreve `generation.colorText.txtBaseColorLevel` do workspace) |

---

## Workspace Config: generation.colorText (desde 3.6.0)

A geração do token `txt` e dos aliases de texto legível é controlada no **nível do workspace** em `aplica-theme-engine.config.mjs`, não por tema. Isso garante que todos os temas compartilhem o mesmo contrato de texto:

```javascript
import { defineThemeEngineConfig } from '@aplica/aplica-theme-engine/config';

export default defineThemeEngineConfig({
  generation: {
    colorText: {
      generateTxt: true,                  // Habilita a propriedade txt (default: false para compatibilidade)
      txtBaseColorLevel: 140,             // Nível de paleta inicial para txt (sobe se necessário para WCAG)
      fallbackBaseColorLevel: 160,        // Nível de fallback secundário
      textExposure: ['feedback'],         // Quais famílias recebem aliases foundation.txt.*
                                          // Opções: 'feedback', 'interfaceFunction', 'product'
    }
  },
  paths: {
    configDir:       './theme-engine/config',
    globalConfigDir: './theme-engine/config/global',
    foundationsDir:  './theme-engine/config/foundations',
    dataDir:         './data',
    distDir:         './dist'
  }
});
```

### Valores de textExposure

| Valor | Aliases de foundation gerados |
|-------|-------------------------------|
| `'feedback'` | `foundation.txt.info`, `.success`, `.warning`, `.danger` (padrão) |
| `'interfaceFunction'` | `foundation.txt.primary`, `.secondary`, `.link` |
| `'product'` | Itens de product por tema: `foundation.txt.promo`, `.cashback`, etc. |

> **Breaking change (3.6.0 → 3.6.1):** Na 3.6.0, algumas opções relacionadas a `txt` ficavam por tema. Na 3.6.1, foram movidas para `generation.colorText` no workspace config. Se estiver atualizando da 3.6.0, mova `generateTxt`, `txtBaseColorLevel`, `fallbackBaseColorLevel` e `textExposure` dos configs de tema individuais para o workspace config.

Veja [07-txt-token.md](../02-token-layers/07-txt-token.md) para a documentação completa do contrato txt.

---

## Decomposição de Interação (desde 3.9.0)

Por padrão, `interface.function` e `interface.feedback` geram estados de interação (`normal`, `action`, `active`, `focus`) usando a lógica de níveis de paleta do engine. A versão 3.9.0 introduz controle autoral sobre como esses estados são derivados.

### Modo de decomposição

Configure `options.interaction.decomposition.method` no config do tema:

| Valor | Comportamento |
|-------|--------------|
| `'system-scale'` (padrão) | Comportamento legado, agora nomeado explicitamente. Níveis de paleta controlam os estados (ex.: `active: 120`). Todos os temas existentes usam isso. |
| `'dilution'` | Novo. Os estados de cor movem a cor base em direção ao branco ou preto sem rotacionar o hue. Fatores controlam a intensidade (ex.: `active: 0.8`, `action: 1.2`). Valores acima de `1.0` invertem a direção. |

```javascript
options: {
  interaction: {
    decomposition: {
      method: 'dilution',
      // direction: 'high'  // 'high' = mover para mais escuro (padrão); 'low' = mais claro
    },
    surfaces: {
      solid: {
        levels: {
          // dilution: fatores (1.0 = cor base, <1.0 = menos diluído, >1.0 = inverte direção)
          action: 1.2,
          active: 0.8,
          focus:  0.3,
        }
      },
      ghost: {
        enabled: true,
        levels: {
          // ghost usa níveis de paleta mesmo em modo dilution
          action: 40,
          active: 60,
          focus:  20,
        }
      }
    }
  }
}
```

`normal` sempre permanece na cor base autoral — nenhum override é esperado para ele.

### Compatibilidade retroativa

- Temas sem config `interaction` geram exatamente como antes — `system-scale` é o padrão implícito.
- `options.interfaceFunctionPaletteLevels` legado ainda funciona e é mapeado internamente para `options.interaction.surfaces.solid.levels`.
- Estruturas existentes de `background`, `txtOn`, `border` e `txt` permanecem inalteradas.

### Destinos de dilution (desde 3.9.0 / 3.13.1)

Ao usar `method: 'dilution'`, a propriedade `target` controla para qual destino os estados se diluem:

| Valor | Comportamento |
|-------|--------------|
| `'canvas'` (padrão para dilution) | Move em direção ao canvas resolvido para o quadrante ativo — clareia em canvases claros, escurece em canvases escuros. `fallback` controla o comportamento quando nenhum canvas é resolvível. |
| `'anchor'` (desde 3.13.1) | Move em direção a uma âncora cromática configurável. Os estados se deslocam em hue em direção à âncora em vez de ao branco/preto. |

#### Canvas-aware dilution (desde 3.9.0)

```javascript
options: {
  interaction: {
    decomposition: {
      method: 'dilution',
      target: 'canvas',            // padrão quando method é 'dilution'
      fallback: 'ambient-neutral', // 'legacy' | 'ambient-neutral'
    }
  }
}
```

#### Anchor-aware dilution (desde 3.13.1–3.13.3)

```javascript
options: {
  interaction: {
    decomposition: {
      method: 'dilution',
      target: 'anchor',
      anchor: {
        source: 'palette',    // 'palette' | 'hex' | 'token'
        // hex: '#7C3AED',   // obrigatório quando source: 'hex'
        // token: 'brand.branding.first.default.background', // obrigatório quando source: 'token'
        canvasAware: true,    // âncora clareia em canvases claros, escurece em canvases escuros
        canvasMix:   0.2      // 0.0–1.0 — intensidade da resposta da âncora ao canvas
      }
    }
  }
}
```

| `anchor.source` | Descrição |
|----------------|-----------|
| `'palette'` | Família de paleta atual da marca — permanece dentro da mesma família de cores |
| `'hex'` | Destino cromático fixo declarado em `anchor.hex` |
| `'token'` | Outra escala gerada declarada em `anchor.token` |

`anchor.canvasAware` + `anchor.canvasMix` permitem que a âncora mantenha seu hue próprio enquanto ainda clareia em canvases claros e escurece em canvases escuros. Use `target: 'anchor'` para estados secundários mais brilhantes ou mais cromáticos que devem permanecer sistêmicos sem overrides manuais.

> A configuração de `target` / `anchor` se aplica por tema, por surface e por grupo — qualquer branch que use `method: 'dilution'` pode configurar seu destino de forma independente.

---

### Configuração por grupo (desde 3.12.0)

Quando `function` e `feedback` precisam de comportamento de decomposição diferente, declare-os em `options.interaction.groups`:

```javascript
options: {
  interaction: {
    decomposition: { method: 'system-scale' }, // padrão do tema
    groups: {
      function: {
        decomposition: { method: 'dilution' }, // override apenas para function
        surfaces: {
          solid: {
            levels: { action: 1.2, active: 0.8, focus: 0.3 }
          }
        }
      },
      feedback: {
        // herda o padrão do tema (system-scale)
        surfaces: {
          solid: {
            levels: { action: 80, active: 120, focus: 50 }
          }
        }
      }
    }
  }
}
```

Ordem de resolução: padrão do tema → nível de surface → nível de grupo → nível grupo-surface (cada camada sobrescreve a anterior).

> **`groups.{function|feedback}.levels` não é suportado.** Declare valores de estado em `groups.{function|feedback}.surfaces.solid.levels` ou `.ghost.levels`.

### Regra de consistência do workspace

Todos os temas no mesmo workspace **devem concordar** em `options.interaction.legacyStructure`:

```javascript
options: {
  interaction: {
    legacyStructure: false,  // deve ser idêntico em todos os temas do workspace
  }
}
```

| Valor | Forma pública do output |
|-------|------------------------|
| `true` (padrão) | Forma pública anterior — grupos `function` e `feedback` como antes |
| `false` | Grupos `solid` e `ghost` explícitos gerados em `brand`, `mode`, `surface` e `semantic` |

> **Workspaces mistos quebram.** `mode`, `surface` e `semantic` são camadas compartilhadas — se alguns temas tiverem `legacyStructure: false` e outros não, essas camadas ficam inconsistentes. Defina esse flag de forma idêntica em todos os configs de tema.

### Adaptação de base por quadrante (desde 3.13.4)

Por padrão, superfícies `normal` de interação e superfícies `default` de produto são **fixas** na cor base autoral, independente do quadrante ativo (light/dark + positive/negative). Ative a adaptação por quadrante por tema:

```javascript
options: {
  baseAdaptation: true  // interaction normal + product default respondem ao quadrante ativo
}
```

Com `baseAdaptation: true`, o engine ajusta as superfícies `normal` e `default` com base no quadrante resolvido — clareando em light-positive, escurecendo em dark-negative, etc.

> **Use com parcimônia.** A regra de base fixa é intencional: `normal` é sempre a cor de marca autoral, dando aos designers um ponto de referência estável. `baseAdaptation` é uma válvula de escape para marcas que explicitamente precisam que essas superfícies se adaptem ao contexto. Cada tema pode optar de forma independente — esta opção não precisa ser consistente entre os temas do workspace.

---

## Sobreposições (Overrides)

Overrides permitem substituir valores gerados pelo engine em casos específicos:

```javascript
overrides: {
  // Substituir grayscale (temperatura quente)
  grayscale: {
    light: {
      surface: { '5': '#faf8f5', '10': '#f5f2ee', '140': '#1a1814' },
      txtOn:   { /* ... */ },
      border:  { /* ... */ }
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

> **Regra:** Overrides são a última alternativa após esgotar as opções semânticas padrão. Valide com `theme-engine sync:architecture:test` após aplicar overrides para detectar incompatibilidades de referência antes de um build completo.

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
    third:  { /* ... */ }
  }
}
```

Quando omitido, o engine usa um gradiente sólido como stub. Para desabilitar gradientes no projeto inteiro, configure `global.gradients: false` no `themes.config.json`.

> **Ordem de build com gradientes:** Os gradientes só aparecem no output final quando `data/semantic/default.json` tem a seção `semantic.color.gradient` — criada pelo `sync:architecture`. Sempre rode `npm run tokens:build` (pipeline completo) em vez de `tokens:build:all` isolado quando gradientes estiverem habilitados.

---

## Registrar o Tema no Build

Após criar o `.config.mjs`, registre o tema no arquivo central de configuração:

```json
// theme-engine/config/global/themes.config.json
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
npm run tokens:build
```

Executa automaticamente na ordem correta:
1. `ensure:data` — garante que a estrutura de `data/` existe
2. `dimension:generate` — gera escala dimensional
3. `themes:generate` — decompõe cores e gera `data/brand/<tema>/`
4. `sync:architecture` — propaga referências para mode, surface, semantic e foundation
5. `foundations:generate` — gera aliases Foundation
6. `build:all` — Style Dictionary → `dist/` (JSON, CSS, ESM, CJS, TypeScript)

### Comandos individuais úteis

| Comando | Quando usar |
|---------|-------------|
| `npm run tokens:themes` | Após alterar cores ou mapeamento de um tema |
| `theme-engine themes:single --config=minha-marca` | Gerar apenas um tema específico |
| `npm run tokens:sync` | Após alterar o schema de arquitetura |
| `npm run tokens:foundations` | Após alterar um config de foundation |
| `npm run tokens:build:all` | Apenas o build Style Dictionary (quando `data/` já está atualizado) |
| `theme-engine validate:data` | Verificar integridade de `data/` antes de buildar |

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

1. Crie `theme-engine/config/foundations/minha-foundation.config.mjs` (baseie-se em `engine.config.mjs`)
2. Defina `name`, `outputPath`, `structure` (seções e itens) e `references` (mapeamento para Semantic)
3. Execute `npm run tokens:foundations`
4. Vincule ao tema em `themes.config.json`: `"foundation": { "brand": "minha-foundation", ... }`

---

## Referência Rápida

| Tarefa | Ação |
|--------|------|
| Criar novo tema | Adicionar `.config.mjs` em `theme-engine/config/` + registrar em `themes.config.json` + `npm run tokens:build` |
| Alterar cores de um tema | Editar o `.config.mjs` do tema + `npm run tokens:themes` + `npm run tokens:build:all` |
| Alterar foundation | Editar `.config.mjs` em `theme-engine/config/foundations/` + `npm run tokens:foundations` + `npm run tokens:build:all` |
| Alterar schema (feedback/product) | Editar override de schema em `theme-engine/schemas/` + `npm run tokens:sync` + rebuild |
| Gradientes não aparecem no output | Rodar `npm run tokens:sync` antes de `tokens:build:all` |
| Verificar sem gravar | `theme-engine sync:architecture:test` |
| Ver schema atual | `theme-engine sync:architecture:schema` |

---

## Referências

- O que é o Theme Engine: [01-what-is-theme-engine.pt-br.md](./01-what-is-theme-engine.pt-br.md)
- Pipeline de build detalhado: [04-build-pipeline.pt-br.md](./04-build-pipeline.pt-br.md)
- Formatos de output: [05-output-formats.pt-br.md](./05-output-formats.pt-br.md)
- Quick start de engenharia: [09-engineering/01-quick-start.pt-br.md](../09-engineering/01-quick-start.pt-br.md)
- Estrutura do workspace: [09-engineering/02-workspace-structure.pt-br.md](../09-engineering/02-workspace-structure.pt-br.md)
- Referência completa de configuração: [09-engineering/03-theme-configuration.pt-br.md](../09-engineering/03-theme-configuration.pt-br.md)
- Referência de CLI: [09-engineering/05-cli-reference.pt-br.md](../09-engineering/05-cli-reference.pt-br.md)
- Sistema de cores: [01-colors.pt-br.md](../03-visual-foundations/01-colors.pt-br.md)
- Camada Foundation: [05-foundation-layer.pt-br.md](../02-token-layers/05-foundation-layer.pt-br.md)
