---
title: "Workflow de Design (Figma Sync)"
lang: pt-BR
---

# Workflow de Design (Figma Sync)

Este documento descreve o fluxo de trabalho para designers que utilizam o **Aplica DS** para construir interfaces no Figma. O sistema utiliza uma abordagem **"Config-First"**, onde as decisões técnicas e semânticas são centralizadas em código e sincronizadas com as ferramentas de design.

---

## O Paradigma Config-First

Diferente de sistemas de design tradicionais onde o designer cria estilos no Figma e os desenvolvedores os "copiam", no Aplica DS:
1.  **A Intenção nasce no Config:** System Designers definem cores de marca, densidades (Dimension) e semânticas no arquivo `*.config.mjs`.
2.  **O Engine gera o Contrato:** O Theme Engine processa as configurações e gera arquivos JSON (Padrão W3C).
3.  **O Figma Consome:** O Designer de Produto importa esses JSONs no Figma para ter acesso aos tokens e variáveis atualizadas.

---

## Fluxo de Trabalho Passo-a-Passo

### 1. Preparação (System Designer / Dev)
O responsável pelo engine executa o comando de build para gerar os artefatos de saída:
```bash
npm run tokens:build
```
Isso gera arquivos JSON na pasta `dist/` do projeto consumidor, organizados por tema (ex: `aplica_joy-light-positive.json`). A configuração fica em `theme-engine/config/` — não no próprio pacote do engine.

### 2. Importação no Figma (Product Designer)
O designer utiliza o plugin **Tokens Studio for Figma** para ler esses arquivos:
1.  Abra o **Tokens Studio** no Figma.
2.  Vá em **Settings** → **Add New Storage** (ou use carregamento de arquivo local/URL dependendo da automação disponível).
3.  Carregue o arquivo JSON do tema desejado.

### 3. Sincronização de Variáveis
Uma vez que os tokens foram carregados pelo plugin:
1.  Vá na aba **Sets** e selecione os conjuntos de tokens necessários.
2.  Clique no ícone de **Variáveis de Estilo** (Figma Variables) no plugin.
3.  Selecione **Create/Update Variables**.
4.  O plugin irá mapear automaticamente os tokens do JSON para as Variáveis nativas do Figma, criando as coleções de acordo com a arquitetura de 5 camadas.

### 4. Aplicação e Troca de Tema
Com as variáveis sincronizadas, o designer pode:
- Aplicar cores, espaçamentos e raios diretamente nos componentes através do painel de Variáveis do Figma.
- Trocar entre modos (Light/Dark) ou Marcas alterando o **Mode** nativo do Figma na seção ou página.

---

## Governança e Erros

> [!CAUTION]
> **Nunca crie variáveis semânticas diretamente no Figma.**
> Se o plugin não encontrar um token no JSON que você precisa, **não o crie manualmente no Figma**. Isso gera dívida técnica e quebra o contrato de sincronização. A necessidade deve ser levada ao System Designer para ser incluída no arquivo de configuração original.

### Quando pedir uma alteração no Config?
- Precisão de uma nova cor de **Product** (Ex: selo de uma nova promoção).
- Ajuste na escala de **Typography** ou **Dimension**.
- Mudança na matiz principal da **Brand**.

> [!IMPORTANT]
> Lembre-se do **Alerta de Custo** ao pedir novas cores de produto. Cada item adiciona dezenas de tokens ao sistema. Sempre verifique se um token de Feedback ou variante de Brand existente pode resolver o problema.

---

## Resumo das Responsabilidades

| Ação | Quem executa | Ferramenta |
| :--- | :--- | :--- |
| Definir cores e escala | System Designer | `*.config.mjs` |
| Gerar JSON de tokens | Engenheiro / Engine | Terminais / Scripts |
| Sincronizar Figma | Product Designer | Tokens Studio Plugin |
| Construir Telas | Product Designer | Figma Variables |

---

## Referências

- O que é o Theme Engine: [01-what-is-theme-engine.pt-br.md](./01-what-is-theme-engine.pt-br.md)
- Guia de configuração: [03-configuration-guide.pt-br.md](./03-configuration-guide.pt-br.md)
- Formatos de output: [05-output-formats.pt-br.md](./05-output-formats.pt-br.md)
- Camada Foundation (por que Figma consome Foundation): [05-foundation-layer.pt-br.md](../02-token-layers/05-foundation-layer.pt-br.md)
- Quick start de engenharia: [09-engineering/01-quick-start.pt-br.md](../09-engineering/01-quick-start.pt-br.md)
