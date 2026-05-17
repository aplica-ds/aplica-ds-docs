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
| `docs/context/token-concepts.md` | Todas as surfaces de IA | Referência N1 — o que é um token, anatomia do caminho semântico, as 4 categorias de cor com árvore de decisão, escala dimensional, densidades, categorias tipográficas |
| `docs/context/engineering-guide.md` | Todas as surfaces de IA | Referência N3 — consumo de CSS variables, implementação de dark mode, portal pattern para headless UI, pipeline de build, garantias do contrato de tokens |
| `.cursor/rules/theme-engine.mdc` | Cursor | Mirror da skill `theme-engine` — expert do engine com detecção de nível N1/N2/N3 |
| `.cursor/rules/aplica-components.mdc` | Cursor | Mirror da skill `aplica-components` — padrões de componentes com tokens Aplica |
| `.claude/skills/theme-engine/SKILL.md` | Claude Code | Expert do engine — detecta N1/N2/N3 pelo vocabulário e responde em profundidade adequada; contém conceitos de tokens, vocabulário de cores, todas as config keys, diagnósticos e referência de CLI |
| `.claude/skills/aplica-components/SKILL.md` | Claude Code | Engineer de componentes — padrões reais de CSS variables, dark mode, portal pattern para headless UI (Radix/Base UI), typography/elevation, checklist de archetypes |
| `.claude/commands/` | Claude Code | 6 slash commands de workflow guiado (ver abaixo) |
| `CLAUDE.md` | Claude Code | Contexto operacional do workspace — copiado uma vez, não sobrescrito se já existir |
| `.github/instructions/theme-engine.instructions.md` | GitHub Copilot | Mirror da skill `theme-engine` para Copilot |
| `.github/instructions/aplica-components.instructions.md` | GitHub Copilot | Mirror da skill `aplica-components` para Copilot |

Todos os arquivos são versionados dentro do pacote em `templates/ai-skills/`. O comando os copia literalmente para o workspace do consumidor.

A partir da versão 3.15, `ai:init` também copia um `DESIGN.md` estático para a raiz do workspace — um snapshot de valores resolvidos do brand de referência (cores, tipografia, espaçamento, componentes) no formato Google Stitch. Ferramentas de IA compatíveis com a spec usam este arquivo automaticamente. Para gerar com os valores reais do seu brand, use [`theme-engine design:md`](./08-design-file-format.md).

A partir da versão 3.16, `ai:init` também instala o **Knowledge Guide** em todos os AI tools. Para instalar apenas a skill conversacional, use [`theme-engine ai:knowledge`](./10-knowledge-guide.md).

A partir da versão 3.19.2, `ai:init` distribui **skills auto-contidas com conhecimento embutido** e **6 slash commands** para Claude Code — veja a seção abaixo.

---

## Arquitetura do sistema de AI skills (v3.19.2)

A partir da versão 3.19.2, o sistema opera com **skills auto-contidas** — o conhecimento está embutido nas skills, não em documento central externo. Nenhuma skill depende de chamada de rede ou arquivo opcional para funcionar.

**Antes (v3.19.1):** playbook central SSOT (`theme-engine-playbook.md`) + wrappers finos que delegavam para ele.

**Agora (v3.19.2+):** duas skills especializadas com conhecimento embutido, complementadas por dois docs de referência local segmentados por audiência.

```
.claude/skills/theme-engine/SKILL.md
    → Expert do engine: arquitetura, config keys, CLI, diagnósticos
    → Detecta N1 (designer) / N2 (system designer) / N3 (engineer) pelo vocabulário
    → Lê docs/context/token-concepts.md para aprofundamento quando necessário

.claude/skills/aplica-components/SKILL.md
    → Engineer de componentes: CSS variables, dark mode, portal pattern, archetypes
    → Lê docs/context/engineering-guide.md para referência de implementação

docs/context/token-concepts.md       ← N1: conceitos, cor, dimensão, tipografia
docs/context/engineering-guide.md    ← N3: consumo, dark mode, portal, build, contrato
```

**Princípio central:** tudo resolvido localmente. Os assistentes funcionam offline, em repos privados e sem configuração adicional. O AI detecta o nível do usuário pelo vocabulário e responde na profundidade adequada sem pedir identificação explícita.

Mirrors para Cursor (`.mdc`) e GitHub Copilot (`.instructions.md`) seguem o mesmo modelo — uma skill para cada especialidade.

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

Todos os comandos operam sobre os arquivos reais do workspace — nunca inventam nomes de token ou caminhos de arquivo. Os comandos de conceito leem `docs/context/token-concepts.md`; os de implementação leem `docs/context/engineering-guide.md`.

Para mais detalhes sobre cada jornada, consulte [Slash Commands](./11-slash-commands.md).

---

## O que a orientação injetada cobre

Os arquivos de integração instruem o assistente de IA a:

1. **Ler `docs/context/token-concepts.md` para conceitos e vocabulário de tokens** — categorias de cor, anatomia do caminho semântico, escala dimensional, tipografia.
2. **Ler `docs/context/engineering-guide.md` antes de escrever qualquer código de UI ou estilo** — padrões de consumo de CSS variables, dark mode, portal pattern.
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
