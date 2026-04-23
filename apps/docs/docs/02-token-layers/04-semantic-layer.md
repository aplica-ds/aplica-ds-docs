---
title: "Camada Semantic (Semantic Layer)"
lang: pt-BR
---

# Camada Semantic (Semantic Layer)

> **Data da documentação:** 2026-04-10
> **Foco:** A principal taxonomia do Theme Engine baseada em finalidade para criadores de componentes.

## 1. Visão Geral e Definição Atual

A **Camada Semantic (Semantic Layer)** é a fonte de verdade (Single Source of Truth) **canônica e exportada** do Aplica Theme Engine. Diferente da *Brand Layer* (que carrega apenas a matiz) e da *Mode/Surface Layer* (que invertem a pigmentação nos bastidores), a Semantic Layer expressa o **propósito** completo e processado de um token.

É nesta camada que os "pigmentos" ganham funções claras como: "Fundo de um botão primário no estado pressionado" ou "Cor do texto secundário em cima da cor de sucesso".

### Regra de Ouro (Exposição):
A *Semantic* é voltada de maneira rígida à área de **Engenharia de Sistemas e Criadores de Componentes** (Design System Team). Os aplicativos não devem criar "exceções semânticas" inventadas. Todos os estilos de um componente base da biblioteca (um Button, Input, Modal, etc.) referenciam, compulsoriamente, os caminhos nominais oriundos dessa camada para seu CSS interno.

## 2. A Evolução da Nomenclatura 

Nas primeiras levas de tokens (Alpha / V1), havia muita colisão semântica com nomes de componentes (a "síndrome do component-token" como _`btn-primary-bg`_). Isso inflava o código quando o mesmo background daquele botão precisava ser usado em uma Notificação. O modelo de taxonomia adotado pela V2 resolve de vez a modularidade seguindo o padrão unificado:

```
semantic.{category}.{subcategory}.{property}
```
Exemplos reais extraídos do JSON da Semantic:
- **`semantic.color.interface.function.primary.normal.background`**
- **`semantic.color.interface.feedback.info.default.normal.txtOn`**
- **`semantic.color.brand.branding.first.lowest.border`**

Qualquer um desses prefixos é reservado e rigidamente controlado pelo engine central — não existem caminhos curtos ou improvisos, permitindo varreduras globais muito robustas no código.

## 3. Decisões Técnicas Consolidadas

Do ponto de vista do funcionamento do motor da camada Semântica, o Theme Engine aplica a seguinte estrutura (baseada em seu schema central):

1. **Brand (Branding & Ambient)**  
   Expõe os tons primitivos `first`, `second`, e `third` (e cores Neutras/Cinza), porém já atrelados às chaves funcionais necessárias para renderização de qualquer interface:
   - `background`
   - `txtOn` (cor do texto perfeitamente contrastada para aplicar sobre o background da mesma string)
   - `border`
   - `txt` *(desde 3.6.0)* — texto legível em fluxo de conteúdo no canvas atual, referenciando esta família de cor
   *(Ex: `semantic.color.brand.branding.first.default.txtOn`)*

   > **Contrato de cor de 4 partes (3.6.0):** A partir da versão 3.6.0, todo bloco de cor expõe uma quarta propriedade `txt` ao lado de `background`, `txtOn` e `border`. Diferente de `txtOn` (texto sobre fundo colorido), `txt` é texto sobre canvas — um tom escuro da mesma família de paleta, acessível em WCAG sobre o background ambiente. Veja [07-txt-token.md](./07-txt-token.md) para o contrato completo e a configuração.

2. **Interface (Function & Feedback)**
   Mapeia o uso intencional. As funções de Interação (Primary, Secondary, Link, Disabled) agora habitam aqui em suas vertentes comportamentais completas:
   - `normal`
   - `action` (hover)
   - `active` (pressionado — mais escuro que action)
   - `focus` (indicador de foco de teclado — mais claro, aparência de anel/outline)

   Cada um desses estados expõe o quarteto completo de cor: `background`, `txtOn`, `border` e `txt` (desde 3.6.0).
   Exemplo: `semantic.color.interface.function.primary.action.txt`

   > **Breaking change (2.24.0):** Antes desta versão, `active` carregava a aparência de foco de teclado. A partir de 2.24.0, `focus` é um estado dedicado para foco de teclado (usa o nível de paleta que `active` mapeava anteriormente), e `active` agora mapeia para um step de paleta **mais escuro** representando o estado pressed/selected. Migração: substituir uso de `active` em rings de foco por `focus`; manter `active` para feedback visual de press/select.
   
3. **Typography, Dimension, Opacity**  
   Seguindo as mesmas premissas de nome único, os parâmetros de espaço, tipografia e opacidade ganham suas posições finais sem atrelações indevidas a modos escuros que não afetam esses campos ortogonais.

4. **Product — Semânticas de Produto**

   A subcategoria `semantic.color.product.*` é a área **mais específica e mais personalizável** de toda a camada Semantic. Ela existe para resolver um problema real: **alguns produtos precisam de cores que não pertencem ao vocabulário universal de interface** — indicadores de temperatura de alimentos, selos de promoção, sinalização de cashback, tiers de assinatura, áreas temáticas de um site, entre outros.

   > [!IMPORTANT]
   > **Product é uma área completamente aberta.** Ao contrário das subcategorias `interface.*` e `brand.*` (que seguem schemas rígidos e gerados pelo engine), os itens de Product são definidos **manualmente por cada produto** e podem variar livremente entre temas/marcas diferentes.

   ### Estrutura de um item Product

   Cada item é uma cor decomposta no mesmo padrão do restante da Semantic — 5 níveis de intensidade × 3 propriedades funcionais:

   ```
   semantic.color.product.<item>.<variant>.<intensity>.<property>
   ```

   | Segmento | Valores possíveis | Descrição |
   |---|---|---|
   | `<item>` | `promo`, `cashback`, `premium`, ou qualquer nome livre | O conceito de produto |
   | `<variant>` | `default`, `secondary` | Variante visual (cor primária e alternativa) |
   | `<intensity>` | `lowest`, `low`, `default`, `high`, `highest` | Grau de proeminência da cor |
   | `<property>` | `background`, `txtOn`, `border` | Trio funcional padrão |

   ### Exemplo real (do Theme Engine V1)

   Um e-commerce que precisa de sinalização visual para promoções e cashback definiria:

   ```
   semantic.color.product.promo.default.default.background     → fundo de badges/banners promocionais
   semantic.color.product.promo.default.default.txtOn           → texto legível sobre esse fundo
   semantic.color.product.promo.secondary.low.background        → variante sutil para promo em cards
   semantic.color.product.cashback.default.high.background       → fundo denso de selo de cashback
   semantic.color.product.premium.default.default.background     → indicador de tier premium
   ```

   ### Textos de Produto

   Além do trio `background`/`txtOn`/`border`, o sistema também suporta tokens de texto dedicados para uso em contextos de conteúdo puro (onde não se trata de uma superfície, mas de um texto colorido isolado):

   ```
   semantic.color.text.promo          → texto promocional solto
   semantic.color.text.promo_secondary → variante secundária
   semantic.color.text.cashback       → texto de cashback
   semantic.color.text.premium        → texto de tier premium
   ```

   ### Por que Product é livre?

   Diferente do Feedback (`info`, `success`, `warning`, `danger`), que é universal para toda UI, as necessidades de produto são **imprevisíveis e potencialmente infinitas**. Um app de delivery precisa de indicadores de temperatura. Um marketplace precisa de badges de seller. Um app financeiro precisa de indicadores de risco. Cimentar essas categorias no schema do engine seria restritivo e inflexível.

   > [!CAUTION]
   > **Menos é mais. Sempre.**
   >
   > Cada novo item de Product gera **no mínimo 30 tokens** (5 intensidades × 3 propriedades × 2 variantes) que se propagam por **todas as camadas** do sistema (Brand → Mode → Surface → Semantic). Esse crescimento é **exponencial em relação ao número de temas**: se o sistema opera 4 temas, um único item novo representa **+120 tokens** no total.
   >
   > Mais tokens significam:
   > - **Perda de performance** — arquivos maiores, mais variáveis CSS/nativas, builds mais lentos
   > - **Aumento de complexidade** — mais decisões para designers, mais propriedades para engenheiros
   > - **Entropia no sistema** — tokens subutilizados geram confusão, inconsistência e dívida técnica
   >
   > Antes de adicionar um novo item Product, pergunte: _"Essa necessidade pode ser resolvida com um token de Feedback ou uma variante de Brand existente?"_ Se a resposta for sim, **não crie um item Product.**

   > [!TIP]
   > **Se realmente necessário, adicione com critério:**
   > Defina-o no `_brand.json` do seu tema com as cores base. O pipeline OKLCh decompõe automaticamente a paleta. Depois, mapeie nas camadas `mode.*`, `surface.*` e finalmente `semantic.color.product.*` seguindo o padrão dos itens existentes. Documente a justificativa.

---

## 4. Regras Canônicas / Constraints

- **Proibido Referenciar Camadas Internas**: É estritamente proibido (Forbidden Pattern) usar `theme.color.*`, `brand.*`, ou `surface.*` nos SDKs do Mobile e na Web. Os ambientes de produção só reconhecem a porta que começa em `semantic.*` e que foi previamente exposta através de um build.
- **Evitar Nomes Inventados:** Nunca crie um `--semantic-color-inventada` dentro de um Styled Component de produto. A taxonomia do Theme Engine não deve ser violada, visando compatibilidade com qualquer refatoração global futura nos temas gerados. Quando existir necessidade de redução da carga cognitiva, utilize a recém estipulada camada *Foundation*.
- **Product é a exceção controlada:** Itens de Product (`semantic.color.product.*`) são a **única área** onde o consumidor pode adicionar chaves livremente ao schema. Mas mesmo aqui, a estrutura interna (`variant` → `intensity` → `property`) deve ser respeitada para manter compatibilidade com as camadas Mode e Surface.
- **Product deve ser mínimo:** Cada item adicionado gera dezenas de tokens que se propagam por todas as camadas e todos os temas. Adicionar cores de produto sem necessidade comprovada é a forma mais rápida de degradar a performance e a coerência do Design System. A regra é: **menos é mais.**
