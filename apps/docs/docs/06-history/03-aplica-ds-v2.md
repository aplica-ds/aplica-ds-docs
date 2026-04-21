---
title: "Aplica DS — V2"
lang: pt-BR
---

# Aplica DS — V2

## Contexto

A V2 é a fase de conceito evoluído do Aplica DS (2023–2024). Ela representa a síntese de tudo que foi aprendido no Alpha e na V1, reescrita com dois objetivos que mudam a natureza do projeto:

1. **Desacoplamento** — o sistema de tokens foi completamente separado de qualquer produto específico, tornando-se independente e reutilizável
2. **Open source** — a arquitetura passou a ser desenvolvida como um bem público, não como um produto interno

O artefato central da V2 é o **Aplica Tokens Theme Engine** — um gerador dinâmico de temas que produz tokens para qualquer combinação de brand, mode, surface e dimension.

---

## A grande virada: o desacoplamento

A decisão mais importante da V2 foi separar o sistema de tokens do produto que o consumia. Isso criou duas entidades distintas:

**Aplica Theme Engine** (upstream):
- Arquitetura genérica, agnóstica a produto
- Gera tokens para qualquer brand
- Documentada em PT-BR e EN
- Versionada com Semantic Versioning
- Distribuída como pacote e como cópia

**Consumers** (downstream):
- Cada produto tem sua cópia ou fork do Theme Engine
- Customiza brand, foundation e typography
- Consome os artifacts gerados (`dist/`)
- Recebe atualizações via bundles de migração

Esse modelo permitiu que o mesmo sistema de tokens alimentasse DSes de empresas diferentes, sem que nenhum deles precisasse saber dos outros.

---

## Inovações da V2

### 1. Gerador Dinâmico de Temas

Em vez de definir cada token manualmente, o V2 gera temas a partir de uma configuração mínima:

```json
{
  "brand": "aplica_joy",
  "colors": {
    "first": "#E91E8C",
    "second": "#1E90FF"
  }
}
```

A partir disso, o gerador:
- Decompõe cada cor em 19 níveis de paleta (via OKLCh)
- Gera 15 níveis de neutros com temperatura de cor do brand
- Calcula 5 estados comportamentais (normal, hover, pressed, focus, disabled)
- Garante contraste WCAG para todos os tokens de `txtOn`

### 2. Pipeline de Cores OKLCh

O Alpha e a V1 usavam HSL para decomposição de cor. A V2 migrou para **OKLCh** — um espaço de cor perceptualmente uniforme onde:
- Luminosidade percebida é linear (L=50 é visualmente meio-ponto entre L=0 e L=100)
- Chroma (saturação) é separado do ângulo de Hue
- Interpolação entre cores não passa por tons de cinza no meio

Isso resolve um problema clássico em Dark Mode: em HSL, reduzir luminosidade para criar tons escuros pode produzir cores com aparência inconsistente. Em OKLCh, o resultado é previsível.

### 3. Camada Dimension

O conceito de Dimension — ausente no Alpha e na V1 — foi incorporado como camada ortogonal na V2. Três variantes (minor/normal/major) com DefaultDesignUnit diferente cascateiam para toda a escala espacial e tipográfica.

Isso resolveu o problema de densidades de interface sem duplicar tokens ou criar sistemas paralelos.

### 4. Contrato Canônico de Nomenclatura

A V2 formalizou um contrato completo para nomes de tokens:

```
<camada>.<categoria>.<grupo>.<subgrupo>.<estado>.<propriedade>
```

Com regras explícitas para:
- Quando usar cada camada
- Como nomear grupos e subgrupos
- O que nunca pode ser um token de Semantic (valores raw sem propósito)
- Política de rename e remoção (breaking changes = major version)

### 5. Foundation com Estilos Compostos

Foundation na V2 vai além de aliases de cores e espaçamentos. Ela inclui:

**Typography Styles** — 7 categorias de estilo composto:
| Categoria | Uso |
|-----------|-----|
| `heading`   | Títulos e cabeçalhos hierárquicos |
| `content`   | Corpo de texto padrão |
| `display`   | Texto de destaque, hero |
| `hierarchy` | Subtítulos, seções |
| `action`    | Botões, CTAs |
| `link`      | Links e âncoras |
| `code`      | Código e monospace |

**Elevation Styles** — 7 níveis de elevação configuráveis por tema:
- `level_minus_one` a `level_six`
- Cada nível é um `box-shadow` completo, não apenas uma sombra

### 6. Gradientes Dinâmicos

Gradientes são gerados automaticamente a partir das cores do brand:
- 3 composições configuráveis (first, second, third)
- Transição de tom claro → escuro com chroma preservado
- Configuração de graus, steps e composites no global config

### 7. Sistema de Bundles de Migração

Para garantir que projetos que consomem o Theme Engine possam atualizar com segurança, a V2 introduziu **bundles de migração** versionados:

```
bundles/from-2.24.0-to-2.25.0/
├── APPLY_INSTRUCTIONS.md   ← passo a passo de migração
└── MANIFEST.txt            ← lista de arquivos alterados
```

### 8. Outputs Multi-plataforma Completos

| Formato | Uso |
|---------|-----|
| CSS custom properties | Web — `:root`, `[data-theme]` |
| JSON | Figma, Tokens Studio |
| ESM (.mjs) | JavaScript moderno |
| CJS (.js) | Node.js, bundlers legados |
| TypeScript (.d.ts) | Type safety |

---

## Versões de marco da V2

- **2.26.0** — Foundation Styles Generation (typography.css, elevation.css por brand)
- **2.25.0** — Output CSS em `rem` (acessibilidade, WCAG 1.4.4)
- **2.24.0** — Token `focus` distinto de `active` (breaking change)
- **2.23.0** — Opção `txtOnStrategy: 'custom-tint'`
- **2.22.4** — Step 25 acima de 100px na camada Dimension (era step 5), semantic.giga movido para scale.275
- **2.22.0** — Escala tipográfica de 13 tamanhos (nano → zetta)
- **2.19.0** — Elevation configurável por tema
- **2.18.0** — Config e schemas centralizados na raiz do projeto

A V2 encerrou na 2.26.x. Os itens planejados na V2 (pacote npm público, site de documentação, biblioteca de componentes) foram entregues na V3.

---

## Arquivos de referência

- Implementação: `references/aplica-tokens-theme-engine/`
- Changelog completo: `references/aplica-tokens-theme-engine/CHANGELOG.md`
- Documentação técnica (EN): `references/aplica-tokens-theme-engine/docs/en/`
- Documentação técnica (PT-BR): `references/aplica-tokens-theme-engine/docs/pt-br/`
- Extração do Confluence: `node scripts/extract-confluence-xml.mjs --ds aplica-ds`
