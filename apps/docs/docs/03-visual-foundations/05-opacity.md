---
title: "Sistema de Opacidade do Aplica DS"
lang: pt-BR
---

# Sistema de Opacidade do Aplica DS

## Premissa

O sistema de opacidade (Alpha Channel) no Aplica DS não é um valor arbitrário escolhido visualmente, mas sim uma escala matemática finita. A opacidade atua como uma **modificadora de intenção e profundidade**, permitindo que camadas inferiores influenciem a percepção de cor da camada superior. Ela compartilha a responsabilidade arquitetural do Design System atuando em *overlays*, faders, estados desativados e componentes como modais.

Assim como as dimensões e cores, nenhum valor *hardcoded* (como `opacity: 0.35`) deve ser utilizado no código ou no design. O sistema de design fornece *tokens* semânticos e brutos.

O motor responsável por interpretar esses valores atende sob a arquitetura `aplica-tokens-theme-engine`.

---

## Escala Matemática de Opacidade

A escala padrão do sistema de Opacidade V2 opera em percentuais padronizados e absolutos de 0 a 100 (traduzidos para saídas em ponto flutuante `0` a `1` em CSS). 

A escala nativa é composta pelas seguintes predefinições:

| Token / Key | Valor | Output (alpha) | Uso Conceitual |
|-------------|-------|----------------|----------------|
| `transparent` | 0% | 0 | Superfícies completamente invisíveis, *hitboxes* invisíveis. |
| `superTransparent` | 10% | 0.1 | Estados muito sutis como recuos ou fundos de *hover* quase imperceptíveis. |
| `semiTranslucid` | 20% | 0.2 | Sobreposições leves, *hints* visuais, ou estados desabilitados secundários. |
| `translucid` | 50% | 0.5 | Padrão ouro para estados desabilitados (disabled) e *backdrops* padrão. |
| `superTranslucid` | 80% | 0.8 | Overlays densos e superfícies que exigem foco mas revelam a textura inferior. |
| `semiOpaque` | 90% | 0.9 | Elementos que quase obscurecem a superfície; uso em *tooltips* ou modais bloqueantes. |
| `opaque` | 100% | 1.0 | Superfícies sólidas, blocos completos de cor, visibilidade real e base. |

Esses valores são a matriz canônica. Podem ser customizados se um tema específico for definido via `config/global/themes.config.json` no atributo `global.opacityScale`, porém as chaves permanecem invariáveis para garantir a previsibilidade estrutural na camada `semantic`.

---

## Output e Acessibilidade

O canal de contraste WCAG é muito afetado por camadas translúcidas, por sua natureza que mescla os RGBs sobrepostos.

> [!WARNING]
> Cores ou planos textuais gerados por opacidade (ex: texto preto em color: rgba(0,0,0,0.5)) nunca são considerados algoritmicamente garantidos de passar em **WCAG AA / AAA** em todas as circunstâncias sem audição contextual, visto que a garantia do constraste é dependente do papel de parede e background vizinho.
> Use opacidade em texto (txtOn) SOMENTE onde é estritamente secundário e não porta as informações críticas do usuário. Para todo o conteúdo base de dados, utilize `txtOn` via Grayscale/Neutrals em vez de reduzir sua *Opacity*.

Acessibilidade (A11y) demanda cautela:
Ao aplicar uma `opacity` sobre componentes que devem criar sombras (`box-shadows`), é mandatório que essas sombras advenham exclusivamente das configurações validadas de **Grayscales**, evitando degradações da oclusão ambiental.

---

## Estrutura do Token

Os outputs são exportados sob a raiz arquitetural de opacidade:

```
semantic.opacity.raw.<key>
```
Exemplo: `{semantic.opacity.raw.translucid}` renderiza `0.5`.

### Stubs de Superfície (Surface Opacity Stubs)

Além da opacidade semântica (`semantic.opacity.raw.*`), o engine gera automaticamente uma camada de **cores translúcidas pré-compostas** — os chamados *stubs*. Esses tokens combinam a escala de opacidade com preto puro (`rgba(0,0,0,α)`) e branco puro (`rgba(255,255,255,α)`), produzindo valores de cor prontos para consumo imediato em sombras e sobreposições:

```
surface.opacity.color.dark.<key>    → rgba(0, 0, 0, <alpha>)
surface.opacity.color.light.<key>   → rgba(255, 255, 255, <alpha>)
```

| Token Stub | Valor Dark | Valor Light |
|---|---|---|
| `surface.opacity.color.*.transparent` | `rgba(0,0,0, 0)` | `rgba(255,255,255, 0)` |
| `surface.opacity.color.*.superTransparent` | `rgba(0,0,0, 0.1)` | `rgba(255,255,255, 0.1)` |
| `surface.opacity.color.*.semiTranslucid` | `rgba(0,0,0, 0.2)` | `rgba(255,255,255, 0.2)` |
| `surface.opacity.color.*.translucid` | `rgba(0,0,0, 0.5)` | `rgba(255,255,255, 0.5)` |
| `surface.opacity.color.*.superTranslucid` | `rgba(0,0,0, 0.8)` | `rgba(255,255,255, 0.8)` |
| `surface.opacity.color.*.semiOpaque` | `rgba(0,0,0, 0.9)` | `rgba(255,255,255, 0.9)` |
| `surface.opacity.color.*.opaque` | `rgba(0,0,0, 1)` | `rgba(255,255,255, 1)` |

> [!IMPORTANT]
> **Ponte com o sistema de Depth / Elevation**
> Esses stubs são a **fonte canônica** do primitivo **Luminosity** no sistema de profundidade (ver [04-depth-elevation.md](./04-depth-elevation.md)). As sombras externas (oclusão) consomem os stubs `dark`, enquanto o padrão "Inner Light" do Dark Mode consome os stubs `light`. Isso garante que:
> - Sombras permanecem acromáticas (sem croma/matiz) — eliminando *color vibration* em superfícies tinturadas
> - A intensidade de cada layer de sombra é governada pela mesma escala que toda a opacidade do sistema
> - Mudanças no `global.opacityScale` propagam automaticamente para os composites de elevação

---

## Famílias de Cores de Opacidade (desde 3.24.0)

Por padrão o engine gera apenas o par neutro (`grayscale` e `light`). Duas chaves opcionais em `config/global/themes.config.json` -> `global` ampliam isso **sem alterar nenhum output existente** (workspace que não define nenhuma das duas mantém o `dist/` byte-idêntico):

| Chave | Valores | Padrão | Efeito |
|-------|---------|--------|--------|
| `opacityColors` | array de `brand`, `feedback`, `product`, `function` | `[]` | Adiciona `semantic.opacity.color.<familia>.<item>.<step>` (7 steps por item) para as famílias selecionadas |
| `opacityStrategy` | `modify` ou `rgba-ref` | `modify` | Como o alpha é aplicado à cor base |

Itens e cores **nunca são uma lista fixa**: os itens vêm do schema do workspace e cada cor é o que o `mapping` do tema atribui, então as cores de produto mudam por marca automaticamente. Só o nível/variante **default** de cada item é usado. Variantes secundárias, estados de interação (`action`/`active`/`focus`), ghost e `disabled` ficam de fora de propósito.

```
semantic.opacity.color.brand.first.translucid
semantic.opacity.color.feedback.info.translucid
semantic.opacity.color.product.promo.translucid
semantic.opacity.color.function.primary.translucid
```

### Estratégia: `modify` vs `rgba-ref`

- **`modify`** (padrão): o token faz alias da cor base e aplica um alpha literal pela extensão `modify` do Tokens Studio.
- **`rgba-ref`**: o token é `rgba({<cor base>}, {semantic.opacity.alpha.<step>})`. O alpha vem de **tokens `number` sem unidade (0-1)** (`semantic.opacity.alpha.*`, emitidos só com essa estratégia e derivados de `opacityScale`). Assim o Tokens Studio >= 2.13.0 consegue linkar a variável de cor e a de opacidade no Figma.

Valores de CSS, JS, ESM e JSON são **idênticos** nas duas estratégias: o build reescreve o `rgba-ref` para o mesmo modifier antes do Style Dictionary rodar. Só o `data/` (o que o Tokens Studio lê) muda.

> [!NOTE]
> **Por que token `number` e não o tipo `opacity`?** A doc do Tokens Studio define `opacity` só para visibilidade de camada: uma cor que referencia um token `opacity` exporta para o Figma como variável em branco. Um número sem unidade dentro do `rgba()` linka direitinho. O `semantic.opacity.raw` mantém o tipo `opacity` (0-100) para opacidade de camada e nunca é referenciado por cores.

### Expondo as famílias no Foundation

Defina `structure.opacityColors` num config de foundation para criar aliases em `foundation.opacity.color.<familia>.<item>.<step>` (steps `superTransparent`, `semiTranslucid`, `translucid`, `superTranslucid`, `semiOpaque`):

```js
// config/foundations/my-foundation.config.mjs
structure: {
  opacityColors: true            // todas as famílias geradas
  // opacityColors: ['brand', 'feedback']   // ou um subconjunto
}
```

Famílias que não foram geradas via `global.opacityColors` são ignoradas. Ausente (padrão) deixa o foundation como está.

> [!WARNING]
> Cada família selecionada adiciona ~7 x (número de itens) tokens por arquivo `data/surface/*.json`. Com o schema de referência, `brand + feedback + product` = 70 tokens e `function` soma mais 21. Lembre do limite de 5.000 variáveis por coleção do Figma.

## Referências

- [Depth & Elevation — Luminosity e composição de sombras](./04-depth-elevation.md)
- [Matemática e Algoritmos — Seção 5: Opacidade](./06-mathematics-and-algorithms.md)
- Script de Sincronização e Regras: [sync-architecture.mjs](https://github.com/aplica-ds/aplica-tokens-theme-engine/blob/main/dynamic-themes/scripts/sync-architecture.mjs)
- Mapeador de Geradores de UI: [ui-generator.mjs](https://github.com/aplica-ds/aplica-tokens-theme-engine/blob/main/dynamic-themes/scripts/ui-generator.mjs)
