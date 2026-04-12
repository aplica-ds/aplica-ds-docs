---
title: "Camada Mode (Mode Layer)"
lang: pt-BR
---

# Camada Mode (Mode Layer)

> **Data da documentação:** 2026-04-10
> **Foco:** Evolução e estruturação dos tokens de Modo (Light/Dark) do Aplica DS.

## 1. Visão Geral e Definição Atual

A **Camada Mode (Mode Layer)** é a segunda etapa arquitetural do *Aplica Theme Engine*. Sua única responsabilidade é pegar a paleta bruta extraída da camada *Brand Layer* e submetê-la ao contexto de exibição ou necessidades de acessibilidade visual.

Embora o uso mais comum seja o **Modo Claro (Light Mode)** e **Modo Escuro (Dark Mode)**, o conceito de *Mode* na arquitetura do *Aplica Design* é mais amplo do que apenas "claro ou escuro". Ele representa o *contexto visual*. Isso significa que outros modos de exibição focados em acessibilidade habitam esta camada, por exemplo:
- **High Contrast**: Onde as cores são reajustadas para terem contraste máximo.
- **Colorblind**: Onde a paleta se ajusta para suprir deficiências de visão de cores ( Daltonismo, etc.).

Essa camada mantém exatamente a mesma estrutura base para todos os temas, garantindo que os componentes não precisem de refatoração para suportar múltiplos contextos: em vez disso, o *engine* manipula dinamicamente como os índices da paleta *Brand* devem ser renderizados naquele modo específico.

### Funcionalidades Core no Theme Engine:
- **Redução de saturação automática (Chroma)**: O Theme Engine possui um configurador de *darkModeChroma* (ex: `0.85` por padrão), que entende que fundos escuros precisam de cores menos saturadas para serem visualizados confortavelmente sem "irritar" os olhos.
- **Inversão de curva tonal**: O modo escuro mapeia matematicamente a paleta de 10-190 da marca, puxando versões "mais escuras" ou desaturadas em locais onde o tema claro usaria tons vibrantes.

## 2. Mapeamento de Evolução e Contexto Histórico

*Sintetizando os desafios de implantação de um tema escuro nas versões Alpha e V1.*

Nas fases mais antigas (Alpha e V1), a introdução do modo escuro foi um desafio conceitual de design. Como visto nas documentações legadas (ex: categorias de cores em detalhe - *Contrast / Deep*), recomendava-se que *designs que utilizam estruturas em modo escuro tivessem como base uma mescla entre a marca e os tons neutros mais profundos*.

**As dores do legado:**
- Os times gerenciavam o *Light Mode* e *Dark Mode* de forma duplicada no código e no Figma. Cada nova cor da marca demandava um recálculo manual para criar a sua versão ideal "menos saturada".
- A cor "primária" do modo escuro não deveria ser numericamente a mesma do modo claro por questões de acessibilidade visual, gerando inconsistências quando isso não era feito de forma matemática e escalável.

## 3. Decisões Técnicas Consolidadas

Ao estabelecer a **Mode Layer** na V2 através do novo Theme Engine, as seguintes abordagens foram formalizadas:

1. **Separação Obrigatória de Responsabilidades:**
   Se um elemento "Botão Primário" precisa trocar visualmente entre claro e escuro, isso não é definido nem na camada de componente e nem na camada Brand. É o *Mode Layer* que intercepta a variável (ex: `theme.color.brand.first`) e gera o espelho `light` e `dark`.

2. **Croma (Saturação) Ajustável de Forma Global:**
   Para resolver o desconforto visual provocado por cores muito brilhantes em fundos pretos (típico de conversões erradas para Dark Mode), todo token do Mode `dark` passa pelo filtro de reescrita de croma (ex: `darkModeChroma: 0.85` faz as cores perderem 15% de saturação nativamente, mantendo as matizes idênticas).

3. **Modo Escuro como Ponto de Vista, não como Cor Adicional:**
   O Dark Mode não é uma "nova cor de marca" registrada. O Theme Engine simplesmente olha para a mesmíssima paleta primitiva já registrada na ferramenta e cria as alocações reversas.

## 4. Regras Canônicas / Constraints

- **Single Source of Truth:** Engenheiros nunca devem declarar cores em hexadecimal diretamente se o componente precisar suportar Dark Mode nativamente; sempre consumir da *Semantic* (ou *Foundation*), que já carrega o modo resolvido por debaixo dos panos.
- **Contrast Check:** A Camada Mode já lida de ponta a ponta em manter a regra da taxa de contraste. As escolhas de desaturação (chroma) são projetadas para não ferir o WCAG em relação à legibilidade das tipografias (*txtOn*).
