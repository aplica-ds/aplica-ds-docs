---
level: n1
id: N1-05
title: "Acessibilidade por construção"
prerequisites: ["N1-02"]
duration: "8 min"
lang: pt-BR
---

# N1-05 · Acessibilidade por construção

## Contexto

Verificar contraste manualmente é cansativo e propenso a erro. Você escolhe uma cor, abre o verificador de contraste, confere a razão, ajusta, verifica de novo — para cada combinação de fundo e texto.

No Aplica DS, essa verificação não é necessária para a maior parte dos casos. O sistema calculou o contraste por você. Este tutorial explica a única regra que você precisa seguir para que isso funcione.

---

## Conceito

### O par background + txtOn

Todo token de cor que representa uma superfície vem acompanhado de dois outros tokens:
- **`background`** — a cor de fundo da superfície
- **`txtOn`** — a cor de texto que garante contraste adequado sobre aquele fundo
- **`border`** — a cor de borda derivada da superfície

O sistema calculou automaticamente qual cor de texto passa o nível WCAG AA (razão de contraste mínima de 4,5:1) sobre aquele fundo específico. Você não precisa verificar — a conta já foi feita.

**A regra:** Sempre use o `txtOn` do mesmo token que o `background`.

```
semantic.color.interface.function.primary.normal.background  →  fundo do botão
semantic.color.interface.function.primary.normal.txtOn       →  texto sobre o fundo
                                          ↑ mesma cadeia
```

### O que nunca fazer

**Misturar tokens de famílias diferentes:**

```
❌ background de: interface.function.primary.normal
   txtOn de:      interface.function.secondary.normal
   (o contraste não é garantido — essas duas famílias não foram calculadas juntas)

✅ background de: interface.function.primary.normal
   txtOn de:      interface.function.primary.normal
   (mesmo token — contraste garantido pelo sistema)
```

**Colocar um texto de Foundation sobre um background de Semantic diferente:**

```
❌ background: semantic.color.brand.branding.first.default.background (cor de marca)
   texto:      foundation.txt.body (calculado para fundos neutros)
   (ninguém garantiu que body text tem contraste sobre esse fundo de marca)

✅ background: semantic.color.brand.branding.first.default.background
   texto:      semantic.color.brand.branding.first.default.txtOn
   (sistema garantiu o contraste para este par específico)
```

### E o texto de corpo — `semantic.color.text.*`?

Os tokens de texto planos (`text.title`, `text.body`, `text.muted`, `text.label`) foram calculados para uso sobre os fundos neutros do sistema — `ambient.contrast.base` e `ambient.contrast.deep`. São seguros sobre o canvas padrão da interface.

Se você colocar `text.body` sobre um fundo de cor de marca, o contraste não é garantido. Use o `txtOn` daquele fundo de marca.

---

## Exemplo guiado

### Alerta de sucesso — montagem acessível

Um banner que diz "Configurações salvas com sucesso."

| Elemento | Token correto | Por quê |
|----------|--------------|---------|
| Fundo do banner | `feedback.success.default.normal.background` | Fundo suave de sucesso |
| Texto principal | `feedback.success.default.normal.txtOn` | Contraste garantido sobre esse fundo |
| Ícone de check | `feedback.success.secondary.normal.background` | Verde saturado, visível |
| Borda esquerda | `feedback.success.secondary.normal.border` | Ênfase visual da borda |

**Erros comuns que parecem funcionar mas não garantem acessibilidade:**

| ❌ Errado | Por quê não é seguro |
|-----------|----------------------|
| Fundo `success.default` + texto `text.body` | `text.body` foi calculado para fundos neutros, não para verde |
| Fundo `success.default` + texto `success.secondary.txtOn` | Tokens diferentes — contraste não calculado juntos |
| Ícone em hex `#22C55E` | Valor fixo que não vai mudar em dark mode |

### Botão desabilitado — dois padrões corretos

Quando um controle está desabilitado, você tem duas opções:

**Opção A — Token de disabled** (preferido para botões e controles individuais):
```
background: interface.function.disabled.normal.background
txtOn:      interface.function.disabled.normal.txtOn
```
O contraste entre esse fundo e esse texto é garantido — o usuário consegue ler o rótulo do botão desabilitado.

**Opção B — Opacidade** (para seções inteiras desabilitadas):
Reduzir a opacidade de uma região inteira via `semantic.opacity.raw.translucid` (50%). Funciona para blocos grandes, mas **não deve ser usado em texto pequeno** — a leitura pode ficar comprometida dependendo do fundo.

---

## Agora você tenta

Dado o componente abaixo, identifique quais combinações de cor são acessíveis e quais não são:

> **Componente:** Card de produto com badge de promoção

| Elemento | Cor usada | Acessível? |
|----------|-----------|------------|
| Fundo do card | `brand.ambient.contrast.base.positive.background` | — |
| Título do produto | `text.title` | — |
| Descrição | `text.body` | — |
| Badge "PROMO" — fundo | `product.promo.default.default.background` | — |
| Badge "PROMO" — texto | `text.body` | — |
| Preço em destaque | `brand.branding.first.default.background` (cor usada como texto colorido) | — |

**Resultado esperado:**

| Elemento | Acessível? | Correção |
|----------|-----------|---------|
| Fundo + título | ✅ Sim | `text.title` foi calculado para fundos neutros |
| Fundo + descrição | ✅ Sim | `text.body` foi calculado para fundos neutros |
| Badge fundo + `text.body` | ❌ Não | Usar `product.promo.default.default.txtOn` |
| Preço com cor de marca como texto | ❌ Depende | Usar `semantic.color.text.promo` (calculado para uso textual) |

---

## Checkpoint

Ao fim deste tutorial você deve saber:

- [ ] O que é o par `background` + `txtOn` e por que ele existe
- [ ] A regra: sempre use `txtOn` do mesmo token que o `background`
- [ ] Por que `text.body` não é seguro sobre todos os fundos
- [ ] Quando usar o token de `disabled` vs opacidade
- [ ] Identificar combinações de cor que rompem o contrato de contraste

---

## Próximo passo

[N1-06 · Dark mode sem esforço](./06-dark-mode-sem-esforco.md)

Você usa tokens corretos, o contraste está garantido. Agora: o que acontece quando o usuário ativa o dark mode? (Spoiler: nada que você precise fazer.)

---

## Referências

- Contrato de tokens e par bg+txtOn: [01-component-token-contract.md](../../05-components-theory/01-component-token-contract.md#o-par-background--txton)
- Sistema de cores e acessibilidade: [01-colors.md](../../03-visual-foundations/01-colors.md)
- Sistema de opacidade: [05-opacity.md](../../03-visual-foundations/05-opacity.md)
