---
level: n2
id: N2-05
title: "Cores de produto — crescimento responsável"
prerequisites: ["N2-01", "N2-03"]
duration: "10 min"
lang: pt-BR
---

# N2-05 · Cores de produto — crescimento responsável

## Contexto

Você está num refinamento. A equipe de produto quer um novo badge visual para indicar "Cashback Plus" — diferente do cashback normal, com uma cor dourada mais intensa. Parece simples. "É só mais uma cor."

Este tutorial explica por que "é só mais uma cor" é uma das frases mais caras que existem no design de sistemas.

---

## Conceito

### O que é a camada Product

A maioria das cores do sistema tem papéis universais: primary, secondary, info, success, warning, danger. Qualquer produto de qualquer marca usa esses papéis da mesma forma.

Mas alguns contextos de negócio precisam de cores que não existem no vocabulário universal. Promoções, cashback, tiers de assinatura, categorias temáticas — essas necessidades são imprevisíveis e específicas de cada produto.

Para isso existe a subcategoria `semantic.color.product.*`. É a única área do Semantic onde times de produto podem adicionar itens livremente.

### O custo de cada item

Aqui está o que acontece quando você adiciona um item de produto — por exemplo, `promo_extended`:

**1. O item é declarado no schema de arquitetura**
**2. Cada tema registrado precisa configurar a cor deste item**
**3. O engine decompõe a cor em toda a taxonomia:**

```
promo_extended
  ├── default
  │   ├── lowest  → background + txtOn + border  (3 tokens)
  │   ├── low     → background + txtOn + border  (3 tokens)
  │   ├── default → background + txtOn + border  (3 tokens)
  │   ├── high    → background + txtOn + border  (3 tokens)
  │   └── highest → background + txtOn + border  (3 tokens)
  └── secondary
      ├── lowest  → background + txtOn + border  (3 tokens)
      ├── low     → background + txtOn + border  (3 tokens)
      ├── default → background + txtOn + border  (3 tokens)
      ├── high    → background + txtOn + border  (3 tokens)
      └── highest → background + txtOn + border  (3 tokens)
```

**30 tokens por item.** E esses 30 tokens existem em cada tema do sistema.

| Sistema com | 1 item Product | +1 item | +5 itens |
|-------------|---------------|---------|---------|
| 2 temas | 60 tokens | 120 tokens | 300 tokens |
| 4 temas | 120 tokens | 240 tokens | 600 tokens |
| 8 temas | 240 tokens | 480 tokens | 1200 tokens |

E isso é só para a camada Semantic. Cada token propaga por Mode, Surface, e Foundation — multiplicando o impacto.

### Por que isso importa além do número

**Performance:** Mais variáveis CSS no browser. Mais tokens no JSON do Figma. Arquivos maiores, builds mais lentos, Figma mais lento para carregar.

**Complexidade cognitiva:** Cada item de produto que o designer de sistema adiciona é um item que o designer de produto precisa aprender, entender e usar corretamente. Quanto mais itens, mais decisões erradas.

**Entropia:** Tokens que ninguém usa são o pior tipo de dívida técnica — estão em todo lugar, ninguém sabe se são necessários, ninguém tem coragem de remover.

---

### A pergunta obrigatória

Antes de qualquer item Product novo, faça esta pergunta em três etapas:

**Etapa 1:** "Isso pode ser resolvido com um token de Feedback existente?"
- `danger` não é só para erros — pode ser "atenção máxima", "ação destrutiva", "proibido"
- `warning` não é só para alertas — pode ser "atenção", "limitado", "em risco"

**Etapa 2:** "Isso pode ser resolvido com uma variante de Brand existente?"
- `brand.branding.first.high` (tom escuro da cor primária) é diferente o suficiente?
- `brand.branding.second` (segunda cor da marca) não serve?

**Etapa 3:** "Este badge/sinalização realmente precisa de uma cor nova, ou eu preciso de um tratamento tipográfico diferente?"

Se respondeu "não" nas três etapas, aí sim um item Product pode ser adicionado — com documentação da justificativa.

---

## Exemplo guiado

### Três cenários — decision tree

**Cenário A:** Badge "Novo" em cor verde brilhante

*Análise:* `feedback.success` existe. Success é verde por padrão. Se a cor atual do `success.secondary` é próxima do que precisa, use-o. Se a cor exacta importa para a identidade do produto, use `brand.branding.second` ou `brand.branding.third`.

*Decisão:* Usar `feedback.success.secondary` ou variante de brand. **Sem item Product.**

---

**Cenário B:** Badge "Cashback" dourado — cor amarela específica da marca

*Análise:* Amarelo/dourado não existe em nenhum papel universal. Não é feedback. Não é brand da empresa (a marca é azul). É um conceito de produto genuinamente novo.

*Decisão:* Adicionar item `cashback` com a cor dourada. **Item Product justificado.**

*Custo a documentar:* 30 tokens × número de temas. Confirmado com o time antes de adicionar.

---

**Cenário C:** Três variações de badge de tier: "Silver", "Gold", "Diamond"

*Análise:* Três tiers = 3 itens × 30 tokens × 4 temas = 360 tokens. Antes de adicionar os três, pergunta: eles precisam de cores independentes? "Silver" pode ser o grayscale do sistema. "Gold" pode ser `cashback` (se já existe). "Diamond" pode ser `brand.branding.third`.

*Decisão:* Reusar o que existe para Silver e Diamond. Adicionar apenas `gold` se a cor dourada não existe ainda. **Máximo 1 item Product, não 3.**

---

## Agora você tenta

Um product manager pede quatro novos itens de produto para uma loja: `promo`, `flash_sale`, `limited`, `exclusive`.

Antes de adicionar qualquer um, faça a análise:

1. `promo` — Promoção genérica. Verde brilhante desejado.
2. `flash_sale` — Venda relâmpago. Laranja vibrante. "Urgência".
3. `limited` — Edição limitada. Dourado. "Escassez, premium".
4. `exclusive` — Exclusivo para membros. Roxo. Diferente da cor de marca (que é azul).

**Resultado esperado:**

| Item | Decisão | Justificativa |
|------|---------|---------------|
| `promo` | Usar `feedback.success` | Verde já existe como success |
| `flash_sale` | Usar `feedback.warning` | Laranja/urgência = warning |
| `limited` | Adicionar `cashback` (se não existir) ou reusar | Dourado não tem equivalente universal |
| `exclusive` | Adicionar `premium` | Roxo diferente da marca = item Product legítimo |

De 4 pedidos, 2 resolvidos sem custo adicional, 1 potencialmente reutilizável, 1 genuinamente novo.

---

## Checkpoint

Ao fim deste tutorial você deve saber:

- [ ] O que é a subcategoria Product e por que ela é a única área livre do Semantic
- [ ] O cálculo de custo: 1 item = 30 tokens mínimos × número de temas
- [ ] A pergunta obrigatória em 3 etapas antes de adicionar qualquer item
- [ ] Distinguir casos que reutilizam o sistema daqueles que genuinamente precisam de um novo item
- [ ] Documentar a justificativa quando um item Product é adicionado

---

## Próximo passo

[N2-06 · Sobreposições responsáveis — quando e como usar overrides](./06-overrides-responsaveis.md)

Mesmo com um sistema bem projetado, haverá casos em que o comportamento padrão não serve. Quando isso acontece, existe uma forma correta de sobrepor — e muitas formas erradas.

---

## Referências

- Camada Semantic — seção Product: [04-semantic-layer.md](../../02-token-layers/04-semantic-layer.md)
- Custo exponencial: [01-aplica-ds-vision.md](../../00-overview/01-aplica-ds-vision.md)
- Configuração de cores de produto: [03-configuration-guide.md](../../04-theme-engine/03-configuration-guide.md#cores-de-product)
