---
level: n3
id: N3-04
title: "Entendendo o pipeline de build"
prerequisites: ["N3-01"]
duration: "12 min"
lang: pt-BR
---

# N3-04 · Entendendo o pipeline de build

## Contexto

Você alterou a cor primária de um tema. Rodou o build. Mas a cor no CSS não mudou. Por quê?

Ou: o gradiente existe no config mas não aparece no output. O que foi esquecido?

Entender o pipeline de build não é opcional para um Design Engineer — é o que separa "funciona na minha máquina" de "sei exatamente o que precisa rodar e em que ordem".

---

## Conceito

### Duas etapas, uma ordem

O pipeline tem dois estágios sequenciais. O segundo só funciona bem se o primeiro foi executado corretamente.

```
[Etapa 1 — Geração de Dados]
config/*.config.mjs
        │
        ├─ themes:generate    → data/brand/{tema}/
        ├─ dimension:generate → data/dimension/normal.json
        ├─ sync:architecture  → data/mode/, data/surface/, data/semantic/, data/foundation/
        └─ foundations:generate → data/foundation/{nome}/styles/

[Etapa 2 — Style Dictionary]
data/  →  npm run build  →  dist/
                             ├── css/
                             ├── json/
                             ├── esm/
                             ├── cjs/
                             └── dts/
```

A pasta `data/` é intermediária — **nunca edite arquivos em `data/` manualmente**. Qualquer edição manual é sobrescrita na próxima execução do pipeline.

### O comando que faz tudo

```bash
npm run build:themes
```

Executa na ordem correta: `ensure:data` → `dimension:generate` → `themes:generate` → `sync:architecture` → `foundations:generate` → `build`.

Use este comando após clone do repositório, após mudanças em configs, ou quando não tem certeza do que está desatualizado.

### Quando rodar build incremental

| Mudança | Comandos necessários |
|---------|---------------------|
| Alterar cor de um tema | `themes:generate` → `build` |
| Alterar escala dimensional | `dimension:generate` → `build` |
| Alterar schema (feedback/product) | `sync:architecture` → `themes:generate` → `build` |
| Alterar foundation | `foundations:generate` → `build` |
| `data/` já atualizado, só recriar dist/ | `build` |

---

## Exemplo guiado

### O papel do `sync:architecture`

Este é o comando mais incompreendido do pipeline. Ele lê o schema de arquitetura e propaga referências para todas as camadas intermediárias. Sem ele, as camadas `mode/`, `surface/`, `semantic/` e `foundation/engine/` ficam desatualizadas em relação ao schema.

**Quando é obrigatório:**

```bash
# Adicionou um novo item de product ao schema
# → o sync propaga a nova categoria para mode/, surface/, semantic/
npm run sync:architecture
npm run themes:generate
npm run build

# Adicionou gradientes ao config de um tema
# → sem o sync, semantic.color.gradient não existe, gradiente é omitido
npm run sync:architecture
npm run build
```

**Como testar sem gravar:**

```bash
# Verifica se o schema e os configs dos temas estão alinhados
npm run sync:architecture:test

# Exibe o schema atual
npm run sync:architecture:schema
```

### A armadilha dos gradientes

Este é o problema mais comum com gradientes:

```bash
# Você fez isso:
npm run themes:generate
npm run build

# O gradiente não aparece no CSS. Por quê?
# sync:architecture não rodou → semantic.color.gradient não existe
# Style Dictionary não encontra a seção → omite silenciosamente

# Solução:
npm run sync:architecture
npm run build
```

O `build:themes` já inclui o `sync:architecture` na ordem correta. Se você usou comandos individuais, esta é a ordem que nunca falha:

```
themes:generate → sync:architecture → build
```

---

## Agora você tenta

Dado o cenário abaixo, escreva a sequência de comandos correta:

> Você adicionou `promo_extended` como um novo item de Product no schema de arquitetura. Depois modificou a cor `brand_principal` no config de um tema existente. Por fim, você quer apenas recriar o `dist/` sem alterar `data/`.

**Sequência correta:**

```bash
# 1. Novo item no schema → sync propaga para mode/surface/semantic
npm run sync:architecture

# 2. Cor alterada no config → themes:generate decompõe e grava data/brand/
npm run themes:generate

# 3. Recriar dist/ com os dados atualizados
npm run build
```

> Se você tivesse dúvida sobre a ordem, o comando seguro sempre é `npm run build:themes` — ele resolve tudo.

---

## Diagnóstico dos 5 problemas mais comuns

| Sintoma | Causa provável | Solução |
|---------|---------------|---------|
| Gradiente não aparece no CSS | `sync:architecture` não rodou após `themes:generate` | `npm run sync:architecture` → `npm run build` |
| Token novo não aparece no `dist/` | Tema não registrado em `themes.config.json` | Adicionar entrada no arquivo global de temas |
| Cor diferente do esperado | Override em `overrides.*` sobrescrevendo o gerado | Verificar overrides no config do tema |
| Build falha com "reference not found" | `data/` desatualizado em relação aos configs | `npm run build:themes` (rebuild completo) |
| `txtOn` é preto/branco quando esperava cor de marca | `txtOnStrategy: 'high-contrast'` é o padrão | Mudar para `'brand-tint'` nas options do tema |

---

## Checkpoint

Ao fim deste tutorial você deve saber:

- [ ] As duas etapas do pipeline e a ordem que nunca falha
- [ ] O que `sync:architecture` faz e quando é obrigatório
- [ ] A diferença entre `build:themes` (completo) e os comandos incrementais
- [ ] Por que nunca editar `data/` manualmente
- [ ] Diagnosticar os 5 problemas mais comuns pelo sintoma

---

## Próximo passo

[N3-05 · Integrando tokens no seu projeto](./05-integrando-tokens.md)

O build gerou o `dist/`. Agora como você conecta esse output ao seu projeto React, Vue, Next.js ou CSS-only?

---

## Referências

- Pipeline completo em detalhe: [04-build-pipeline.md](../../04-theme-engine/04-build-pipeline.md)
- Formatos de output: [05-output-formats.md](../../04-theme-engine/05-output-formats.md)
- Guia de configuração: [03-configuration-guide.md](../../04-theme-engine/03-configuration-guide.md)
