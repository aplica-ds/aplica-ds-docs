---
title: "Slash Commands"
lang: pt-br
---

# Slash Commands

## O que são

Após executar `theme-engine ai:init`, o Claude Code em qualquer workspace de consumidor passa a ter 6 slash commands de workflow guiado. Cada comando encapsula uma jornada completa — desde a orientação inicial até a construção de componentes — e lê os arquivos reais do workspace antes de responder.

Os comandos ficam instalados em `.claude/commands/` na raiz do workspace do consumidor.

---

## Os 6 comandos

### `/getting-started` — Jornada 1: Orientação inicial

**Audiência:** qualquer pessoa que acabou de instalar ou configurar o workspace.

O comando lê `docs/context/theme-engine-playbook.md` (arquitetura e CLI), depois lê os arquivos de configuração reais do workspace (`themes.config.json`, `aplica-theme-engine.config.mjs`) e responde com:

1. **O que existe** — brands configurados, caminhos de config, status do `dist/`.
2. **O que está faltando** — se não há config, recomenda `theme-engine init`; se há config mas `dist/` está vazio, recomenda `theme-engine build`.
3. **Próximo passo concreto** — um único comando CLI com justificativa.
4. **AI commands disponíveis** — lista os 6 slash commands para que o usuário saiba o que pode pedir.

> O comando nunca inventa nomes de brand ou caminhos de token. Só reporta o que leu.

---

### `/configure-visual` — Jornada 2: Resultado visual

**Audiência:** System Designer que quer um resultado visual específico (hover mais escuro, dark mode mais saturado, texto legível em superfície colorida).

O comando mapeia a intenção visual para a `config key` correta usando a referência do playbook, lê o arquivo de config do brand relevante, e propõe a mudança exata — arquivo, caminho da chave, e valor.

---

### `/engineering-integration` — Jornada 3: Integração em código

**Audiência:** Engenheiro de componentes ou frontend que precisa consumir tokens em código real.

Cobre:
- Como importar e usar CSS custom properties de `dist/css/`
- Como referenciar o JSON de tokens de `dist/json/`
- Consumo por plataforma (React, Vue, Svelte, CSS puro)
- Regras rígidas: nunca hardcodar valores pertencentes a tokens

---

### `/debug` — Jornada 4: Diagnóstico

**Audiência:** qualquer pessoa que viu algo errado nos tokens gerados.

Uso: `/debug hover color too similar to default`

O comando:
1. Lê a seção "Common diagnostics" do playbook.
2. Lê os arquivos de config e outputs relevantes para a categoria do problema.
3. Diagnostica com base nos dados reais — não em suposições.
4. Propõe **uma mudança de cada vez** com instrução de verificação.

**Categorias cobertas:**

| Problema | Config key investigada |
|----------|----------------------|
| Hover muito similar ao estado padrão | `interaction.dilution` |
| Dark mode desbotado | `options.darkModeChroma` |
| Texto ilegível em superfície colorida | `options.txtOnStrategy`, `generation.colorText` |
| Cor inesperada em elemento ghost | `options.ghostNormalTxtOnStrategy` |
| Build não atualiza após mudança de config | `themes.config.json`, `aplica-theme-engine.config.mjs` |
| Figma fora de sincronia | `data/$themes.json`, `data/$metadata.json` |

---

### `/explain-semantic <topic>` — Jornada 5: Educação

**Audiência:** qualquer pessoa que quer entender um conceito — não apenas resolver um problema.

Exemplos:
- `/explain-semantic modeResolution`
- `/explain-semantic dilution`
- `/explain-semantic txtOnStrategy`
- `/explain-semantic brand layer`

O comando lê o playbook e as fontes relevantes antes de explicar. Inclui o caminho do arquivo usado na resposta.

---

### `/build-component` — Jornada 6: Construção de componente

**Audiência:** Engenheiro que vai escrever código de componente com tokens Aplica.

O comando lê `docs/context/aplica-ui-integration.md` (contrato de tokens para UI) e `dist/json/<brand>-light-positive.json` (nomes reais das variáveis geradas) antes de escrever qualquer código. Nunca hardcoda valores — usa exclusivamente variáveis CSS de `dist/css/`.

---

## Playbook SSOT

Todos os 6 comandos referenciam `docs/context/theme-engine-playbook.md` como fonte primária. Este arquivo é instalado por `ai:init` e contém:

- Arquitetura em 5 camadas (Brand → Mode → Surface → Semantic → Foundation)
- Tabela de referência de config keys (11 chaves com descrição e localização)
- Tabela de comandos CLI (13 comandos com quando usar)
- Mapa de outputs do workspace após `theme-engine build`
- Matriz tópico → arquivo (para o agente saber onde ler antes de responder)
- 6 diagnósticos comuns com causa raiz e solução

---

## Como re-instalar após atualização do pacote

Os slash commands são versionados junto com o pacote. Após atualizar `@aplica/aplica-theme-engine`, re-execute:

```bash
theme-engine ai:init
```

Os arquivos em `.claude/commands/` serão sobrescritos com a versão atualizada. O `CLAUDE.md` na raiz do workspace **não é sobrescrito** — se já existe, o comando pula e exibe uma mensagem informativa.

---

## Referências

- AI Skills Injection — visão geral e arquivos instalados: [07-ai-skills-injection.md](./07-ai-skills-injection.md)
- Knowledge Guide — skill conversacional complementar: [10-knowledge-guide.md](./10-knowledge-guide.md)
- Referência da CLI: [../09-engineering/05-cli-reference.md](../09-engineering/05-cli-reference.md)
