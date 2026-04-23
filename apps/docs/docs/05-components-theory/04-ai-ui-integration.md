---
title: "AI UI Integration Program"
lang: pt-br
---

# AI UI Integration Program

## O que é

O AI UI Integration Program é o contrato formal que governa como agentes de IA consomem design tokens Aplica ao gerar, estilizar ou revisar componentes de UI. Define as regras, hierarquia de camadas, archetypes de componente e requisitos de validação que tornam o código de componente gerado por IA confiável.

O programa foi introduzido na versão 3.5.x, quando o engine adicionou suporte estruturado para integrações de editor de IA (`ai:init`), Foundation Styles e um conjunto de archetypes de componente validados.

---

## Princípio central: os outputs gerados são a lei

Um agente de IA nunca deve adivinhar:

- valores de tokens
- nomes de variáveis de tokens
- padrões de nomenclatura
- formatos de output
- prefixos de variáveis CSS

Antes de escrever qualquer código de UI ou estilo, o agente deve inspecionar os outputs compilados disponíveis no workspace do consumidor ativo:

```
dist/                                              ← valores de tokens resolvidos em todos os formatos
data/semantic/default.json                         ← fonte da camada semântica
data/foundation/{brand}/styles/typography_styles.json
data/foundation/{brand}/styles/elevation_styles.json
```

---

## Regra de consumo de camadas

| Camada | Quando usar |
|--------|------------|
| **Semantic** | Padrão para toda estilização de componentes. Expressa intenção. Sobrevive corretamente a mudanças de tema. |
| **Foundation Styles** | Preferido para tipografia e elevação — use classes CSS geradas em vez de montar tokens atômicos. |
| **Foundation tokens** | Quando um alias claro já existe e melhora a legibilidade sem alterar a intenção. |
| **Brand / Mode / Surface** | Nunca usar diretamente em código de componente. |

### Por que Foundation Styles são preferidas à composição atômica

Tipografia envolve sete propriedades. Elevação envolve múltiplos parâmetros de sombra. Um agente que monta essas propriedades a partir de tokens semânticos individuais pode produzir combinações sintaticamente válidas mas semanticamente incorretas — por exemplo, parear um tamanho de fonte `large` com um line-height `close` que foi criado para `medium`. Foundation Styles codificam a composição validada uma vez.

**Aplique classes `typography-*`** para toda estilização de texto. Nunca decomponha font-family, size, weight, line-height e letter-spacing individualmente.

**Aplique classes `elevation-*`** para sombras. Nunca hardcode valores de `box-shadow`.

### Token txt para texto em conteúdo (desde 3.6.0)

Quando um componente precisa de uma **cor de texto em fluxo de conteúdo** (não texto sobre fundo colorido), use `foundation.txt.*` ou `semantic.color.*.txt.normal`:

```css
/* Texto sobre canvas referenciando a família de cor info */
color: var(--foundation-txt-info);

/* Ou diretamente via semantic */
color: var(--semantic-color-interface-feedback-info_default-normal-txt);
```

**Não** use tokens `txtOn` para texto sobre canvas — `txtOn` é desenhado para texto colocado sobre o `background` colorido do mesmo bloco. Usá-lo sobre canvas branco produzirá contraste incorreto.

---

## Archetypes de componente

O programa define modelos de decisão canônicos para sete tipos de componente:

| Archetype | Status |
|-----------|--------|
| Button | Ativo |
| Dialog | Ativo |
| Input | Ativo |
| Badge | Em validação |
| Select | Em validação |
| Card | Em validação |
| Tabs | Em validação |

Um archetype não é uma implementação específica de biblioteca. É um modelo de raciocínio reutilizável: dado um tipo de componente, como um agente deve pensar sobre suas decisões de tokens?

Todo componente deve ser decomposto nessas áreas de decisão:

- **Surface** — cor de fundo por papel semântico e estado
- **Content** — cores de texto e ícone
- **Border** — cor, espessura e raio (nunca hardcoded)
- **Focus** — anel de foco de teclado via tokens `interface.focus.*`
- **Disabled** — variação de opacidade ou cor, não valores personalizados
- **Feedback** — estados de sucesso, aviso, perigo via `interface.feedback.*`
- **Spacing** — apenas a partir de aliases de dimensão semântica confirmados
- **Typography** — via classes de Foundation Styles ou caminhos de token semântico sancionados
- **Elevation** — via classes de Foundation Styles ou tokens semânticos de elevação

---

## Regras rígidas

As seguintes regras são absolutas para todo trabalho de componente:

1. **Nunca hardcodar valores pertencentes a tokens.** Sem `px`, `hex`, `rgba()` ou `box-shadow` brutos, a menos que explicitamente solicitado pelo operador.
2. **Nunca adivinhar nomes de tokens.** Sempre leia o output compilado primeiro.
3. **Prefira estilos gerados sancionados.** Classes de `typography.css` e `elevation.css` antes de composição atômica.
4. **Use Semantic como camada padrão.** Tokens de Brand, Mode e Surface são internos — não para consumo de componentes.
5. **Nunca alterar silenciosamente generators, schemas ou `data/` gerado.** Qualquer mudança no comportamento do engine requer aprovação do operador.

---

## Regra de cor e interação

Ao escolher cores, raciocine por intenção semântica — não por memória visual:

1. Qual é o papel do componente? (ação, neutro, feedback, ambiente)
2. Qual estado está sendo estilizado? (default, hover, focus, active, disabled)
3. Qual ramo semântico carrega essa intenção?

Famílias de tokens para cor de componente:

- `interface.function.*` — controles interativos primário, secundário, ghost
- `interface.feedback.*` — estados de sucesso, aviso, perigo, informação
- `brand.ambient.*` — presença de marca decorativa (não para controles interativos)
- `color.text.*` — cores de tipografia

Não reduza o problema a "escolher um azul" ou "escolher um cinza."

---

## Regra de portal para bibliotecas headless UI

Bibliotecas como Base UI, Radix Primitives e Floating UI renderizam certos componentes (Dialog, Tooltip, Dropdown, Popover) via **portal** — anexado ao `document.body`, fora da raiz do app React. Propriedades CSS customizadas não cascateiam para cima, então se a classe de tema for aplicada apenas à raiz do app, os componentes renderizados via portal não recebem valores de tokens.

**Obrigatório:** aplique a classe de tema (ex: `aplica_joy-light-positive`) ao `document.body`:

```typescript
// main.tsx / _app.tsx / entry point
document.body.classList.add('aplica_joy-light-positive');
```

Isso deve ser tratado como um requisito de validação para componentes Dialog, Tooltip, Dropdown, Popover e Menu.

---

## Requisito de validação

Uma regra de consumo não é operacionalmente confiável até ser validada em uma implementação real em sandbox. O programa usa dois sandboxes:

| Sandbox | Papel |
|---------|-------|
| `test-sandbox/` (Base UI) | Sandbox de treinamento primário — exemplos canônicos de archetypes |
| Radix Primitives | Sandbox de paridade — verifica se o contrato não está acoplado ao Base UI |

Verificações de validação para cada archetype:

- Sem valores hardcoded pertencentes a tokens
- Propagação correta de tema (incluindo portais)
- Estados de interação corretos (hover, focus, active, disabled)
- Uso correto de camadas (Semantic, depois Foundation Styles)
- Uso correto do formato de output (CSS vars, ESM, etc.)

---

## Como o programa chega aos consumidores

O AI UI Integration Program chega aos workspaces de consumidor via o comando `ai:init`, que injeta quatro arquivos:

- `docs/context/aplica-ui-integration.md` — o guia base de integração para qualquer surface de IA
- `.cursor/rules/aplica-ui-integration.mdc` — regra do Cursor
- `.claude/skills/aplica-ui-integration/SKILL.md` — skill do Claude Code
- `.github/instructions/aplica-ui.instructions.md` — instruções do GitHub Copilot

Esses arquivos são atualizados a cada release do engine. Re-executar `ai:init` após uma atualização mantém a guidance atual.

---

## Limite: o que este programa não autoriza

O AI UI Integration Program governa documentação, implementações em sandbox, skills, templates e revisão de código. Ele **não** autoriza:

- Mudanças em descrições de tokens gerados
- Mudanças em schemas de geração
- Mudanças em scripts do engine
- Mudanças em outputs `data/` gerados
- Mudanças em contratos de output

Qualquer mudança no comportamento do engine deve ser proposta e aprovada pelo operador separadamente.

---

## Referências

- AI Skills Injection (como o programa chega aos workspaces de consumidor): [../04-theme-engine/07-ai-skills-injection.md](../04-theme-engine/07-ai-skills-injection.md)
- Foundation Styles (superficie de consumo preferida): [../04-theme-engine/06-foundation-styles.md](../04-theme-engine/06-foundation-styles.md)
- Contrato de tokens de componente: [01-component-token-contract.md](./01-component-token-contract.md)
