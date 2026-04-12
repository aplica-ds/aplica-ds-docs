---
level: n1
id: N1-01
title: "O que são tokens e por que eles existem"
prerequisites: []
duration: "8 min"
lang: pt-BR
---

# N1-01 · O que são tokens e por que eles existem

## Contexto

Antes de começar a usar o Aplica DS, existe uma pergunta que todo designer faz cedo ou tarde: "Por que não posso simplesmente pegar a cor da marca e aplicar direto?"

A resposta curta é: você pode. Mas então o que acontece quando a marca muda? Quando o cliente quer um dark mode? Quando o mesmo componente precisa funcionar em quatro produtos diferentes?

Tokens existem para resolver exatamente esse problema — e entender o problema torna o sistema muito mais fácil de usar.

---

## Conceito

### O problema: a cor da marca não existe no singular

Imagine que você está projetando um botão primário. Você escolhe o azul da marca — digamos, `#2563EB`. Tudo certo.

Agora o time de mobile precisa do mesmo botão. Eles copiam `#2563EB`. O time de web copiou também. O time de e-mail marketing também usa. Três produtos, três equipes, um hexadecimal repetido em centenas de arquivos e componentes.

Semanas depois, o cliente decide mudar o azul para `#1D4ED8`.

Você já sabe o que acontece.

### A solução: um nome com intenção

Em vez de copiar o valor, você cria um **nome que descreve o propósito**:

```
"cor de fundo do botão primário no estado normal"
```

Esse nome — o token — é o que os componentes usam. O valor por trás dele (`#2563EB`) fica em um único lugar: o sistema de design. Quando o cliente muda o azul, você atualiza o sistema uma vez. Todos os componentes em todos os produtos, em todas as plataformas, se atualizam automaticamente.

### Um token não é só uma cor

Tokens funcionam para qualquer decisão de estilo:

| O que você decidiu | Sem tokens | Com tokens |
|--------------------|-----------|------------|
| Cor de fundo do botão primário | `#2563EB` em 47 lugares | `semantic.color.interface.function.primary.normal.background` em 1 lugar |
| Espaçamento entre seções | `24px` em 83 lugares | `semantic.dimension.spacing.medium` em 1 lugar |
| Raio de borda de um card | `8px` em 31 lugares | `semantic.border.radii.medium` em 1 lugar |
| Fonte do título | `"Inter", 700, 24px` em 65 lugares | `semantic.typography.fontSizes.large` em 1 lugar |

A lógica é sempre a mesma: **nomeie a intenção, centralize o valor**.

### O que você ganha ao usar tokens

**Multi-marca sem retrabalho.** O botão primário do produto A tem a cor do produto A. O botão primário do produto B tem a cor do produto B. O mesmo componente, o mesmo token — valores diferentes resolvidos pelo sistema.

**Dark mode automático.** Quando o token `background do botão primário` é definido, o sistema já sabe qual valor usar no dark mode. Você não precisa criar uma versão escura do componente — ela já existe.

**Acessibilidade garantida.** O sistema calcula automaticamente se o texto sobre aquela cor tem contraste suficiente. Você não precisa verificar manualmente.

**Consistência real.** Dois designers em duas equipes diferentes, usando o mesmo token, sempre chegam ao mesmo resultado visual — mesmo que nunca tenham se falado.

---

## Exemplo guiado

### Como um token funciona na prática

Considere este botão:

```
Aparência: fundo azul, texto branco, borda azul escura
Estado: repouso (o usuário não está interagindo com ele)
```

No sistema de tokens, isso é descrito assim:

```
semantic.color.interface.function.primary.normal.background  → fundo azul
semantic.color.interface.function.primary.normal.txtOn       → texto branco
semantic.color.interface.function.primary.normal.border      → borda azul escura
```

Cada parte do nome tem um significado:
- `semantic` — é um token de propósito (não um valor bruto de paleta)
- `color` — é uma decisão de cor
- `interface.function` — é um elemento de interface com uma função
- `primary` — é o papel principal (o CTA mais importante)
- `normal` — é o estado de repouso
- `background` — é a propriedade específica

Quando o usuário passa o mouse sobre o botão, um estado diferente entra em ação:

```
semantic.color.interface.function.primary.action.background  → fundo azul um pouco mais escuro
```

Você não precisa decidir "quanto mais escuro" — o sistema já calculou.

---

## Agora você tenta

Olhe para um componente qualquer no seu projeto atual. Identifique:

1. Qual é a cor de fundo principal dele?
2. Qual é a cor do texto sobre esse fundo?
3. Esse componente tem um estado de hover ou pressed? Como a cor muda?

Agora tente descrever cada uma dessas decisões com palavras, sem usar o hexadecimal:

- "Fundo do componente X no estado normal"
- "Texto sobre o fundo do componente X"
- "Fundo do componente X quando o usuário interage"

Se você conseguiu descrever assim, você já está pensando em tokens.

---

## Checkpoint

Ao fim deste tutorial você deve saber:

- [ ] Por que copiar valores hexadecimais diretamente cria problemas de manutenção
- [ ] O que é um token: um nome que descreve uma intenção, não um valor
- [ ] Por que dark mode, multi-marca e acessibilidade são mais fáceis com tokens
- [ ] A estrutura básica do nome de um token (`semantic.color.interface.function...`)

---

## Próximo passo

[N1-02 · O vocabulário de cores](./02-vocabulario-de-cores.md)

Agora que você entende o que são tokens, o próximo passo é aprender o vocabulário: quais categorias de cor existem, para que serve cada uma, e como encontrar o token certo para cada situação no Figma.

---

## Referências

- Visão e filosofia do Aplica DS: [01-aplica-ds-vision.md](../../00-overview/01-aplica-ds-vision.md)
- Arquitetura de tokens (profundidade técnica): [01-token-architecture.md](../../01-design-tokens-fundamentals/01-token-architecture.md)
