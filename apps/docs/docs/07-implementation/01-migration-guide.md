---
title: "Guia de Migração"
lang: pt-BR
---

# Guia de Migração

## Premissa

Este guia cobre três cenários de migração distintos:

1. **Monolítico para pacote NPM** — como migrar um projeto que embutia o código-fonte do engine diretamente para o novo modelo de pacote NPM `@aplica/aplica-theme-engine`.
2. **Atualização de versão do engine** — como atualizar um projeto que usa o pacote NPM para uma versão mais recente, sem perder configurações e sem quebrar temas existentes.
3. **Migração estrutural legada** — como mover projetos com a estrutura antiga de config (config em `dynamic-themes/themes/config/`) para o modelo atual de consumer workspace.

---

## Migração de Monolítico para Pacote NPM

Se o seu projeto contém o código-fonte do engine diretamente (uma cópia do repositório do engine ou um git subtree), o comando `migrate:legacy-consumer` automatiza a conversão para o modelo de consumer workspace do pacote NPM.

### Quando se aplica

Seu projeto tem qualquer um dos seguintes:
- Um diretório `dynamic-themes/` na raiz do projeto
- Scripts do engine diretamente no seu repositório (`lib/`, `transformers/`, `schemas/`)
- `npm run build:themes` no `package.json` apontando para um caminho de script local

### Processo de migração

#### Passo 1 — Instalar o pacote

```bash
npm install @aplica/aplica-theme-engine
```

#### Passo 2 — Analisar o workspace atual

Execute o analyzer primeiro para entender o que será migrado:

```bash
aplica-theme-engine migrate:legacy-consumer analyze --source=./dynamic-themes
```

O analyzer reporta:
- Quais arquivos de config foram encontrados e onde vão parar na nova estrutura
- Quais schema overrides existem (irão para `theme-engine/schemas/`)
- Se há scripts customizados que sobrescrevem o comportamento padrão do engine (devem ser tratados manualmente)

#### Passo 3 — Executar a migração

```bash
# Dry run — visualizar todas as mudanças sem escrever nada
aplica-theme-engine migrate:legacy-consumer run --source=./dynamic-themes --dry-run

# Executar a migração
aplica-theme-engine migrate:legacy-consumer run --source=./dynamic-themes
```

A migração:
- Cria `theme-engine/config/` com seus configs de marca e config global
- Cria `aplica-theme-engine.config.mjs` na raiz do projeto
- Cria `theme-engine/transformers.config.mjs` a partir das suas configurações de transformer existentes
- Cria `theme-engine/schemas/` se você tinha schema overrides
- **Não** apaga a estrutura antiga (a limpeza é manual, após verificação)

#### Passo 4 — Verificar paridade

A migração é bem-sucedida quando tanto o build anterior quanto o novo produzem output `dist/` idêntico. O sub-comando `compare` verifica isso:

```bash
# Build com o novo modelo de pacote
npm run tokens:build

# Comparar novo output com o output legado
aplica-theme-engine migrate:legacy-consumer compare
```

O compare faz diff arquivo por arquivo em `dist/` e reporta quaisquer discrepâncias. Paridade significa que a migração está completa.

#### Passo 5 — Atualizar scripts do package.json

Substitua os scripts de build antigos pelos novos scripts de consumer:

```json
{
  "scripts": {
    "tokens:build":       "aplica-theme-engine build",
    "tokens:build:all":   "aplica-theme-engine build:all",
    "tokens:themes":      "aplica-theme-engine themes:generate",
    "tokens:sync":        "aplica-theme-engine sync:architecture",
    "tokens:foundations": "aplica-theme-engine foundations:generate",
    "tokens:validate":    "aplica-theme-engine validate:data"
  }
}
```

#### Passo 6 — Limpeza (após paridade confirmada)

```bash
# Remover o código-fonte embutido do engine
rm -rf dynamic-themes/
rm -rf lib/
rm -rf transformers/
```

Atualize o `.gitignore` para excluir diretórios gerados:

```gitignore
/data/
/dist/
```

#### Flags de migração

| Flag | Descrição |
|------|-----------|
| `--source=<caminho>` | Caminho para o diretório legado do engine (padrão: `./dynamic-themes`) |
| `--force` | Sobrescrever arquivos existentes no consumer workspace alvo |
| `--profile=<nome>` | Usar um perfil de migração específico para layouts não-padrão |

---

---

## Como o Engine Versiona Mudanças

O engine segue Semantic Versioning (SemVer). O que isso significa para consumidores:

| Tipo de versão | O que muda | Impacto |
|----------------|-----------|---------|
| **Patch** (2.18.x → 2.18.1) | Correções de bugs, ajustes internos | Seguro atualizar direto |
| **Minor** (2.18.x → 2.19.0) | Novos tokens adicionados, novos recursos opcionais | Seguro atualizar — não remove nada existente |
| **Major** (2.x → 3.0) | Tokens renomeados ou removidos, mudança de estrutura de pasta | **Requer migração explícita** — caminhos antigos deixam de existir |

### O que conta como breaking change

- Renomear um caminho de token (ex.: `semantic.color.interface.oldName` → `semantic.color.interface.newName`)
- Remover um token do schema
- Mudar a estrutura de pastas do `dist/` de forma incompatível

### O que NÃO é breaking change

- Adicionar novos tokens ao schema
- Adicionar novos temas
- Adicionar novos formatos de output (`dts/`, etc.)
- Melhoras internas ao pipeline de build

### Fontes de informação por versão

Antes de qualquer migração, leia:

```
CHANGELOG.md          — Narrativa do que mudou e por quê
RELEASE_FILES.md      — Lista exata de arquivos adicionados, modificados e removidos por versão
CHANGELOG-ARCHIVE.md  — Histórico para versões 2.11.x e anteriores
```

---

## Atualização de Versão Minor / Patch

Para atualizações que não envolvem breaking changes (minor ou patch):

### Passo 1 — Verificar a versão atual

```bash
cat package.json | grep '"version"'
```

### Passo 2 — Ler o CHANGELOG

Leia as entradas entre a versão atual e a versão alvo. Identifique:
- Novos arquivos de lógica adicionados (`schemas/`, `lib/`, scripts em `dynamic-themes/`)
- Configurações que precisam ser atualizadas (marcadas como "Configurations that MUST be updated")
- Novos tokens adicionados ao schema (indicam que `sync:architecture` precisa rodar)

### Passo 3 — Separar: lógica vs configuração

Esta é a regra de ouro da atualização:

| O que vem do upstream (nova versão) | O que permanece do seu projeto |
|-------------------------------------|-------------------------------|
| Scripts em `dynamic-themes/` | `config/*.config.mjs` (configs de tema) |
| `schemas/` (architecture.mjs, etc.) | `config/global/themes.config.json` |
| `lib/paths.mjs` | `config/foundations/*.config.mjs` |
| `transformers/` | Overrides e customizações |

**Nunca sobrescreva seu `config/` com arquivos do upstream.** O upstream fornece lógica — sua config é sua.

### Passo 4 — Executar verificação antes de buildar

```bash
# Verificar se a estrutura de dados ainda bate com o schema
npm run sync:architecture:test

# Build completo para confirmar que tudo resolve corretamente
npm run build:themes
```

### Passo 5 — Confirmar output

```bash
# Verificar que os dist/ foram gerados corretamente
ls dist/css/
ls dist/json/

# Confirmar que nenhum token crítico sumiu
grep "semantic-color-interface-function-primary" dist/css/*.css | head -5
```

---

## Migração Estrutural — Legado para Centralizado

A maior mudança estrutural do engine foi a **centralização dos configs**: o que estava em `dynamic-themes/themes/config/` e `dynamic-themes/themes/schemas/` foi movido para a raiz do projeto.

### Quando este cenário se aplica

Se o seu projeto tem configs em qualquer destes locais:
- `dynamic-themes/themes/config/*.config.mjs`
- `dynamic-themes/themes/config/global/`
- `dynamic-themes/themes/config/foundations/`
- `dynamic-themes/themes/schemas/`
- `dynamic-themes/schemas/`
- `transformers/schemas/`

### Mapa de caminhos: legado → centralizado

| Localização legada | Nova localização |
|-------------------|-----------------|
| `dynamic-themes/themes/config/global/themes.config.json` | `config/global/themes.config.json` |
| `dynamic-themes/themes/config/global/dimension.config.mjs` | `config/global/dimension.config.mjs` |
| `dynamic-themes/themes/config/*.config.mjs` | `config/*.config.mjs` |
| `dynamic-themes/themes/config/foundations/` | `config/foundations/` |
| `dynamic-themes/themes/schemas/` ou `dynamic-themes/schemas/` | `schemas/` (de upstream) |
| `transformers/schemas/` | `schemas/` (conteúdo migrado) |
| Caminhos hardcoded nos scripts | `lib/paths.mjs` (de upstream) |

### Processo de migração estrutural

#### 1. Verificação de versão (obrigatório primeiro)

```bash
cat package.json | grep '"version"'
```

Leia o CHANGELOG a partir da versão atual até a versão alvo. Para versões 2.11.x e anteriores, também leia `CHANGELOG-ARCHIVE.md`.

#### 2. Backup

```bash
git stash
# ou simplesmente criar um branch antes de começar
git checkout -b migration/centralized-config
```

#### 3. Inventário pré-migração

Liste todos os arquivos de configuração do projeto antes de mover qualquer coisa:

```bash
# Configs de tema
ls dynamic-themes/themes/config/*.config.mjs

# Config global
ls dynamic-themes/themes/config/global/

# Foundations
ls dynamic-themes/themes/config/foundations/

# Schemas customizados (se existirem)
ls dynamic-themes/themes/schemas/ 2>/dev/null
ls dynamic-themes/schemas/ 2>/dev/null
```

#### 4. Rodar o script de migração

O engine fornece um script que copia os configs do projeto para os novos caminhos sem sobrescrever nada:

```bash
# Dry run — ver o que seria copiado sem alterar arquivos
npm run migrate:centralized -- --dry-run

# Executar a migração (copia, não move — mantém os arquivos antigos por segurança)
npm run migrate:centralized

# Para mover em vez de copiar (só após confirmar que o dry-run está correto)
npm run migrate:centralized -- --move
```

O script cria `config/`, `config/global/`, `config/foundations/` e `schemas/` se não existirem. Ele **não** cria `lib/paths.mjs` — esse arquivo vem do upstream.

#### 5. Trazer lógica do upstream

Após mover os configs, traga os arquivos de lógica da nova versão:

```bash
# lib/paths.mjs — fonte única de caminhos
# schemas/architecture.mjs, typography-styles.mjs, foundation-styles.mjs
# Scripts atualizados em dynamic-themes/
```

Os scripts e transformers atualizados usam `lib/paths.mjs` como fonte única de todos os caminhos — qualquer referência hardcoded a `dynamic-themes/themes/config/` nos scripts legados deve ser substituída por imports de `lib/paths.mjs`.

#### 6. Verificação

```bash
# Verificar estrutura sem gravar
npm run sync:architecture:test

# Build completo
npm run build:themes

# Build Style Dictionary
npm run build

# Testes (se o projeto tiver)
npm run test
```

Confirme que `data/` e `dist/` foram gerados corretamente e que nenhum script ainda lê de `dynamic-themes/themes/config/`, `dynamic-themes/themes/schemas/` ou `transformers/schemas/`.

#### 7. Limpeza

Somente após confirmar que o build e os testes passam:

```bash
# Remover estrutura legada
rm -rf dynamic-themes/themes/config/
rm -rf dynamic-themes/themes/schemas/
rm -rf transformers/schemas/  # se existir e conteúdo foi migrado
```

---

## Migração para Versão com $description (2.19.x+)

A versão 2.19.x adicionou campos `$description` aos tokens para melhorar o contexto em ferramentas de design e AI. Esta é uma migração additive — não quebra nada — mas requer dois novos arquivos do upstream:

```
schemas/semantic-token-descriptions.mjs     ← descrições dos tokens Semantic
config/foundations/foundation-token-descriptions.mjs  ← descrições dos tokens Foundation
```

Traga esses arquivos do upstream. Suas overrides de descrição por foundation ficam em `config/foundations/*.config.mjs` nos campos `descriptions` e `styles.elevation[level].description` — o script de migração os preserva.

Após adicionar, rode `sync:architecture` e verifique que `data/semantic/default.json` e `data/foundation/engine/default.json` têm os campos `$description`.

---

## Quando Tokens São Renomeados (Major Version)

Se um caminho de token mudou entre versões (ex.: um breaking change de major):

### 1. Identificar quais tokens mudaram

Leia o CHANGELOG da versão major — ele listará os caminhos antigos, os novos e a razão.

### 2. Encontrar todas as ocorrências no código consumidor

```bash
# Buscar o token antigo em componentes
grep -r "semantic-color-interface-old-name" src/

# Buscar em arquivos CSS
grep -r "semantic.color.interface.oldName" src/
```

### 3. Substituir

Substitua globalmente o caminho antigo pelo novo. No CSS, tokens seguem o padrão de substituição direto: `semantic.color.old.path` → `--semantic-color-old-path` vira `--semantic-color-new-path`.

### 4. Validar o build

```bash
npm run build:themes
npm run build

# Verificar que a nova variável existe no output
grep "semantic-color-new-path" dist/css/*.css
```

---

## Checklist de Migração Rápida

**Para minor/patch:**
- [ ] Ler CHANGELOG da versão atual até alvo
- [ ] Atualizar lógica (scripts, schemas, lib/) do upstream
- [ ] Preservar configs do projeto (`config/*.config.mjs`, etc.)
- [ ] Rodar `sync:architecture:test` → `build:themes` → `build`
- [ ] Confirmar output em `dist/`

**Para migração estrutural:**
- [ ] Verificar versão atual no `package.json`
- [ ] Ler CHANGELOG e RELEASE_FILES para o range de versões
- [ ] Fazer backup / criar branch
- [ ] Fazer inventário de configs legados
- [ ] Rodar `npm run migrate:centralized -- --dry-run`
- [ ] Rodar `npm run migrate:centralized`
- [ ] Trazer `lib/paths.mjs`, `schemas/` e scripts atualizados do upstream
- [ ] Corrigir imports nos scripts que apontam para caminhos legados
- [ ] Rodar `sync:architecture:test` → `build:themes` → `build` → `test`
- [ ] Remover pastas legadas somente após validação

---

## Referências

- Pipeline de build: [04-theme-engine/04-build-pipeline.md](../04-theme-engine/04-build-pipeline.md)
- Guia de configuração: [04-theme-engine/03-configuration-guide.md](../04-theme-engine/03-configuration-guide.md)
- Referência de CLI (migrate:legacy-consumer): [09-engineering/05-cli-reference.md](../09-engineering/05-cli-reference.md)
- Quick start de engenharia: [09-engineering/01-quick-start.md](../09-engineering/01-quick-start.md)
- Integração em plataformas: [02-platform-integration.md](./02-platform-integration.md)
