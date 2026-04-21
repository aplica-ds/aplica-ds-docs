---
title: "Diagnóstico de Problemas"
lang: pt-br
---

# Diagnóstico de Problemas

Este artigo cobre os erros mais comuns e como resolvê-los, organizados pela etapa em que aparecem.

---

## Erros de setup

### `No consumer workspace config was found`

**Quando aparece:** Ao executar qualquer comando de build ou geração antes do `init`.

**Causa:** O engine não encontra `aplica-theme-engine.config.mjs` na raiz do projeto.

**Solução:**
```bash
npx aplica-theme-engine init
```

Ou crie `aplica-theme-engine.config.mjs` manualmente. Veja [01-quick-start.pt-br.md](./01-quick-start.pt-br.md).

---

### Comando `aplica-theme-engine` não encontrado

**Causa:** O pacote não está instalado, ou o diretório `.bin` não está no `PATH`.

**Solução:**
```bash
# Instalar o pacote
npm install @aplica/aplica-theme-engine

# Usar npx se o binário não estiver no PATH
npx aplica-theme-engine init
```

---

### CLI não produz output no Windows

**Causa:** O PowerShell às vezes suprime output de processos Node.js iniciados via `npx`.

**Soluções:**
1. Execute com `node` diretamente:
   ```powershell
   node .\node_modules\@aplica-ds\aplica-theme-engine\index.mjs init
   ```
2. Mude para o Prompt de Comando (`cmd.exe`) e tente novamente.
3. Certifique-se de que Node.js ≥ 18.0.0 está instalado (`node -v`).

---

## Erros de geração

### Aviso de acessibilidade AAA

**Quando aparece:** Durante `themes:generate`.

**Causa:** Um ou mais níveis de paleta não atingem a proporção de contraste AAA (7:1).

**Este é um aviso, não uma falha.** O build continua com fallback AA (4.5:1).

**Opções:**
- **Aceitar fallback AA** (padrão) — defina `acceptAALevelFallback: true` na config da marca. O engine continua automaticamente.
- **Mudar a cor da marca** — ajuste a cor em `*.config.mjs` até que AAA passe.
- **Mudar para alvo AA** — defina `accessibilityLevel: 'AA'` na config da marca para usar 4.5:1 como alvo.

---

### `No font assets directory found`

**Quando aparece:** Durante `build:all`, quando `copyFonts: true` em `transformers.config.mjs`.

**Causa:** O diretório `assets/fonts/` não existe na raiz do projeto.

**Este é um aviso, não uma falha.** Todos os outros outputs são gerados normalmente.

**Solução:** Crie o diretório `assets/fonts/` e adicione arquivos de fonte, ou desative a cópia de fontes:
```js
// theme-engine/transformers.config.mjs
assets: {
  copyFonts: false,
  generateFontsManifest: false
}
```

---

### `Gradients not propagated`

**Quando aparece:** Durante `sync:architecture`, quando gradientes estão ativados.

**Causa:** `themes:generate` ainda não foi executado, então os dados de gradiente da marca não existem.

**Solução:** Sempre execute `themes:generate` antes de `sync:architecture`, ou use o pipeline completo:
```bash
npm run tokens:build
```

---

## Erros de build

### `validate:data` termina com código não-zero

**Quando aparece:** Ao executar `aplica-theme-engine validate:data`.

**Causa:** O `data/` gerado não corresponde ao contrato de schema esperado. Causas comuns:
- Config da marca mudou mas `themes:generate` não foi re-executado
- Sobrescritas de schema em `theme-engine/schemas/` estão fora de sincronia com `data/`

**Solução:**
```bash
# Regenerar data/ do zero
npm run tokens:build
```

---

### Build do Style Dictionary falha com `could not resolve reference`

**Quando aparece:** Durante `build:all`.

**Causa:** Um token em `data/` referencia outro token que não existe. Geralmente causado pela execução de `build:all` após um `themes:generate` parcial que não completou.

**Solução:**
```bash
# Regeneração completa — regenera data/ a partir da config antes de construir
npm run tokens:build
```

---

### `output paths must stay inside the consumer workspace root`

**Causa:** Um caminho em `aplica-theme-engine.config.mjs` ou `transformers.config.mjs` aponta para fora da raiz do projeto. O engine se recusa a gravar fora do workspace como medida de segurança.

**Solução:** Certifique-se de que todos os valores `paths.*` e `output.directories.*` resolvem para caminhos dentro do diretório do seu projeto. Use caminhos relativos começando com `./`.

---

## Problemas específicos do Windows

### Erros de caminho com barras invertidas

**Causa:** O Windows usa `\` como separador de caminho, mas algumas ferramentas esperam `/`.

**Solução:** Sempre use barras normais nos arquivos de config, mesmo no Windows:
```js
// Correto
paths: {
  configDir: './theme-engine/config'
}

// Pode causar problemas em alguns sistemas
paths: {
  configDir: '.\\theme-engine\\config'
}
```

---

### CLI termina silenciosamente no CI (runner Windows)

**Causa:** O wrapper `npx` do Windows pode suprimir output de stderr de scripts ESM.

**Solução:** Chame o Node.js diretamente nos scripts de CI:
```yaml
# GitHub Actions — runner Windows
- name: Build tokens
  run: node ./node_modules/@aplica/aplica-theme-engine/index.mjs build
```

---

### Permissão negada ao gravar em `dist/`

**Causa:** Um processo de build anterior ou software antivírus travou arquivos em `dist/`.

**Solução:**
1. Delete `dist/` e `data/` manualmente.
2. Execute `npm run tokens:build` novamente.

---

## Diagnóstico de erros desconhecidos

### Verificar versão do Node.js

```bash
node -v
# Deve ser v18.0.0 ou superior
```

### Verificar resolução do workspace

A CLI exibe seus caminhos resolvidos na inicialização:

```
aplica-theme-engine
Package root:   /caminho/para/node_modules/@aplica/aplica-theme-engine
Workspace root: /caminho/para/seu-projeto
Command:        build
```

Verifique se `Workspace root` aponta para seu projeto e não para o diretório do próprio pacote. Se os dois coincidirem, o engine está rodando em modo auto-referencial (dentro do próprio pacote), o que significa que a config do workspace não foi encontrada.

### Rebuild limpo

Delete os diretórios gerados e reconstrua do zero:

```bash
rm -rf data/ dist/
npm run tokens:build
```

---

## Obtendo ajuda

Se nenhuma das soluções acima resolver o problema:
1. Anote a mensagem de erro exata e o comando que a produziu.
2. Anote sua versão do Node.js, SO e shell (PowerShell / bash / cmd).
3. Anote o conteúdo de `aplica-theme-engine.config.mjs` (sem valores de cor sensíveis).
4. Abra uma issue no repositório do projeto com essas informações.
