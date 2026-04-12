---
level: n2
id: N2-05
title: "Product colors — responsible growth"
prerequisites: ["N2-01", "N2-03"]
duration: "10 min"
lang: en
---

# N2-05 · Product Colors — Responsible Growth

## Context

You are in a refinement session. The product team wants a new visual badge to indicate "Cashback Plus" — different from regular cashback, with a more intense golden color. Seems simple. "It's just one more color."

This tutorial explains why "it's just one more color" is one of the most expensive phrases in systems design.

---

## Concept

### What the Product layer is

Most system colors have universal roles: primary, secondary, info, success, warning, danger. Any product of any brand uses these roles in the same way.

But some business contexts need colors that do not exist in the universal vocabulary. Promotions, cashback, subscription tiers, thematic categories — these needs are unpredictable and specific to each product.

For this, the subcategory `semantic.color.product.*` exists. It is the only area of Semantic where product teams can add items freely.

### The cost of each item

Here is what happens when you add a product item — for example, `promo_extended`:

**1. The item is declared in the architecture schema**
**2. Every registered theme needs to configure the color for this item**
**3. The engine decomposes the color into the full taxonomy:**

```
promo_extended
  ├── default
  │   ├── lowest  → background + txtOn + border  (3 tokens)
  │   ├── low     → background + txtOn + border  (3 tokens)
  │   ├── default → background + txtOn + border  (3 tokens)
  │   ├── high    → background + txtOn + border  (3 tokens)
  │   └── highest → background + txtOn + border  (3 tokens)
  └── secondary
      ├── lowest  → background + txtOn + border  (3 tokens)
      ├── low     → background + txtOn + border  (3 tokens)
      ├── default → background + txtOn + border  (3 tokens)
      ├── high    → background + txtOn + border  (3 tokens)
      └── highest → background + txtOn + border  (3 tokens)
```

**30 tokens per item.** And those 30 tokens exist in every theme in the system.

| System with | 1 Product item | +1 item | +5 items |
|-------------|---------------|---------|---------|
| 2 themes | 60 tokens | 120 tokens | 300 tokens |
| 4 themes | 120 tokens | 240 tokens | 600 tokens |
| 8 themes | 240 tokens | 480 tokens | 1,200 tokens |

And this is just for the Semantic layer. Each token propagates through Mode, Surface, and Foundation — multiplying the impact.

### Why this matters beyond the number

**Performance:** More CSS variables in the browser. More tokens in the Figma JSON. Larger files, slower builds, slower Figma loading.

**Cognitive complexity:** Every product item a system designer adds is an item that product designers need to learn, understand, and use correctly. The more items, the more wrong decisions.

**Entropy:** Tokens nobody uses are the worst kind of technical debt — they are everywhere, nobody knows if they are needed, nobody has the courage to remove them.

---

### The mandatory question

Before any new Product item, ask this question in three steps:

**Step 1:** "Can this be solved with an existing Feedback token?"
- `danger` is not only for errors — it can mean "maximum attention," "destructive action," "prohibited"
- `warning` is not only for alerts — it can mean "caution," "limited," "at risk"

**Step 2:** "Can this be solved with an existing Brand variant?"
- `brand.branding.first.high` (dark tone of the primary color) — is it different enough?
- `brand.branding.second` (the brand's second color) — does it not work?

**Step 3:** "Does this badge/signal truly need a new color, or do I need a different typographic treatment?"

If you answered "no" to all three steps, then a Product item can be added — with documentation of the justification.

---

## Guided example

### Three scenarios — decision tree

**Scenario A:** "New" badge in bright green

*Analysis:* `feedback.success` exists. Success is green by default. If the current `success.secondary` color is close to what is needed, use it. If the exact color matters for product identity, use `brand.branding.second` or `brand.branding.third`.

*Decision:* Use `feedback.success.secondary` or a brand variant. **No Product item.**

---

**Scenario B:** Golden "Cashback" badge — specific yellow color of the brand

*Analysis:* Yellow/golden does not exist in any universal role. It is not feedback. It is not the company's brand (the brand is blue). It is a genuinely new product concept.

*Decision:* Add item `cashback` with the golden color. **Product item justified.**

*Cost to document:* 30 tokens × number of themes. Confirmed with the team before adding.

---

**Scenario C:** Three tier badge variations: "Silver," "Gold," "Diamond"

*Analysis:* Three tiers = 3 items × 30 tokens × 4 themes = 360 tokens. Before adding all three, ask: do they need independent colors? "Silver" can be the system grayscale. "Gold" can be `cashback` (if it already exists). "Diamond" can be `brand.branding.third`.

*Decision:* Reuse what exists for Silver and Diamond. Add only `gold` if the golden color does not yet exist. **Maximum 1 Product item, not 3.**

---

## Now you try

A product manager requests four new product items for a store: `promo`, `flash_sale`, `limited`, `exclusive`.

Before adding any of them, run the analysis:

1. `promo` — Generic promotion. Bright green desired.
2. `flash_sale` — Flash sale. Vibrant orange. "Urgency."
3. `limited` — Limited edition. Golden. "Scarcity, premium."
4. `exclusive` — Members-only exclusive. Purple. Different from brand color (which is blue).

**Expected result:**

| Item | Decision | Justification |
|------|----------|---------------|
| `promo` | Use `feedback.success` | Green already exists as success |
| `flash_sale` | Use `feedback.warning` | Orange/urgency = warning |
| `limited` | Add `cashback` (if it doesn't exist) or reuse | Golden has no universal equivalent |
| `exclusive` | Add `premium` | Purple different from brand = legitimate Product item |

Of 4 requests, 2 resolved at no additional cost, 1 potentially reusable, 1 genuinely new.

---

## Checkpoint

By the end of this tutorial you should know:

- [ ] What the Product subcategory is and why it is the only free area in Semantic
- [ ] The cost calculation: 1 item = minimum 30 tokens × number of themes
- [ ] The mandatory 3-step question before adding any item
- [ ] Distinguishing cases that reuse the system from those that genuinely need a new item
- [ ] Documenting the justification when a Product item is added

---

## Next step

[N2-06 · Responsible overrides — when and how to use them](./06-overrides-responsaveis.md)

Even with a well-designed system, there will be cases where the default behavior does not fit. When that happens, there is a correct way to override — and many wrong ways.

---

## References

- Semantic layer — Product section: [04-semantic-layer.md](../../02-token-layers/04-semantic-layer.md)
- Exponential cost: [01-aplica-ds-vision.md](../../00-overview/01-aplica-ds-vision.md)
- Product color configuration: [03-configuration-guide.md](../../04-theme-engine/03-configuration-guide.md#product-colors)
