import { useState } from "react";
import { Play, RotateCcw, ArrowRight } from "lucide-react";

type Lang = "pt-br" | "en";

const BRAND_COLORS: Record<string, string> = {
  tangerine: "#FFAE03",
  joy:       "#e7398a",
  grinch:    "#58bd59",
  blue_sky:  "#265ed9",
};

const BRAND_LABELS: Record<string, string> = {
  tangerine: "Tangerine",
  joy:       "Joy",
  grinch:    "Grinch",
  blue_sky:  "Blue Sky",
};

// Layer colors matching LayerDemo.tsx palette
const LAYER_COLORS: Record<string, string> = {
  Foundation: "#ec4899", // pink
  Semantic:   "#8b5cf6", // purple
  Surface:    "#10b981", // green
  Mode:       "#3b82f6", // blue
  Brand:      "#f97316", // orange
};

// Full 5-layer resolution chain — same path for all brands, only final value differs
const RESOLUTION_STEPS = (brandLabel: string, finalColor: string) => [
  {
    layer: "Foundation",
    token: "foundation.bg.brand.default",
    value: "→ semantic.color...",
    desc_ptbr: "Alias curto para times de produto",
    desc_en:   "Short alias for product teams",
  },
  {
    layer: "Semantic",
    token: "semantic.color.brand.branding\n  .first.default.background",
    value: "→ surface.color...",
    desc_ptbr: "Token com propósito — não cor, mas papel",
    desc_en:   "Purpose token — not a color, but a role",
  },
  {
    layer: "Surface",
    token: "surface.color.brand.branding\n  .first.default.background",
    value: "→ mode.interface...",
    desc_ptbr: "Contexto de superfície: positive / negative",
    desc_en:   "Surface context: positive / negative",
  },
  {
    layer: "Mode",
    token: "mode.interface.positive.branding\n  .first.default.background",
    value: "→ brand.color.palette.500",
    desc_ptbr: "Contexto de luminosidade: light / dark",
    desc_en:   "Luminosity context: light / dark",
  },
  {
    layer: "Brand",
    token: "brand.color.palette.500",
    value: finalColor,
    desc_ptbr: `Valor primitivo da marca ${brandLabel}`,
    desc_en:   `Primitive value for ${brandLabel} brand`,
  },
];

const translations = {
  "pt-br": {
    title: "O mesmo token. 4 resoluções diferentes.",
    subtitle:
      "foundation.bg.brand.default aponta sempre para o mesmo caminho. O valor final muda conforme a marca ativa — sem alterar nenhum componente.",
    tracerLabel: "Cadeia de resolução",
    traceBtn: "Rastrear",
    resetBtn: "Resetar",
    previewLabel: "Valor resolvido",
    finalLabel: "Valor final:",
    resolvedText: "Resolvido!",
    resolvingText: "Resolvendo...",
    brandLabel: "Marca ativa",
    descKey: "desc_ptbr" as const,
  },
  en: {
    title: "Same token. 4 different resolutions.",
    subtitle:
      "foundation.bg.brand.default always points to the same path. The final value changes with the active brand — without touching any component.",
    tracerLabel: "Resolution chain",
    traceBtn: "Trace",
    resetBtn: "Reset",
    previewLabel: "Resolved value",
    finalLabel: "Final value:",
    resolvedText: "Resolved!",
    resolvingText: "Resolving...",
    brandLabel: "Active brand",
    descKey: "desc_en" as const,
  },
};

const UNRESOLVED_COLOR = "#94a3b8";

interface Props {
  lang?: Lang;
}

export function TokenResolution({ lang = "pt-br" }: Props) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeBrand, setActiveBrand] = useState<string>("tangerine");
  const t = translations[lang];

  const finalColor = BRAND_COLORS[activeBrand];
  const brandLabel = BRAND_LABELS[activeBrand];
  const steps = RESOLUTION_STEPS(brandLabel, finalColor);
  const isResolved = currentStep >= steps.length - 1;
  const previewColor = isResolved ? finalColor : UNRESOLVED_COLOR;

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setCurrentStep(step);
      if (step >= steps.length - 1) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 600);
  };

  const resetAnimation = () => {
    setCurrentStep(-1);
    setIsAnimating(false);
  };

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
  };

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
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            {t.subtitle}
          </p>
        </div>

        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          {/* Brand selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap" as const,
            }}
          >
            <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", fontWeight: 500 }}>
              {t.brandLabel}:
            </span>
            {Object.entries(BRAND_LABELS).map(([key, label]) => {
              const isActive = activeBrand === key;
              const color = BRAND_COLORS[key];
              return (
                <button
                  key={key}
                  onClick={() => { setActiveBrand(key); resetAnimation(); }}
                  style={{
                    padding: "0.3rem 0.875rem",
                    borderRadius: "var(--radius-full)",
                    border: isActive ? `2px solid ${color}` : "1.5px solid var(--color-border)",
                    background: isActive ? `${color}15` : "transparent",
                    color: isActive ? color : "var(--color-text-muted)",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                  }}
                >
                  <span
                    style={{
                      width: "0.625rem",
                      height: "0.625rem",
                      borderRadius: "50%",
                      background: color,
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  {label}
                </button>
              );
            })}
          </div>

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
                      fontSize: "0.9375rem",
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
                      <Play size={13} />
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
                      <RotateCcw size={13} />
                      {t.resetBtn}
                    </button>
                  </div>
                </div>

                {/* Steps */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {steps.map((step, idx) => {
                    const isActive = currentStep >= idx;
                    const isFinal = idx === steps.length - 1;
                    const layerColor = LAYER_COLORS[step.layer];
                    const desc = step[t.descKey];
                    return (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.75rem",
                          padding: "0.75rem 0.875rem",
                          borderRadius: "var(--radius)",
                          border: isActive
                            ? `1.5px solid ${layerColor}44`
                            : "1.5px solid transparent",
                          background: isActive ? `${layerColor}08` : "var(--color-bg-subtle)",
                          transition: "all 0.35s ease",
                        }}
                      >
                        {/* Layer color dot */}
                        <div
                          style={{
                            width: "1.625rem",
                            height: "1.625rem",
                            borderRadius: "50%",
                            background: isActive ? layerColor : "var(--color-border)",
                            color: isActive ? "#fff" : "var(--color-text-muted)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "0.6875rem",
                            flexShrink: 0,
                            marginTop: "0.1rem",
                            transition: "background 0.35s",
                          }}
                        >
                          {idx + 1}
                        </div>

                        {/* Token path + desc */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.125rem" }}>
                            <span
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.6875rem",
                                fontWeight: 700,
                                padding: "0.1rem 0.375rem",
                                borderRadius: "4px",
                                background: isActive ? `${layerColor}15` : "transparent",
                                color: isActive ? layerColor : "var(--color-text-muted)",
                                transition: "all 0.35s",
                              }}
                            >
                              {step.layer}
                            </span>
                          </div>
                          <div
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              color: isActive ? "var(--color-text)" : "var(--color-text-muted)",
                              whiteSpace: "pre",
                              lineHeight: 1.5,
                            }}
                          >
                            {step.token}
                          </div>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--color-text-muted)",
                              marginTop: "0.125rem",
                            }}
                          >
                            {desc}
                          </div>
                        </div>

                        {/* Arrow + Value */}
                        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem", paddingTop: "0.25rem" }}>
                          <ArrowRight
                            size={13}
                            style={{
                              color: isActive ? layerColor : "var(--color-border)",
                              transition: "color 0.35s",
                            }}
                          />
                          <div
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.65rem",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "var(--radius-full)",
                              background: isActive
                                ? isFinal ? layerColor : `${layerColor}18`
                                : "var(--color-border)",
                              color: isActive
                                ? isFinal ? "#fff" : layerColor
                                : "var(--color-text-muted)",
                              maxWidth: "8rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              transition: "background 0.35s, color 0.35s",
                              fontWeight: isFinal && isActive ? 700 : 400,
                            }}
                            title={step.value}
                          >
                            {step.value}
                          </div>
                        </div>
                      </div>
                    );
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
                      fontWeight: 700,
                      color: isResolved ? finalColor : "var(--color-text-muted)",
                      transition: "color 0.4s",
                    }}
                  >
                    {isResolved ? finalColor : "var(--resolving)"}
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
  );
}