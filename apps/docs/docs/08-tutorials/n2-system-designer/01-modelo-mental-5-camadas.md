---
level: n2
id: N2-01
title: "O modelo mental das 5 camadas"
prerequisites: ["N1 completo"]
duration: "15 min"
lang: pt-BR
---

# N2-01 · O modelo mental das 5 camadas

## Contexto

No N1, você aprendeu a usar o sistema como consumidor. Agora a pergunta muda: por que o sistema foi construído desta forma?

Entender as camadas não é um exercício teórico. É o que te permite tomar decisões de arquitetura com confiança — saber onde cada tipo de decisão mora, por que certas regras existem, e o que acontece quando você tenta contorná-las.

---

## Conceito

### A metáfora da tinta

Pense em um pintor que mistura tintas. Ele começa com pigmentos puros — cores brutas, sem contexto. O pigmento azul não é "botão" nem "erro" — é apenas azul.

A partir do pigmento, ele cria uma paleta de trabalho para uma tela específica: dependendo se está pintando em luz do dia ou à luz de velas, as mesmas tintas ficam mais frias ou mais quentes. E dependendo do suporte — tela positiva normal ou tela em negativo fotográfico — as relações entre as cores se invertem.

Só no final, ao aplicar a tinta, o azul se torna "o céu da cena" ou "a sombra do personagem" — ele ganha um **propósito**.

O sistema de tokens funciona exatamente assim. Cinco camadas, cada uma com uma responsabilidade clara.

---

### As cinco camadas

```
Brand  →  Mode  →  Surface  →  Semantic  →  Foundation
```

---

#### Camada 1 — Brand (o pigmento)

**O que faz:** Guarda a identidade visual pura de cada marca. As cores declaradas são decompostas em 19 níveis de claridade e 15 níveis de neutros — a paleta completa a partir de um único hex.

**Quem decide:** O time de branding ou o configurador de temas (via `*.config.mjs`).

**O que contém:**
- As paletas decompostas de cada cor da marca (primary, secondary, tertiary)
- Os neutrals derivados de cada cor (com saturação reduzida)
- As configurações de tipografia (famílias, pesos)
- Os tokens de gradiente da marca

**O que NÃO faz:** Não sabe nada sobre interface, dark mode ou superfície. É matéria-prima.

**Regra de consumo:** Componentes nunca usam tokens da camada Brand diretamente. Você nunca verá `var(--brand-branding-first-100-background)` em um componente correto.

---

#### Camada 2 — Mode (a luz ambiente)

**O que faz:** Aplica o contexto de luz — light ou dark. Em light mode, o nível 10 da palette é o mais claro. Em dark mode, a escala inverte matematicamente: o nível 10 passa a ser o equivalente ao nível 190 do light.

**Quem decide:** O engine, com base no schema de arquitetura.

**O que contém:**
- Referências aos tokens da Brand com a escala correta para cada modo
- A lógica de inversão da paleta para dark mode
- A redução de saturação do dark mode (padrão: 15% menos vibrante)

**O que NÃO faz:** Não sabe o que é um botão, um card ou um alerta. Só sabe light/dark.

---

#### Camada 3 — Surface (o suporte)

**O que faz:** Aplica o contexto de superfície — positivo (normal) ou negativo (invertido). É como o conceito fotográfico de negativo: na surface negativa, o que era claro fica escuro e vice-versa, dentro do mesmo mode.

**Quem decide:** O engine, com base no schema de arquitetura.

**O que contém:**
- Referências ao Mode com ou sem inversão adicional
- Positive: a interface padrão
- Negative: útil para seções invertidas, banners de contraste, elementos premium

**O que NÃO faz:** Não sabe nada de interface. É contexto de suporte.

---

#### Camada 4 — Semantic (o propósito)

**O que faz:** É a camada onde os pigmentos ganham intenção. `semantic.color.interface.function.primary.normal.background` não é "azul" — é "o fundo do elemento de ação primária no estado de repouso". O propósito está no nome.

**Quem decide:** O schema de arquitetura + o time de DS. Novos tokens só entram via mudança no schema (e com consciência do custo).

**O que contém:**
- Toda a taxonomia de interface (function, feedback, brand branding, brand ambient)
- Product colors (customizável por projeto, mas com custo exponencial)
- Tokens de tipografia, dimensão, borda, opacidade e profundidade
- Os tokens de texto plano (`text.title`, `text.body`, etc.)

**O que é:** **A camada canônica exposta para consumo.** Componentes usam Semantic.

**Regra de consumo:** Todo componente da biblioteca usa sempre Semantic. Sem exceção.

---

#### Camada 5 — Foundation (o vocabulário de produto)

**O que faz:** É uma coleção de aliases — nomes curtos que apontam para tokens Semantic. `foundation.bg.primary` é um atalho para um caminho Semantic longo. O valor não está na Foundation — ela apenas aponta para o Semantic.

**Quem decide:** O time de DS (para a Foundation padrão do engine) ou o time de produto (para foundations customizadas por consumidor).

**O que contém:**
- Aliases de background (`bg.primary`, `bg.weak`, `bg.brand.*`, `bg.feedback.*`)
- Aliases de texto (`txt.title`, `txt.body`, `txt.muted`)
- Aliases de borda (`border.primary`, `border.feedback.*`)
- Estilos compostos de tipografia (`heading`, `body`, `display`)
- Estilos compostos de elevação (sombras prontas por nível)

**O que NÃO é:** A Foundation não substitui o Semantic como fonte de verdade. Se você colocar um alias Foundation incorreto, o Semantic ainda é o que vale.

---

### A camada ortogonal — Dimension

Além das 5 camadas sequenciais, existe uma camada que corre em paralelo: a **Dimension**.

Ela não segue a cadeia Brand → Mode → Surface. Ela alimenta o Semantic e o Foundation diretamente com a escala de espaçamento e tipografia. A Dimension tem três variantes:

| Variante | DefaultDesignUnit | Uso |
|----------|-------------------|-----|
| `minor` | 8px | Interfaces compactas |
| `normal` | 16px | A escala padrão |
| `major` | 24px | Interfaces espaçadas |

Todo token dimensional (`spacing.medium`, `sizing.large`) é definido como múltiplo do DefaultDesignUnit da variante ativa.

---

## Exemplo guiado

### Rastreando uma cor do config ao componente

Considere a cor primária de uma marca hipotética: `#C40145` (vermelho).

```
1. Brand layer
   _brand.json: "theme.color.light.interface.positive.function.primary.normal.background"
   → #C40145 (calculado pelo engine via OKLCh)

2. Mode layer (light.json)
   "mode.interface.positive.function.primary.normal.background"
   → referencia Brand light

3. Surface layer (positive.json)
   "surface.interface.positive.function.primary.normal.background"
   → referencia Mode

4. Semantic layer (default.json)
   "semantic.color.interface.function.primary.normal.background"
   → referencia Surface

5. Foundation layer (default.json)
   (não há um alias Foundation para este token específico — vai direto do Semantic)

6. Componente (CSS)
   background: var(--semantic-color-interface-function-primary-normal-background)
   → #C40145
```

Seis referências, uma cadeia. Se você mudar `#C40145` para `#D01050` no config, toda a cadeia é regenerada automaticamente.

---

## Agora você tenta

Dado o seguinte cenário, identifique em qual camada a decisão deve ser tomada:

1. A equipe de produto quer mudar o raio de borda de todos os botões para 4px
2. Um novo produto quer usar vermelho como cor primária em vez de azul
3. O design quer que um banner de topo use a inversão de cores (como negativo fotográfico)
4. Precisa de um token `feedback.warning` com intensidade mais alta para alertas críticos
5. O time de produto quer um atalho `bg.hero` que resolva para o fundo do hero da marca

**Resultado esperado:**

| Decisão | Camada | Justificativa |
|---------|--------|---------------|
| Mudar raio de borda | **Semantic / Dimension** | `semantic.border.radii.*` — tema global |
| Mudar cor primária | **Brand** (via config) | Cor de identidade da marca |
| Banner negativo | **Surface** (negativa) | Contexto de superfície, não mudança de cor |
| Nova intensidade warning | **Semantic** (via schema) | Novo nível de feedback no schema |
| Alias `bg.hero` | **Foundation** | Alias de atalho apontando para Semantic |

---

## Checkpoint

Ao fim deste tutorial você deve saber:

- [ ] O que cada uma das 5 camadas faz e por que existe
- [ ] Por que componentes nunca usam Brand, Mode ou Surface diretamente
- [ ] A diferença entre Semantic (propósito) e Foundation (atalho)
- [ ] O que é a camada Dimension e por que ela é ortogonal
- [ ] Rastrear mentalmente o caminho de uma cor do config ao componente

---

## Próximo passo

[N2-02 · Como uma cor vira um token — o pipeline OKLCh](./02-pipeline-oklch.md)

Você entende a estrutura. O próximo passo é entender o processo: o que acontece entre declarar uma cor no config e ter os 34 tokens derivados dela disponíveis no Figma?

---

## Referências

- Arquitetura de tokens: [01-token-architecture.md](../../01-design-tokens-fundamentals/01-token-architecture.md)
- Camada Brand: [01-brand-layer.md](../../02-token-layers/01-brand-layer.md)
- Camada Mode: [02-mode-layer.md](../../02-token-layers/02-mode-layer.md)
- Camada Surface: [03-surface-layer.md](../../02-token-layers/03-surface-layer.md)
- Camada Semantic: [04-semantic-layer.md](../../02-token-layers/04-semantic-layer.md)
- Camada Foundation: [05-foundation-layer.md](../../02-token-layers/05-foundation-layer.md)
