---
title: "Quick Start — Instalar, Configurar, Compilar"
lang: pt-br
---

# Quick Start — Instalar, Configurar, Compilar

Este guia leva você do zero a uma build de tokens funcionando em menos de 10 minutos. Você vai instalar o pacote Aplica Theme Engine, montar um workspace de consumidor e produzir seu primeiro `dist/`.

---

## Pré-requisitos

- **Node.js** ≥ 18.0.0
- Um gerenciador de pacotes: npm, yarn ou pnpm
- Um projeto existente, ou uma pasta nova

---

## Passo 1 — Instalar o pacote

```bash
npm install @aplica/aplica-theme-engine
```

O pacote instala o engine, sua CLI e toda a lógica de geração. Seu projeto é dono da configuração; o pacote é dono da mecânica.

---

## Passo 2 — Montar o workspace de consumidor

Execute o comando de inicialização na raiz do projeto:

```bash
npx theme-engine init
```

A CLI oferece dois caminhos de entrada:

| Opção | O que faz | Quando usar |
|-------|-----------|-------------|
| **Load starter template** | Cria um workspace pronto para rodar com um tema inicial e os schemas padrão do pacote | Primeiro projeto, começo mais rápido |
| **Create using the wizard** | Mesma base de workspace + gera um `theme-engine/schemas/architecture.mjs` com base em respostas guiadas | Quando você precisa de uma estrutura de tokens personalizada |

Para um primeiro projeto, **escolha o starter template**.

> **O que é criado:**
>
> ```
> seu-projeto/
>   aplica-theme-engine.config.mjs   ← ponto de entrada do workspace
>   theme-engine/
>     config/
>       global/
>         themes.config.json           ← lista de marcas, configurações de modo
>         dimension.config.mjs         ← escalas de espaçamento e tamanho
>       foundations/
>         engine.config.mjs            ← tipografia e elevação de foundation
>       starter-brand.config.mjs       ← cores e tipografia da marca inicial
>     transformers.config.mjs          ← configuração de saída de build
> ```
>
> `data/` e `dist/` são gerados na primeira build — não são criados pelo `init`.

---

## Passo 3 — Adicionar scripts ao `package.json`

```json
{
  "scripts": {
    "tokens:build":       "theme-engine build",
    "tokens:build:all":   "theme-engine build:all",
    "tokens:themes":      "theme-engine themes:generate",
    "tokens:dimension":   "theme-engine dimension:generate",
    "tokens:sync":        "theme-engine sync:architecture",
    "tokens:foundations": "theme-engine foundations:generate"
  }
}
```

O comando padrão para uso no dia a dia é `tokens:build`. Os outros servem para inspecionar ou reconstruir etapas individuais do pipeline.

---

## Passo 4 — Rodar a primeira build

```bash
npm run tokens:build
```

Isso executa o pipeline completo de geração + build em sequência:

```
ensure:data         → valida / cria a estrutura de data/
themes:generate     → decompõe as cores da marca em paletas OKLCh
dimension:generate  → gera a escala espacial (minor / normal / major)
sync:architecture   → propaga referências de tokens entre camadas
foundations:generate → gera os aliases de Foundation a partir do Semantic
build:all           → transforma data/ em dist/ via Style Dictionary
```

Uma build bem-sucedida termina com código `0` e produz:

```
data/
  brand/<nome-da-marca>/  ← dados de tokens de marca gerados
  mode/                   ← modulação light / dark
  surface/                ← contexto positive / negative
  dimension/              ← espaçamento e tamanho por variante
  semantic/               ← tokens com propósito definido
  foundation/             ← aliases simplificados para times de produto

dist/
  json/                   ← valores de tokens em JSON (para Figma, Tokens Studio)
  css/                    ← CSS custom properties em rem (para Web)
  esm/                    ← ES Modules em px (para JS moderno)
  js/                     ← CommonJS em px (para Node.js / bundlers legados)
  assets/fonts/           ← arquivos de fonte (se a cópia de fontes estiver ativa)
```

---

## Passo 5 — Consumir a saída

O diretório `dist/` é o que sua aplicação, biblioteca de componentes ou plugin do Figma consome. O engine e a configuração que o orienta ficam no seu projeto — eles não são o que os consumidores importam.

**Web — CSS custom properties:**

```css
/* Importe no seu stylesheet global */
@import '@seu-escopo/tokens/dist/css/foundation/engine/foundation.css';

.button-primary {
  background: var(--foundation-bg-brand-default);
  color: var(--foundation-txt-on-brand-default);
}
```

**JavaScript / TypeScript:**

```ts
import tokens from '@seu-escopo/tokens/dist/esm/foundation/engine/foundation.mjs';

const primaryBg = tokens.foundation.bg.brand.default;
```

**Figma / Tokens Studio:** Aponte o Tokens Studio para `dist/json/` e sincronize.

---

## Avisos normais

Essas mensagens aparecem em toda build e não são erros:

- **Aviso de acessibilidade AAA** — um nível de paleta não atingiu contraste AAA. A build continua com fallback AA. Revise a cor da marca após a build se conformidade AAA for obrigatória.
- **Diretório de fonts não encontrado** — a cópia de fontes está ativa, mas `assets/fonts/` não existe. Nenhuma fonte é copiada; todos os outros outputs são gerados normalmente.
- **Build de components ignorado** — nenhum dado de componente existe ainda. Esperado quando você usa apenas outputs Semantic e Foundation.

---

## Próximos passos

| Objetivo | Artigo |
|----------|--------|
| Entender a estrutura de arquivos do workspace | [02-workspace-structure.pt-br.md](./02-workspace-structure.pt-br.md) |
| Personalizar cores de marca, tipografia e modos | [03-theme-configuration.pt-br.md](./03-theme-configuration.pt-br.md) |
| Controlar quais plataformas e formatos são gerados | [04-transformers-configuration.pt-br.md](./04-transformers-configuration.pt-br.md) |
| Ver todos os comandos CLI | [05-cli-reference.pt-br.md](./05-cli-reference.pt-br.md) |
| Integrar builds no CI/CD | [06-build-and-ci.pt-br.md](./06-build-and-ci.pt-br.md) |
| Diagnosticar erros de build | [07-troubleshooting.pt-br.md](./07-troubleshooting.pt-br.md) |
