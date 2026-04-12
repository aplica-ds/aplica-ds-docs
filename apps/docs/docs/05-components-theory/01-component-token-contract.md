---
title: "component-token-contract"
lang: pt-BR
---

www# Contrato de Tokens para Componentes

## Premissa

Quando um engenheiro de sistema constrói um componente — ou quando um engenheiro de produto customiza uma tela — ele precisa saber exatamente quais tokens usar, de onde vêm, e o que o engine garante que nunca vai mudar sem aviso. Este documento define esse **contrato**: as regras canônicas que regulam o consumo de tokens em componentes e UIs.

O contrato tem duas dimensões:
- **Quais tokens usar** (Semantic vs Foundation, quando e por quê)
- **O que o engine garante** (namespaces reservados, breaking changes, versioning)

---

## A Regra Fundamental

```
Sempre use Semantic.
Use Foundation quando existir um alias adequado.
Nunca use Brand, Mode ou Surface diretamente.
```

| Camada | Consumo em componentes | Por quê |
|--------|------------------------|---------|
| **Semantic** | Sempre — é a camada canônica exposta | Expressa propósito, não valor interno. Todos os tokens são calculados, testados e garantidos por WCAG |
| **Foundation** | Quando um alias adequado já existe | Atalho cognitivo para times de produto. NÃO substitui Semantic como fonte de verdade |
| `brand.*`, `mode.*`, `surface.*` | **Proibido** em código de componente | Camadas internas — qualquer referência a elas quebra com mudanças de arquitetura |

### Por que Semantic, não Foundation?

A Foundation é uma camada de redução de carga cognitiva — ela existe para times de produto que constroem telas, não para quem constrói os componentes. Um componente que usa `foundation.bg.primary` aparentemente funciona, mas depende de que o tema atual tenha esse alias definido. Se o alias não existir ou mudar, o componente quebra silenciosamente.

A Semantic é o contrato estável. Um alias Foundation é opcional e conveniente — nunca obrigatório.

---

## Quem Consome o Quê

| Perfil | Camada principal | Fallback |
|--------|-----------------|---------|
| **Engenheiro de DS** (constrói componentes base) | Semantic — sempre, sem exceção | — |
| **Engenheiro de Produto** (monta telas com componentes) | Foundation — quando o alias existe | Semantic quando o alias não cobre o caso |
| **Designer** (no Figma via Tokens Studio) | Semantic — para componentes; Foundation — para layouts | — |
| **AI / Code Connect** | Semantic identificado por `semantic.*` | Foundation identificado por `foundation.*` |

---

## Como Reconhecer Tokens

O prefixo do caminho identifica a camada:

| Prefixo | Camada | Exemplo |
|---------|--------|---------|
| `semantic.*` | Semantic — camada canônica | `semantic.color.interface.function.primary.normal.background` |
| `foundation.*` | Foundation — alias para Semantic | `foundation.bg.primary` |
| `component.*` | Component — tokens de componente específico (quando disponível) | `component.button.primary.background` |
| `brand.*`, `mode.*`, `surface.*` | Camadas internas — **nunca usar** | — |

No CSS, os mesmos prefixos são usados com hifens:

```css
/* Semantic */
var(--semantic-color-interface-function-primary-normal-background)

/* Foundation */
var(--foundation-bg-primary)
```

---

## Mapa de Tokens Semantic por Categoria

### Cores de Marca — `semantic.color.brand`

#### Branding (`semantic.color.brand.branding`)

Identidade de marca primária. Use em áreas hero, CTAs de marca e destaques.

**Estrutura:** `semantic.color.brand.branding.{papel}.{intensidade}.{propriedade}`

| Segmento | Valores |
|----------|---------|
| `{papel}` | `first`, `second`, `third` |
| `{intensidade}` | `lowest`, `low`, `default`, `high`, `highest` |
| `{propriedade}` | `background`, `txtOn`, `border` |

```css
/* Botão hero de marca, estado normal */
background: var(--semantic-color-brand-branding-first-default-background);
color:      var(--semantic-color-brand-branding-first-default-txt-on);
border:     var(--semantic-color-brand-branding-first-default-border);
```

#### Ambient (`semantic.color.brand.ambient`)

Canvas base, neutros e escala de cinza. Use em layout, superfícies e hierarquia de texto — não em ênfase colorida.

**Estrutura:**

| Subgrupo | Chaves | Uso típico |
|----------|--------|-----------|
| `contrast.base` | `positive`, `negative` | Canvas principal, contraste de superfície |
| `contrast.deep` | `positive`, `negative` | Claro e escuro absolutos |
| `neutral` | `lowest` → `highest` (7 níveis) | Painéis elevados, superfícies secundárias |
| `grayscale` | `lowest` → `highest` (7 níveis) | Escala de cinza fixa independente de marca |

```css
/* Fundo principal do canvas */
background: var(--semantic-color-brand-ambient-contrast-deep-positive-background);

/* Painel elevado */
background: var(--semantic-color-brand-ambient-neutral-low-background);
```

---

### Controles Interativos — `semantic.color.interface.function`

Botões, links, controles e elementos interativos.

**Estrutura:** `semantic.color.interface.function.{papel}.{estado}.{propriedade}`

| `{papel}` | Uso |
|-----------|-----|
| `primary` | CTA principal |
| `secondary` | Ação secundária |
| `link` | Links e ações de texto |
| `active` | UI ativa ou selecionada |
| `disabled` | Controles desabilitados (só tem estado `normal`) |

| `{estado}` | Mapeia para |
|-----------|------------|
| `normal` | Estado padrão / repouso |
| `action` | Hover ou pressed |
| `active` | Ativo / selecionado |

```css
/* Botão primário — normal */
background: var(--semantic-color-interface-function-primary-normal-background);
color:      var(--semantic-color-interface-function-primary-normal-txt-on);
border:     var(--semantic-color-interface-function-primary-normal-border);

/* Botão primário — hover */
background: var(--semantic-color-interface-function-primary-action-background);

/* Botão desabilitado */
background: var(--semantic-color-interface-function-disabled-normal-background);
color:      var(--semantic-color-interface-function-disabled-normal-txt-on);
```

---

### Feedback do Sistema — `semantic.color.interface.feedback`

Alertas, badges e mensagens de sistema: info, success, warning, danger.

**Estrutura:** `semantic.color.interface.feedback.{tipo}.{variante}.{estado}.{propriedade}`

| `{tipo}` | Significado |
|----------|-------------|
| `info` | Informativo / neutro |
| `success` | Confirmação / sucesso |
| `warning` | Atenção / alerta |
| `danger` | Erro / ação destrutiva |

| `{variante}` | Uso |
|-------------|-----|
| `default` | Fundo suave — surfaces de alerta |
| `secondary` | Variante mais saturada — bordas e ícones |

```css
/* Alerta de sucesso */
background: var(--semantic-color-interface-feedback-success-default-normal-background);
color:      var(--semantic-color-interface-feedback-success-default-normal-txt-on);
border:     var(--semantic-color-interface-feedback-success-secondary-normal-border);
```

> **Regra de acessibilidade:** Sempre use `background` e `txtOn` do mesmo token. O par garante contraste WCAG. Nunca combine background de um nível com txtOn de outro.

---

### Cores de Texto — `semantic.color.text`

Tokens de texto simplificados — planos, sem intensidade, apenas propósito.

| Token | Uso |
|-------|-----|
| `semantic.color.text.title` | Títulos e texto primário de UI |
| `semantic.color.text.body` | Corpo de texto — conteúdo principal |
| `semantic.color.text.highlight` | Texto em destaque ou ênfase |
| `semantic.color.text.muted` | Texto secundário ou desabilitado |
| `semantic.color.text.label` | Labels de formulário e legendas |
| `semantic.color.text.info_default` | Texto de feedback informativo |
| `semantic.color.text.success_default` | Texto de feedback de sucesso |
| `semantic.color.text.warning_default` | Texto de alerta |
| `semantic.color.text.danger_default` | Texto de erro |

```css
h1 { color: var(--semantic-color-text-title); }
p  { color: var(--semantic-color-text-body); }
label { color: var(--semantic-color-text-label); }
```

---

### Cores de Produto — `semantic.color.product`

Cores específicas de produto — promoções, cashback, tiers, categorizações. A **única área aberta** da Semantic onde times de produto podem declarar categorias customizadas.

**Estrutura:** `semantic.color.product.{item}.{variante}.{intensidade}.{propriedade}`

| Segmento | Valores |
|----------|---------|
| `{item}` | `promo`, `cashback`, `premium` — ou qualquer nome livre definido no config |
| `{variante}` | `default`, `secondary` |
| `{intensidade}` | `lowest`, `low`, `default`, `high`, `highest` |
| `{propriedade}` | `background`, `txtOn`, `border` |

Tokens de texto plano também disponíveis em `semantic.color.text.{item}` e `semantic.color.text.{item}_secondary`.

> [!CAUTION]
> **Custo exponencial.** Cada item novo em `product` gera no mínimo 30 tokens que se propagam por todas as camadas e todos os temas. Em um sistema com 4 temas, um único item representa +120 tokens. Antes de adicionar, pergunte: _"Isso pode ser resolvido com feedback ou brand existentes?"_ Veja [04-semantic-layer.md](../02-token-layers/04-semantic-layer.md) para o racional completo.

---

### Gradientes — `semantic.color.gradient`

Configuração e passos de gradientes de marca.

| Grupo | Tokens |
|-------|--------|
| `gradient.config.degrees` | `horizontal`, `vertical`, `toBottom`, `diagonalLeft`, `diagonalRight`, `diagonalBrand`, `diagonalBrandAlt` |
| `gradient.config.steps` | 0, 10, 20, … 100 (paradas em %) |
| `gradient.config.colors` | `first.lowest`, `first.default`, etc. |

Gradientes são configurados no arquivo de tema (`*.config.mjs`) e só aparecem no output se `sync:architecture` rodar após `themes:generate`. Veja [04-build-pipeline.md](../04-theme-engine/04-build-pipeline.md#a-armadilha-dos-gradientes).

---

### Opacidade — `semantic.opacity`

Transparência para overlays, estados desabilitados e efeitos de vidro.

| Subgrupo | Chaves | Uso |
|----------|--------|-----|
| `opacity.raw` | `transparent` (0), `superTransparent` (10), `semiTranslucid` (20), `translucid` (50), `superTranslucid` (80), `semiOpaque` (90), `opaque` (100) | Valor numérico para aplicar a qualquer cor |
| `opacity.color.grayscale` | Mesmas chaves | Cor escura pronta com opacidade aplicada |
| `opacity.color.light` | Mesmas chaves | Cor clara pronta com opacidade aplicada |

```css
/* Overlay de modal */
background: var(--semantic-opacity-color-grayscale-super-translucid);

/* Estado desabilitado via opacidade */
opacity: calc(var(--semantic-opacity-raw-semi-translucid) / 100);
```

---

### Tipografia — `semantic.typography`

**Estrutura:**

| Grupo | Tokens relevantes |
|-------|-------------------|
| `fontFamilies` | `main`, `content`, `display`, `code` |
| `fontWeights` | Por família × peso × estilo (normal/italic) |
| `fontSizes` | `extraSmall` → `peta` (escala de 13 tamanhos) |
| `lineHeights` | `tight`, `close`, `regular` × tamanho |
| `letterSpacings`, `paragraphSpacing`, `textCase`, `textDecoration` | Complementos tipográficos |

Os estilos compostos da Foundation (`heading`, `content`, `display`, `hierarchy`, `action`, `link`, `code`) consomem esses tokens e são a forma preferida para os times de produto. No DS, acesse `semantic.typography` diretamente para controle granular.

---

### Dimensão — `semantic.dimension`

Espaçamento e sizing para layout, padding, margin, gap e dimensões de componente.

| Grupo | Escala de tokens |
|-------|-----------------|
| `sizing` | `zero`, `pico`, `nano`, `micro`, `extraSmall`, `small`, `medium`, `large`, `extraLarge`, `mega`, `giga`, `tera`, `peta` |
| `spacing` | Mesma escala (mínimo: `micro`) |

O `medium` na variante `normal` corresponde a 16px (1 LayoutUnit). Use `sizing` para altura de componente, ícone e espessura de borda; `spacing` para padding, margin e gap.

---

### Borda — `semantic.border`

| Grupo | Tokens | Uso |
|-------|--------|-----|
| `width` | `none`, `small`, `medium`, `large`, `extraLarge` | Espessura de contorno, divisores, rings de foco |
| `radii` | `straight`, `micro`, `extraSmall`, `small`, `medium`, `large`, `extraLarge`, `mega`, `circular` | Border radius por componente |

```css
/* Card com radius médio */
border-radius: var(--semantic-border-radii-medium);
border-width:  var(--semantic-border-width-small);
```

---

### Profundidade — `semantic.depth`

Spread de sombra para elevação.

| Token | Valor | Uso |
|-------|-------|-----|
| `depth.spread.close` | 0 | Sem elevação |
| `depth.spread.next` | -2 | Elevação mínima |
| `depth.spread.near` | -4 | Cards e painéis |
| `depth.spread.distant` | -8 | Dropdowns |
| `depth.spread.far` | -12 | Modais e dialogs |

Maior magnitude = mais elevação. Os estilos de elevação compostos da Foundation (`elevation.level_one` → `elevation.level_five`) são a forma preferida nos times de produto.

---

## O Par Background + txtOn

Toda superfície colorida no sistema tem dois tokens complementares: `background` e `txtOn`. O `txtOn` é calculado automaticamente pelo engine para garantir contraste WCAG AA (ou AAA, dependendo da config do tema).

**Regra invariável:** Sempre use o `txtOn` do mesmo token que o `background`.

```css
/* CERTO — par do mesmo token */
.badge-success {
  background: var(--semantic-color-interface-feedback-success-default-normal-background);
  color:      var(--semantic-color-interface-feedback-success-default-normal-txt-on);
}

/* ERRADO — mistura de tokens diferentes */
.badge-success {
  background: var(--semantic-color-interface-feedback-success-default-normal-background);
  color:      var(--semantic-color-text-body); /* ← contraste não garantido */
}
```

---

## Padrões Proibidos

| Padrão proibido | Por quê | O que usar em vez |
|----------------|---------|-------------------|
| `var(--theme-color-*)` | Camada interna | `var(--semantic-color-*)` |
| `var(--brand-*)`, `var(--mode-*)`, `var(--surface-*)` | Camadas internas | `var(--semantic-color-*)` |
| Inventar `--semantic-color-minha-cor` em CSS de produto | Viola o contrato — pode conflitar com builds futuros | Usar apenas paths que existem no `dist/` |
| Hardcoded hex `#C40145` em CSS de componente | Perde theming automático, dark mode e multi-marca | `var(--semantic-color-interface-function-primary-normal-background)` |
| `semantic.color.interface.feedback.info_default.background` com `semantic.color.text.body` sobrepostos | Contraste não garantido | Use o par `background` + `txtOn` do mesmo token |

---

## Contrato de Versionamento

### O que é garantido

O engine garante que os caminhos publicados em `dist/` (ex.: `--semantic-color-interface-function-primary-normal-background`) não mudarão sem um bump de versão major. Qualquer path que apareça no build é parte do contrato público.

### O que é breaking change

- **Renomear** um caminho de token (`semantic.color.interface.oldName` → `semantic.color.interface.newName`) — **major version**
- **Remover** um caminho de token — **major version**
- **Adicionar** um novo caminho — minor version (não quebra consumidores existentes)

### Depreciação

Quando um token precisa ser renomeado, o engine pode optar por uma janela de depreciação: o caminho antigo permanece no build marcado como deprecated na `$description`, com o caminho novo indicado. A remoção acontece na próxima versão major.

Mudanças são documentadas no `CHANGELOG.md` do engine, que especifica: caminho antigo, caminho novo, versão de remoção.

---

## Referências

- Camada Semantic em detalhe: [04-semantic-layer.md](../02-token-layers/04-semantic-layer.md)
- Camada Foundation: [05-foundation-layer.md](../02-token-layers/05-foundation-layer.md)
- Taxonomia canônica e naming: canonical-taxonomy-and-naming-contract.md
- Uso de tokens para componentes e Figma: token-usage-for-components-and-figma.md
- Formatos de output e variáveis CSS: [05-output-formats.md](../04-theme-engine/05-output-formats.md)
- Variantes e estados por componente: [02-component-variants.md](./02-component-variants.md)
- Padrões de dark mode: [03-dark-mode-patterns.md](./03-dark-mode-patterns.md)
- Escala de dimensão: [03-spacing-sizing.md](../03-visual-foundations/03-spacing-sizing.md)
- Sistema de cores: [01-colors.md](../03-visual-foundations/01-colors.md)
