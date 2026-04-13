# Por que tokens semânticos economizam tokens de IA

> Argumento reutilizável para landing pages, decks, docs e pitches.

---

## Resumo executivo

O Aplica Theme Engine gera design tokens com uma estrutura semântica de 5 camadas usando um pipeline 100% determinístico — scripts, não LLMs. Isso significa custo zero de IA no build. Quando IA _é_ necessária (para integrar tokens em component libraries, gerar variantes ou adaptar plataformas), a estrutura semântica funciona como um "prompt comprimido": a LLM recebe contexto menor, mais preciso e menos ambíguo — gastando menos tokens e errando menos.

## Os 3 pilares

### 1. Pipeline determinístico (zero custo de IA)

A geração de tokens é feita por scripts puros. Decomposição de paleta em OKLCh, sincronização de camadas, derivação de dark mode — tudo é matemática e templates. Nenhum token de IA é consumido no build. O resultado é previsível e reprodutível.

### 2. Contexto compacto para LLMs

A arquitetura de 5 camadas (Palette → Mode → Surface → Semantic → Foundation) cria um vocabulário fechado e consistente. Quando uma LLM precisa operar sobre o sistema — por exemplo, uma Skill que adapta tokens para Radix ou Base UI — ela recebe um contexto enxuto com nomes que descrevem papel e intenção, não valores arbitrários. Isso reduz drasticamente o número de tokens de entrada necessários.

### 3. Economia dupla

| Dimensão | Sem semântica | Com Aplica DS |
|---|---|---|
| Build de tokens | LLM ou manual | Script determinístico (custo zero) |
| Integração com library | Contexto longo e ambíguo | Contexto compacto de 5 camadas |
| Tokens de IA por prompt | Alto (valores soltos) | Baixo (vocabulário semântico) |
| Retrabalho | Frequente (LLM adivinha) | Raro (contrato claro) |

## Copy pronto para reusar

### PT-BR

**Label:** IA + DESIGN TOKENS

**Título:** Estrutura semântica que economiza tokens de IA

**Parágrafo:** O Theme Engine é 100% determinístico — scripts, não LLMs. Zero custo de IA no build. Quando você precisa de inteligência artificial para integrar, adaptar ou gerar, as Skills do Aplica DS trabalham com um contexto compacto de 5 camadas.

**Bullet 1 — Pipeline sem LLM:** Geração de tokens é scripts puros. Nenhum token de IA consumido no build — custo zero, resultado previsível.

**Bullet 2 — Skills com contexto claro:** A estrutura semântica funciona como prompt comprimido. Menos tokens de IA, prompts mais precisos e menos retrabalho na integração com qualquer component library.

### EN

**Label:** AI + DESIGN TOKENS

**Title:** Semantic structure that saves AI tokens

**Paragraph:** The Theme Engine is 100% deterministic — scripts, not LLMs. Zero AI cost at build time. When you need AI to integrate, adapt or generate, Aplica DS Skills work with a compact 5-layer context.

**Bullet 1 — No-LLM pipeline:** Token generation is pure scripting. Zero AI tokens consumed at build time — no cost, predictable output.

**Bullet 2 — Skills with clear context:** The semantic structure works as a compressed prompt. Fewer AI tokens, more precise prompts and less rework when integrating with any component library.

---

_Aplica DS · MIT License · [github.com/bellentani/aplica-design-tokens](https://github.com/bellentani/aplica-design-tokens)_
