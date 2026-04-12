---
level: n1
id: N1-03
title: "Espaçamento e tipografia — a escala dimensional"
prerequisites: ["N1-01"]
duration: "10 min"
lang: pt-BR
---

# N1-03 · Espaçamento e tipografia — a escala dimensional

## Contexto

Você está montando um card. O padding parece certo com 18px, mas o designer ao lado usou 20px. O desenvolvedor colocou 16px. Todos foram "no olho" — e agora o produto parece levemente inconsistente em cada área. Ninguém errou. Mas o resultado parece errado.

Este tutorial explica como o sistema resolve esse problema de uma vez por todas, e por que "inventar um número de espaçamento" é o equivalente tipográfico de escolher um hex fora da paleta.

---

## Conceito

### A grade de 4 pontos

Todo espaçamento e dimensão no Aplica DS é múltiplo de 4. Isso não é uma preferência — é uma regra estrutural.

Por quê 4? Porque a maioria das telas renderiza em múltiplos de 2 (retina) ou de 4 (grades de layout). Um espaçamento de 18px em uma tela retina gera um pixel fracionado invisível — o layout fica "levemente errado" mesmo para quem não sabe dizer por quê.

Com a grade de 4pt, você pode somar qualquer combinação de valores e o resultado continua alinhado. O layout é previsível. O código é previsível. O alinhamento entre Figma e implementação é exato.

### Os tamanhos têm nomes — não são números soltos

Em vez de memorizar que "o padding de um botão é 16px", o sistema oferece nomes com significado:

| Nome | Tamanho | Quando usar |
|------|---------|-------------|
| `nano` | 4px | Espaço mínimo entre ícone e texto, separador visual |
| `micro` | 8px | Padding de labels, gap entre itens muito próximos |
| `extraSmall` | 16px | Padding interno de botões e campos de formulário |
| `small` | 24px | Padding de cards moderados, gap entre blocos próximos |
| `medium` | 32px | Espaçamento padrão entre elementos na página |
| `large` | 40px | Separação generosa entre seções relacionadas |
| `extraLarge` | 48px | Divisão entre grandes áreas do produto |
| `mega` | 56px | Divisão drástica, modais vastas |
| `giga` | 88px | Área de toque mínima (botões grandes, acessibilidade) |
| `tera` | 144px | Hero sections, separações de página inteira |

**A regra prática:** Para criar hierarquia visual, suba um nível. Se os botões de uma seção usam `small` internamente, a margem que separa essa seção da próxima deve usar `medium` ou `large`. A diferença de nível cria a percepção de agrupamento — o olho entende o que pertence a quê.

### Três densidades: compacta, normal e espaçosa

O sistema oferece três variantes de escala global:

| Variante | Caráter | Uso típico |
|----------|---------|-----------|
| **minor** | Compacta | Dashboards, ferramentas, interfaces densas com muita informação |
| **normal** | Equilibrada | A escala padrão — aplicativos, marketing, interfaces gerais |
| **major** | Espaçosa | Conteúdo editorial, leitura longa, landings de alto impacto |

Você não muda os nomes dos tokens para mudar de densidade — o sistema inteiro recalibra. Um `small` em `minor` vai ter um tamanho diferente de um `small` em `major`, mas continua sendo "o espaçamento pequeno". O significado é portátil.

---

### Tipografia: estilos, não tamanhos soltos

O mesmo princípio se aplica à tipografia. O sistema não oferece "36px Bold" diretamente — oferece **estilos compostos** que já incluem tamanho, peso, entrelinha e família em conjunto.

Isso é importante porque uma entrelinha errada quebra o ritmo vertical da página tão silenciosamente quanto um espaçamento de 18px. O sistema resolve isso por você.

#### As cinco categorias de estilo

**Heading — Títulos**
Para títulos de página, seções e destaques de cards. A entrelinha é proporcional, projetada para que múltiplas linhas fiquem bem juntas sem se sufocar.

Exemplos: `title_1` (maior, H1), `title_2` (H2), `title_3` (H3), `title_4` (H4), `title_5` (menor, H5/H6)

---

**Display — Impacto máximo**
Para hero sections, banners e manchetes de alto impacto. Tamanhos grandes, pesos fortes. Não usar em corpo de página — quebra a hierarquia.

Exemplos: `display_1`, `display_2`, `display_3`

---

**Content — Leitura**
Para parágrafos, descrições, listas e labels. A entrelinha é generosa — projetada para conforto em textos longos.

Exemplos: `body_large`, `body`, `body_small`, `label`, `quote`

---

**Action — Clicável**
Para textos dentro de controles interativos: botões, abas, links, chips. A entrelinha é compacta (o espaço ao redor do texto vem do padding do componente, não da entrelinha).

Exemplos: `action.strong.small`, `action.regular.medium`, `link.medium`

---

**Code — Técnico**
Para trechos de código, chaves de configuração, dados técnicos. Usa fonte monoespaçada.

Exemplos: `code.small`, `code.medium`

---

### A regra de não misturar

Cada categoria foi projetada para seu contexto. Usar `title_1` dentro de um botão vai gerar uma entrelinha enorme e o componente vai quebrar visualmente. Usar `body` como título de seção vai gerar falta de hierarquia.

**Se você não sabe qual estilo usar, a pergunta é:** "Esse texto é para leitura, para hierarquia, para ação ou para impacto?" A resposta aponta diretamente para a categoria certa.

---

## Exemplo guiado

### Montando um card de notificação

Vamos mapear os tokens de espaçamento e tipografia de um card simples:

```
┌─────────────────────────────────┐
│  Lembrete de pagamento          │  ← título: title_5
│  Seu boleto vence em 2 dias.    │  ← corpo: body_small
│  [Ver boleto]                   │  ← botão: action.strong.small
└─────────────────────────────────┘
```

| Elemento | Token de espaçamento | Token tipográfico |
|----------|---------------------|------------------|
| Padding interno do card | `small` (24px) | — |
| Espaço entre título e corpo | `nano` (4px) | — |
| Espaço entre corpo e botão | `micro` (8px) | — |
| Texto do título | — | `title_5` |
| Texto do corpo | — | `body_small` |
| Texto do botão | — | `action.strong.small` |

Resultado: um card que parece correto em qualquer tema, em qualquer escala, em light ou dark mode — sem nenhum valor numérico inventado.

---

## Agora você tenta

Você está desenhando um modal de confirmação de exclusão:

```
┌─────────────────────────────────────┐
│  Excluir conta?                     │  ← título grande
│                                     │
│  Esta ação não pode ser desfeita.   │  ← aviso em corpo
│  Todos os seus dados serão          │
│  permanentemente removidos.         │
│                                     │
│        [Cancelar]  [Excluir]        │  ← dois botões
└─────────────────────────────────────┘
```

Mapeie os tokens de espaçamento e tipografia para:
1. O padding interno do modal
2. O espaço entre o título e o texto de aviso
3. O espaço entre o texto de aviso e os botões
4. O estilo tipográfico do título
5. O estilo tipográfico do texto de aviso
6. O estilo tipográfico dos botões

**Resultado esperado:**

| Elemento | Token sugerido | Justificativa |
|----------|---------------|---------------|
| Padding do modal | `medium` (32px) | Modal é um container de destaque — respiro generoso |
| Espaço título → texto | `small` (24px) | Relação próxima (mesmo contexto) mas com separação clara |
| Espaço texto → botões | `medium` (32px) | Separação de ação — hierarquia visual entre informação e decisão |
| Estilo do título | `title_3` ou `title_4` | Heading de seção, não de página inteira |
| Estilo do aviso | `body` | Texto de leitura, parágrafo |
| Estilo dos botões | `action.strong.small` | Controle interativo, entrelinha compacta |

---

## Checkpoint

Ao fim deste tutorial você deve saber:

- [ ] Por que todos os espaçamentos são múltiplos de 4 (e o que acontece quando não são)
- [ ] Os nomes da escala de espaçamento: nano → micro → extraSmall → small → medium → large
- [ ] A diferença entre as três densidades (minor / normal / major) e quando cada uma é usada
- [ ] As cinco categorias tipográficas: Heading, Display, Content, Action, Code
- [ ] A regra de não misturar categorias — cada estilo foi feito para seu contexto
- [ ] Como mapear os tokens de um componente sem inventar nenhum valor

---

## Próximo passo

[N1-05 · Acessibilidade por construção](./05-acessibilidade-por-construcao.md)

Você já sabe usar tokens de cor, espaçamento e tipografia. O próximo passo é entender por que usar os tokens certos não é só consistência — é o que garante que sua interface seja acessível para todos os usuários.

---

## Referências

- Escala de espaçamento: [03-spacing-sizing.md](../../03-visual-foundations/03-spacing-sizing.md)
- Sistema tipográfico: [02-typography.md](../../03-visual-foundations/02-typography.md)
- Camada Dimension: [06-dimension-layer.md](../../02-token-layers/06-dimension-layer.md)
