---
title: "Camada Brand (Brand Layer)"
lang: pt-BR
---

# Camada Brand (Brand Layer)

> **Data da documentação:** 2026-04-10
> **Foco:** Evolução e estruturação dos Brand Tokens do Aplica DS.

## 1. Visão Geral e Definição Atual

A **Camada Brand (Brand Layer)** é a base fundamental da arquitetura do Aplica Theme Engine. É nesta etapa que declaramos a identidade visual pura da marca — suas cores e fontes —, que dão origem a todas as paletas subsequentes.

Atualmente, de acordo com as definições encontradas no `theme-engine` (como em `data/brand/theme_engine/_brand.json`), a Camada Brand gera uma paleta primitivizada de cores primárias de marca (brand) com papéis hierárquicos:

- **First**: Cor primária conceitual e mais importante.
- **Second**: Cor secundária da marca.
- **Third**: Cor terciária.
- **Fourth**: Opcional, para paletas mais diversificadas.
- **Ambient / Grayscale / Feedback / Product**: Mapeamentos complementares definidos e originados na marca, que formam as cores de ação, produto e notificação.

Para cada matiz definida pela marca, o engine de tokens gera (a nível primitive) uma sequência progressiva (ex: de 100 até 1900 ou de 1 a 19 escalas), o que resulta em 7 níveis semânticos de intensidade: `lowest`, `lower`, `low`, `default`, `high`, `higher`, e `highest`. E em cada intensidade, entregamos automaticamente o token do fundo (`background`), a cor da borda `border` ideal, e a respectiva cor de contraste para a tipografia (`txtOn`).

## 2. Mapeamento de Evolução e Contexto Histórico

*De onde viemos e como este conceito tomou forma.*

No **Aplica V1**, havia muita discussão em torno da categorização das cores. Como visto nas notas históricas (`064-cores-categorias-em-detalhe.md`), a V1 dividia e explicava cores como:
- **Brand**: Cores que ditavam o "tom" primário e secundário de marca.
- **Ambient**: Bases, Deep, Neutras, Grayscale.
- **Interaction**: Função (primary, secondary, link) e Feedback (info, success, warning, danger).
- **Text**: Cores de interface puramente para legibilidade.

**A principal dor da V1 e Alpha:** A documentação misturava a *identidade da marca* com o *uso da cor*. Se uma cor fosse chamada de "Botão Primário", limitava drasticamente o Theme Engine se fôssemos renderizar outra marca (multi-branding) onde o botão precisasse se comportar de forma diferente.

Na **V2**, as coisas se modificaram profundamente com a adoção inicial do **Aplica Theme Engine**. A estruturação foi separada em camadas atômicas:
A primeira camada, a **Brand**, agora **não opina sobre luz ou contexto de uso** (se é claro ou escuro), mas sim declara as paletas-base brutas de cada marca (ex: Marca A, Marca B, etc.). A variação modo claro/escuro agora é tratada de forma limpa na *Mode Layer*.

## 3. Decisões Técnicas Consolidadas

Ao revisarmos a implementação atual no `references/aplica-tokens-theme-engine`, documentamos as seguintes decisões de arquitetura e por quês:

1. **Abolição das nomenclaturas diretas de 700/800 nos Alias Públicos:**
   Foi decidido que expor níveis numéricos primitivos (10 a 1900) criaria acoplamento de código e confusão em cenários de dark mode. O Theme Engine expõe uma hierarquia nominal de 7 níveis (`lowest` a `highest`), baseada no peso do uso frente ao background, o que torna a transição entre temas ou superfícies invertidas previsível.

2. **Cálculo Automático do Contraste (txtOn):**
   O `txtOn` inserido em cada token resolve uma dor persistente durante a fase V1: garantir que designers e DEVs encontrem sempre a cor perfeita para texto sobre qualquer cor de marca com acessibilidade (AA e AAA).

3. **Cores de Função Movem para a Categoria Ação e Semântica:**
   Enquanto "Primary" ou "Success" são originadas na *Fundação de Cor da Marca* (brand options), as suas lógicas de mutação (hover, active, focus) não habitam isoladas sem o Theme Engine orquestrando-as conforme o modo e escala.

## 4. Regras Canônicas / Constraints

As seguintes diretrizes garantem a vida longa da arquitetura do Theme Engine:

- **Acesso:** Variáveis brutas da camada *Brand* não devem ser usadas diretamente para construir telas ou componentes. Elas são a matéria-prima consumida obrigatoriamente pela camada **Semantic** (exclusiva para engenharia e pessoas do DS na construção de componentes). E para times de produto que constroem telas e apenas consomem componentes prontos, utiliza-se a camada **Foundation** (focada em redução de carga cognitiva).
- **Zero Viés de Luz:** Componentes brutos da camada *Brand* não têm estado "Dark" nativo; eles são processados ao entrarem na *Mode Layer*.
- **Estrutura Primitiva Flexível:** É aceitável que algumas marcas não utilizem uma configuração `fourth`. O Theme Engine tratará graciosamente a ausência, concentrando funções no `first` e `second`.
