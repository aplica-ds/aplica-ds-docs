---
title: "Camada Foundation (Foundation Layer)"
lang: pt-BR
---

# Camada Foundation (Foundation Layer)

> _A Foundation Layer é também chamada de **Consumer Layer** na comunicação pública — fornece aliases simplificados otimizados para times de produto com menor carga cognitiva._

> **Data da documentação:** 2026-04-10
> **Foco:** Redução de carga cognitiva, mapeamento de aliases e uso no escopo de Produto.

## 1. Visão Geral e Definição Atual

A **Camada Foundation (Foundation Layer)** é o último estágio de exposição na taxonomia de base do *Aplica Theme Engine*. Ela atua estritamente como uma camada de **aliases** (pequenos apelidos amigáveis) que referenciam tokens da camada *Semantic*.

O seu objetivo não é adicionar ou criar novas cores de forma matemática, mas sim fornecer uma "API simplificada" e amigável para times de produto montarem fluxos ou telas com um nível de exigência cognitiva mínima.

Enquanto a arquitetura da base (Brand à Semantic) segue um *schema* compartilhado obrigatório e altamente granular, a *Foundation* tem uma **estrutura livre** e adaptável a cada tema.

## 2. A Mente por trás da "Carga Cognitiva"

O conceito primário que levou ao nascimento da Foundation na arquitetura V2 ataca exatamente uma das principais queixas históricas documentadas:

**O Paradoxo da Engenharia de Sistema (DS) vs Engenharia de Produto**
1. O desenvolvedor raiz do Design System, construindo um botão agnóstico para 45 marcas diferentes, precisa de precisão cirúrgica de contexto. Para ele, uma instrução hiper-detalhada como `semantic.color.brand.branding.first.default.background` é necessária, pois o botão precisa ler os níveis exatos em seus sub-sistemas de interação.
2. Porém, **Times de Produto** apenas consomem os botões e empilham em telas. Se o desenvolvedor (ou designer de interface de produto final) precisa apenas pintar o header do seu novo App corporativo com a cor base da empresa, forçá-lo a decorar/escrever o caminho enorme da `Semantic` gera paralisia, erros de digitação e alta curva de aprendizado. Para ele, `foundation.bg.primary` basta.

### Regra de Consumo:
- **Área de DS (Design System):** Consome 100% via *Semantic* na criação de componentes.
- **Área de Produto:** Consome prioritariamente *Foundation* `foundation.*` nas telas construídas e customizações do dia a dia; fazendo fallback para a *Semantic* apenas quando um detalhe complexo não foi abstraído de forma simples no alias.

## 3. Decisões Técnicas Consolidadas (Theme Engine)

### 3.1 Geração Híbrida 
A mecânica do *Aplica Theme Engine* compila a Foundation baseando-se nas premissas que os temas declaram em arquivos `.config.mjs` locais. Para gerar os caminhos mais curtos, ela aceita dois jeitos paralelos de funcionar:

- **Mapeamento Direto:**
  Permite plugar livremente aliases para tokens Semânticos específicos:
  ```json
  "bg": {
     "primary": "{semantic.color.brand.ambient.contrast.deep.light.background}",
     "brand_low": "{semantic.color.brand.branding.first.lowest.background}"
  }
  ```

- **Mapeamento Baseado em Estrutura:**
  Se há padronização, a configuração repassa placeholders (`{item}`, `{variant}`, etc) reduzindo a repetição dos caminhos para blocos maiores, como Feedback.

### 3.2 O que entrega? O que omite?

A *Foundation* **entrega** facilidade. Ela constrói CSS Properties sucintas (ex: `--foundation-bg-primary`) que escondem a complexidade semântica real por trás.

A *Foundation* **omite** detalhes internos das camadas `brand.*`, `mode.*` e `surface.*`. Ela também omite propositalmente variações excessivas de componentes atômicos (onde faria sentido o `component.*` ou que ficassem isolados na manipulação do DS).

## 4. Regras Canônicas / Constraints

- **Não Substitui a Semantic como Fonte da Verdade:** A *Foundation* jamais guarda um HEX hardcoded. Ela é um espelho.
- **Flexibilidade Assumida:** Temas diferentes podem, se desejarem, ter árvores de Foundation ligeiramente divergentes de acordo com a biblioteca que as consome. O motor compila validando se as chaves da Foundation realmente apontam para uma chave viva e mapeada na Semantic (*Validation Reports* gerados automaticamente a cada build do engine), garantindo consistência estrita de relacionamentos.

## 5. Composite Tokens (Estilos no Figma)

Um aspecto fundamental da camada Foundation é que ela também abriga os **Composite Tokens** (Tokens Compostos). Esses tokens são essenciais na ponte entre o código e as ferramentas de design visual (como o Figma), pois representam agrupamentos de valores que, isolados, são simples, mas quando juntos formam algo mais complexo.

Chamamos de *Composite Tokens* os agrupamentos que utilizam um ou mais tokens para criar um conjunto invocável, convertendo-se diretamente nos **Estilos no Figma**.

Atualmente, tratamos os seguintes composites:
- **Estilos de Tipografia (Typography Styles):** Agrupam propriedades como `fontFamily`, `fontWeight`, `lineHeight` e `fontSize`.
- **Profundidade (Depth / Shadows):** Agrupam `x`, `y`, `blur`, `spread`, e `color` para invocar sombras (`box-shadow` em CSS / Efeito *Drop Shadow* no Figma).
- **Gradientes:** Agrupam definições de transição de cor e direção.

Embora possamos expandir esse conceito no futuro para englobar outros efeitos (como animações complexas ou transições de estado macro), atualmente o foco está nos estilos visuais de base (tipografia, profundidade e gradientes) para dar autonomia de uso aos designers que consomem essas bibliotecas no dia a dia, mantendo o elo direto com o Theme Engine do código.
