---
id: glossary
title: "Glossário bilíngue — pt-BR / en-US"
description: "Referência canônica de terminologia do Aplica DS. Define o que traduzir, o que manter e a forma correta em cada idioma."
---

# Glossário bilíngue

> **Uso:** Este documento é a fonte de verdade para todas as traduções de conteúdo do Aplica DS. Antes de traduzir qualquer artigo, consulte as seções abaixo.  
> Qualquer nova tradução ou correção de terminologia deve ser aplicada aqui primeiro.

---

## Regra fundamental

Há três categorias de termos:

| Categoria | O que fazer |
|-----------|------------|
| **Código** | Nunca traduzir — são nomes de tokens, parâmetros, comandos ou arquivos |
| **Nomes próprios do sistema** | Manter em ambos os idiomas sem alteração |
| **Vocabulário** | Traduzir seguindo a coluna en-US abaixo |

---

## Seção 1 — Termos que NUNCA são traduzidos

São nomes de código. Aparecem exatamente assim em pt-BR e em en-US.

| Termo | Tipo | Exemplo de uso |
|-------|------|---------------|
| `txtOn` | Nome de token | "o `txtOn` garante contraste WCAG" |
| `darkModeChroma` | Parâmetro de config | "`darkModeChroma: 0.85`" |
| `txtOnStrategy` | Parâmetro de config | "`txtOnStrategy: 'brand-tint'`" |
| `accessibilityLevel` | Parâmetro de config | "`accessibilityLevel: 'AA'`" |
| `includePrimitives` | Parâmetro de config | "`includePrimitives: true`" |
| `borderOffset` | Parâmetro de config | "`borderOffset.palette: 10`" |
| `sync:architecture` | Comando npm | "rode `npm run sync:architecture`" |
| `build:themes` | Comando npm | "`npm run build:themes`" |
| `themes:generate` | Comando npm | "`npm run themes:generate`" |
| `foundations:generate` | Comando npm | "`npm run foundations:generate`" |
| `dimension:generate` | Comando npm | "`npm run dimension:generate`" |
| `ensure:data` | Comando npm | — |
| `*.config.mjs` | Padrão de arquivo | "abra o `*.config.mjs`" |
| `$themes.json` | Nome de arquivo | — |
| `themes.config.json` | Nome de arquivo | — |
| `_brand.json` | Nome de arquivo | — |
| `_grayscale.json` | Nome de arquivo | — |
| `_primitive_theme.json` | Nome de arquivo | — |
| `data/` | Diretório | "arquivos em `data/`" |
| `dist/` | Diretório | "output em `dist/`" |
| `semantic.color.*` | Namespace de token | "use `semantic.color.interface.*`" |
| `foundation.bg.*` | Namespace de token | "use `foundation.bg.primary`" |
| `foundation.txt.*` | Namespace de token | "use `foundation.txt.body`" |
| `brand.branding.*` | Namespace de token | — |
| OKLCh | Espaço de cor | "o pipeline OKLCh" |
| WCAG | Sigla de acessibilidade | "contraste WCAG AA" |

---

## Seção 2 — Nomes próprios do sistema (manter em ambos)

Estes são termos cunhados — nomes de paradigmas, produtos ou personas do Aplica DS. Não se traduzem; aparecem iguais em pt-BR e en-US.

| Termo | Aparece em | Notas |
|-------|-----------|-------|
| Config-First | Todos os níveis | Paradigma central do sistema |
| Aplica DS | Todos | Nome do produto |
| Aplica Tokens Theme Engine | Todos | Nome do engine |
| Tokens Studio | N1, N2 | Nome do plugin Figma — produto de terceiro |
| Product Designer | N1, N2, N3 | Persona — inglês é o termo universal |
| System Designer | N2, N3 | Persona |
| Design Engineer | N3 | Persona |
| Style Dictionary | N3 | Ferramenta open source — nome próprio |
| Docusaurus | Meta/infra | Framework de docs |
| Figma Variables | N1 | Feature nativa do Figma |
| `brand-tint` | N2, N3 | Valor de `txtOnStrategy` — é um nome de opção |
| `high-contrast` | N2, N3 | Valor de `txtOnStrategy` |
| `custom-tint` | N2, N3 | Valor de `txtOnStrategy` |

---

## Seção 3 — Vocabulário das camadas

| pt-BR | en-US | Notas de uso |
|-------|-------|-------------|
| Camada | Layer | Sempre com inicial minúscula quando genérico |
| Camada Brand | Brand layer | Inicial maiúscula quando refere à camada específica |
| Camada Mode | Mode layer | Idem |
| Camada Surface | Surface layer | Idem |
| Camada Primitiva | Primitive layer | O nível mais baixo: valores brutos e paleta core |
| Camada Semântica | Semantic layer | O cérebro do sistema: fonte da verdade técnica e exaustiva |
| Camada Foundation | Foundation layer | O nível de consumo: atalhos cognitivos para velocidade de design |
| Camada Dimension | Dimension layer | Idem |
| as cinco camadas | the five layers | Minúsculo quando genérico |
| pipeline de cinco camadas | five-layer pipeline | — |
| cadeia de referências | reference chain | — |
| arquivo gerado | generated file | — |
| arquivo de configuração | configuration file / config file | "config file" é mais natural em en-US |
| schema de arquitetura | architecture schema | — |
| fonte de verdade | source of truth | — |
| fonte de verdade única | single source of truth (SSOT) | A sigla SSOT pode ser usada após primeira menção |

---

## Seção 4 — Vocabulário de cores

| pt-BR | en-US | Notas de uso |
|-------|-------|-------------|
| Token de cor | Color token | — |
| Paleta | Palette | — |
| Cor de marca | Brand color | — |
| Cor de ação | Action color | Equivale a "function color" — preferir "action" em texto simples |
| Cor de feedback | Feedback color | — |
| Cor de produto | Product color | — |
| Cor ambiente | Ambient color | — |
| Modo claro | Light mode | — |
| Modo escuro | Dark mode | — |
| Superfície positiva | Positive surface | — |
| Superfície negativa | Negative surface | "inverted surface" é aceitável mas menos preciso |
| Inversão de escala | Scale inversion | — |
| Cinza / Escala de cinza | Gray / Grayscale | — |
| Neutros / Neutrals | Neutrals | Manter "neutrals" em ambos os idiomas é aceitável |
| Croma | Chroma | — |
| Saturação | Saturation | — |
| Luminosidade | Lightness | — |
| Matiz | Hue | — |
| Tom quente / frio | Warm tone / Cool tone | — |
| Nível de intensidade | Intensity level | — |
| Nível mais claro | Lightest level | — |
| Nível mais escuro | Darkest level | — |
| Decomposição de cor | Color decomposition | — |
| Contraste | Contrast | — |
| Par de cor | Color pair | "background + txtOn pair" é a forma canônica |
| Estratégia de texto | Text strategy | Referindo-se a `txtOnStrategy` |
| Tom de marca | Brand tint | — |
| Override de cinza | Grayscale override | — |
| Override de neutrals | Neutrals override | — |

**Valores fixos de intensidade (manter em ambos):** `lowest`, `low`, `default`, `high`, `highest`

---

## Seção 5 — Vocabulário de tipografia e dimensão

| pt-BR | en-US | Notas de uso |
|-------|-------|-------------|
| Tipografia | Typography | — |
| Família de fonte | Font family | — |
| Peso | Weight | "font weight" quando combinado |
| Entrelinha | Line height | — |
| Escala tipográfica | Typography scale | — |
| Estilo de texto | Text style | — |
| Estilo composto | Composite style | "composite typography style" |
| Espaçamento | Spacing | — |
| Dimensão | Dimension | — |
| Escala dimensional | Dimension scale | — |
| Grade de 4 pontos | 4-point grid | "4pt grid" é abreviação aceita |
| Unidade de design padrão | Default design unit | — |
| Tamanho base | Base size | — |
| Densidade | Density | Referindo-se às variantes minor/normal/major |
| Compacto | Compact / Dense | "compact" para texto, "dense" para interfaces |
| Espaçoso | Spacious | — |
| Ritmo vertical | Vertical rhythm | — |
| Múltiplo | Multiple | "múltiplo de 4" → "multiple of 4" |

**Nomes de alias da escala (manter em ambos):** `nano`, `micro`, `extraSmall`, `small`, `medium`, `large`, `extraLarge`, `mega`, `giga`, `tera`, `peta`

**Variantes de densidade (manter em ambos):** `minor`, `normal`, `major`

---

## Seção 6 — Vocabulário do build e engine

| pt-BR | en-US | Notas de uso |
|-------|-------|-------------|
| Motor / Engine | Engine | "engine" é aceito em pt-BR também |
| Pipeline de build | Build pipeline | — |
| Geração de dados | Data generation | — |
| Etapa de geração | Generation stage | — |
| Etapa de transformação | Transformation stage | — |
| Formato de saída | Output format | — |
| Build incremental | Incremental build | — |
| Build completo | Full build | — |
| Propagação de referências | Reference propagation | — |
| Resolução de referências | Reference resolution | — |
| Decomposição | Decomposition | — |
| Sincronização | Sync | "sync" é aceito informalmente |
| Gradiente | Gradient | — |
| Armadilha dos gradientes | Gradient trap | — |
| Tema registrado | Registered theme | — |
| Foundation padrão | Default foundation | — |
| Foundation customizada | Custom foundation | — |
| Output | Output | Manter em ambos |
| Distribuível / dist | Distributable / dist | "dist" é universal |

---

## Seção 7 — Vocabulário de acessibilidade

| pt-BR | en-US | Notas de uso |
|-------|-------|-------------|
| Acessibilidade | Accessibility | — |
| Conformidade WCAG | WCAG compliance | — |
| Nível AA | AA level / WCAG AA | A sigla é universal |
| Nível AAA | AAA level / WCAG AAA | — |
| Razão de contraste | Contrast ratio | — |
| Contraste mínimo | Minimum contrast | — |
| Alvo de toque | Touch target | — |
| Leitura | Readability | Contexto: entrelinha para leitura |
| Legibilidade | Legibility | Contexto: tamanho de fonte |
| Fadiga visual | Visual fatigue | "eye strain" é igualmente correto |

---

## Seção 8 — Vocabulário de governança e processo

| pt-BR | en-US | Notas de uso |
|-------|-------|-------------|
| Governança | Governance | — |
| Custo exponencial | Exponential cost | — |
| Dívida técnica | Technical debt | — |
| Entropia | Entropy | — |
| Breaking change | Breaking change | Manter em ambos |
| Mudança destrutiva | Breaking change | Usar "breaking change" sempre |
| Depreciação | Deprecation | — |
| Versionamento semântico | Semantic versioning | "SemVer" é abreviação aceita |
| Versão maior | Major version | — |
| Versão menor | Minor version | — |
| Patch | Patch | Manter em ambos |
| Ciclo de revisão | Review cycle | — |
| Sobreposição responsável | Responsible override | — |
| Estudar → Testar → Documentar | Study → Test → Document | Manter a estrutura de seta |
| Curadoria | Curation | — |
| Contrato de tokens | Token contract | — |
| Padrão proibido | Forbidden pattern | — |
| Anti-pattern | Anti-pattern | Manter em ambos |
| Namespace reservado | Reserved namespace | — |

---

## Seção 9 — Vocabulário pedagógico (tutoriais)

| pt-BR | en-US | Notas de uso |
|-------|-------|-------------|
| Espiral de aprendizado | Learning spiral | — |
| Trilha de aprendizado | Learning path | — |
| Pré-requisito | Prerequisite | — |
| Checkpoint | Checkpoint | Manter em ambos |
| Exercício | Exercise | — |
| Resultado esperado | Expected result | — |
| Exemplo guiado | Guided example | — |
| Cenário | Scenario | — |
| Decisão de design | Design decision | — |
| Caso de uso | Use case | — |
| Fluxo de trabalho | Workflow | — |
| Onboarding | Onboarding | Manter em ambos |

---

## Seção 10 — Metáforas do sistema

O Aplica DS usa metáforas específicas para explicar conceitos. Estas metáforas têm formas aprovadas em inglês.

| Metáfora pt-BR | Metáfora en-US | Onde aparece |
|---------------|---------------|-------------|
| "a tinta" (pigmento puro) | "the paint" (raw pigment) | N2-01, token-architecture |
| "o propósito" (semantic) | "the purpose" | N2-01 |
| "o vocabulário simplificado" (foundation) | "the simplified vocabulary" | N2-01 |
| "O Dicionário" (semantic) | "The Dictionary" | N1-01, N1-02 |
| "O Atalho" (foundation) | "The Shortcut" | N1-01, N1-02 |
| "Bolo de Camadas" (arquitetura) | "Layer Cake" | S-N1-01 |
| "Config-First: o Figma como consumidor" | "Config-First: Figma as a consumer" | N2-03 |
| "fazer design, não digitação" | "designing, not data-entry" | S-N2-03 |

---

## Histórico de atualizações

| Data | Mudança |
|------|---------|
| 2026-04-10 | Versão inicial — criado antes da primeira tradução |
