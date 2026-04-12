---
title: "Matemática e Algoritmos Mestre"
lang: pt-BR
---

# Matemática e Algoritmos Mestre

Este documento concentra a **verdade matemática** (formulas e equações) por trás de todas as decisões do sistema visual do Aplica DS Theme Engine V2. Todo raciocínio da inteligência artificial, processamento de *build* ou validação de design **DEVE** pautar-se nestas fórmulas, em vez de recorrer a achismos e aproximações "mágicas".

---

## 1. Escalas Dimensionais (Tamanhos e Espaçamentos)

A formula primária que calcula todo o sistema de *Tokens* de dimensão (Sizes, Spacing, Radius) parte da noção de incremento proporcional à unidade base (habitualmente configurada em `16px`). A chave (`key`) reflete a porcentagem da unidade base.

**Fórmula Universal Analítica:**
```js
pxValue = key === 0 ? 0 : Math.max(1, Math.round((key / 100) * DefaultDesignUnit))
```

Onde:
- `DefaultDesignUnit`: Padrão de *16px* global.
- `key`: Número nominal da escala (ex: `0`, `50`, `100`, `250`).
- *Constraint*: Qualquer valor gerado acima de `0` será sempre de, no mínimo, `1px`.

**Mecanismos de Crescimento:**
O motor não gera valores contínuos lineares, mas adota sequências arquiteturais:
- **Até a Unidade Base (100):** Subdivisões e decimais em Base-4 (LayoutUnit local) – gerando as quebras comuns como 2px, 4px, 8px.
- **Acima da Unidade Base:** Sequência de "Pseudo-Fibonacci" modificada somando os termos anteriores:
  `f(n) = f(n-1) + f(n-2)` gerando crescimentos drásticos macro.

---

## 2. Decomposição de Cores e Interpolação no Espaço OKLCh

Em vez de usar `HSL` (cujas interpolações distorcem percepções como azul virando roxo, ou amarelos morrendo para o cinza escuro), a Engine de V2 baseia-se exclusivamente no espaço de cores perceptual **OKLCh** (Lightness, Chroma, Hue). O sistema ancora a matiz (`h`) e o croma (`C`), realizando a rampa na pureza de iluminação (`L`).

### Rampas de Palette Principal
A paleta cria 19 níveis numéricos (`10` a `190`).
Âncoras de Iluminação (`L` variando de `0.0` a `1.0`):
- Nível 10 (Mais claro): `L = 0.98`
- Nível 100 (Cor Core): `L = baseL` (L real aferido da cor configurada, mantida sem distorções no round-trip).
- Nível 190 (Mais escuro): `L = 0.05`

**Fórmula de Interpolação:**
Para níveis ≤ 100 (`targetL` para cores claras):
```js
t = (level - 10) / 90
L_resultante = 0.98 - t * (0.98 - baseL)
```
Para níveis > 100 (`targetL` para tons escuros):
```js
t = (level - 100) / 90
L_resultante = baseL - t * (baseL - 0.05)
```

### Escala de Neutrals ("Cinzas Coloridos")
A escala de Neutrals é gerada *overriding* a Chroma da marca.
- **Isolamento de Chroma:** Ela retém **apenas 10%** da saturação (`C * 0.1` do Original da marca), infundindo os tons puros com uma pífia temperatura de cor.
- Suas âncoras variam do Nível `5` (`L: 0.98`) ao Nível `140` (`L: 0.05`).

---

## 3. Dark Mode Perceptual

Dark Mode não é apenas uma paleta cinza escura solta. Suas inversões são **cálculos matemáticos espelhados**, seguidos da absorção cromática que atenua a radiação forte em visualização escotópica.

### Equação de Inversão de Nível
O nível de sombra solicitada no Light é perfeitamente replicada sob o índice invertido do Dark:
```js
DarkLevel[level] = LightLevel[200 - level]
```
*(exemplo: o equivalente ao Nível `10` vibrante no Dark mode passa a evocar o Nível `190`)*

### Calibração de Chroma no Dark Mode
Cores muito reflexivas ou puras brilham incômodamente no painel Dark (fadiga ótica). Devido a isso, a Engine V2 aplica uma restrição global multiplicadora para suavizar o Neon/Flare nos painéis escuros:
```js
darkModeChroma = baseChroma * 0.85
```
Traduzindo: O Dark mode tem 15% a menos de Saturação (Chroma) nativas que suas contrapartes no Light Mode.

---

## 4. O Sistema "txtOn" e Cálculo Analítico WCAG

O `txtOn` nunca é presumido. Ele é validado nativamente medindo a luminância relativa para atestar a legibilidade:

```js
contrastRatio = (LighterLuminance + 0.05) / (DarkerLuminance + 0.05)
```
1. **Brand-Tint**: A varredura navega na Paleta buscando por alguma das polaridades que suporte, no mínimo, `4.5:1` de *Ratio* contra o Surface.
2. **Fallback High-Contrast**: Se a *hue* da marca falhar em prover textos suficientemente seguros, a API força o contorno analítico usando extremo preto-e-branco (`#000000` ou `#ffffff`) e retém o de maior contraste. 

---

## 5. Opacidade

A Opacidade obedece um mapeamento escalar 1D padronizado. Os níveis estritos de transparência em um sistema linear traduz-se pelo percentual convertido em Alpha:
- `10%  (0.1) ` → `superTransparent`
- `20%  (0.2) ` → `semiTranslucid`
- `50%  (0.5) ` → `translucid`
- `80%  (0.8) ` → `superTranslucid`
- `90%  (0.9) ` → `semiOpaque`
- `100% (1.0) ` → `opaque`

Todo *Alpha-blending* é rigidamente documentado para compor e suprimir cor via engine. Nenhuma transparência intermédia como `0.342` ganha compilação sob as rédeas do *Theme Engine V2* sem a criação de um override de scale em `global.opacityScale`.

---

## 6. Escala Tipográfica e Grid-Locking

A tipografia é derivada matematicamente através de uma escala geométrica (Musical Scale) ancorada na `DefaultDesignUnit` (`16pt` por padrão).

### Fórmula de Tamanho de Fonte

```js
fontSize = DefaultDesignUnit × ratio^exponent
```

Onde:
- `ratio`: Fator de escala musical — **padrão: `1.2` (Minor Third)**. Configurável em `global.typography.fontSizeScaleRatio`.
- `exponent`: O degrau ordinal da escala (ex: `medium` = expoente `0` base, `large` = `+1`, `small` = `-1`, etc.).
- **Arredondamento superior:** `Math.ceil(resultado)` para garantir inteiros em pt.
- Para expoentes positivos (acima do base): arredondado para o próximo múltiplo de `LayoutUnit` (4pt).

### Fórmula de Line-Height (Entrelinha Grid-Locked)

Toda entrelinha é firmemente travada ao Grid de 4pt. Independente do fontSize, o resultado é forçado a ser múltiplo de `LayoutUnit`:

```js
lineHeight = Math.ceil((fontSize × multiplier) / LayoutUnit) × LayoutUnit
```

Onde:
- `multiplier`: Um dos quatro fatores semânticos — `tight` (1.0), `close` (1.2), `regular` (1.4), `wild` (1.8).
- `LayoutUnit`: `4` (pt).

**Exemplo numérico** (`giga` = 36pt):
- `tight` = `ceil((36 × 1.0) / 4) × 4` = 36pt ✓
- `close` = `ceil((36 × 1.2) / 4) × 4` = `ceil(43.2 / 4) × 4` = `ceil(10.8) × 4` = `11 × 4` = **44pt**
- `regular` = `ceil((36 × 1.4) / 4) × 4` = `ceil(50.4 / 4) × 4` = `ceil(12.6) × 4` = `13 × 4` = **52pt**
- `wild` = `ceil((36 × 1.8) / 4) × 4` = `ceil(64.8 / 4) × 4` = `ceil(16.2) × 4` = `17 × 4` = **68pt**

O grid-locking impede sub-pixels e shifts de alinhamento vertical em todas as plataformas de renderização.

---

## 7. Depth / Elevation (Profundidade e Sombras)

O sistema de profundidade é modelado como composição de 5 grandezas primitivas que mapeiam diretamente para `box-shadow` CSS. A óptica de sombras utiliza exclusivamente **Grayscale sem chroma/matiz** para subtrair luminância de forma pura (simulando oclusão de luz física real).

### As 5 Grandezas Primitivas

```
box-shadow: <offsetX> <offsetY> <blur> <spread> <cor_com_alpha>
            ├─ Distance ─┤  ├Intensity┤├Proximity┤├─ Luminosity ─┤
```

1. **Position (Inset/Outer)**: Determina se a sombra é projetada para fora (flutuação = `drop-shadow`) ou para dentro (rebaixamento = `inset`).
2. **Distance (Offset X/Y)**: Amarrada aos tokens `Dimension` — ex: `micro` (2pt), `extraSmall` (4pt), `small` (8pt).
3. **Intensity (Blur)**: Espalhamento difuso da oclusão. Blur baixo (~4pt) = luz dura; Blur alto (~16pt+) = luz ambiente suave.
4. **Proximity (Spread)**: Spread negativo simula proximidade; `0` = sombra fiel ao contorno.
5. **Luminosity (Color + Alpha)**: Cor exclusivamente Grayscale (ex: `#1a1a1a`) + canal Alpha controlado pela escala de Opacidade.

### Composição Multi-Sombra (Elevações Altas)

Níveis de elevação ≥ 4 usam **multi-layer shadows** para emular a dualidade óptica real:
```css
/* Contact Shadow (dura, curta, próxima) */
/* + Ambient Shadow (difusa, expansiva, distante) */
box-shadow:
  0px 4px 8px rgba(0, 0, 0, 0.08),
  0px 16px 48px rgba(0, 0, 0, 0.20);
```

### Adaptação em Dark Mode: "Inner Light"

Em Dark Mode, sombras externas tornam-se imperceptíveis contra fundos densos. A Engine introduz um brilho superior simulando refração da luz ambiente:
```css
box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.08) inset;
```

---

## 8. Conversão de Unidades de Output

O Theme Engine armazena todos os valores em **pontos (pt)**, tratados internamente como a unidade abstrata de cálculo. A conversão para unidades finais ocorre nos **Transformers** durante a fase de build.

### Fórmula de Conversão para `rem` (Web/CSS)

```js
remValue = ptValue / baseFontSize
```
Onde `baseFontSize` = `16` (padrão, configurável em `global.dimension.baseFontSize`).

**Exemplos:**
| Valor em pt | Cálculo | Output em rem |
|------------|---------|--------------|
| 4pt | 4 / 16 | `0.25rem` |
| 8pt | 8 / 16 | `0.5rem` |
| 16pt | 16 / 16 | `1rem` |
| 24pt | 24 / 16 | `1.5rem` |
| 48pt | 48 / 16 | `3rem` |

### Mapeamento de Formatos por Plataforma

| Formato de Output | Unidade | Motivo |
|-----------|---------|--------|
| **CSS** | `rem` | Acessibilidade WCAG 1.4.4 — escala com a preferência de fonte do usuário |
| **JSON (Figma / Tokens Studio)** | `px` | Ferramentas de design operam com inteiros em px |
| **ESM / CJS (JavaScript)** | `px` | Precisão numérica absoluta para cálculos JavaScript |
| **Depth/Spread** | `px` (sempre) | Box-shadow spread não é um token dimensional semântico — é um valor raw |

A separação entre unidade de cálculo (pt) e unidade de output (rem/px) garante que a mesma escala matemática funcione em qualquer plataforma sem recálculos no código do produto.

---

## Referências

- Script de dimensões: dimension-scale.mjs
- Script de cores: color-decomposer.mjs
- Script de sincronização: sync-architecture.mjs
- Spec de decomposição de cor: COLOR-DECOMPOSITION-SPEC.md
- Verificação de contraste: verify-aa-compliance.mjs
- Configuração global: themes.config.json
