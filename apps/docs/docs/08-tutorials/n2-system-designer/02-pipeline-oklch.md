---
level: n2
id: N2-02
title: "Como uma cor vira um token — o pipeline OKLCh"
prerequisites: ["N2-01"]
duration: "12 min"
lang: pt-BR
---

# N2-02 · Como uma cor vira um token

## Contexto

Você declara `#C40145` no config de um tema. Algumas frações de segundo depois, existem 34 tokens derivados dessa cor — paleta completa, neutrals, comportamentos de hover e active, versão dark mode. Tudo calculado.

Como isso acontece? E por que o hex gerado pode ser ligeiramente diferente do hex original?

Este tutorial responde essas perguntas sem equações — com intuição de designer.

---

## Conceito

### Por que não usar HSL?

Antes de explicar o que o sistema usa, é útil entender o problema com o que a maioria dos sistemas usa.

HSL (Hue, Saturation, Lightness) parece intuitivo: você muda o L para clarear ou escurecer uma cor. Mas "clarear 10% em HSL" não produz resultados visualmente uniformes entre diferentes matizes. Um azul escurecido em 10% parece muito mais escuro do que um amarelo escurecido em 10% — mesmo que os números sejam idênticos.

O resultado: paletas HSL são matematicamente consistentes mas visualmente irregulares.

### OKLCh — o espaço perceptualmente uniforme

OKLCh (Lightness, Chroma, hue) é um espaço de cor construído para corresponder à percepção humana. Nele:

- **L = 0.5** parece de fato "meio brilhante" — não calculado como, mas percebido como
- **Clarear 10%** produz resultados visualmente equivalentes em qualquer matiz
- **Escurecer** também é previsível — o sistema pode garantir que cada nível da paleta pareça uniformemente diferente do anterior

Isso é o que permite que o engine gere paletas consistentes a partir de qualquer cor da marca — não importa se é um vermelho vibrante ou um verde suave.

---

### O que acontece com o seu hex

Quando você declara `#C40145` no config, o engine executa este processo:

**Passo 1 — Conversão para OKLCh**

O hex é convertido de RGB para o espaço OKLCh. Aqui, a cor tem três dimensões:
- `L` — quão clara é (0 = preto, 1 = branco)
- `C` — quão saturada é (0 = cinza, valores altos = vibrante)
- `h` — o matiz (o ângulo no círculo cromático)

**Passo 2 — Geração da palette (19 níveis)**

O engine fixa o matiz (`h`) e varia o `L` em 19 passos uniformes, do mais claro (nível 10) ao mais escuro (nível 190). O nível 100 é a cor original — ela não é alterada.

Cada nível tem três propriedades: `surface` (o fundo), `txtOn` (o texto acessível sobre aquele fundo) e `border` (a borda derivada). Desde a 3.6.0, o engine também gera uma quarta propriedade `txt` por nível — cor de texto legível sobre canvas (não sobre o próprio fundo colorido do elemento). Veja [token txt](../../02-token-layers/07-txt-token.md).

**Passo 3 — Geração dos neutrals (15 níveis)**

Os neutrals seguem o mesmo processo de variação de `L`, mas com o `C` (saturação) reduzido para aproximadamente 10% do original. Resultado: cinzas levemente tingidos pela cor da marca — mais harmônicos do que um cinza puro, mas sem dominar a interface.

**Passo 4 — Dark mode**

A paleta de dark mode é gerada invertendo os índices: o nível 10 do dark corresponde ao nível 190 do light, e vice-versa. O nível 100 permanece igual. Adicionalmente, o `C` de todo o dark mode é multiplicado por 0.85 (padrão) — 15% menos saturado, reduzindo fadiga visual em ambientes escuros.

**Passo 5 — Conversão de volta para hex**

Cada cor gerada em OKLCh é convertida de volta para hex. Por causa das conversões de ida e volta (RGB → OKLCh → operações → OKLCh → RGB), o hex do nível 100 pode ser ligeiramente diferente do hex original declarado no config. Um ou dois dígitos de diferença são normais e esperados — não é um bug.

---

### Por que isso importa para o System Designer

**Você não precisa escolher manualmente cada nível da paleta.** Declare a cor de marca correta, e o engine entrega 19 níveis de palette + 15 níveis de neutral + toda a estrutura de dark mode.

**Você não precisa checar contraste de cada nível.** O `txtOn` de cada nível é calculado para passar WCAG AA (4.5:1) sobre o surface daquele nível. O cálculo acontece em OKLCh, onde a previsibilidade é real.

**As paletas são matematicamente harmônicas entre si.** Quando você tem três cores de marca, os três conjuntos de paletas são calculados pelo mesmo pipeline. A harmonia visual é garantida pela matemática, não pelo olho do designer.

---

## Exemplo guiado

### Lendo uma paleta gerada

Após rodar o build, o arquivo `data/brand/{tema}/_primitive_theme.json` contém a paleta completa. Para a cor primária `#C40145`:

```
Nível 10  (mais claro):   surface #FFF0F3, txtOn #8B0030, border #FBCED8
Nível 50:                 surface #FFC8D3, txtOn #8B0030, border #F5A0B0
Nível 100 (cor original): surface #C40145, txtOn #FFFFFF, border #9C0136
Nível 150:                surface #6B0025, txtOn #FFFFFF, border #540019
Nível 190 (mais escuro):  surface #1A0009, txtOn #FFFFFF, border #0D0005
```

Em dark mode, a inversão fica:

```
dark[nível 10]  = light[nível 190]  → #1A0009 (agora é o mais "suave" no dark)
dark[nível 100] = light[nível 100]  → #C40145 (a cor base não muda)
dark[nível 190] = light[nível 10]   → #FFF0F3 (agora é o "mais intenso" no dark)
```

Assim, `semantic.color.interface.function.primary.normal.background` no light mode e no dark mode apontam para níveis diferentes da mesma paleta — calculados para que visualmente ambos pareçam ser a cor primária da marca no contexto correto.

---

## Agora você tenta

Considere uma cor hipotética de feedback — sucesso — declarada como `#22C55E` (verde).

1. O nível 50 desta paleta (bem claro) vai ter `txtOn` branco ou preto? Por quê?
2. No dark mode, qual nível do light se torna o "fundo mais sutil" do sucesso?
3. Se você quiser que o badge de sucesso seja discreto (fundo muito suave), qual intensidade usar — `lowest`, `default` ou `highest`?

**Resultado esperado:**

1. `txtOn` preto — nível 50 é muito claro (alto L), e texto escuro tem mais contraste sobre fundos claros. O engine calcula isso automaticamente.
2. `dark[10]` = `light[190]` — o nível mais escuro do light se torna o fundo mais sutil no dark (e faz sentido: um verde escuro sobre fundo escuro é sutileza).
3. `lowest` — é o nível de menor intensidade, produzindo o fundo mais suave.

---

## Checkpoint

Ao fim deste tutorial você deve saber:

- [ ] Por que OKLCh produz resultados perceptualmente mais uniformes que HSL
- [ ] As 5 etapas do pipeline: hex → OKLCh → 19 níveis → neutrals → dark mode → hex
- [ ] Por que o hex gerado pode diferir levemente do hex declarado (e por que isso é correto)
- [ ] Como o dark mode é gerado matematicamente pela inversão de índices
- [ ] O que `txtOn` representa e por que ele muda dependendo do nível da paleta

---

## Próximo passo

[N2-03 · O paradigma Config-First](./03-paradigma-config-first.md)

Você entende como as cores são geradas. O próximo passo é entender o paradigma que muda onde as decisões de design são tomadas — e por que o Figma, neste sistema, é um consumidor, não o autor.

---

## Referências

- Sistema de cores completo: [01-colors.md](../../03-visual-foundations/01-colors.md)
- Matemática e algoritmos: [06-mathematics-and-algorithms.md](../../03-visual-foundations/06-mathematics-and-algorithms.md)
- Guia de configuração de temas: [03-configuration-guide.md](../../04-theme-engine/03-configuration-guide.md)
