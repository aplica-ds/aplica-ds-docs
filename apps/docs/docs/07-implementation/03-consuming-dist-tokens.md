---
title: "Consumindo Tokens de dist/"
lang: pt-BR
---

# Consumindo Tokens de dist/

## Público

Este artigo é para desenvolvedores que **recebem uma pasta `dist/`** — seja de um colega que rodou o engine, de um artefato de CI/CD ou de um pacote npm publicado — e precisam integrar esses tokens em uma aplicação. Você não precisa instalar `@aplica/aplica-theme-engine` nem executar nenhum comando do engine.

---

## O que você recebe

A pasta `dist/` contém os mesmos tokens em múltiplos formatos, todos referenciando os mesmos valores subjacentes:

```
dist/
├── json/        ← JSON com valores em px (Figma, Tokens Studio, uso universal)
├── css/         ← CSS custom properties com rem (Web)
├── esm/         ← ES Modules com px (React, Vue, bundlers modernos)
├── js/          ← CommonJS com px (Node.js, bundlers legados)
└── dts/         ← TypeScript declarations (type safety)
```

Cada arquivo tem o nome de uma variante de tema: `{brand}-{mode}-{surface}.{ext}`

Exemplos:
- `aplica_joy-light-positive.css` — brand Aplica Joy, modo light, surface positiva
- `aplica_joy-dark-positive-semantic.json` — mesma brand, modo dark, camada semântica

Escolha o formato que corresponde à sua plataforma e importe apenas a variante que precisar.

---

## Duas camadas de token

Todo `dist/` contém duas camadas. Use **Foundation** para o trabalho de produto do dia-a-dia; use **Semantic** quando Foundation não tiver o que você precisa.

| Camada | Namespace | Nomes de token | Quando usar |
|--------|-----------|---------------|-------------|
| **Foundation** | `foundation.*` | Aliases curtos: `foundation.bg.primary`, `foundation.txt.body` | Maioria dos componentes de produto |
| **Semantic** | `semantic.*` | Nomes completos: `semantic.color.interface.function.primary.normal.background` | Quando não existe alias Foundation |

Nunca use `brand.*`, `mode.*` ou `surface.*` — essas são camadas internas do pipeline, não fazem parte do contrato público.

---

## CSS (Web)

### Importar o stylesheet do tema

```html
<!-- Opção 1: tag link -->
<link rel="stylesheet" href="./dist/css/aplica_joy-light-positive.css">
```

```javascript
// Opção 2: import via bundler (Vite, Webpack, etc.)
import './dist/css/aplica_joy-light-positive.css';
```

### Usar as variáveis CSS

```css
.button-primary {
  background-color: var(--foundation-bg-primary);
  color:            var(--foundation-txt-on-primary);
  padding:          var(--foundation-spacing-medium);
  border-radius:    var(--foundation-radius-medium);
}

/* Ou com Semantic quando Foundation não cobre o caso */
.custom-element {
  border-color: var(--semantic-color-interface-function-primary-normal-border);
}
```

### Troca de tema em runtime

Os temas CSS são ativados por um atributo `data-theme` — nenhum JavaScript adicional é necessário além de definir o atributo:

```javascript
// Trocar para dark mode
document.documentElement.setAttribute('data-theme', 'aplica_joy-dark-positive');

// Trocar de brand
document.documentElement.setAttribute('data-theme', 'minha_marca-light-positive');
```

Carregue todos os stylesheets de tema que o app suporta e troque entre eles mudando o atributo:

```html
<link rel="stylesheet" href="./dist/css/aplica_joy-light-positive.css">
<link rel="stylesheet" href="./dist/css/aplica_joy-dark-positive.css">
<link rel="stylesheet" href="./dist/css/minha_marca-light-positive.css">
```

---

## ESM — React, Vue, Vite

### Importar tokens como objetos JavaScript

```javascript
// Camada Semantic
import { semantic } from './dist/esm/aplica_joy-light-positive-semantic.mjs';

// Camada Foundation
import { foundation } from './dist/esm/foundation/engine/foundation.mjs';
```

### Exemplo de componente React

```jsx
import { foundation } from '../dist/esm/foundation/engine/foundation.mjs';

export function Button({ children }) {
  return (
    <button
      style={{
        backgroundColor: foundation.bg.primary,
        color:           foundation.txt.onPrimary,
        padding:         foundation.spacing.medium,
        borderRadius:    foundation.radius.medium,
      }}
    >
      {children}
    </button>
  );
}
```

### TypeScript com autocompletar

```typescript
import type { Foundation } from './dist/dts/foundation/engine/foundation.d.ts';
import { foundation } from './dist/esm/foundation/engine/foundation.mjs';

const bg: string = foundation.bg.primary;
```

---

## Next.js

### Estilos globais (App Router)

```typescript
// app/layout.tsx
import '../dist/css/aplica_joy-light-positive.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-theme="aplica_joy-light-positive">
      <body>{children}</body>
    </html>
  );
}
```

### Server components

Variáveis CSS funcionam em server components — não é necessário JavaScript no client para estilizar.

### Troca dinâmica de tema (client component)

```tsx
'use client';
import { useState } from 'react';

export function ThemeSwitcher() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggle = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', `aplica_joy-${next}-positive`);
    setMode(next);
  };

  return <button onClick={toggle}>Alternar para {mode === 'light' ? 'Dark' : 'Light'}</button>;
}
```

---

## React Native

O React Native não suporta CSS custom properties. Use o formato JSON ou ESM e aplique os valores via `StyleSheet.create`:

```javascript
import { foundation } from '../dist/esm/foundation/engine/foundation.mjs';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    backgroundColor: foundation.bg.primary,
    paddingHorizontal: parseInt(foundation.spacing.medium, 10),
    borderRadius:      parseInt(foundation.radius.medium, 10),
  },
  buttonText: {
    color: foundation.txt.onPrimary,
  },
});
```

> **Nota sobre unidades:** Valores ESM incluem o sufixo `px` (`'32px'`). Use `parseInt(value, 10)` ou `parseFloat(value)` ao passar para props de estilo do React Native que esperam números.

---

## Flutter / Dart

Use o formato JSON para carregar tokens no Flutter:

```dart
import 'dart:convert';
import 'package:flutter/services.dart';

Future<Map<String, dynamic>> loadTokens() async {
  final jsonStr = await rootBundle.loadString(
    'assets/tokens/aplica_joy-light-positive-foundation.json'
  );
  return json.decode(jsonStr) as Map<String, dynamic>;
}
```

Adicione o arquivo JSON nos assets do `pubspec.yaml`:

```yaml
flutter:
  assets:
    - assets/tokens/aplica_joy-light-positive-foundation.json
```

---

## CSS puro (sem bundler)

Vincule o CSS diretamente. Todas as variáveis têm escopo em `:root` e `[data-theme]`:

```html
<!DOCTYPE html>
<html data-theme="aplica_joy-light-positive">
<head>
  <link rel="stylesheet" href="dist/css/aplica_joy-light-positive.css">
  <style>
    body {
      background: var(--foundation-bg-page);
      color:      var(--foundation-txt-body);
      font-family: var(--foundation-font-main);
    }
  </style>
</head>
</html>
```

---

## Catálogo de tokens Foundation

A camada Foundation fornece os aliases que a maioria dos componentes de produto precisa. Tokens comuns:

| Token | Propósito |
|-------|-----------|
| `foundation.bg.primary` | Background de ação primária |
| `foundation.bg.secondary` | Background de ação secundária |
| `foundation.bg.page` | Background de página/canvas |
| `foundation.bg.surface` | Superfície de card/painel |
| `foundation.txt.body` | Cor de texto de corpo |
| `foundation.txt.heading` | Cor de texto de título |
| `foundation.txt.onPrimary` | Texto sobre background primário |
| `foundation.txt.muted` | Texto secundário/apagado |
| `foundation.txt.link` | Cor de link |
| `foundation.spacing.nano` | Equivalente a 4px |
| `foundation.spacing.small` | Equivalente a 12–16px |
| `foundation.spacing.medium` | Equivalente a 24–32px |
| `foundation.spacing.large` | Equivalente a 48px |
| `foundation.radius.small` | Border radius pequeno |
| `foundation.radius.medium` | Border radius padrão |
| `foundation.radius.pill` | Radius pill/arredondado |
| `foundation.font.main` | Família de fonte principal |
| `foundation.font.display` | Fonte de display/título |

Quando não existir um alias Foundation para o seu caso, use Semantic diretamente: `semantic.color.interface.function.primary.normal.background`.

---

## Referências

- Formatos de output explicados: [04-theme-engine/05-output-formats.md](../04-theme-engine/05-output-formats.md)
- Entendendo os tokens gerados: [04-understanding-generated-tokens.md](./04-understanding-generated-tokens.md)
- Camada Foundation (conceito): [02-token-layers/05-foundation-layer.md](../02-token-layers/05-foundation-layer.md)
- Camada Semantic (conceito): [02-token-layers/04-semantic-layer.md](../02-token-layers/04-semantic-layer.md)
