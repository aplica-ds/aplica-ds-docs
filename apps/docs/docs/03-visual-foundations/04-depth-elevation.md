---
title: "Depth & Elevation"
lang: pt-BR
---

# Depth & Elevation

> **Profundidade em interfaces é uma ilusão óptica.** Não existe eixo Z real na tela; comunicamos sobreposição e elevação através de sinais visuais que o cérebro decodifica como distância.

No Aplica DS V2, essa ilusão é parametrizada no Theme Engine através de um sistema coeso de **Estilos de Profundidade (Depth/Elevation)**. Em vez de simplesmente aplicar cores com blur, o modelo desconstrói o fenômeno físico da sombra em **5 Elementos Primitivos**.

---

## 1. Os 5 Elementos Primitivos da Sombra

Toda sombra (e consequente sensação de elevação) no sistema é o resultado da composição das seguintes grandezas, que mapeiam exatamente para a sintaxe de um `box-shadow` CSS:

### 1.1 Position (Inset/Outer)
Determina onde a sombra é projetada em relação à camada, ditando se o elemento está "flutuando" ou se é um "buraco".
- **Outer (`drop-shadow`):** Sombra externa. O elemento parece flutuar **acima** do plano. Padrão para cards, botões e modais.
- **Inner (`inset`):** Sombra interna. O elemento parece recortado ou **abaixo** do plano. Padrão para *inputs*, seletores genéricos e fundos rebaixados.

### 1.2 Distance (Offset X e Y)
O tamanho do deslocamento da sombra. Simula o "quão alta/baixa" a fonte de luz do ambiente está em relação ao objeto e seu distanciamento do chão.
- **Integração com Dimension:** A distância é amarrada aos tokens da fundação `Dimension` (ex: micro `2px`, extraSmall `4px`, small `8px`).

### 1.3 Intensity (Blur)
O espalhamento/difração suave da luz, que marca a oclusão.
- Blur baixo (`~4px`): Objetos muito próximos ao papel, luz dura. Sombra hiper nítida.
- Blur alto (`~16px+`): Objetos com alta flutuação, luz ambiente suave e difusa.

### 1.4 Proximity (Spread)
A simulação da aproximação ou distanciamento do observador.
- **Spread negativo:** Simula que a sombra esconde-se mais sob o objeto (sombra de proximidade).
- **Sem spread (`0px`):** Sombra fiel ao contorno físico exato.

### 1.5 Luminosity (Color / Opacity)
O controle do canal α (Alpha) e da nuance de cor para subtrair luz do plano inferior sem sujar o design.

> [!IMPORTANT]
> **O compromisso da Escala Grayscale e Acessibilidade**
> Conforme estipulado nas fundações de Cores (A11y e WCAG): as sombras compostas aqui utilizam exclusivamente **Grayscale (sem croma/matiz).** 
> Sombras coloridas tendem a criar *color vibration* (sujeira) ao passarem por cima de superfícies tinturadas, arruinando a precisão estrutural do componente de UI na percepção da profundidade. Usamos cores escuras e austeras com baixa opacidade puramente para **subtrair leveza (Lightness)** e simular fisicamente a oclusão da luz.

**Fonte canônica dos valores:** Os valores de Alpha utilizados nesta grandeza provêm dos **Stubs de Superfície** do sistema de opacidade (ver [05-opacity.md](./05-opacity.md)). O Theme Engine gera automaticamente cores translúcidas pré-compostas:

| Papel no Depth | Token Stub de Origem | Valor Gerado |
|---|---|---|
| Sombra de oclusão (Light Mode) | `surface.opacity.color.dark.superTransparent` | `rgba(0,0,0, 0.1)` |
| Sombra de oclusão (Light Mode) | `surface.opacity.color.dark.semiTranslucid` | `rgba(0,0,0, 0.2)` |
| Inner Light (Dark Mode) | `surface.opacity.color.light.superTransparent` | `rgba(255,255,255, 0.1)` |

Isso garante que toda alteração no `global.opacityScale` propaga automaticamente para os composites de elevação, mantendo a escala de sombras coerente com a opacidade global do sistema.

---

## 2. Padrões de Elevação Canônica (Levels)

Para evitar que desenvolvedores componham matematicamente os 5 primitivos do zero, o sistema expõe **8 Níveis de Elevação Semânticos (Composite Tokens)** através da *Foundation Layer*. 

A regra hierárquica é mandatória: **Sempre use o menor nível possível para comunicar a hierarquia.**

| Nível Base | Token Semântico / Foundation | Contexto e Uso Canônico |
|:---:|---|---|
| **-1** | `depth.level_minus_one` | Elementos **rebaixados** no plano (inner shadow). Uso em Content Areas rebaixadas, Input text fields vazios. |
| **0** | `depth.level_zero` | **Reset.** Objeto encostado/chapado na superfície. Zero box-shadow. |
| **1** | `depth.level_one` | **Pressed/Interativo.** Geralmente aplicado quando um botão flutuante é "pressionado" ou em hover de list-items muito brandos. |
| **2** | `depth.level_two` | **Componentes de superfície base.** Default para Standard Cards, Módulos contidos. |
| **3** | `depth.level_three` | **Ancoragem de Fluxo.** Menus de navegação (*Navbars*), Sticky headers fixados ao topo ao fazer scroll. |
| **4** | `depth.level_four` | **Acesso Transitório.** Dropdowns de comboboxes, Auto-completes descolando do input base, Tooltips grandes. |
| **5** | `depth.level_five` | **Sub-aplicações Ativas.** Datepickers densos, Menus contextuais complexos. |
| **6** | `depth.level_six` | **Modals / Máxima Elevação.** Diálogos que escurecem o restante da tela (overlay background) e necessitam total separação focal do usuário. |

---

## 3. Composição Multi-sombra (Multi-layered Shadows)

Para emular perfeitamente que uma luz espalha *ambient light* para os lados, enquanto oclui intensamente logo abaixo (contact shadow), níveis de elevação mais altos (geralmente do Level 4 ao Level 6) raramente são um `box-shadow` singular.

O Theme Engine suporta nativamente **Multi-sombra**:

```css
/* Level 6 - Exemplo de compilação */
box-shadow: 
  0px 4px 8px rgba(0, 0, 0, 0.08),  /* Contact Shadow (Dura, Curta, Menos Densa) */
  0px 16px 48px rgba(0, 0, 0, 0.20) /* Ambient Sombra (Super Difusa, Alta Expansão) */
```

---

## 4. O Paradoxo do Dark Mode

Como a profundidade óptica digital utiliza a cor preta/cinza escura translúcida subtraindo luz, ao invertemos o tema para um **Dark Mode**, as sombras tornam-se virtualmente invisíveis contra fundos de cores densas (`10, 20` ou `30` da paleta surface).

### Padrão de Adaptação Canônica: "Inner Light" em vez de Outer Shadow

Para indicar que um elemento está "flutuando" acima do chão em um modo escuro sem depender exclusivamente de sua cor surface *lightness*, o engine recorre à manipulação do parâmetro `Luminosity`, introduzindo *Luz* nas elevações altas.

O preceito imita que **a borda superior do elemento recebe a luz ambiente principal**. Aplica-se um brilho tênue (inner-shadow) contrastante usando o stub `surface.opacity.color.light.*` (ver [05-opacity.md](./05-opacity.md)):

```css
/* Elevação em Dark Mode — usa stub light do sistema de opacidade */
box-shadow: 
  0px 1px 0px rgba(255, 255, 255, 0.08) inset; /* Refração de Top Light simulando borda proeminente 3D */
```

Isso garante separação estrutural e previne interfaces bidimensionais estáticas e de difícil escaneamento, sem quebrar os requisitos fundamentais do tema original.

---

## 5. Referências

- [Opacidade — Stubs de Superfície que alimentam a Luminosity](./05-opacity.md)
- [Cores — Grayscale e regras de sombras acromáticas](./01-colors.md)
- [Matemática e Algoritmos — Seção 7: Depth / Elevation](./06-mathematics-and-algorithms.md)
- Implementação no engine: [sync-architecture.mjs](../../references/aplica-tokens-theme-engine/dynamic-themes/scripts/sync-architecture.mjs)
