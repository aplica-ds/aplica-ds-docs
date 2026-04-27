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

Após a instalação, a CLI fica disponível como `aplica-theme-engine` (ou via `npx theme-engine`).

---

## Grupos de comandos

| Grupo | Finalidade |
|-------|-----------|
| [Build](#comandos-de-build) | Transforma `data/` em `dist/` |
| [Generate](#comandos-de-geração) | Gera `data/` a partir da config |
| [Architecture](#comandos-de-arquitetura) | Sincroniza referências de tokens entre camadas |
| [Validate](#comandos-de-validação) | Valida o contrato de `data/` antes do build |
| [Setup](#comandos-de-setup) | Monta o workspace de consumidor e schemas |
| [AI Skills](#comandos-de-ai-skills) | Injeta integrações de editor de IA no workspace do consumidor |
| [Migration](#comandos-de-migração) | Migra projetos monolíticos para o modelo de pacote |

---

## Comandos de build

### `build` (padrão recomendado)

Executa o pipeline completo de geração + build em um único comando. É o comando recomendado para CI e uso no dia a dia.

```bash
aplica-theme-engine build
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
aplica-theme-engine build:all
```

Útil para iterar em mudanças de formato de output sem rodar o pipeline completo de geração.

---

### `build:semantic`

Constrói apenas o output da camada Semantic.

```bash
aplica-theme-engine build:semantic
```

---

### `build:foundation`

Constrói apenas o output da camada Foundation.

```bash
aplica-theme-engine build:foundation
```

---

### `build:components`

Constrói apenas o output da camada Components. Ignorado com mensagem informativa se `data/components` não existir.

```bash
aplica-theme-engine build:components
```

---

## Comandos de geração

Esses comandos produzem ou atualizam `data/` a partir da sua configuração. Execute-os individualmente quando precisar regenerar uma etapa específica do pipeline.

### `themes:generate`

Decompõe todas as configurações de cores de marca na paleta completa de tokens OKLCh. Grava em `data/brand/`, `data/mode/` e `data/surface/`.

```bash
aplica-theme-engine themes:generate
```

---

### `themes:single <marca>`

Gera os dados de token para uma única marca. Útil durante o desenvolvimento de marca quando você não quer regenerar todas as marcas.

```bash
aplica-theme-engine themes:single minha-marca
```

---

### `dimension:generate`

Gera a escala espacial (espaçamento, tamanho, border radius) para as três variantes de dimensão (minor, normal, major). Grava em `data/dimension/`.

```bash
aplica-theme-engine dimension:generate
```

---

### `foundations:generate`

Gera aliases de token Foundation a partir da camada Semantic. Grava em `data/foundation/`.

```bash
aplica-theme-engine foundations:generate
```

---

### `figma:generate`

Gera (ou mescla) os três arquivos que o Tokens Studio precisa para entender quais token sets pertencem a cada variante de tema. Grava em `data/`.

```bash
aplica-theme-engine figma:generate
```

**Arquivos produzidos:**

| Arquivo | Finalidade |
|---------|------------|
| `data/$themes.json` | Entradas de tema ativas importadas pelo Tokens Studio. Preserva campos de propriedade do Figma na mesclagem (`id`, `$figmaStyleReferences`, IDs de variáveis). |
| `data/$themes.engine.json.template` | Template do engine com a mesma estrutura e campos Figma vazios. Use como referência de reset. |
| `data/$metadata.json` | Ordem de carregamento dos token sets para o workspace ativo. |

Use este comando standalone quando você adicionou ou renomeou um tema, surface ou mode e quer atualizar os arquivos do Tokens Studio sem rodar um build completo. Em um build completo (`aplica-theme-engine build`), esta etapa é executada automaticamente entre `foundations:generate` e `build:all`.

> Não delete `data/$themes.json`. Se for deletado, as referências de estilo do Figma armazenadas nele são perdidas.

---

### `ensure:data`

Valida a estrutura de diretórios de `data/` e cria os que estão faltando. Execute antes dos comandos de geração ao configurar um novo workspace.

```bash
aplica-theme-engine ensure:data
```

---

## Comandos de arquitetura

### `sync:architecture`

Propaga referências de tokens entre todas as camadas (Brand → Mode → Surface → Semantic → Foundation). Execute após `themes:generate` e antes de `foundations:generate`.

```bash
aplica-theme-engine sync:architecture
```

---

### `sync:architecture:test`

Executa a sincronização de arquitetura em modo de teste — reporta o que mudaria sem gravar em `data/`.

```bash
aplica-theme-engine sync:architecture:test
```

---

### `sync:architecture:schema`

Executa a sincronização de arquitetura em modo de schema — valida o contrato de estrutura de tokens.

```bash
aplica-theme-engine sync:architecture:schema
```

---

## Comandos de validação

### `validate:data`

Valida o diretório `data/` atual contra:
- Os schemas de geração do consumidor ativo
- Os schemas de contrato de output de dados
- Os contratos de estilos de Foundation e tipografia

```bash
aplica-theme-engine validate:data
```

Execute antes de `build:all` no CI para capturar erros de geração antes do build do Style Dictionary.

> `validate:data` e `data:validate` são aliases.

---

## Comandos de setup

### `init`

Monta um novo workspace de consumidor. Execute uma vez após instalar o pacote.

```bash
aplica-theme-engine init
```

Oferece dois caminhos de entrada:
- **Load starter template** — workspace pronto para rodar com um tema inicial
- **Create using the wizard** — mesma base + gera `theme-engine/schemas/architecture.mjs` com base em respostas guiadas

> `init` e `consumer:init` são aliases.

---

### `schemas:helper`

Gera interativamente um scaffold de `theme-engine/schemas/architecture.mjs`. Use quando precisar personalizar o contrato de estrutura de tokens além do que o starter template oferece.

```bash
aplica-theme-engine schemas:helper
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

## Comandos de AI Skills

### `ai:init`

Injeta arquivos de integração de editor de IA no workspace do consumidor. Execute uma vez após instalar ou atualizar o pacote para dar ao seu assistente de código de IA (Cursor, Claude Code, GitHub Copilot) conhecimento estruturado do contrato de tokens.

```bash
aplica-theme-engine ai:init
```

**Arquivos injetados:**

| Destino | Finalidade |
|---------|-----------|
| `docs/context/aplica-ui-integration.md` | Guia de integração de UI agnóstico para qualquer surface de IA |
| `.cursor/rules/aplica-ui-integration.mdc` | Regra específica para Cursor que ativa geração de código ciente de tokens |
| `.claude/skills/aplica-ui-integration/SKILL.md` | Skill do Claude Code para padrões sancionados de consumo de tokens |
| `.github/instructions/aplica-ui.instructions.md` | Instruções do GitHub Copilot para completions cientes de tokens |

Todos os arquivos são copiados do diretório versionado `templates/ai-skills/` do pacote. Re-executar o comando sobrescreve os arquivos existentes — seguro de executar após cada atualização do pacote para manter a guidance de IA sincronizada com o contrato de tokens atual.

> `ai:init`, `ai:setup`, `skills` e `skills:init` são todos aliases do mesmo comando.

---

## Comandos de migração

### `migrate:legacy-consumer`

Migra um projeto monolítico (pré-pacote) para o modelo de workspace de consumidor. Valida a paridade entre o output migrado e o projeto original.

**Recomendado: executar a migração completa em uma etapa**

```bash
aplica-theme-engine migrate:legacy-consumer run --source <caminho-do-projeto-legado>
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
aplica-theme-engine migrate:legacy-consumer analyze --source <caminho>

# Apenas converter
aplica-theme-engine migrate:legacy-consumer convert --source <caminho>

# Apenas comparar (após uma conversão já ter sido executada)
aplica-theme-engine migrate:legacy-consumer compare --source <caminho>
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
