---
level: n2
id: N2-07
title: "Guia de decisões de output de cores"
prerequisites: ["N2-04", "N2-05"]
duration: "reference"
lang: pt-BR
---

# N2-07 · Guia de decisões de output de cores

## Contexto

O config do tema expõe cerca de uma dúzia de opções que mudam como o engine gera tokens de cor. Algumas mudam quais tokens existem (estrutura). Outras mudam os valores que esses tokens carregam (comportamento). Algumas precisam ser idênticas em todos os temas do workspace; outras são livres para divergir.

Este documento é uma referência, não um tutorial. Consulte quando estiver decidindo — não quando estiver aprendendo. Cada seção nomeia uma decisão, explica o sinal que indica qual caminho tomar, e enuncia a regra.

> **Modelo mental pré-requisito:** Você sabe o que é um quadrante (`light-positive`, `light-negative`, `dark-positive`, `dark-negative`) e quais são as cinco camadas de output. Se não, revise N2-04 primeiro.

---

## Que tipo de opção é essa?

Antes das nove decisões, uma classificação que importa:

| Tipo | O que controla | Pode diferir entre temas? |
|------|----------------|--------------------------|
| **Estrutura** | Quais caminhos de token existem no output | Geralmente **não** — camadas compartilhadas quebram se temas divergem |
| **Comportamento** | Quais valores os tokens carregam | Geralmente **sim** — cada tema define os seus |
| **Engineer-only** | Formato de integração, arquivos de output | Não é decisão de designer |

Opções de estrutura exigem coordenação em todo o workspace. Opções de comportamento são decisões por tema que você toma para cada marca de forma independente.

---

## Decisão 1 — Ghost surfaces devem ser geradas?

**O que é ghost:** Uma superfície ghost é um estado de interação translúcido — tipicamente um fundo tintado de baixíssima opacidade usado para estados hover/active em botões transparentes ou de ícone. Ghost é a variante secundária ao lado do solid.

**Tabela de sinais:**

| Sinal | Decisão |
|-------|---------|
| O produto usa botões de ícone, chips de filtro ou ações em toolbar que fazem hover com fundo tintado | Ativar ghost (`surfaces.ghost.enabled: true`) |
| Todos os elementos interativos usam apenas botões preenchidos — sem estados hover translúcidos | Desativar ghost |
| A biblioteca de componentes possui variantes "ghost" ou "subtle" de botão | Ativar ghost |
| Os tokens serão consumidos por uma biblioteca de componentes que você não controla | Ativar ghost — melhor tê-lo disponível e não usar do que precisar e não ter |

**Regra:** Ative ghost por padrão. Desative apenas quando a biblioteca de componentes for completamente solid-only e manter tokens ghost confundiria os consumidores.

```javascript
options: {
  interaction: {
    surfaces: {
      ghost: { enabled: true }   // padrão; defina false apenas para sistemas só-solid
    }
  }
}
```

---

## Decisão 2 — System-scale ou dilution?

**O que controla:** Como os estados de interação (`action`, `active`, `focus`) são derivados da cor base.

- **`system-scale`** — usa níveis fixos de paleta. A cor base fica no nível 100; hover pode ser nível 80, active nível 120. Previsível, explícito, usado por todos os temas anteriores ao 3.9.0.
- **`dilution`** — move a cor em direção a um destino (canvas ou âncora) por um fator. A cor base é o ponto de referência; fatores a puxam para mais perto ou mais longe do destino.

**Tabela de sinais:**

| Sinal | Método |
|-------|--------|
| O tema é existente; nenhuma mudança visual foi solicitada | `system-scale` — não mexa no que funciona |
| A marca usa uma cor base muito escura ou muito saturada que produz degraus feios em níveis fixos de paleta | `dilution` — a abordagem por fator se adapta proporcionalmente |
| O produto precisa que os estados de interação no dark mode pareçam nativos (escurecem no escuro, clareiam no claro) sem overrides por modo | `dilution` + `target: 'canvas'` |
| A equipe quer que a cor de hover permaneça cromática — sem virar cinza no hover/active | `dilution` + `target: 'anchor'` |
| O workspace tem múltiplas marcas e uniformidade entre interações é necessária | `system-scale` — níveis de paleta são explícitos e fáceis de auditar |

> **Restrição de workspace:** Todos os temas do workspace devem usar o mesmo `method`. Misturar `system-scale` e `dilution` corrompe a camada semântica compartilhada. Coordene essa decisão antes de escrever qualquer config.

```javascript
options: {
  interaction: {
    decomposition: {
      method: 'dilution'  // ou 'system-scale' — deve ser idêntico em todos os temas do workspace
    }
  }
}
```

---

## Decisão 3 — Qual destino de dilution?

_Aplica-se apenas quando `method: 'dilution'` está definido._

**O que controla:** Para onde os estados de interação se movem ao diluir a partir da cor base.

- **`'canvas'`** — estados se movem em direção ao canvas resolvido do quadrante ativo. Clareia em fundos claros, escurece em fundos escuros. Sem override manual de dark mode necessário.
- **`'anchor'`** — estados se movem em direção a uma âncora de cor configurável. Os estados permanecem dentro da mesma família de matiz em vez de derivar para cinza ou branco.

**Tabela de sinais:**

| Sinal | Destino |
|-------|---------|
| Estados de hover parecem desbotados ou acinzentados e a equipe de marca reclama | `anchor` com `source: 'palette'` — mantém a família de matiz |
| O produto tem uma cor de marca muito neutra ou cinza onde deriva para canvas é aceitável | `canvas` — mais simples, sem configuração de âncora |
| A marca tem uma cor de destaque personalizada que todos os estados interativos devem ecoar | `anchor` com `source: 'hex'` e o destaque em `anchor.hex` |
| Os estados de interação devem referenciar outro token do sistema (ex.: uma cor de marca secundária) | `anchor` com `source: 'token'` |
| O dark mode deve parecer correto automaticamente sem decisões manuais por modo | `canvas` — os estados se adaptam ao canvas resolvido de cada quadrante |

**Canvas-awareness da âncora:** Ao usar `target: 'anchor'`, a âncora pode ainda responder ao contexto claro/escuro. `anchor.canvasAware: true` com `anchor.canvasMix` entre 0 e 1 faz a âncora clarear em canvases claros e escurecer em canvases escuros mantendo seu matiz.

| `canvasMix` | Efeito |
|-------------|--------|
| `0.0` | Cor da âncora fixa independente do canvas |
| `0.2` | Resposta sutil ao canvas — matiz forte, leve variação de luminosidade |
| `0.5` | Equilibrado — matiz visível, adaptação clara ao canvas |
| `1.0` | Resposta total ao canvas — equivalente a `target: 'canvas'` |

```javascript
// Âncora: família de paleta da marca, canvas-aware
decomposition: {
  method: 'dilution',
  target: 'anchor',
  anchor: {
    source: 'palette',
    canvasAware: true,
    canvasMix: 0.2
  }
}
```

---

## Decisão 4 — Function e feedback devem usar regras diferentes?

**O que controla:** Se o grupo `interface.function` (botões primários, links, controles interativos) e o grupo `interface.feedback` (estados de erro, aviso, sucesso, info) compartilham a mesma config de decomposição ou têm regras independentes.

**Tabela de sinais:**

| Sinal | Decisão |
|-------|---------|
| O produto tem botões primários vibrantes e cromáticos mas estados de erro planos e dessaturados | Regras diferentes — configure cada grupo via `groups` |
| Todas as cores interativas seguem a mesma linguagem visual | Regras compartilhadas — mantenha uma única config de decomposição no nível do tema |
| Function precisa de dilution com âncora (mantém o matiz da marca) mas feedback deve seguir canvas (estados neutros) | Regras diferentes |
| O system designer é novo nessa config e quer minimizar complexidade | Mantenha regras compartilhadas por ora — adicione por grupo depois se necessário |

Quando function e feedback precisam de regras diferentes, declare cada grupo de forma independente. Cada grupo herda a config do tema e sobrescreve apenas o que muda:

```javascript
options: {
  interaction: {
    decomposition: { method: 'system-scale' }, // padrão do tema (feedback herda este)
    groups: {
      function: {
        decomposition: {
          method: 'dilution',
          target: 'anchor',
          anchor: { source: 'palette', canvasAware: true, canvasMix: 0.2 }
        },
        surfaces: {
          solid: { levels: { action: 1.2, active: 0.8, focus: 0.3 } }
        }
      }
      // feedback herda system-scale do nível do tema
    }
  }
}
```

---

## Decisão 5 — O feedback deve inverter com a polaridade da superfície?

**O que controla:** Se as cores de erro, aviso, sucesso e info são espelhadas pela polaridade de quadrante (`modeResolution`).

- **`'quadrant'` (padrão):** A superfície `dark-positive` é o inverso de `light-positive`. A superfície negative sempre mostra a versão com contraste invertido da superfície positive no mesmo modo. Esse é o comportamento padrão com consciência de quadrante.
- **`'mode'`:** Superfícies positive e negative são idênticas dentro do mesmo modo. Um badge de erro parece igual independente de estar em uma superfície positive ou negative — sem inversão de polaridade.

**Tabela de sinais:**

| Sinal | `modeResolution` |
|-------|-----------------|
| Estados de erro devem parecer idênticos em todo lugar — o vermelho não pode mudar entre fundos de card | `'mode'` |
| O design system usa superfícies negative como fundos contextuais (ex.: sidebars, drawers) e o feedback deve se adaptar a cada um | `'quadrant'` |
| O produto tem dilution com âncora configurado — mudanças de matiz importam entre quadrantes | `'quadrant'` — mantenha o comportamento por quadrante |
| O feedback é puramente informacional (chips de status, validação de formulário) e deve ser perceptivamente estável | `'mode'` |
| O design system tem suporte rico a dark mode com tratamentos distintos de superfície positive/negative | `'quadrant'` |

> `modeResolution` também pode ser definido por grupo. Se apenas o feedback precisa de comportamento mode-aware enquanto function permanece quadrant-aware: `options.interaction.groups.feedback.decomposition.modeResolution: 'mode'`.

```javascript
options: {
  interaction: {
    decomposition: {
      method: 'dilution',
      modeResolution: 'mode'  // o padrão é 'quadrant'
    }
  }
}
```

---

## Decisão 6 — O botão primário deve se adaptar ao quadrante ativo?

**O que controla:** Se o estado `normal` das superfícies de interação e o estado `default` das superfícies de produto são fixos na cor base autorada ou se ajustam com base no quadrante ativo (`baseAdaptation`).

Por padrão, `normal` e `default` são sempre o hex que você autorizou — `#C40145` em `light-positive`, `dark-positive`, `light-negative` e `dark-negative`. Com `baseAdaptation: true`, o engine ajusta a luminosidade dentro do OKLCh para cada quadrante preservando matiz e chroma.

**Apenas duas famílias de tokens são afetadas:** `interface.function.*.normal.background` e `product.*.default.background`. Todos os outros estados e todos os valores de texto/borda permanecem inalterados.

**Tabela de sinais:**

| Sinal | `baseAdaptation` |
|-------|-----------------|
| O botão primário está quase invisível em `dark-negative` porque a cor da marca é muito próxima do canvas escuro | `true` |
| A marca quer explicitamente superfícies base expressivas e contextuais que mudam com o ambiente | `true` |
| A cor do logotipo da marca e o botão primário devem sempre combinar exatamente | `false` |
| O produto é financeiro, institucional ou regulatório — a cor da marca é uma referência fixa | `false` |
| A equipe usa o valor de `normal.background` como âncora de cor em outros componentes | `false` |
| Nenhum problema de legibilidade é observado em nenhum quadrante | `false` — não adapte o que funciona |

```javascript
options: {
  baseAdaptation: true  // por tema — outros temas do workspace não são afetados
}
```

---

## Decisão 7 — Como o texto deve aparecer sobre superfícies da cor de marca?

**O que controla:** A estratégia usada para escolher uma cor `txtOn` (texto legível) quando colocado sobre um fundo colorido.

| Estratégia | Comportamento |
|------------|--------------|
| `'high-contrast'` (padrão) | Sempre branco ou preto puro — máximo contraste, WCAG AA garantido |
| `'brand-tint'` | Usa o tom de paleta que passa no WCAG — mantém a cor da marca no texto |
| `'custom-tint'` | Uma cor autorada fixa com fallback WCAG |

**Tabela de sinais:**

| Sinal | Estratégia |
|-------|-----------|
| O produto é uma interface densa de informação (tabelas de dados, dashboards, UI financeira) | `'high-contrast'` |
| A marca tem personalidade forte e quer que o texto nos botões pareça "dentro da paleta" em vez de preto/branco | `'brand-tint'` |
| O design system tem uma cor neutra específica para texto sobre superfícies de marca — não é preto ou branco | `'custom-tint'` |
| Acessibilidade é a restrição principal — sem concessão no contraste | `'high-contrast'` |
| Uma cor de marca clara (amarelo, lima) produz texto branco quase invisível por padrão | `'high-contrast'` resolve automaticamente; `'brand-tint'` pode selecionar texto escuro da paleta |

```javascript
options: {
  txtOnStrategy: 'brand-tint'  // por tema
}
```

---

## Decisão 8 — Qual é o piso de acessibilidade?

**O que controla:** A proporção mínima de contraste WCAG que o engine impõe ao selecionar cores de texto.

| Nível | Proporção | Caso de uso |
|-------|-----------|-------------|
| `'AA'` (padrão) | 4.5:1 | Padrão para quase todos os produtos |
| `'AAA'` | 7:1 | Governo, saúde e produtos acessibilidade-first |

**Tabela de sinais:**

| Sinal | Nível |
|-------|-------|
| O produto não tem mandato explícito de acessibilidade além da conformidade padrão | `'AA'` |
| O produto é um serviço público, aplicação de saúde ou tem usuários com deficiência visual como audiência primária | `'AAA'` |
| A paleta da marca tem matizes muito saturados de meio-tom que frequentemente falham no AAA | `'AA'` — AAA vai super-restringir a seleção de cores |
| Requisitos legais ou de conformidade especificam WCAG AAA | `'AAA'` com `acceptAALevelFallback: true` para permitir degradação graciosa |

```javascript
options: {
  accessibilityLevel: 'AA',       // padrão
  acceptAALevelFallback: true     // relevante apenas com 'AAA': aceita AA se AAA for impossível
}
```

---

## Decisão 9 — Quão saturado deve ser o dark mode?

**O que controla:** Um multiplicador de chroma aplicado durante o pipeline OKLCh para superfícies de dark mode. Valores menores produzem cores mais suaves e menos saturadas no dark mode.

| `darkModeChroma` | Efeito |
|-----------------|--------|
| `1.0` | Saturação total — mesmo chroma do light mode |
| `0.85` (padrão) | 15% menos saturado — confortável para a maioria dos produtos |
| `0.7` | Visivelmente mais suave — melhor para uso prolongado de tela, editorial, UIs focadas em leitura |
| `0.5` | Significativamente mudo — temas escuros high-end, editoriais ou minimalistas |

**Tabela de sinais:**

| Sinal | Valor |
|-------|-------|
| O dark mode parece neon ou agressivo — usuários ou a equipe de marca reclamam | Reduza para `0.7` |
| O produto é usado em sessões longas (ferramentas de código, editorial, apps de comunicação) | Reduza para `0.7–0.8` |
| O dark mode precisa ser tão vibrante quanto o light mode (jogos, entretenimento, marca expressiva) | Mantenha em `1.0` ou próximo |
| Nenhum feedback específico — o comportamento padrão parece correto | Mantenha em `0.85` |

```javascript
options: {
  darkModeChroma: 0.75  // por tema
}
```

---

## Opções que são somente do engineer

Não configure essas opções sem um engineer na decisão. Elas afetam o formato de output dos arquivos e contratos de integração, não o comportamento visual.

| Opção | O que faz | Quem decide |
|-------|-----------|-------------|
| `options.includePrimitives` | Gera JSON de paleta cru (`_primitive_theme.json`) para uso direto com Figma Variables | Engineer — depende de a Figma usar Variables diretamente ou Tokens Studio |
| `generation.colorText.generateTxt` | Toggle master para geração do token `txt` (texto legível) | Engineer — workspace inteiro, afeta todos os consumidores |
| `generation.colorText.textExposure` | Quais famílias de cor recebem aliases planos `txt.*` no nível de foundation | Engineer + designer juntos — afeta quais tokens de texto os autores de componente usam |
| `options.uiTokens` | Gera output de token de UI com escopo de componente | Engineer — formato de integração |
| `generation.colorText.txtBaseColorLevel` | Nível de paleta inicial para lookup de texto legível | Engineer — afeta o algoritmo, não o resultado visual diretamente |

> **Dica de ouro — performance de tokens de marca.** Se o bundle de marca no Figma ultrapassar aproximadamente 3.000 tokens, o seletor de variáveis fica lento e a sincronização trava. O engine divide automaticamente o `_brand.json` desde a 3.14.0, o que normalmente resolve. Se a performance ainda degradar após a divisão, considere: (1) quebrar o workspace em repositórios por marca; ou (2) desabilitar a superfície `negative` (`options.surfaces: ['positive']`) — isso reduz o tamanho do arquivo de marca em 50%, e é adequado apenas quando o produto nunca renderiza em fundos com superfície negativa.

---

## Referência rápida

| Decisão | Opção | Padrão | Por tema? |
|---------|-------|--------|-----------|
| Ghost surfaces | `surfaces.ghost.enabled` | `true` | Sim |
| Método de decomposição | `decomposition.method` | `system-scale` | **Não — workspace** |
| Destino de dilution | `decomposition.target` | `canvas` | Sim |
| Fonte da âncora | `decomposition.anchor.source` | — | Sim |
| Regras por grupo | `groups.{function\|feedback}.*` | herdado | Sim |
| Polaridade do feedback | `decomposition.modeResolution` | `quadrant` | Sim |
| Adaptação de superfície base | `baseAdaptation` | `false` | Sim |
| Texto sobre cor de marca | `txtOnStrategy` | `high-contrast` | Sim |
| Piso de acessibilidade | `accessibilityLevel` | `AA` | Sim |
| Saturação do dark mode | `darkModeChroma` | `0.85` | Sim |

---

## Checkpoint

Depois de trabalhar com este guia para um novo tema, você deve ser capaz de responder:

- [ ] Ghost ativado ou desativado — e por quê?
- [ ] Qual método de decomposição — e o workspace inteiro está alinhado?
- [ ] Se dilution: canvas ou âncora — e qual fonte de âncora?
- [ ] Function e feedback compartilham regras ou divergem — e por quê?
- [ ] Comportamento de polaridade do feedback — quadrant ou mode?
- [ ] Superfícies base se adaptam ao quadrante ou permanecem fixas?
- [ ] Texto sobre superfícies de marca — high-contrast, brand-tint ou custom?
- [ ] Piso de acessibilidade — AA ou AAA?
- [ ] Saturação do dark mode — padrão ou ajustado?

Se você conseguir responder a todos os nove, o config captura completamente as intenções visuais do tema.
