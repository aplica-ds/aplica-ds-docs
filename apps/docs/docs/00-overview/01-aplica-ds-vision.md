---
title: "Aplica Design System — Visão Geral"
lang: pt-BR
---

# Aplica Design System — Visão Geral

## O que é o Aplica DS

O **Aplica DS** é um Design System open source, agnóstico a bibliotecas de componentes, centrado em uma arquitetura semântica de Design Tokens.

Ele não é um conjunto de componentes. É uma **especificação de linguagem visual** estruturada em tokens — a camada que dá coerência a qualquer componente, em qualquer plataforma, de qualquer marca.

---

## Princípio central: Tokens Primeiro

O Aplica DS parte de uma premissa simples: **toda decisão visual deve ser um token com propósito**.

Isso significa:
- Nenhum valor hardcoded em componentes.
- Cada cor, espaçamento, fonte ou profundidade existe na estrutura de tokens com uma razão semântica.
- O mesmo token semântico pode assumir valores diferentes dependendo de brand, modo, superfície ou dimensão — sem que o componente precise saber disso.

---

## Para quem é

| Perfil | Como usa o Aplica DS |
|--------|---------------------|
| **Designers** | Estrutura de tokens no Figma (via Tokens Studio), semântica de estilo, sistema de temas |
| **Engenheiros front-end** | CSS custom properties, JSON/ESM/CJS para consumo em React, Vue, Angular, Flutter |
| **Times de Design System** | Base reutilizável para criar DSes proprietários com identidade própria |
| **Projetos open source** | Ponto de partida para DSes multi-marca sem reinventar a arquitetura de tokens |

---

## O que o Aplica DS entrega

### Tokens Semânticos
Tokens com propósito: `semantic.color.interface.function.primary.normal.background` — não uma cor, mas o papel de uma cor em um contexto específico.

### Tokens de Foundation
Uma camada de **redução de carga cognitiva** para times de produto. Quem constrói telas não precisa entender a estrutura completa do sistema semântico — Foundation entrega o subconjunto necessário com nomes simples e diretos: backgrounds, cores de texto, bordas, espaçamentos e estilos tipográficos pré-definidos. Menos decisões, mais velocidade, menos contexto para carregar.

### Theme Engine
Um gerador dinâmico de temas que produz todas as variantes automaticamente a partir de configuração. Dado 1 brand, gera: light/dark × positive/negative × minor/normal/major = 12 variantes ou mais.

### Outputs Multi-plataforma
- **CSS** — custom properties (`:root`, `data-theme`)
- **JSON** — compatível com Figma e Tokens Studio
- **ESM / CJS** — módulos JavaScript
- **TypeScript** — declarações de tipos

---

## O que o Aplica DS NÃO é

- Não é uma biblioteca de componentes.
- Não é opinativo sobre framework (React, Vue, Flutter — todos são consumidores válidos).
- Não define comportamento de componente — apenas os tokens que o componente usa.
- Não substitui um Design System completo — é a **fundação** sobre a qual um DS completo é construído.

---

## Filosofia de Overrides (Sobreposições)

O Aplica DS é uma **estrutura intencional que acelera e escala** o desenvolvimento de Design Systems. Todas as decisões embarcadas — desde a escala dimensional até a decomposição de cores — são deliberadas e inter-dependentes.

No entanto, com trabalho e tempo, **todas essas lógicas podem ser sobrescritas**. É possível alterar valores de cores, ajustar escalas de tipografia, manipular curvas de opacidade ou reconfigurar profundidade para dar identidade própria e evoluir o seu Design System. Chamamos isso de **Override** (ou **sobreposição**).

> [!WARNING]
> **Override é permitido, mas carrega responsabilidade.**
> Qualquer sobreposição feita deve ser:
> 1. **Estudada** — Compreender qual lógica está sendo alterada e quais dependências serão afetadas (ex: alterar o `darkModeChroma` impacta todas as paletas em Dark Mode)
> 2. **Testada** — Validar que os outputs continuam passando nos requisitos mínimos de acessibilidade (WCAG AA) e que as escalas mantêm coerência visual
> 3. **Documentada** — Registrar explicitamente o que foi modificado, por quê, e quais limites foram aceitos
>
> Overrides não documentados ou não testados são a principal fonte de degradação de Design Systems ao longo do tempo.

O Theme Engine suporta overrides em múltiplos níveis:
- **Configuração** (`*.config.mjs`): Ajustes de escala, chroma, opacityScale, elevation
- **Dados** (`data/brand/*.json`): Cores de produto, paletas customizadas
- **Foundation** (`data/foundation/*.json`): Aliases de produto completamente livres

---

## Princípios de Design

### 1. Semântica sobre Estética
Tokens são nomeados pelo **papel**, não pela aparência. `color.feedback.success` em vez de `color.green`. Isso garante que a semântica sobrevive a mudanças de cor.

### 2. Separação por Responsabilidade
Cada camada tem uma responsabilidade única. Brand não mistura com Mode. Dimension não depende de Brand. A separação é estrutural, não convencional.

### 3. Escalabilidade Exponencial
Adicionar 1 brand gera automaticamente todas as variantes de modo, superfície e dimensão. 4 brands × 2 modos × 2 superfícies × 3 dimensões = 48 variantes com uma configuração.

### 4. Acessibilidade Calculada
O pipeline de cores calcula automaticamente contraste (WCAG AA/AAA) para `txtOn` tokens. Acessibilidade não é uma checklist — é parte do algoritmo.

### 5. Consistência por Contrato
O contrato de nomenclatura canônico garante que qualquer consumidor — Web, Mobile, Figma — interprete os tokens da mesma forma. Não há ambiguidade na semântica.

---

## Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                    APLICA DS                                │
│                                                             │
│   Brand ──┐                                                 │
│   Mode  ──┼──────────────────────┐                          │
│   Surface─┘                      ▼                          │
│                          ┌──────────────┐                   │
│                          │   Semantic   │                   │
│   Dimension ─────────────┤   (tokens    │                   │
│   (minor/normal/major)   │  com sentido)│                   │
│                          └──────┬───────┘                   │
│                                 │                           │
│                          ┌──────▼───────┐                   │
│                          │  Foundation  │                   │
│                          │ (redução de  │                   │
│                          │carga p/time) │                   │
│                          └──────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

Para a arquitetura completa das camadas, veja [01-token-architecture.md](../01-design-tokens-fundamentals/01-token-architecture.md).

### Três perspectivas sobre as camadas

Para comunicação e onboarding, as cinco camadas se agrupam em três conjuntos:

| Grupo | Camadas | Visibilidade |
|-------|---------|-------------|
| **Abstraction Layer** | Brand, Mode, Surface (+ Dimension) | Não exposto — a complexidade de geração fica aqui |
| **Intent Layer** | Semantic | Exposto — mapeia significado e uso para componentes |
| **Consumer Layer** | Foundation | Exposto — aliases simplificados para times de produto |

A nomenclatura técnica interna (Brand → Mode → Surface → Semantic → Foundation) permanece canônica. O agrupamento em três conjuntos é para comunicação pública e onboarding.

---

## Três Domínios de Conhecimento

O conhecimento do Aplica DS está organizado em três domínios, cada um servindo a um público distinto:

| Domínio | Público | Pergunta central |
|---------|---------|-----------------|
| **Racional** | Todos | Por que essa arquitetura existe? Como funciona? |
| **Consumo** | Devs usando tokens | Quais tokens uso e como os importo? |
| **Engenharia** | Devs rodando o engine | Como instalo, configuro e faço o build? |

O domínio de engenharia está em [09-engineering](../09-engineering/). O domínio de consumo está em [07-implementation](../07-implementation/). A fundação conceitual está nas seções 01–04.

---

## Status Atual

O Aplica DS está em produção ativa, com o **Aplica Tokens Theme Engine** publicado como pacote NPM (`@aplica/aplica-theme-engine`).

| Componente | Status |
|-----------|--------|
| Arquitetura de tokens (5+1 camadas) | Estável, documentada |
| Pacote NPM do Theme Engine (`@aplica/aplica-theme-engine`) | Produção |
| Pipeline de cores OKLCh | Produção |
| Sistema de Dimensão (minor/normal/major) | Produção |
| Sistema de Tipografia escalável | Produção |
| Gradientes dinâmicos | Produção |
| Documentação de engenharia (Domínio 3) | Completa |
| Biblioteca de componentes | Planejado |
| Site de documentação | Em desenvolvimento |

