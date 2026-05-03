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
npx theme-engine init
```

Wizard interativo que cria:
- `aplica.config.mjs` — configuração do projeto
- `data/` — arquivos de schema e arquitetura
- `dist/` — diretório de output da build

Alternativamente, `--template <starter>` pula o wizard.

### 3. Migração automatizada da V2

```bash
npx theme-engine migrate:legacy-consumer
```

Três subcomandos para migração segura de projetos monolíticos pré-V3:

| Subcomando | Propósito |
|------------|---------|
| `analyze` | Relata o que precisa mudar |
| `convert` | Aplica a migração automaticamente |
| `compare` | Faz diff do estado antes/depois |

### 4. Integração com Figma via `figma:generate`

```bash
npx theme-engine figma:generate
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
npx theme-engine ai:init
```

Injeta arquivos de contexto específicos de editor no workspace do consumidor:

| Destino | Ferramenta |
|---------|------------|
| `docs/context/` | Todos os agentes de IA (compartilhado) |
| `.cursor/rules/` | Cursor |
| `.claude/skills/` | Claude Code |
| `.github/instructions/` | GitHub Copilot |

Os arquivos injetados ensinam agentes qual camada de token ler, como mapear intenção para tokens semânticos, e quando preferir Foundation Styles em vez de montagem de tokens atômicos.

### 8. `theme-engine` — alias CLI preferido (desde 3.8.0)

```bash
npx theme-engine init
npx theme-engine ai:init
npx theme-engine build:all
```

`theme-engine` é agora o nome de comando preferido para workspaces consumidores. O nome legado `aplica-theme-engine` é preservado como fallback de compatibilidade — scripts existentes continuam funcionando sem alterações.

Toda a documentação ativa, fluxos de onboarding e guias de consumidor padronizam em `theme-engine` primeiro. O nome do pacote (`@aplica/aplica-theme-engine`) e os nomes de arquivo de config (`aplica-theme-engine.config.mjs`) não mudam.

---

### 7. AI UI Integration Program

Um contrato formal que especifica como agentes de IA consomem o sistema de tokens ao gerar UI:

- **Caminho preferido**: Foundation Styles (`typography.css`, `elevation.css`) — uma classe mapeia para uma decisão de estilo completa
- **Caminho secundário**: tokens semânticos (`action.bg.brand.default`) — quando controle fino é necessário
- **Nunca**: tokens de camada Brand, Mode ou Surface — são internos do engine

Sete archetypes de componente (Button, Dialog, Input, Badge, Select, Card, Tabs) definem o modelo canônico de decisão de tokens para cada tipo de componente.

---

## Versões de marco da V3

Versão atual: **3.13.4** (2026-05-03)

- **3.13.0–3.13.4** — Preview modo Summary + cluster de dilution com âncora + adaptação de base por quadrante: `theme-engine preview` ganha dropdown View (Detailed / Summary); dilution ganha `target: 'anchor'` com `anchor.source` configurável ('palette' | 'hex' | 'token'), `anchor.canvasAware` e `anchor.canvasMix` para âncoras cromáticas sensíveis ao quadrante; `options.baseAdaptation: true` faz superfícies `normal` de interaction e `default` de produto responderem ao quadrante ativo light/dark + positive/negative
- **3.12.0** — Decomposição de interação aprimorada: `options.interaction.groups.{function|feedback}` permite que `function` e `feedback` usem métodos de decomposição e configs de surface independentes dentro do mesmo tema; overrides por grupo resolvem por mesclagem tema → surface → grupo → grupo-surface
- **3.11.0** — `theme-engine preview --serve` adiciona live reload — o browser atualiza automaticamente quando `dist/` muda; sem necessidade de reload manual ao iterar em configs de tema
- **3.10.1** — Bug fix: overrides de decomposição de interação agrupados (`options.interaction.groups.*`) agora resolvem corretamente em todas as combinações de surface e estado
- **3.10.0** — Distribuição nativa de orientação para IA: `theme-engine ai:init` agora implanta arquivos de contexto do pacote publicado em vez de templates locais; `AI_CONTEXT.md` e `THEME_CONFIG_REFERENCE.md` são empacotados por release e atualizados automaticamente ao rodar `ai:init` após upgrade
- **3.9.0** — Modos de decomposição de interação autorais (`system-scale` / `dilution`) para `interface.function` e `interface.feedback`; presets expandidos `solid` / `ghost` via `legacyStructure: false`; ajuste por estado em `options.interaction.surfaces.{solid|ghost}.levels`; comando `theme-engine preview` gera preview HTML estático em `dist/preview/`
- **3.8.5** — Automação de publicação confiável (trusted publishing) via GitHub Actions; runtimes atualizados para Node.js 24
- **3.8.4** — Tokens `*.txt` negativos agora seguem o contrato de canvas declarado em todo o pipeline até `dist/` para branches de interface, feedback, disabled e produto; novo branch `mode.productBySurface` garante que a polaridade de produto sobreviva ao `sync:architecture`; `test:txt-inversion` agora audita o JSON final em `dist/`
- **3.8.3** — Texto legível ambiente agora segue o canvas do arquivo final em ambas as polaridades: `brand.ambient.contrast.*`, `neutral.*` e `grayscale.*.txt` resolvem contra o `contrast.base.positive.background` declarado; superfícies negativas ambientes resolvem a partir do canvas do modo inverso
- **3.8.2** — `brand.branding` agora respeita a polaridade positive/negative nos outputs semânticos via branch dedicado `mode.brand.brandingBySurface`; dark mode segue a mesma regra de surface inversa que o light mode
- **3.8.1** — Correção de acessibilidade do `txt` ambiente: `brand.ambient.neutral.*.txt` e `brand.ambient.grayscale.*.txt` agora validam contra o `contrast.base.{positive|negative}.background` declarado em vez do background do nível; cobertura de regressão estendida em `test:txt-inversion`
- **3.8.0** — Alias CLI preferido `theme-engine` — comando mais curto para workspaces consumidores; `aplica-theme-engine` preservado como fallback de compatibilidade; toda a documentação ativa padroniza em `theme-engine` primeiro
- **3.7.5** — Fix Tokens Studio-safe: branches de texto legível de produto desabilitadas não emitem mais nós `txt: null` inválidos quando `generateTxt: true` e `textExposure.product: false`
- **3.7.4** — Inversão de texto legível para superfícies negativas: `brand.text.negative.*` agora resolve corretamente; `txt` de produto removido das camadas públicas quando texto legível de produto está desabilitado; migrador legado infere exposição de texto de feedback a partir de aliases planos
- **3.7.2** — Propagação de `brand.branding` corrigida através de `mode` antes de chegar a `surface` e outputs semânticos; migrador legado agora preserva o contrato `generation.colorText` automaticamente
- **3.7.1** — Fix de inversão do `txt` ambiente na camada de tema: `brand.ambient` agora resolve texto legível contra os contextos corretos de background positive/negative
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
