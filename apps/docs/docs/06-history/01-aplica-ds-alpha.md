---
title: "Aplica DS — Alpha"
lang: pt-BR
---

# Aplica DS — Alpha

## Contexto

A versão Alpha do Aplica DS representa a fase de formação dos conceitos que viriam a definir toda a arquitetura. Não era ainda um Design System autônomo com identidade própria — era um conjunto de ideias sobre como estruturar tokens e temas de forma escalável e semântica, desenvolvido em paralelo com outros trabalhos de Design System.

Esta fase respondeu a uma pergunta central: **como garantir consistência visual entre produtos distintos, de marcas distintas, sem duplicar esforço?**

---

## O Problema que motivou o Alpha

Design Systems tradicionais resolvem consistência dentro de um produto. Mas quando você opera múltiplos produtos, ou quando o mesmo produto precisa de múltiplas marcas, o modelo quebra:

- **Duplicação de tokens:** cada produto tem seu próprio conjunto de cores, espaçamentos e tipografia, com nomes diferentes para as mesmas coisas.
- **Manutenção em cascata:** uma mudança de cor da marca exige atualização manual em dezenas de arquivos.
- **Inconsistência semântica:** o que um time chama de "cor primária" é o que outro chama de "cor de ação" — sem controle, sem contrato.
- **Dark mode como afterthought:** a estrutura plana de tokens não suporta modos de cor nativamente — é um remendo, não uma arquitetura.

---

## As primeiras ideias — o que o Alpha definiu

### 1. Tokens com propósito, não com aparência

A primeira e mais duradoura decisão: tokens são nomeados pelo **papel semântico**, nunca pela aparência.

```
❌ color-orange-500
✅ color.interface.function.primary.normal.background
```

Isso parece trivial, mas tem implicações profundas: um token semântico sobrevive a uma mudança de identidade visual. Quando a marca troca de laranja para azul, o token `primary.background` apenas recebe um novo valor — os componentes não mudam.

### 2. Separação de responsabilidades em camadas

O Alpha estabeleceu que um tema é o resultado da composição de dimensões independentes:
- **Quem é a marca?** — Brand
- **Claro ou escuro?** — Mode
- **Sobre qual superfície?** — Surface

Essa separação permitiu que o mesmo componente funcionasse em qualquer combinação sem saber nada sobre a identidade visual subjacente.

### 3. Decomposição de cor

Uma das descobertas mais importantes do Alpha: uma única cor de brand pode ser algoritmicamente decomposta em uma paleta completa — não precisa ser definida manualmente cor por cor.

A decomposição gera:
- **Paleta tonal** (variações de luminosidade e saturação)
- **Neutros** derivados da cor principal (não cinzas genéricos, mas neutros com temperatura de cor relacionada ao brand)
- **Estados comportamentais** (hover, pressed, disabled) calculados automaticamente

Isso reduziu drasticamente o trabalho de criação de temas e eliminou inconsistências manuais.

### 4. Acessibilidade como algoritmo

Em vez de validar contraste manualmente, o Alpha definiu que o sistema devia calcular automaticamente os tokens de `txtOn` (texto sobre cor) garantindo WCAG AA no mínimo.

Preto ou branco — a decisão é do algoritmo, não do designer.

---

## O que ficou de fora no Alpha

- Não havia geração dinâmica automatizada — os temas eram semi-manuais.
- Não havia o conceito de Dimension (densidades de escala).
- A nomenclatura ainda estava sendo explorada — o contrato canônico veio depois.
- Não havia documentação formal das regras — era conhecimento tácito.

---

## Legado do Alpha para o Aplica DS

Tudo que foi construído depois — V1, V2 e o Aplica Theme Engine — parte das decisões tomadas no Alpha:

| Decisão do Alpha | Onde vive hoje |
|-----------------|----------------|
| Tokens semânticos por papel | Camada Semantic — `data/semantic/default.json` |
| Separação Brand × Mode × Surface | Estrutura de `data/` e pipeline de build |
| Decomposição de cor em paleta | Dynamic Theme Generator |
| Acessibilidade calculada | Pipeline OKLCh |
| Contrato de nomenclatura | `docs/context/tokens/canonical-taxonomy-and-naming-contract.md` |

---

## Documentação disponível

O conteúdo do Confluence desta fase está sendo extraído e organizado em `06-history/_extracted/aplica-ds-alpha/`.

Para extrair: `node scripts/extract-confluence-xml.mjs --ds apollion-ds`

Páginas de referência identificadas nesta fase:
- Cores: Decomposição, Decomposição Comportamental, Decomposição de Layout
- Cores: Acessibilidade, Cores de Contraste, Cores da Marca, Cores de Função
- Documentação Técnica — Tokens: Tipografia, Cores, Profundidade, Espaçamento, Bordas
- Visual Language (VL): Tipografia, Profundidade, Bordas, Formulários
- Agrupamento de Tokens, Unidades de Estilo, JSON de Configuração
