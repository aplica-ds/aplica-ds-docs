---
level: n2
id: N2-04
title: "Anatomia de um tema — lendo e escrevendo um config"
prerequisites: ["N2-03"]
duration: "15 min"
lang: pt-BR
---

# N2-04 · Anatomia de um tema

## Contexto

Você entende o paradigma Config-First — a decisão de design começa no config, não no Figma. Agora é hora de abrir o arquivo real e entender cada seção.

Este tutorial é uma leitura comentada de um `*.config.mjs`. Ao fim, você saberá criar a estrutura básica de um novo tema do zero, sem consultar documentação para cada campo.

---

## Conceito

### O arquivo de config é o início de tudo

Cada tema existe como um único arquivo JavaScript em:

```
dynamic-themes/themes/config/{nome-do-tema}.config.mjs
```

O engine lê esse arquivo e gera automaticamente as cinco camadas (Brand, Mode, Surface, Semantic, Foundation) para todas as combinações de modo (light/dark) e superfície (positive/negative).

O config tem cinco seções principais — três obrigatórias, duas opcionais:

| Seção | Obrigatoriedade | O que define |
|-------|----------------|-------------|
| `name` | Obrigatória | O identificador único do tema |
| `colors` | Obrigatória | O dicionário de cores (nomes livres → hex) |
| `mapping` | Obrigatória | A conexão entre nomes livres e papéis semânticos |
| `typography` | Obrigatória | As famílias de fonte e pesos disponíveis |
| `options` | Opcional | Comportamentos do engine para este tema |
| `overrides` | Opcional | Substituições pontuais de valores gerados |
| `gradients` | Opcional | Definição de gradientes de marca |

---

## Leitura comentada

### Seção 1 — `name`

```javascript
export default {
  name: 'aplica_joy',
```

O `name` é o identificador único do tema no sistema. Ele define:
- O nome da pasta gerada em `data/brand/{name}/`
- A chave usada em `themes.config.json`
- O seletor CSS: `[data-theme="aplica_joy-light-positive"]`

**Regra:** Use underscore, não hífen. Letras minúsculas. Sem espaços. O nome deve ser estável — mudá-lo depois é equivalente a criar um tema novo.

---

### Seção 2 — `colors`

```javascript
  colors: {
    brand_principal: '#E7398A',
    brand_secundaria: '#38C2D0',
    brand_terciaria: '#8F58BD',

    acao_primaria:   '#C40145',
    acao_secundaria: '#1872A6',
    acao_link:       '#FF0F80',

    feedback_info:         '#CBF6ED',
    feedback_info_sat:     '#1872A6',
    feedback_success:      '#D7F6CB',
    feedback_success_sat:  '#86C46D',
    feedback_warning:      '#FEE6C2',
    feedback_warning_sat:  '#FDB750',
    feedback_danger:       '#F9C8C8',
    feedback_danger_sat:   '#EE5A5A',

    produto_promo:    '#6BC200',
    produto_promo_alt:'#D2FD9D',
    produto_cashback: '#FFBB00',
  },
```

`colors` é um **dicionário livre**. Os nomes são seus — não seguem nenhuma convenção do engine. `acao_primaria`, `primary_action`, `btnPrimary` seriam equivalentes.

O que importa aqui é a **qualidade das cores declaradas**, não os nomes. Cada hex será decomposto pelo pipeline OKLCh em 19 níveis de palette + 15 neutrals. A escolha certa: declare a cor de brand "pura" — não um tom claro nem escuro dela.

**Padrão de organização recomendado:** Agrupe as cores em blocos comentados (brand, interface, feedback, product). Configs bem organizados são muito mais fáceis de manter após 6 meses.

---

### Seção 3 — `mapping`

```javascript
  mapping: {
    brand: {
      first:  'brand_principal',
      second: 'brand_secundaria',
      third:  'brand_terciaria'
    },
    interface: {
      function: {
        primary:   'acao_primaria',
        secondary: 'acao_secundaria',
        link:      'acao_link'
      },
      feedback: {
        info_default:       'feedback_info',
        info_secondary:     'feedback_info_sat',
        success_default:    'feedback_success',
        success_secondary:  'feedback_success_sat',
        warning_default:    'feedback_warning',
        warning_secondary:  'feedback_warning_sat',
        danger_default:     'feedback_danger',
        danger_secondary:   'feedback_danger_sat',
      }
    },
    product: {
      promo_default:    'produto_promo',
      promo_secondary:  'produto_promo_alt',
      cashback_default: 'produto_cashback',
    }
  },
```

`mapping` é a **ponte** entre os nomes livres do `colors` e os papéis semânticos fixos do sistema.

O lado esquerdo (`brand.first`, `interface.function.primary`) é fixo — definido pelo schema de arquitetura. O lado direito (`'brand_principal'`, `'acao_primaria'`) é o nome que você escolheu em `colors`.

**A separação existe por uma razão:** Diferentes marcas podem usar a mesma estrutura semântica com cores completamente diferentes. O schema garante que `interface.function.primary` existe em todos os temas — o mapping garante que em cada tema ela aponta para a cor certa.

**Feedback: `default` vs `secondary`**

Cada papel de feedback tem duas variantes:
- `default` — tom suave, para backgrounds e áreas de baixa saturação
- `secondary` — tom saturado, para bordas, ícones e texto

A prática correta: para `feedback.info`, o `default` é geralmente o azul claro (usado como fundo de banners informativos) e o `secondary` é o azul saturado (usado em ícones e bordas).

---

### Seção 4 — `typography`

```javascript
  typography: {
    fontFamilies: {
      main:    'Inter',
      content: 'Inter',
      display: 'Inter',
      code:    'Fira Code'
    },
    weights: {
      main: {
        light:    { normal: 300, italic: 300 },
        regular:  { normal: 400, italic: 400 },
        semibold: { normal: 600, italic: 600 },
        bold:     { normal: 700, italic: 700 },
        black:    { normal: 900, italic: 900 }
      }
      // content, display, code: mesma estrutura
    }
  },
```

`fontFamilies` define as quatro famílias tipográficas do sistema:

| Família | Papel | Quando diferem |
|---------|-------|---------------|
| `main` | Fonte padrão — UI, labels, botões | Quase sempre |
| `content` | Fonte para corpo de texto longo | Marcas editoriais podem usar serif |
| `display` | Fonte para títulos e hero | Marcas com personalidade forte usam fonte display |
| `code` | Fonte monospace para código | Sempre diferente — `Fira Code`, `JetBrains Mono` |

Quando todos os quatro apontam para a mesma família (como `'Inter'` acima), o sistema usa uma fonte uniforme. Quando diferem, o engine gera variáveis CSS distintas para cada família — o designer de produto pode aplicar a tipografia sem se preocupar com qual fonte vai onde.

`weights` declara os pesos disponíveis. O engine usa esses pesos ao gerar os estilos de tipografia compostos (Heading, Display, Content, Action). Se um peso não está declarado, os estilos que dependem dele usam o mais próximo disponível.

---

### Seção 5 — `options` (opcional)

```javascript
  options: {
    txtOnStrategy: 'brand-tint',
    darkModeChroma: 0.85,
    accessibilityLevel: 'AA',
  },
```

`options` controla como o engine se comporta durante a geração.

**`txtOnStrategy`** — como o engine escolhe a cor do texto sobre fundos coloridos:

| Estratégia | Comportamento | Quando usar |
|------------|--------------|-------------|
| `'high-contrast'` (padrão) | Sempre preto ou branco puro | Interfaces de alta densidade, produto financeiro |
| `'brand-tint'` | Tom da paleta que passa WCAG | Marcas expressivas que querem manter presença de cor |
| `'custom-tint'` | Cor fixa configurada pelo designer | Casos muito específicos com fallback obrigatório |

**`darkModeChroma`** — o quão saturadas ficam as cores no dark mode:
- `0.85` (padrão) — 15% menos saturado que o light
- `0.7` — mais suave, para interfaces com muito tempo de tela
- `1.0` — mesma saturação do light (raramente desejável)

**`accessibilityLevel`** — o nível WCAG mínimo garantido pelo engine:
- `'AA'` (padrão) — contraste 4.5:1 — suficiente para a maioria dos produtos
- `'AAA'` — contraste 7:1 — mais restritivo, reduz a quantidade de combinações disponíveis

---

### Seção 6 — `overrides` (opcional)

```javascript
  overrides: {
    grayscale: {
      light: {
        surface: {
          '5':  '#faf9f7',
          '10': '#f5f3f0',
          '140':'#1f1d1a'
        }
      }
    }
  },
```

Overrides substituem valores gerados pelo engine em casos específicos. Apenas dois pontos aceitam overrides: `grayscale` e `neutrals`.

Esta seção deve ser a mais rara do config. Se ela está crescendo, é um sinal de que a cor declarada no `colors` pode não ser a certa — ou de que as expectativas precisam ser ajustadas.

Lembre-se do ciclo obrigatório antes de qualquer override: **Estudar → Testar → Documentar** (veja [N2-06](./06-overrides-responsaveis.md)).

---

### Seção 7 — `gradients` (opcional)

```javascript
  gradients: {
    brand: {
      first: {
        angle: 135,
        stops: [
          { position: 0, colorRef: 'brand.branding.first.lowest.background' },
          { position: 1, colorRef: 'brand.branding.first.default.background' }
        ]
      }
    }
  }
```

`gradients` define os gradientes de marca. As `colorRef` apontam para tokens da camada Brand — não para hex diretamente. Isso garante que o gradiente se adapta ao dark mode.

**Atenção ao build:** Gradientes só aparecem no output final quando `data/semantic/default.json` tem a seção `semantic.color.gradient` — criada pelo `sync:architecture`. Se gradientes parecem ausentes no CSS, rode `npm run sync:architecture` antes do build.

---

### Registrando o tema

Criar o `.config.mjs` não é suficiente. O tema precisa ser registrado em:

```json
// dynamic-themes/themes/config/global/themes.config.json
{
  "themes": {
    "aplica_joy": {
      "includePrimitives": true,
      "foundation": {
        "brand": "engine",
        "files": [
          "default.json",
          "styles/typography_styles.json",
          "styles/elevation_styles.json"
        ]
      }
    }
  }
}
```

**Regra crítica:** A chave `"aplica_joy"` deve ser idêntica ao `name` no `.config.mjs` e ao nome da pasta gerada em `data/brand/`. Qualquer divergência causa erros silenciosos no build.

---

## Exemplo guiado

### Lendo um config pela primeira vez

Dado um config desconhecido, a ordem de leitura que dá o quadro mais rápido:

**1. `name`** — qual é o tema? Confira se bate com a pasta em `data/brand/`.

**2. `mapping`** — quantas cores de produto existem? Cada item de product no mapping é custo. Avalie se o número é justificado.

**3. `colors`** — as cores de feedback têm `default` (suave) e `secondary` (saturado) para cada tipo? Se `danger_default` parece saturado demais, pode ser que esteja mapeado errado.

**4. `options`** — qual `txtOnStrategy` está ativa? Se `brand-tint` e a marca é de finanças, questione se é a escolha certa.

**5. `overrides`** — existe algo aqui? Se sim, verifique se há documentação (comentário ou CHANGELOG). Override sem documentação é dívida técnica.

---

## Agora você tenta

Uma empresa de streaming de música quer seu tema no sistema. Você recebe o briefing:

> **Marca:** Vibra  
> **Cor primária de ação:** `#7C3AED` (roxo vibrante)  
> **Cor secundária de ação:** `#10B981` (verde elétrico)  
> **Feedback:** cores padrão (azul/verde/âmbar/vermelho)  
> **Tipografia:** `'Poppins'` para tudo, exceto código (`'JetBrains Mono'`)  
> **Identidade:** expressiva, jovem — manter cor de marca no texto é importante  
> **Gradiente de herói:** do roxo claro para o roxo vibrante, 135°

Escreva (de cabeça, sem o arquivo aberto) a estrutura do `.config.mjs` com:
1. `name` correto
2. `colors` com as cores essenciais
3. `mapping` das cores de ação e pelo menos um feedback (success)
4. `typography` com as famílias corretas
5. `options` com a estratégia de texto correta para a identidade da marca

**Resultado esperado:**

```javascript
export default {
  name: 'vibra',

  colors: {
    roxo_primario:   '#7C3AED',
    verde_secundario:'#10B981',

    feedback_success: '#D1FAE5',     // suave, para bg
    feedback_success_sat: '#10B981', // saturado, para ícone/borda
    // ... outros feedbacks
  },

  mapping: {
    brand: {
      first: 'roxo_primario',
      second: 'verde_secundario',
    },
    interface: {
      function: {
        primary:   'roxo_primario',
        secondary: 'verde_secundario',
      },
      feedback: {
        success_default:   'feedback_success',
        success_secondary: 'feedback_success_sat',
        // ...
      }
    }
  },

  typography: {
    fontFamilies: {
      main:    'Poppins',
      content: 'Poppins',
      display: 'Poppins',
      code:    'JetBrains Mono'
    },
    // weights: estrutura padrão com pesos disponíveis da Poppins
  },

  options: {
    txtOnStrategy: 'brand-tint', // identidade expressiva — manter cor no texto
  },

  gradients: {
    brand: {
      first: {
        angle: 135,
        stops: [
          { position: 0, colorRef: 'brand.branding.first.lowest.background' },
          { position: 1, colorRef: 'brand.branding.first.default.background' }
        ]
      }
    }
  }
}
```

Pontos de atenção no resultado: `brand-tint` como estratégia de texto (explícito na identidade); nenhum item de product (não havia necessidade no briefing); a cor de `secondary` de ação mapeia para o mesmo verde do `brand.second` — isso é correto e eficiente.

---

## Checkpoint

Ao fim deste tutorial você deve saber:

- [ ] As 7 seções do config e para que serve cada uma
- [ ] A distinção entre `colors` (dicionário livre) e `mapping` (papéis semânticos fixos)
- [ ] O padrão `default` + `secondary` para cores de feedback
- [ ] As três estratégias de `txtOnStrategy` e quando usar cada
- [ ] Por que `overrides` deve ser a seção mais rara do config
- [ ] Como registrar o tema em `themes.config.json` e a regra de consistência de nomes
- [ ] A armadilha dos gradientes e quando rodar `sync:architecture`

---

## Próximo passo

[N2-05 · Cores de produto — crescimento responsável](./05-cores-de-produto.md)

Você sabe escrever um config completo. O próximo passo é entender a seção mais perigosa dele: as cores de produto. Por que cada item no `mapping.product` custa muito mais do que parece?

---

## Referências

- Guia completo de configuração: [03-configuration-guide.md](../../04-theme-engine/03-configuration-guide.md)
- O paradigma Config-First: [N2-03 · O paradigma Config-First](./03-paradigma-config-first.md)
- Overrides responsáveis: [N2-06 · Sobreposições responsáveis](./06-overrides-responsaveis.md)
- Exemplo de config real: [aplica-joy.config.mjs](../../../references/aplica-tokens-theme-engine/config/aplica-joy.config.mjs)
