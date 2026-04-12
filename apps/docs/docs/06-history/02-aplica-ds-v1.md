---
title: "Aplica DS — V1"
lang: pt-BR
---

# Aplica DS — V1

## Contexto

A V1 foi o amadurecimento dos conceitos do Alpha em uma implementação concreta, usada em produção em um produto real. Esta fase representou a transição de conceito para realidade: os modelos precisaram ser validados, os trade-offs ficaram evidentes, e a documentação começou a ser formalizada.

A pressão de um produto com usuários reais, múltiplos times de engenharia e um processo de release acelerado forçou refinamentos que o Alpha não havia antecipado.

---

## O que mudou em relação ao Alpha

### Da exploração para o contrato

No Alpha, as convenções eram implícitas — entendidas pelo time, mas não escritas. Na V1, os primeiros contratos formais apareceram:

- **Padrão de nomenclatura no Figma** — como nomear arquivos, frames e componentes para que a estrutura de tokens faça sentido visual no Figma
- **Documentação de uso** — como consumir os tokens na prática, com exemplos por plataforma
- **Processo de criação de componentes** — um fluxo definido para criar novos componentes sem quebrar a consistência semântica

### Aprofundamento em Profundidade (Elevation)

O sistema de profundidade (elevação/sombras) ganhou estrutura própria:
- Tokens de Z-Index semânticos (não valores numéricos arbitrários)
- Sistema de `box-shadow` por nível de elevação
- Conceito de "elementos de profundidade" — o que cria percepção de profundidade além da sombra (borda, cor de superfície, opacidade)

### Opacidade como token

A opacidade passou a ser tratada como token semântico — não como um valor percentual hardcoded, mas com propósito definido (desabilitado, overlay, ghost).

### Bordas com semântica

Bordas ganharam estrutura semântica: raio de borda, espessura e cor de borda como tokens independentes com aliases de propósito.

### Tipografia sistematizada

A escala tipográfica foi documentada formalmente:
- Relação entre fontSizes, lineHeights e letterSpacings
- Estilos tipográficos compostos (heading, body, label, code...)
- Documentação de uso no Figma (classe tipográfica × token semântico)

---

## O conceito de "Resumo de Engenharia"

Uma inovação na V1 foi criar documentos de "Resumo de Engenharia" para cada fundação visual — um formato que traduzia as decisões de design para linguagem de implementação:

- Resumo de Engenharia: Bordas - Layout
- Resumo de Engenharia: Opacidade
- Resumo de Engenharia: Profundidade
- Resumo de Engenharia: Tipografia e Fontes

Esses documentos serviram como ponte entre design e engenharia, reduzindo o gap de interpretação entre o que foi desenhado e o que foi implementado.

---

## O que ficou para resolver

A V1 revelou limitações que viriam a gerar a V2:

### 1. Acoplamento entre tokens e produto
A implementação estava acoplada demais ao produto específico — os tokens carregavam decisões do produto que deveriam ser do brand. Separar os dois sem quebrar a implementação existente seria o desafio central da V2.

### 2. Escalabilidade para múltiplos brands
Suportar um segundo brand era possível, mas trabalhoso — exigia duplicação manual de muitos tokens. O gerador dinâmico ainda não existia.

### 3. Ausência do conceito de Dimension
O sistema tinha uma escala única de sizing/spacing. A necessidade de suportar interfaces compactas e espaçosas na mesma base apontava para o que viria a ser a camada Dimension.

### 4. Documentação ainda incompleta
O conhecimento estava dividido entre Confluence (conceito) e código (implementação). O gap entre as duas fontes gerava inconsistências e dificultava a entrada de novos membros.

---

## Decisões da V1 que sobreviveram

| Decisão | Status |
|---------|--------|
| Resumos de Engenharia por fundação | Evoluíram para documentação técnica formal em EN/PT-BR |
| Padrão de nomenclatura no Figma | Evoluiu para o contrato canônico de taxonomia |
| Estilos tipográficos compostos | Foundation typography styles (7 categorias na V2) |
| Sistema de elevação por nível | Foundation elevation styles, configurável por tema na V2 |
| Processo de criação de componentes | Formalizado em `05-components-theory/` |

---

## Documentação disponível

O conteúdo do Confluence desta fase está sendo extraído e organizado em `06-history/_extracted/aplica-ds-v1/`.

Para extrair: `node scripts/extract-confluence-xml.mjs --ds zeta-ds`

Páginas de referência identificadas nesta fase:
- Zeta: Documentação de Uso
- Fundamentos / Design Tokens / Styleguide
- Cores, Profundidade, Tipografia
- Resumos de Engenharia (Bordas, Opacidade, Profundidade, Tipografia)
- Componentes: definição, tipos, organização, processo de criação, arquitetura
- O que são atributos?
- Padrão de nomenclatura no Figma
