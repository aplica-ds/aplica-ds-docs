import { useState } from "react"

type Lang = "pt-br" | "en"

interface Step {
  layer: string
  token: string
  value: string
  description: string
}

const translations = {
  "pt-br": {
    title: "Resolução de Tokens",
    subtitle:
      "Veja como uma única solicitação de token percorre as cinco camadas, resolvendo automaticamente para o valor correto do contexto do tema.",
    tracerLabel: "Rastreador de Caminho de Token",
    traceBtn: "Rastrear Resolução",
    resetBtn: "Resetar",
    previewLabel: "Visualização ao Vivo",
    finalLabel: "Valor Final:",
    resolvedText: "Resolvido!",
    resolvingText: "Resolvendo...",
    steps: [
      "Camada Foundation referencia token semântico",
      "Camada Semantic adiciona significado contextual",
      "Camada Surface aplica contexto de elevação",
      "Camada Mode ajusta para claro / escuro",
      "Camada Brand fornece o valor final da cor",
    ],
  },
  en: {
    title: "Token Resolution",
    subtitle:
      "Watch how a single token request cascades through all five layers, automatically resolving to the correct value for the current theme context.",
    tracerLabel: "Token Path Tracer",
    traceBtn: "Trace Resolution",
    resetBtn: "Reset",
    previewLabel: "Live Preview",
    finalLabel: "Final Value:",
    resolvedText: "Resolved!",
    resolvingText: "Resolving...",
    steps: [
      "Foundation layer references semantic token",
      "Semantic layer adds contextual meaning",
      "Surface layer applies elevation context",
      "Mode layer adjusts for light / dark",
      "Brand layer provides the final color value",
    ],
  },
}

const FINAL_COLOR = "#FF6B35"
const UNRESOLVED_COLOR = "#94a3b8"

const RESOLUTION_STEPS: Array<{ layer: string; token: string; value: string }> = [
  { layer: "Foundation", token: "foundation.bg.primary",   value: "var(--semantic-bg-primary)" },
  { layer: "Semantic",   token: "semantic.bg.primary",     value: "var(--surface-bg-brand-primary)" },
  { layer: "Surface",    token: "surface.bg.brand.primary",value: "var(--mode-bg-brand-primary)" },
  { layer: "Mode",       token: "mode.bg.brand.primary",   value: "var(--brand-primary-500)" },
  { layer: "Brand",      token: "brand.primary.500",       value: FINAL_COLOR },
]

interface Props {
  lang?: Lang
}

export function TokenResolution({ lang = "pt-br" }: Props) {
  const [currentStep, setCurrentStep] = useState(-1)
  const [isAnimating, setIsAnimating] = useState(false)
  const t = translations[lang]

  const isResolved = currentStep >= RESOLUTION_STEPS.length - 1
  const previewColor = isResolved ? FINAL_COLOR : UNRESOLVED_COLOR

  const startAnimation = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentStep(0)

    let step = 0
    const interval = setInterval(() => {
      step += 1
      setCurrentStep(step)
      if (step >= RESOLUTION_STEPS.length - 1) {
        clearInterval(interval)
        setIsAnimating(false)
      }
    }, 750)
  }

  const resetAnimation = () => {
    setCurrentStep(-1)
    setIsAnimating(false)
  }

  const btnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
    padding: "0.5rem 1rem",
    borderRadius: "var(--radius)",
    fontWeight: 600,
    fontSize: "0.875rem",
    cursor: "pointer",
    border: "none",
    transition: "opacity 0.15s",
  }

  return (
    <section style={{ padding: "5rem 0" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
              fontWeight: 700,
              marginBottom: "0.75rem",
              color: "var(--color-text)",
            }}
          >
            {t.title}
          </h2>
          <p
            style={{
              fontSize: "1.0625rem",
              color: "var(--color-text-muted)",
              maxWidth: "560px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            {t.subtitle}
          </p>
        </div>

        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div
            style={{
              background: "linear-gradient(135deg, var(--color-bg-card), var(--color-bg-subtle))",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              className="token-resolution-inner"
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
              {/* Left: tracer */}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: "1.25rem" }}>
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "var(--color-text)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {t.tracerLabel}
                  </h3>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" as const }}>
                    <button
                      style={{
                        ...btnStyle,
                        background: isAnimating ? "var(--color-bg-subtle)" : "var(--gradient-primary)",
                        color: isAnimating ? "var(--color-text-muted)" : "#fff",
                        opacity: isAnimating ? 0.6 : 1,
                        cursor: isAnimating ? "not-allowed" : "pointer",
                      }}
                      onClick={startAnimation}
                      disabled={isAnimating}
                    >
                      {/* Play icon */}
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                        <path d="M3 2l9 5-9 5V2z" />
                      </svg>
                      {t.traceBtn}
                    </button>
                    <button
                      style={{
                        ...btnStyle,
                        background: "transparent",
                        color: "var(--color-text-muted)",
                        border: "1.5px solid var(--color-border)",
                      }}
                      onClick={resetAnimation}
                    >
                      {/* Reset icon */}
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M1 4a6 6 0 1 1 0 6" />
                        <path d="M1 1v3h3" />
                      </svg>
                      {t.resetBtn}
                    </button>
                  </div>
                </div>

                {/* Steps */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {RESOLUTION_STEPS.map((step, idx) => {
                    const isActive = currentStep >= idx
                    return (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.875rem",
                          padding: "0.875rem 1rem",
                          borderRadius: "var(--radius)",
                          border: isActive
                            ? "1.5px solid rgba(249,115,22,0.25)"
                            : "1.5px solid transparent",
                          background: isActive ? "rgba(249,115,22,0.05)" : "var(--color-bg-subtle)",
                          transition: "all 0.4s ease",
                        }}
                      >
                        {/* Step number */}
                        <div
                          style={{
                            width: "1.875rem",
                            height: "1.875rem",
                            borderRadius: "50%",
                            background: isActive ? "var(--gradient-primary)" : "var(--color-border)",
                            color: isActive ? "#fff" : "var(--color-text-muted)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "0.8125rem",
                            flexShrink: 0,
                            transition: "background 0.4s",
                          }}
                        >
                          {idx + 1}
                        </div>

                        {/* Token path */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color: isActive ? "var(--color-text)" : "var(--color-text-muted)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {step.token}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--color-text-muted)",
                              marginTop: "0.1rem",
                            }}
                          >
                            {t.steps[idx]}
                          </div>
                        </div>

                        {/* Arrow */}
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="currentColor"
                          style={{
                            color: isActive ? "var(--color-accent)" : "var(--color-border)",
                            transition: "color 0.4s",
                            flexShrink: 0,
                          }}
                        >
                          <path d="M1 7h10M7 3l4 4-4 4" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        {/* Value pill */}
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.7rem",
                            padding: "0.25rem 0.625rem",
                            borderRadius: "var(--radius-full)",
                            background: isActive ? "var(--gradient-primary)" : "var(--color-border)",
                            color: isActive ? "#fff" : "var(--color-text-muted)",
                            flexShrink: 0,
                            maxWidth: "11rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            transition: "background 0.4s, color 0.4s",
                          }}
                          title={step.value}
                        >
                          {step.value}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right: live preview */}
              <div>
                <h4
                  style={{
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "var(--color-text)",
                    marginBottom: "0.875rem",
                  }}
                >
                  {t.previewLabel}
                </h4>

                <div
                  style={{
                    width: "100%",
                    height: "7rem",
                    borderRadius: "var(--radius)",
                    background: previewColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1rem",
                    transition: "background 0.5s ease",
                    marginBottom: "1rem",
                    letterSpacing: "0.01em",
                  }}
                >
                  {isResolved ? t.resolvedText : t.resolvingText}
                </div>

                <div
                  style={{
                    padding: "0.875rem 1rem",
                    background: "var(--color-bg-subtle)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-muted)",
                      marginBottom: "0.375rem",
                    }}
                  >
                    {t.finalLabel}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      color: isResolved ? FINAL_COLOR : "var(--color-text-muted)",
                      transition: "color 0.4s",
                    }}
                  >
                    {isResolved ? FINAL_COLOR : "var(--resolving)"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .token-resolution-inner {
            flex-direction: row !important;
          }
          .token-resolution-inner > div:last-child {
            width: 220px;
            flex-shrink: 0;
          }
        }
      `}</style>
    </section>
  )
}