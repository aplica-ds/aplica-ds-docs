---
title: "AI Skills Injection"
lang: pt-br
---

# AI Skills Injection

## O que é

O comando `ai:init` copia um conjunto de arquivos de integração de editor versionados do pacote do engine para o workspace do consumidor. Esses arquivos ensinam assistentes de código de IA — Cursor, Claude Code e GitHub Copilot — como consumir corretamente os design tokens Aplica ao gerar ou modificar código de UI.

Sem esses arquivos, um assistente de IA não tem conhecimento do contrato de tokens: pode adivinhar nomes de variáveis, hardcodar valores ou compor tokens incorretamente.

---

## Executando o comando

```bash
npx theme-engine ai:init
```

> `ai:init`, `ai:setup`, `skills` e `skills:init` são todos aliases do mesmo comando.

Execute uma vez após a instalação. Re-execute após cada atualização do pacote para manter a orientação injetada sincronizada com o contrato de tokens atual.

---

## Arquivos injetados

| Destino | Ferramenta | Finalidade |
|---------|-----------|-----------|
| `docs/context/aplica-ui-integration.md` | Todas as surfaces de IA | Guia de integração agnóstico: fluxo de consumo de tokens, regras rígidas e mapeamento de archetypes |
| `docs/context/theme-engine-playbook.md` | Todas as surfaces de IA | Playbook central SSOT — arquitetura em camadas, referência de config keys, tabela de comandos CLI, outputs do workspace, diagnósticos |
| `.cursor/rules/aplica-ui-integration.mdc` | Cursor | Arquivo de regra que é ativado ao editar arquivos de UI (`*.js`, `*.jsx`, `*.ts`, `*.tsx`, `*.css`, `*.html`, `*.vue`, `*.svelte`) |
| `.claude/skills/aplica-ui-integration/SKILL.md` | Claude Code | Skill acionada quando o usuário pede para construir ou estilizar componentes de UI |
| `.claude/skills/aplica-knowledge-guide/SKILL.md` | Claude Code | Skill conversacional — lê o playbook e sugere o slash command adequado |
| `.claude/commands/` | Claude Code | 6 slash commands de workflow guiado (ver abaixo) |
| `CLAUDE.md` | Claude Code | Contexto operacional do workspace — copiado uma vez, não sobrescrito se já existir |
| `.github/instructions/aplica-ui.instructions.md` | GitHub Copilot | Arquivo de instrução carregado pelo Copilot ao trabalhar no repositório |

Todos os arquivos são versionados dentro do pacote em `templates/ai-skills/`. O comando os copia literalmente para o workspace do consumidor.

A partir da versão 3.15, `ai:init` também copia um `DESIGN.md` estático para a raiz do workspace — um snapshot de valores resolvidos do brand de referência (cores, tipografia, espaçamento, componentes) no formato Google Stitch. Ferramentas de IA compatíveis com a spec usam este arquivo automaticamente. Para gerar com os valores reais do seu brand, use [`theme-engine design:md`](./08-design-file-format.md).

A partir da versão 3.16, `ai:init` também instala o **Knowledge Guide** (`aplica-knowledge-guide`) em todos os AI tools — uma skill conversacional que habilita o assistente a responder perguntas de configuração, explicar a arquitetura e diagnosticar tokens. Para instalar apenas a skill conversacional, use [`theme-engine ai:knowledge`](./10-knowledge-guide.md).

A partir da versão 3.19, `ai:init` instala o **playbook central** e **6 slash commands** para Claude Code — veja a seção abaixo.

---

## Arquitetura do sistema de AI skills (v3.19)

A partir da versão 3.19, o sistema de AI skills foi refatorado de "skills grandes com conteúdo embutido" para um modelo de **playbook central + wrappers finos**.

**Antes (v3.16–v3.18):** cada skill de IA tinha o conteúdo de referência embutido diretamente — duplicação entre Claude, Cursor e Copilot.

**Agora (v3.19+):** o conteúdo existe uma única vez em `docs/context/theme-engine-playbook.md` (SSOT). As skills de cada plataforma são wrappers finos que leem o playbook e delegam para o slash command adequado.

```
docs/context/theme-engine-playbook.md   ← SSOT (arquitetura, config keys, CLI, diagnósticos)
    ↑
    └── .claude/skills/aplica-knowledge-guide/SKILL.md   (wrapper Claude)
    └── .cursor/rules/aplica-knowledge-guide.mdc          (wrapper Cursor)
    └── .github/instructions/aplica-knowledge.instructions.md  (wrapper Copilot)
```

Esse modelo garante que uma atualização no playbook se propaga automaticamente para todas as plataformas de IA sem necessidade de editar cada skill individualmente.

---

## Slash commands (Claude Code)

Após `ai:init`, o Claude Code em qualquer workspace de consumidor passa a ter 6 slash commands de workflow guiado:

| Comando | Jornada | Audiência |
|---------|---------|-----------|
| `/getting-started` | Orientação inicial — entender o estado do workspace e o próximo passo | Qualquer |
| `/configure-visual` | Mapear um resultado visual para a config key correta | System Designer |
| `/engineering-integration` | CSS variables, JSON tokens, consumo por plataforma | Engenheiro |
| `/debug` | Diagnosticar problemas de cor, contraste ou dark mode | Qualquer |
| `/explain-semantic <topic>` | Entender um conceito de config ou grupo semântico | Qualquer |
| `/build-component` | Construir um componente de UI com tokens Aplica corretos | Engenheiro |

Todos os comandos leem `docs/context/theme-engine-playbook.md` como referência principal e nunca inventam nomes de token ou caminhos de arquivo — operam exclusivamente sobre os arquivos reais do workspace.

Para mais detalhes sobre cada jornada, consulte [Slash Commands](./11-slash-commands.md).

---

## O que a orientação injetada cobre

Os arquivos de integração instruem o assistente de IA a:

1. **Ler `docs/context/theme-engine-playbook.md` antes de responder qualquer pergunta sobre configuração, CLI ou arquitetura** — este é o playbook SSOT do workspace.
2. **Ler `docs/context/aplica-ui-integration.md` antes de escrever qualquer código de UI ou estilo** — fonte de verdade única para o contrato de tokens do consumidor.
3. **Inspecionar os outputs compilados em `dist/`** para confirmar nomes exatos de variáveis antes de referenciá-los.
4. **Usar tokens semânticos como a camada padrão de componente** — nunca referenciar diretamente tokens de Brand, Mode ou Surface.
5. **Preferir classes de Foundation Styles em vez de montar tokens atômicos:**
   - Aplicar classes `typography-*` para toda estilização de texto (não font-size, font-weight, line-height individuais)
   - Aplicar classes `elevation-*` para sombras (não valores brutos de box-shadow)
6. **Nunca hardcodar valores pertencentes a tokens** (dimensões em `px`, cores em `hex`, `rgba()`, box-shadows brutos).
7. **Nunca adivinhar nomes de tokens** — sempre verificar a partir dos outputs compilados.

---

## Quando re-executar

Re-execute `ai:init` sempre que atualizar o pacote `@aplica/aplica-theme-engine`. Os arquivos injetados são versionados com o engine: uma nova versão pode adicionar orientação de archetypes, atualizar regras de consumo ou ampliar a cobertura para novos componentes. Executar o comando novamente sobrescreve os arquivos existentes.

---

## Audiência

| Papel | Relevância |
|-------|-----------|
| System Designer (N2) | Execute `ai:init` ao configurar um novo workspace de consumidor |
| Design Engineer (N3) | Execute `ai:init` após atualizações do pacote; estenda os arquivos injetados se necessário para regras específicas do projeto |
| Component Author (N1+) | Beneficia-se da orientação injetada automaticamente quando o assistente de IA ativa a skill |

---

## Referências

- Slash Commands — jornadas guiadas de workflow: [11-slash-commands.md](./11-slash-commands.md)
- Referência da CLI (lista completa de comandos): [../09-engineering/05-cli-reference.md](../09-engineering/05-cli-reference.md)
- Foundation Styles (caminho de consumo preferido): [06-foundation-styles.md](./06-foundation-styles.md)
- AI UI Integration Program: [../05-components-theory/04-ai-ui-integration.md](../05-components-theory/04-ai-ui-integration.md)
- Design.md — contexto de valores resolvidos para ferramentas de IA: [08-design-file-format.md](./08-design-file-format.md)
- Knowledge Guide — skill conversacional para configuração e diagnóstico: [10-knowledge-guide.md](./10-knowledge-guide.md)
