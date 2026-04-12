---
level: n3
id: N3-01
title: "O contrato de tokens — o que o engine garante"
prerequisites: []
duration: "12 min"
lang: pt-BR
---

# N3-01 · O contrato de tokens

## Contexto

Você está prestes a construir um componente — ou revisar um que já existe. Antes de escrever a primeira linha de CSS, existe uma pergunta mais importante do que "qual é o token certo?": **o que eu posso confiar que vai permanecer estável?**

O contrato de tokens define exatamente isso. Ele diz o que o engine garante, o que ele pode mudar sem aviso, e o que você nunca deve fazer no código de um componente. Ignorar esse contrato é a causa mais comum de componentes que quebram silenciosamente após um update do engine.

---

## Conceito

### As três camadas do consumidor

Do ponto de vista de quem escreve componentes, o engine expõe três namespaces:

```
semantic.*    — A camada canônica. Sempre use esta.
foundation.*  — Aliases para Semantic. Use quando o atalho já existe.
component.*   — Tokens de componente específico (quando disponível).
```

Tudo abaixo disso — `brand.*`, `mode.*`, `surface.*` — são **camadas internas**. Elas não fazem parte do contrato público. Referenciar uma camada interna é como chamar uma API privada: pode funcionar hoje e quebrar amanhã sem aviso.

### A regra de ouro

```
Sempre use Semantic.
Use Foundation quando um alias adequado já existe.
Nunca referencie brand.*, mode.* ou surface.* em componentes.
```

### O que o Semantic garante

Qualquer caminho que aparece em `dist/` é parte do contrato público. Se o token está no build, o engine garante que ele só vai mudar com um bump de versão major.

```
semantic.color.interface.function.primary.normal.background
↓ em CSS
--semantic-color-interface-function-primary-normal-background
```

Esse caminho foi publicado. Ele vai existir na próxima versão minor. Se precisar ser renomeado ou removido, isso é um **breaking change** — versão major, entrada no CHANGELOG, período de depreciação.

### O que NÃO é garantido

- Caminhos que você inventa (`--semantic-color-minha-cor-customizada`)
- Referências a camadas internas (`brand.*`)
- Valores hardcoded que "correspondem" a um token (`#C40145` em vez de `var(--semantic-...)`)

---

## Exemplo guiado

### Certo vs errado — três cenários

**Cenário 1: Cor hardcoded**

```css
/* ❌ ERRADO — não responde a theming, dark mode, multi-marca */
.badge { background: #D7F6CB; }

/* ✅ CERTO — o valor muda automaticamente com o tema */
.badge { background: var(--semantic-color-interface-feedback-success-default-normal-background); }
```

**Cenário 2: Referência a camada interna**

```css
/* ❌ ERRADO — brand.* é camada interna, não parte do contrato */
.hero { background: var(--brand-branding-first-100-background); }

/* ✅ CERTO — Semantic encapsula a lógica de brand + mode + surface */
.hero { background: var(--semantic-color-brand-branding-first-default-background); }
```

**Cenário 3: Token inventado em CSS de produto**

```css
/* ❌ ERRADO — cria um namespace que conflita com builds futuros */
:root { --semantic-color-minha-cor: #C40145; }
.btn  { background: var(--semantic-color-minha-cor); }

/* ✅ CERTO — usar apenas paths que existem no dist/ */
.btn  { background: var(--semantic-color-interface-function-primary-normal-background); }
```

### Como verificar se um token existe no build

Antes de usar um token, confirme que ele está no output:

```bash
# Verificar existência em CSS
grep "semantic-color-interface-function-primary" dist/css/*.css | head -3

# Verificar estrutura do JSON semântico
cat dist/json/aplica_joy-light-positive-semantic.json | python -m json.tool | grep -A2 "primary"
```

Se o token não aparece no `dist/`, ele não existe no contrato — não use.

---

## Agora você tenta

Dado o CSS abaixo, identifique os problemas e corrija-os:

```css
/* Componente: Card de alerta */
.card-alert {
  background: #FEE6C2;                          /* cor hardcoded */
  color: #1a1a1a;                               /* cor hardcoded */
  border-left: 4px solid var(--warning-color);  /* token inventado */
  padding: 16px;                                /* valor hardcoded */
}

.card-alert__title {
  color: var(--brand-text-title);               /* camada interna */
  font-size: 14px;                              /* valor hardcoded */
}
```

**Resultado esperado após correção:**

```css
.card-alert {
  background: var(--semantic-color-interface-feedback-warning-default-normal-background);
  color:      var(--semantic-color-interface-feedback-warning-default-normal-txt-on);
  border-left: 4px solid var(--semantic-color-interface-feedback-warning-secondary-normal-border);
  padding:    var(--semantic-dimension-spacing-small);
}

.card-alert__title {
  color:     var(--semantic-color-text-title);
  font-size: var(--semantic-typography-font-sizes-extra-small);
}
```

> **Dica:** Sempre que ver um hex ou um número solto em CSS de componente, pergunte: "qual é o token que representa esta intenção?"

---

## Checkpoint

Ao fim deste tutorial você deve saber:

- [ ] Por que usar `semantic.*` e não `brand.*` ou `mode.*` em componentes
- [ ] Quando Foundation é apropriado (atalho para Semantic quando o alias existe)
- [ ] Como verificar se um caminho de token existe no build antes de usar
- [ ] Por que hardcoded hex quebra theming, dark mode e multi-marca
- [ ] O que é um breaking change no contexto do engine (rename ou remoção de token = major version)

---

## Próximo passo

[N3-02 · Construindo um componente — variantes, estados e tamanhos](./02-construindo-um-componente.md)

Você sabe quais tokens usar e que o contrato é estável. Agora vamos construir um componente completo — com todas as variantes e todos os estados mapeados para tokens corretos.

---

## Referências

- Contrato canônico completo: [01-component-token-contract.md](../../05-components-theory/01-component-token-contract.md)
- Taxonomia e naming contract: canonical-taxonomy-and-naming-contract.md
- Formatos de output (onde fica o dist/): [05-output-formats.md](../../04-theme-engine/05-output-formats.md)
