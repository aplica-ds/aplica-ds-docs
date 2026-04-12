---
level: n2
id: N2-03
title: "O paradigma Config-First — quando o Figma passa a ser consumidor"
prerequisites: ["N2-01"]
duration: "15 min"
lang: pt-BR
---

# N2-03 · O paradigma Config-First

## Contexto

Na maioria dos sistemas de design, o Figma é o ponto de partida. O designer escolhe as cores, define os estilos, organiza a biblioteca. O desenvolvedor então traduz essas decisões para código.

No Aplica DS, o fluxo é invertido. Este tutorial explica por que essa inversão existe, o que ela muda na prática, e quais decisões ainda pertencem ao Figma.

---

## Conceito

### O problema do Figma como fonte de verdade

Quando o Figma é a fonte de verdade, existe um problema estrutural: **qualquer decisão tomada no Figma precisa ser manualmente traduzida para todos os outros contextos** — código, mobile, e-mail, documentação.

Se a cor primária muda no Figma, alguém precisa atualizar o código. Se o código é atualizado sem passar pelo Figma, o Figma fica desatualizado. Quem está certo? A resposta honesta é: ninguém sabe com certeza.

Além disso, o Figma não sabe nada sobre dark mode, multi-plataforma ou multi-marca. Você pode ter uma versão dark criada à mão, uma versão mobile que é uma cópia independente, e tokens que divergiram silenciosamente ao longo dos meses.

### A inversão: código como fonte de verdade

No paradigma Config-First, a decisão de design começa no arquivo de configuração do tema (`*.config.mjs`). Lá você declara:

- As cores da marca (um hex por papel semântico)
- A tipografia (famílias e pesos)
- As opções do pipeline (estratégia de txtOn, saturação do dark mode)

O engine lê esse arquivo e gera automaticamente:
- Todas as camadas (Brand → Mode → Surface → Semantic → Foundation)
- Todos os formatos de output (CSS, JSON para Figma, módulos JS, TypeScript)
- Todos os temas (light/dark × positive/negative)

O Figma recebe os tokens via JSON — não cria os tokens. Ele os **consome**.

### O que isso muda na prática

| Antes (Figma como fonte) | Depois (Config-First) |
|-------------------------|-----------------------|
| Designer escolhe cores no Figma | Designer declara a cor no config |
| Dev "traduz" o Figma para código | Dev carrega o CSS gerado pelo engine |
| Dark mode criado manualmente | Dark mode gerado pelo pipeline |
| Múltiplas marcas = múltiplos Figmas | Múltiplas marcas = múltiplos configs |
| Inconsistência gradual garantida | Consistência matemática garantida |

### O que o Figma ainda decide

A inversão não significa que o Figma perde relevância. Ele ainda é o espaço certo para:

- **Composição e layout** — como os componentes se organizam na tela
- **Hierarquia visual** — quais elementos são mais proeminentes
- **Fluxo e navegação** — a sequência de telas e estados
- **Prototipagem** — simular a interação antes da implementação
- **Especificação de componentes** — documentar o comportamento de novos componentes

O Figma é o espaço de **decisão compositiva**. O config é o espaço de **decisão de identidade visual**.

---

## Exemplo guiado

### Simulando uma mudança de cor de marca

Imagine que o cliente decide mudar a cor primária de ação de `#C40145` para `#D01050`.

**No paradigma antigo:**
1. Designer abre o Figma, muda o estilo de cor
2. Exporta um relatório de componentes afetados
3. Dev atualiza a variável no CSS
4. Dev atualiza a variável no React Native
5. Dev atualiza o token no JSON de e-mail
6. Alguém verifica o dark mode (provavelmente esquece)
7. Semanas depois: algum produto ainda está com a cor antiga

**No paradigma Config-First:**
1. System Designer abre o `*.config.mjs` e muda o hex de `acao_primaria`
2. Roda `npm run build:themes`
3. O Figma recebe os novos JSONs e atualiza automaticamente
4. O CSS, ESM, CJS e TypeScript são gerados com os novos valores
5. Dark mode, multi-marca, mobile — tudo regenerado

Uma mudança, um lugar, todas as consequências calculadas.

### O ciclo completo de uma decisão de design

```
1. DECISÃO
   System Designer declara no config:
   "A cor de ação primária desta marca é #D01050"

2. GERAÇÃO
   npm run build:themes
   Engine gera: paleta completa, dark mode, neutrals, todos os formatos

3. DISTRIBUIÇÃO
   JSON → Figma (via Tokens Studio)
   CSS  → Web
   ESM  → React / Vue
   CJS  → Node.js
   JSON → Documentação

4. CONSUMO
   Figma: designer aplica tokens nos componentes
   Web: dev usa var(--semantic-color-*)
   Mobile: dev usa os valores do ESM

5. VALIDAÇÃO
   Product Designer verifica no Figma
   Engineer verifica no browser
   Se algo precisa mudar → volta ao passo 1
```

---

## Agora você tenta

Identifique, para cada decisão abaixo, onde ela deve ser tomada no paradigma Config-First:

1. A cor do botão "Salvar" está muito escura — precisa ficar mais clara
2. O espaçamento entre os cards da home está muito apertado
3. Um novo produto quer usar verde como cor de marca
4. O alerta de erro precisa de um tom vermelho mais intenso (secondary)
5. O título da página está com a fonte errada
6. Descobriu-se que o dark mode do componente de badge está com hex hardcoded

**Resultado esperado:**

| Decisão | Onde resolver |
|---------|---------------|
| Botão muito escuro | Config (`txtOnStrategy` ou mapping de cor) — é uma decisão de identidade |
| Espaçamento apertado | Figma (composição) → se persistente, config (Dimension scale) |
| Nova cor de marca verde | Config — novo `*.config.mjs` para o novo produto |
| Tom vermelho mais intenso | Config — ajustar o hex de `danger_secondary` |
| Fonte do título errada | Config — `typography.fontFamilies.main` |
| Hex hardcoded no badge | Código do componente — refatorar para usar token Semantic |

---

## Checkpoint

Ao fim deste tutorial você deve saber:

- [ ] Por que o Figma como fonte de verdade cria problemas de sincronização
- [ ] O que Config-First significa: o config é a origem, o Figma é o consumidor
- [ ] O ciclo completo: declaração no config → build → distribuição → consumo
- [ ] Quais decisões ainda pertencem ao Figma (composição, fluxo, prototipagem)
- [ ] Como rastrear uma mudança de cor do config até o Figma

---

## Próximo passo

[N2-05 · Cores de produto — crescimento responsável](./05-cores-de-produto.md)

Você entende o paradigma e o pipeline. O próximo passo é aprender sobre a área mais perigosa do sistema: as cores de produto. Por que cada nova cor de produto custa muito mais do que parece?

---

## Referências

- O paradigma Config-First: [02-designer-workflow.md](../../04-theme-engine/02-designer-workflow.md)
- O que é o Theme Engine: [01-what-is-theme-engine.md](../../04-theme-engine/01-what-is-theme-engine.md)
- Pipeline de build: [04-build-pipeline.md](../../04-theme-engine/04-build-pipeline.md)
