---
title: "Sistema de Cores do Aplica DS"
lang: pt-BR
---

# Sistema de Cores do Aplica DS

## Premissa

Cores em um Design System são um subsistema completo — não estética, mas estrutura. Cada decisão de cor tem uma razão semântica: ela existe porque representa um papel na interface, não porque parece bonita.

O Aplica DS parte de um princípio simples: **nenhuma cor hardcoded. Toda cor é um token com propósito.** O mesmo token semântico pode assumir valores diferentes dependendo de brand, modo e superfície — sem que o componente que o consome precise saber disso.

---

## Taxonomia de Cores

O sistema organiza cores em grupos com responsabilidades distintas. Cada grupo responde a uma pergunta diferente.

### Brand Colors

> "Quem é a marca?"

Cores que carregam a identidade visual. Cada brand define até três cores primárias:

| Token | Semântica |
|-------|-----------|
| `brand.first` | Cor principal da marca |
| `brand.second` | Cor secundária |
| `brand.third` | Cor terciária |

Essas cores formam a base de todos os gradientes da marca e influenciam a geração das cores neutras (neutrals).

### Interface — Function

> "Qual é a hierarquia de ação?"

Cores que sinalizam ações interativas em componentes:

| Token | Semântica |
|-------|-----------|
| `interface.function.primary` | Ação principal — botão de destaque, CTA |
| `interface.function.secondary` | Ação secundária — pode coexistir com vários elementos do mesmo nível |
| `interface.function.link` | Âncoras, botões que parecem links |

A distinção entre Brand e Function é fundamental: Brand comunica identidade; Function comunica interatividade. Um elemento com cor de Brand não é necessariamente clicável. Um elemento com cor de Function sempre é.

### Interface — Feedback

> "O sistema está respondendo a quê?"

| Token | Semântica |
|-------|-----------|
| `interface.feedback.info` | Notificações neutras, informações sem viés positivo/negativo |
| `interface.feedback.success` | Ação concluída, reforço positivo |
| `interface.feedback.warning` | Atenção necessária, sem bloqueio de uso |
| `interface.feedback.danger` | Erro, bloqueio, ação destrutiva |

Cada feedback tem variante `default` (mais suave) e `secondary` (mais saturada). Isso permite usar a variante suave para backgrounds e a saturada para bordas ou ícones no mesmo componente.

**Nota sobre "Danger" vs "Erro":** O nome `danger` é intencional. Além de erros, essa cor é usada em ações potencialmente destrutivas (ex: "Excluir conta") — onde não há erro, mas há risco real.

### Product

> "Qual é o contexto de produto?"

Cores para necessidades de negócio que não se encaixam no vocabulário universal de interface. Alguns produtos precisam de linguagens visuais completamente próprias — indicadores de temperatura de alimentos, selos de promoção, sinalização de cashback, tiers de assinatura premium, indicadores de risco, badges de seller — e é para isso que a categoria **Product** existe.

> [!IMPORTANT]
> **Product nasce no config, antes de qualquer camada.** Entender essa origem é essencial para que designers mantenham intenção desde o início do trabalho em um sistema visual. Toda cor de produto começa como uma decisão deliberada de matiz hex, registrada explicitamente.

#### Origem: O Config é a fonte de verdade

Tudo começa no arquivo de configuração do tema (`*.config.mjs`). As cores de produto são declaradas em dois passos:

**Passo 1 — Declaração de matizes** (`colors`):
```js
colors: {
  // ... (brand, action, feedback)
  
  // Product: cada item tem default + variante alternativa (_alt)
  product_promo:        '#6BC200',   // matiz principal de promo
  product_promo_alt:    '#D2FD9D',   // matiz alternativa/secundária
  product_cashback:     '#FFBB00',
  product_cashback_alt: '#FFF94F',
  product_premium:      '#B200AF',
  product_premium_alt:  '#EBC2DD'
}
```

**Passo 2 — Mapeamento semântico** (`mapping.product`):
```js
mapping: {
  product: {
    promo_default:     'product_promo',      // → variante padrão
    promo_secondary:   'product_promo_alt',   // → variante alternativa
    cashback_default:  'product_cashback',
    cashback_secondary:'product_cashback_alt',
    premium_default:   'product_premium',
    premium_secondary: 'product_premium_alt'
  }
}
```

Esse mapeamento conecta o nome livre (`product_promo`) ao papel semântico (`promo_default`). A partir daqui, o engine faz todo o trabalho automaticamente.

#### Pipeline: da matiz hex ao token consumível

Cada cor de produto percorre exatamente o mesmo pipeline que Brand e Interface:

```
┌─────────────────────────────────────────────────────────────────────┐
│  CONFIG (*.config.mjs)                                              │
│  colors.product_promo = '#6BC200'                                   │
│  mapping.product.promo_default = 'product_promo'                    │
│                                                                     │
│  ▼ color-decomposer.mjs                                            │
│  Decomposição OKLCh → 19 níveis × (surface, txtOn, border)         │
│  + 15 níveis de neutrals × (surface, txtOn, border)                │
│  + 6 aliases de behavior                                           │
│                                                                     │
│  ▼ Brand Layer (_brand.json)                                        │
│  brand.color.product.positive.promo_default.{lowest→highest}       │
│  brand.color.product.negative.promo_default.{lowest→highest}       │
│                                                                     │
│  ▼ Mode Layer (light.json / dark.json)                              │
│  mode.color.product.promo_default.{lowest→highest}                 │
│  (light = positive, dark = inverted + chroma × 0.85)               │
│                                                                     │
│  ▼ Surface Layer (positive.json / negative.json)                    │
│  surface.color.product.promo.default.{lowest→highest}.{bg/txtOn/b/txt} │
│                                                                        │
│  ▼ Semantic Layer (default.json)                                       │
│  semantic.color.product.promo.default.{lowest→highest}.{bg/txtOn/b/txt}│
└─────────────────────────────────────────────────────────────────────┘
```

Cada item produz **5 intensidades** (`lowest`, `low`, `default`, `high`, `highest`) × **4 propriedades** (`background`, `txtOn`, `border`, `txt`) = **20 tokens** por variante (desde 3.6.0). Com `default` + `secondary`, são **40 tokens por item de Product**.

> [!CAUTION]
> **O custo de cada cor é exponencial. Menos é mais.**
>
> Cada item de Product não é "só uma cor" — é uma **cascade exponencial**:
>
> | Ação | Tokens gerados |
> |------|---------------|
> | 1 item (2 variantes) | **40 tokens** na camada Semantic (desde 3.6.0) |
> | × 4 camadas (Brand, Mode, Surface, Semantic) | **~160 tokens** por tema |
> | × N temas (ex: 4 marcas) | **~640 tokens** no sistema total |
>
> Os 3 itens padrão (`promo`, `cashback`, `premium`) já representam **~480 tokens por tema**. Cada item adicional acelera o crescimento.
>
> **Mais tokens = mais caos:** perda de performance (arquivos CSS/nativos maiores, builds mais lentos), aumento de complexidade (mais decisões para designers, mais propriedades para engenheiros), e entropia (tokens subutilizados geram confusão e dívida técnica).
>
> Antes de adicionar um novo item Product, pergunte:
> 1. _Essa necessidade pode ser resolvida com Feedback (info/success/warning/danger)?_
> 2. _Pode ser resolvida com uma variante de Brand existente?_
> 3. _Mais de 2 componentes realmente precisam dessa cor?_
>
> Se alguma resposta for sim, **não crie um item Product.**

#### Itens padrão fornecidos pelo Theme Engine

| Item | Variante Default | Variante Secondary | Uso típico |
|------|------------------|--------------------|------------|
| `promo` | `product_promo` | `product_promo_alt` | Promoções, descontos, badges de oferta |
| `cashback` | `product_cashback` | `product_cashback_alt` | Retorno financeiro, recompensas |
| `premium` | `product_premium` | `product_premium_alt` | Tiers, assinaturas, status especiais |

> [!WARNING]
> **Os itens são extensíveis, mas com custo.** Para adicionar um novo item, basta declará-lo em `colors` e `mapping.product` no config do tema. O pipeline criará automaticamente toda a paleta. Porém, leia o alerta acima — cada item novo propaga dezenas de tokens por todas as camadas e todos os temas. Documente a justificativa e valide que a necessidade não pode ser resolvida com tokens existentes.

#### Textos de Produto

Além do trio funcional (`background`/`txtOn`/`border`), o sistema gera tokens de texto dedicados para contextos de conteúdo puro — onde o texto é colorido mas não há superfície de fundo associada:

```
semantic.color.text.promo            → texto promocional solto
semantic.color.text.promo_secondary  → variante secundária
semantic.color.text.cashback         → texto de cashback
semantic.color.text.premium          → texto de tier premium
```

#### Diferença entre Product e Feedback

| | Interface — Feedback | Product |
|---|---|---|
| **Escopo** | Universal (toda UI precisa de info/success/warning/danger) | Específico do negócio (nem toda UI precisa de promo) |
| **Schema** | Rígido — fixo no engine, não extensível | Aberto — novos itens via config |
| **Intenção** | Comunicar resultado de ações do sistema | Comunicar contexto de domínio do produto |
| **Exemplo** | "Senha salva com sucesso" (success) | "20% de cashback nesta compra" (cashback) |

### Ambient — Grayscale

> "Preciso de profundidade sem interferência de cor?"

Escala fixa de 15 níveis (5–140) com valores neutros puros (ausência de matiz). 

A decisão de limitar o uso de Grayscale estritamente a elementos estruturais (acabamentos, bordas, linhas) e sombras (depth) não é arbitrária. Ela é fundamentada fortemente em **acessibilidade (A11y)** e boas práticas de mercado:

1. **Bordas e Divisores (WCAG 1.4.11 - Non-text Contrast & WCAG 1.4.1 - Use of Color):** 
   - A espinha dorsal arquitetural de uma UI (seus limites, inputs e separadores de dados) precisa ser infalível. Cinzas puros garantem que a **luminância** (variável crítica para contraste) seja perfeitamente previsível em qualquer monitor, facilitando o cumprimento dos `3:1` exigidos.
   - Pela regra 1.4.1, a cor não deve ser o único meio visual de informação. Ao construir o "esqueleto" do produto em Grayscale, garantimos que ele funciona por puro contraste. Isso reserva e isola o uso de cores vivas e "Neutrals" coloridos apenas para ressaltar hierarquia, áreas de superfície e estados semânticos (ativo, foco, erro). Se tudo for colorido, o cérebro tem *Cognitive Overload*.

2. **Sombras e Profundidade (Box-shadows):**
   - Embora "sombras coloridas" realcem designs *soft/glassmorphism* na web, em sistemas de alta densidade como o Aplica DS elas introduzem incerteza matemática no cálculo de contraste. Ao sobrepor um shadow translúcido colorido sobre outros fundos da interface, a mistura afeta não apenas a luminosidade, mas também a matriz da cor resultante (hue shift/degradação acromática), impossibilitando a garantia algorítmica de contraste previsível (WCAG).
   - O uso exclusivo em Grayscale (como o `#1a1a1a` com opacidade controlada) atua puramente como uma subtração de luminância dos pixels inferiores. Isso simula o sombreamento físico real (oclusão) de forma fidedigna e livre de ruídos, criando camadas (elevation) limpas enquanto mantém o contraste calculável e seguro para a interface.

*(Nota: Grayscale não é gerada algoritmicamente — são valores fixos por tema, podendo ser sobrescritos via configuração).*

| Nível | Valor (padrão) | Uso típico |
|-------|---------------|------------|
| 5 | `#f7f7f7` | Quase branco — background de card |
| 50 | `#aaaaaa` | Tom médio — bordas neutras |
| 100 | `#555555` | Tom escuro-médio — textos secundários |
| 140 | `#1a1a1a` | Quase preto — texto principal em dark |

### Ambient — Neutrals

> "Preciso de profundidade com temperatura de marca?"

Escala de 15 níveis gerada a partir da cor base da marca, mas com o croma (intensidade de cor) reduzido significativamente a **10%** da original. O resultado são tons quase neutros com uma leve temperatura cromática — criando coerência entre o ambiente e a identidade da marca sem chamar atenção para si mesmos.

Neutrals são usados prioritariamente para backgrounds de seções, superfícies de cards e estados da UI, envelopando o produto.

> [!NOTE]
> **Por que Neutrals não são simplesmente "Cinzas"? (A grande confusão)**
> É muito comum times de design perguntarem: *"Por que não posso usar um cinza da paleta Grayscale para esse fundo? Por que o cinza não é o 'Neutro' do sistema?"*
> 
> A resposta está na **Harmonia Óptica**. 
> - **Grayscale (Cinza Puro):** É a ausência matemática de cor. Quando você coloca um botão com a cor vibrante da marca (ex: Azul) sobre um fundo cinza puro, as cores não conversam. O cinza puro tende a parecer "morto", "sujo" ou arrastar a paleta para um aspecto desbotado quando pareado com cores vivas.
> - **Neutrals (Tom Temperado):** São o que chamamos de "Cinzas Coloridos". No Aplica DS, os Neutrals injetam 10% da Matiz da sua marca. Se a marca for Azul, o Neutral será um cinza levissimamente azulado. Isso faz com que fundos, bordas e superfícies conversem naturalmente com a marca do produto, criando uma interface harmoniosa, *premium* e viva, mesmo nas áreas "vazias" da tela.
> 
> A regra de ouro: **Use Neutrals para desenhar a interface e as superfícies. Use Grayscale apenas quando a cor for proibida (ex: sombras reais, divisor de conteúdo rigoroso, ou text-supports puros).**

---

## Decomposição de Cores

Dado uma cor base em hex, o Theme Engine a decompõe automaticamente em três escalas:

### Palette — 19 Níveis (10–190)

A escala primária. Cada nível tem três valores calculados:
- **surface** — a cor de preenchimento naquele nível
- **txtOn** — a cor de texto acessível sobre aquele surface
- **border** — a cor de borda naquele nível

**Interpolação de luminosidade (OKLCh):**

```
Nível 10   → L ≈ 0.98  (quase branco)
Nível 100  → L = baseL (cor original exata)
Nível 190  → L ≈ 0.05  (quase preto)

Acima do 100: interpolação linear de baseL até 0.98
Abaixo do 100: interpolação linear de baseL até 0.05
```

O nível 100 é sempre a cor declarada no config — sem round-trip OKLCh, preservando exatamente o valor configurado.

**Border:** derivada do surface pelo offset configurável (padrão: +10 níveis). Em light mode, a borda é uma sombra mais escura; em dark mode, mais clara.

### Neutrals — 15 Níveis (5–140)

Escala desaturada. Mesma estrutura (surface/txtOn/border), mas com croma multiplicado por **0.1** — mantendo apenas 10% da saturação original.

```
Nível 5    → L ≈ 0.98  (quase branco com temperatura)
Nível 140  → L ≈ 0.05  (quase preto com temperatura)
```

Neutrals suportam uma cor base alternativa via `override.baseColor` — permitindo que a temperatura de neutros seja independente da cor principal.

### Behavior — 6 Níveis Semânticos

Aliases sobre a palette, com nomes que correspondem a estados de interação:

| Nome | Referência na Palette | Uso |
|------|----------------------|-----|
| `lightest` | palette.10 | Estado mais suave — hover em áreas sensíveis |
| `active` | palette.50 | Foco por teclado, highlight |
| `normal` | palette.100 | Estado padrão de repouso |
| `action` | palette.120 | Hover do mouse |
| `pressed` | palette.140 | Click/tap, estado ativo |
| `darkest` | palette.170 | Máxima ênfase — raramente usado |

Behavior não gera novos cálculos — é um mapeamento semântico sobre a palette existente.

---

## Estratégias de txtOn

O `txtOn` é o token de texto que garante legibilidade sobre qualquer surface. O sistema suporta três estratégias configuráveis por tema:

### 1. `high-contrast` (padrão conservador)

Sempre preto (`#000000`) ou branco (`#ffffff`) — o que tiver maior contraste com o surface. Resultado: contraste máximo, sem nuança de cor.

**Quando usar:** Sistemas onde acessibilidade é prioridade absoluta; interfaces de alta criticidade.

### 2. `brand-tint`

Busca na própria palette o nível mais próximo que passa WCAG AA (4.5:1). Para surfaces claras, busca tons escuros da palette; para surfaces escuras, tons claros.

**Resultado:** Texto que mantém o tom cromático da marca — mais coerente visualmente, acessível.

**Quando usar:** Quando o identidade visual é importante e a marca tem cores suficientemente saturadas.

### 3. `custom-tint`

Aceita uma cor fixa para light e outra para dark. Se a cor configurada não passar WCAG, cai para `high-contrast` ou `brand-tint` como fallback declarado.

**Quando usar:** Quando o brand guideline especifica exatamente a cor de texto a usar, como em superfícies de marca específicas.

**Configuração de nível de acessibilidade:** O sistema suporta `AA` (4.5:1 — padrão) ou `AAA` (7:1). `colorContrastDecompose` (`startDark`/`startLight`) controla qual extremo o algoritmo tenta primeiro.

---

## Dark Mode

Em dark mode, o sistema não redefine as cores — ele inverte a palette:

```
surface_dark[level] = surface_light[200 - level]

Ou seja:
  dark[10]  = light[190]  → dark mode tem o tom mais escuro no nível mais baixo
  dark[100] = light[100]  → a cor base permanece (nível 100 não muda)
  dark[190] = light[10]   → dark mode tem o tom mais claro no nível mais alto
```

**Redução de croma:** Dark mode aplica um multiplicador de saturação (`darkModeChroma`, padrão: `0.85` = 15% menos saturado). Cores muito vibrantes em light mode ficam levemente mais suaves em dark — reduzindo fadiga visual sem perder identidade.

**Borders em dark mode:** Bordas são geradas em direção oposta (mais claras que o surface, não mais escuras) para manter visibilidade sobre fundos escuros.

---

## Grayscale em Produção

A grayscale tem um arquivo separado (`_grayscale.json`) porque:
1. Seus valores são fixos (não calculados algoritmicamente)
2. Cada tema pode sobrescrever os valores via `overrides.grayscale`
3. A geração em separado permite customização sem afetar o pipeline de cores da marca

Temas com temperatura quente podem ter uma grayscale levemente quente (`#faf8f5` em vez de `#f7f7f7`). Temas minimalistas podem usar escala mais fria.

---

## Tokens Gerados por Cor

Para cada alias de cor no config (ex: `joy_pink`, `action_magenta`), o engine gera:

```
brand.color.palette.<level>.surface      → 19 valores
brand.color.palette.<level>.txtOn        → 19 valores
brand.color.palette.<level>.border       → 19 valores

brand.color.neutrals.<level>.surface     → 15 valores
brand.color.neutrals.<level>.txtOn       → 15 valores
brand.color.neutrals.<level>.border      → 15 valores

brand.color.behavior.<state>.surface     → 6 valores
brand.color.behavior.<state>.txtOn       → 6 valores
brand.color.behavior.<state>.border      → 6 valores
```

Um tema típico com ~20 cores de base gera aproximadamente **1.200 tokens de cor primitivos** antes do mapeamento semântico.

---

## Mínimo de Cores para um Tema

| Grupo | Aliases | Qtd |
|-------|---------|-----|
| brand | first, second, third | 3 |
| interface.function | primary, secondary, link | 3 |
| interface.feedback | info, success, warning, danger (default + secondary cada) | 8 |
| product | promo, cashback, premium (default + secondary cada) | 6 |
| **Total (template padrão)** | | **20** |

Grayscale é separada e não entra nessa contagem. O grupo **product é extensível** — temas podem declarar mais ou menos itens conforme a necessidade; os 3 itens acima são o template de referência, não um mínimo rígido.

---

## Acessibilidade como Algoritmo

Acessibilidade não é um checklist — é parte do processo de geração. Para cada par surface/txtOn gerado:

1. O sistema calcula o contrast ratio via luminância relativa (WCAG)
2. Se o par falha no nível configurado (AA ou AAA), aciona o mecanismo de fallback
3. Falhas podem ser aceitas interativamente (modo CLI) ou em modo estrito (falha o build)

O script `verify-aa-compliance.mjs` pode ser executado independentemente para auditoria de qualquer combinação de tema.

---

## Evolução do Sistema de Cores

| Fase | Abordagem | Limitação |
|------|-----------|-----------|
| **Alpha** | Paleta manual, darken/lighten HSL | Sem consistência perceptual; tons distorcidos em saturações altas |
| **V1** | Algoritmo documentado, escala formalizada | Ainda HSL; racional claro mas implementação manual |
| **V2 atual** | OKLCh com interpolação de luminosidade | Consistência perceptual real; dark mode algorítmico; txtOn automático com WCAG |

A mudança para OKLCh foi a maior ruptura técnica entre V1 e V2. No espaço OKLCh:
- A percepção de brilho é linear (L=0.5 parece de fato "meio brilhante" para o olho humano)
- O hue se mantém estável durante tints e shades (azul não vira roxo ao clarear)
- O croma pode ser reduzido independentemente sem distorção de matiz

---

## Referências

- Script de decomposição: [color-decomposer.mjs](../../references/aplica-tokens-theme-engine/dynamic-themes/scripts/color-decomposer.mjs)
- Spec técnica: [COLOR-DECOMPOSITION-SPEC.md](../../references/aplica-tokens-theme-engine/docs/context/dynamic-themes-reference/COLOR-DECOMPOSITION-SPEC.md)
- Exemplo de config: [aplica-joy.config.mjs](../../references/aplica-tokens-theme-engine/config/aplica-joy.config.mjs)
- Verificação de contraste: [verify-aa-compliance.mjs](../../references/aplica-tokens-theme-engine/dynamic-themes/scripts/verify-aa-compliance.mjs)
- Mapeamento Alpha→V2: [04-v1-to-v2-rationals-mapping.md](../06-history/04-v1-to-v2-rationals-mapping.md)
