---
title: "O Token txt — Contrato de Cor Expandido"
lang: pt-BR
---

# O Token txt — Contrato de Cor Expandido

> **Introduzido em:** 3.6.0  
> **Tipo:** Breaking change — expande o contrato de propriedades de cor de 3 para 4 partes

## Visão geral

Até a versão 3.5.x, todo bloco de cor no Aplica Token System expunha **três propriedades**:

| Propriedade | Significado |
|-------------|-------------|
| `background` | Cor de fundo do elemento |
| `txtOn` | Texto legível sobre esse fundo colorido (contraste WCAG garantido) |
| `border` | Borda derivada do surface |

A versão 3.6.0 adicionou uma **quarta propriedade**:

| Propriedade | Significado |
|-------------|-------------|
| `txt` | Texto legível em contexto de conteúdo — sobre o canvas, não sobre uma superfície colorida |

A distinção é fundamental:
- **`txtOn`** responde: *"Qual cor deve ter um texto colocado sobre o background colorido deste elemento?"*
- **`txt`** responde: *"Qual cor deve ter um texto em fluxo de conteúdo no canvas atual, que referencia a família de cor deste elemento?"*

Um exemplo concreto: um banner de feedback de sucesso tem um `background` verde. `txtOn` é branco (para ler sobre verde). `txt` é um tom verde escuro — a cor que um parágrafo de texto relacionado ao sucesso usaria quando o canvas em si é branco.

---

## Onde txt aparece

`txt` se propaga por todas as camadas de cor que o engine gera:

| Camada | Padrão de caminho |
|--------|-------------------|
| Brand | `semantic.color.brand.branding.first.default.txt` |
| Interface function | `semantic.color.interface.function.primary.normal.txt` |
| Interface feedback | `semantic.color.interface.feedback.info_default.normal.txt` |
| Product | `semantic.color.product.promo.default.default.txt` |
| Grayscale | `semantic.color.brand.ambient.neutral.default.txt` |

---

## Aliases planos de foundation

A camada foundation expõe aliases simplificados de `txt` para os casos mais comuns:

```
foundation.txt.info      → texto legível para contextos informativos
foundation.txt.primary   → texto legível para contextos de brand primário
foundation.txt.promo     → texto legível para contextos promocionais
```

Esses aliases são **planos** (primeiro nível apenas). Aliases mais profundos de product e interface-function são controlados pela opção `textExposure`.

---

## Estados de texto

`txt` participa do mesmo modelo de estados comportamentais do restante do contrato de cor:

| Estado | Significado |
|--------|-------------|
| `txt.normal` | Cor de texto padrão |
| `txt.action` | Texto em hover — levemente mais proeminente |
| `txt.active` | Texto em estado pressionado/selecionado — mais escuro |
| `txt.focus` | Texto durante foco de teclado |

Exemplo de caminho: `semantic.color.interface.function.primary.normal.txt` vs `semantic.color.interface.function.primary.action.txt`.

---

## Configuração

### Nível do workspace (aplica-theme-engine.config.mjs)

A geração de `txt` é controlada no nível do workspace, não por tema. Isso garante que todos os temas de um workspace compartilhem o mesmo contrato de texto:

```javascript
import { defineThemeEngineConfig } from '@aplica/aplica-theme-engine/config';

export default defineThemeEngineConfig({
  generation: {
    colorText: {
      generateTxt: true,                          // Habilita a propriedade txt (default: false para compat)
      txtBaseColorLevel: 140,                     // Nível de paleta inicial para busca do txt
      fallbackBaseColorLevel: 160,                // Nível de fallback se o base não passar WCAG
      textExposure: ['feedback'],                 // Quais famílias recebem aliases foundation.txt.*
                                                  // Opções: 'feedback', 'interfaceFunction', 'product'
    }
  },
  // ... resto da config
});
```

### Override por tema (config de tema)

Temas individuais podem sobrescrever o nível inicial:

```javascript
export default defineThemeEngineConfig({
  name: 'my_brand',
  options: {
    txtBaseColorLevel: 120,   // Este tema usa uma base mais clara de txt que o padrão do workspace
  },
  // ...
});
```

### Opções de textExposure

| Valor | Aliases de foundation gerados |
|-------|-------------------------------|
| `'feedback'` | `foundation.txt.info`, `foundation.txt.success`, `foundation.txt.warning`, `foundation.txt.danger` (padrão) |
| `'interfaceFunction'` | `foundation.txt.primary`, `foundation.txt.secondary`, `foundation.txt.link` |
| `'product'` | `foundation.txt.promo`, `foundation.txt.cashback`, `foundation.txt.premium`, etc. |

O padrão é `['feedback']` apenas. Quanto menor a exposição, menor o output de foundation gerado.

---

## Contrato de acessibilidade

O engine valida `txt` contra o background ambiente — especificamente `theme.color.{mode}.brand.ambient.contrast.base.positive.background`. Ele sobe pelos níveis de paleta a partir de `txtBaseColorLevel` até encontrar um que passe o nível WCAG configurado (AA por padrão). Se nenhum passar, faz fallback para preto.

Isso significa que `txt` é sempre acessível, mas não é necessariamente a cor mais escura — é o tom mais próximo e acessível da escala, mantendo coerência visual com a família de cor do tema.

---

## Breaking Changes (3.6.0)

**Aliases de texto não mais herdam de `surface.*`**

Antes da 3.6.0, aliases de texto legível (como `foundation.txt.info`) eram aproximados reutilizando valores de cor de `surface.*`. Isso os tornava contextualmente incorretos quando o canvas não era branco.

A partir da 3.6.0:
- Todas as propriedades `txt` são geradas diretamente da paleta
- Aliases planos `foundation.txt.*` resolvem a partir de `txt.normal`
- A superfície padrão de texto legível na foundation é apenas `feedback`

**O que verificar após upgrade para 3.6.x:**
- Se seus componentes usam aliases `foundation.txt.*`, verifique se as cores correspondem às expectativas em light e dark mode
- Se você usava valores de `surface.*` como referência de cor de texto, migre para `semantic.color.*.txt.normal`
- Confirme que `generateTxt` está como `true` na config do workspace se precisar do novo contrato

---

## Relação com includePrimitives

A partir da 3.6.3, o workspace gerado pelo `aplica-theme-engine init` usa `includePrimitives: false` por padrão. A propriedade `txt` **não** é uma primitiva — é uma propriedade semântica gerada e está sempre incluída, independente dessa configuração.

---

## Veja também

- [Camada Semantic](./04-semantic-layer.md) — contrato completo de cor semântica
- [Guia de Configuração](../04-theme-engine/03-configuration-guide.pt-br.md) — opções de workspace e tema
- [Camada Foundation](./05-foundation-layer.md) — aliases de foundation
