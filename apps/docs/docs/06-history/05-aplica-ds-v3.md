---
title: "Aplica DS — V3"
lang: pt-BR
---

# Aplica DS — V3

## Contexto

A V3 é a fase atual do Aplica DS (2024–presente). É a fase de distribuição: tudo que foi provado na V2 foi reempacotado para que qualquer equipe possa adotar sem precisar fazer fork ou copiar arquivos internos.

As duas mudanças estruturais que definem a V3:

1. **Package-first** — o `@aplica/aplica-theme-engine` é publicado como pacote npm independente. Consumers instalam como dependência em vez de copiar arquivos fonte.
2. **Consumer workspace model** — configuração e dados ficam inteiramente no projeto consumidor. O pacote é um motor puro; não traz opiniões sobre brand, cores ou tipografia.

---

## A grande virada: de cópia para pacote

Na V2, equipes adotavam o Theme Engine copiando ou fazendo fork do repositório. Atualizações exigiam merge manual. A V3 substituiu esse modelo:

| | V2 | V3 |
|---|---|---|
| Adoção | Cópia / fork | `npm install @aplica/aplica-theme-engine` |
| Configuração | No repositório do engine | No projeto consumidor (`aplica.config.mjs`) |
| Atualizações | Merge manual | `npm update` + bundle de migração |
| Ownership de schemas | Controlado pelo engine | Consumer pode sobrescrever via `paths.schemasDir` |

---

## Inovações da V3

### 1. Pacote npm independente

```bash
npm install @aplica/aplica-theme-engine
```

O pacote expõe:
- `defineThemeEngineConfig()` — API pública de configuração com inferência TypeScript completa
- `/config` — helpers de config importáveis
- `/transformers/config` — hooks de extensibilidade para transformers customizados

### 2. Scaffolding do workspace consumidor

```bash
npx aplica-theme-engine init
```

Wizard interativo que cria:
- `aplica.config.mjs` — configuração do projeto
- `data/` — arquivos de schema e arquitetura
- `dist/` — diretório de output da build

Alternativamente, `--template <starter>` pula o wizard.

### 3. Migração automatizada da V2

```bash
npx aplica-theme-engine migrate:legacy-consumer
```

Três subcomandos para migração segura de projetos monolíticos pré-V3:

| Subcomando | Propósito |
|------------|---------|
| `analyze` | Relata o que precisa mudar |
| `convert` | Aplica a migração automaticamente |
| `compare` | Faz diff do estado antes/depois |

### 4. Integração com Figma via `figma:generate`

```bash
npx aplica-theme-engine figma:generate
```

Gera e mantém os três arquivos que o Tokens Studio precisa:

| Arquivo | Propósito |
|---------|---------|
| `data/$themes.json` | Configuração de temas para o Tokens Studio |
| `data/$themes.engine.json.template` | Template para campos gerenciados pelo engine |
| `data/$metadata.json` | Metadados dos tokens |

IDs estáveis via SHA1 de `"group:name"` — sem IDs aleatórios que forçam re-sync no Figma. Campos do Figma (`id`, `$figmaStyleReferences`, `variableIDs`) são preservados a cada execução.

### 5. Foundation Styles como classes CSS

A V3 promoveu o Foundation Styles — introduzido na V2 2.26.0 — como caminho principal de consumo para autores de componentes e agentes de IA:

```bash
# Gerado pelo engine
dist/css/foundation/{brand}/typography.css
dist/css/foundation/{brand}/elevation.css
```

Cada classe é um composto: classes de tipografia agrupam 7 propriedades CSS referenciando tokens semânticos; classes de elevation agrupam `box-shadow` por nível. Os valores resolvem em runtime pelo arquivo de tema ativo — troca de tema atualiza automaticamente.

### 6. AI Skills Injection Program

```bash
npx aplica-theme-engine ai:init
```

Injeta arquivos de contexto específicos de editor no workspace do consumidor:

| Destino | Ferramenta |
|---------|------------|
| `docs/context/` | Todos os agentes de IA (compartilhado) |
| `.cursor/rules/` | Cursor |
| `.claude/skills/` | Claude Code |
| `.github/instructions/` | GitHub Copilot |

Os arquivos injetados ensinam agentes qual camada de token ler, como mapear intenção para tokens semânticos, e quando preferir Foundation Styles em vez de montagem de tokens atômicos.

### 7. AI UI Integration Program

Um contrato formal que especifica como agentes de IA consomem o sistema de tokens ao gerar UI:

- **Caminho preferido**: Foundation Styles (`typography.css`, `elevation.css`) — uma classe mapeia para uma decisão de estilo completa
- **Caminho secundário**: tokens semânticos (`action.bg.brand.default`) — quando controle fino é necessário
- **Nunca**: tokens de camada Brand, Mode ou Surface — são internos do engine

Sete archetypes de componente (Button, Dialog, Input, Badge, Select, Card, Tabs) definem o modelo canônico de decisão de tokens para cada tipo de componente.

---

## Versões de marco da V3

Versão atual: **3.7.0** (2026-04-24)

- **3.7.0** — Plataforma de output `jsonTyped` — primeiro delivery de output extensível com metadata tipada (`type`, `value`, `description`, `path`); configurável via `formatOptions.jsonTyped` em `transformers.config.mjs`; backward compatible, contrato `json` existente não muda
- **3.6.4** — Fix de migração: `generate-foundation.mjs` agora preserva corretamente `txt.base.items` em workspaces com product text families customizados (ex.: temas estilo Brewer com `tada`, `ze`)
- **3.6.3** — `includePrimitives: false` como padrão no scaffold do `init`, banner de onboarding no CLI, cobertura de smoke para `ai:init`
- **3.6.1** — Workspace config `generation.colorText` (breaking: consolidação de config de por-tema para workspace)
- **3.6.0** — Contrato de cor de 4 partes: token `txt` adicionado ao lado de `background`/`txtOn`/`border`; `txtBaseColorLevel`; text states (`normal`/`action`/`active`/`focus`) em todas as camadas; breaking: aliases de texto não mais herdam de `surface.*`
- **3.5.2** — AI UI Integration Program — archetypes, portal rule para headless UI (Base UI, Radix)
- **3.5.0** — Comando `ai:init` — AI Skills Injection no workspace consumidor
- **3.4.0** — Comando `figma:generate` — scaffolding do Tokens Studio com IDs estáveis via SHA1
- **3.0.0** — Arquitetura package-first, consumer workspace model, API de config pública, wizard `init`, `migrate:legacy-consumer`

---

## Arquivos de referência

- Pacote npm: `@aplica/aplica-theme-engine`
- API de config: `aplica.config.mjs` no projeto consumidor
- Contexto de IA: `docs/context/` (injetado por `ai:init`)
- Changelog completo: `CHANGELOG.md` no repositório do pacote
- Documentação do AI UI Program: `docs/context/ai-ui/` no workspace consumidor após `ai:init`
