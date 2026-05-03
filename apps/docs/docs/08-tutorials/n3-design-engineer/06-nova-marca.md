---
level: n3
id: N3-06
title: "Adicionando uma nova marca ao engine"
prerequisites: ["N2-04", "N3-04"]
duration: "20 min"
lang: pt-BR
---

# N3-06 · Adicionando uma nova marca ao engine

## Contexto

Tudo que você aprendeu até aqui converge neste tutorial. Você vai criar um tema completo — do briefing ao CSS no browser — sem pular etapas.

O exercício usa uma marca fictícia: **Verdana** — plataforma de crédito verde para pequenas empresas. Identidade: institucional, responsável, sustentável. Paleta: verde como cor de ação, âmbar como destaque secundário.

---

## O que você vai construir

Ao fim deste tutorial você terá:

1. `verdana.config.mjs` — config completo do tema
2. Tema registrado em `themes.config.json`
3. Build executado com sucesso — tokens em `dist/`
4. Tokens verificados no CSS output
5. Sincronização com o Figma descrita

---

## Passo 1 — Criar o arquivo de config

Crie o arquivo em:

```
dynamic-themes/themes/config/verdana.config.mjs
```

**Construa em estágios, não tudo de uma vez.** As seções abaixo vão do mínimo viável ao config completo. Cada estágio já gera tokens válidos — adicione o próximo apenas quando o anterior compilar limpo.

### 1.0 — Config mínima (gera tokens válidos imediatamente)

Comece aqui. Isso é o mínimo que um config precisa para produzir um build completo:

```javascript
export default {
  name: 'verdana',

  colors: {
    brand_verde:     '#16A34A',
    brand_pedra:     '#57534E',
    brand_ambar:     '#D97706',
    acao_primaria:   '#15803D',
    acao_secundaria: '#78350F',
    acao_link:       '#166534',
    info_claro:    '#DBEAFE', info_sat:   '#1D4ED8',
    ok_claro:      '#DCFCE7', ok_sat:     '#15803D',
    aviso_claro:   '#FEF3C7', aviso_sat:  '#B45309',
    erro_claro:    '#FEE2E2', erro_sat:   '#DC2626',
  },

  mapping: {
    brand: { first: 'brand_verde', second: 'brand_pedra', third: 'brand_ambar' },
    interface: {
      function: { primary: 'acao_primaria', secondary: 'acao_secundaria', link: 'acao_link' },
      feedback: {
        info_default: 'info_claro', info_secondary: 'info_sat',
        success_default: 'ok_claro', success_secondary: 'ok_sat',
        warning_default: 'aviso_claro', warning_secondary: 'aviso_sat',
        danger_default: 'erro_claro', danger_secondary: 'erro_sat',
      }
    }
  },

  typography: {
    fontFamilies: { main: 'Inter', content: 'Inter', display: 'DM Sans', code: 'JetBrains Mono' },
    weights: {
      main: {
        regular: { normal: 400, italic: 400 }, semibold: { normal: 600, italic: 600 },
        bold: { normal: 700, italic: 700 }
      },
      display: { regular: { normal: 400, italic: 400 }, bold: { normal: 700, italic: 700 } },
      code: { regular: { normal: 400, italic: 400 } }
    }
  }
}
```

Rode `npm run build:themes` agora. Se passar, o tema já é completamente funcional nos quatro quadrantes (light-positive, light-negative, dark-positive, dark-negative). Tudo depois disso é refinamento.

### 1.1 — Adicionar cores de produto

Adicione as cores específicas do produto ao bloco `colors` e mapeie-as em `mapping`. Adicione apenas o que a marca realmente precisa — Verdana tem um conceito de produto justificado: o badge "Crédito Verde".

```javascript
export default {
  name: 'verdana',

  colors: {
    // ── Brand ──────────────────────────────────────────
    brand_verde:   '#16A34A',
    brand_pedra:   '#57534E',
    brand_ambar:   '#D97706',

    // ── Interface Function ─────────────────────────────
    acao_primaria:   '#15803D',
    acao_secundaria: '#78350F',
    acao_link:       '#166534',

    // ── Feedback ──────────────────────────────────────
    // default: tom suave (para backgrounds de banners/badges)
    // secondary: tom saturado (para ícones, bordas, texto)
    info_claro:  '#DBEAFE',
    info_sat:    '#1D4ED8',
    ok_claro:    '#DCFCE7',
    ok_sat:      '#15803D',   // reutiliza brand_verde — intencional
    aviso_claro: '#FEF3C7',
    aviso_sat:   '#B45309',
    erro_claro:  '#FEE2E2',
    erro_sat:    '#DC2626',

    // ── Product ───────────────────────────────────────
    eco_verde:   '#166534',   // badge "Crédito Verde"
    eco_claro:   '#DCFCE7',   // versão suave
  },

  mapping: {
    brand: {
      first:  'brand_verde',
      second: 'brand_pedra',
      third:  'brand_ambar'
    },
    interface: {
      function: {
        primary:   'acao_primaria',
        secondary: 'acao_secundaria',
        link:      'acao_link'
      },
      feedback: {
        info_default:      'info_claro',
        info_secondary:    'info_sat',
        success_default:   'ok_claro',
        success_secondary: 'ok_sat',
        warning_default:   'aviso_claro',
        warning_secondary: 'aviso_sat',
        danger_default:    'erro_claro',
        danger_secondary:  'erro_sat'
      }
    },
    product: {
      eco_default:   'eco_verde',
      eco_secondary: 'eco_claro'
    }
  },

  typography: {
    fontFamilies: {
      main:    'Inter',
      content: 'Inter',
      display: 'DM Sans',
      code:    'JetBrains Mono'
    },
    weights: {
      main: {
        light:    { normal: 300, italic: 300 },
        regular:  { normal: 400, italic: 400 },
        semibold: { normal: 600, italic: 600 },
        bold:     { normal: 700, italic: 700 },
        black:    { normal: 900, italic: 900 }
      },
      content: {
        regular:  { normal: 400, italic: 400 },
        semibold: { normal: 600, italic: 600 },
        bold:     { normal: 700, italic: 700 }
      },
      display: {
        regular: { normal: 400, italic: 400 },
        bold:    { normal: 700, italic: 700 },
        black:   { normal: 900, italic: 900 }
      },
      code: {
        regular: { normal: 400, italic: 400 },
        bold:    { normal: 700, italic: 700 }
      }
    }
  }
}
```

Rode `npm run build:themes` novamente. Os tokens de produto (`product-eco-*`) devem aparecer em `dist/`.

**Nota de design:** `ok_sat` reutiliza `brand_verde` (`#15803D`) — intencional. O verde de sucesso e o verde de marca são a mesma cor; criar distinção artificial seria errado.

### 1.2 — Adicionar opções básicas

Com o build limpo, adicione `options` para ajustar o comportamento de renderização:

```javascript
  options: {
    txtOnStrategy:      'high-contrast',  // institucional — confiança antes de expressividade
    darkModeChroma:      0.80,            // ligeiramente mais suave que padrão (0.85)
    accessibilityLevel: 'AA',
  }
```

**Por que `high-contrast`?** Marca de crédito para pequenas empresas — confiança e legibilidade têm precedência sobre expressividade cromática. `brand-tint` poderia reduzir o contraste em fundos verdes escuros.

### 1.3 — Opções avançadas (contrato de workspace)

Estas opções afetam as camadas compartilhadas de arquitetura (`mode/`, `surface/`, `semantic/`). **Todos os temas do workspace precisam concordar** — mudar apenas um tema quebra o sistema.

```javascript
  options: {
    txtOnStrategy:      'high-contrast',
    darkModeChroma:      0.80,
    accessibilityLevel: 'AA',

    // Decomposição de interação — omitir para manter o padrão (system-scale)
    // Adicionar apenas se o workspace inteiro estiver migrando para dilution ou ghost.
    // interaction: {
    //   decomposition: { method: 'dilution', target: 'canvas' },
    //   legacyStructure: false,
    // },

    // Adaptação de base por quadrante (desde 3.13.4)
    // Faz superfícies interaction.normal e product.default responderem a
    // light/dark + positive/negative. Exige opt-in de todos os temas.
    // baseAdaptation: true,
  }
```

Verdana entrega com ambos comentados — os padrões (`system-scale`, `legacyStructure: true`, sem `baseAdaptation`) são corretos para a maioria dos workspaces. Descomente apenas quando o workspace inteiro estiver pronto para migrar.

Veja [03-configuration-guide.pt-br.md](../../04-theme-engine/03-configuration-guide.md#decomposição-de-interação-desde-390) para o contrato completo sobre opções de workspace.

---

## Passo 2 — Registrar o tema

Abra `dynamic-themes/themes/config/global/themes.config.json` e adicione a entrada:

```json
{
  "themes": {
    "verdana": {
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

**Checklist antes de avançar:**

- [ ] A chave `"verdana"` é idêntica ao `name` no `.config.mjs`
- [ ] O arquivo `.config.mjs` está em `themes/config/` (não em subpasta)
- [ ] Não há vírgulas finais em JSON (causa erro silencioso em alguns parsers)

---

## Passo 3 — Executar o build

```bash
npm run build:themes
```

O comando executa os sete estágios em sequência. O output esperado na última linha de cada estágio:

```
[ensure:data]          ✓ Directories verified
[themes:generate]      ✓ verdana: palette decomposed (7 colors × 19 levels)
[dimension:generate]   ✓ Dimension scale generated (normal)
[sync:architecture]    ✓ Mode, surface, semantic, foundation synced
[foundations:generate] ✓ engine foundation styles generated
[figma:generate]       ✓ $themes.json and $metadata.json updated
[build:all]            ✓ Style Dictionary: 8 themes written to dist/
```

Se você está adicionando o tema a um projeto que já tem outros temas, o número de temas no build aumenta — isso é esperado. Cada tema gera 4 variantes (light-positive, light-negative, dark-positive, dark-negative).

### O que verificar se falhar

**"Config not found: verdana"** → O `name` no `.config.mjs` não bate com a chave em `themes.config.json`.

**"Reference not found: {theme.color.light...}"** → O `mapping` tem uma chave que não existe em `colors`. Verifique erros de digitação.

**"Missing required mapping key: interface.feedback.danger_default"** → O schema exige todos os feedbacks. Confirme que os 8 pares (4 tipos × default/secondary) estão presentes no `mapping`.

---

## Passo 4 — Preview visual do output

Antes de verificar valores de tokens brutos, use o comando de preview para confirmar que as quatro variantes de Verdana estão corretas:

```bash
theme-engine preview --build --serve
```

Abra `http://localhost:<porta>` (a CLI imprime a URL). Use o dropdown **View** para alternar entre **Detailed** (explorador em cards, padrão) e **Summary** (tabela compacta com contrast ratios — desde 3.13.0). Você deve ver:

- **light-positive / light-negative / dark-positive / dark-negative** — quatro abas ou seções
- Cores: `background`, `border`, `txtOn` e `txt` de cada família semântica em cada estado
- Tipografia: classes foundation aplicadas a texto de exemplo
- Elevação: superfícies de cards por nível de elevação

**O que verificar especificamente na Verdana:**

| Verificação | O que observar |
|-------------|---------------|
| `interface.function.primary.normal.background` | Tom verde `#15803D` — não supersaturado no dark mode |
| `txtOn` em superfícies escuras | Branco (esperado — estratégia `high-contrast`) |
| `txt` ambiente | Texto com tinta verde acessível sobre o fundo canvas |
| `product.eco.*` | Superfícies de badge verde com `txtOn` correto |

Se algo parecer errado, corrija o config e rode novamente `theme-engine preview --build`.

---

## Passo 5 — Verificar o output

Após o build, os tokens de Verdana estão em:

```
dist/
├── css/
│   ├── verdana-light-positive.css
│   ├── verdana-light-negative.css
│   ├── verdana-dark-positive.css
│   └── verdana-dark-negative.css
├── json/
│   └── verdana-light-positive.json  (+ 3 variantes)
├── esm/
│   └── verdana-light-positive.mjs   (+ 3 variantes)
└── dts/
    └── verdana.d.ts
```

### Verificando tokens específicos

Confirme que o token de cor primária está correto:

```bash
grep "function-primary-normal-background" dist/css/verdana-light-positive.css
```

Resultado esperado:
```css
--semantic-color-interface-function-primary-normal-background: 0.5164rem ...;
```

O valor em `rem` é a conversão do hex `#15803D` processado pelo pipeline OKLCh. Pode diferir em 1–2 dígitos do hex declarado — isso é esperado (veja [N2-02](../n2-system-designer/02-pipeline-oklch.md)).

Confirme o item de product:

```bash
grep "product-eco" dist/css/verdana-light-positive.css
```

Você deve ver 30 variáveis por variante de tema (surface × intensidade × propriedade).

Confirme o dark mode (inversão):

```bash
grep "function-primary-normal-background" dist/css/verdana-dark-positive.css
```

O valor deve ser diferente do light — o nível de luminosidade foi invertido.

---

## Passo 6 — Sincronizar com o Figma

### 5.1 — Carregar os tokens

No Figma com o **Tokens Studio** instalado:

1. Abra o plugin → **Settings** → **Add New Storage**
2. Selecione **Local/URL** e aponte para `dist/json/verdana-light-positive.json`
3. Repita para as outras 3 variantes (ou configure o plugin para carregar múltiplos sets)

### 5.2 — Criar as variáveis

No plugin Tokens Studio:
1. Aba **Sets** → selecione todos os sets do tema Verdana
2. Clique no ícone de **Figma Variables**
3. **Create/Update Variables**

O plugin cria coleções de variáveis separadas por camada. Variáveis Semantic ficam em uma coleção, Foundation em outra. Modo Light/Dark ficam como modos da mesma coleção.

### 5.3 — Verificar

Crie um frame de teste no Figma:
- Um retângulo com fill `semantic.color.interface.function.primary.normal.background`
- Um texto sobre ele com fill `semantic.color.interface.function.primary.normal.txtOn`

Troque o modo para Dark — ambos devem mudar automaticamente para o equivalente escuro. Se o texto desaparecer ou o contraste parecer incorreto, o par background/txtOn pode estar sendo quebrado — reveja a seção de tokens aplicados.

---

## Passo 7 — Foundation customizada (quando necessário)

O tema Verdana usa a Foundation padrão (`engine`). Isso é correto para a maioria dos casos.

Quando criar uma Foundation customizada:

- O time de produto usa nomes de alias diferentes (`bg.card` em vez de `bg.primary`)
- O produto tem conceitos semânticos próprios não cobertos pela Foundation padrão
- O time quer uma camada de aliases específica para um produto sem afetar outros

Para criar:

```
dynamic-themes/themes/config/foundations/verdana.config.mjs
```

Estrutura básica:

```javascript
export default {
  name: 'verdana',
  outputPath: 'data/foundation/verdana',
  structure: {
    bg: {
      card:   { ref: 'semantic.color.interface.brand.ambient.first.lowest.background' },
      action: { ref: 'semantic.color.interface.function.primary.normal.background' },
      // ...
    }
  }
}
```

Em seguida, vincule no `themes.config.json`:

```json
"verdana": {
  "foundation": {
    "brand": "verdana",   // ← aponta para a foundation customizada
    ...
  }
}
```

E regenere:

```bash
npm run foundations:generate
npm run build:all
```

---

## Checkpoint

Ao fim deste tutorial você deve saber:

- [ ] Começar pelo config mínimo (1.0) e verificar que o build passa antes de adicionar complexidade
- [ ] Escrever o bloco de `colors` com a distinção `default` (suave) e `secondary` (saturado) para feedback
- [ ] Adicionar cores de produto e mapeá-las em `mapping` (estágio 1.1)
- [ ] Adicionar `options` básicas — `txtOnStrategy`, `darkModeChroma`, `accessibilityLevel` (estágio 1.2)
- [ ] Entender por que `options.interaction` e `baseAdaptation` são contratos de workspace (estágio 1.3)
- [ ] Conectar `colors` ao `mapping` sem erros de chave
- [ ] Registrar o tema em `themes.config.json` com a chave correta
- [ ] Executar `npm run build:themes` e interpretar o output
- [ ] Usar `theme-engine preview` (modos Detailed e Summary) para validar visualmente as quatro variantes
- [ ] Verificar tokens no CSS gerado com `grep`
- [ ] Descrever o processo de sincronização com o Figma via Tokens Studio
- [ ] Decidir quando criar uma Foundation customizada vs usar a `engine`

---

## Próximo passo

Você completou o N3. Você sabe construir componentes conformes, integrar tokens em qualquer plataforma, e adicionar novas marcas ao engine do zero.

O próximo nível é **governança em larga escala**: múltiplas equipes consumindo o mesmo sistema, ciclos de atualização, breaking changes e estratégias de migração. Esses tópicos estão cobertos em:

- [Guia de migração](../../07-implementation/01-migration-guide.md)
- [Boas práticas de overrides](../../../references/aplica-tokens-theme-engine/docs/context/dynamic-themes-reference/OVERRIDE-BEST-PRACTICES.md)
- [Contrato de naming canônico](../../../references/aplica-tokens-theme-engine/docs/context/tokens/canonical-taxonomy-and-naming-contract.md)

---

## Referências

- Guia completo de configuração: [03-configuration-guide.md](../../04-theme-engine/03-configuration-guide.md)
- Pipeline de build detalhado: [04-build-pipeline.md](../../04-theme-engine/04-build-pipeline.md)
- Anatomia de um tema (N2): [N2-04 · Anatomia de um tema](../n2-system-designer/04-anatomia-de-um-tema.md)
- Entendendo o pipeline (N3): [N3-04 · Entendendo o pipeline de build](./04-pipeline-de-build.md)
- Workflow de sincronização com Figma: [02-designer-workflow.md](../../04-theme-engine/02-designer-workflow.md)
