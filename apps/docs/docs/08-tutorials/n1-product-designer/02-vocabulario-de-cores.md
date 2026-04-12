---
level: n1
id: N1-02
title: "O vocabulário de cores — Semantic e Foundation"
prerequisites: ["N1-01"]
duration: "12 min"
lang: pt-BR
---

# N1-02 · O vocabulário de cores

## Contexto

Você já entende que tokens nomeiam intenções. Agora o desafio prático: o sistema tem dezenas de tokens de cor. Como encontrar o certo sem precisar ler a documentação inteira antes de cada decisão?

A resposta é o vocabulário. Assim como uma língua tem substantivos, verbos e adjetivos — o sistema de tokens tem categorias. Quando você aprende as categorias, 90% das decisões se tornam óbvias.

---

## Conceito

### As quatro categorias de cor

Todo token de cor do sistema pertence a uma destas quatro categorias. Aprender o propósito de cada uma é o principal atalho cognitivo do sistema.

---

#### 1. Brand — identidade da marca

**Propósito:** Para elementos que comunicam a identidade visual da marca. Áreas hero, destaques institucionais, elementos de branding forte.

**Pergunta-chave:** "Este elemento está aqui para comunicar quem é a marca?"

| Token (simplificado) | Quando usar |
|---------------------|------------|
| `brand.branding.first.default` | Cor principal da marca — CTA de marca, hero |
| `brand.branding.second.default` | Segunda cor da marca — destaques secundários |
| `brand.branding.first.lowest` | Versão muito suave da cor — fundo de seção discreta |
| `brand.branding.first.high` | Versão escura da cor — texto de ênfase sobre fundo claro |

**Exemplo de uso:** A área hero de uma landing page com o gradiente da marca. O banner institucional. O ícone de app.

---

#### 2. Interface Function — ações e controles

**Propósito:** Para elementos com os quais o usuário interage — botões, links, toggles, checkboxes. Qualquer coisa que o usuário pode clicar, tocar ou ativar.

**Pergunta-chave:** "O usuário vai interagir com este elemento?"

| Token (simplificado) | Quando usar |
|---------------------|------------|
| `interface.function.primary.normal` | Botão principal — a ação mais importante da tela |
| `interface.function.secondary.normal` | Botão secundário — ação de suporte |
| `interface.function.link.normal` | Links e ações textuais |
| `interface.function.active.normal` | Tab ativa, item selecionado |
| `interface.function.disabled.normal` | Controle não disponível |

Cada papel tem três estados: `normal` (repouso), `action` (hover/pressed), `active` (selecionado). O sistema define os três automaticamente.

**Exemplo de uso:** O botão "Continuar" em um formulário. O link "Ver mais". O toggle de configuração. A tab selecionada em uma navegação.

---

#### 3. Interface Feedback — mensagens do sistema

**Propósito:** Para comunicar o resultado de uma ação do sistema — alertas, mensagens de erro, confirmações, avisos. Não é sobre estética — é sobre comunicação funcional.

**Pergunta-chave:** "Este elemento está comunicando algo que aconteceu no sistema?"

| Tipo | Quando usar |
|------|------------|
| `feedback.info.default` | Mensagens informativas, dicas, ajuda contextual |
| `feedback.success.default` | Confirmação de ação bem-sucedida |
| `feedback.warning.default` | Alertas, situações que merecem atenção |
| `feedback.danger.default` | Erros, ações destrutivas, situações críticas |

Cada tipo tem duas variantes:
- `default` — versão suave, para backgrounds de alertas e banners
- `secondary` — versão saturada, para bordas e ícones (mais proeminente)

**Exemplo de uso:** Banner "Cadastro realizado com sucesso!" (success). Toast "Atenção: sessão expirando em 5 minutos" (warning). Mensagem "Senha incorreta" abaixo de um campo (danger).

---

#### 4. Foundation — o vocabulário simplificado

**Propósito:** Atalhos cognitivos para os tokens mais usados no dia a dia. Em vez de escrever o caminho completo do Semantic, você usa um alias curto.

**Pergunta-chave:** "Existe um nome mais simples para o que preciso?"

| Foundation | Resolve para (Semantic completo) |
|-----------|----------------------------------|
| `foundation.bg.primary` | Fundo principal da interface |
| `foundation.bg.weak` | Fundo suave, canvas levemente contrastado |
| `foundation.bg.brand.first.primary` | Fundo com cor da marca (tom baixo) |
| `foundation.txt.title` | Cor de texto para títulos |
| `foundation.txt.body` | Cor de texto para corpo de texto |
| `foundation.txt.muted` | Cor de texto secundário/desabilitado |
| `foundation.bg.disabled` | Fundo de elementos desabilitados |

**Regra de uso:** Se um alias Foundation cobre o seu caso, use-o. Se não cobre (o caso é muito específico), use o Semantic diretamente.

> **Foundation não substitui o Semantic — é um atalho para os casos mais comuns.** Um componente da biblioteca usa sempre o Semantic completo. Um designer montando uma tela pode usar Foundation para agilidade.

---

### Como decidir qual categoria usar

```
O elemento tem função de interação (botão, link, toggle)?
    └─ SIM → Interface Function

O elemento está comunicando um resultado do sistema (alerta, erro, sucesso)?
    └─ SIM → Interface Feedback

O elemento está comunicando identidade de marca?
    └─ SIM → Brand

Preciso de um atalho simples para cor de fundo, texto ou borda comum?
    └─ SIM → Foundation (se o alias existir)
```

Se nenhuma das categorias acima se encaixa claramente — você provavelmente está tentando criar um token de produto customizado. Isso é possível, mas tem custo. Fale com o time de DS primeiro.

---

## Exemplo guiado

### Montando um card de notificação

Imagine um card que mostra: "Seu pedido foi aprovado!"

**Decisões de cor para cada elemento:**

| Elemento do card | Categoria | Token |
|-----------------|-----------|-------|
| Fundo do card | Foundation | `foundation.bg.weak` (suave, não distrativo) |
| Ícone de check | Feedback | `interface.feedback.success.secondary.normal.background` (verde saturado) |
| Texto principal | Foundation | `foundation.txt.body` |
| Texto de data (discreto) | Foundation | `foundation.txt.muted` |
| Botão "Ver pedido" | Interface Function | `interface.function.primary.normal.*` |
| Borda do card | Feedback | `interface.feedback.success.secondary.normal.border` |

Resultado: um card consistente com o vocabulário do sistema, que funciona em qualquer tema, com dark mode automático.

---

## Agora você tenta

Dado o layout abaixo, identifique a categoria correta para cada elemento:

> **Tela:** Modal de confirmação de exclusão
> - Ícone de alerta (triângulo laranja)
> - Título: "Deseja excluir este item?"
> - Texto: "Esta ação não pode ser desfeita."
> - Botão "Cancelar"
> - Botão "Excluir" (ação destrutiva)
> - Fundo do modal

**Resultado esperado:**

| Elemento | Categoria | Justificativa |
|----------|-----------|---------------|
| Ícone de alerta | Feedback (warning.secondary) | Comunica uma situação que merece atenção |
| Título | Foundation (txt.title) | Texto de hierarquia primária |
| Texto descritivo | Foundation (txt.body) | Corpo de texto padrão |
| Botão "Cancelar" | Interface Function (secondary) | Ação de suporte, não a principal |
| Botão "Excluir" | Interface Function (danger via feedback) | Ação destrutiva |
| Fundo do modal | Foundation (bg.primary) | Canvas principal da interface |

---

## Checkpoint

Ao fim deste tutorial você deve saber:

- [ ] As quatro categorias de cor e o propósito de cada uma
- [ ] A pergunta-chave que leva à categoria certa: "O usuário interage? É feedback? É marca?"
- [ ] A diferença entre Foundation (atalho) e Semantic (fonte de verdade)
- [ ] Quando usar `default` vs `secondary` nos tokens de feedback
- [ ] Mapear os elementos de uma tela para as categorias corretas

---

## Próximo passo

[N1-05 · Acessibilidade por construção](./05-acessibilidade-por-construcao.md)

Você tem o vocabulário. Antes de aprender a aplicá-lo no Figma, existe uma regra fundamental que torna cada decisão de cor automaticamente acessível — e que é muito mais simples do que parece.

---

## Referências

- Sistema de cores completo: [01-colors.md](../../03-visual-foundations/01-colors.md)
- Camada Foundation: [05-foundation-layer.md](../../02-token-layers/05-foundation-layer.md)
- Camada Semantic: [04-semantic-layer.md](../../02-token-layers/04-semantic-layer.md)
