import { useState } from "react"

type Lang = "pt-br" | "en"

interface Layer {
  name: string
  desc: string
  example: string
}

const translations: Record<Lang, { title: string; subtitle: string; preview: string; explore: string; layers: Layer[] }> = {
  "pt-br": {
    title: "Arquitetura de 5 Camadas",
    subtitle:
      "Cada camada tem uma responsabilidade única. Trocar uma marca não afeta a semântica. Trocar o modo não afeta a estrutura.",
    preview: "Visualização da Camada",
    explore: "Explorar camada",
    layers: [
      { name: "Brand",      desc: "Identidade visual e paleta da marca",          example: 'tangerine: { primary: "#FF6B35", secondary: "#F7931E" }' },
      { name: "Mode",       desc: "Light / Dark — inversão perceptual OKLCh",     example: 'light: { contrast: "high", luminance: "bright" }' },
      { name: "Surface",    desc: "Positive / Negative — tratamento de superfície", example: 'positive: { elevation: "raised", emphasis: "primary" }' },
      { name: "Semantic",   desc: "Tokens com significado contextual",             example: 'success: { intent: "positive", action: "confirm" }' },
      { name: "Foundation", desc: "Aliases simples prontos para uso no produto",   example: 'bg.primary: "var(--color-orange-500)"' },
    ],
  },
  en: {
    title: "5-Layer Architecture",
    subtitle:
      "Each layer has a unique responsibility. Swapping a brand doesn't affect semantics. Swapping a mode doesn't affect structure.",
    preview: "Layer Preview",
    explore: "Explore layer",
    layers: [
      { name: "Brand",      desc: "Brand visual identity and color palette",       example: 'tangerine: { primary: "#FF6B35", secondary: "#F7931E" }' },
      { name: "Mode",       desc: "Light / Dark — perceptual OKLCh inversion",     example: 'light: { contrast: "high", luminance: "bright" }' },
      { name: "Surface",    desc: "Positive / Negative — surface treatment",       example: 'positive: { elevation: "raised", emphasis: "primary" }' },
      { name: "Semantic",   desc: "Tokens with contextual meaning",                example: 'success: { intent: "positive", action: "confirm" }' },
      { name: "Foundation", desc: "Simple aliases ready for product use",          example: 'bg.primary: "var(--color-orange-500)"' },
    ],
  },
}

const LAYER_COLORS: Array<{ from: string; to: string }> = [
  { from: "#f97316", to: "#fb923c" },  // orange  — Brand
  { from: "#3b82f6", to: "#60a5fa" },  // blue    — Mode
  { from: "#10b981", to: "#34d399" },  // green   — Surface
  { from: "#8b5cf6", to: "#a78bfa" },  // purple  — Semantic
  { from: "#ec4899", to: "#f472b6" },  // pink    — Foundation
]

interface Props {
  lang?: Lang
}

export function LayerDemo({ lang = "pt-br" }: Props) {
  const [activeLayer, setActiveLayer] = useState(0)
  const t = translations[lang]
  const active = t.layers[activeLayer]
  const color = LAYER_COLORS[activeLayer]
  const gradient = `linear-gradient(135deg, ${color.from}, ${color.to})`

  const s = {
    section: {
      padding: "5rem 0",
    } as React.CSSProperties,
    heading: {
      textAlign: "center",
      marginBottom: "4rem",
    } as React.CSSProperties,
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
      margin: "0 auto",
    } as React.CSSProperties,
    layerList: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "0.75rem",
    } as React.CSSProperties,
    layerCard: (isActive: boolean): React.CSSProperties => ({
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "1rem 1.25rem",
      background: "var(--color-bg-card)",
      border: isActive ? `1.5px solid ${LAYER_COLORS[activeLayer].from}` : "1.5px solid var(--color-border)",
      borderRadius: "var(--radius)",
      cursor: "pointer",
      boxShadow: isActive ? `0 0 0 3px ${LAYER_COLORS[activeLayer].from}22, var(--shadow-md)` : "var(--shadow-sm)",
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
    layerInfo: {
      flex: 1,
    } as React.CSSProperties,
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
    } as React.CSSProperties,
    previewHeader: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "1.25rem",
    } as React.CSSProperties,
    previewEye: {
      width: "1.125rem",
      height: "1.125rem",
      color: "var(--color-accent)",
    } as React.CSSProperties,
    previewLabel: {
      fontWeight: 600,
      fontSize: "0.875rem",
      color: "var(--color-text)",
    } as React.CSSProperties,
    previewSwatch: {
      width: "100%",
      height: "7rem",
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
      background: "var(--color-bg-subtle)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-sm)",
      padding: "0.875rem 1rem",
      fontFamily: "var(--font-mono)",
      fontSize: "0.8rem",
      color: "var(--color-text-muted)",
      lineHeight: 1.6,
      overflowX: "auto" as const,
      marginBottom: "1rem",
      whiteSpace: "pre",
    } as React.CSSProperties,
    exploreBtn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      padding: "0.5rem 1rem",
      borderRadius: "var(--radius)",
      border: "1.5px solid var(--color-border)",
      background: "transparent",
      color: "var(--color-text)",
      fontWeight: 600,
      fontSize: "0.875rem",
      cursor: "pointer",
      transition: "border-color 0.2s, color 0.2s",
    } as React.CSSProperties,
  }

  return (
    <section style={s.section}>
      <div className="container">
        <div style={s.heading}>
          <h2 style={s.h2}>{t.title}</h2>
          <p style={s.subtitle}>{t.subtitle}</p>
        </div>

        <div className="layer-demo-grid" style={s.grid}>
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
                <div style={s.layerNumber(activeLayer === idx, idx)}>
                  {idx + 1}
                </div>
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
              <svg style={s.previewEye} viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span style={s.previewLabel}>{t.preview}</span>
            </div>

            <div style={s.previewSwatch}>
              {active.name}
            </div>

            <div style={s.codeBlock}>{active.example}</div>

            <button
              style={s.exploreBtn}
              onMouseEnter={(e) => {
                ;(e.target as HTMLButtonElement).style.borderColor = color.from
                ;(e.target as HTMLButtonElement).style.color = color.from
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLButtonElement).style.borderColor = "var(--color-border)"
                ;(e.target as HTMLButtonElement).style.color = "var(--color-text)"
              }}
            >
              {t.explore} {active.name}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive 2-col on larger screens */}
      <style>{`
        @media (min-width: 768px) {
          .layer-demo-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}