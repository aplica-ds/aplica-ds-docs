---
title: "Trilhas de Estudo — Espiral de Aprendizado"
lang: pt-BR
---

# Trilhas de Estudo — Espiral de Aprendizado

Para garantir que o Aplica DS seja escalável e compreensível, adotamos a metodologia pedagógica da **Espiral de Aprendizado**. Isso significa que o conhecimento não é entregue de uma vez em toda sua complexidade técnica, mas sim em camadas de profundidade que respeitam o papel de cada profissional no ecossistema.

---

## Como usar esta documentação

Dependendo do seu papel no time, você deve começar por trilhas diferentes.

### 🌀 Nível 1 — Product Designers (Consumidores)
**Foco:** Velocidade, consistência e aplicação prática.

Se você constrói telas, fluxos e protótipos, seu objetivo é entender **como usar** os tokens para garantir que o que você desenha no Figma seja perfeitamente implementado.

**O que você deve ler primeiro:**
1.  [A Camada Foundation](../02-token-layers/05-foundation-layer.md): Os tokens simplificados para o dia a dia.
2.  [Workflow de Design](../04-theme-engine/02-designer-workflow.md): Como sincronizar o Figma com o Engine.
3.  [Cores Semânticas](../03-visual-foundations/01-colors.md): Entender o propósito das cores (Feedback, Brand e Product).
4.  [Espaçamento e Dimensionamento](../03-visual-foundations/03-spacing-sizing.md): Uso da escala `minor/normal/major`.

---

### 🌀 Nível 2 — System Designers (Arquitetos)
**Foco:** Engenharia de sistemas, governança e manutenção.

Se você é responsável por criar novos temas, manter a biblioteca de componentes ou evoluir o racional técnico do DS, seu objetivo é entender o **porquê** por trás das decisões e como o **motor** funciona.

**O que você deve ler primeiro:**
1.  [Arquitetura de Tokens](../01-design-tokens-fundamentals/01-token-architecture.md): O pipeline de 5 camadas em profundidade.
2.  [O que é o Theme Engine](../04-theme-engine/01-what-is-theme-engine.md): O racional técnico do gerador.
3.  [Matemática e Algoritmos](../03-visual-foundations/06-mathematics-and-algorithms.md): Racionais de OKLCh e Escalas Fibonacci.
4.  [O token txt — contrato de cor expandido](../02-token-layers/07-txt-token.md): Contrato de 4 partes (background / txtOn / border / txt) introduzido na 3.6.0.
5.  [Filosofia de Overrides](../00-overview/01-aplica-ds-vision.md#filosofia-de-overrides-sobreposições): Como evoluir o sistema sem quebrá-lo.

---

## O Ciclo da Espiral

A Espiral de Aprendizado incentiva que um Product Designer possa, com o tempo, aprofundar-se nos temas de Nível 2 caso deseje contribuir para o sistema. Da mesma forma, um System Designer deve sempre garantir que suas decisões técnicas resultem em uma experiência simplificada de Nível 1 para o restante do time.

> [!TIP]
> **Comece simples.** Se você é novo no sistema, foque em dominar o Nível 1. A complexidade do Nível 2 existe para proteger a simplicidade do Nível 1.
