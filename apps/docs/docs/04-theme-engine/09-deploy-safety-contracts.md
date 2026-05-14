---
title: "Deploy Safety Contracts"
lang: pt-br
---

# Deploy Safety Contracts

## O que é

Um **contrato de token** é um snapshot estrutural do output gerado pelo Aplica Theme Engine: os paths de token e seus tipos, sem os valores. Funciona como a "assinatura de API" do pacote de tokens — estável entre releases de patch e minor, muda apenas quando paths são adicionados, removidos ou renomeados.

O mecanismo resolve um problema clássico em arquiteturas de design system distribuídas: quando o repositório de configuração do Theme Engine renomeia um token, a biblioteca de componentes continua usando o nome antigo — e nada detecta a quebra antes do deploy chegar em produção.

---

## Por que valores não são suficientes

Uma mudança de valor (`#265ed9` → `#1a4fc2`) não quebra nenhum componente. Uma remoção ou renomeação de path (`color.brand.branding.first.default.background` → `color.brand.primary.default.bg`) quebra todo componente que referencia o nome antigo via CSS var ou token JS.

O contrato captura **estrutura**, não valor. Isso o torna estável para commitar na biblioteca de componentes e confiável como sinal de CI.

---

## Os dois repositórios

O fluxo pressupõe a arquitetura recomendada de dois repos:

```
Theme Engine config repo        Component library repo
(mantém config/ + tokens)  →   (instala o pacote publicado)
```

Cada repo tem uma responsabilidade distinta no ciclo de contratos:

| Repo | Ação | Quando |
|------|------|--------|
| Theme Engine config | `contracts:generate` | Após `build`, antes de `npm publish` |
| Component library | `contracts:diff` em CI | Em PRs que atualizam o pacote de tokens |

---

## Estrutura do arquivo de contrato

```json
{
  "version": "3.16.0",
  "generatedAt": "2026-05-09T...",
  "brand": "aplica_blue_sky",
  "paths": {
    "color.brand.branding.first.default.background": "color",
    "color.brand.branding.second.default.background": "color",
    "color.interface.feedback.solid.danger.default.normal.background": "color",
    "typography.heading.headline_1.fontFamily": "string",
    "border.radii.medium": "dimension",
    "dimension.semantic.medium": "dimension"
  }
}
```

Apenas paths e tipos. Valores nunca entram no contrato.

---

## Gerando o contrato — `contracts:generate`

Execute no repositório de configuração após o build:

```bash
# Brand primário (detectado de themes.config.json)
theme-engine contracts:generate

# Brand específico
theme-engine contracts:generate --brand aplica_slate

# Todos os brands de uma vez
theme-engine contracts:generate --all
```

**Output:** `dist/contracts/<brand>-contract.json`

O arquivo é publicado no pacote NPM junto com `dist/` e fica disponível em `node_modules/@aplica/aplica-theme-engine/dist/contracts/` nas bibliotecas que instalam o pacote.

---

## Comparando contratos — `contracts:diff`

Execute na biblioteca de componentes, em CI, após instalar uma nova versão do pacote de tokens:

```bash
# Compara o contrato local com o que veio no pacote instalado
theme-engine contracts:diff --contract ./contracts/aplica_blue_sky-contract.json

# Gera relatório em arquivo além do log no terminal
theme-engine contracts:diff \
  --contract ./contracts/aplica_blue_sky-contract.json \
  --output ./contracts/diff-report.json
```

O engine localiza automaticamente o contrato do pacote em `node_modules/@aplica/aplica-theme-engine/dist/contracts/<brand>-contract.json`.

---

## Os três resultados

| Resultado | Condição | Exit code | Ação recomendada |
|-----------|----------|-----------|-----------------|
| ✅ **Green** | Nenhuma mudança estrutural | `0` | CI passa silenciosamente |
| ⚠️ **Alert** | Paths novos adicionados (additive, não-breaking) | `0` com aviso | CI passa — dev atualiza o contrato local |
| ❌ **Error** | Paths removidos ou tipos alterados (breaking) | `1` | CI bloqueia — review obrigatório |

**Error** ocorre quando um path que existe no contrato da biblioteca desaparece ou muda de tipo no pacote novo. Isso significa que componentes que referenciam esse path vão quebrar em runtime.

**Alert** indica que o pacote ganhou novos paths que a biblioteca ainda não mapeou. O contrato local deve ser atualizado para refletir a nova superfície disponível.

---

## GitHub Action template

O pacote inclui um template de workflow pronto. Copie para a biblioteca de componentes:

```bash
cp node_modules/@aplica/aplica-theme-engine/templates/github-actions/contracts-check.yml \
   .github/workflows/contracts-check.yml
```

O workflow roda `contracts:diff` em PRs que atualizam `package.json` e bloqueia o merge em caso de **Error**.

---

## Configurando o contrato inicial na biblioteca

Na primeira vez que adotar contratos em uma biblioteca existente:

```bash
# 1. No repo de configuração — gere o contrato da versão atual
theme-engine contracts:generate

# 2. Copie o contrato para a biblioteca
cp <caminho-do-engine-config>/dist/contracts/aplica_blue_sky-contract.json \
   <caminho-da-biblioteca>/contracts/aplica_blue_sky-contract.json

# 3. Comite o contrato na biblioteca
git add contracts/aplica_blue_sky-contract.json
git commit -m "chore: add initial token contract baseline"
```

A partir daí, toda atualização do pacote de tokens passa pelo `contracts:diff` em CI.

---

## Atualizando o contrato após um Alert

Quando o CI reporta **Alert** (paths novos), atualize o contrato local para incorporar a nova superfície:

```bash
# Gere o contrato atualizado no repo de configuração e republique
theme-engine contracts:generate && npm publish

# Na biblioteca, após instalar a nova versão:
cp node_modules/@aplica/aplica-theme-engine/dist/contracts/aplica_blue_sky-contract.json \
   ./contracts/aplica_blue_sky-contract.json
git add contracts/aplica_blue_sky-contract.json
git commit -m "chore: update token contract to include new paths"
```

---

## Audiência

| Papel | O que fazer |
|-------|------------|
| **Design Engineer (N3)** | Configura `contracts:generate` no pipeline de publicação do engine config repo. Entende o que cada resultado significa para a biblioteca. |
| **Engenheiro de plataforma** | Adiciona `contracts:diff` ao CI da biblioteca de componentes. Revisa manualmente releases que geram **Error**. |
| **System Designer (N2)** | Não executa contratos diretamente, mas deve saber que renomear um token causa **Error** em bibliotecas que já o consomem. |

---

## Referências

- Referência da CLI — `contracts:generate`, `contracts:diff`: [../09-engineering/05-cli-reference.md](../09-engineering/05-cli-reference.md#comandos-de-contratos)
- Design.md — snapshot de contexto para ferramentas de IA: [08-design-file-format.md](./08-design-file-format.md)
- Build pipeline — onde encaixar o `contracts:generate`: [04-build-pipeline.md](./04-build-pipeline.md)
