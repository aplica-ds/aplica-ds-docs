---
title: "Pipeline de Build"
lang: pt-BR
---

# Pipeline de Build

## Premissa

O pipeline de build do Aplica Tokens Theme Engine transforma configurações em tokens consumíveis para todas as plataformas. É um processo em duas grandes etapas: **geração de dados** (config → `data/`) e **transformação de output** (Style Dictionary: `data/` → `dist/`).

Entender o pipeline é essencial para quem mantém temas, adiciona novas cores ou precisa diagnosticar por que um token não aparece no output.

---

## Visão Geral do Fluxo

```
theme-engine/config/*.config.mjs
        │
        ▼
[ Etapa 1: Geração de Dados ]
        │
        ├─ themes:generate    → data/brand/<tema>/
        ├─ dimension:generate → data/dimension/normal.json
        ├─ sync:architecture  → data/mode/, data/surface/, data/semantic/, data/foundation/
        ├─ foundations:generate → data/foundation/<nome>/styles/
        └─ figma:generate     → data/$themes.json, data/$metadata.json, data/$themes.engine.json.template
        │
        ▼
[ data/ ] ← NUNCA editar manualmente
        │
        ▼
[ Etapa 2: Build Style Dictionary ]
        │
        npm run tokens:build:all
        │
        ▼
[ dist/ ]
  ├── json/      ← JSON com px (Figma, Tokens Studio)
  ├── css/       ← CSS custom properties com rem
  ├── esm/       ← ES Modules com px
  ├── js/        ← CommonJS com px
  └── dts/       ← TypeScript declarations
```

---

## Etapa 1 — Geração de Dados

### `themes:generate` — Decomposição de Cores

O script principal da etapa de dados. Para cada `*.config.mjs` em `theme-engine/config/`:

1. Lê `colors` e `mapping` do config
2. Para cada cor declarada, chama `ColorDecomposer` que:
   - Converte hex → OKLCh
   - Interpola luminosidade para 19 níveis de paleta (10–190)
   - Gera 15 níveis de neutrals (5–140) com croma reduzido a 10%
   - Calcula `txtOn` (WCAG AA/AAA) e `border` para cada nível
   - Inverte a escala para dark mode (level N → level 200-N)
3. Gera `_typography.json` via `TypographyGenerator`
4. Gera `_borders.json` com referências à escala dimensional

**Arquivos produzidos por tema em `data/brand/<tema>/`:**

| Arquivo | Conteúdo |
|---------|----------|
| `_primitive_theme.json` | Paletas decompostas brutas (palette + neutrals + behavior por cor) |
| `_grayscale.json` | Escala de cinza fixa (15 níveis, customizável por override) |
| `_brand.json` | Mapeamento semântico: `theme.color.light.*` e `theme.color.dark.*` |
| `_typography.json` | Tokens de tipografia (famílias, pesos, tamanhos, line-heights) |
| `_borders.json` | Border radius com referências à escala dimensional |
| `_ui.json` | UI tokens de componente (apenas quando `options.uiTokens: true`) |

### `sync:architecture` — Propagação de Referências

O script mais crítico e menos óbvio do pipeline. Lê o **schema de arquitetura** — gerenciado pelo pacote — e propaga as referências corretas para todas as camadas intermediárias.

**O que ele escreve (sobrescrevendo qualquer edição manual):**

| Arquivo | O que é propagado |
|---------|------------------|
| `data/mode/light.json` | Refs de `theme.color.light.*` para feedback, function, ambient |
| `data/mode/dark.json` | Refs de `theme.color.dark.*` com inversão de escala |
| `data/surface/positive.json` | Refs do mode para contexto positivo |
| `data/surface/negative.json` | Refs do mode com escala invertida (negativo fotográfico) |
| `data/semantic/default.json` | Tokens semânticos completos referenciando surface |
| `data/foundation/engine/default.json` | Aliases Foundation referenciando semantic |

**Regra fundamental:** `data/mode/`, `data/surface/`, `data/semantic/` e `data/foundation/engine/` são **arquivos gerados**. Qualquer edição manual é sobrescrita na próxima execução do sync.

#### Como surface e mode se relacionam

```
data/surface/positive.json
        │ referencia
        ▼
data/mode/light.json  ←─── (ou dark.json, dependendo do bundle)
        │ referencia
        ▼
data/brand/<tema>/_brand.json
```

A surface não sabe se é light ou dark — ela referencia o mode. O mode seleciona qual arquivo de brand usar. A escolha light/dark acontece na hora do build, quando o `$themes.json` define qual combinação de arquivos é merged.

### `foundations:generate` — Estilos de Foundation

Gera os arquivos de estilo compostos — typography styles e elevation styles — que não são tokens primitivos, mas classes CSS pré-compostas consumíveis diretamente no Figma e no código:

```
data/foundation/<nome>/
├── default.json                ← tokens alias (foundation.bg.primary → semantic.color.*)
└── styles/
    ├── typography_styles.json  ← estilos tipográficos compostos (.typography-heading-title_1)
    └── elevation_styles.json   ← classes de sombra por nível (.elevation-level_two)
```

### `figma:generate` — Scaffolding Figma e Tokens Studio

Gera (ou mescla) os três arquivos que o Tokens Studio lê para entender quais token sets pertencem a qual variante de tema:

| Arquivo | Finalidade |
|---------|------------|
| `data/$themes.json` | Entradas de tema ativas importadas pelo Tokens Studio. Preserva campos de propriedade do Figma (`id`, `$figmaStyleReferences`, IDs de variáveis) na mesclagem. |
| `data/$themes.engine.json.template` | Template canônico do engine — mesma estrutura que `$themes.json` com campos Figma vazios. Usado como referência de reset. |
| `data/$metadata.json` | Ordem de carregamento dos token sets para o workspace ativo. |

O gerador reconstrói as entradas estruturais (`selectedTokenSets`, `name`, `group`) a partir da configuração ativa do workspace. Quando `data/$themes.json` já existe, preserva qualquer IDs e referências de estilo atribuídas pelo Figma para que as sincronizações com o Figma sobrevivam à regeração.

**Não delete esses arquivos.** Se `data/$themes.json` for deletado, todas as referências de estilo do Figma armazenadas nele são perdidas e precisam ser re-sincronizadas do Figma.

Este comando é executado automaticamente como parte de `aplica-theme-engine build`. Execute standalone quando você só alterou a estrutura do workspace (adicionou ou renomeou um tema, surface ou mode) sem alterar valores de tokens:

```bash
aplica-theme-engine figma:generate
```

---

## Etapa 2 — Build Style Dictionary

O Style Dictionary v5 lê `data/` e o arquivo de configuração `$themes.json`, resolve todas as referências (`{semantic.color.brand.first.default.background}`), aplica as transformações de plataforma e escreve os arquivos em `dist/`.

### O arquivo `$themes.json`

Define quais combinações de arquivos de token são merged para gerar cada variante de tema:

```json
{
  "aplica_joy-light-positive": {
    "selectedTokenSets": {
      "brand/aplica_joy/_brand":       "enabled",
      "brand/aplica_joy/_typography":  "enabled",
      "brand/aplica_joy/_grayscale":   "enabled",
      "brand/aplica_joy/_borders":     "enabled",
      "mode/light":                    "enabled",
      "surface/positive":              "enabled",
      "semantic/default":              "enabled",
      "foundation/engine/default":     "enabled",
      "dimension/normal":              "source"
    }
  },
  "aplica_joy-dark-positive": { /* mesma estrutura, mode/dark */ }
}
```

Cada entrada em `$themes.json` = um arquivo de output em `dist/`. Este arquivo é **gerado pelo `figma:generate`** — não edite manualmente.

### Resolução de Referências

O Style Dictionary percorre todas as referências em cadeia e as resolve para valores finais:

```
foundation.bg.primary
  → {semantic.color.interface.function.primary.normal.background}
    → {surface.interface.positive.function.primary.normal.background}
      → {mode.interface.positive.function.primary.normal.background}
        → {theme.color.light.interface.positive.function.primary.normal.background}
          → #C40145  (valor final para aplica_joy light)
```

### Transformações por Plataforma

Cada plataforma aplica transformações específicas antes de escrever:

| Plataforma | Transformação principal | Unidade de saída |
|------------|------------------------|-----------------|
| `json` | Resolve referências, mantém estrutura nested | `px` |
| `css` | Gera `--semantic-*` e `--foundation-*`, converte dimensões | `rem` |
| `esm` | Gera módulo ES com objeto exportado | `px` |
| `js` | Gera módulo CommonJS | `px` |
| `dts` | Gera declarações TypeScript | — |

**Exceção importante:** Tokens com `$type: "number"` (como `semantic.depth.spread`) **nunca** são convertidos para rem — permanecem em px em todas as plataformas. Veja [05-output-formats.pt-br.md](./05-output-formats.pt-br.md) para a lista completa de exceções.

---

## O Schema de Arquitetura

O schema de arquitetura é o **ponto de verdade único para a estrutura de tokens**. Ele define:

- Quais tipos de feedback existem (`info`, `success`, `warning`, `danger`)
- Quais variantes cada feedback tem (`default`, `secondary`)
- Quais itens de product existem (`promo`, `cashback`, `premium`)
- Quais níveis de intensidade a camada semântica expõe (`lowest`, `default`, `highest`)

O schema é de propriedade do pacote. Consumidores podem inspecionar o schema ativo e sobrescrever partes específicas colocando arquivos de schema em `theme-engine/schemas/`.

```bash
# Ver o schema atual
aplica-theme-engine sync:architecture:schema

# Verificar impacto sem gravar
aplica-theme-engine sync:architecture:test
```

Quando o schema muda (ex.: adicionar um novo item de feedback), o `sync:architecture` propaga essa mudança para todas as camadas. Temas que não declararem a nova cor no `mapping` receberão um aviso no build.

---

## Pipeline Completo vs Incremental

### Pipeline completo — use após clone ou mudanças amplas

```bash
npm run tokens:build
```

Executa em ordem:
1. `ensure:data` — cria diretórios necessários em `data/`
2. `dimension:generate` — gera escala dimensional
3. `themes:generate` — decompõe cores de todos os temas
4. `sync:architecture` — propaga referências entre camadas
5. `foundations:generate` — gera estilos de foundation
6. `figma:generate` — gera arquivos de scaffolding Tokens Studio / Figma
7. `build:all` — Style Dictionary → `dist/`

### Builds incrementais — use para mudanças pontuais

| Mudança | Comandos necessários |
|---------|---------------------|
| Alterar cor de um tema | `tokens:themes` → `tokens:build:all` |
| Alterar escala dimensional | `tokens:dimension` → `tokens:build:all` |
| Alterar schema (adicionar feedback/product) | `tokens:sync` → `tokens:themes` → `tokens:build:all` |
| Alterar foundation | `tokens:foundations` → `tokens:build:all` |
| Adicionar / renomear tema, surface ou mode | `tokens:figma` |
| Apenas rebuild (`data/` intacto) | `tokens:build:all` |

### A armadilha dos gradientes

Gradientes exigem atenção especial à ordem:

```
themes:generate   → gera _brand.json COM gradiente
       ↓
sync:architecture → propaga gradiente até semantic.color.gradient
       ↓
build:all         → emite variáveis CSS de gradiente
```

Se `sync:architecture` não rodar após `themes:generate`, a seção `semantic.color.gradient` não existe e o `build:all` avisa (sem falhar) e omite os gradientes do output. Solução: sempre usar `tokens:build` (pipeline completo) ou rodar o sync manualmente antes do build.

---

## Validação no Build

O pipeline inclui verificações automáticas:

- **Referências quebradas:** Se um token referencia outro que não existe, o build falha com erro de resolução
- **Contraste WCAG:** O engine reporta falhas AA/AAA como avisos durante `themes:generate`. Configure `accessibilityLevel` e `acceptAALevelFallback` nas `options` do tema para controlar o comportamento.
- **Estrutura de schema:** O `sync:architecture:test` valida se os configs dos temas alinham com o schema sem gravar nada
- **Integridade de dados:** Execute `theme-engine validate:data` antes de publicar para detectar incompatibilidades de schema cedo

---

## Diagnóstico de Problemas Comuns

| Sintoma | Causa provável | Solução |
|---------|---------------|---------|
| Gradiente não aparece no CSS | `sync:architecture` não rodou após `themes:generate` | `npm run tokens:sync` + `npm run tokens:build:all` |
| Token novo não aparece no dist/ | Tema não registrado em `themes.config.json` | Adicionar entrada no `themes` do config global |
| Cor diferente do esperado | Override em `overrides.*` sobrescrevendo o gerado | Verificar se há override configurado para aquela cor |
| Build falha com "reference not found" | `data/` desatualizado em relação aos configs | `npm run tokens:build` (rebuild completo) |
| txtOn é preto/branco quando esperava cor de marca | `txtOnStrategy: 'high-contrast'` é o padrão | Mudar para `'brand-tint'` nas options do tema |

---

## Referências

- Guia de configuração: [03-configuration-guide.pt-br.md](./03-configuration-guide.pt-br.md)
- Formatos de output em detalhe: [05-output-formats.pt-br.md](./05-output-formats.pt-br.md)
- Referência de CLI: [09-engineering/05-cli-reference.pt-br.md](../09-engineering/05-cli-reference.pt-br.md)
- Build e integração CI: [09-engineering/06-build-and-ci.pt-br.md](../09-engineering/06-build-and-ci.pt-br.md)
- Diagnóstico de problemas: [09-engineering/07-troubleshooting.pt-br.md](../09-engineering/07-troubleshooting.pt-br.md)
- Matemática e algoritmos: [06-mathematics-and-algorithms.pt-br.md](../03-visual-foundations/06-mathematics-and-algorithms.pt-br.md)
