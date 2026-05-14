---
title: "Knowledge Guide — IA Conversacional para Configuração"
lang: pt-br
---

# Knowledge Guide — IA Conversacional para Configuração

## O que é

O `ai:knowledge` instala uma skill conversacional em todos os AI tools do workspace (Claude Code, Cursor, GitHub Copilot). Ao carregar a skill, o assistente de IA passa a funcionar como um guia expert: lê os arquivos reais de configuração do projeto e responde perguntas sobre arquitetura, configuração e workflow — em vez de apenas executar tarefas.

É o complemento conversacional do `ai:init`: enquanto a skill de integração ensina a IA *como gerar código*, o Knowledge Guide ensina a IA *como guiar o desenvolvedor*.

---

## Por que existe

A maioria das pessoas usa IA para fazer perguntas antes de executar. "Como adiciono uma nova marca?" precede "adicione uma nova marca". Sem contexto do sistema, a IA adivinha — usa nomes de variáveis genéricos, inventa caminhos de arquivo, descreve fluxos que não se aplicam à arquitetura do Aplica.

O Knowledge Guide resolve isso: injeta o mapa de arquivos, os conceitos-chave e os padrões de diagnóstico diretamente no contexto do assistente, antes de qualquer pergunta.

---

## Dois caminhos para instalar

### Via `ai:knowledge` (skill isolada)

```bash
theme-engine ai:knowledge
```

Instala apenas o Knowledge Guide. Use quando você já tem as skills de integração instaladas e quer adicionar a skill conversacional separadamente.

### Via `ai:init` (setup completo)

```bash
theme-engine ai:init
```

Instala tudo: skills de integração de código + DESIGN.md + Knowledge Guide. Recomendado no setup inicial ou após atualizações do pacote.

> `ai:knowledge`, `ai:guide` e `knowledge:init` são aliases do mesmo comando.

---

## Arquivos instalados

| Destino | Ferramenta | Finalidade |
|---------|-----------|-----------|
| `.claude/skills/aplica-knowledge-guide/SKILL.md` | Claude Code | Skill ativada ao fazer perguntas sobre configuração ou arquitetura |
| `.cursor/rules/aplica-knowledge-guide.mdc` | Cursor | Rule com globs para arquivos de config (`themes.config.json`, `*.config.mjs`) |
| `.github/instructions/aplica-knowledge.instructions.md` | GitHub Copilot | Instrução carregada ao trabalhar no repositório |
| `docs/context/aplica-knowledge-guide.md` | Todas as ferramentas | Versão agnóstica — carregue manualmente no contexto de qualquer AI tool |

---

## O que o assistente consegue responder

### Configuração

- "Como adiciono uma nova marca?"
- "Como configuro o dark mode para ficar mais saturado?"
- "O que faz o `ghostNormalTxtOnStrategy`?"
- "Como overrido a cor de hover de um estado de interação?"
- "Quais brands estão ativos no meu workspace agora?"

### Diagnóstico

- "Minha cor de hover está igual à de default — onde olho?"
- "O dark mode parece lavado/dessaturado — o que ajusto?"
- "Texto está ilegível sobre superfície colorida — o que verifico?"
- "Elementos ghost têm uma cor de texto inesperada — por quê?"

### Workflow e build

- "Qual a ordem correta de comandos para um build completo?"
- "Só mudei a config de dimensão — preciso rodar o build todo?"
- "Como vejo os tokens gerados visualmente?"

### IA e contratos

- "Como atualizo o contexto de IA após mudar as cores da marca?"
- "Como verifico se o token que renomeei vai quebrar a biblioteca de componentes?"

---

## Diferença vs. `aplica-ui-integration`

| Skill | Modo | Ativa quando |
|-------|------|-------------|
| `aplica-ui-integration` | Execução | Usuário pede para gerar ou estilizar código de UI |
| `aplica-knowledge-guide` | Conversação | Usuário faz perguntas sobre configuração, arquitetura ou diagnóstico |

As duas skills são complementares — instale ambas via `ai:init`.

---

## O que o assistente faz ao receber uma pergunta

1. **Lê os arquivos de config do workspace** — `themes.config.json`, `aplica-theme-engine.config.mjs`, `config/`, `data/dimension/`
2. **Responde com base na configuração real** — não em defaults genéricos
3. **Explica o conceito antes de sugerir a ação** — ensina o porquê, não só o como
4. **Indica onde encontrar mais detalhes** — docs locais em `docs/context/` ou docs.aplica.me

---

## Quando re-executar

Re-execute `ai:knowledge` (ou `ai:init`) após cada atualização do pacote. O Knowledge Guide é versionado com o engine — novas versões podem expandir os padrões de diagnóstico, adicionar novos conceitos ou atualizar referências de configuração.

---

## Audiência

| Papel | O que fazer |
|-------|------------|
| **System Designer (N2)** | Instale via `ai:init` no setup. Use o assistente para entender como configurar brands e dimensões. |
| **Design Engineer (N3)** | Instale e use para diagnóstico de tokens e orientação de workflow de build. |
| **Component Author (N1+)** | O Knowledge Guide é principalmente para quem configura o engine — não é necessário para consumo de tokens. |

---

## Referências

- AI Skills Injection — skills de geração de código: [07-ai-skills-injection.md](./07-ai-skills-injection.md)
- Design.md — snapshot de contexto visual para IA: [08-design-file-format.md](./08-design-file-format.md)
- Deploy Safety Contracts — validação estrutural de tokens em CI: [09-deploy-safety-contracts.md](./09-deploy-safety-contracts.md)
- CLI Reference — todos os comandos: [../09-engineering/05-cli-reference.md](../09-engineering/05-cli-reference.md)
