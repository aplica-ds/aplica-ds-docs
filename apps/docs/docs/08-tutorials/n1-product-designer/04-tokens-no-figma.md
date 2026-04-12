---
level: n1
id: N1-04
title: "Tokens no Figma — workflow do dia a dia"
prerequisites: ["N1-02", "N1-03"]
duration: "15 min"
lang: pt-BR
---

# N1-04 · Tokens no Figma — workflow do dia a dia

## Contexto

Você sabe o que são tokens e para que servem. Agora você precisa usá-los no Figma — o seu ambiente de trabalho diário.

Este tutorial mostra o fluxo completo: como os tokens chegam ao Figma, como aplicá-los em fills, paddings e texto, e o que fazer quando o token certo parece não existir.

---

## Como os tokens chegam ao Figma

Os tokens não são criados no Figma. Eles são **gerados pelo engine** e entregues ao Figma em formato JSON. O plugin **Tokens Studio** lê esses arquivos e os transforma em Variáveis nativas do Figma.

O fluxo é sempre neste sentido — nunca o contrário:

```
engine (config) → arquivos JSON → Tokens Studio → Variáveis do Figma
```

Quando um token muda no sistema (por exemplo, a cor primária da marca), o arquivo JSON é regenerado. O Tokens Studio atualiza as Variáveis. Todos os componentes que usam aquele token atualizam automaticamente.

---

## Parte 1 — Carregando os tokens

### O que você precisa

- Figma com o arquivo de design aberto
- Plugin **Tokens Studio for Figma** instalado
- Acesso ao arquivo JSON do tema (fornecido pelo time de DS ou pelo System Designer)

---

### 1.1 — Abrindo o Tokens Studio

Abra o plugin pelo menu **Plugins** → **Tokens Studio for Figma**.

<!-- ============================================================ -->
<!-- PRINT N1-04-01                                              -->
<!-- Tela do Figma com o menu Plugins aberto.                    -->
<!-- Destaque visual (seta ou círculo) sobre "Tokens Studio".    -->
<!-- Contexto: arquivo Figma aberto, qualquer frame vazio.       -->
<!-- ============================================================ -->

> **[PRINT N1-04-01]**  
> _Menu Plugins do Figma aberto, com "Tokens Studio for Figma" em destaque._

---

### 1.2 — Carregando o arquivo JSON

Na tela inicial do Tokens Studio, clique em **Settings** (ícone de engrenagem) → **Add New Storage** → **Local/URL**.

Cole o caminho ou URL do arquivo JSON do tema — por exemplo, `aplica_joy-light-positive.json`.

<!-- ============================================================ -->
<!-- PRINT N1-04-02                                              -->
<!-- Painel do Tokens Studio aberto.                             -->
<!-- Aba Settings visível, com opção "Add New Storage" em        -->
<!-- destaque. O campo de URL/path preenchido com um nome        -->
<!-- fictício (ex: "aplica-joy"). Não mostrar dados reais.       -->
<!-- ============================================================ -->

> **[PRINT N1-04-02]**  
> _Painel Tokens Studio aberto na aba Settings, com o campo de configuração de storage preenchido._

---

### 1.3 — Sincronizando as variáveis nativas do Figma

Após carregar o JSON:

1. Na aba **Sets**, selecione o conjunto do tema (ex: `aplica_joy-light-positive`)
2. Clique no ícone de **Figma Variables** (ícone de losango com setas)
3. Selecione **Create/Update Variables**

O plugin vai criar coleções de Variáveis organizadas por camada. O processo leva alguns segundos.

<!-- ============================================================ -->
<!-- PRINT N1-04-03                                              -->
<!-- Painel Tokens Studio na aba Sets.                           -->
<!-- Um conjunto de tokens selecionado (checkmark visível).      -->
<!-- O botão/ícone "Figma Variables" em destaque.                -->
<!-- Se possível, mostrar o dropdown com "Create/Update          -->
<!-- Variables" como opção ativa.                                -->
<!-- ============================================================ -->

> **[PRINT N1-04-03]**  
> _Tokens Studio com conjunto selecionado e ação "Create/Update Variables" em destaque._

---

### 1.4 — Confirmando as coleções criadas

Após a sincronização, abra **Figma Variables** pelo painel Assets (ícone de losango na barra lateral direita). Você verá coleções criadas automaticamente.

As coleções principais são:
- **semantic** — todos os tokens de interface (a camada que você vai usar)
- **foundation** — os atalhos curtos (`bg.primary`, `txt.body`)
- **brand**, **mode**, **surface** — camadas internas (não usar em componentes diretamente)

<!-- ============================================================ -->
<!-- PRINT N1-04-04                                              -->
<!-- Painel de Figma Variables aberto (não o Tokens Studio).     -->
<!-- Mostrar as coleções criadas: "semantic", "foundation",      -->
<!-- "brand", etc. A coleção "semantic" ou "foundation"          -->
<!-- expandida para mostrar algumas variáveis dentro.            -->
<!-- Contexto: painel lateral direito do Figma.                  -->
<!-- ============================================================ -->

> **[PRINT N1-04-04]**  
> _Painel Figma Variables com as coleções criadas pelo Tokens Studio. Coleção "foundation" expandida mostrando alguns aliases._

---

## Parte 2 — Aplicando tokens em cor

### 2.1 — Aplicando um token de cor em um fill

Crie um retângulo. No painel de propriedades à direita, clique na cor do fill (o quadrado colorido).

Na janela de cor, troque para a aba **Libraries** ou clique no ícone de losango (**Variables**) — a interface varia levemente dependendo da versão do Figma.

<!-- ============================================================ -->
<!-- PRINT N1-04-05                                              -->
<!-- Janela de seleção de cor aberta no Figma.                   -->
<!-- O ícone de Variables (losango) visível e em destaque.       -->
<!-- Contexto: um retângulo selecionado, painel de fill aberto.  -->
<!-- ============================================================ -->

> **[PRINT N1-04-05]**  
> _Janela de seleção de cor com o ícone de Variables destacado, antes de abrir o seletor de variáveis._

Clique no ícone de Variables. Aparece o seletor de variáveis. Navegue até a coleção **foundation** → **bg** para ver os aliases de fundo.

<!-- ============================================================ -->
<!-- PRINT N1-04-06                                              -->
<!-- Seletor de variáveis do Figma aberto.                       -->
<!-- Coleção "foundation" expandida, subgrupo "bg" visível.      -->
<!-- Algumas variáveis listadas: bg.primary, bg.weak, bg.brand.  -->
<!-- Destaque visual na variável "bg.primary" sendo selecionada  -->
<!-- (hover ou clique).                                          -->
<!-- ============================================================ -->

> **[PRINT N1-04-06]**  
> _Seletor de variáveis mostrando a coleção foundation → bg, com as opções de fundo disponíveis._

Após selecionar `foundation.bg.primary`, o fill do retângulo assume a cor do token. O ícone de losango aparece ao lado do valor de cor no painel, indicando que está vinculado a uma variável.

<!-- ============================================================ -->
<!-- PRINT N1-04-07                                              -->
<!-- O retângulo selecionado com o fill vinculado a uma          -->
<!-- variável. No painel de propriedades (direita), o fill       -->
<!-- mostra um ícone de losango ao lado da cor, com o nome       -->
<!-- "bg.primary" ou similar visível.                            -->
<!-- ============================================================ -->

> **[PRINT N1-04-07]**  
> _Retângulo com fill vinculado a variável — ícone de losango e nome do token visíveis no painel de Fill._

---

### 2.2 — Usando tokens de cor para texto (o par txtOn)

Crie um texto sobre o retângulo. O token de cor do texto deve ser o **par correspondente ao fundo**.

Regra: se o fundo usa `foundation.bg.primary`, o texto deve usar `foundation.txt.on-primary` — não `foundation.txt.body`.

<!-- ============================================================ -->
<!-- PRINT N1-04-08                                              -->
<!-- Dois elementos: o retângulo com fundo "bg.primary" e um     -->
<!-- texto sobre ele.                                            -->
<!-- O texto selecionado, com o seletor de variáveis aberto na   -->
<!-- coleção "foundation" → "txt", mostrando as opções           -->
<!-- txt.body, txt.title, txt.on-primary etc.                    -->
<!-- Destaque em "txt.on-primary" como a escolha correta.       -->
<!-- ============================================================ -->

> **[PRINT N1-04-08]**  
> _Seletor de variáveis aberto para o fill de texto, coleção foundation → txt, com "on-primary" destacado como a escolha correta para texto sobre bg.primary._

---

## Parte 3 — Aplicando tokens em espaçamento

### 3.1 — Padding via Auto Layout

Selecione um frame com Auto Layout. No painel de propriedades, clique no ícone de losango ao lado do campo de padding horizontal ou vertical.

<!-- ============================================================ -->
<!-- PRINT N1-04-09                                              -->
<!-- Um frame com Auto Layout selecionado.                       -->
<!-- No painel de propriedades (lado direito), a seção de        -->
<!-- Auto Layout visível com os campos de padding.               -->
<!-- Ícone de losango ao lado de um campo de padding em          -->
<!-- destaque (hover ou círculo), indicando que é possível       -->
<!-- vincular uma variável.                                       -->
<!-- ============================================================ -->

> **[PRINT N1-04-09]**  
> _Frame com Auto Layout selecionado, painel de propriedades mostrando os campos de padding com o ícone de variável em destaque._

Clique no losango. O seletor de variáveis abre. Navegue até **foundation** → **spacing** (ou **semantic** → **dimension** dependendo de como o tema foi configurado).

<!-- ============================================================ -->
<!-- PRINT N1-04-10                                              -->
<!-- Seletor de variáveis aberto para o campo de padding.        -->
<!-- Coleção "foundation" → "spacing" expandida, mostrando       -->
<!-- opções como spacing.nano, spacing.micro, spacing.small,     -->
<!-- spacing.medium etc.                                          -->
<!-- Destaque em "spacing.small" ou "spacing.medium" sendo       -->
<!-- selecionado.                                                 -->
<!-- ============================================================ -->

> **[PRINT N1-04-10]**  
> _Seletor de variáveis para padding com coleção foundation → spacing expandida e opções de tamanho visíveis._

Após vincular, o campo de padding exibe o ícone de losango e o valor correspondente ao token.

<!-- ============================================================ -->
<!-- PRINT N1-04-11                                              -->
<!-- Frame com Auto Layout. Painel de propriedades mostrando     -->
<!-- padding vinculado a variável — ícone de losango visível     -->
<!-- ao lado do valor de padding, com o nome "spacing.small"     -->
<!-- ou similar indicado.                                         -->
<!-- ============================================================ -->

> **[PRINT N1-04-11]**  
> _Frame com padding vinculado a variável — ícone de losango e nome do token visíveis no painel de Auto Layout._

---

## Parte 4 — Aplicando estilos de tipografia

Estilos tipográficos compostos são aplicados de forma diferente — não como variáveis individuais, mas como **Text Styles** do Figma.

Selecione um elemento de texto. No painel de propriedades, clique no nome do estilo atual (onde aparece o nome da fonte) para abrir o seletor de estilos.

<!-- ============================================================ -->
<!-- PRINT N1-04-12                                              -->
<!-- Texto selecionado. No painel de propriedades, a seção de    -->
<!-- tipografia com o campo de estilo visível (o ícone de        -->
<!-- quatro quadrados ou o nome do estilo atual).                -->
<!-- O seletor de estilos aberto, mostrando grupos de estilos:   -->
<!-- "Heading", "Display", "Content/Body", "Action", "Code".     -->
<!-- Destaque visual em um estilo como "heading/title_3" ou      -->
<!-- "content/body".                                             -->
<!-- ============================================================ -->

> **[PRINT N1-04-12]**  
> _Seletor de Text Styles aberto com os grupos de estilos do sistema visíveis: Heading, Display, Content, Action, Code._

Após selecionar o estilo, a tipografia do elemento assume automaticamente a família, tamanho, peso e entrelinha corretos.

---

## Parte 5 — Trocando de modo (light/dark)

Com variáveis vinculadas, a troca entre light e dark é instantânea.

Selecione o frame ou a página que contém o componente. No painel de propriedades, localize a seção **Layer** ou **Frame**. Clique em **Change variable mode** (botão com ícone de losango/seta).

<!-- ============================================================ -->
<!-- PRINT N1-04-13                                              -->
<!-- Frame ou página selecionada no Figma.                       -->
<!-- Painel de propriedades mostrando a seção de modos de        -->
<!-- variável (Variable Mode). O dropdown de modo visível com    -->
<!-- as opções: "Light" e "Dark" (ou similar baseado nos         -->
<!-- modos configurados).                                         -->
<!-- ============================================================ -->

> **[PRINT N1-04-13]**  
> _Seletor de Variable Mode no painel de propriedades, com as opções Light e Dark visíveis._

<!-- ============================================================ -->
<!-- PRINT N1-04-14                                              -->
<!-- Comparação lado a lado (ou antes/depois) do mesmo           -->
<!-- componente em Light Mode e Dark Mode.                        -->
<!-- Ambos usando os tokens corretos — fundo e texto mudam,      -->
<!-- layout permanece idêntico.                                   -->
<!-- Pode ser um card simples com título, texto e botão.         -->
<!-- ============================================================ -->

> **[PRINT N1-04-14]**  
> _O mesmo componente exibido em Light Mode (esquerda) e Dark Mode (direita) — layout idêntico, cores adaptadas automaticamente._

---

## Parte 6 — O que fazer quando o token certo não existe

Às vezes você procura um token e não encontra exatamente o que precisa. Há uma ordem certa para resolver isso:

### Passo 1 — Procure na Foundation antes do Semantic

A Foundation tem aliases simples (`bg.primary`, `txt.body`). Antes de ir ao Semantic, verifique se o atalho já existe.

### Passo 2 — Se não existe na Foundation, procure no Semantic

O Semantic tem todos os tokens. Use o seletor de variáveis e navegue pela coleção `semantic`. O nome do token descreve seu propósito: `semantic.color.interface.function.primary.normal.background`.

### Passo 3 — Se não existe no Semantic, fale com o System Designer

O token que você precisa pode não existir ainda. Isso é uma informação valiosa — significa que o sistema precisa crescer naquele ponto.

**Nunca faça isso:**
- Usar um hex solto no lugar do token ausente
- Criar uma variável no Figma manualmente
- Usar um token de outra camada (Brand, Mode ou Surface) diretamente

Criar um hex solto ou uma variável manual é o equivalente a furar o contrato do sistema. Na próxima atualização, esse valor vai ficar para trás enquanto tudo ao redor muda.

<!-- ============================================================ -->
<!-- PRINT N1-04-15                                              -->
<!-- Comparação lado a lado no painel Fill de dois elementos:    -->
<!-- - Esquerda: um elemento com hex solto (#C40145) — sem       -->
<!--   ícone de losango, campo mostrando apenas a cor.           -->
<!-- - Direita: um elemento com variável vinculada — ícone de    -->
<!--   losango visível, nome do token indicado.                  -->
<!-- Título acima dos dois: "Errado" e "Correto".                -->
<!-- ============================================================ -->

> **[PRINT N1-04-15]**  
> _Comparação no painel Fill: à esquerda, hex solto sem vínculo (errado); à direita, variável vinculada com nome do token (correto)._

---

## Agora você tenta

Você precisa criar um banner informativo simples no Figma:

```
┌─────────────────────────────────────────────┐
│  ℹ  Sua solicitação está em análise.        │
└─────────────────────────────────────────────┘
```

Usando apenas o que aprendeu neste tutorial:

1. Crie um frame com Auto Layout
2. Aplique o token de fundo correto para um banner informativo (dica: `feedback.info`)
3. Aplique o token de texto correto para texto sobre aquele fundo
4. Defina o padding horizontal e vertical com tokens de espaçamento
5. Aplique o estilo de tipografia correto para o texto (não é Heading nem Display)
6. Troque para Dark Mode — o banner deve adaptar sem nenhuma edição

**Resultado esperado:**
- Fundo: `semantic.color.interface.feedback.info.default.background` ou `foundation.bg.feedback.info`
- Texto: o `txtOn` correspondente ao nível de fundo usado
- Padding: `spacing.small` (24px) horizontal, `spacing.micro` (8px) vertical
- Tipografia: estilo do grupo Content (ex: `body_small` ou `label`)
- Dark mode: ambas as cores trocam automaticamente sem edição manual

---

## Checkpoint

Ao fim deste tutorial você deve saber:

- [ ] Como os tokens chegam ao Figma (engine → JSON → Tokens Studio → Variáveis)
- [ ] Como abrir o seletor de variáveis a partir de um campo de cor ou espaçamento
- [ ] A diferença entre a coleção Foundation (atalhos) e Semantic (completo)
- [ ] Como usar o par bg + txtOn corretamente
- [ ] Como vincular tokens de espaçamento em campos de padding no Auto Layout
- [ ] Como aplicar estilos de tipografia compostos
- [ ] Como trocar entre Light e Dark Mode usando Variable Modes
- [ ] O que fazer (e o que nunca fazer) quando o token certo não existe

---

## Próximo passo

[N1-05 · Acessibilidade por construção](./05-acessibilidade-por-construcao.md)

Você agora aplica tokens no Figma com confiança. O próximo tutorial explica por que essa prática de usar o par correto de tokens não é só consistência — é o que garante acessibilidade automática para qualquer usuário.

---

## Lista consolidada de prints necessários

| ID | Onde aparece | O que capturar | Prioridade |
|----|-------------|----------------|-----------|
| N1-04-01 | Parte 1.1 | Menu Plugins → Tokens Studio em destaque | Alta |
| N1-04-02 | Parte 1.2 | Tokens Studio → Settings → Add New Storage | Alta |
| N1-04-03 | Parte 1.3 | Tokens Studio → aba Sets → ação Create/Update Variables | Alta |
| N1-04-04 | Parte 1.4 | Figma Variables com coleções criadas, foundation expandida | Alta |
| N1-04-05 | Parte 2.1 | Janela de cor com ícone Variables em destaque | Alta |
| N1-04-06 | Parte 2.1 | Seletor de variáveis, foundation → bg expandida | Alta |
| N1-04-07 | Parte 2.1 | Painel Fill com ícone de losango + nome do token | Alta |
| N1-04-08 | Parte 2.2 | Seletor de variáveis para texto, foundation → txt, on-primary destacado | Alta |
| N1-04-09 | Parte 3.1 | Frame Auto Layout, campo padding com ícone de variável | Média |
| N1-04-10 | Parte 3.1 | Seletor de variáveis, foundation → spacing expandida | Média |
| N1-04-11 | Parte 3.1 | Painel Auto Layout com padding vinculado a variável | Média |
| N1-04-12 | Parte 4 | Seletor de Text Styles com grupos Heading/Display/Content/Action/Code | Alta |
| N1-04-13 | Parte 5 | Seletor de Variable Mode com opções Light/Dark | Alta |
| N1-04-14 | Parte 5 | Componente lado a lado em Light e Dark Mode | Alta |
| N1-04-15 | Parte 6 | Comparação hex solto vs variável vinculada no painel Fill | Alta |

**Total: 15 prints. 12 de alta prioridade, 3 de média.**

---

## Referências

- Vocabulário de cores: [N1-02 · O vocabulário de cores](./02-vocabulario-de-cores.md)
- Escala dimensional: [N1-03 · Espaçamento e tipografia](./03-escala-dimensional.md)
- Workflow de sincronização completo: [02-designer-workflow.md](../../04-theme-engine/02-designer-workflow.md)
