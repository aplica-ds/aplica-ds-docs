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
| `.cursor/rules/aplica-ui-integration.mdc` | Cursor | Arquivo de regra que é ativado ao editar arquivos de UI (`*.js`, `*.jsx`, `*.ts`, `*.tsx`, `*.css`, `*.html`, `*.vue`, `*.svelte`) |
| `.claude/skills/aplica-ui-integration/SKILL.md` | Claude Code | Skill acionada quando o usuário pede para construir ou estilizar componentes de UI |
| `.github/instructions/aplica-ui.instructions.md` | GitHub Copilot | Arquivo de instrução carregado pelo Copilot ao trabalhar no repositório |

Todos os arquivos são versionados dentro do pacote em `templates/ai-skills/`. O comando os copia literalmente para o workspace do consumidor.

---

## O que a orientação injetada cobre

Os arquivos de integração instruem o assistente de IA a:

1. **Ler `docs/context/aplica-ui-integration.md` antes de escrever qualquer código de UI ou estilo** — esta é a fonte de verdade única para o contrato de tokens do consumidor.
2. **Inspecionar os outputs compilados em `dist/`** para confirmar nomes exatos de variáveis antes de referenciá-los.
3. **Usar tokens semânticos como a camada padrão de componente** — nunca referenciar diretamente tokens de Brand, Mode ou Surface.
4. **Preferir classes de Foundation Styles em vez de montar tokens atômicos:**
   - Aplicar classes `typography-*` para toda estilização de texto (não font-size, font-weight, line-height individuais)
   - Aplicar classes `elevation-*` para sombras (não valores brutos de box-shadow)
5. **Nunca hardcodar valores pertencentes a tokens** (dimensões em `px`, cores em `hex`, `rgba()`, box-shadows brutos).
6. **Nunca adivinhar nomes de tokens** — sempre verificar a partir dos outputs compilados.

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

- Referência da CLI (lista completa de comandos): [../09-engineering/05-cli-reference.md](../09-engineering/05-cli-reference.md)
- Foundation Styles (caminho de consumo preferido): [06-foundation-styles.md](./06-foundation-styles.md)
- AI UI Integration Program: [../05-components-theory/04-ai-ui-integration.md](../05-components-theory/04-ai-ui-integration.md)
