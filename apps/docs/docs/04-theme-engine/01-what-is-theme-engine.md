---
title: "O que é o Aplica Tokens Theme Engine"
lang: pt-BR
---

# O que é o Aplica Tokens Theme Engine

## Definição

O **Aplica Tokens Theme Engine** é o sistema de geração de design tokens do Aplica DS. Funciona como uma **fábrica de temas**: dado um conjunto de configurações (cores de marca, tipografia, dimensões), o engine produz automaticamente todos os tokens semânticos e de foundation para cada combinação possível de brand × mode × surface × dimension.

É distribuído como um **pacote NPM** (`@aplica/aplica-theme-engine`), construído sobre **Style Dictionary** e compatível com **Tokens Studio**. Age como a única fonte de verdade para design tokens — garantindo que Web, Mobile e Figma interpretem os mesmos tokens da mesma forma.

---

## Por que ele existe

O problema que o engine resolve é **escala com coerência**.

Sem um engine centralizado, cada novo tema — ou qualquer mudança de cor — exige atualização manual em dezenas de arquivos. Com 4 brands × 2 modos × 2 superfícies × 3 dimensões = **48 variantes de tema**, a manutenção manual é inviável.

O engine inverte essa responsabilidade:

```
SEM engine:
Designer define cor → Desenvolvedor copia para CSS → Repete para cada variante

COM engine:
System Designer configura *.config.mjs → Engine gera todas as variantes →
Consumidores importam de dist/
```

**Benefícios diretos:**
- Adicionar 1 marca gera automaticamente todas as 12 variantes (modos × superfícies × dimensões)
- Mudança de cor em um lugar se propaga para todos os outputs e plataformas
- Acessibilidade (WCAG) calculada automaticamente — não é um checklist manual
- O contrato de naming garante que Web, Mobile e Figma sejam sempre consistentes

---

## O Modelo de Pacote

O engine é distribuído como um único pacote NPM que seu projeto instala. Seu projeto é dono da configuração; o pacote é dono da lógica de geração e build.

```
Seu projeto                           @aplica/aplica-theme-engine
─────────────────────────────────     ──────────────────────────────
theme-engine/config/  ──────────→     Engine de decomposição de cores
  minha-marca.config.mjs              Geração de paleta OKLCh
  global/themes.config.json           Sincronização de arquitetura
                                      Transforms do Style Dictionary
data/  ←────────────────────────      Comandos CLI
dist/  ←────────────────────────
```

**Você é dono de:** configuração, dados gerados, outputs gerados.
**O pacote é dono de:** lógica de geração, orquestração de build, schemas, CLI.

Isso significa:
- Cada projeto tem seu próprio conjunto de tokens com versionamento independente
- O engine atualiza sem exigir mudanças na sua configuração
- Múltiplos projetos podem compartilhar o mesmo engine, mas produzem outputs diferentes

---

## O Pipeline de Geração

O engine executa o pipeline de 5 camadas do Aplica DS de forma sequencial:

```
theme-engine/config/
  minha-marca.config.mjs
  global/themes.config.json
          │
          ▼
[ Decomposição de cores ]   ← Decompõe cores de marca em paletas OKLCh (19+15+6 níveis)
[ Geração tipográfica ]     ← Gera escala tipográfica e line-heights
[ Escala dimensional ]      ← Gera escala espacial por variante (minor/normal/major)
          │
          ▼
data/brand/<marca>/           ← Camada 1: tokens de marca (cores, tipografia, gradientes)
data/mode/<light|dark>.json  ← Camada 2: modulação de luminosidade
data/surface/<pos|neg>.json  ← Camada 3: contexto de superfície
data/dimension/<variante>.json ← Camada ortogonal: escala espacial e tipográfica
          │
          ▼ sync:architecture (propaga referências entre camadas)
          │
data/semantic/default.json    ← Camada 4: tokens com propósito definido
data/foundation/<nome>/       ← Camada 5: aliases simplificados
          │
          ▼ Style Dictionary (build)
          │
dist/
├── json/    ← JSON com px (Figma, Tokens Studio)
├── css/     ← CSS custom properties com rem (Web)
├── esm/     ← ES Modules com px (JavaScript)
├── js/      ← CommonJS com px (Node.js)
└── dts/     ← Declarações TypeScript
```

**Regra crítica:** Arquivos em `data/` são **gerados** — nunca os edite manualmente. Toda mudança começa em `theme-engine/config/`.

---

## O que o Engine Entrega

### Camadas de token

| Camada | Namespace | Papel |
|--------|-----------|-------|
| Brand | `brand.*` | Valores primitivos — apenas interno |
| Mode | `mode.*` | Modulação light/dark — apenas interno |
| Surface | `surface.*` | Contexto de superfície — apenas interno |
| Semantic | `semantic.*` | Tokens com propósito — use em componentes |
| Foundation | `foundation.*` | Aliases simplificados — use em times de produto |

**Consumidores devem usar apenas `semantic.*` e `foundation.*`.** Brand, Mode e Surface são camadas internas do pipeline.

### Formatos de output

| Formato | Diretório | Unidade | Para quem |
|---------|-----------|---------|-----------|
| JSON | `dist/json/` | `px` | Figma, Tokens Studio |
| CSS | `dist/css/` | `rem` | Web (CSS custom properties) |
| ESM | `dist/esm/` | `px` | JavaScript moderno |
| CJS | `dist/js/` | `px` | Node.js / bundlers legados |
| TypeScript | `dist/dts/` | — | Consumo com type safety |

---

## Para quem

| Perfil | O que faz |
|--------|----------|
| **System Designer (N2)** | Configura cores de marca, tipografia e modos em `*.config.mjs`. Executa `tokens:build`. |
| **Design Engineer (N3)** | Instala o pacote, monta o workspace, mantém o pipeline de build. |
| **Engenheiro front-end** | Importa de `dist/` (CSS vars, ESM, JSON). Nunca roda o engine. |
| **Product Designer (N1)** | Trabalha no Figma usando o JSON de tokens publicado. Nunca toca no engine. |

O engine **não** impõe um framework. React, Vue, Flutter, CSS puro — todos consomem o mesmo output de `dist/`.

---

## O que o Engine NÃO faz

- **Não implementa componentes.** Botões, inputs, modais — esses pertencem à biblioteca de componentes do consumidor.
- **Não define comportamento.** Estados de hover, animações, lógica de UI — o engine produz apenas os tokens que esses comportamentos usam.
- **Não substitui um Design System completo.** É a fundação de tokens sobre a qual um DS completo é construído.

---

## Versionamento e Contrato

O engine segue **Semantic Versioning**:
- **Patch:** Correções que não afetam tokens existentes ou contratos de config
- **Minor:** Novos tokens ou novas opções de config (backward-compatible)
- **Major:** Tokens renomeados ou removidos, ou mudanças no contrato de config — documentado no CHANGELOG

Renomear ou remover um token é uma mudança breaking porque quebra todo consumidor que referencia aquele token pelo nome.

---

## Referências

- Setup de engenharia: [09-engineering/01-quick-start.pt-br.md](../09-engineering/01-quick-start.pt-br.md)
- Guia de configuração: [03-configuration-guide.pt-br.md](./03-configuration-guide.pt-br.md)
- Arquitetura de tokens (5 camadas): [01-token-architecture.pt-br.md](../01-design-tokens-fundamentals/01-token-architecture.pt-br.md)
- Workflow do designer: [02-designer-workflow.pt-br.md](./02-designer-workflow.pt-br.md)
