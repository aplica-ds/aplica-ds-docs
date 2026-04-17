---
level: n2
id: N2-06
title: "Sobreposições responsáveis — quando e como usar overrides"
prerequisites: ["N2-03"]
duration: "10 min"
lang: pt-BR
---

# N2-06 · Sobreposições responsáveis

## Contexto

O pipeline do Aplica DS é sofisticado — mas não é onisciente. Haverá casos onde o comportamento gerado não é exatamente o que uma marca precisa. O tom neutro ficou frio demais. O cinza gerado não combina com a identidade quente da marca.

Overrides existem para esses casos. Mas eles têm um custo — não em tokens, mas em manutenibilidade — e um protocolo que deve ser seguido.

---

## Conceito

### O que são overrides

Overrides são configurações no `*.config.mjs` que substituem valores gerados pelo pipeline padrão. Você está dizendo ao engine: "Para este caso específico, ignore o valor calculado e use este."

O engine aceita overrides em dois pontos:

**1. Grayscale** — a escala de cinza fixa
Por padrão, o grayscale é um cinza neutro. Marcas com identidade quente (como marcas de moda, alimentação, lifestyle) frequentemente precisam de cinzas levemente amarelados ou rosados para manter a coerência visual.

```javascript
overrides: {
  grayscale: {
    light: {
      surface: {
        '5':   '#faf8f5',  // off-white com tom quente
        '10':  '#f5f2ee',
        '140': '#1a1814'   // quase-preto com tom quente
      }
    },
    dark: { /* mesma estrutura */ }
  }
}
```

**2. Neutrals** — os cinzas derivados da cor de marca
Por padrão, os neutrals são calculados com 10% de croma da cor de marca. Às vezes esse cálculo não produz o resultado visual desejado.

```javascript
overrides: {
  neutrals: {
    brand_principal: {
      light: { surface: { '5': '#fdf4f9' } }  // apenas o nível que precisa
    }
  }
}
```

### O ciclo obrigatório: Estudar → Testar → Documentar

Antes de aplicar qualquer override, siga as três etapas:

**Estudar:** Por que o valor padrão não serve? O problema é real ou é preferência estética? Às vezes o que parece errado é correto para WCAG e o problema está em outra camada.

**Testar:** Aplique o override em um ambiente isolado. Verifique o comportamento em light e dark mode. Confirme que o contraste ainda é adequado em todos os contextos onde o valor é usado.

**Documentar:** Registre no config (via comentário) ou no CHANGELOG do tema: qual era o problema, qual foi a solução, quando foi aplicado. Overrides sem documentação se tornam misterios impossíveis de resolver meses depois.

---

### O que NUNCA sobrepor

**Tokens Semantic diretamente.** A camada Semantic é gerada pelo `sync:architecture` — qualquer edição manual em `data/semantic/default.json` é sobrescrita na próxima execução. Se você precisa mudar o comportamento de um token Semantic, a mudança precisa acontecer no schema ou no config do tema, não no arquivo gerado.

**Valores calculados de txtOn.** O `txtOn` é calculado para garantir WCAG AA. Sobrepô-lo manualmente para "parecer melhor visualmente" remove a garantia de acessibilidade. Se você precisa de uma estratégia diferente, use `txtOnStrategy: 'brand-tint'` ou `'custom-tint'` no config — não sobreponha o txtOn diretamente.

---

## Exemplo guiado

### Três cenários: override correto, desnecessário e problemático

---

**Cenário A — Override legítimo**

Marca de alimentação artesanal. Identidade quente, rústica. O grayscale padrão (cinza frio) destoa visualmente de toda a paleta.

*Solução:*
```javascript
overrides: {
  grayscale: {
    light: {
      surface: {
        '5':  '#faf9f7',   // branco levemente amarelado
        '10': '#f5f3f0',
        '20': '#ebe8e3',
        '140':'#1f1d1a'    // preto levemente amarronzado
      }
    }
  }
}
```

*Documentação no config:*
```javascript
// Override de grayscale: identidade quente da marca exige cinzas com tom
// de 2-3% de amarelo/laranja. Aprovado por: DS team, 2026-03.
```

---

**Cenário B — Override desnecessário**

Um designer achou que o nível 50 da palette primária ficou "diferente do que esperava no Figma". Quer sobrepor o surface do nível 50.

*Análise:*
- O hex gerado pelo pipeline em OKLCh pode ser levemente diferente do hex declarado — isso é esperado e correto.
- Se o contraste está correto e a paleta é harmônica, a diferença de 1-2 dígitos no hex não é um problema.
- Sobrepor para "igualar ao Figma" vai criar um nível que destoa da curva de luminosidade da paleta inteira.

*Decisão:* Não aplicar o override. Atualizar o Figma para aceitar o valor gerado como canônico.

---

**Cenário C — Override problemático**

Um engenheiro quer que o txtOn do nível 100 da cor primária seja sempre preto (para manter o estilo da marca) mesmo que o branco tenha mais contraste.

*Análise:*
- `txtOn` garante WCAG AA. Forçar preto sobre um fundo escuro pode reprovar o contraste.
- Se a marca quer manter a identidade de cor no texto, a solução é `txtOnStrategy: 'brand-tint'` — o engine vai escolher o tom de marca que passa WCAG.

*Decisão:* Usar `txtOnStrategy: 'brand-tint'` em vez de override manual. Documentar se mesmo assim não atender.

---

## Agora você tenta

Dado o cenário abaixo, decida se um override é necessário e, se sim, qual é o correto:

> **Marca de finanças pessoais.** Paleta primária: azul `#2563EB`. O neutral gerado automaticamente tem um tom azulado muito perceptível — em um app de finanças, onde a confiança é visual, o neutral quase-azul parece "pouco sério". O time de branding quer neutrals mais próximos de cinza puro.

**Resultado esperado:**

Override legítimo. O croma de 10% aplicado ao azul vibrante resulta em um neutral com aparência mais azulada do que desejado para uma marca de finanças sérias.

Solução:
```javascript
overrides: {
  neutrals: {
    brand_principal: {  // chave correspondente ao hex #2563EB no config
      light: {
        surface: {
          '5':   '#f8f9fa',  // cinza quase-puro
          '20':  '#e8eaed',
          '60':  '#9aa0a6',
          '100': '#5f6368',
          '140': '#1c1c1e'
        }
      }
    }
  }
}
// Documentação: neutrals do azul primário redesenhados para cinzas
// mais neutros. Croma reduzido para ~2% vs padrão 10%.
// Motivo: identidade de marca financeira exige sobriedade visual.
```

---

## Checkpoint

Ao fim deste tutorial você deve saber:

- [ ] Em quais pontos o engine aceita overrides (grayscale, neutrals)
- [ ] O ciclo Estudar → Testar → Documentar antes de qualquer override
- [ ] Por que nunca editar `data/semantic/` manualmente
- [ ] Por que não sobrepor `txtOn` diretamente — usar `txtOnStrategy` em vez disso
- [ ] Distinguir um override legítimo de um desnecessário e de um problemático

---

## Próximo passo

Você concluiu o N2. Você entende como o sistema foi construído e pode governá-lo com responsabilidade.

Se quiser aprofundar em como configurar um tema completo do zero, continue com [N2-04 · Anatomia de um tema](./04-anatomia-de-um-tema.md).

Se quiser avançar para construção técnica em código, comece o N3 por [N3-01 · O contrato de tokens](../n3-design-engineer/01-contrato-de-tokens.md).

---

## Referências

- Filosofia de overrides: [01-aplica-ds-vision.md](../../00-overview/01-aplica-ds-vision.md#filosofia-de-overrides)
- Configuração de overrides: [03-configuration-guide.md](../../04-theme-engine/03-configuration-guide.md#sobreposições-overrides)
- Boas práticas de overrides: [OVERRIDE-BEST-PRACTICES.md](../../../references/aplica-tokens-theme-engine/docs/context/dynamic-themes-reference/OVERRIDE-BEST-PRACTICES.md)
