---
title: "Design.md — Contexto para Ferramentas de IA"
lang: pt-br
---

# Design.md — Contexto para Ferramentas de IA

## O que é

O `DESIGN.md` é um arquivo de especificação de design system no formato **Google Stitch**: YAML frontmatter legível por máquina + corpo markdown legível por humanos. Qualquer ferramenta de IA que siga a spec — Cursor, Claude Code, GitHub Copilot, Gemini, v0 — usa este arquivo para gerar código de UI coerente com o sistema sem precisar adivinhar paletas, tamanhos ou espaçamentos.

É o equivalente visual do `AGENTS.md`: enquanto o `aplica-ui-integration.md` ensina *como* consumir tokens, o `DESIGN.md` declara *quais são* os valores resolvidos — cores hexadecimais, famílias tipográficas, escalas de espaçamento, raios de borda.

---

## Por que existe

As skills injetadas pelo `ai:init` ensinam *regras* de consumo de tokens: nunca hardcodar valores, sempre verificar em `dist/`, preferir Foundation Styles. Mas uma ferramenta de IA que não tem acesso aos arquivos `dist/` do projeto — ou que está em um editor sem plugin de contexto — não consegue verificar os valores reais.

O `DESIGN.md` resolve isso: ele é um **snapshot resolvido** do brand ativo que qualquer ferramenta pode ler sem dependência de sistema de build ou plugin. Ao colocar o arquivo no root do repositório, o contexto do sistema de design fica disponível para todo assistente que acessa o projeto.

---

## O que o arquivo contém

O YAML frontmatter define quatro seções de valor:

```yaml
colors:
  primary: "#265ed9"       # brand.branding.first.default.background
  secondary: "#fecb01"
  surface: "#f6f3f5"
  on-surface: "#000000"    # WCAG-validated against surface
  error: "#f53232"

typography:
  h1: { fontFamily: "Roboto", fontSize: "36px", fontWeight: 700, lineHeight: "44px" }
  body-md: { fontFamily: "Roboto", fontSize: "16px", fontWeight: 400, lineHeight: "24px" }

spacing:
  sm: "12px"   md: "16px"   lg: "20px"   xl: "24px"

rounded:
  sm: "8px"    md: "12px"   lg: "16px"   full: "1000px"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.md}"
```

O corpo markdown explica cada slot com a nomenclatura Aplica canônica, facilitando o entendimento por humanos e agentes de IA.

---

## Dois caminhos para obter o arquivo

### 1. Template estático — via `ai:init` (setup inicial)

```bash
theme-engine ai:init
```

Copia um `DESIGN.md` pré-construído com valores do brand de referência `aplica_blue_sky` para a raiz do workspace. Use como ponto de partida antes de rodar o build completo do seu brand.

### 2. Geração dinâmica — via `design:md` (com valores reais)

```bash
# Brand primário (detectado de themes.config.json)
theme-engine design:md

# Brand específico
theme-engine design:md --brand meu-brand
```

Resolve os valores reais a partir dos arquivos gerados do seu brand e grava:

| Arquivo | Finalidade |
|---------|-----------|
| `DESIGN.md` | Spec na raiz do workspace — use com ferramentas de IA |
| `data/foundation/<brand>/design-md.json` | JSON intermediário resolvido — versionável, útil para ferramentas programáticas |

> Execute `design:md` sempre que mudar cores de marca ou após um `theme-engine build` — os valores no `DESIGN.md` refletem o estado atual do brand.

---

## Customização via config de intenção

O engine gera descrições padrão para cada slot a partir do `schemas/design-md.mjs`. Se quiser substituir a descrição de um slot — por exemplo, dar contexto sobre a personalidade da marca ou restrições de uso — edite `config/foundations/design-md.json`:

```json
{
  "overview": "Sistema de design para saúde e bem-estar. Acessibilidade em primeiro lugar, paleta coral/teal.",
  "colors": {
    "primary": { "$description": "Coral âncora da marca — nunca usar sobre fundos brancos puros." }
  }
}
```

Você só precisa declarar os slots que quer personalizar. O engine usa os defaults do schema para os demais.

---

## Pareamento com schemas

O `DESIGN.md` está pareado com `schemas/design-md.mjs`, que vive junto com `architecture.mjs` e `typography-styles.mjs`. Quando a arquitetura de tokens evolui — um novo slot de cor, uma nova categoria tipográfica — `schemas/design-md.mjs` é atualizado na mesma PR. Isso garante que:

- As descrições geradas automaticamente sempre cobrem todos os slots atuais
- O `config/foundations/design-md.json` nunca fica com slots quebrados (o schema valida)
- Nenhuma mudança de contrato passa sem atualizar o contexto de IA

---

## Validação

```bash
npx @google/design.md lint DESIGN.md
```

A CLI do Google Stitch verifica se o arquivo é válido: YAML parseável, token references resolvem dentro do próprio frontmatter, seções obrigatórias presentes. Saída sem erros significa que qualquer ferramenta compatível com a spec consegue consumir o arquivo.

---

## Audiência

| Papel | O que fazer |
|-------|------------|
| **System Designer (N2)** | Rode `design:md` após configurar um brand novo. Edite `config/foundations/design-md.json` para adicionar contexto da marca. |
| **Design Engineer (N3)** | Comite o `DESIGN.md` no repositório. Regenere após cada `theme-engine build`. Configure CI para rodar `design:md` automaticamente se necessário. |
| **Component Author (N1+)** | Usa o `DESIGN.md` indiretamente — ferramentas de IA consultam o arquivo automaticamente. |

---

## Referências

- Referência da CLI — comandos `design:md`, `ai:init`: [../09-engineering/05-cli-reference.md](../09-engineering/05-cli-reference.md)
- AI Skills Injection — orientação de consumo injetada nas ferramentas: [07-ai-skills-injection.md](./07-ai-skills-injection.md)
- Contratos de deploy — complementar ao Design.md para segurança de release: [09-deploy-safety-contracts.md](./09-deploy-safety-contracts.md)
