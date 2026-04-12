---
level: n1
id: N1-06
title: "Dark mode sem esforço"
prerequisites: ["N1-02", "N1-05"]
duration: "8 min"
lang: pt-BR
---

# N1-06 · Dark mode sem esforço

## Contexto

Dark mode costuma ser tratado como um projeto separado: você projeta a versão light, termina, e então começa tudo de novo para o dark — escolhendo manualmente cada cor alternativa, verificando cada contraste de novo, esperando que as duas versões não divirjam ao longo do tempo.

No Aplica DS, o dark mode não é um projeto separado. É uma propriedade matemática do sistema. Quando você usa os tokens corretos, o dark mode já existe — você só precisa saber onde verificar.

---

## Conceito

### O que acontece quando o tema muda

Imagine que o token `interface.function.primary.normal.background` tem um valor no tema light: um azul vibrante. No tema dark, esse mesmo token tem um valor diferente — um azul mais suave, calculado para funcionar sobre fundo escuro.

Quando o usuário ativa o dark mode, o que muda é o **tema ativo**. Os tokens permanecem os mesmos. Os valores por trás deles mudam automaticamente.

Você, como designer, não precisa criar duas versões do componente. O sistema resolve.

### O que define "correto" no Figma

No Figma, um elemento está configurado corretamente para dark mode quando:
- Sua cor de preenchimento (fill) está vinculada a um **token Semantic ou Foundation** — não a um hexadecimal solto
- Ao trocar a library de tokens para o tema dark, o elemento muda de cor automaticamente

Se um elemento tem um hex fixo no fill, ele não responde à troca de tema. Isso é o sinal de que algo precisa ser corrigido.

### A segunda dimensão: surface negativa

Além do dark mode (fundo escuro), o sistema tem uma outra dimensão: a **surface negativa**.

A surface positiva é a interface normal. A surface negativa é como um "negativo fotográfico" — as escalas de cor são invertidas dentro do mesmo modo. Você pode ter:

| Combinação | Quando usar |
|------------|------------|
| Light + Positive | Interface padrão (mais comum) |
| Light + Negative | Seção invertida dentro de uma página light — banners de destaque |
| Dark + Positive | Dark mode padrão |
| Dark + Negative | Raramente usado |

A surface negativa é útil para criar contraste visual imediato em uma seção sem trocar para dark mode. No Figma, cada combinação é um tema separado na library.

---

## Exemplo guiado

### Verificando um componente no Figma

Para confirmar que um componente seu está pronto para dark mode, siga estes passos:

**Passo 1:** Selecione o componente no Figma.

**Passo 2:** Inspecione cada fill, stroke e texto. Todos devem exibir o nome de um token (ex.: `semantic/color/interface/function/primary/normal/background`), não um hexadecimal.

**Passo 3:** Troque a library de tokens para a variante dark (ex.: `aplica_joy-dark-positive`). O componente deve mudar de cores.

**Passo 4:** Confirme que as relações visuais se mantêm: o botão ainda parece um botão, o alerta ainda parece um alerta, o texto ainda é legível.

### O que corrigir quando não funciona

Se um elemento não mudou ao trocar de tema, a causa é quase sempre uma destas:

| Sintoma | Causa | Correção |
|---------|-------|---------|
| Fill continua no mesmo hex | Hex fixo aplicado diretamente | Substituir pelo token correto |
| Texto de sistema ficou ilegível | Token de texto de corpo usado sobre fundo de cor | Usar `txtOn` do mesmo token que o background |
| Ícone continua na mesma cor | Ícone com cor hardcoded | Usar `currentColor` ou o token correto |
| Sombra sumiu ou ficou pesada | Sombra com cor hex fixa | Usar os estilos de elevação da Foundation |

---

## Agora você tenta

Abra um arquivo de design seu. Escolha um componente que você criou recentemente.

1. Quantos fills, strokes ou textos usam hexadecimais diretos em vez de tokens?
2. Se você trocasse a library para o tema dark agora, o que quebraria?

Se houver hexadecimais, tente identificar qual categoria de token seria a correta para cada um usando o vocabulário do N1-02:

- É uma ação do usuário → Interface Function
- É feedback do sistema → Interface Feedback
- É identidade da marca → Brand
- É um fundo ou texto neutro → Foundation

---

## Checklist de dark mode para designers

Antes de entregar um design, verifique:

- [ ] Todos os fills, strokes e cores de texto usam tokens (não hexadecimais)
- [ ] Textos sobre superfícies coloridas usam o `txtOn` do mesmo token que o fundo
- [ ] Nenhum elemento tem a cor escolhida "manualmente" pensando em como fica no dark
- [ ] O design foi verificado com a library do tema dark ativa
- [ ] Ícones e ilustrações têm tratamento para ambos os modos

---

## Checkpoint

Ao fim deste tutorial você deve saber:

- [ ] Por que dark mode é automático quando tokens corretos são usados
- [ ] Como verificar no Figma se um componente está pronto para dark mode
- [ ] O que é surface negativa e quando ela é útil
- [ ] Identificar e corrigir os 4 problemas mais comuns que quebram o dark mode no design

---

## Próximo passo

[N1-04 · Tokens no Figma — workflow do dia a dia](./04-tokens-no-figma.md)

Você tem o vocabulário, entende acessibilidade e dark mode. Agora vamos fechar o ciclo: como o Figma fica sincronizado com o sistema, e qual é o fluxo correto para aplicar tokens em um componente novo.

*(Este tutorial inclui prints e será publicado em breve.)*

---

## Referências

- Padrões de dark mode em código: [03-dark-mode-patterns.md](../../05-components-theory/03-dark-mode-patterns.md)
- Sistema de cores e inversão: [01-colors.md](../../03-visual-foundations/01-colors.md#dark-mode)
- Workflow de design no Figma: [02-designer-workflow.md](../../04-theme-engine/02-designer-workflow.md)
