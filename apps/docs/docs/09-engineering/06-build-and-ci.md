---
title: "Build e Integração CI/CD"
lang: pt-br
---

# Build e Integração CI/CD

Este artigo cobre os scripts recomendados de `package.json`, estratégias de build para diferentes workflows de time, e como integrar a geração de tokens em um pipeline CI/CD.

---

## Scripts recomendados de `package.json`

```json
{
  "scripts": {
    "tokens:build":       "theme-engine build",
    "tokens:build:all":   "theme-engine build:all",
    "tokens:themes":      "theme-engine themes:generate",
    "tokens:dimension":   "theme-engine dimension:generate",
    "tokens:sync":        "theme-engine sync:architecture",
    "tokens:foundations": "theme-engine foundations:generate",
    "tokens:figma":       "theme-engine figma:generate",
    "tokens:validate":    "theme-engine validate:data"
  }
}
```

Use `tokens:build` para todo uso normal. Os outros são úteis durante a criação de marcas ou depuração.

---

## Estratégias de build

### Estratégia A — Regeneração completa (recomendada para CI)

Execute o pipeline completo em cada trigger de CI. Garante que `dist/` sempre reflete a configuração atual.

```bash
npm run tokens:build
```

Simples, confiável e idempotente. O pipeline completo termina em poucos segundos para a maioria dos projetos.

### Estratégia B — Incremental (desenvolvimento local)

Quando apenas o formato de output mudou (sem mudanças de cor ou tipografia), pule a geração de dados e apenas re-execute o transform do Style Dictionary:

```bash
npm run tokens:build:all
```

Quando as cores da marca mudaram:

```bash
npm run tokens:themes && npm run tokens:sync && npm run tokens:foundations && npm run tokens:build:all
```

### Estratégia C — Validar, depois build (pré-publicação)

Valide os dados gerados antes de construir. Captura violações de schema antes do passo do Style Dictionary.

```bash
npm run tokens:validate && npm run tokens:build:all
```

---

## Integração CI/CD

### GitHub Actions — pipeline completo

```yaml
name: Build design tokens

on:
  push:
    branches: [main]
    paths:
      - 'theme-engine/**'
      - 'aplica-theme-engine.config.mjs'

jobs:
  tokens:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Gerar e construir tokens
        run: npm run tokens:build

      - name: Validar output
        run: npm run tokens:validate

      # Opcional: publicar dist/ como artefato
      - uses: actions/upload-artifact@v4
        with:
          name: token-dist
          path: dist/
```

### GitHub Actions — publicar pacote de tokens

Se seu projeto publica `dist/` como um pacote npm separado:

```yaml
      - name: Build tokens
        run: npm run tokens:build

      - name: Publicar pacote de tokens
        run: npm publish --access public
        working-directory: ./packages/tokens
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Commitar `data/` e `dist/`

| Abordagem | Quando usar |
|-----------|-------------|
| **Não commitar nenhum** | CI regenera os dois. Abordagem mais limpa para times com CI confiável. |
| **Commitar apenas `dist/`** | Quando consumidores downstream fazem pull direto do repositório (não de um pacote publicado). Regenere no CI a cada push. |
| **Commitar os dois** | Quando você quer snapshots reproduzíveis para auditoria ou revisão. Adicione geração a um hook de pre-commit. |

### Hook de pre-commit (commitar os dois)

Instale o [Husky](https://typicode.github.io/husky/) e adicione:

```bash
# .husky/pre-commit
npm run tokens:build
git add data/ dist/
```

Isso garante que `data/` e `dist/` estejam sempre sincronizados com a configuração no momento do commit.

---

## Recomendações de `.gitignore`

```gitignore
# Outputs de build de tokens — regenerar no CI
/data/
/dist/
```

Ou, se commitando `dist/`:

```gitignore
# Dados de origem de tokens — regenerar no CI
/data/

# dist/ é commitado — não ignorar
```

---

## Ambientes Windows

A CLI funciona no Windows sem configuração adicional. Se você encontrar problemas de resolução de caminho no Windows, consulte [07-troubleshooting.pt-br.md](./07-troubleshooting.pt-br.md).

---

## Fixar versão do pacote

Fixe a versão do engine em `package.json` para controlar quando mudanças breaking afetam seu build:

```json
{
  "dependencies": {
    "@aplica/aplica-theme-engine": "3.3.1"
  }
}
```

Use um range de patch (`~3.3.0`) para updates automáticos de patch apenas. Evite ranges `^` (caret) se a estabilidade do contrato de nomenclatura de tokens for crítica para seus consumidores.

---

## Diagnóstico de builds CI com falha

1. **`No consumer workspace config was found`** — `aplica-theme-engine.config.mjs` está ausente ou não está na raiz do projeto. Verifique se o arquivo está commitado.
2. **`validate:data` falha** — incompatibilidade de schema de geração. Execute `tokens:build` localmente e commit o `data/` atualizado.
3. **Build termina com código não-zero sem mensagem de erro** — verifique a versão do Node.js (requer ≥ 18.0.0).
4. **Fontes não copiadas** — diretório `assets/fonts/` não existe. Crie-o ou defina `copyFonts: false` em `transformers.config.mjs`.

Para mais detalhes, consulte [07-troubleshooting.pt-br.md](./07-troubleshooting.pt-br.md).
