---
title: "Referência da CLI"
lang: pt-br
---

# Referência da CLI

A CLI `aplica-theme-engine` é a interface principal para gerar e construir design tokens. Todos os comandos rodam contra o workspace de consumidor atual — o engine lê sua configuração de `aplica-theme-engine.config.mjs` e grava todo o output dentro da raiz do seu projeto.

---

## Instalação

```bash
npm install @aplica/aplica-theme-engine
```

Após a instalação, a CLI fica disponível como `theme-engine` (ou via `npx theme-engine`).

---

## Grupos de comandos

| Grupo | Finalidade |
|-------|-----------|
| [Build](#comandos-de-build) | Transforma `data/` em `dist/` |
| [Generate](#comandos-de-geração) | Gera `data/` a partir da config |
| [Architecture](#comandos-de-arquitetura) | Sincroniza referências de tokens entre camadas |
| [Validate](#comandos-de-validação) | Valida o contrato de `data/` antes do build |
| [Setup](#comandos-de-setup) | Monta o workspace de consumidor e schemas |
| [Playground](#comandos-de-playground) | Copia temas de referência e baixa fontes OFL |
| [AI Skills](#comandos-de-ai-skills) | Injeta integrações de editor de IA no workspace do consumidor |
| [Design.md](#comandos-de-designmd) | Gera `DESIGN.md` (spec Google Stitch) com valores reais do brand |
| [Contracts](#comandos-de-contratos) | Gera e compara snapshots de contrato para segurança de deploy |
| [Migration](#comandos-de-migração) | Migra projetos monolíticos para o modelo de pacote |

---

## Comandos de build

### `build` (padrão recomendado)

Executa o pipeline completo de geração + build em um único comando. É o comando recomendado para CI e uso no dia a dia.

```bash
theme-engine build
```

**Pipeline executado:**
1. `ensure:data` — valida / cria a estrutura de diretórios de `data/`
2. `themes:generate` — decompõe as cores da marca em paletas OKLCh
3. `dimension:generate` — gera a escala espacial (minor / normal / major)
4. `sync:architecture` — propaga referências de tokens entre todas as camadas
5. `foundations:generate` — gera aliases de Foundation a partir dos tokens Semantic
6. `figma:generate` — gera arquivos de scaffolding Tokens Studio / Figma
7. `build:all` — transforma `data/` em `dist/` via Style Dictionary

> `build` e `build:themes` são aliases do mesmo comando.

---

### `build:all`

Transforma o `data/` existente em `dist/` sem regenerar `data/`. Use quando os dados de token já estão corretos e você precisa apenas reconstruir os artefatos de output.

```bash
theme-engine build:all
```

Útil para iterar em mudanças de formato de output sem rodar o pipeline completo de geração.

---

### `build:semantic`

Constrói apenas o output da camada Semantic.

```bash
theme-engine build:semantic
```

---

### `build:foundation`

Constrói apenas o output da camada Foundation.

```bash
theme-engine build:foundation
```

---

### `build:components`

Constrói apenas o output da camada Components. Ignorado com mensagem informativa se `data/components` não existir.

```bash
theme-engine build:components
```

---

## Comandos de geração

Esses comandos produzem ou atualizam `data/` a partir da sua configuração. Execute-os individualmente quando precisar regenerar uma etapa específica do pipeline.

### `themes:generate`

Decompõe todas as configurações de cores de marca na paleta completa de tokens OKLCh. Grava em `data/brand/`, `data/mode/` e `data/surface/`.

```bash
theme-engine themes:generate
```

---

### `themes:single <marca>`

Gera os dados de token para uma única marca. Útil durante o desenvolvimento de marca quando você não quer regenerar todas as marcas.

```bash
theme-engine themes:single minha-marca
```

---

### `dimension:generate`

Gera a escala espacial (espaçamento, tamanho, border radius) para as três variantes de dimensão (minor, normal, major). Grava em `data/dimension/`.

```bash
theme-engine dimension:generate
```

---

### `foundations:generate`

Gera aliases de token Foundation a partir da camada Semantic. Grava em `data/foundation/`.

```bash
theme-engine foundations:generate
```

---

### `figma:generate`

Gera (ou mescla) os três arquivos que o Tokens Studio precisa para entender quais token sets pertencem a cada variante de tema. Grava em `data/`.

```bash
theme-engine figma:generate
```

**Arquivos produzidos:**

| Arquivo | Finalidade |
|---------|------------|
| `data/$themes.json` | Entradas de tema ativas importadas pelo Tokens Studio. Preserva campos de propriedade do Figma na mesclagem (`id`, `$figmaStyleReferences`, IDs de variáveis). |
| `data/$themes.engine.json.template` | Template do engine com a mesma estrutura e campos Figma vazios. Use como referência de reset. |
| `data/$metadata.json` | Ordem de carregamento dos token sets para o workspace ativo. |

Use este comando standalone quando você adicionou ou renomeou um tema, surface ou mode e quer atualizar os arquivos do Tokens Studio sem rodar um build completo. Em um build completo (`theme-engine build`), esta etapa é executada automaticamente entre `foundations:generate` e `build:all`.

> Não delete `data/$themes.json`. Se for deletado, as referências de estilo do Figma armazenadas nele são perdidas.

---

### `ensure:data`

Valida a estrutura de diretórios de `data/` e cria os que estão faltando. Execute antes dos comandos de geração ao configurar um novo workspace.

```bash
theme-engine ensure:data
```

---

## Comandos de arquitetura

### `sync:architecture`

Propaga referências de tokens entre todas as camadas (Brand → Mode → Surface → Semantic → Foundation). Execute após `themes:generate` e antes de `foundations:generate`.

```bash
theme-engine sync:architecture
```

---

### `sync:architecture:test`

Executa a sincronização de arquitetura em modo de teste — reporta o que mudaria sem gravar em `data/`.

```bash
theme-engine sync:architecture:test
```

---

### `sync:architecture:schema`

Executa a sincronização de arquitetura em modo de schema — valida o contrato de estrutura de tokens.

```bash
theme-engine sync:architecture:schema
```

---

## Comandos de validação

### `validate:data`

Valida o diretório `data/` atual contra:
- Os schemas de geração do consumidor ativo
- Os schemas de contrato de output de dados
- Os contratos de estilos de Foundation e tipografia

```bash
theme-engine validate:data
```

Execute antes de `build:all` no CI para capturar erros de geração antes do build do Style Dictionary.

> `validate:data` e `data:validate` são aliases.

---

## Comandos de setup

### `init`

Monta um novo workspace de consumidor. Execute uma vez após instalar o pacote.

```bash
theme-engine init
```

Oferece três caminhos de entrada:
- **Load starter template** — workspace pronto para rodar com um tema inicial
- **Create using the wizard** — mesma base + gera `theme-engine/schemas/architecture.mjs` com base em respostas guiadas
- **Load playground themes** — copia as 15 configurações de referência do Aplica DS (equivalente a `theme-engine init:playground`)

> `init` e `consumer:init` são aliases.

---

### `schemas:helper`

Gera interativamente um scaffold de `theme-engine/schemas/architecture.mjs`. Use quando precisar personalizar o contrato de estrutura de tokens além do que o starter template oferece.

```bash
theme-engine schemas:helper
```

O helper pergunta sobre:
- Itens de marca (brand items)
- Níveis de intensidade / decomposição
- Itens de função de interface (interface function)
- Itens de feedback e variantes
- Categorias de produto e variantes
- Nomes de gradiente

> `schemas:helper` e `schemas:init` são aliases.

---

## Comandos de playground

### `init:playground`

Copia as 15 configurações de tema de referência do Aplica DS no diretório de config do workspace do consumidor. Útil para explorar o modelo de configuração do engine, inspecionar como cada eixo de configuração é exercitado, ou iniciar um projeto a partir de um conjunto completo de exemplos.

```bash
theme-engine init:playground
```

Copia os arquivos `config/aplica-*.config.mjs` do pacote publicado para `theme-engine/config/` no workspace do consumidor. Não sobrescreve arquivos existentes com o mesmo nome.

**Temas copiados:** `aplica_blue_sky`, `aplica_sky`, `aplica_joy`, `aplica_tangerine`, `aplica_grinch`, `aplica_slate`, `aplica_forest`, `aplica_aurora`, `aplica_obsidian`, `aplica_coral`, `aplica_midnight`, `aplica_rose`, `aplica_mono`, `aplica_ember`, `aplica_electric`.

> `init:playground` e `themes:examples` são aliases.

---

### `fonts:download`

Baixa as famílias de fontes OFL usadas pelos temas de playground do repositório canônico `google/fonts` no GitHub para `assets/fonts/` no workspace do consumidor.

```bash
theme-engine fonts:download
```

**Famílias baixadas (22):** Abril Fatface, Barlow, Bebas Neue, Cormorant Garamond, Courier Prime, DM Sans, DM Serif Display, Fira Code, Fira Mono, Inter, JetBrains Mono, Lato, Libre Baskerville, Lora, Montserrat, Nunito, Nunito Sans, Plus Jakarta Sans, Playfair Display, Quicksand, Rajdhani, Source Code Pro, Space Grotesk, Space Mono.

Requer acesso à internet (github.com/google/fonts).

> `fonts:download` e `playground:fonts` são aliases.

---

## Comandos de AI Skills

### `ai:init`

Injeta arquivos de integração de editor de IA no workspace do consumidor. Execute uma vez após instalar ou atualizar o pacote para dar ao seu assistente de código de IA (Cursor, Claude Code, GitHub Copilot) conhecimento estruturado do contrato de tokens.

```bash
theme-engine ai:init
```

**Arquivos injetados:**

| Destino | Finalidade |
|---------|-----------|
| `docs/context/aplica-ui-integration.md` | Guia de integração de UI agnóstico para qualquer surface de IA |
| `.cursor/rules/aplica-ui-integration.mdc` | Regra específica para Cursor que ativa geração de código ciente de tokens |
| `.claude/skills/aplica-ui-integration/SKILL.md` | Skill do Claude Code para padrões sancionados de consumo de tokens |
| `.github/instructions/aplica-ui.instructions.md` | Instruções do GitHub Copilot para completions cientes de tokens |

Todos os arquivos são copiados do diretório versionado `templates/ai-skills/` do pacote. Re-executar o comando sobrescreve os arquivos existentes — seguro de executar após cada atualização do pacote para manter a guidance de IA sincronizada com o contrato de tokens atual.

A partir da versão 3.15, `ai:init` também copia um `DESIGN.md` estático para a raiz do workspace. Use `theme-engine design:md` para regenerar com os valores reais do seu brand.

> `ai:init`, `ai:setup`, `skills` e `skills:init` são todos aliases do mesmo comando.

---

## Comandos de Design.md

O `DESIGN.md` é um arquivo de especificação de design system no formato [Google Stitch](https://stitch.withgoogle.com/docs/design-md/overview): YAML frontmatter legível por máquina (cores, tipografia, espaçamento, componentes) + corpo markdown legível por humanos. Qualquer AI coding tool que siga a spec (Cursor, Claude Code, GitHub Copilot, Gemini) usa este arquivo para gerar UI coerente com o sistema.

### `design:md`

Gera o `DESIGN.md` para o workspace atual com os valores reais do brand — resolvendo tokens de `dist/json/<brand>-light-positive.json` e `data/foundation/<brand>/styles/typography_styles.json`.

```bash
# Brand primário (detectado de themes.config.json)
theme-engine design:md

# Brand específico
theme-engine design:md --brand aplica_slate
```

**Arquivos produzidos:**

| Arquivo | Finalidade |
|---------|-----------|
| `DESIGN.md` | Spec completa na raiz do workspace — use com AI tools |
| `data/foundation/<brand>/design-md.json` | JSON intermediário resolvido (versionável, para ferramentas programáticas) |

**Personalização:** Edite `config/foundations/design-md.json` para substituir as descrições padrão dos slots. O engine usa os defaults de `schemas/design-md.mjs` para qualquer slot não sobrescrito. Quando a arquitetura de tokens evolui, `schemas/design-md.mjs` é atualizado na mesma PR — as associações ficam sempre pareadas.

**Validação:**

```bash
npx @google/design.md lint DESIGN.md
```

> `design:md`, `design-md` e `design:generate` são aliases.

---

## Comandos de Contratos

Os contratos de token garantem que releases do Theme Engine não quebrem silenciosamente a biblioteca de componentes. O fluxo é:

1. O repositório de configuração gera o contrato após o build e o publica no NPM junto com `dist/`.
2. A biblioteca de componentes faz o diff em CI sempre que o pacote de tokens é atualizado.

### `contracts:generate`

Extrai um snapshot estrutural (paths de token + tipos, sem valores) de `dist/json/<brand>-light-positive.json` e grava em `dist/contracts/<brand>-contract.json`.

```bash
# Brand primário
theme-engine contracts:generate

# Brand específico
theme-engine contracts:generate --brand aplica_slate

# Todos os brands
theme-engine contracts:generate --all
```

Execute após `theme-engine build` e antes de `npm publish`. O arquivo gerado é publicado no pacote NPM para que bibliotecas de componentes o localizem via `node_modules`.

---

### `contracts:diff`

Compara o contrato commitado na biblioteca de componentes com o contrato do pacote instalado e retorna um dos três estados:

| Estado | Condição | Exit code |
|--------|----------|-----------|
| ✅ **Green** | Nenhuma mudança estrutural | `0` |
| ⚠️ **Alert** | Paths novos adicionados (não-breaking) | `0` (com aviso) |
| ❌ **Error** | Paths removidos ou tipos alterados (breaking) | `1` |

```bash
# Comparar contrato local com o do pacote instalado
theme-engine contracts:diff --contract ./contracts/aplica_blue_sky-contract.json

# Gerar relatório em arquivo
theme-engine contracts:diff \
  --contract ./contracts/aplica_blue_sky-contract.json \
  --output ./contracts/diff-report.json
```

O engine localiza o contrato do pacote em `node_modules/@aplica/aplica-theme-engine/dist/contracts/<brand>-contract.json`.

**GitHub Action:** Copie `templates/github-actions/contracts-check.yml` do pacote para `.github/workflows/` na sua biblioteca de componentes. O workflow roda `contracts:diff` em PRs que atualizam o `package.json`.

---

## Comandos de migração

### `migrate:legacy-consumer`

Migra um projeto monolítico (pré-pacote) para o modelo de workspace de consumidor. Valida a paridade entre o output migrado e o projeto original.

**Recomendado: executar a migração completa em uma etapa**

```bash
theme-engine migrate:legacy-consumer run --source <caminho-do-projeto-legado>
```

Esse comando:
1. Analisa a estrutura do projeto legado
2. Seleciona o perfil de migração adequado
3. Converte o workspace
4. Executa o build para o perfil escolhido
5. Compara o `data/` e `dist/` convertidos com a referência legada

**Executar fases separadamente (para inspeção ou depuração)**

```bash
# Apenas analisar — sem alterações
theme-engine migrate:legacy-consumer analyze --source <caminho>

# Apenas converter
theme-engine migrate:legacy-consumer convert --source <caminho>

# Apenas comparar (após uma conversão já ter sido executada)
theme-engine migrate:legacy-consumer compare --source <caminho>
```

**Opções**

| Flag | Descrição |
|------|-----------|
| `--source <caminho>` | Caminho para a raiz do projeto legado |
| `--force` | Sobrescreve um workspace já convertido (para testes repetidos de migração) |
| `--profile <nome>` | Perfil de migração (detectado automaticamente quando omitido) |

**Significado de paridade:**
- **Paridade de data** — o workspace convertido reproduz o mesmo `data/` do original
- **Paridade de dist** — o workspace convertido reproduz o mesmo `dist/` do original
- Drift apenas em metadados não falha a paridade

Os artefatos de migração são gravados em `temp/outputs/legacy-migration/` — as fixtures de origem permanecem inalteradas.

> `migrate:legacy-consumer` e `legacy:migrate` são aliases.

---

## Fluxos comuns

### Primeiro build em um projeto novo

```bash
npm install @aplica/aplica-theme-engine
npx theme-engine init
npm run tokens:build
```

### Rebuild após mudar cores de marca

```bash
npm run tokens:themes       # regenera dados de marca + modo + superfície
npm run tokens:sync         # propaga referências
npm run tokens:foundations
npm run tokens:build:all
```

Ou simplesmente:

```bash
npm run tokens:build    # pipeline completo — sempre seguro
```

### Rebuild apenas dos formatos de output (sem mudanças de cor)

```bash
npm run tokens:build:all
```

### Validar antes de publicar

```bash
npx theme-engine validate:data && npm run tokens:build:all
```
