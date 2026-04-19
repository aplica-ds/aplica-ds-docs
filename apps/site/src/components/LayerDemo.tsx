import { useState } from "react";
import { ExternalLink } from "lucide-react";

type Lang = "pt-br" | "en";

interface Layer {
  name: string;
  desc: string;
  example: string;
  docsPath: string;
}

const LAYER_COLORS: Array<{ from: string; to: string }> = [
  { from: "#f97316", to: "#fb923c" },  // orange  — Brand
  { from: "#3b82f6", to: "#60a5fa" },  // blue    — Mode
  { from: "#10b981", to: "#34d399" },  // green   — Surface
  { from: "#8b5cf6", to: "#a78bfa" },  // purple  — Semantic
  { from: "#ec4899", to: "#f472b6" },  // pink    — Foundation
];

const DOCS_BASE = "https://docs.aplica.me";
const DOCS_BASE_EN = "https://docs.aplica.me/en-US";

const LAYER_DOCS = [
  "token-layers/brand-layer",
  "token-layers/mode-layer",
  "token-layers/surface-layer",
  "token-layers/semantic-layer",
  "token-layers/foundation-layer",
];

const translations: Record<Lang, { title: string; subtitle: string; preview: string; explore: string; layers: Layer[] }> = {
  "pt-br": {
    title: "Arquitetura de 5 Camadas",
    subtitle:
      "Cada camada tem uma responsabilidade única. Trocar uma marca não afeta a semântica. Trocar o modo não afeta a estrutura.",
    preview: "Visualização da Camada",
    explore: "Explorar camada",
    layers: [
      {
        name: "Brand",
        desc: "Identidade visual — paleta de cores e tipografia da marca",
        example: `// data/brand/aplica_tangerine/_brand.json
theme.color.light.brand.branding.first.lowest.background:              "#FFAE03"
brand.color.palette.100:              "#FFEC91"
brand.typography.fontFamilies.main:   "Sansita"
brand.typography.fontFamilies.mono:   "Roboto Mono"`,
        docsPath: LAYER_DOCS[0],
      },
      {
        name: "Mode",
        desc: "Light / Dark — inversão perceptual via OKLCh",
        example: `// data/mode/light.json
mode.interface.positive.branding
  .first.default.background:
    → theme.color.light.brand.branding.first.lowest.background

// Algoritmo de inversão (dark):
dark[N] = light[20 − N]`,
        docsPath: LAYER_DOCS[1],
      },
      {
        name: "Surface",
        desc: "Positive / Negative — contexto de fundo da superfície",
        example: `// data/surface/positive.json
surface.color.brand.branding
  .first.default.background:
    → mode.interface.positive
        .branding.first.default.background

// negative → inverte o contexto de contraste`,
        docsPath: LAYER_DOCS[2],
      },
      {
        name: "Semantic",
        desc: "Tokens com propósito — não cor, mas papel",
        example: `// data/semantic/default.json
semantic.color.brand.branding
  .first.default.background:
    → surface.color.brand.branding
        .first.default.background
    // "Fundo primário da marca — CTAs e surfaces"

semantic.color.brand.branding.first.default.txtOn
semantic.color.brand.branding.first.default.border`,
        docsPath: LAYER_DOCS[3],
      },
      {
        name: "Foundation",
        desc: "Aliases curtos — redução de carga cognitiva para times de produto",
        example: `// data/foundation/engine/default.json
foundation.bg.brand.default:
  → semantic.color.brand.branding
      .first.default.background

foundation.txt.title:
  → semantic.color.text.title

foundation.spacing.medium:
  → semantic.dimension.spacing.medium`,
        docsPath: LAYER_DOCS[4],
      },
    ],
  },
  en: {
    title: "5-Layer Architecture",
    subtitle:
      "Each layer has a single responsibility. Swapping a brand doesn't affect semantics. Swapping a mode doesn't affect structure.",
    preview: "Layer Preview",
    explore: "Explore layer",
    layers: [
      {
        name: "Brand",
        desc: "Visual identity — color palette and typography",
        example: `// data/brand/aplica_tangerine/_brand.json
theme.color.light.brand.branding.first.lowest.background:              "#FFAE03"
brand.color.palette.100:              "#FFEC91"
brand.typography.fontFamilies.main:   "Sansita"
brand.typography.fontFamilies.mono:   "Roboto Mono"`,
        docsPath: LAYER_DOCS[0],
      },
      {
        name: "Mode",
        desc: "Light / Dark — perceptual inversion via OKLCh",
        example: `// data/mode/light.json
mode.interface.positive.branding
  .first.default.background:
    → theme.color.light.brand.branding.first.lowest.background

// Dark mode inversion algorithm:
dark[N] = light[20 − N]`,
        docsPath: LAYER_DOCS[1],
      },
      {
        name: "Surface",
        desc: "Positive / Negative — surface background context",
        example: `// data/surface/positive.json
surface.color.brand.branding
  .first.default.background:
    → mode.interface.positive
        .branding.first.default.background

// negative → inverts the contrast context`,
        docsPath: LAYER_DOCS[2],
      },
      {
        name: "Semantic",
        desc: "Purpose-driven tokens — not a color, but a role",
        example: `// data/semantic/default.json
semantic.color.brand.branding
  .first.default.background:
    → surface.color.brand.branding
        .first.default.background
    // "Primary brand bg — for CTAs and surfaces"

semantic.color.brand.branding.first.default.txtOn
semantic.color.brand.branding.first.default.border`,
        docsPath: LAYER_DOCS[3],
      },
      {
        name: "Foundation",
        desc: "Short aliases — cognitive load reduction for product teams",
        example: `// data/foundation/engine/default.json
foundation.bg.brand.default:
  → semantic.color.brand.branding
      .first.default.background

foundation.txt.title:
  → semantic.color.text.title

foundation.spacing.medium:
  → semantic.dimension.spacing.medium`,
        docsPath: LAYER_DOCS[4],
      },
    ],
  },
};

interface Props {
  lang?: Lang;
}

export function LayerDemo({ lang = "pt-br" }: Props) {
  const [activeLayer, setActiveLayer] = useState(0);
  const [mobileOpen, setMobileOpen] = useState<number | null>(0);
  const t = translations[lang];
  const active = t.layers[activeLayer];
  const color = LAYER_COLORS[activeLayer];
  const gradient = `linear-gradient(135deg, ${color.from}, ${color.to})`;
  const docsBase = lang === "en" ? DOCS_BASE_EN : DOCS_BASE;
  const exploreUrl = `${docsBase}/${active.docsPath}`;

  const s = {
    section: { padding: "5rem 0" } as React.CSSProperties,
    heading: { textAlign: "center", marginBottom: "4rem" } as React.CSSProperties,
    h2: {
      fontFamily: "var(--font-display)",
      fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
      fontWeight: 700,
      marginBottom: "0.75rem",
      color: "var(--color-text)",
    } as React.CSSProperties,
    subtitle: {
      fontSize: "1.0625rem",
      color: "var(--color-text-muted)",
      maxWidth: "560px",
      margin: "0 auto",
      lineHeight: 1.7,
    } as React.CSSProperties,
    grid: {
      display: "grid",
      gap: "2rem",
      maxWidth: "960px",
      width: "100%",
      margin: "0 auto",
    } as React.CSSProperties,
    layerList: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "0.75rem",
      minWidth: 0,
    } as React.CSSProperties,
    layerCard: (isActive: boolean): React.CSSProperties => ({
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "1rem 1.25rem",
      background: "var(--color-bg-card)",
      border: isActive
        ? `1.5px solid ${LAYER_COLORS[activeLayer].from}`
        : "1.5px solid var(--color-border)",
      borderRadius: "var(--radius)",
      cursor: "pointer",
      boxShadow: isActive
        ? `0 0 0 3px ${LAYER_COLORS[activeLayer].from}22, var(--shadow-md)`
        : "var(--shadow-sm)",
      transform: isActive ? "scale(1.01)" : "scale(1)",
      transition: "all 0.2s ease",
    }),
    layerNumber: (isActive: boolean, layerIdx: number): React.CSSProperties => ({
      width: "2.25rem",
      height: "2.25rem",
      borderRadius: "0.5rem",
      background: isActive
        ? `linear-gradient(135deg, ${LAYER_COLORS[layerIdx].from}, ${LAYER_COLORS[layerIdx].to})`
        : "var(--color-bg-subtle)",
      color: isActive ? "#fff" : "var(--color-text-muted)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: "0.875rem",
      flexShrink: 0,
      transition: "background 0.2s",
    }),
    layerInfo: { flex: 1 } as React.CSSProperties,
    layerName: {
      fontWeight: 600,
      fontSize: "0.9375rem",
      color: "var(--color-text)",
    } as React.CSSProperties,
    layerDesc: {
      fontSize: "0.8125rem",
      color: "var(--color-text-muted)",
      marginTop: "0.1rem",
    } as React.CSSProperties,
    chevron: (isActive: boolean): React.CSSProperties => ({
      width: "1.25rem",
      height: "1.25rem",
      color: isActive ? LAYER_COLORS[activeLayer].from : "var(--color-text-muted)",
      transition: "transform 0.2s",
      transform: isActive ? "rotate(90deg)" : "rotate(0deg)",
      flexShrink: 0,
    }),
    preview: {
      background: "linear-gradient(135deg, var(--color-bg-card), var(--color-bg-subtle))",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      padding: "1.5rem",
      boxShadow: "var(--shadow-sm)",
      display: "flex",
      flexDirection: "column" as const,
      minWidth: 0,
    } as React.CSSProperties,
    previewHeader: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "1.25rem",
    } as React.CSSProperties,
    previewSwatch: {
      width: "100%",
      height: "6rem",
      borderRadius: "var(--radius)",
      background: gradient,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: 700,
      fontSize: "1.125rem",
      marginBottom: "1rem",
      transition: "background 0.4s ease",
      letterSpacing: "0.01em",
    } as React.CSSProperties,
    codeBlock: {
      background: "#1e1e2e",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "var(--radius-sm)",
      padding: "0.875rem 1rem",
      fontFamily: "var(--font-mono)",
      fontSize: "0.7375rem",
      color: "#cdd6f4",
      lineHeight: 1.65,
      overflowX: "auto" as const,
      maxWidth: "100%",
      marginBottom: "1rem",
      whiteSpace: "pre-wrap",
      wordBreak: "break-all",
      flex: 1,
    } as React.CSSProperties,
  };

  return (
    <section id="layer-demo" style={s.section}>
      <div className="container">
        <div style={s.heading}>
          <h2 style={s.h2}>{t.title}</h2>
          <p style={s.subtitle}>{t.subtitle}</p>
        </div>

        <div className="layer-demo-grid layer-demo-desktop" style={s.grid}>
          {/* Layer list */}
          <div style={s.layerList}>
            {t.layers.map((layer, idx) => (
              <div
                key={layer.name}
                style={s.layerCard(activeLayer === idx)}
                onClick={() => setActiveLayer(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setActiveLayer(idx)}
              >
                <div style={s.layerNumber(activeLayer === idx, idx)}>{idx + 1}</div>
                <div style={s.layerInfo}>
                  <div style={s.layerName}>{layer.name}</div>
                  <div style={s.layerDesc}>{layer.desc}</div>
                </div>
                <svg style={s.chevron(activeLayer === idx)} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </div>
            ))}
          </div>

          {/* Preview panel */}
          <div style={s.preview}>
            <div style={s.previewHeader}>
              <svg
                style={{ width: "1.125rem", height: "1.125rem", color: "var(--color-accent)" }}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-text)" }}>
                {t.preview}
              </span>
            </div>

            <div style={s.previewSwatch}>{active.name}</div>

            <div style={s.codeBlock}>{active.example}</div>

            <a
              href={exploreUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.375rem",
                width: "100%",
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius)",
                border: `1.5px solid ${color.from}44`,
                background: `${color.from}08`,
                color: color.from,
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = `${color.from}15`;
                (e.currentTarget as HTMLAnchorElement).style.borderColor = color.from;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = `${color.from}08`;
                (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color.from}44`;
              }}
            >
              {t.explore} {active.name}
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Mobile accordion — hidden on desktop */}
        <div className="layer-demo-mobile" style={{ display: "none", flexDirection: "column" }}>
          {t.layers.map((layer, idx) => {
            const isOpen = mobileOpen === idx;
            const c = LAYER_COLORS[idx];
            const grad = `linear-gradient(135deg, ${c.from}, ${c.to})`;
            const url = `${docsBase}/${layer.docsPath}`;
            return (
              <div key={layer.name} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <button
                  onClick={() => setMobileOpen(isOpen ? null : idx)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.875rem", padding: "1rem 0", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  <div style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: isOpen ? grad : "var(--color-bg-subtle)", color: isOpen ? "#fff" : "var(--color-text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8125rem", flexShrink: 0, transition: "background 0.2s" }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--color-text)" }}>{layer.name}</div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginTop: "0.1rem" }}>{layer.desc}</div>
                  </div>
                  <svg style={{ width: "1.125rem", height: "1.125rem", color: isOpen ? c.from : "var(--color-text-muted)", transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", flexShrink: 0 }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
                {isOpen && (
                  <div style={{ paddingBottom: "1.25rem" }}>
                    <div style={{ width: "100%", height: "3.5rem", borderRadius: "var(--radius)", background: grad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "1rem", marginBottom: "0.875rem" }}>
                      {layer.name}
                    </div>
                    <div style={{ background: "#1e1e2e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "var(--radius-sm)", padding: "0.75rem 0.875rem", fontFamily: "var(--font-mono)", fontSize: "0.6875rem", color: "#cdd6f4", lineHeight: 1.65, overflowX: "auto", maxWidth: "100%", marginBottom: "0.875rem", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                      {layer.example}
                    </div>
                    <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", width: "100%", padding: "0.5rem 1rem", borderRadius: "var(--radius)", border: `1.5px solid ${c.from}44`, background: `${c.from}08`, color: c.from, fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}>
                      {t.explore} {layer.name}
                      <ExternalLink size={13} />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>  {/* end .container */}

      <style>{`
        @media (min-width: 768px) {
          .layer-demo-grid { grid-template-columns: 1fr 1fr !important; }
          .layer-demo-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .layer-demo-desktop { display: none !important; }
          .layer-demo-mobile { display: flex !important; flex-direction: column; }
        }
      `}</style>
    </section>
  );
}