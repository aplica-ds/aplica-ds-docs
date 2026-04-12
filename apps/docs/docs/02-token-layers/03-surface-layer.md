---
title: "Camada Surface (Surface Layer)"
lang: pt-BR
---

# Camada Surface (Surface Layer)

> **Data da documentação:** 2026-04-10
> **Foco:** Contexto de superfície, Positive/Negative e cálculos de inversão do Aplica DS.

## 1. Visão Geral e Definição Atual

A **Camada Surface (Surface Layer)** é a terceira etapa do processamento do *Aplica Theme Engine*. Após a paleta receber o seu pigmento na camada *Brand* e seu contraste de visão contextual na camada *Mode*, ela é avaliada de acordo com a área e relevo da tela em que está sendo aplicada: **Contexto de Superfície**.

As superfícies são áreas que agrupam e elevam componentes (ex: o fundo da tela, o fundo de um Modal, o fundo de um Dialog ou de um Card de destaque). Existem duas macro-superfícies no sistema:
- **Surface Positiva (Positive)**: É a superfície padrão majoritária, com o seu fluxo esperado (como componentes mais claros sob um fundo de tela branco/neutro claro, por exemplo).
- **Surface Negativa (Negative)**: Uma superfície invertida de alto impacto (ex: um grande Card ou Header com uma cor profunda no qual os botões e os textos internos precisam ser reconstruídos para não sumirem no escuro).

### A Lógica de Inversão Matemática
O Theme Engine automatiza o comportamento dos componentes quando eles adentram uma superfície de contraste oposto (Negative). A camada Surface instrui a inversão dos *nomenclaturas* primitivos da paleta da marca:
- O tom original `lowest` (o mais claro) comporta-se como `highest` (o mais escuro).
- O tom `lower` vira `higher`.
- O `low` vira `high`.
- O tom `default` e núcleo da identidade se mantém como `default`.

## 2. Mapeamento de Evolução e Contexto Histórico

Nos arquivos legados do Aplica Alpha e V1, não havia um conceito robusto e matemático automatizado de "superfícies". Naquela versão, quando um designer precisava de um "Botão Primário" em cima de um "Fundo Principal" e o mesmo botão dentro de um "Hero Banner Escuro", eles acabavam criando (e codificando no frontend) duas dezenas de novos tokens manuais (`btn-primary-on-dark`) e sobrecarregavam a estrutura com exceções de cores de texto.

A carga cognitiva para os desenvolvedores e designers dobrava a cada variação que dependia de uma superfície invertida, especialmente ao cruzar essas variáveis preexistentes com a ausência de um suporte oficial padronizado para o Dark Mode na época.

## 3. Decisões Técnicas Consolidadas

Com a vinda do Theme Engine V2, a implementação resolve estruturalmente esse fardo por meio do conceito nativo de `Surface`:

1. **Acréscimo de sufixos aos builds (-positive, -negative):**
   O compilador de temas distribui paletas compostas finalizadas. Por exemplo, uma mesma marca (*Corporate Theme*) gera o `corporate-light-positive`, `corporate-light-negative`, e as respectivas versões `dark`. 

2. **Contraste Perfeito em Qualidade `txtOn`:**
   Dessa forma, o cálculo embutido do motor assegura que, ao aplicar a cor `semantic.color.action.primary` internamente no card invertido, o desenvolvedor não precise criar uma cor `.tertiary` falsa. Ao trocar o provider daquele bloco no Frontend da biblioteca para o pacote lógico "negative", o motor de Surface reage injetando um `txtOn` invertido mantendo total consistencia WCAG de contraste sem o dev ter que atuar.

## 4. Regras Canônicas / Constraints

- **Tudo é Positivo por padrão:** Todo o sistema de design parte da premissa visual da superfície positiva. A exceção aplica-se estritamente quando há inversão programada com grandes respiros (como banners, sections institucionais dark, footers profundos).
- **A Relação Mode/Surface:** Vale lembrar que *Surface Negative* **NÃO** é o *Dark Mode*. Você pode usar um aplicativo que está setado perfeitamente no Light Mode, porém ele exibe um Header escuro invertido — esta mecânica é puramente de Surface Negative. E reciprocamente, pode existir componentes numa *Surface Positiva* dentro de uma experiência imersa no modo global *Dark Mode*. As camadas resolvem o papel ortogonal entre a preferência do dispositivo/sistema e a hierarquia visual da tela de forma separada.
